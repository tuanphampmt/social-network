import React, {Component} from 'react';
import {connect} from "react-redux";
import * as userActions from "../../../Actions/user.action";

class PerEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    isChange = (e) => {
        console.log(e.target.value)
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            firstName: nextProps.user.firstName,
            lastName: nextProps.user.lastName,
            day: (new Date(nextProps.user.birthday)).getDate(),
            month: (new Date(nextProps.user.birthday)).getMonth() + 1,
            year: (new Date(nextProps.user.birthday)).getFullYear(),
            sex: nextProps.user.sex,
            phone: nextProps.user.phone,
            religion: nextProps.user.religion,
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const user = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            birthday: this.state.year + "-" + this.state.month + "-" + this.state.day,
            sex: JSON.parse(this.state.sex),
            phone: this.state.phone,
            religion: this.state.religion
        };

        this.props.updatePerDetail(user);
        this.props.setUser(user);
        console.log(this.state.day)
        this.setState({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            birthday: this.state.year + "-" + this.state.month + "-" + this.state.day,
            day: this.state.day,
            month: this.state.month,
            year: this.state.year,
            sex: JSON.parse(this.state.sex),
            phone: this.state.phone,
            religion: this.state.religion
        });
        this.props.disableModal(0);

    };

    render() {

        return (
            <div className="modal animate">
                <div className="Edit">
                    <span className="close" title="Close Modal" onClick={() => this.props.disableModal(0)}>×</span>
                    <h2 align="center">Personal Detail Edit</h2>
                    <form id="contactform" name="contact" method="post" action="#" onSubmit={this.handleSubmit}>
                        <div className="row">
                            <label htmlFor="name">First Name<span className="req">*</span></label>
                            <input type="text" name="firstName" id="name" className="txt-edit" tabIndex="1"
                                   defaultValue={this.state.firstName} required
                                   onChange={this.isChange}
                            />
                        </div>
                        <div className="row">
                            <label htmlFor="name">Last Name<span className="req">*</span></label>
                            <input type="text" name="lastName" id="name" className="txt-edit" tabIndex="1"
                                   defaultValue={this.state.lastName} required
                                   onChange={this.isChange}
                            />
                        </div>

                        <div className="row">
                            <label>Birthday<span className="req">*</span></label>
                            <select name="day" className="select-birthday" value={this.state.day}
                                    onChange={this.isChange}
                            >
                                {
                                    [...Array(31)].map(((value, i) => {
                                            if (parseInt(this.state.day) === i + 1) {
                                                return (<option selected key={i} value={i + 1}>{i + 1} </option>)
                                            }
                                            return <option key={i} value={i + 1}>{i + 1} </option>
                                        }
                                    ))
                                }
                            </select>
                            <select name="month" className="select-birthday" value={this.state.month}
                                    onChange={this.isChange}
                            >

                                {
                                    [...Array(12)].map(((value, i) => {
                                            if (parseInt(this.state.month) === i + 1) {
                                                return (<option selected key={i} value={i + 1}>Tháng {i + 1}</option>)
                                            }
                                            return (<option key={i} value={i + 1}>Tháng {i + 1}</option>)
                                        }
                                    ))
                                }
                            </select>
                            <select name="year" className="select-birthday" defaultValue={this.state.year}
                                    onChange={this.isChange}
                            >

                                {
                                    [...Array(91)].map(((value, i) => {
                                            if (this.state.year === i + 1930) {
                                                return (<option selected key={i} value={i + 1930}>{i + 1930}</option>)
                                            }
                                            return (<option key={i} value={i + 1930}>{i + 1930}</option>)
                                        }
                                    ))
                                }
                            </select>
                        </div>
                        <div className="row">
                            <label htmlFor="sex">Gender<span className="req">*</span></label>
                            {this.state.sex ?
                                <select name="sex" className="select-gender"
                                        onChange={this.isChange}
                                >
                                    <option value={true} selected>Nam</option>
                                    <option value={false}>Nữ</option>
                                </select> :
                                <select name="sex" className="select-gender"
                                        onChange={this.isChange}
                                >
                                    <option value={true}>Nam</option>
                                    <option value={false} selected>Nữ</option>
                                </select>}

                        </div>
                        <div className="row">
                            <label>Phone<span className="req">*</span></label>
                            <input type="text" name="phone" className="txt-edit" tabIndex="2"
                                   placeholder="0777561933" required
                                   defaultValue={this.state.phone}
                                   onChange={this.isChange}
                            />
                        </div>
                        <div className="row">
                            <label>Religion<span className="req">*</span></label>
                            <input type="text" name="religion" className="txt-edit" tabIndex="2"
                                   placeholder="Phật giáo" required
                                   onChange={this.isChange}
                                   defaultValue={this.state.religion}
                            />
                        </div>
                        <div className="center">
                            <input type="submit" id="submitbtn" name="submitbtn" tabIndex="5" value="Save"/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.currentUserReducer,
    // coverImages: state.currentUserReducer.coverImages,
});
const mapDispatchToProps = dispatch => ({
    updatePerDetail: (formData) => dispatch(userActions.updatePerDetail(formData))
});
export default connect(mapStateToProps, mapDispatchToProps)(PerEdit);
