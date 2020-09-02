import React, {Component} from 'react';
import * as userActions from "../../Actions/user.action";
import * as contactActions from "../../Actions/contact.action.js";
import other_profile from "../images/profile/upload.png"
import {connect} from "react-redux";
import * as configSocket from "../../socket/configSocket"
import {ObjectID} from 'bson';


class RightFixed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            sentFriend: [],
            notSentFriend: [],
            contacts: []
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const notSentFriend = difference(nextProps.users, nextProps.contacts);
        const array = [];
        for (let i = 0; i < notSentFriend.length; i++) {
            if (notSentFriend[i].isVerified) {
                array.push(notSentFriend[i]);
            }
            if (array.length === 5) break;
        }
        this.setState({
            contacts: nextProps.contacts,
            sentFriend: nextProps.contacts,
            notSentFriend: array
        })
    }

    requestAddFriend = () => {
        configSocket.socket.on("request-add-friend", data => {
            this.state.notSentFriend = this.state.notSentFriend.filter(u => u._id !== data.user[0]._id);
            this.setState({
                notSentFriend: this.state.notSentFriend
            })
        });

    };
    emitCancelRequest = () => {
        configSocket.socket.on("emit-cancel-request", data => {
            this.state.notSentFriend.unshift({
                _id: data.user[0]._id,
                firstName: data.user[0].firstName,
                lastName: data.user[0].lastName,
                profileImage: data.user[0].profileImage,
                isVerified: true
            });
            this.setState({
                notSentFriend: this.state.notSentFriend
            })
        });
    };

    componentDidMount() {
        this.emitCancelRequest();
        this.requestAddFriend();
        configSocket.config();
        this.props.getAllUsers();
        this.props.getContacts();
    }

    handleClick = (userID, friendID, followQuantity) => {
        this.props.follow(userID, friendID, followQuantity);
        const users = this.state.users.filter(item => item._id !== friendID);
        this.setState({users: users})
    };

    addFriend = (contactId) => {
        const notificationId = new ObjectID();
        configSocket.socket.emit('add-friend', {
            contactId: contactId,
            notificationId: notificationId,
            type: "ADD_FRIEND"
        });
        this.props.addFriend(contactId, notificationId);
        const addFriendSociety = document.getElementById("add-friend-society-" + contactId);
        const cancelReqSociety = document.getElementById("cancel-request-society-" + contactId);
        const addFriend = document.getElementById("add-friend-" + contactId);
        const cancelReq = document.getElementById("cancel-request-" + contactId);
        if (addFriendSociety) addFriendSociety.style.display = 'none';
        if (cancelReqSociety) cancelReqSociety.style.display = 'block';
        if (addFriend) addFriend.style.display = 'none';
        if (cancelReq) cancelReq.style.display = 'block';


    };
    cancelRequest = (contactId) => {
        const notificationId = new ObjectID();
        configSocket.socket.emit('cancel-request', {
            contactId: contactId,
            notificationId: notificationId,
            type: "CANCEL_REQUEST"
        });
        this.props.cancelRequest(contactId, notificationId);
        const addFriendSociety = document.getElementById("add-friend-society-" + contactId);
        const cancelReqSociety = document.getElementById("cancel-request-society-" + contactId);
        const addFriend = document.getElementById("add-friend-" + contactId);
        const cancelReq = document.getElementById("cancel-request-" + contactId);
        if (addFriendSociety) addFriendSociety.style.display = 'block';
        if (cancelReqSociety) cancelReqSociety.style.display = 'none';
        if (addFriend) addFriend.style.display = 'block';
        if (cancelReq) cancelReq.style.display = 'none';


    };

    render() {
        return (
            <div>
                <div className="rightfixed">
                    <div className="sidebarright">
                        {
                            this.state.notSentFriend.map((friend, i) => friend.isVerified && (
                                <div className="rightcontent"
                                     key={i}
                                >
                                    <a href={"/home/profile/" + friend._id}>
                                        <img alt=" " src={friend.profileImage ? friend.profileImage : other_profile}/>
                                        <p className="name">{friend.lastName} {friend.firstName}</p>
                                    </a>

                                    <button id={"cancel-request-" + friend._id}
                                            className="btn btn-danger cancel-request"
                                            onClick={() => this.cancelRequest(friend._id)}
                                            style={{display: 'none'}}
                                    >
                                        <i className="fas fa-user-times"/>Cancel Request
                                    </button>
                                    <button id={"add-friend-" + friend._id}
                                            className={"btn btn-danger"}
                                            onClick={() => this.addFriend(friend._id)}
                                    >
                                        <i className="fas fa-user-plus"/>Add Friend
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="rightfixed" id="footer">
                    <div
                        className="sidebarright"
                    >
                        <div className="foot">
                            <div className="social text-center">
                                <a href="https://www.facebook.com/phamminhtuan.317" target="_blank"
                                   rel="noopener noreferrer">
                                    <i className="fab fa-facebook"/>
                                </a>
                                <a href="https://www.facebook.com/groups/nhompi2020/" target="_blank"
                                   rel="noopener noreferrer">
                                    <i className="fas fa-users"/>
                                </a>
                                <a href="#1" target="_blank">
                                    <i className="fab fa-font-awesome-flag"/>
                                </a>
                                <a href="#1">
                                    <i className="fab fa-youtube"/>
                                </a>
                            </div>

                            <p>Copyright © Tuan Pham 2020 All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const difference = (A, B) => {
    let count = 0, C = [];
    for (let i = 0; i < A.length; i++) {
        count = 0;
        for (let j = 0; j < B.length; j++) {
            if (A[i]._id === B[j].contactId || A[i]._id === B[j].userId) break;
            count++;
        }
        if (count === B.length) {
            C.push(A[i])
        }
    }
    return C
};

const mapStateToProps = state => ({
    users: state.userReducer,
    contacts: state.contactReducer.contacts
});
const mapDispatchToProps = dispatch => ({
    follow: (userID, friendID, followQuantity) => dispatch(userActions.follow(userID, friendID, followQuantity)),
    addFriend: (contactId, notificationId) => dispatch(contactActions.addFriend(contactId, notificationId)),
    cancelRequest: (contactId, notificationId) => dispatch(contactActions.cancelRequest(contactId, notificationId)),
    getAllUsers: () => dispatch(userActions.getAllUsers()),
    getContacts: () => dispatch(contactActions.getContacts())
});
export default connect(mapStateToProps, mapDispatchToProps)(RightFixed);
