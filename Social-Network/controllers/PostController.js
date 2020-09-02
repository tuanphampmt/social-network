const Post = require('../models/PostModel');
const User = require('../models/UserModel.js');
const Comment = require('../models/CommentModel.js');
const Stats = require('../models/StatsModel');
const Contact = require('../models/ContactModel');


exports.showPosts = async function (req, res) {
    try {
        const users = await User.find({});

        const postsUser = await User.aggregate([
            {
                $match: {_id: req.user._id}
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "posts",
                    foreignField: "postId",
                    as: "posts",
                }
            },
            {
                $unwind: "$posts"
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "posts.comments",
                    foreignField: "commentId",
                    as: "posts.comments",
                }
            },
            {
                $group: {
                    _id: "$_id",
                    posts: {
                        $addToSet: "$posts"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    posts: 1
                }
            }

        ]);
        const postsContact01 = await Contact.aggregate([
            {
                $match: {
                    $and: [
                        {userId: req.user._id},
                        {status: true}
                    ]
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "contactId",
                    foreignField: "_id",
                    as: "user",
                }
            },
            {
                $unwind: "$user"
            },

            {
                $lookup: {
                    from: "posts",
                    localField: "user.posts",
                    foreignField: "postId",
                    as: "user.posts"
                }
            },
            {
                $unwind: "$user.posts"
            },

            {
                $lookup: {
                    from: "comments",
                    localField: "user.posts.comments",
                    foreignField: "commentId",
                    as: "user.posts.comments",
                }
            },

            {
                $group: {
                    _id: "$_id",
                    user: {
                        $addToSet: "$user",
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    user: 1
                }
            }
        ]);

        const postsContact02 = await Contact.aggregate([
            {
                $match: {
                    $and: [
                        {contactId: req.user._id},
                        {status: true}
                    ]
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                }
            },
            {
                $unwind: "$user"
            },

            {
                $lookup: {
                    from: "posts",
                    localField: "user.posts",
                    foreignField: "postId",
                    as: "user.posts"
                }
            },
            {
                $unwind: "$user.posts"
            },

            {
                $lookup: {
                    from: "comments",
                    localField: "user.posts.comments",
                    foreignField: "commentId",
                    as: "user.posts.comments",
                }
            },

            {
                $group: {
                    _id: "$_id",
                    user: {
                        $addToSet: "$user",
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    user: 1
                }
            }
        ]);


        if (!postsUser[0] && !postsContact01[0] && !postsContact02[0]) return res.status(401).json({message: "no data"});

        if (!postsUser[0] && postsContact01[0] && !postsContact02[0]) {
            const data = sortCreatedAt([...getPostsContact([...postsContact01[0].user], users)]);
            return res.status(200).json({userPosts: data})
        }

        if (postsUser[0] && postsContact01[0] && !postsContact02[0]) {
            const data = sortCreatedAt([...getPostsContact([...postsUser[0].posts, ...postsContact01[0].user], users)]);
            return res.status(200).json({userPosts: data})
        }

        if (!postsUser.length && !postsContact01[0] && postsContact02[0]) {
            const data = sortCreatedAt([...getPostsContact([...postsContact02[0].user], users)]);
            return res.status(200).json({userPosts: data})
        }

        if (postsUser.length && !postsContact01[0] && postsContact02[0]) {
            const data = sortCreatedAt([...getPostsContact([...postsUser[0].posts, ...postsContact02[0].user], users)]);
            return res.status(200).json({userPosts: data})
        }

        if (!postsUser.length && postsContact01[0] && postsContact02[0]) {
            const data = sortCreatedAt([...getPostsContact([...postsContact01[0].user, ...postsContact02[0].user], users)]);
            return res.status(200).json({userPosts: data})
        }

        if (postsUser.length && !postsContact01[0] && !postsContact02[0]) {
            const data = sortCreatedAt([...getPostsContact([...postsUser[0].posts], users)]);
            return res.status(200).json({userPosts: data})
        }

        const data = sortCreatedAt([...getPostsContact([...postsUser[0].posts, ...postsContact01[0].user, ...postsContact02[0].user], users)]);
        return res.status(200).json({userPosts: data})

    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }

};


// exports.showPosts = async function (req, res) {
//     try {
//         let data = [], arr = [], arrComment = [];
//         const users = await User.find({});
//
//         const arrPostsOfUser = await User.aggregate([
//             {
//                 $match: {_id: req.user._id}
//             },
//             {
//                 $lookup: {
//                     from: "posts",
//                     localField: "posts",
//                     foreignField: "postId",
//                     as: "posts",
//                 }
//             },
//             {
//                 $unwind: "$posts"
//             },
//             {
//                 $lookup: {
//                     from: "comments",
//                     localField: "posts.comments",
//                     foreignField: "commentId",
//                     as: "posts.comments",
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$_id",
//                     posts: {
//                         $addToSet: "$posts"
//                     }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     posts: 1
//                 }
//             }
//
//         ]);
//
//         const arrFollowsOfUser = await User.aggregate([
//             {
//                 $match: {_id: req.user._id}
//             },
//
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "follows",
//                     foreignField: "_id",
//                     as: "follows",
//                 }
//             },
//             {
//                 $unwind: "$follows"
//             },
//
//             {
//                 $lookup: {
//                     from: "posts",
//                     localField: "follows.posts",
//                     foreignField: "postId",
//                     as: "follows.posts"
//                 }
//             },
//             {
//                 $unwind: "$follows.posts"
//             },
//
//             {
//                 $lookup: {
//                     from: "comments",
//                     localField: "follows.posts.comments",
//                     foreignField: "commentId",
//                     as: "follows.posts.comments",
//                 }
//             },
//
//             {
//                 $group: {
//                     _id: "$_id",
//                     follows: {
//                         $addToSet: "$follows",
//                     }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     follows: 1
//                 }
//             }
//         ]);
//
//
//         if (!arrPostsOfUser[0] && !arrFollowsOfUser[0]) return res.status(401).json({message: "no data"});
//         if (!arrPostsOfUser[0] && arrFollowsOfUser[0]) {
//             arrFollowsOfUser[0].follows.forEach(value => arr.push(value.posts));
//             const posts = [...arr].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//             posts.forEach(post => {
//                 const u = users.find(user => user._id.toString() === post.userId.toString());
//                 data.push({
//                     ...post,
//                     firstName: u.firstName,
//                     lastName: u.lastName,
//                     profileImage: u.profileImage
//                 });
//                 return arr
//             });
//             return res.status(200).json({userPosts: data})
//         }
//         if (arrPostsOfUser[0] && !arrFollowsOfUser[0]) {
//             const posts = [...arrPostsOfUser[0].posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//             posts.forEach(post => {
//                 const u = users.find(user => user._id.toString() === post.userId.toString());
//                 data.push({
//                     ...post,
//                     firstName: u.firstName,
//                     lastName: u.lastName,
//                     profileImage: u.profileImage
//                 });
//                 return arr
//             });
//             return res.status(200).json({userPosts: data})
//         }
//
//         arrFollowsOfUser[0].follows.forEach(value => arr.push(value.posts));
//         const posts = [...arrPostsOfUser[0].posts, ...arr].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         posts.forEach(post => {
//             const u = users.find(user => user._id.toString() === post.userId.toString());
//             data.push({
//                 ...post,
//                 firstName: u.firstName,
//                 lastName: u.lastName,
//                 profileImage: u.profileImage
//             });
//             return arr
//         });
//         return res.status(200).json({userPosts: data})
//
//     } catch (err) {
//         res.status(500).json({success: false, message: err.message});
//     }
//
// };


exports.addPost = async function (req, res) {
    try {


        const newPost = new Post({
            postId: req.body.postId,
            userId: req.user._id,
            quotes: req.body.quotes,
            postImg: req.body.url,
            createdAt: Date.now(),
        });
        const _newPost = await newPost.save();

        await User.findByIdAndUpdate({_id: req.user._id}, {$push: {posts: _newPost.postId}}, {new: true});

        const posts = await Post.find({});
        await Stats.updateOne({label: "Posts"}, {$set: {value: (posts.length).toString()}});

        // // await User.findByIdAndUpdate({_id: req.user._id}, {
        // //     $push: {
        // //         posts: {
        // //             $each: [_post._id],
        // //             $position: 0
        // //         },
        // //     }
        // // }, {new: true}) => the vao vi tri dau tien
        res.status(200).json({message: "Successfully"})
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};
exports.uploadProfileImg = async function (req, res) {
    try {
        const user = await User.findByIdAndUpdate({_id: req.user._id}, {$set: {profileImage: req.body.url}}, {new: true});
        res.status(200).json({profileImage: user.profileImage})
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};
exports.upLoadCoverImages = async function (req, res) {
    try {
        // const user = await User.findByIdAndUpdate({_id: req.user._id}, {$push: {coverImages: req.body.url}}, {new: true});
        const user = await User.findByIdAndUpdate({_id: req.user._id}, {
            $push: {
                coverImages: {
                    $each: [req.body.url],
                    $position: 0
                },
            }
        }, {new: true})
        res.status(200).json({coverImages: user.coverImages})
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};


exports.like = async function (req, res) {
    try {
        let countLike = 0;
        if (req.params.isCheckPull === "notpull") {
            await Post.updateOne(
                {postId: req.params.postID},
                {
                    $set: req.body
                },
                {new: true}
            );
            const posts = await Post.find({});
            posts.map(post => {
                countLike = countLike + post.like;
            });
            await Stats.updateOne({label: "Likes"}, {$set: {value: (countLike).toString()}});
            return res.status(200).json({message: "Successfully"})
        }
        await Post.updateOne(
            {postId: req.params.postID},
            {
                $set: req.body,
                $push: {liked: req.user._id},
                $pull: {disliked: req.user._id}
            },
            {new: true}
        );
        const posts = await Post.find({});
        posts.map(post => {
            countLike = countLike + post.like;
        });
        await Stats.updateOne({label: "Likes"}, {$set: {value: (countLike).toString()}});

        res.status(200).json({message: "Successfully"})
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

exports.dislike = async function (req, res) {
    try {
        let countDisLike = 0;
        if (req.params.isCheckPull === "notpull") {
            await Post.updateOne(
                {postId: req.params.postID},
                {
                    $set: req.body
                },
                {new: true}
            );
            const posts = await Post.find({});
            posts.map(post => {
                countDisLike = countDisLike + post.dislike;
            });
            await Stats.updateOne({label: "Dislikes"}, {$set: {value: (countDisLike).toString()}});
            return res.status(200).json({message: "Successfully"})
        }
        await Post.updateOne(
            {postId: req.params.postID},
            {
                $set: req.body,
                $push: {disliked: req.user._id},
                $pull: {liked: req.user._id}
            },
            {new: true}
        );
        const posts = await Post.find({});
        posts.map(post => {
            countDisLike = countDisLike + post.dislike;
        });
        await Stats.updateOne({label: "Dislikes"}, {$set: {value: (countDisLike).toString()}});
        res.status(200).json({message: "Successfully"})
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};
exports.removePost = async function (req, res) {
    try {
        const result = await Post.find({postId: req.params.postID})

        if (result[0].comments) {
            await Comment.deleteMany({
                commentId: {
                    $in: result[0].comments
                },
            });
        }
        await Post.deleteOne({postId: req.params.postID});

        await User.findByIdAndUpdate({_id: req.user._id}, {$pull: {posts: req.params.postID}}, {new: true});
        // let commentIds = result.comments.map((c) => c._id);
        const posts = await Post.find({});
        await Stats.updateOne({label: "Posts"}, {$set: {value: (posts.length).toString()}});

        return res.status(200).json({message: "Successfully"})
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};
exports.editPost = async (req, res) => {
    try {
        if (req.body.url) {
            const update = {
                postImg: req.body.url,
                quotes: req.body.quotes,
            };
            await Post.updateOne({postId: req.params.postId}, {$set: update}, {new: true});
            return res.status(200).json({message: "Successfully"})
        } else {
            const update = {
                quotes: req.body.quotes,
            };
            await Post.updateOne({postId: req.params.postId}, {$set: update}, {new: true});
            return res.status(200).json({message: "Successfully"})
        }


    } catch (err) {
        res.status(500).json({success: false, message: err.message});

    }
};

function currentUser(user) {
    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        posts: user.posts,
    }
}

const getPostsContact = (postsContact, users) => {
    let data = [];
    postsContact.forEach(post => {
        if (post.userId) {
            let user = users.find(user => user._id.toString() === post.userId.toString());
            data.push({
                ...post,
                firstName: user.firstName,
                lastName: user.lastName,
                profileImage: user.profileImage
            });
        } else {
            let user = users.find(user => user._id.toString() === post.posts.userId.toString());
            data.push({
                ...post.posts,
                firstName: user.firstName,
                lastName: user.lastName,
                profileImage: user.profileImage
            });
        }
    });
    return data
};


const sortCreatedAt = (data) => {
    return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};
