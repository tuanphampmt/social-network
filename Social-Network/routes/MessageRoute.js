const express = require('express');

const Message = require('../controllers/MessageController');


const router = express.Router();


router.get('/getContactsByStatusIsTrue', Message.getContactsByStatusIsTrue);
router.post('/addMessage', Message.addMessage);
router.post('/changeIsRead/:messageId', Message.changeIsRead);

module.exports = router;
