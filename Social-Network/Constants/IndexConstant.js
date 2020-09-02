const auth = require('../routes/AuthRoute');
const userRoute = require('../routes/UserRoute');
const postRoute = require('../routes/PostRoute');
const chatRoute = require('../routes/MessageRoute');
const commentRoute = require('../routes/CommentRoute');
const adminRoute = require('../routes/AdminRoute');
const authenticate = require('../middlewares/AuthMiddleware.js');

module.exports = {
    AUTH: auth,
    USER_ROUTE: userRoute,
    POST_ROUTE: postRoute,
    CHAT_ROUTE: chatRoute,
    COMMENT_ROUTE: commentRoute,
    ADMIN_ROUTE: adminRoute,
    AUTHENTICATE: authenticate,
};

