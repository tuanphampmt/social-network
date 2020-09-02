const express = require('express');

const Contact = require('../controllers/ContactController.js');


const router = express.Router();

router.get('/', Contact.index);
router.post('/addFriend/:contactId', Contact.addFriend);
router.delete('/cancelRequest/:contactId/:notificationId', Contact.cancelRequest);
router.post('/confirmFriend', Contact.confirmFriend);
router.delete('/removeContact/:contactId', Contact.removeContact);
router.delete('/unFriend/:contactId', Contact.unFriend);
router.get('/getCountFriends', Contact.getCountFriends);
router.get('/getIsContact/:contactId', Contact.getIsContact);
router.get('/getIsAddFriend/:contactId', Contact.getIsAddFriend);



module.exports = router;
