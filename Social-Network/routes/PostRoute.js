const express = require('express');

const Post = require('../controllers/PostController');


const router = express.Router();

router.get('/showPosts', Post.showPosts);
router.post('/addPost', Post.addPost);
router.post('/uploadProfileImg', Post.uploadProfileImg);
router.post('/upLoadCoverImages', Post.upLoadCoverImages);
router.put('/like/:postID/:isCheckPull', Post.like);
router.put('/dislike/:postID/:isCheckPull', Post.dislike);
router.delete('/removePost/:postID', Post.removePost);
router.put('/editPost/:postId', Post.editPost);

module.exports = router;
