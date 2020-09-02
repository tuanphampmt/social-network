require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
// const session = require('express-session');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(passport.initialize());



//Heroku

if (process.env.NODE_ENV === 'production') {
    app.use(express.static("client/build"));
    app.get(/^\/(?!api).*/, (req, res) => { // don't serve api routes to react app
        res.sendFile(path.join(__dirname, './client/build/index.html'));
    });
    console.log('Serving React App...');
}
// Connect MongoDB
mongoose.promise = global.Promise;
mongoose.connect(
    'mongodb+srv://tuanpham31798:' + process.env.MONGODB_ATLS_PW + '@tuanpham31798-zt6uf.mongodb.net/' + process.env.MONGODB_ATLS_DATABASE + '?retryWrites=true&w=majority', {
        keepAlive: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
const connection = mongoose.connection;
connection.once('open', () => console.log('MongoDB --  Kết nối cơ sở dữ liệu thành công!'));
connection.on('error', (err) => {
    console.log("MongoDB lỗi kết nối. Hãy đảm bảo rằng mongodb đang chạy. " + err);
    process.exit();
});
//=== 3 - INITIALIZE PASSPORT MIDDLEWARE



require("./middlewares/JwtMiddleware.js")(passport);

//Configure Route
require('./routes/IndexRoute')(app);


module.exports = app;

