import React, {Component} from 'react';
import LeftFixed from "./LeftFixed";
import MainNotFixed from "./MainNotFixed";

import './main-content.css'
import Nav from "./Header/Nav";

import RightFixed from "./RightFixed";
import * as userActions from "../../Actions/user.action";
import * as contactActions from "../../Actions/contact.action";
import {connect} from "react-redux";
import * as configSocket from "../../socket/configSocket"

// const token = JSON.parse(localStorage.getItem("jwt"));

class MainHome extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        configSocket.config();

    }

    getProfileImage = (path) => {
        console.log(path)
        this.setState({
            profileImage: path
        })
    };

    render() {
        return (
            <div>
                <Nav/>
                <div className="content">
                    <div className="wrapper">
                        <LeftFixed
                            getProfileImage={(path) => this.getProfileImage(path)}
                        />
                        <MainNotFixed
                            profileImage={this.state.profileImage}
                        />
                        <RightFixed/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({

});
export default connect(null, mapDispatchToProps)(MainHome);
