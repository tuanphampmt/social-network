const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    messageId: mongoose.Schema.Types.ObjectId,
    senderId: mongoose.Schema.Types.ObjectId,
    receiverId: mongoose.Schema.Types.ObjectId,
    conversationType: String,
    messageType: String,
    sender: {
        senderId: mongoose.Schema.Types.ObjectId,
        firstName: String,
        lastName: String,
        profileImg: String,
    },
    receiver: {
        receiverId: mongoose.Schema.Types.ObjectId,
        firstName: String,
        lastName: String,
        profileImg: String,
    },
    text: String,
    fileUrl: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    deletedAt: {type: Date, default: null},
}, {collection: "messages"});

const MESSAGE_CONVERSION_TYPE = {
    PERSONAL: "personal",
    GROUP: "group"
};

const MESSAGE_TYPES = {
    TEXT: "text",
    IMAGE: "image",
    FILE: "file"
};

module.exports = {
    model: mongoose.model("messages", MessageSchema),
    conversationType: MESSAGE_CONVERSION_TYPE,
    messageType: MESSAGE_TYPES
};
