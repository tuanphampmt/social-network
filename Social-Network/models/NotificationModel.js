const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    notificationId: mongoose.Schema.Types.ObjectId,
    senderId: mongoose.Schema.Types.ObjectId,
    receiverId: mongoose.Schema.Types.ObjectId,
    type: String,
    isRead: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now}
}, {collection: "notifications"});

const NOTIFICATION_TYPES = {
    ADD_FRIEND: "ADD_FRIEND",
    CANCEL_REQUEST: "CANCEL_REQUEST",
    CONFIRM_FRIEND: "CONFIRM_FRIEND"
};

module.exports = {
    model: mongoose.model("notifications", NotificationSchema),
    types: NOTIFICATION_TYPES
};
