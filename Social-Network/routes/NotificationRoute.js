const express = require('express');

const Notification = require('../controllers/NotificationController.js');


const router = express.Router();


router.get('/getByIdAndLimit', Notification.getByIdAndLimit);


module.exports = router;
