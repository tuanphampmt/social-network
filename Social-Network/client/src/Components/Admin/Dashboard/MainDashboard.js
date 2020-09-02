import React, {Component} from 'react';
import Nav from "../HomeAdmin/Header/Nav";

import Modal from "../HomeAdmin/Modal";
import BlogOverview from "./BlogOverview";
import "./shards-dashboards.1.1.0.min.css"
class MainDashboard extends Component {
    render() {
        return (
            <div id="page-top">
                <div id="wrapper">
                    <Nav/>
                    <BlogOverview/>
                </div>
                <a className="scroll-to-top rounded" href="#page-top">
                    <i className="fas fa-angle-up"/>
                </a>
                <Modal/>
            </div>
        );
    }
}

export default MainDashboard;
