const mongoose = require('mongoose');

const ChatGroupSchema = new mongoose.Schema({
    chatGroupId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    name: String,
    userAmount: {
        type: Number,
        min: 3,
        max: 177
    },
    messageAmount: {type: Number, default: 0},
    members: [{type: mongoose.Schema.Types.ObjectId}],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    deletedAt: {type: Date, default: null},
}, {collection: "chat-groups"});
module.exports = mongoose.model("chat-groups", ChatGroupSchema);
