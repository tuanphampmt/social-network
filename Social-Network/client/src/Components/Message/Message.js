import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import dennis from "../images/login/messages/dennis.png";
import socketIOClient from "socket.io-client";
import * as chatActions from "../../Actions/message.action";
import {connect} from "react-redux";

const user = JSON.parse(localStorage.getItem('user'));
const ENDPOINT = "https://tuanpham-social-network.herokuapp.com";
// const ENDPOINT = "http://localhost:4000";

const socket = socketIOClient(ENDPOINT);

class Message extends Component {


    constructor(props) {
        super(props);
        this.state = {
            message: "",
            name: 1,
            receivedMessage: 1,
            roomId: ""
        }
    }


    send = () => {
        const name = user.lastName + " " + user.firstName;
        socket.emit('new-user', name);
    };

    isChange = (e) => {
        console.log(e.target.value)
        this.setState({
            [e.target.name]: [e.target.value]
        })
    };

    componentDidMount() {

        setInterval(this.send(), 1000)

        // socket.on('user-connected', name => {
        //     appendReceivedMessage(`${name} connected`)
        // });

        socket.on("chat-css", data => {
            appendReceivedMessage(`${data.name}: ${data.message}`);
        });
        // socket.on('user-disconnect', name => {
        //     console.log(typeof name)
        //     if (typeof name !== "object") {
        //         appendReceivedMessage(`${name} disconnected`)
        //         // appendReceivedMessage(`${user.lastName} ${user.firstName} disconnected`)
        //     }
        //
        // })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const message = this.state.message;
        appendSendMessage(`You: ${message[0]}`);
        socket.emit('send-chat-css', user._id, this.state.roomId, message[0]);
        this.setState({message: ""})

    };

    select = (n) => {
        const sends = document.getElementById("css-container").querySelectorAll(".send");
        for (let i = 0; i < sends.length; i++) {
            sends[i].remove();
        }

        const receiveds = document.getElementById("css-container").querySelectorAll(".received");
        for (let i = 0; i < receiveds.length; i++) {
            receiveds[i].remove();
        }

        const contactuser = document.getElementsByClassName("contactuser");

        for (let i = 0; i < contactuser.length; i++) {
            contactuser[i].style.border = "none";
        }

        contactuser[n - 1].style.borderLeft = "8px solid #009688";

        // changing name in chat section
        const name = document.getElementsByClassName("name");
        const viewname = document.getElementsByClassName("viewname");
        viewname[0].innerHTML = name[n - 1].innerHTML;

        //Changing user img in chat section
        const contimg = document.getElementsByClassName("contimg");
        const chatimg = document.getElementsByClassName("chatimg");
        chatimg[0].src = contimg[n - 1].src;
        // setTimeout(this.chatmsgrec(), 600);
    };

    room = (receiverId) => {
        const senderId = user._id;
        const roomId = senderId + receiverId;
        this.props.chatRoom(roomId);
        this.setState({roomId: roomId})
    };
    getMessByRoomId = async (receiverId) => {
        const senderId = user._id;
        const roomId = senderId + receiverId;
        const messages = await chatActions.getMessByRoomId(roomId)
        messages.map(mess => {
            if (mess.senderId === senderId) {
                return appendSendMessage(`You: ${mess.message}`);
            }
            appendReceivedMessage(`${mess.senderName}: ${mess.message}`);
        });
    };

    render() {
        return (
            <div className="mainnotfixed">
                {/* Start of left contact section */}
                <div className="contact">
                    {/* heading messaging */}
                    <div className="headmsg">
                        <p>Messaging</p>
                    </div>
                    {/* contact section content */}
                    <div className="leftcontent">
                        {/* Search bar */}
                        <form id="contactsearch">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search.."
                                id="searchcontact"
                            />
                        </form>
                        {/* Contacts */}
                        <div className="contacts">
                            {/* users */}
                            {this.props.users.map((value, i) => {
                                if (value.isVerified) {
                                    if (i === 0) return (
                                        <div
                                            className="contactuser"
                                            style={{borderLeft: "8px solid #009688", marginTop: 18}}
                                            onClick={() => {
                                                this.select(i + 1);
                                                this.room(value._id);
                                                this.getMessByRoomId(value._id)
                                            }}
                                            key={i}
                                        >
                                            <Link to={value._id}>
                                                <img src={dennis} className="contimg"/>
                                                <p className="name">{value.lastName} {value.firstName}</p>
                                            </Link>

                                        </div>
                                    );
                                    return (
                                        <div className="contactuser"
                                             onClick={() => {
                                                 this.select(i + 1);
                                                 this.room(value._id);
                                                 this.getMessByRoomId(value._id)
                                             }}
                                             key={i}>
                                            <Link to={value._id}>
                                                <img src={dennis} className="contimg"/>
                                                <p className="name">{value.lastName} {value.firstName}</p>
                                            </Link>
                                        </div>
                                    )
                                }
                            })}


                            {/* End user */}
                        </div>
                        {/* End contacts */}
                    </div>
                    {/* End contact section */}
                </div>
                {/* End of left contact section */}
                {/* Start of right chat section */}
                <div className="chat">
                    {/* heading chat user */}
                    <div className="chatuser">
                        {/* heading chat user name and pic */}
                        <img src={dennis} className="chatimg"/>
                        <p className="viewname"></p>
                    </div>
                    {/* End of chat user heading */}
                    {/* chat msg start */}
                    <div className="chatmsg" id="message-container">

                    </div>
                    {/* End of chat msg */}
                    {/* to send msg box and button */}
                    <form className="sendmessage" onSubmit={this.handleSubmit}>
                        <textarea id="textarea" value={this.state.message} name="message" onChange={this.isChange}/>
                        <button type="submit" hidden={false} id="sendsymbol">
                            ➤
                        </button>
                    </form>
                    {/* end of msg box */}
                </div>
                {/* End of right chat section */}
            </div>
        );
    }
}

const appendReceivedMessage = (message) => {
    const messageContainer = document.getElementById("css-container");
    const received = document.createElement("div");
    const received_para = document.createElement('p');
    received.className = "received";
    received_para.innerText = message;
    received.append(received_para);
    received.style.display = "block";
    messageContainer.append(received)
};

const appendSendMessage = (message) => {
    const messageContainer = document.getElementById("css-container");
    const send = document.createElement("div");
    const send_para = document.createElement('p');
    send.className = "send";
    send_para.innerText = message;
    send.append(send_para);
    send.style.display = "block";
    messageContainer.append(send)
};
const mapStateToProps = state => ({
    users: state.userReducer
});
const mapDispatchToProps = dispatch => ({
    chatRoom: (roomId) => dispatch(chatActions.chatRoom(roomId))
});
export default connect(mapStateToProps, mapDispatchToProps)(Message);
