import React, {Component} from 'react';
import {Link} from 'react-router-dom'
class Nav extends Component {
    render() {
        return (
            <ul
                className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
                id="accordionSidebar"
            >
                {/* Sidebar - Brand */}
                <a
                    className="sidebar-brand d-flex align-items-center justify-content-center"
                    href="/home-admin"
                >
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-laugh-wink"/>
                    </div>
                    <div className="sidebar-brand-text mx-3">
                        Admin <sup>2</sup>
                    </div>
                </a>
                {/* Divider */}
                <hr className="sidebar-divider my-0"/>
                {/* Nav Item - Dashboard */}
                <li className="nav-item active">
                    <Link className="nav-link" to="/home-admin">
                        <i className="fas fa-fw fa-tachometer-alt"/>
                        <span>Dashboard</span>
                    </Link>
                </li>
                {/* Divider */}
                <hr className="sidebar-divider"/>
                {/* Heading */}

                <div className="sidebar-heading">
                    Collections
                </div>

                {/* Nav Item - Tables */}
                <li className="nav-item">
                    <Link className="nav-link" to="/table-users">
                        <i className="fas fa-fw fa-table"/>
                        <span>Users</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/table-posts">
                        <i className="fas fa-fw fa-table"/>
                        <span>Posts</span>
                    </Link>
                </li>
                {/* Divider */}
                <hr className="sidebar-divider d-none d-md-block"/>
                {/* Sidebar Toggler (Sidebar) */}
                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle"/>
                </div>
            </ul>
        );
    }
}

export default Nav;
