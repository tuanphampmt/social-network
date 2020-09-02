const auth = require('../routes/AuthRoute');
const userRoute = require('../routes/UserRoute');
const postRoute = require('../routes/PostRoute');
const chatRoute = require('./MessageRoute');
const commentRoute = require('../routes/CommentRoute');
const adminRoute = require('../routes/AdminRoute');
const authenticate = require('../middlewares/AuthMiddleware.js');
const contactRoute = require('../routes/ContactRoute');
module.exports = {
    auth: auth,
    userRoute: userRoute,
    postRoute: postRoute,
    chatRoute: chatRoute,
    commentRoute: commentRoute,
    adminRoute: adminRoute,
    authenticate: authenticate,
    contactRoute: contactRoute,
};

