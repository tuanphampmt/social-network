const Notification = require('../models/NotificationModel.js');
exports.getByIdAndLimit = async (req, res, next) => {
    try {
        let data = await Notification.model.aggregate()
            .match({receiverId: req.user._id})
            .lookup({
                from: "users",
                localField: "senderId",
                foreignField: "_id",
                as: "user",
            })
            .project({
                _id: 0,
                isRead: 1,
                notificationId: 1,
                createdAt: 1,
                type: 1,
                user: 1
            })
            .sort({createdAt: -1}).limit(4);
        if (!data.length) return res.status(401).json({message: "Fail!"});
        data = data.map(dt => {
            dt.user[0] = currentUser(dt.user[0]);
            return dt;
        });

        res.status(200).json({notifications: data});
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
