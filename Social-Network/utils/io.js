const sio = require('socket.io');
let io;

exports.initialize = function(server) {
    return io = sio.listen(server);
};
