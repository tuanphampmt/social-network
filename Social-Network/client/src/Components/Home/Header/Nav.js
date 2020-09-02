import React, {Component} from 'react';
import {NavLink} from 'react-router-dom'
import "./main-header.css"
import Search from "./Search";
import axios from "axios";

import {connect} from "react-redux";
import * as configSocket from "../../../socket/configSocket";
import * as AuthService from "../../../Services/auth-header.service";
import * as contactActions from "../../../Actions/contact.action";
import * as messageActions from "../../../Actions/message.action";

const user = JSON.parse(localStorage.getItem('user'));


class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countFriends: 0,
            countNotifications: 0,
            notifications: [],
            contacts: [],
            friend: ""
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.friend) {
            this.setState({friend: nextProps.friend})
        }
        this.setState({
            contacts: nextProps.contacts,
            countFriends: nextProps.countFriends,

        })
    }

    requestConfirmFriend = () => {
        configSocket.socket.on("request-confirm-friend", data => {
            let friends = document.getElementById("friends").innerHTML;
            let bell = document.getElementById("bell").innerHTML;
            let countFriends;
            let countNotifications;
            friends ? (countFriends = +friends[1] - 1) : countFriends = 0;
            bell ? (countNotifications = +bell[1] + 1) : countNotifications = 1;
            this.state.notifications.unshift(data);
            this.setState({
                countFriends: countFriends,
                notifications: this.state.notifications,
                countNotifications: countNotifications
            })
        });

    };
    requestAddFriend = () => {
        configSocket.socket.on("request-add-friend", data => {
            let friends = document.getElementById("friends").innerHTML;
            let bell = document.getElementById("bell").innerHTML;
            let countFriends;
            let countNotifications;
            friends ? (countFriends = +friends[1] + 1) : countFriends = 1;
            bell ? (countNotifications = +bell[1] + 1) : countNotifications = 1;
            this.state.notifications.unshift(data);
            this.setState({
                countFriends: countFriends,
                notifications: this.state.notifications,
                countNotifications: countNotifications
            })
        });

    };
    emitCancelRequest = () => {
        configSocket.socket.on("emit-cancel-request", data => {
            let friends = document.getElementById("friends").innerHTML;
            let bell = document.getElementById("bell").innerHTML;
            let countFriends;
            let countNotifications;
            friends ? (countFriends = +friends[1] - 1) : countFriends = 1;
            bell ? (countNotifications = +bell[1] - 1) : countNotifications = 1;

            this.state.notifications.unshift(data);
            this.setState({
                countFriends: countFriends,
                notifications: this.state.notifications,
                countNotifications: countNotifications
            })
        });
    };

    componentDidMount() {
        this.props.getContactsByStatusIsTrue();
        this.props.getCountFriends();
        this.requestConfirmFriend();
        this.requestAddFriend();
        this.emitCancelRequest();
        this.props.getContacts();
        (async () => {
            const res = await axios.get("/api/notification/getByIdAndLimit", {
                headers: AuthService.authHeader()
            });
            const {data} = res;
            this.setState({
                notifications: data.notifications,
                countNotifications: data.notifications.length
            });
        })()

    }

    render() {

        return (
            <div className="headerfixed topbar">
                <div className="header">

                    <div className="wrapper">

                        <Search/>

                        <div className="icon-bar">
                            <ul>

                                <li>
                                    <NavLink
                                        exact
                                        to="/home"
                                        activeClassName="active"
                                    >
                                        <i className="fa fa-home"/>

                                        <p className="active-bottom home">Home</p>
                                    </NavLink>
                                </li>

                                <li>
                                    {" "}
                                    <NavLink
                                        exact
                                        to={"/home/profile/" + user._id}
                                        activeClassName="active"
                                    >
                                        <i className="fa fa-user"
                                           onClick={this.handleClick}
                                        />

                                        <p className="active-user user">Profile</p>
                                    </NavLink>
                                    {" "}
                                </li>

                                <li>
                                    <NavLink
                                        exact
                                        to="/home/society"
                                        activeClassName="active"
                                    >
                                        <i className="fa fa-users">
                                            <p id="friends">
                                                {this.state.countFriends !== 0 ? `(${this.state.countFriends})` : ""}
                                            </p>
                                        </i>

                                        <p className="active-bottom users">Society</p>
                                    </NavLink>
                                </li>

                                <li>
                                    {" "}
                                    {
                                        <NavLink
                                            exact
                                            to={"/home/message/" + this.state.friend._id}
                                            activeClassName="active"

                                        >
                                            <i className="fa fa-facebook-messenger" aria-hidden="true"/>
                                            <p className="active-bottom messages">Mess</p>
                                        </NavLink>
                                    }

                                </li>


                                <li>
                                    <a
                                        href="#notifications"
                                    >
                                        <i className="fa fa-bell"
                                           onClick={() => {
                                               const notificationContainer = document.getElementById("notify")
                                               if (notificationContainer.style.display === "block") {
                                                   notificationContainer.style.display = "none"
                                               } else {
                                                   notificationContainer.style.display = "block"
                                               }

                                           }}
                                        >
                                            <p id="bell">
                                                {this.state.countNotifications !== 0 ? `(${this.state.countNotifications})` : ""}
                                            </p>
                                        </i>
                                        <p className="active-bottom bell">Notifi</p>
                                    </a>

                                    <div id="notify"
                                    >
                                        <div className="header-notifications">
                                            <p id="Notifications">Notifications</p>
                                        </div>
                                        {
                                            this.state.notifications.map((notification, i) => (
                                                <div key={i} className="notification-item">
                                                    <a href={"/home/profile/" + notification.user[0]._id}
                                                       id="notify-user">
                                                        <div className="small text-gray-500">December 12, 2019</div>
                                                        <img src={notification.user[0].profileImage}
                                                             alt="Anh thong bao"/>
                                                        {notification.type === "ADD_FRIEND" ? (
                                                            <p className="bell-add-friend">
                                                            <span
                                                                style={{color: '#28a745'}}>{notification.user[0].lastName} {notification.user[0].firstName}</span> sent
                                                                you a friend request.
                                                            </p>
                                                        ) : notification.type === "CONFIRM_FRIEND" ? (
                                                            <p className="bell-confirm-friend">
                                                            <span
                                                                style={{color: '#28a745'}}>{notification.user[0].lastName} {notification.user[0].firstName}</span> accepted
                                                                your friend request.
                                                            </p>
                                                        ) : (
                                                            <p className="bell-cancel-request">
                                                            <span
                                                                style={{color: '#dc3545'}}>{notification.user[0].lastName} {notification.user[0].firstName}</span> has
                                                                canceled your friend request.
                                                            </p>
                                                        )}
                                                    </a>
                                                    <hr style={(notification.user[0].lastName + notification.user[0].firstName).length > 14 ? {
                                                        backgroundColor: "white",
                                                        width: "100%",
                                                        marginTop: "39px",
                                                        marginBottom: "10px"
                                                    } : {
                                                        backgroundColor: "white",
                                                        width: "100%",
                                                        marginTop: "21px",
                                                        marginBottom: "10px"
                                                    }}/>
                                                </div>
                                            ))
                                        }
                                        <a className="dropdown-item text-center small text-gray-500"
                                           href="#">Show All Alerts</a>
                                    </div>
                                </li>
                            </ul>
                        </div>

                    </div>

                </div>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    contacts: state.contactReducer.contacts,
    countFriends: state.contactReducer.countFriends,
    friend: state.messageReducer.friends[0],
});
const mapDispatchToProps = dispatch => ({
    getContacts: () => dispatch(contactActions.getContacts()),
    getCountFriends: () => dispatch(contactActions.getCountFriends()),
    getContactsByStatusIsTrue: () => dispatch(messageActions.getContactsByStatusIsTrue()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Nav);

