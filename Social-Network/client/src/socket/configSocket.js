import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:4000";
export const socket = socketIOClient(ENDPOINT);

export const config  = () => {
    const token = JSON.parse(localStorage.getItem("jwt"));
    socket.on('connect', () => {
        socket
            .on('authenticated', function () {

            })
            .emit('authenticate', {token: token})
            .on('unauthorized', (msg) => {
                console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
            })
    });
};
