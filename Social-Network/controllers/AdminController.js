const User = require('../models/UserModel.js');
const Post = require('../models/PostModel.js');
const Comment = require('../models/CommentModel');
const Stats = require('../models/StatsModel');
exports.showUsers = async function (req, res) {
    try {
        if (req.user.permissions === 3)
            return res.status(401).json({message: "Bạn không được quyền truy cập dữ liệu này!!!"});
        const users = await User.aggregate()
            .match({})
            .project({
                _id: 1,
                email: 1,
                firstName: 1,
                lastName: 1,
                sex: 1,
                birthday: 1,
                isVerified: 1,
                permissions: 1,
            });
        res.status(200).json({users: users});

    } catch (err) {
        res.status(500).json({message: err.message})
    }

};
exports.userAccountLock = async (req, res) => {
    try {
        const {permissions} = req.user;
        if (permissions === 1 && req.body.permissions === 1)
            return res.status(401).json({message: "Bạn không được quyền cập nhật dữ liệu này!!!"});
        if (permissions === 2 && (req.body.permissions === 1 || req.body.permissions === 2))
            return res.status(401).json({message: "Bạn không được quyền cập nhật dữ liệu này!!!"});
        await User.findByIdAndUpdate({_id: req.params.userId}, {$set: {isVerified: req.body.isVerified}}, {new: true});
        res.status(200).json({message: "Cập nhập dữ liệu thành công"})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
};
exports.changePermissions = async (req, res) => {
    try {
        const {permissions} = req.user;
        if (permissions === 1 && req.body.permissions === 1)
            return res.status(401).json({message: "Bạn không được quyền cập nhật dữ liệu này!!!"});
        if (permissions === 2)
            return res.status(401).json({message: "Bạn không được quyền cập nhật dữ liệu này!!!"});

        if (permissions === 1 && req.body.permissions === 2) {
            await User.findByIdAndUpdate({_id: req.params.userId}, {$set: {permissions: 3}}, {new: true});
            return res.status(200).json({message: "Cập nhập dữ liệu thành công."})
        }
        if (permissions === 1 && req.body.permissions === 3) {
            await User.findByIdAndUpdate({_id: req.params.userId}, {$set: {permissions: 2}}, {new: true});
            return res.status(200).json({message: "Cập nhập dữ liệu thành công."})
        }

    } catch (err) {
        res.status(500).json({message: err.message})
    }
};

exports.removeUser = async (req, res) => {
    try {
        const {permissions} = req.user;
        const user = await User.findById({_id: req.params.userId});

        if (permissions === 1 && req.body.permissions === 1)
            return res.status(401).json({message: "Bạn không được quyền xoá dữ liệu này!!!"});
        if (permissions === 2 && (req.body.permissions === 1 || req.body.permissions === 2))
            return res.status(401).json({message: "Bạn không được quyền xoá dữ liệu này!!!"});
        await User.findByIdAndDelete({_id: req.params.userId});
        if (user.posts) {
            await Promise.all(user.posts.map(async (id) => {
                const post = await Post.findOne({postId: id});
                if (post.comments) {
                    await Comment.deleteMany({
                        commentId: {
                            $in: post.comments
                        }
                    })
                }
            }));
            await Post.deleteMany({
                postId: {
                    $in: user.posts
                }
            });
        }
        const users = await User.find({});
        await Stats.updateOne({label: "New users"}, {$set: {value: (users.length).toString()}});

        return res.status(200).json({message: "Xoá dữ liệu thành công."});

    } catch (err) {
        res.status(500).json({message: err.message})
    }
};

exports.showPosts = async function (req, res) {
    try {
        if (req.user.permissions !== 1 && req.user.permissions !== 2) return res.status(401).json({message: "Bạn không được quyền truy cập dữ liệu này!!!"})
        const posts = await Post.aggregate()
            .match({})
            .project({
                _id: 0,
                like: 1,
                dislike: 1,
                postId: 1,
                userId: 1,
                quotes: 1,
                postImg: 1,
                createdAt: 1
            });
        res.status(200).json({posts: posts});

    } catch (err) {
        res.status(500).json({message: err.message})
    }

};

exports.removePost = async (req, res) => {
    try {
        const {permissions} = req.user;
        const user = await User.findById({_id: req.body.userId});

        if (permissions === 1 && user.permissions === 1)
            return res.status(401).json({message: "Bạn không được quyền xoá dữ liệu này!!!"});
        if (permissions === 2 &&
            (user.permissions === 1 || (user.permissions === 2 && req.body.userId.toString() !== req.user._id.toString())))
            return res.status(401).json({message: "Bạn không được quyền xoá dữ liệu này!!!"});

        const result = await Post.findOne({postId: req.params.postId});

        if (result.comments) {
            await Comment.deleteMany({
                commentId: {
                    $in: result.comments
                },
            });
        }
        await Post.deleteOne({postId: req.params.postId});

        await User.findByIdAndUpdate({_id: req.body.userId}, {$pull: {posts: req.params.postId}}, {new: true});

        const posts = await Post.find({});
        await Stats.updateOne({label: "Posts"}, {$set: {value: (posts.length).toString()}});

        return res.status(200).json({message: "Xoá dữ liệu thành công."});

    } catch (err) {
        res.status(500).json({message: err.message})
    }
};

exports.getStats = async function (req, res) {
    try {
        if (req.user.permissions === 3)
            return res.status(401).json({message: "Bạn không được quyền truy cập dữ liệu này!!!"});
        const stats = await Stats.find({});
        res.status(200).json({stats: stats});

    } catch (err) {
        res.status(500).json({message: err.message})
    }

};
