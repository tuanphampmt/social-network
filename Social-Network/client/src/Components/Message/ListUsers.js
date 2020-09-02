import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import * as messageActions from "../../Actions/message.action.js";
import {connect} from "react-redux";
import chatGroupsImg from "./imgchatgroup.png"
import moment from "moment";
import $ from "jquery";
import * as configSocket from "../../socket/configSocket";

const user = JSON.parse(localStorage.getItem('user'));

class ListUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friends: [],
            messageId: ""
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {

        // if (nextProps.converId) {
        //     const arrSortHasMessage = nextProps.friends.map(item => {
        //         if (item._id === nextProps.converId) {
        //             item.updatedAt = Date.now();
        //             return item
        //         }
        //         return item
        //     });
        //
        //     return this.setState({
        //         friends: sortCreatedAt(arrSortHasMessage),
        //         messages: nextProps.messages
        //     })
        // }

        const arrHasMessage = [];
        nextProps.friends.forEach(item => {
            if (Array.isArray(item.messages) && item.messages.length) {

                switch (item.messages[item.messages.length - 1].messageType) {

                    case "text":
                        if (item.messages[item.messages.length - 1].senderId === user._id) {
                            return arrHasMessage.push({
                                ...item,
                                firstMessage: "You: " + item.messages[item.messages.length - 1].text
                            });
                        }
                        return arrHasMessage.push({
                            ...item,
                            firstMessage: item.messages[item.messages.length - 1].sender.lastName + " "
                                + item.messages[item.messages.length - 1].sender.firstName + ": "
                                + item.messages[item.messages.length - 1].text
                        });
                    case "image":
                        if (item.messages[item.messages.length - 1].senderId === user._id) {
                            return arrHasMessage.push({...item, firstMessage: "You sent an image."});
                        }
                        return arrHasMessage.push({
                            ...item,
                            firstMessage: item.messages[item.messages.length - 1].sender.lastName + " " +
                                item.messages[item.messages.length - 1].sender.firstName + " sent an image."
                        });
                    case "file":
                        if (item.messages[item.messages.length - 1].senderId === user._id) {
                            return arrHasMessage.push({...item, firstMessage: "You sent an attachment."})
                        }
                        return arrHasMessage.push({
                            ...item,
                            firstMessage: item.messages[item.messages.length - 1].sender.lastName + " " +
                                item.messages[item.messages.length - 1].sender.firstName + " sent an attachment."
                        })
                }
            } else {
                arrHasMessage.push(item)
            }

        });
        this.setState({
            friends: arrHasMessage,
            messages: nextProps.messages
        })
    }

    requestSendMessage = () => {
        configSocket.socket.on("request-send-message", data => {

            this.props.updatedAtWhenSubmit(data.conversationId, this.state.friends);
            if (data.chatGroupId) {

                const chatGroup = document.getElementById(data.chatGroupId);
                chatGroup.style.fontWeight = "900";
                chatGroup.style.cssText = 'color: #000 !important';
                switch (data.message.messageType) {
                    case "text":
                        if (data.message.senderId === user._id) {
                            return chatGroup.innerHTML = "You: " + data.message.text
                        }
                        return chatGroup.innerHTML = data.message.sender.lastName + " " + data.message.sender.firstName + ": " + data.message.text;
                    case "image":
                        if (data.message.senderId === user._id) {
                            return chatGroup.innerHTML = "You sent an image.";
                        }
                        return chatGroup.innerHTML = data.message.sender.lastName + " " + data.message.sender.firstName + " sent an image.";
                    case "file":
                        if (data.message.senderId === user._id) {
                            return chatGroup.innerHTML = "You sent an attachment.";
                        }
                        return chatGroup.innerHTML = data.message.sender.lastName + " " + data.message.sender.firstName + " sent an attachment."
                }
            } else {

                const chatGroup = document.getElementById(data.message.senderId);
                chatGroup.style.fontWeight = "900";
                chatGroup.style.cssText = 'color: #000 !important';
                switch (data.message.messageType) {
                    case "text":
                        if (data.message.senderId === user._id) {
                            return chatGroup.innerHTML = "You: " + data.message.text
                        }
                        return chatGroup.innerHTML = data.message.sender.lastName + " " + data.message.sender.firstName + ": " + data.message.text;
                    case "image":
                        if (data.message.senderId === user._id) {
                            return chatGroup.innerHTML = "You sent an image.";
                        }
                        return chatGroup.innerHTML = data.message.sender.lastName + " " + data.message.sender.firstName + " sent an image.";
                    case "file":
                        if (data.message.senderId === user._id) {
                            return chatGroup.innerHTML = "You sent an attachment.";
                        }
                        return chatGroup.innerHTML = data.message.sender.lastName + " " + data.message.sender.firstName + " sent an attachment."
                }
            }
        })
    };

    handleChange = (e) => {
        const arr = [];
        this.state.friends.forEach(item => {
            if (!item.members) {
                const fullName = item.user[0].lastName + " " + item.user[0].firstName;
                if ((item.user[0].email.toLowerCase().trim().indexOf(e.target.value.toLowerCase().trim()) !== -1
                    || this.toSlug(fullName).toLowerCase().trim().indexOf(e.target.value.toLowerCase().trim()) !== -1)
                    && e.target.value.length !== 0) {
                    arr.push(item)
                }
            } else if ((this.toSlug(item.name).toLowerCase().trim().indexOf(e.target.value.toLowerCase().trim()) !== -1) && e.target.value.length !== 0) {
                arr.push(item)
            }

        });
        if (arr.length === 0) {
            const arrHasMessage = [];
            this.props.friends.forEach(item => {
                if (Array.isArray(item.messages) && item.messages.length) {
                    switch (item.messages[item.messages.length - 1].messageType) {
                        case "text":
                            if (item.messages[item.messages.length - 1].senderId === user._id) {
                                return arrHasMessage.push({
                                    ...item,
                                    firstMessage: "You: " + item.messages[item.messages.length - 1].text
                                });
                            }
                            return arrHasMessage.push({
                                ...item,
                                firstMessage: item.messages[item.messages.length - 1].sender.lastName + " "
                                    + item.messages[item.messages.length - 1].sender.firstName + ": "
                                    + item.messages[item.messages.length - 1].text
                            });
                        case "image":
                            if (item.messages[item.messages.length - 1].senderId === user._id) {
                                return arrHasMessage.push({...item, firstMessage: "You sent an image."});
                            }
                            return arrHasMessage.push({
                                ...item,
                                firstMessage: item.messages[item.messages.length - 1].sender.lastName + " " +
                                    item.messages[item.messages.length - 1].sender.firstName + " sent an image."
                            });
                        case "file":
                            if (item.messages[item.messages.length - 1].senderId === user._id) {
                                return arrHasMessage.push({...item, firstMessage: "You sent an attachment."})
                            }
                            return arrHasMessage.push({
                                ...item,
                                firstMessage: item.messages[item.messages.length - 1].sender.lastName + " " +
                                    item.messages[item.messages.length - 1].sender.firstName + " sent an attachment."
                            })
                    }
                } else {
                    arrHasMessage.push(item)
                }
            });

            this.setState({friends: arrHasMessage})
        } else {
            this.setState({friends: arr})
        }

    };

    toSlug = (str) => {
        // Chuyển hết sang chữ thường
        str = str.toLowerCase();

        // xóa dấu
        str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
        str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
        str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
        str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
        str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
        str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
        str = str.replace(/(đ)/g, 'd');

        // Xóa ký tự đặc biệt
        str = str.replace(/([^0-9a-z-\s])/g, '');

        return str;
    };

    componentDidMount() {
        this.requestSendMessage();
        configSocket.config();
    }

    onClickGetFriends = () => {
        this.setState({friends: this.props.friends})
    };
    onClickGetChatGroups = () => {
        const chatGroups = this.props.friends.filter(friend => friend.members);
        this.setState({friends: chatGroups})
    };
    onGetChatGroupId = (conversationId) => {
        let inputMessage = document.getElementById("input-message" + conversationId);
        inputMessage.value = "";
        this.props.getChatGroupId(conversationId);
    };
    onGetConversationId = (conversationId) => {
        this.props.getConversationId(conversationId);
    };
    // updateScroll = () => {
    //     $('.chatmsg-container').animate({scrollTop: $('.chatmsg-container').prop('scrollHeight')}, 1000);
    // };
    updateScroll = () => {
        $('.chatmsg-container').animate({
            scrollTop: $('.chatmsg-container')[0].scrollHeight
        }, 1000);
    };
    getTimeDifference = (updatedAt) => {
        let statusMomentDiff = false;
        let statusMomentFormat = false;
        const momentDiff = moment(updatedAt).fromNow();
        const momentFormat = moment(updatedAt).format("HH:mm");
        [...Array(60)].forEach((value, i) => {
            let check1 = i + " minutes ago";
            let check2 = i + " hours ago";
            let check3 = i + " days ago";

            switch (momentDiff) {
                case check1:
                    return statusMomentDiff = true;
                case check2:
                    return statusMomentDiff = true;
                case check3:
                    return statusMomentFormat = true;
                case "a few seconds ago":
                    return statusMomentDiff = true;
                case "a minute ago":
                    return statusMomentDiff = true;
                case "an hour ago":
                    return statusMomentDiff = true;
                case "an day ago":
                    return statusMomentFormat = true;
            }
        });

        if (statusMomentDiff && !statusMomentFormat) {
            return momentFormat;
        }
        return momentDiff;

    };
    onChangeIsRead = (conversationId) => {
        const chatGroup = document.getElementById(conversationId);
        chatGroup.style.fontWeight = "normal";
        chatGroup.style.cssText = 'color: #868e96 !important';
    };

    render() {
        return (
            <div className="col-md-4 border-right" id="chat-container">
                <div className="settings-tray settings-tray--le">
                    <img
                        className="profile-image"
                        src={user.profileImage}
                        alt="Profile img"
                    />
                    <span className="settings-tray--right">
                        <Link to="/home"><i className="fas fa-home"/></Link>
                        <i className="fa fa-facebook-messenger"
                           onClick={() => this.onClickGetFriends()}
                        />
                        <i className="fas fa-users"
                           onClick={() => this.onClickGetChatGroups()}
                        />
                    </span>
                </div>
                <div className="search-box">
                    <div className="input-wrapper">
                        <i className="fas fa-search"/>
                        <input type="text" name="name" id="name" className="txt" tabIndex="1"
                               onChange={this.handleChange}
                               placeholder="Seach..." required/>
                    </div>
                </div>
                <div className="list-users">
                    {
                        this.state.friends.map((friend, i) => (
                            friend.members ? (
                                <div key={i}
                                     className="friend-drawer friend-drawer--onhover"
                                     onClick={() => {
                                         this.onGetChatGroupId(friend._id);
                                         this.onGetConversationId(friend._id);
                                         this.onChangeIsRead(friend.chatGroupId)
                                     }}
                                >
                                    <Link to={"/home/message/" + friend._id}
                                          className="chat-group-left"
                                          onClick={() => this.updateScroll()}
                                    >
                                        <img
                                            className="profile-image"
                                            src={chatGroupsImg}
                                            alt="anh friend dad"
                                        />
                                        <div className="text">
                                            {
                                                friend.name.length > 19 ? (
                                                    <div>
                                                        <h6 style={{
                                                            color: "#dc3545",
                                                            fontWeight: 600,
                                                            display: "inline-block"
                                                        }}>{friend.name.substr(0, 16)}</h6><span
                                                        style={{fontSize: "1rem"}}>...</span>
                                                    </div>
                                                ) : (<h6 style={{color: "#dc3545", fontWeight: 600}}>{friend.name}</h6>)
                                            }

                                            <p id={friend.chatGroupId} className="text-muted">{friend.firstMessage}</p>
                                        </div>

                                        <span
                                            className="time text-muted small">{this.getTimeDifference(friend.updatedAt)}</span>
                                    </Link>
                                </div>
                            ) : (
                                <div
                                    className="friend-drawer friend-drawer--onhover"
                                    key={i}
                                    onClick={() => {
                                        this.onGetChatGroupId(friend._id);
                                        this.onGetConversationId(friend._id);
                                        this.onChangeIsRead(friend.user[0]._id);
                                    }}
                                >
                                    <Link to={"/home/message/" + friend._id}
                                          className="chat-group-left"
                                          onClick={() => this.updateScroll()}
                                    >
                                        <img
                                            className="profile-image"
                                            src={friend.user[0].profileImage}
                                            alt
                                        />
                                        <div className="text">
                                            {
                                                (friend.user[0].lastName + friend.user[0].firstName).length > 19 ? (
                                                    <h6>{(friend.user[0].lastName + " " + friend.user[0].firstName).substr(0, 17)}...</h6>
                                                ) : (<h6>{friend.user[0].lastName} {friend.user[0].firstName}</h6>)
                                            }

                                            <p id={friend.user[0]._id} className="text-muted">{friend.firstMessage}</p>
                                        </div>
                                        <span
                                            className="time text-muted small">{this.getTimeDifference(friend.updatedAt)}
                                        </span>
                                    </Link>

                                </div>
                            )
                        ))
                    }
                </div>

            </div>
        );
    }
}

// const sortCreatedAt = (data) => {
//     return data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
// };

const mapStateToProps = state => ({
    friends: state.messageReducer.friends,
    conversationId: state.messageReducer.conversationId,
    messages: state.messageReducer.messages,
});
const mapDispatchToProps = dispatch => ({
    getChatGroupId: (conversationId) => dispatch(messageActions.getChatGroupId(conversationId)),
    getConversationId: (conversationId) => dispatch(messageActions.getConversationId(conversationId)),
    updatedAtWhenSubmit: (conversationId, friends) => dispatch(messageActions.updatedAtWhenSubmit(conversationId, friends)),
    changeIsRead: (messageId) => dispatch(messageActions.changeIsRead(messageId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ListUsers);
