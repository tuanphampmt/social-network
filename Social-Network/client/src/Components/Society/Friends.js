import React, {Component} from 'react';
import imgFriend from '../images/profile/upload1.png'
// import * as userActions from "../../Actions/user.action";
import * as contactActions from "../../Actions/contact.action.js";
import {connect} from "react-redux";
import * as userActions from "../../Actions/user.action";
import * as configSocket from "../../socket/configSocket";
import {ObjectID} from "bson";

const user = JSON.parse(localStorage.getItem('user'));

class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            contacts: [],
            sentFriend: [],
            notSentFriend: []
        }

    }

    componentWillReceiveProps(nextProps, nextContext) {
        const user = JSON.parse(localStorage.getItem('user'));
        const array = [];
        nextProps.contacts.map(ct => {
            if (ct.contactId === user._id) return array.push(ct);
        });
        let friends = [];
        nextProps.contacts.map(ct => {
            if (ct.userId !== user._id && !ct.status) return friends.push(ct)
        });
        const notSentFriend = difference(nextProps.users, nextProps.contacts);
        this.setState({
            sentFriend: array,
            notSentFriend: notSentFriend,
            countFriends: friends.length
        })
    }

    requestAddFriend = () => {
        configSocket.socket.on("request-add-friend", data => {
            this.state.sentFriend.unshift(data);
            this.state.notSentFriend = this.state.notSentFriend.filter(u => u._id !== data.user[0]._id);
            this.setState({
                sentFriend: this.state.sentFriend,
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
            this.state.sentFriend = this.state.sentFriend.filter(u => u.user[0]._id !== data.user[0]._id);
            this.setState({
                sentFriend: this.state.sentFriend,
                notSentFriend: this.state.notSentFriend
            })
        });
    };

    componentDidMount() {
        this.props.getAllUsers();
        this.props.getContacts();
        this.requestAddFriend();
        this.emitCancelRequest();
    }

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
    confirm = (senderId) => {
        const notificationId = new ObjectID();
        configSocket.socket.emit('confirm-friend', {
            contactId: senderId,
            notificationId: notificationId,
            type: "CONFIRM_FRIEND"
        });
        this.state.sentFriend = this.state.sentFriend.filter(ct => ct.user[0]._id !== senderId);
        this.props.confirmFriend(senderId, user._id, notificationId);
        this.setState({sentFriend: this.state.sentFriend});

        let friends = document.getElementById("friends").innerHTML;
        let bell = document.getElementById("bell").innerHTML;
        if (+friends[1] === 1 || +friends[1] === 0) {
            document.getElementById("friends").innerHTML = ""
        } else {
            document.getElementById("friends").innerHTML = `(${+friends[1] - 1})`;
        }

        if (+bell[1] === 1 || +bell[1] === 0) {
            document.getElementById("bell").innerHTML = ""
        } else {
            document.getElementById("bell").innerHTML = `(${+bell[1] - 1})`;
        }
    };
    deleteContact = (contactId) => {
        this.state.sentFriend = this.state.sentFriend.filter(ct => ct.user[0]._id !== contactId);
        this.setState({sentFriend: this.state.sentFriend});
        this.props.removeContact(contactId)
    };

    render() {
        return (
            <div className="people">
                <div className="row">
                    {
                        this.state.sentFriend.map((contact, i) => {
                            if (!contact.status) {
                                return (
                                    <div className="connection" key={i}>
                                        <img
                                            src={contact.user[0].profileImage ? contact.user[0].profileImage : imgFriend}
                                            alt=" anh friend"/>
                                        <h5>{contact.user[0].lastName} {contact.user[0].firstName}</h5>
                                        <p>10 <i className="fa fa-user"/> Friends</p>
                                        <div className="confirm-delete">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => this.confirm(contact.user[0]._id)}
                                            >
                                                <i className="fas fa-user-plus"/>Confirm
                                            </button>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => this.deleteContact(contact.user[0]._id)}
                                            >
                                                <i className="fas fa-user-times"/>Delete
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
                {this.state.countFriends ? <hr/> : ""}
                <div className="row">
                    {
                        // this.mapUsers
                        this.state.notSentFriend.map((friend, i) => {
                            if (friend.isVerified) {
                                return (
                                    <div className="connection" key={i}>
                                        <img src={friend.profileImage ? friend.profileImage : imgFriend}
                                             alt=" anh friend"/>
                                        <h5>{friend.lastName} {friend.firstName}</h5>
                                        <p>10 <i className="fa fa-user"/> Friends</p>
                                        <button id={"cancel-request-society-" + friend._id}
                                                className="btn btn-danger cancel-request"
                                                onClick={() => this.cancelRequest(friend._id)}
                                                style={{display: 'none'}}
                                        >
                                            <i className="fas fa-user-times"/>Cancel Request
                                        </button>
                                        <button id={"add-friend-society-" + friend._id}
                                                className={"btn btn-danger"}
                                                onClick={() => this.addFriend(friend._id)}
                                        >
                                            <i className="fas fa-user-plus"/>Add Friend
                                        </button>
                                    </div>
                                )
                            }
                        })
                    }
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
            if (A[i]._id === B[j].userId || A[i]._id === B[j].contactId) break;
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
    addFriend: (contactId, notificationId) => dispatch(contactActions.addFriend(contactId, notificationId)),
    cancelRequest: (contactId, notificationId) => dispatch(contactActions.cancelRequest(contactId, notificationId)),
    getAllUsers: () => dispatch(userActions.getAllUsers()),
    getContacts: () => dispatch(contactActions.getContacts()),
    confirmFriend: (senderId, receiverId, notificationId) => dispatch(contactActions.confirmFriend(senderId, receiverId, notificationId)),
    removeContact: (contactId) => dispatch(contactActions.removeContact(contactId))
});
export default connect(mapStateToProps, mapDispatchToProps)(Friends);
