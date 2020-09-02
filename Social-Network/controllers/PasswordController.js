const User = require('../models/UserModel.js');
const {sendEmail} = require('../utils/IndexUtil');

exports.recover = async (req, res) => {
    try {
        const {email} = req.body;

        const user = await User.findOne({email});

        if (!user) return res.status(401).json({message: 'Địa chỉ email ' + email + ' không liên quan đến bất kỳ tài khoản nào. Kiểm tra lại địa chỉ email và thử lại.'});

        user.generatePasswordReset();
        const user_ = await user.save();
        await sendEmailResetPassword(user_, req, res);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.reset = async (req, res) => {
    try {
        const {token} = req.params;

        const user = await User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}});

        if (!user) return res.status(401).json({message: 'Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.'});

        // res.render("reset", {user})
        res.status(200).json({isReset: true})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const {token} = req.params;

        const user = await User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}});

        if (!user) return res.status(401).json({message: 'Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.'});

        //Set the new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.isVerified = true;

        // Save the updated user object
        await user.save();

        let subject = "Mật khẩu của bạn đã bị thay đổi";
        let to = user.email;
        let from = process.env.FROM_EMAIL;
        let html = `<p>Chào ${user.lastName} ${user.firstName}</p>
                    <p>Đây là thư xác nhận mật khẩu cho tài khoản ${user.email} đã thay đổi .</p>`

        await sendEmail({to, from, subject, html});

        res.status(200).json({message: 'Mật khẩu của bạn đã được cập nhật.'});

    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

async function sendEmailResetPassword(user, req, res) {
    try {

        let link = "https://localhost:3000/reset/" + user.resetPasswordToken;
        // let link = "https://tuanpham-social-network.herokuapp.com/reset/" + user.resetPasswordToken;
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
                            Thank you for being with Pi group. To continue, Please clicking the button below to reset your password.
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
                          >Reset Your Password
                          </a>
                          <p
                            style="
                              color: #6c757d;
                              margin-left: 40px;
                              margin-right: 12px;
                              margin-top: 60px;
                            "
                          >
                          If you did not request this, please ignore this email and your password will remain unchanged.
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
            subject: "YÊU CẦU THAY ĐỔI MẬT KHẨU",
            html: html
        };
        await sendEmail(mainOptions);
        res.status(200).json({message: 'Thư email đặt lại mật khẩu đã được gửi đến ' + user.email + '. Bạn vui lòng kiểm tra email để đặt lại mật khẩu của mình.'});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
