const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const Auth = require('../controllers/AuthController');
const validate = require('../middlewares/ValidateMiddleware');
const Password = require('../controllers/PasswordController');
router.get('/', (req, res, next) => {
    res.status(200).json({message: "Đăng ký hoặc đăng nhập để kiểm tra xác thực."})
});

router.post('/register',
    // check("email").isEmail().withMessage("Nhập địa chỉ email hợp lệ."),
    // check("password").isLength({min: 8}).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/).withMessage("Mật khẩu không nên rỗng, 8 ký tự tối thiểu, ít nhất một chữ cái, một số và một ký tự đặc biệt."),
    // check("firstName").not().isEmpty().withMessage("firstName là bắt buộc."),
    // check("lastName").not().isEmpty().withMessage("lastName là bắt buộc."),
    // check("birthday").not().isEmpty().withMessage("birthday là bắt buộc."),
    // check("sex").not().isEmpty().withMessage("sex là bắt buộc."),
    validate, Auth.register);

router.post('/login',
    // check("email").isEmail().withMessage("Nhập địa chỉ email hợp lệ."),
    // check("password").not().isEmpty()
    validate, Auth.login);

//EMAIL Verification
router.get('/verify/:token', Auth.verify);
router.post('/resend', Auth.resendToken);

//Password RESET
router.post('/recover', validate, Password.recover);

router.get('/reset/:token', Password.reset);

router.post('/reset/:token', validate, Password.resetPassword);

router.post('/facebook/:id', Auth.facebook);
module.exports = router;
