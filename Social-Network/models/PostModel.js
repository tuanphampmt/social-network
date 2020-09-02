const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    quotes: {
        type: String
    },
    like: {
        type: Number,
        default: 0
    },
    dislike: {
        type: Number,
        default: 0
    },
    postImg: String,

    liked: [{type: mongoose.Schema.Types.ObjectId}],
    disliked: [{type: mongoose.Schema.Types.ObjectId}],
    comments: [{type: mongoose.Schema.Types.ObjectId}],

    createdAt: {type: Date, default: Date.now}
}, {collection: 'posts'});


module.exports = mongoose.model('posts', PostSchema);
