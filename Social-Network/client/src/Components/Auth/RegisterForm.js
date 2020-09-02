import React, {Component} from 'react';

import {withAlert} from 'react-alert'

import * as AuthService from "../../Services/auth.service"

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            day: "31",
            month: "7",
            year: "1998",
            male: true,
            female: false,
            other: "Tuỳ chỉnh",
            sex: Boolean,
            message: "",
            successful: false,
        };
    }


    isChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleRegister = async (e) => {
        e.preventDefault();
        const birthday = this.state.year + "-" + this.state.month + "-" + this.state.day;
        if (!checkPassword(this.state.password)) {
            this.props.alert.error("Mật khẩu phải chứa ít nhất 8 ký tự, ít nhất một số và cả chữ thường và chữ hoa và ký tự đặc biệt");
            return this.setState({password: ""});
        }
        try {
            const res = await AuthService.register(this.state.email, this.state.password, this.state.firstName, this.state.lastName, birthday, this.state.sex)
            const {data} = res;
            this.props.alert.success(data.message);
            this.setState({email: "", password: ""});
        } catch (error) {
            const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            this.props.alert.error(resMessage)
            this.setState({email: "", password: ""});
        }


    };

    render() {


        return (
            <div className="form-container sign-up-container">
                <form onSubmit={this.handleRegister}>
                    <h1>Đăng Ký</h1>
                    {/*<div className="social-container">*/}
                    {/*    <a href="#1" className="social">*/}
                    {/*        <i className="fa fa-facebook-f"/>*/}
                    {/*    </a>*/}
                    {/*    <a href="#1" className="social">*/}
                    {/*        <i className="fa fa-google"/>*/}
                    {/*    </a>*/}
                    {/*    <a href="#1" className="social">*/}
                    {/*        <i className="fa fa-twitter"/>*/}
                    {/*    </a>*/}
                    {/*</div>*/}
                    {/*<span>hoặc sử dụng email của bạn để đăng ký</span>*/}
                    {/*/!*{(this.props.css || this.state.css) && (*!/*/}
                    {/*/!*    <span className={this.props.successful ? "alert alert-success" : "alert alert-danger"}*!/*/}
                    {/*/!*          role="alert">{this.props.css || this.state.css}</span>*!/*/}
                    {/*/!*)}*!/*/}

                    <div className="form-row">
                        <div className="col">
                            <input type="text"
                                   name="lastName"
                                   className="txt input-row"
                                   placeholder="Họ lót"
                                   required
                                   value={this.state.lastName}
                                   onChange={this.isChange}
                            />
                        </div>
                        <div className="col">
                            <input type="text"
                                   name="firstName"
                                   className="txt input-row"
                                   placeholder="Tên"
                                   required
                                   value={this.state.firstName}
                                   onChange={this.isChange}
                            />
                        </div>
                    </div>
                    <input type="email"
                           name="email"
                           className="txt"
                           placeholder="Email"
                           required
                           value={this.state.email}
                           onChange={this.isChange}
                    />
                    <input type="password"
                           name="password"
                           className="txt"
                           placeholder="Mật khẩu mới"
                           required
                           value={this.state.password}
                           onChange={this.isChange}
                    />

                    <div className="form-group">
                            <label className="mb-label-day">Ngày sinh
                            </label>
                            <div className="form-row">
                                <div className="col">
                                    <select className="custom-select"
                                            name="day"
                                            value={this.state.day}
                                            onChange={this.isChange}
                                    >
                                        <option value={1}>1</option>
                                        {
                                            [...Array(30)].map(((value, i) => (
                                                    <option key={i} value={i + 2}>{i + 2}</option>
                                                )
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="col">
                                    <select className="custom-select"
                                            id="custom-select-month"
                                            name="month"
                                            value={this.state.month}
                                            onChange={this.isChange}
                                    >
                                        <option value={1}>Tháng 1</option>
                                        {
                                            [...Array(11)].map(((value, i) => (
                                                    <option key={i} value={i + 2}>Tháng {i + 2}</option>
                                                )
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="col">
                                    <select className="custom-select"
                                            name="year"
                                            value={this.state.year}
                                            onChange={this.isChange}
                                    >
                                        <option>1930</option>
                                        {
                                            [...Array(90)].map(((value, i) => (
                                                    <option key={i} value={i + 1931}>{i + 1931}</option>
                                                )
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                    </div>
                    <fieldset className="form-group">
                        <legend className="col-form-label mb-label-sex">Giới tính</legend>
                        <div className="form-row mar-left">
                            <div className="form-check form-check-inline col">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="gridRadios1"
                                    name="sex"
                                    onChange={this.isChange}
                                    defaultValue={this.state.male}
                                    required
                                />
                                <label className="form-check-label" htmlFor="gridRadios1">
                                    Nam
                                </label>
                            </div>
                            <div className="form-check form-check-inline col">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="sex"
                                    onChange={this.isChange}
                                    id="gridRadios2"
                                    defaultValue={this.state.female}
                                    required
                                />
                                <label className="form-check-label" htmlFor="gridRadios2">
                                    Nữ
                                </label>
                            </div>
                        </div>
                    </fieldset>
                    <button id="submitbtn"
                    >Đăng Ký
                    </button>
                </form>
            </div>
    );
    }
    }

    const checkPassword = (password) => {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
        return regex.exec(password) !== null;
    };


    export default withAlert()(RegisterForm);

