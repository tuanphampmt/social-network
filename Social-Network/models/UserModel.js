const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Token = require('../models/TokenModel');

const UserSchema = new mongoose.Schema({
    email : { type: String},

    password: {
        type: String,
    },

    firstName: {
        type: String,
    },

    lastName: {
        type: String,
    },
    birthday: {
        type: Date,
    },
    sex: {
        type: Boolean,
    },
    phone: String,
    religion: String,
    profileImage: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },

    coverImages: Array,

    posts: [{type: mongoose.Schema.Types.ObjectId}],

    resetPasswordToken: {type: String,},

    resetPasswordExpires: {
        type: Date
    },

    permissions: {
        type: Number,
        default: 3
    },

    createdAt: {type: Date, default: Date.now}
}, {timestamps: true, collection: "users"});


UserSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    let payload = {
        id: this._id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        profileImage: this.profileImage,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    });
};

UserSchema.methods.generatePasswordReset = function () {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

UserSchema.methods.generateVerificationToken = function () {
    let payload = {
        userId: this._id,
        token: crypto.randomBytes(20).toString('hex')
    };

    return new Token(payload);
};

module.exports = mongoose.model('Users', UserSchema);

