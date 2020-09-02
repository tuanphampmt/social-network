const contactSocket = require("./ContactSocket");
const messageSocket = require("./MessgaeSocket");
module.exports = (io) => {
    contactSocket.addFriend(io);
    messageSocket.sendMessage(io)

};

