const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    commentId: mongoose.Schema.Types.ObjectId,
    content: String,
    userId: mongoose.Schema.Types.ObjectId,
    createdAt: {type: Date, default: Date.now}
}, {collection: 'comments'});

module.exports = mongoose.model('comments', CommentSchema);
