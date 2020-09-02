const express = require('express');

const Comment = require('../controllers/CommentController');


const router = express.Router();

router.post('/comment/:postId', Comment.comment);
router.delete('/removeComment/:commentId/:postId', Comment.removeComment);
router.put('/editComment/:commentId', Comment.editComment);

module.exports = router;
