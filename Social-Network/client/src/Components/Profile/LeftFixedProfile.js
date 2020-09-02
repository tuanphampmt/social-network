import React, {Component} from 'react';
import {connect} from "react-redux";
import {Link} from 'react-router-dom'
import society1 from "../images/login/profile/society1.jpg"
import society2 from "../images/login/profile/society2.jpg"
import society3 from "../images/login/profile/society3.jpg"
import upload from "../images/profile/upload.png"
import {logout} from "../utils/index.util";
import * as postActions from "../../Actions/post.action";
import PerEdit from "./EditForm/PerEdit";
import HighEdit from "./EditForm/HighEdit";
import UniEdit from "./EditForm/UniEdit";
import AddressEdit from "./EditForm/AddressEdit";
import MoreEdit from "./EditForm/MoreEdit";
import {ObjectID} from "bson";
import * as configSocket from "../../socket/configSocket";
import * as contactActions from "../../Actions/contact.action";


const user = JSON.parse(localStorage.getItem('user'));

class LeftFixedProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profileImage: "",
            coverImages: [],
            isContact: undefined,
            isAddFriend: undefined,
        };
    }

    handleLogout = () => {
        logout();
        this.setState({
            isLogin: false
        })
    };

    componentWillReceiveProps(nextProps, nextContext) {

        this.setState({
            profileImage: nextProps.user.profileImage,
            coverImages: nextProps.user.coverImages,
            firstName: nextProps.user.firstName,
            lastName: nextProps.user.lastName,
            email: nextProps.user.email,
            birthday: nextProps.user.birthday,
            sex: nextProps.user.sex,
            phone: nextProps.user.phone,
            religion: nextProps.user.religion,
            isContact: nextProps.isContact,
            isAddFriend: nextProps.isAddFriend
        })
    }

    componentDidMount() {

        this.props.getContacts();
    }

    setUser = (user) => {
        console.log(user);
        this.setState({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            birthday: user.birthday,
            sex: user.sex,
            phone: user.phone,
            religion: user.religion
        })
    }
    handleUpLoadProfileImg = async (e) => {
        console.log(e.target.files[0]);
        const formData = new FormData();
        formData.append("file", e.target.files[0])
        formData.append('upload_preset', 'tuanpham');
        const path = await postActions.uploadProfileImg(formData);
        delete this.props.user.profileImage;
        this.props.user.profileImage = path;
        this.setState({
            profileImage: path
        })
    };
    handleUpLoadCoverImages = async (e) => {
        console.log(e.target.files[0]);
        const formData = new FormData();
        formData.append("file", e.target.files[0])
        formData.append('upload_preset', 'tuanpham');
        const pathArr = await postActions.upLoadCoverImages(formData);
        window.location.reload();
        let arr = [];
        for (let i = 0; i < 3; i++) {
            arr.push(pathArr[i])
        }
        this.setState({
            coverImages: arr
        })
    };
    showSlides = () => {
        try {
            const length = this.state.coverImages.length;
            switch (length) {
                case 1:
                    return (
                        <div>
                            <div className="singleslide">
                                <img alt="hihi" src={this.state.coverImages[0]} className="slidimg"/>
                            </div>
                            <div className="singleslide">
                                <img alt="hihi" src={society1} className="slidimg"/>
                            </div>
                            <div className="singleslide">
                                <img alt="hihi" src={society2} className="slidimg"/>
                            </div>

                        </div>);
                case 2:
                    return (
                        <div>
                            <div className="singleslide">
                                <img alt="hihi" src={this.state.coverImages[0]} className="slidimg"/>
                            </div>
                            <div className="singleslide">
                                <img alt="hihi" src={this.state.coverImages[1]} className="slidimg"/>
                            </div>
                            <div className="singleslide">
                                <img alt="hihi" src={society1} className="slidimg"/>
                            </div>

                        </div>
                    );
                case 3:
                    return (
                        <div>
                            <div className="singleslide">
                                <img alt="hihi" src={this.state.coverImages[0]} className="slidimg"/>
                            </div>
                            <div className="singleslide">
                                <img alt="hihi" src={this.state.coverImages[1]} className="slidimg"/>
                            </div>
                            <div className="singleslide">
                                <img alt="hihi" src={this.state.coverImages[2]} className="slidimg"/>
                            </div>

                        </div>
                    );
                default:
                    return (
                        <div>
                            <div className="singleslide">
                                <img alt="hihi" src={society1} className="slidimg"/>
                            </div>
                            <div className="singleslide">
                                <img alt="hihi" src={society2} className="slidimg"/>
                            </div>
                            <div className="singleslide">
                                <img alt="hihi" src={society3} className="slidimg"/>
                            </div>
                        </div>
                    )
            }
        } catch (err) {

        }

    };

    addFriend = (contactId) => {
        const notificationId = new ObjectID();
        configSocket.socket.emit('add-friend', {
            contactId: contactId,
            notificationId: notificationId,
            type: "ADD_FRIEND"
        });
        this.props.addFriend(contactId, notificationId);
        const addFriendSociety = document.getElementById("add-friend-profile-" + contactId);
        const cancelReqSociety = document.getElementById("cancel-request-profile-" + contactId);
        const addFriend = document.getElementById("add-friend-" + contactId);
        const cancelReq = document.getElementById("cancel-request-" + contactId);
        console.log(cancelReqSociety)
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
        const addFriendSociety = document.getElementById("add-friend-profile-" + contactId);
        const cancelReqSociety = document.getElementById("cancel-request-profile-" + contactId);

        const addFriend = document.getElementById("add-friend-" + contactId);
        const cancelReq = document.getElementById("cancel-request-" + contactId);
        if (addFriendSociety) addFriendSociety.style.display = 'block';
        if (cancelReqSociety) cancelReqSociety.style.display = 'none';
        if (addFriend) addFriend.style.display = 'block';
        if (cancelReq) cancelReq.style.display = 'none';


    };
    onClickUnFriend = (e, contactId) => {
        e.preventDefault();

        this.setState({isContact: false});
        this.props.unFriend(contactId);
        const addFriendSociety = document.getElementById("add-friend-profile-" + contactId);
        if (addFriendSociety) addFriendSociety.style.display = 'block';
    };

    render() {
        const profileImage = this.state.profileImage;
        return (
            <div className="leftfixedprofile">
                {/* area of slide show */}
                <div className="slideshowcontainer">

                    {user._id === this.props.user._id ?
                        <div>
                            <input type="file" name="pic" className="chooseslide" accept="image/*"
                                   title="change slideshow image"
                                   onChange={this.handleUpLoadCoverImages}
                                   onMouseOver={() => this.props.stopTime()}
                                   onMouseOut={() => this.props.startTime()}

                            />
                            <p className="slideEdit">✎</p>
                        </div> : ""}

                    <div className="bubble">
                        <span className="dot" onClick={() => this.props.currentSlide(1)}/>
                        <span className="dot" onClick={() => this.props.currentSlide(3)}/>
                        <span className="dot" onClick={() => this.props.currentSlide(3)}/>
                    </div>
                    {this.showSlides()}
                    <div className="prev" onClick={() => this.props.plusSlides(-1)}>❮</div>
                    <div className="next" onClick={() => this.props.plusSlides(1)}>❯</div>
                </div>
                {/* End area of slideshow */}
                {/* start sidebar left profile */}
                <div className="sidebarleftprofile">
                    {/* change image */}
                    {user._id === this.props.user._id ?
                        <div>
                            <input type="file" name="file" className="chooseslide1" accept="image/*"
                                   title="change profile pic"
                                   onChange={this.handleUpLoadProfileImg}
                            />
                            <p className="slideEdit1">✎</p>
                        </div> : ""}
                    {/* End change image */}
                    <img alt="profile" src={profileImage ? profileImage : upload} title="Profile Pic"
                         className="profilepic"/>
                    <p id="sidename"> {this.state.lastName} {this.state.firstName}</p>
                    <p id="nosociety">{this.props.user.followQuantity}</p>
                    {
                        this.state.isContact && user._id !== this.props.user._id ? (
                            <div className="btn-group">
                                <button type="button" className="btn btn-danger dropdown-toggle"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fas fa-user-check"/>
                                </button>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="#unfriend"
                                       onClick={(e) => this.onClickUnFriend(e, this.props.user._id)}
                                    >
                                        <i className="fas fa-user-times"/>Unfriend
                                    </a>
                                </div>
                            </div>
                        ) : ""


                    }
                    {
                        this.state.isAddFriend && !this.state.isContact && user._id !== this.props.user._id ? (
                            <div>
                                <button id={"add-friend-profile-" + this.props.user._id}
                                        className={"btn btn-danger"}
                                        onClick={() => this.addFriend(this.props.user._id)}
                                        style={{display: 'none'}}
                                >
                                    <i className="fas fa-user-plus"/>Add Friend
                                </button>
                                <button id={"cancel-request-profile-" + this.props.user._id}
                                        className="btn btn-danger cancel-request"
                                        onClick={() => this.cancelRequest(this.props.user._id)}
                                >
                                    <i className="fas fa-user-times"/>Cancel Request
                                </button>
                            </div>

                        ) : !this.state.isAddFriend && !this.state.isContact && user._id !== this.props.user._id ? (
                            <div>
                                <button id={"cancel-request-profile-" + this.props.user._id}
                                        className="btn btn-danger cancel-request"
                                        onClick={() => this.cancelRequest(this.props.user._id)}
                                        style={{display: 'none'}}
                                >
                                    <i className="fas fa-user-times"/>Cancel Request
                                </button>

                                <button id={"add-friend-profile-" + this.props.user._id}
                                        className={"btn btn-danger"}
                                        onClick={() => this.addFriend(this.props.user._id)}
                                >
                                    <i className="fas fa-user-plus"/>Add Friend
                                </button>
                            </div>
                        ) : ""
                    }
                </div>

                <div className="timeline">
                    <div className="container left">
                        {user._id === this.props.user._id ?
                            <p className="slideEdit2" title="Edit" onClick={() => this.props.enableModal()}>✎</p> : ""}
                        <div className="tcontent">
                            <h2>Personal Detail</h2>
                            <h4>First Name:</h4>
                            <p>{this.state.firstName}</p>
                            <h4>Last Name:</h4>
                            <p>{this.state.lastName}</p>
                            <h4>Email:</h4>
                            <p>{this.state.email}</p>
                            <h4>Date Of Birth:</h4>
                            <p>12 Feb 1997</p>
                            <h4>Gender:</h4>
                            <p>{this.state.sex ? "Nam" : "Nữ"}</p>
                            <h4>Phone no:</h4>
                            <p>{this.state.phone ? this.state.phone : "Hãy nhập số điện thoại của bạn!!!"}</p>
                            <h4>Religion</h4>
                            <p>{this.state.religion ? this.state.religion : "Tôn giáo của bạn là gì?"}</p>
                        </div>
                    </div>
                    <div className="container right">
                        {user._id === this.props.user._id ? <p className="slideEdit2" title="Edit">✎</p> : ""}

                        <div className="tcontent">
                            <h2>High School Education</h2>
                            <h4>High School:</h4>
                            <p>{this.props.user.highSchool ? this.props.user.highSchool : "Thêm thông tin về trường THPT!"}</p>
                            <h4>Academy Year:</h4>
                            <p>{this.props.user.academyYear ? this.props.user.academyYear : "Niên khóa bao nhiêu bạn nhỉ?"}</p>
                        </div>
                    </div>
                    <div className="container left">
                        {user._id === this.props.user._id ? <p className="slideEdit2" title="Edit">✎</p> : ""}

                        <div className="tcontent">
                            <h2>University Education</h2>
                            <h4>University:</h4>
                            <p>{this.props.user.university ? this.props.user.university : "Thêm thông tin về trường ĐH!"}</p>
                            <h4>Field of Study:</h4>
                            <p>{this.props.user.fieldOfStudy ? this.props.user.fieldOfStudy : "Chuyên nghành của bạn?"}</p>
                            <h4>Academy Year:</h4>
                            <p>{this.props.user.academyYear ? this.props.user.academyYear : "Niên khóa bao nhiêu bạn nhỉ?"}</p>
                        </div>
                    </div>
                    <div className="container right">
                        {user._id === this.props.user._id ? <p className="slideEdit2" title="Edit">✎</p> : ""}
                        <div className="tcontent">
                            <h2>Address</h2>
                            <h4>Country:</h4>
                            <p>{this.props.user.country ? this.props.user.country : "Hỏi nè, Quốc Gia của bạn là gì?"}</p>
                            <h4>City:</h4>
                            <p>{this.props.user.city ? this.props.user.city : "Thành phố bạn đang sống là gì đấy!!!"}</p>
                            <h4>District:</h4>
                            <p>{this.props.user.district ? this.props.user.district : "Quận/Huyện nào nhỉ?!"}</p>
                            <h4>Village:</h4>
                            <p>{this.props.user.village ? this.props.user.village : "Xã nào nhỉ?!"}</p>
                            <h4>Street:</h4>
                            <p>{this.props.user.street ? this.props.user.street : "Đại chỉ đường là gì nhỉ?!"}</p>

                        </div>
                    </div>
                    <div className="container left">
                        {user._id === this.props.user._id ? <p className="slideEdit2" title="Edit">✎</p> : ""}
                        <div className="tcontent">
                            <h2>More About You</h2>
                            <h4>Relationship:</h4>
                            <p>{this.props.user.relationship ? this.props.user.relationship : "Ủa, rồi bạn có người yêu chưa?"}</p>
                            <h4>Interested In:</h4>
                            <p>{this.props.user.interested ? this.props.user.interested : "Bạn thích giới tính nào nè?"}</p>
                            <h4>Hobby:</h4>
                            <p>{this.props.user.hobby ? this.props.user.hobby : "Sở thích của bạn là gì?"}</p>
                        </div>
                    </div>
                </div>

                <PerEdit
                    disableModal={(n) => this.props.disableModal(n)}
                    user={this.props.user}
                    setUser={(user) => this.setUser(user)}
                />
                <HighEdit disableModal={(n) => this.props.disableModal(n)}/>
                <UniEdit disableModal={(n) => this.props.disableModal(n)}/>
                <AddressEdit disableModal={(n) => this.props.disableModal(n)}/>
                <MoreEdit/>
            </div>
        );
    }
}

const mapStateToProps = state => ({

    contacts: state.contactReducer.contacts
});
const mapDispatchToProps = dispatch => ({
    addFriend: (contactId, notificationId) => dispatch(contactActions.addFriend(contactId, notificationId)),
    cancelRequest: (contactId, notificationId) => dispatch(contactActions.cancelRequest(contactId, notificationId)),
    getContacts: () => dispatch(contactActions.getContacts()),
    unFriend: (contactId) => dispatch(contactActions.unFriend(contactId)),
});
export default connect(mapStateToProps, mapDispatchToProps)(LeftFixedProfile);
