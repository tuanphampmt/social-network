import React, {Component} from 'react';
import * as messageActions from "../../Actions/message.action";
import {connect} from "react-redux";
import chatGroupsImg from "./imgchatgroup.png"
import Picker from 'emoji-picker-react';
import meow from "./meo.jpg"
import {ObjectID} from 'bson';
import $ from 'jquery';
import * as configSocket from "../../socket/configSocket";


const user = JSON.parse(localStorage.getItem('user'));

class ChatFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friends: [],
            chosenEmoji: "",
            isEmoji: false,
            messages: [],
            message: "",
            imgUrl: undefined
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            friends: nextProps.friends,
            messages: nextProps.messages,
            conversationId: nextProps.conversationId
        })
    }

    componentDidMount() {
        this.requestSendMessage();

    }


//     appendReceivedMessage = (conversationId, message) => {
//         // <div className="row no-gutters">
//         //     <div className={message.senderId === user._id ?
//         //         "col-md-3 offset-md-9" : "col-md-3"}>
//         //         <div className={message.senderId === user._id
//         //             ? "chat-bubble chat-bubble--right" :
//         //             "chat-bubble chat-bubble--left"}>
//         const chatMessageContainer = document.getElementById(conversationId);
//         const rowNoGutters = document.createElement("div");
//         const col = document.createElement('div');
//         const chatBubble = document.createElement('div');
//         const span = document.createElement('span');
//         const img = document.createElement('img');
//         rowNoGutters.className = "row";
//         rowNoGutters.className += "no-gutters";
//         if (message.senderId === user._id) {
//             col.className = "col-md-3";
//             col.className += "offset-md-9";
//             chatBubble.className = "chat-bubble";
//             chatBubble.className += "chat-bubble--right";
//             img.className = "img-message-right";
//         } else {
//             col.className = "col-md-3";
//             chatBubble.className = "chat-bubble";
//             chatBubble.className += "chat-bubble--left";
//             img.className = "img-message-left";
//         }
//         img.src = message.sender.profileImg;
//         img.alt = "anh dai dien";
//         span.innerText = message.text;
//         span.append(img);
//         chatBubble.append(span);
//         col.append(chatBubble);
//         rowNoGutters.append(col);
//         chatMessageContainer.append(rowNoGutters);
//     };

    requestSendMessage = () => {
        configSocket.socket.on("request-send-message", data => {
            // this.appendReceivedMessage(data.conversationId, data.message);
            const conversations = this.state.friends.map(fi => {
                if (fi._id === data.conversationId) {
                    fi.messages.push(data.message);
                    return fi
                }
                return fi
            });
            // this.props.loadMessageSocket(data.conversationId, data.message);
            // this.state.messages.push(data.message);
            this.setState({friends: conversations});
            this.updateScroll();
        })
    };

    onEmojiClick = (event, emojiObject) => {
        let inputMessage = document.getElementById("input-message" + this.state.conversationId);
        console.log(inputMessage);
        inputMessage.value += emojiObject.emoji;

    };
    showEmoji = () => {
        this.setState({isEmoji: !this.state.isEmoji})

    };

    showName = () => {
        const conversation = this.state.friends.find(fi => fi._id === this.props.conversationId);

        if (conversation && conversation.members) {
            return conversation.name
        }
        if (conversation && conversation.user[0]) {
            return conversation.user[0].lastName + " " + conversation.user[0].firstName
        }

    };
    showImg = () => {
        const conversation = this.state.friends.find(fi => fi._id === this.props.conversationId);

        if (conversation && conversation.members) {
            return chatGroupsImg
        }
        if (conversation && conversation.user[0]) {
            return conversation.user[0].profileImage
        }

    };

    handleSubmit = (e) => {
        e.preventDefault();
        document.getElementById("input-message" + this.state.conversationId).required = true;
        const friend = this.state.friends.find(fi => fi._id === this.props.conversationId);
        let inputMessage = document.getElementById("input-message" + this.state.conversationId);
        if (friend && friend.members) {
            const message = this.getMessage(user, friend, inputMessage);
            const conversations = this.state.friends.map(fi => {
                if (fi._id === friend._id) {
                    fi.messages.push(message);
                    return fi
                }
                return fi
            });
            this.setState({friends: conversations, imgUrl: undefined});
            this.getFirstMessageWhenSubmit(friend.chatGroupId, message);
            this.props.getConversationIdWhenSubmit(friend._id);
            this.props.updatedAtWhenSubmit(friend._id, this.state.friends);
            inputMessage.value = "";
            this.updateScroll();
            configSocket.socket.emit('send-message', {
                message: message,
                chatGroupId: friend.chatGroupId,
                conversationId: friend._id
            });
            return this.props.addMessage(message, friend.messageAmount);
        }
        if (friend && friend.user[0]) {
            const message = this.getMessage(user, friend, inputMessage);
            const conversations = this.state.friends.map(fi => {
                if (fi._id === friend._id) {
                    fi.messages.push(message);
                    return fi
                }
                return fi
            });
            this.setState({messages: conversations, imgUrl: undefined});
            this.getFirstMessageWhenSubmit(friend.user[0]._id, message);
            this.props.getConversationIdWhenSubmit(friend._id);
            this.props.updatedAtWhenSubmit(friend._id, this.state.friends);
            inputMessage.value = "";
            this.updateScroll();

            this.props.addMessage(message, null);
            configSocket.socket.emit('send-message', {
                message: message,
                contactId: friend.user[0]._id,
                conversationId: friend._id
            });
        }

    };
    getFirstMessageWhenSubmit = (receiverId, message) => {
        const chatGroup = document.getElementById(receiverId);
        switch (message.messageType) {
            case "text":
                if (message.senderId === user._id) {
                    return chatGroup.innerHTML = "You: " + message.text
                }
                return chatGroup.innerHTML = message.sender.lastName + " " + message.sender.firstName + ": " + message.text;
            case "image":
                if (message.senderId === user._id) {
                    return chatGroup.innerHTML = "You sent an image.";
                }
                return chatGroup.innerHTML = message.sender.lastName + " " + message.sender.firstName + " sent an image.";
            case "file":
                if (message.senderId === user._id) {
                    return chatGroup.innerHTML = "You sent an attachment.";
                }
                return chatGroup.innerHTML = message.sender.lastName + " " + message.sender.firstName + " sent an attachment."
        }
    };

    getMessage = (user, friend, inputMessage) => {
        if (friend && friend.members) {
            if (!this.state.imgUrl) {
                return {
                    messageId: new ObjectID(),
                    senderId: user._id,
                    receiverId: friend.chatGroupId,
                    conversationType: "group",
                    messageType: "text",
                    sender: {
                        senderId: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        profileImg: user.profileImage,
                    },
                    receiver: {
                        receiverId: friend.chatGroupId,
                        firstName: friend.name,
                        lastName: null,
                        profileImg: null,
                    },
                    text: inputMessage.value,
                    createdAt: Date.now()
                };
            } else {
                return {
                    messageId: new ObjectID(),
                    senderId: user._id,
                    receiverId: friend.chatGroupId,
                    conversationType: "group",
                    messageType: "image",
                    sender: {
                        senderId: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        profileImg: user.profileImage,
                    },
                    receiver: {
                        receiverId: friend.chatGroupId,
                        firstName: friend.name,
                        lastName: null,
                        profileImg: null,
                    },
                    fileUrl: this.state.imgUrl,
                    createdAt: Date.now()
                };
            }
        }

        if (friend && friend.user[0]) {
            if (!this.state.imgUrl) {
                return {
                    messageId: new ObjectID(),
                    senderId: user._id,
                    receiverId: friend.user[0]._id,
                    conversationType: "personal",
                    messageType: "text",
                    sender: {
                        senderId: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        profileImg: user.profileImage,
                    },
                    receiver: {
                        receiverId: friend.user[0]._id,
                        firstName: friend.user[0].firstName,
                        lastName: friend.user[0].lastName,
                        profileImg: friend.user[0].profileImage,
                    },
                    text: inputMessage.value,
                    createdAt: Date.now()
                };
            } else {
                return {
                    messageId: new ObjectID(),
                    senderId: user._id,
                    receiverId: friend.user[0]._id,
                    conversationType: "personal",
                    messageType: "image",
                    sender: {
                        senderId: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        profileImg: user.profileImage,
                    },
                    receiver: {
                        receiverId: friend.user[0]._id,
                        firstName: friend.user[0].firstName,
                        lastName: friend.user[0].lastName,
                        profileImg: friend.user[0].profileImage,
                    },
                    fileUrl: this.state.imgUrl,
                    createdAt: Date.now()
                };
            }
        }


    };

    updateScroll = () => {
        $('.chatmsg-container').animate({
            scrollTop: $('.chatmsg-container')[0].scrollHeight
        }, 1000);
    };
    isChangeUpLoad = async (e) => {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append('upload_preset', 'tuanpham');
        const path = await messageActions.uploadImgUrl(formData);
        this.setState({
            imgUrl: path
        });
        document.getElementById("input-message" + this.state.conversationId).required = false;
    };


    render() {

        return (
            <div className="col-md-8" id="chat-container">
                <div className="settings-tray settings-tray--ri">
                    <div className="friend-drawer no-gutters friend-drawer--grey">
                        <img
                            className="profile-image"
                            src={this.showImg()}
                            alt
                        />
                        <div className="text">
                            <h6>{this.showName()}</h6>
                            <p className="text-muted">
                                Don’t cry because it’s over, smile because it happened...
                            </p>
                        </div>
                        <span className="settings-tray--right">
                            <i className="fas fa-video"/>
                            <i className="far fa-image"/>
                            <i className="fas fa-paperclip"/>
                        </span>
                    </div>
                </div>
                {
                    this.state.friends.map((value, index) => {
                        if (value._id === this.state.conversationId) {
                            return (
                                <div className="chat-panel " key={index}>
                                    <div className="chatmsg-container" id={value._id}>
                                        {

                                            value.messages.map(message => {
                                                if (message.messageType === "text") {
                                                    return (
                                                        <div className="row no-gutters">
                                                            <div className={message.senderId === user._id ?
                                                                "col-md-3 offset-md-9" : "col-md-3"}>
                                                                <div className={message.senderId === user._id
                                                                    ? "chat-bubble chat-bubble--right" :
                                                                    "chat-bubble chat-bubble--left"}>
                                                                    <span>
                                                                         <img
                                                                             className={message.senderId === user._id ? "img-message-right" : "img-message-left"}
                                                                             src={message.sender.profileImg}
                                                                             alt=""/>
                                                                        {message.text}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }

                                                if (message.messageType === "image") {
                                                    return (
                                                        <div className="row no-gutters">
                                                            <div className={message.senderId === user._id ?
                                                                "col-md-3 offset-md-9" : "col-md-3"}>
                                                                <div
                                                                    className={message.senderId === user._id ?
                                                                        "chat-bubble chat-bubble--right chat-bubble-img-right" :
                                                                        "chat-bubble chat-bubble--left chat-bubble-img-left"}>
                                                                    <img src={message.fileUrl} alt="#111 "/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })
                                        }

                                    </div>

                                    <div id="container-emoji">
                                        {this.state.isEmoji && (<Picker onEmojiClick={this.onEmojiClick}/>)}
                                    </div>
                                    {this.state.imgUrl && (
                                        <div className="img-load-container">
                                            <img src={this.state.imgUrl} alt="anh load"/>
                                        </div>
                                    )}
                                    <div className="row with-765">
                                        <div className="col-12">
                                            <div className="chat-box-tray">
                                                <i className="far fa-smile-beam" onClick={() => this.showEmoji()}/>
                                                <label htmlFor="myInput"> <i className="fas fa-image"/></label>
                                                <input id="myInput"
                                                       type="file"
                                                       name="file"
                                                       className="profileImg"
                                                       style={{display: 'none'}}
                                                       onChange={this.isChangeUpLoad}
                                                />
                                                {/*<BsImageFill/>*/}

                                                <i className="fas fa-paperclip"/>
                                                <i className="fas fa-microphone"/>
                                                <form onSubmit={this.handleSubmit}>
                                                    <input type="text" name="message"
                                                           id={"input-message" + value._id}
                                                           className="txt"
                                                           onChange={this.handleChange}
                                                           required/>
                                                    <button type="submit" id="submit-message">
                                                        <i className="fas fa-paper-plane"/>
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        } else {
                            return (
                                <div style={{display: 'none'}} className="chat-panel " key={index}>
                                    <div className="chatmsg-container" id={value._id}>
                                        {

                                            value.messages.map(message => {
                                                if (message.messageType === "text") {
                                                    return (
                                                        <div className="row no-gutters">
                                                            <div className={message.senderId === user._id ?
                                                                "col-md-3 offset-md-9" : "col-md-3"}>
                                                                <div className={message.senderId === user._id
                                                                    ? "chat-bubble chat-bubble--right" :
                                                                    "chat-bubble chat-bubble--left"}>
                                                    <span>
                                                         <img
                                                             className={message.senderId === user._id ? "img-message-right" : "img-message-left"}
                                                             src={message.sender.profileImg}
                                                             alt=""/>
                                                        {message.text}
                                                    </span>


                                                                </div>

                                                            </div>

                                                        </div>
                                                    )
                                                }

                                                if (message.messageType === "image") {
                                                    return (
                                                        <div className="row no-gutters">
                                                            <div className={message.senderId === user._id ?
                                                                "col-md-3 offset-md-9" : "col-md-3"}>
                                                                <div
                                                                    className={message.senderId === user._id ?
                                                                        "chat-bubble chat-bubble--right chat-bubble-img-right" :
                                                                        "chat-bubble chat-bubble--left chat-bubble-img-left"}>
                                                                    <img src={message.fileUrl} alt="#111 "/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })
                                        }

                                    </div>

                                    <div id="container-emoji">
                                        {this.state.isEmoji && (<Picker onEmojiClick={this.onEmojiClick}/>)}
                                    </div>
                                    {this.state.imgUrl && (
                                        <div className="img-load-container">
                                            <img src={this.state.imgUrl} alt="anh load"/>
                                        </div>
                                    )}
                                    <div className="row with-765">
                                        <div className="col-12">
                                            <div className="chat-box-tray">
                                                <i className="far fa-smile-beam" onClick={() => this.showEmoji()}/>
                                                <label htmlFor="myInput"> <i className="fas fa-image"/></label>
                                                <input id="myInput"
                                                       type="file"
                                                       name="file"
                                                       className="profileImg"
                                                       style={{display: 'none'}}
                                                       onChange={this.isChangeUpLoad}
                                                />
                                                {/*<BsImageFill/>*/}

                                                <i className="fas fa-paperclip"/>
                                                <i className="fas fa-microphone"/>
                                                <form onSubmit={this.handleSubmit}>
                                                    <input type="text" name="message"
                                                           id={"input-message" + value._id}
                                                           className="txt"
                                                           onChange={this.handleChange}
                                                           required/>
                                                    <button type="submit" id="submit-message">
                                                        <i className="fas fa-paper-plane"/>
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )

                        }

                    })
                }
                {/*<div className="chat-panel ">*/}
                {/*    <div className="chatmsg-container">*/}
                {/*        {*/}

                {/*            this.state.messages.map((message, i) => {*/}
                {/*                if (message.messageType === "text") {*/}
                {/*                    return (*/}
                {/*                        <div className="row no-gutters" key={i} id={message.senderId}>*/}
                {/*                            <div className={message.senderId === user._id ?*/}
                {/*                                "col-md-3 offset-md-9" : "col-md-3"}>*/}
                {/*                                <div className={message.senderId === user._id*/}
                {/*                                    ? "chat-bubble chat-bubble--right" :*/}
                {/*                                    "chat-bubble chat-bubble--left"}>*/}
                {/*                                    <span>*/}
                {/*                                         <img*/}
                {/*                                             className={message.senderId === user._id ? "img-message-right" : "img-message-left"}*/}
                {/*                                             src={message.sender.profileImg}*/}
                {/*                                             alt=""/>*/}
                {/*                                        {message.text}*/}
                {/*                                    </span>*/}


                {/*                                </div>*/}

                {/*                            </div>*/}

                {/*                        </div>*/}
                {/*                    )*/}
                {/*                }*/}

                {/*                if (message.messageType === "image") {*/}
                {/*                    return (*/}
                {/*                        <div className="row no-gutters" key={i}>*/}
                {/*                            <div className={message.senderId === user._id ?*/}
                {/*                                "col-md-3 offset-md-9" : "col-md-3"}>*/}
                {/*                                <div*/}
                {/*                                    className={message.senderId === user._id ?*/}
                {/*                                        "chat-bubble chat-bubble--right chat-bubble-img-right" :*/}
                {/*                                        "chat-bubble chat-bubble--left chat-bubble-img-left"}>*/}
                {/*                                    <img src={message.fileUrl} alt="#111 "/>*/}
                {/*                                </div>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    )*/}
                {/*                }*/}
                {/*            })*/}
                {/*        }*/}

                {/*    </div>*/}

                {/*    <div id="container-emoji">*/}
                {/*        {this.state.isEmoji && (<Picker onEmojiClick={this.onEmojiClick}/>)}*/}
                {/*    </div>*/}
                {/*    {this.state.imgUrl && (*/}
                {/*        <div className="img-load-container">*/}
                {/*            <img src={this.state.imgUrl} alt="anh load"/>*/}
                {/*        </div>*/}
                {/*    )}*/}
                {/*    <div className="row with-765">*/}
                {/*        <div className="col-12">*/}
                {/*            <div className="chat-box-tray">*/}
                {/*                <i className="far fa-smile-beam" onClick={() => this.showEmoji()}/>*/}
                {/*                <label htmlFor="myInput"> <i className="fas fa-image"/></label>*/}
                {/*                <input id="myInput"*/}
                {/*                       type="file"*/}
                {/*                       name="file"*/}
                {/*                       className="profileImg"*/}
                {/*                       style={{display: 'none'}}*/}
                {/*                       onChange={this.isChangeUpLoad}*/}
                {/*                />*/}
                {/*                /!*<BsImageFill/>*!/*/}

                {/*                <i className="fas fa-paperclip"/>*/}
                {/*                <i className="fas fa-microphone"/>*/}
                {/*                <form onSubmit={this.handleSubmit}>*/}
                {/*                    <input type="text" name="message" id="input-message" className="txt" tabIndex="1"*/}
                {/*                           onChange={this.handleChange}*/}
                {/*                           required/>*/}
                {/*                    <button type="submit" id="submit-message">*/}
                {/*                        <i className="fas fa-paper-plane"/>*/}
                {/*                    </button>*/}
                {/*                </form>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    friends: state.messageReducer.friends,
    messages: state.messageReducer.messages,
    conversationId: state.messageReducer.conversationId,
});
const mapDispatchToProps = dispatch => ({
    addMessage: (message, messageAmount) => dispatch(messageActions.addMessage(message, messageAmount)),
    getConversationIdWhenSubmit: (conversationId) => dispatch(messageActions.getConversationIdWhenSubmit(conversationId)),
    updatedAtWhenSubmit: (conversationId, friends) => dispatch(messageActions.updatedAtWhenSubmit(conversationId, friends)),
    loadMessageSocket: (conversationId, message) => dispatch(messageActions.loadMessageSocket(conversationId, message))
});
export default connect(mapStateToProps, mapDispatchToProps)(ChatFrame);
