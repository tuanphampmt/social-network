const Contact = require('../models/ContactModel');
const User = require('../models/UserModel.js');
const Notification = require('../models/NotificationModel.js');
const ChatGroup = require('../models/ChatGroupModel');
exports.index = async (req, res, next) => {
    try {
        const contacts = await Contact
            .aggregate()
            .match({
                $or: [
                    {contactId: req.user._id},
                    {userId: req.user._id}
                ]
            })
            .lookup({
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
            })
            .sort({createdAt: -1});
        if (!contacts.length) return res.status(401).json({message: "Fail!"});
        contacts.map(ct => {
            ct.user[0] = currentUser(ct.user[0]);
            return ct
        });
        res.status(200).json({contacts: contacts})
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

exports.addFriend = async (req, res, next) => {
    try {
        const contact = await Contact.findOne({
            $or: [
                {
                    $and: [
                        {userId: req.user._id},
                        {contactId: req.params.contactId}
                    ]
                },
                {
                    $and: [
                        {userId: req.params.contactId},
                        {contactId: req.user._id}
                    ]
                }
            ]
        });
        if (contact) return res.status(401).json({message: "Fail!"});
        await Notification.model.deleteOne({
            $and: [
                {senderId: req.user._id},
                {receiverId: req.params.contactId},
                {type: Notification.types.CANCEL_REQUEST}
            ]
        });

        const newContact = new Contact({
            userId: req.user._id,
            contactId: req.params.contactId
        });

        await newContact.save();


        const newNotification = new Notification.model({
            notificationId: req.body.notificationId,
            senderId: req.user._id,
            receiverId: req.params.contactId,
            type: Notification.types.ADD_FRIEND
        });
        await newNotification.save();

        res.status(200).json({message: "Successfully"})
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};


exports.cancelRequest = async (req, res, next) => {
    try {
        await Contact.deleteOne({
            $and: [
                {userId: req.user._id},
                {contactId: req.params.contactId}
            ]
        });

        await Notification.model.deleteOne({
            $and: [
                {senderId: req.user._id},
                {receiverId: req.params.contactId},
                {type: Notification.types.ADD_FRIEND}
            ]
        });


        const newNotification = new Notification.model({
            notificationId: req.params.notificationId,
            senderId: req.user._id,
            receiverId: req.params.contactId,
            type: Notification.types.CANCEL_REQUEST
        });
        await newNotification.save();

        res.status(200).json({message: "Successfully"})
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

exports.confirmFriend = async (req, res, next) => {
    try {
        await Contact.updateOne({
            $and: [
                {userId: req.body.senderId},
                {contactId: req.body.receiverId}
            ]
        }, {$set: {status: true, updatedAt: Date.now()}});
        await Notification.model.deleteOne({
            $and: [
                {senderId: req.body.senderId},
                {receiverId: req.body.receiverId},
                {type: Notification.types.ADD_FRIEND}
            ]
        });

        const newNotification = new Notification.model({
            notificationId: req.body.notificationId,
            senderId: req.body.receiverId,
            receiverId: req.body.senderId,
            type: Notification.types.CONFIRM_FRIEND
        });
        await newNotification.save();

        res.status(200).json({message: "Successfully"})
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};


exports.removeContact = async (req, res, next) => {
    try {
        await Contact.deleteOne({
            $and: [
                {userId: req.params.contactId},
                {contactId: req.user._id}
            ]
        });
        await Notification.model.deleteOne({
            $and: [
                {senderId: req.params.contactId},
                {receiverId: req.user._id},
                {type: Notification.types.ADD_FRIEND}
            ]
        });
        res.status(200).json({message: "Successfully"})
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

exports.unFriend = async (req, res, next) => {
    try {
        await Contact.deleteOne({
            $and: [
                {userId: req.user._id},
                {contactId: req.params.contactId},
                {status: true}
            ]
        });
        await Notification.model.deleteOne({
            $and: [
                {senderId: req.params.contactId},
                {receiverId: req.user._id},
                {type: Notification.types.CONFIRM_FRIEND}
            ]
        });
        res.status(200).json({message: "Successfully"})
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

exports.getCountFriends = async (req, res, next) => {
    try {

        const contacts = await Contact.find({
            $and: [
                {userId: {$ne: req.user._id}},
                {status: false}
            ]
        });

        res.status(200).json({countFriends: contacts.length});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

exports.getIsContact = async (req, res, next) => {
    try {
        const contacts = await Contact.findOne({
            $or: [
                {
                    $and: [
                        {contactId: req.params.contactId},
                        {status: true}
                    ]
                },
                {
                    $and: [
                        {userId: req.params.contactId},
                        {status: true}
                    ]
                },
            ]
        });

        res.status(200).json({isContact: contacts});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};


exports.getIsAddFriend = async (req, res, next) => {
    try {

        const contacts = await Contact.findOne({
            $or: [
                {
                    $and: [
                        {contactId: req.params.contactId},
                        {status: false}
                    ]
                },
                {
                    $and: [
                        {userId: req.params.contactId},
                        {status: false}
                    ]
                },

            ]
        });
        res.status(200).json({isAddFriend: contacts});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};
function currentUser(user) {
    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage
    }
}
