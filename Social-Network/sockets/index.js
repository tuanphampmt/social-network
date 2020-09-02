// const Chat = require('../models/MessageModel');
//
// exports.socketIo = function (server) {
//     const io = require('../utils/io').initialize(server);
//     const users = {};
//     io.on('connection', function (socket) {
//
//         socket.on('new-user', name => {
//             users[socket.id] = name;
//             socket.broadcast.emit('user-connected', name)
//         });
//         socket.on('send-chat-css', async (senderId, roomId, message) => {
//             const chatRoom = {
//                 senderId: senderId,
//                 senderName: users[socket.id],
//                 message: message,
//                 createdAt: Date.now(),
//             };
//             console.log(message)
//             socket.broadcast.emit('chat-css', {message: message, name: users[socket.id]});
//             const chat = await Chat.findOne({roomId: roomId});
//             if (chat.message === "null") {
//                 return await Chat.findByIdAndUpdate({_id: chat._id}, {$set: chatRoom}, {new: true})
//             }
//             chatRoom.roomId = roomId;
//             const newChat = new Chat(chatRoom);
//             await newChat.save();
//
//         });
//
//         socket.on('disconnect', () => {
//             socket.broadcast.emit('user-disconnect', users[socket.id]);
//             delete users[socket.id]
//         })
//     });
// };
