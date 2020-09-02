import React, {Component} from 'react';
import TableUsers from "./TablePosts";
import Nav from "../Header/Nav";
import * as adminActions from "../../../../Actions/admin.action";

class MainTablePosts extends Component {
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
                    <TableUsers/>
                </div>
            </div>
        );
    }
}


export default MainTablePosts;
