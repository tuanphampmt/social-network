import React, {Component} from 'react';
import LeftFixedProfile from "./LeftFixedProfile";
import Mess from "../Message/Mess";
import RightFixed from "../Home/RightFixed";
import * as userActions from "../../Actions/user.action";
import {connect} from "react-redux";
import Nav from "../Home/Header/Nav";
import "./profile.css"
import * as contactActions from "../../Actions/contact.action";

let slideIndex = 1;
let click = 0;
let time1;

class MainProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        }
    }

    componentDidMount() {
        const {match: {params}} = this.props;
        this.props.getUserById(params.userId);
        this.props.getIsContact(params.userId);
        this.props.getIsAddFriend(params.userId);
    }

    plusSlides(n) {
        click = 1;
        this.showSlides(slideIndex += n);
    }

    currentSlide(n) {
        click = 1;
        this.showSlides(slideIndex = n);
    }

    showSlides = (n) => {
        let _this = this
        let slide = document.getElementsByClassName("singleslide");
        let bubble = document.getElementsByClassName("dot");

        if (n > slide.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slide.length;
        }

        for (let i = 0; i < slide.length; i++) {
            slide[i].style.display = "none";
            if (bubble[i]) {
                bubble[i].className = bubble[i].className.replace(" active", "");
            }

        }
        if (!slide[slideIndex - 1]) {

        } else {
            slide[slideIndex - 1].style.display = "block";
            bubble[slideIndex - 1].className += " active";
            if (click === 0)
                time1 = setTimeout(function () {
                    _this.showSlides(slideIndex += 1);
                }, 6000);
            else if (click === 1)
                click = 0;
        }

    };


    stopTime() {
        clearTimeout(time1);

    }

    startTime() {
        if (click === 0)
            this.showSlides(slideIndex);
    }


    disableModal(n) {
        let modal = document.getElementsByClassName('modal');
        modal[n].className = modal[n].className.replace(" animate", " deanimate");
        setTimeout(function () {
            document.getElementsByClassName('modal')[n].style.display = 'none';
        }, 500);
    }

    enableModal() {
        let modal = document.getElementsByClassName('modal');
        modal[0].className = modal[0].className.replace(" deanimate", " animate");
        document.getElementsByClassName('modal')[0].style.display = 'block';
    }


    render() {
        return (
            <div>
                <Nav/>
                <div className="content" onLoad={() => this.showSlides(1)}>

                    <div className="wrapper">
                        <LeftFixedProfile
                            stopTime={() => this.stopTime()}
                            startTime={() => this.startTime()}
                            currentSlide={(n) => this.currentSlide(n)}
                            plusSlides={(n) => this.plusSlides(n)}
                            enableModal={() => this.enableModal()}
                            disableModal={(n) => this.disableModal(n)}
                            user={this.props.user}
                            isContact={this.props.isContact}
                            isAddFriend={this.props.isAddFriend}
                        />
                        <RightFixed/>
                        <Mess/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.getUserById,
    users: state.userReducer,
    isContact: state.contactReducer.isContact,
    isAddFriend: state.contactReducer.isAddFriend
});
const mapDispatchToProps = dispatch => ({
    getUserById: (id) => dispatch(userActions.getUserById(id)),
    getIsContact: (contactId) => dispatch(contactActions.getIsContact(contactId)),
    getIsAddFriend: (contactId) => dispatch(contactActions.getIsAddFriend(contactId)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MainProfile);
