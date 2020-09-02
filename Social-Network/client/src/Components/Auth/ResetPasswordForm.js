import React, {Component} from 'react';
import {Link} from 'react-router-dom'

import * as AuthService from "../../Services/auth.service"
import {withAlert} from 'react-alert'

import './css/cssAuth.css'


class ResetPasswordForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            cfpassword: "",
            isReset: false
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        (async () => {
            try {
                const {match: {params}} = this.props;
                const res = await AuthService.reset(params.token);
                const {data} = res;
                this.setState({isReset: data.isReset})
            } catch (error) {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                if (resMessage) {
                    window.location.assign("/");
                }
            }
        })()
    }

    isChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(this.state.isReset)
            const {match: {params}} = this.props;
            if (!this.state.isReset) {
                return this.props.alert.error("Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.")
            }
            if (this.state.cfpassword !== this.state.password) {
                return this.props.alert.error("Hai mật khẩu không khớp.")
            }

            if (!checkPassword(this.state.password)) {
                this.setState({password: ""});
                return this.props.alert.error("Mật khẩu không nên rỗng, 8 ký tự tối thiểu, ít nhất một chữ cái, một số và một ký tự đặc biệt")
            }

            if (this.state.isReset && this.state.cfpassword === this.state.password) {
                const res = await AuthService.resetPassword(params.token, this.state.password);
                const {data} = res;
                this.setState({password: "", cfpassword: ""});
                return this.props.alert.success(data.message);
            }
        } catch (error) {
            const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            this.props.alert.error(resMessage)
        }
    };

    render() {

        return (
            <div className="MainAuth reset">
                <div className="container" id="container">
                    <div className="form-container sign-in-container">
                        <form onSubmit={this.handleSubmit}>
                            <h1>Lấy lại mật khẩu</h1>
                            {this.props.message && (
                                <span className="alert alert-danger"
                                      role="alert">{this.props.message}
                                 </span>
                            )}
                            <input type="password"
                                   name="password"
                                   className="txt"
                                   placeholder="Password"
                                   required
                                   value={this.state.password}
                                   onChange={this.isChange}
                            />
                            <input type="password"
                                   name="cfpassword"
                                   className="txt"
                                   placeholder="Confirm Password"
                                   required
                                   value={this.state.cfpassword}
                                   onChange={this.isChange}
                            />
                            <Link to="/">Quay lại trang <strong>đăng nhập</strong>?</Link>
                            <button id="submitbtn">Xác nhận</button>
                        </form>
                    </div>
                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-right">
                                <h1>Hello, Friend!</h1>
                                <p>Vui lòng nhập nhập mật khẩu mới của bạn để đặt lại mật khẩu nhé!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const checkPassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    return regex.exec(password) !== null;
};


export default withAlert()(ResetPasswordForm);
