const ChatGroup = require('../models/ChatGroupModel');
const User = require('../models/UserModel');
exports.sendMessage = (io) => {
    const clients = {};
    io.on('connection', function (socket) {
        let userId;
        let chatGroupIds = [];
        io.sockets.on('authenticated', async (socket) => {
            userId = socket.decoded_token.id;
            chatGroupIds = await ChatGroup.find({members: {$in: [userId]}}, {_id: 0, chatGroupId: 1});
            socket.decoded_token = {
                ...socket.decoded_token,
                chatGroupIds: chatGroupIds
            };

            // console.log(socket.decoded_token)
            if (clients[userId]) { // Đăng nhập, F5 nhiều lần
                clients[userId].push(socket.id);
                clients[userId] = duplicate(clients[userId])
            } else { // Dang nhap lan dau
                clients[userId] = [socket.id]
            }
            if (chatGroupIds.length) {
                socket.decoded_token.chatGroupIds.map(id => {
                    if (clients[id.chatGroupId]) {
                        clients[id.chatGroupId].push(socket.id);
                        clients[id.chatGroupId] = duplicate(clients[id.chatGroupId])
                    } else {
                        clients[id.chatGroupId] = [socket.id]
                    }
                })
            }

        });

        socket.on("send-message", async (data) => {
            if (data.contactId) {
                const dataRequest = {
                    userId: socket.decoded_token.id,
                    message: data.message,
                    conversationId: data.conversationId
                };
                if (clients[data.contactId]) {
                    clients[data.contactId].map(socketId => {
                        socket.to(socketId).emit("request-send-message", dataRequest)
                    })
                }
            }

            if (data.chatGroupId) {
                const dataRequest = {
                    userId: socket.decoded_token.id,
                    message: data.message,
                    chatGroupId: data.chatGroupId,
                    conversationId: data.conversationId
                };
                if (clients[data.chatGroupId]) {
                    clients[data.chatGroupId].map(socketId => {
                        socket.to(socketId).emit("request-send-message", dataRequest)
                    })
                }
            }
        });


        socket.on("disconnect", () => {
            if (clients[userId]) {
                clients[userId] = clients[userId].filter(id => id !== socket.id);
                if (!clients[userId].length) delete clients[userId];
            }
            if (chatGroupIds.length) {
                socket.decoded_token.chatGroupIds.map(id => {
                    if (clients[id.chatGroupId]) {
                        clients[id.chatGroupId] = clients[id.chatGroupId].filter(id => id !== socket.id);
                        if (!clients[id.chatGroupId].length) delete clients[id.chatGroupId];
                    }
                })
            }
        });

    });
};

const duplicate = (array) => {
    return Array.from(new Set(array));
};

