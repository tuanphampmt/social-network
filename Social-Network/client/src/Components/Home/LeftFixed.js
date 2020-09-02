import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import {logout} from '../utils/index.util'
import * as postActions from "../../Actions/post.action";
import * as userActions from "../../Actions/user.action";
import {connect} from "react-redux";
import upload from "../images/profile/upload.png"
import * as contactActions from "../../Actions/contact.action";

const user = JSON.parse(localStorage.getItem('user'));

class LeftFixed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileImage: "",
        }
    }

    handleLogout = () => {
        logout();
        this.setState({
            isLogin: false
        })
    };

    componentWillReceiveProps(nextProps, nextContext) {
        const contacts = nextProps.contacts.map(ct => {
            if ((ct.contactId === user._id && ct.status) || (ct.userId === user._id && ct.status))
                return ct
        });
        this.setState({
            profileImage: nextProps.profileImage,
            friendQuantity: contacts.length
        })
    }

    componentDidMount() {
        this.props.getCurrentUser();
    }

    isChangeUpLoad = async (e) => {
        const formData = new FormData();
        formData.append("file", e.target.files[0])
        formData.append('upload_preset', 'tuanpham');
        const path = await postActions.uploadProfileImg(formData);
        delete user.profileImage;
        user.profileImage = path;
        localStorage.setItem("user", JSON.stringify(user));
        this.props.getProfileImage(path);
        this.setState({
            profileImage: path
        })
    };

    render() {
        const profileImage = this.state.profileImage;
        return (
            <div className="leftfixed">
                <div className="sidebarleft gradient-box">
                    <img src={profileImage ? profileImage : user.profileImage ? user.profileImage : upload}
                         alt=" profile"/>
                    <input type="file" name="file"
                           className="profileImg"
                           onChange={this.isChangeUpLoad}
                    />
                    <p id="sidename">{user.lastName} {user.firstName}</p>
                    <Link to={"/home/profile/" + user._id} id="viewall">
                        View All
                    </Link>
                    <hr/>
                    <p id="nosociety">{this.state.friendQuantity}</p>
                    <p id="societyname">
                        <a href="#Friends">Friends</a>
                    </p>
                    <p id="logout">
                        <Link to="/" className="button gradient-button" onClick={this.handleLogout}>Log Out</Link>
                    </p>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    profileImage: state.currentUserReducer.profileImage,
    contacts: state.contactReducer.contacts
});
const mapDispatchToProps = dispatch => ({
    getCurrentUser: () => dispatch(userActions.getCurrentUser()),
    getContacts: () => dispatch(contactActions.getContacts()),
});
export default connect(mapStateToProps, mapDispatchToProps)(LeftFixed);
