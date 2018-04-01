import React from 'react';
import {connect} from 'react-redux';
import {Button} from 'nr';

import api from '../../asset/js/api';
import functions from '../../asset/js/functions';

import styles from '../../asset/scss/GM/GM-bind-account.scss';

import {changeGMLoginStatus} from '../../store/action'

class GM extends React.Component {

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await this.loopScanLoginStatus();
    }

    async loopScanLoginStatus() {
        this.toggleQR('hide');
        const isRefresh = await this.setBindQR();

        if (isRefresh) {
            const scanResult = await this.checkScan();
            this.setScanStatus(scanResult.message);

            if (scanResult.status === 1) {
                const loginResult = await this.checkLogin();
                this.setScanStatus(loginResult.message);

                if (loginResult.status === 1) {
                    this.props.changeGMLoginStatus({GMIsBound: true})
                }
            }
        }
    }

    async setBindQR() {
        const _this = this, refreshBtn = this.refreshBtn;

        refreshBtn.startLoading();

        const res = await functions.request(api.GM.setGMBindQR);

        if (res.status === 1) {
            _this.QR.src = api.GM.loginQRLink + '?_=' + new Date().valueOf();
            refreshBtn.endLoading();
            return true
        }

        return false;
    }

    toggleQR(type) {
        this.QR.style.display = type === 'show' ? 'block' : 'none';
    }

    async checkScan() {
        let count = 0, _this = this, flag = false;


        while (!flag) {

            const result = await functions.request(api.GM.checkGMScan);

            this.toggleQR('show');

            if (count > 9) {
                flag = true;
                return {
                    status: 0,
                    message: "请求超时"
                };
            } else if (result.data.loginStatus === 'twoDimensionCode') {
                return {
                    status: 1,
                    message: "扫描成功，正在登陆"
                };
            } else if (result.data.loginStatus === 'cancel') {
                return {
                    status: 0,
                    message: "扫描失败"
                };
            } else {
                _this.setScanStatus('正在等待扫描，第' + (count + 1) + '次')
            }

            this.sleep(500);
            count++;

        }
    }

    async checkLogin() {
        let count = 0, _this = this, flag = false;

        while (!flag) {
            const result = await functions.request(api.GM.checkGMLogin);

            if (count > 9) {
                flag = true;
                return {
                    status: 0,
                    message: "请求超时"
                };
            } else if (result.data.loginStatus === 1) {
                return {
                    status: 1,
                    message: "登陆成功"
                };
            } else {
                _this.setScanStatus('正在等待登录，第' + (count + 1) + '次')
            }

            this.sleep(500);
            count++;

        }
    }

    setScanStatus(message) {
        this.scanStatus.innerText = message;
    }

    sleep(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, ms)
        })
    }

    render() {
        console.log(this.props.state)
        return <div className={styles['GM-container']}>
            <h1>您未绑定过没账号，请扫码绑定</h1>
            <img src="" alt="QR" ref={e => this.QR = e}/>
            <span ref={e => this.scanStatus = e}>正在等待扫描</span>
            <Button ref={e => this.refreshBtn = e} nRef="refreshBtn" text="刷新二维码"
                    onClick={this.loopScanLoginStatus.bind(this)}/>
        </div>
    }

}

const mapStateToProps = (state) => {
    return {state}
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeGMLoginStatus: (args) => dispatch(changeGMLoginStatus(args))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(GM);