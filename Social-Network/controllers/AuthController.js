const User = require('../models/UserModel.js');
const Token = require('../models/TokenModel');
const Stats = require('../models/StatsModel');
const {sendEmail} = require('../utils/IndexUtil');


exports.facebook = async (req, res, next) => {
    try {

        const user = await User.findOne({"facebook.id": req.params.id});
        if (user) {
            return res.status(200).json({token: user.generateJWT(), user: user});
        }
        const newUser = new User({
            isVerified: true,
            facebook: {
                id: req.params.id,
                email: req.body.email,
                name: req.body.name,
            }
        });

        const _user = await newUser.save();
        return res.status(200).json({token: _user.generateJWT(), user: _user});

    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};


// Đăng ký
exports.register = async (req, res, next) => {
    try {

        const {email} = req.body;
        const user = await User.findOne({email});

        if (user) return res.status(401).json({
            message: "Địa chỉ email bạn đã nhập đã được liên kết với tài khoản khác"
        });

        const newUser = new User(req.body);


        const user_ = await newUser.save();
        const users = await User.find({});
        await Stats.updateOne({label: "New users"}, {$set: {value: (users.length).toString()}});

        await sendVerificationEmail(user_, req, res);
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

// Đăng nhập
exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if (!user) return res.status(401).json({
            message: "Địa chỉ email " + email + " không liên quan đến bất kỳ tài khoản nào. Kiểm tra lại địa chỉ email và thử lại."
        });
        if (!user.comparePassword(password)) return res.status(401).json({
            message: "Mật khẩu không hợp lệ."
        });

        if (!user.isVerified) return res.status(401).json({
            type: 'not-verified',
            message: 'Tài khoản của bạn chưa được xác minh.'
        });
        console.log(user)
        await res.status(200).json({token: user.generateJWT(), user: currentUser(user)});
    } catch (err) {
        res.status(500).json({error: err.success});
    }
};

exports.verify = async (req, res) => {

    try {
        if (!req.params.token) return res.json({message: "Chúng tôi không thể tìm thấy người dùng cho mã token này."});

        const token = await Token.findOne({token: req.params.token});
        const user = await User.findOne({_id: token.userId});

        if (!token) return res.status(401).json({message: 'Chúng tôi không thể tìm thấy mã token hợp lệ. Mã của bạn đã hết hạn.'});

        if (!user) return res.status(401).json({message: 'Chúng tôi không thể tìm thấy người dùng cho mã token này.'});

        if (user.isVerified) return res.status(401).json({message: 'Người dùng này đã được xác minh.'});

        user.isVerified = true;
        user.save(function (err) {
            if (err) return res.status(500).json({message: err.success});

            res.status(200).json({message: "Tài khoản đã được xác minh. Vui lòng đăng nhập."});
        });

    } catch (error) {
        res.status(500).json({message: error.success})
    }
};


exports.resendToken = async (req, res) => {
    try {
        const {email} = req.body;

        const user = await User.findOne({email});

        if (!user) return res.status(401).json({
            message: 'Địa chỉ email ' + email + ' không liên quan đến bất kỳ tài khoản nào. Kiểm tra lại địa chỉ email và thử lại.'
        });

        if (user.isVerified) return res.status(401).json({
            message: 'Tài khoản này đã được xác minh từ trước. Vui lòng đăng nhập.'
        });

        await sendVerificationEmail(user, req, res);
    } catch (error) {
        res.status(500).json({message: error.success})
    }
};

async function sendVerificationEmail(user, req, res) {
    try {
        const token = user.generateVerificationToken();
        await token.save();

        let link = "https://localhost:4000/api/auth/verify/" + token.token;
        // let link = "https://tuanpham-social-network.herokuapp.com/api/auth/verify/" + token.token;
        let html = `<div
                        style="
                        background-color: #f8f8f8;
                        width: 700px;
                        height: 500px;
                        padding: 10px;
                      "
                    >
                      <h1
                        style="
                          color: #4e9761;
                          margin-left: 100px;
                        "
                      >
                        Pi Group
                      </h1>
                      <div
                        style="
                          width: 100%;
                          height: 100%;
                          display: flex;
                        "
                      >
                        <div style="width: 500px; height: 330px; background-color: #fff; margin-left: 100px">
                          <p style="color: #6c757d; margin-left: 40px;">Hi, ${user.lastName} ${user.firstName}</p>
                          <p
                            style="
                              color: #6c757d;
                              margin: 40px 12px 50px 40px;
                            "
                          >
                            Thanks for creating your Pi Group account. To continue, please
                            verify your email address by clicking the button below.
                          </p>
                          <a
                            href="${link}"
                            style="
                              margin-top: 150px;
                              margin-left: 100px;
                              margin-right: 100px;
                              text-decoration: none;
                              font-weight: 400;
                              font-size: 19px;
                              text-align: center;
                              color: #fff;
                              background-color: #4e9761;
                              border-color: #4e9761;
                              padding: 15px 50px;
                            "
                          >Verify Email
                          </a>
                          <p
                            style="
                              color: #6c757d;
                              margin-left: 40px;
                              margin-right: 12px;
                              margin-top: 60px;
                            "
                          >
                          If you did not request this, please ignore this email.
                          </p>
                          <p
                            style="
                              color: #6c757d;
                              margin-left: 40px;
                              margin-right: 12px;
                              margin-top: 22px
                            "
                          >
                          __ The Pi Group Team
                          </p>
                        </div>
                      </div>
                    </div>`;
        let mainOptions = {
            to: user.email,
            from: process.env.FROM_EMAIL,
            subject: "MÃ XÁC THỰC TÀI KHOẢN",
            html: html
        };
        await sendEmail(mainOptions);
        await res.status(200).json({message: 'Thư email xác thực tài khoản đã được gửi đến ' + user.email});
    } catch (error) {
        res.status(500).json({message: error.success})
    }
}

function currentUser(user) {
    return {
        isVerified: user.isVerified,
        coverImages: user.coverImages,
        accept: user.accept,
        notAccepted: user.notAccepted,
        posts: user.posts,
        notifications: user.notifications,
        permissions: user.permissions,
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthday: user.birthday,
        sex: user.sex,
        createdAt: user.createdAt,
        profileImage: user.profileImage
    }
}
