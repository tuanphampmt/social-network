const User = require('../models/UserModel.js');


exports.addFriend = (io) => {
    const clients = {};
    io.on('connection', function (socket) {
        let userId;
        io.sockets.on('authenticated', (socket) => {
            userId = socket.decoded_token.id;
            if (clients[userId]) { // Đăng nhập, F5 nhiều lần
                clients[userId].push(socket.id);
                clients[userId] = duplicate(clients[userId])
            } else { // Dang nhap lan dau
                clients[userId] = [socket.id]
            }
        });

        socket.on("add-friend", async (data) => {
            const user = await User.findById({_id: socket.decoded_token.id});
            const dataRequest = {
                notificationId: data.notificationId,
                isRead: false,
                createdAt: Date.now,
                type: data.type,
                user: [{
                    _id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profileImage: user.profileImage
                }]
            };

            if (clients[data.contactId]) {
                clients[data.contactId].map(socketId => {
                    socket.to(socketId).emit("request-add-friend", dataRequest)
                })
            }
        });


        socket.on("cancel-request", async (data) => {
            const user = await User.findById({_id: socket.decoded_token.id});
            const dataRequest = {
                notifications: data.notificationId,
                isRead: false,
                createdAt: Date.now,
                senderId: user._id,
                receiverId: data.contactId,
                type: data.type,
                user: [{
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profileImage: user.profileImage
                }]
            };

            if (clients[data.contactId]) {
                clients[data.contactId].map(socketId => {
                    socket.to(socketId).emit("emit-cancel-request", dataRequest)
                })
            }
        });

        socket.on("confirm-friend", async (data) => {
            const user = await User.findById({_id: socket.decoded_token.id});
            const dataRequest = {
                notifications: data.notificationId,
                isRead: false,
                createdAt: Date.now,
                senderId: user._id,
                receiverId: data.contactId,
                type: data.type,
                user: [{
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profileImage: user.profileImage
                }]
            };

            if (clients[data.contactId]) {
                clients[data.contactId].map(socketId => {
                    socket.to(socketId).emit("request-confirm-friend", dataRequest)
                })
            }
        });
        socket.on("disconnect", () => {
            if (clients[userId]) {
                clients[userId] = clients[userId].filter(id => id !== socket.id);
                if (!clients[userId].length) delete clients[userId];
            }
        });

    });
};

const duplicate = (array) => {
    return Array.from(new Set(array));
};

