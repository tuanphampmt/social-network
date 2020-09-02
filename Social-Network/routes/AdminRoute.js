const express = require('express');

const Admin = require('../controllers/AdminController');

const router = express.Router();


router.get('/showUsers', Admin.showUsers);
router.get('/getStats', Admin.getStats);
router.post('/userAccountLock/:userId', Admin.userAccountLock);
router.post('/changePermissions/:userId', Admin.changePermissions);
router.post('/removeUser/:userId', Admin.removeUser);
router.get('/showPosts', Admin.showPosts);
router.post('/removePost/:postId', Admin.removePost);

module.exports = router;
