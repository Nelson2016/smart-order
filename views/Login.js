import React from 'react';
import {connect} from 'react-redux';
import {Form, Input, Button, Toast} from 'nr';

import styles from '../asset/scss/login.scss';

import {changeLoginStatus} from '../store/action'

import api from '../asset/js/api';
import functions from '../asset/js/functions';


class Login extends React.Component {

    componentDidMount() {
        functions.request(api.register, {
            method: "POST",
        }).then((res) => {
        });
    }

    login(canSubmit) {
        if (canSubmit) {
            let loginBtn = this.loginBtn;
            loginBtn.startLoading();

            functions.request(api.login, {
                method: "POST",
                body: {
                    mail: this.mailInput.val(),
                    password: this.passwordInput.val(),
                }
            }).then((res) => {
                console.log(res);
                if (res.status === 1) {
                    this.props.changeLoginStatus({isLogged: true, userInfo: res.data.userInfo})
                } else {
                    loginBtn.endLoading();
                }
            });
        }
    }

    render() {
        return <div className="login-container">
            <div className={styles['login-page']}>
                <div className={styles['login-container']}>
                    <div className={styles['login-form']}>
                        <Form onSubmit={this.login.bind(this)} ctx={this}>
                            <Input ref={e => this.mailInput = e} nRef="mailInput" leftIcon="username"
                                   placeholder="请输入邮箱" dataType="username"/>
                            <Input ref={e => this.passwordInput = e} nRef="passwordInput" leftIcon="password"
                                   type="password" placeholder="请输入密码" dataType="password"/>

                            <Button ref={e => this.loginBtn = e} nRef="loginBtn" text="登录" type="submit"/>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    }

}

const mapStateToProps = (state) => {
    return {state}
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeLoginStatus: (args) => dispatch(changeLoginStatus(args))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);