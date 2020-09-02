const Comment = require('../models/CommentModel');
const Post = require('../models/PostModel');
const Stats = require('../models/StatsModel');

exports.comment = async (req, res) => {
    try {


        const newComment = new Comment({
            commentId: req.body.commentId,
            content: req.body.content,
            userId: req.user._id,
            createdAt: Date.now()
        });
        const _newComment = await newComment.save();
        await Post.updateOne({postId: req.params.postId}, {$push: {comments: _newComment.commentId}}, {new: true});
        const comments = await Comment.find({});
        await Stats.updateOne({label: "Comments"}, {$set: {value: (comments.length).toString()}});

        return res.status(200).json({message: "Successfully"})
    } catch (err) {

    }

};


exports.removeComment = async function (req, res) {
    try {

        await Comment.deleteOne({commentId: req.params.commentId});

        await Post.updateOne({postId: req.params.postId}, {$pull: {comments: req.params.commentId}}, {new: true});
        // let commentIds = result.comments.map((c) => c._id);
        const comments = await Comment.find({});
        await Stats.updateOne({label: "Comments"}, {$set: {value: (comments.length).toString()}});

        return res.status(200).json({message: "Successfully"})
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

exports.editComment = async function (req, res) {
    try {

        await Comment.updateOne({commentId: req.params.commentId}, {$set: req.body}, {new: true});

        return res.status(200).json({message: "Successfully"})
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};
