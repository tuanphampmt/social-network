import React, {Component} from 'react';
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import './css/cssAuth.css'

class MainAuth extends Component {
    addClass = () => {
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('container');

        signUpButton.addEventListener('click', () => {
            container.classList.add('right-panel-active');
        });
        signInButton.addEventListener('click', () => {
            container.classList.remove('right-panel-active');
        });
    };
    render() {
        return (
            <div className="MainAuth">
                <div className="container" id="container">
                    <RegisterForm/>
                    <LoginForm/>
                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h1>Welcome Back!</h1>
                                <p>Để liên kết với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân của bạn.</p>
                                <button className="ghost" id="signIn" onClick={this.addClass}>
                                    Đăng Nhập
                                </button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h1>Hello, Friend!</h1>
                                <p>Nhập thông tin cá nhân của bạn và bắt đầu hành trình với chúng tôi.</p>
                                <button className="ghost" id="signUp" onClick={this.addClass}>
                                    Đăng Ký
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MainAuth;
