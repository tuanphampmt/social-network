const express = require('express');

const User = require('../controllers/UserController');
const validate = require('../middlewares/ValidateMiddleware');

const router = express.Router();

//INDEX
router.get('/', User.index);
router.get('/showUser/:id', User.showUser);
router.put('/updatePerDetail', User.updatePerDetail);

// //STORE
// router.post('/', [
//     check('email').isEmail().withMessage('Enter a valid email address'),
//     check('username').not().isEmpty().withMessage('You username is required'),
//     check('firstName').not().isEmpty().withMessage('You first name is required'),
//     check('lastName').not().isEmpty().withMessage('You last name is required')
// ], validate, User.store);


router.put('/follow/:userID/:friendID', User.follow);

router.get('/showCurrentUser', User.showCurrentUser);

// //ADD FRIEND
// router.put('/friend/:friendID/:userID', User.friend);

module.exports = router;
