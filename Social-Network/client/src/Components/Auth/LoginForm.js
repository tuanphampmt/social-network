import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import {withAlert} from 'react-alert'
import * as AuthService from "../../Services/auth.service"



class LoginForm extends Component {


    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            message: "",
            loading: false,
            isLogin: true,
        }
    }

    isChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await AuthService.login(this.state.email, this.state.password);
            const {data} = res;
            if (data.token) {
                localStorage.setItem("jwt", JSON.stringify(data.token));
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.assign("/home");
                window.location.reload();
            }
        } catch (error) {
            const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            this.props.alert.error(resMessage);
            this.setState({password: ""})
        }
    };


    render() {

        return (
            <div className="form-container sign-in-container">
                <form onSubmit={this.handleLogin}>
                    <h1>Đăng Nhập</h1>
                    {/*<div className="social-container">*/}
                    {/*    /!*<Facebook/>*!/*/}

                    {/*    /!*<a href="https://localhost:4000/auth/facebook" className="social"*!/*/}
                    {/*    /!*>*!/*/}
                    {/*    /!*    <i className="fa fa-facebook-f"*!/*/}
                    {/*    /!*    />*!/*/}
                    {/*    /!*</a>*!/*/}
                    {/*    /!*</a>*!/*/}
                    {/*    /!*<a href="#1" className="social">*!/*/}
                    {/*    /!*    <i className="fa fa-google"/>*!/*/}
                    {/*    /!*</a>*!/*/}
                    {/*    /!*<a href="#1" className="social">*!/*/}
                    {/*    /!*    <i className="fa fa-twitter"/>*!/*/}
                    {/*    /!*</a>*!/*/}
                    {/*</div>*/}

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
                           placeholder="Password"
                           required
                           value={this.state.password}
                           onChange={this.isChange}
                    />
                    <Link to="/recover" style={{textDecoration: 'none'}}>Quên <strong>mật khẩu</strong> của bạn?</Link>
                    <button id="submitbtn">Đăng Nhập</button>
                </form>
            </div>
        )
    }
}


export default withAlert()(LoginForm);


