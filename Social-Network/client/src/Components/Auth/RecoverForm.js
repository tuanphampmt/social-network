import React, {Component} from 'react';
import {Link} from 'react-router-dom'

import * as AuthService from "../../Services/auth.service"
import {withAlert} from 'react-alert'
import './css/cssAuth.css'

class RecoverForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
        }
    }

    isChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };


    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await AuthService.recover(this.state.email);
            const {data} = res;
            this.props.alert.success(data.message)
        } catch (error) {
            const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            this.props.alert.error(resMessage);
            this.setState({email: ""})
        }
    };

    render() {

        return (
            <div className="MainAuth recover">
                <div className="container" id="container">
                    <div className="form-container sign-in-container">
                        <form onSubmit={this.handleSubmit}>
                            <h1>Lấy lại mật khẩu</h1>
                            {this.props.message && (
                                <span className="alert alert-danger"
                                      role="alert">{this.props.message}
                                 </span>
                            )}
                            <input type="email"
                                   name="email"
                                   className="txt"
                                   placeholder="Email"
                                   required
                                   value={this.state.email}
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
                                <p>Để lấy lại mật khẩu, vui lòng nhập email của bạn để sử dụng dịch vụ của chúng tôi.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default withAlert()(RecoverForm);
