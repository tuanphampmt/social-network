import React, {Component} from 'react';

class Tets extends Component {
    render() {
        return (
            <div>
                <li className="nav-item dropdown no-arrow mx-1">
                    <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="alertsDropdown"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <i className="fa fa-bell"/>
                        {/* Counter - Alerts */}
                        <span className="badge badge-danger badge-counter"
                              id="bell"
                        >
                                            {this.state.countNotifications !== 0 ? `${this.state.countNotifications}+` : ""}
                                        </span>
                        <p className="active-bottom bell">Notifi</p>
                    </a>
                    {/* Dropdown - Alerts */}
                    <div
                        className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        aria-labelledby="alertsDropdown"
                    >
                        <h6 className="dropdown-header">Alerts Center</h6>
                        {
                            this.state.notifications.map((notification, i) => {
                                if (notification.type === "ADD_FRIEND") {
                                    return (
                                        <div>
                                            <a className="dropdown-item d-flex align-items-center"
                                               href={"/home/profile/" + notification.user[0]._id}>
                                                <div className="mr-3">
                                                    <img className="icon-circle bg-primary"
                                                         src={notification.user[0].profileImage}
                                                         alt=" img thong bao"/>
                                                </div>
                                                <div className="noti">
                                                    <div className="small text-gray-500">December 12,
                                                        2019
                                                    </div>
                                                    <span className="font-weight-bold">
                                                                        {notification.user[0].lastName} {notification.user[0].firstName} you a friend request.
                                                                     </span>
                                                </div>
                                            </a>
                                            <hr/>
                                        </div>
                                    )
                                }
                                if (notification.type === "CONFIRM_FRIEND") {
                                    return (
                                        <div>
                                            <a className="dropdown-item d-flex align-items-center"
                                               href={"/home/profile/" + notification.user[0]._id}>
                                                <div className="mr-3">
                                                    <img className="icon-circle bg-primary"
                                                         src={notification.user[0].profileImage}
                                                         alt=" img thong bao"/>
                                                </div>
                                                <div className="noti">
                                                    <div className="small text-gray-500">December 12,
                                                        2019
                                                    </div>
                                                    <span className="font-weight-bold">
                                                                    {notification.user[0].lastName} {notification.user[0].firstName} accepted your friend request.
                                                                </span>
                                                </div>
                                            </a>
                                            <hr/>
                                        </div>
                                    )
                                }
                                return (
                                    <div>
                                        <a className="dropdown-item d-flex align-items-center"
                                           href={"/home/profile/" + notification.user[0]._id}>
                                            <div className="mr-3">
                                                <div className="icon-circle bg-primary">
                                                    <img className="icon-circle bg-primary"
                                                         src={notification.user[0].profileImage}
                                                         alt=" img thong bao"/>
                                                </div>
                                            </div>
                                            <div className="noti">
                                                <div className="small text-gray-500">December 12,
                                                    2019
                                                </div>
                                                <span className="font-weight-bold">
                                                                    {notification.user[0].lastName} {notification.user[0].firstName} has canceled your friend request..
                                                                </span>
                                            </div>
                                        </a>
                                        <hr/>
                                    </div>
                                )
                            })
                        }


                        <a
                            className="dropdown-item text-center small text-gray-500"
                            href="#"
                        >
                            Show All Alerts
                        </a>
                    </div>
                </li>

            </div>
        );
    }
}

export default Tets;
