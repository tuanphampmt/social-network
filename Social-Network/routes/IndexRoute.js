// const index = require('./index');
const auth = require('../routes/AuthRoute');
const userRoute = require('../routes/UserRoute');
const postRoute = require('../routes/PostRoute');
const messageRoute = require('./MessageRoute');
const commentRoute = require('../routes/CommentRoute');
const adminRoute = require('../routes/AdminRoute');
const authenticate = require('../middlewares/AuthMiddleware.js');
const contactRoute = require('../routes/ContactRoute');
const notificationRoute = require('../routes/NotificationRoute');
module.exports = app => {
    app.get('/', (req, res) => {
        res.status(200).send({message: "Welcome to the AUTHENTICATION API. Register or Login to test Auth."});
    });
    app.use('/api/auth', auth);
    app.use('/api/user', authenticate, userRoute);
    app.use('/api/post', authenticate, postRoute);
    app.use('/api/message', authenticate, messageRoute);
    app.use('/api/comment', authenticate, commentRoute);
    app.use('/api/admin', authenticate, adminRoute);
    app.use('/api/contact', authenticate, contactRoute);
    app.use('/api/notification', authenticate, notificationRoute);


};
