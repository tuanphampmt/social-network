import React, {Component} from 'react';
import Nav from "./Header/Nav";
import Modal from "./Modal";
import Content from "./Content";
import "./main.css"
import * as adminActions from "../../../Actions/admin.action";

class MainHomeAdmin extends Component {

    componentDidMount() {
        (async () => {
            await adminActions.getUsers()
        })()
    }

    render() {
        return (
            <div id="page-top">
                <div id="wrapper">
                    <Nav/>
                    <Content/>
                </div>
                <a className="scroll-to-top rounded" href="#page-top">
                    <i className="fas fa-angle-up"/>
                </a>
                <Modal/>
            </div>

        );
    }
}

export default MainHomeAdmin;
