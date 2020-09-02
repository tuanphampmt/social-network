import React, {Component} from 'react';
import socketIOClient from "socket.io-client";
import "./chat.css"

const ENDPOINT = "http://localhost:4000";

const socket = socketIOClient(ENDPOINT);

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ""
        }
    }

    send = () => {
        // New user
        const name = prompt('What is your name?');
        appendMessage('You joined');
        socket.emit('new-user', name);
    };

    isChange = (e) => {
        this.setState({
            [e.target.name]: [e.target.value]
        })
    };

    componentDidMount() {
        setInterval(this.send(), 1000);
        socket.on('user-connected', name => {
            appendMessage(`${name} connected`)
        });
        socket.on("chat-css", data => {
            appendMessage(`${data.name}: ${data.message}`);
        });

        socket.on('user-disconnect', name => {
            appendMessage(`${name} disconnected`)
        });

    }

    handleSubmit = (e) => {
        e.preventDefault();
        // const messageInput = document.getElementById("css-input");
        const message = this.state.message;
        appendMessage(`You: ${message}`);
        socket.emit('send-chat-css', message);
        this.setState({
            message: ""
        })
    };

    render() {
        return (
            <div className="container" style={{width: "100%"}} id="chat">
                <div className="row">
                    <div className="col-6" style={{marginTop: 30}}>
                        <h1>Socket.IO Chat Example</h1>
                        <form onSubmit={this.handleSubmit} id="send-container">
                            <input type="text" id="message-input" name="message"
                                   onChange={this.isChange}
                                   value={this.state.message}/>
                            <button type="submit" id="send-button" className="btn btn-success">
                                Send
                            </button>
                        </form>
                    </div>
                    <div className="col-6" id="message-container" style={{marginTop: 30}}>
                        <h1>Message</h1>
                    </div>
                </div>
            </div>
        );
    }
}

const appendMessage = (message) => {
    const messageContainer = document.getElementById("css-container");
    const messageElement = document.createElement('p');
    messageElement.innerText = message;
    messageContainer.append(messageElement)
};

export default Chat;
