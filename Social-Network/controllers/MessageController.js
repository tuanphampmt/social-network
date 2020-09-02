const Message = require('../models/MessageModel');
const Contact = require('../models/ContactModel');
const ChatGroup = require('../models/ChatGroupModel');
exports.getContactsByStatusIsTrue = async (req, res, next) => {
    try {
        const contacts01 = await Contact.aggregate()
            .match({
                $and: [
                    {contactId: req.user._id},
                    {status: true}
                ]
            })
            .lookup({
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
            })
            .sort({updatedAt: -1}).limit(5);

        const contacts02 = await Contact.aggregate()
            .match({
                $and: [
                    {userId: req.user._id},
                    {status: true}
                ]
            })
            .lookup({
                from: "users",
                localField: "contactId",
                foreignField: "_id",
                as: "user",
            })
            .sort({updatedAt: -1}).limit(5);

        const chatGroups = await ChatGroup.find({members: {$in: [req.user._id]}});
        if (!contacts01[0] && !contacts02[0]) {
            const data = sortCreatedAt([...chatGroups]);
            return res.status(200).json({contacts: await getMessages(req, data, Message)});
        }

        if (contacts01[0] && !contacts02[0]) {
            const data = sortCreatedAt([...getContacts([...contacts01]), ...chatGroups]);
            return res.status(200).json({contacts: await getMessages(req, data, Message)});
        }

        if (!contacts01[0] && contacts02[0]) {
            const data = sortCreatedAt([...getContacts([...contacts02]), ...chatGroups]);
            return res.status(200).json({contacts: await getMessages(req, data, Message)});
        }

        const data = sortCreatedAt([...getContacts([...contacts01, ...contacts02]), ...chatGroups]);


        res.status(200).json({contacts: sortCreatedAt(await getMessages(req, data, Message))});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};


exports.addMessage = async (req, res, next) => {
    try {
        const newMessage = new Message.model(req.body.message);
        await newMessage.save();
        if (req.body.message.conversationType === Message.conversationType.GROUP) {
            await ChatGroup.updateOne({chatGroupId: req.body.message.receiverId}, {
                $set: {
                    messageAmount: req.body.messageAmount + 1,
                    updatedAt: Date.now()
                }
            })
        } else {
            await Contact.updateOne({
                $or: [
                    {
                        $and: [
                            {userId: req.body.message.senderId},
                            {contactId: req.body.message.receiverId}
                        ]
                    },
                    {
                        $and: [
                            {userId: req.body.message.receiverId},
                            {contactId: req.body.message.senderId}
                        ]
                    }
                ]
            }, {$set: {updatedAt: Date.now()}})
        }
        res.status(200).json({contacts: 'Successfully'});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

exports.changeIsRead = async (req, res, next) => {
    try {
        await Message.model.updateOne({messageId: req.params.messageId}, {$set: {isRead: true}});
        res.status(200).json({contacts: 'Successfully'});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

const getContacts = (data) => {
    return data.map(contact => {
        contact.user[0] = currentUser(contact.user[0]);
        return contact
    })
};
const sortCreatedAt = (data) => {
    return data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
};
const getMessages = async (req, data, MessageModel) => {
    return await Promise.all(data.map(async item => {
        if (!item.members) {
            item.messages = await MessageModel.model.find({
                $or: [
                    {
                        $and: [
                            {senderId: req.user._id},
                            {receiverId: item.user[0]._id}
                        ]
                    },
                    {
                        $and: [
                            {receiverId: req.user._id},
                            {senderId: item.user[0]._id}
                        ]
                    }
                ]
            }).sort({createdAt: 1});
            return item;
        } else {
            item = item.toObject();
            item.messages = await MessageModel.model.find({receiverId: item.chatGroupId}).sort({createdAt: 1});

            return item;
        }
    }));
};

function currentUser(user) {
    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        email: user.email
    }
}
