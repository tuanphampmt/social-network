const User = require('../models/UserModel.js');

exports.index = async function (req, res) {
    try {
        const users = await User.aggregate()
            .match({_id: {$ne: req.user._id}})
            .project({
                _id: 1,
                isVerified: 1,
                email: 1,
                firstName: 1,
                lastName: 1,
                profileImage: 1,
                followQuantity: 1,
                messages: 1,
            });
        res.status(200).json({users: users});
    } catch (err) {
        res.status(500).json({message: err.message})
    }

};

exports.showUser = async function (req, res) {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) return res.status(401).json({message: 'User does not exist'});
        res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                birthday: user.birthday,
                sex: user.sex,
                profileImage: user.profileImage,
                coverImages: user.coverImages,
                followQuantity: user.followQuantity,
                phone: user.phone,
                religion: user.religion,
            }
        });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.updatePerDetail = async function (req, res) {
    try {
        const formData = req.body.formData;
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, {$set: formData}, {new: true});
        res.status(200).json({message: "Successfully"})

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        const user_id = req.user._id;

        //Make sure the passed id is that of the logged in user
        if (user_id.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to delete this data."});

        await User.findByIdAndDelete(id);
        res.status(200).json({message: 'User has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.showCurrentUser = async function (req, res) {
    try {
        const user = await User.findById({_id: req.user._id})

        res.status(200).json({currentUser: currentUser(user)})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.follow = async function (req, res) {
    try {
        const user = await User.findById(req.params.userID);

        const follow = user.follows.filter(id => id.toString() === req.params.friendID);
        if (follow.length !== 0) return res.status(401).json({message: "Người dùng này bạn đã follow"});
        await User.findByIdAndUpdate({_id: req.params.userID}, {$push: {follows: req.params.friendID}}, {new: true});
        await User.findByIdAndUpdate({_id: req.params.friendID}, {$set: {followQuantity: req.body.followQuantity}}, {new: true});

        res.status(200).json({message: "Follow thành công!"})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


function currentUser(user) {
    return {
        isVerified: user.isVerified,
        coverImages: user.coverImages,
        posts: user.posts,
        notifications: user.notifications,
        permissions: user.permissions,
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        sex: user.sex,
        createdAt: user.createdAt,
        profileImage: user.profileImage
    }
}
