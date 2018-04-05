import React from 'react';
import {connect} from 'react-redux';

import styles from '../../asset/scss/GM/GM-header.scss';

import api from '../../asset/js/api';
import functions from '../../asset/js/functions';

import {changeGMLoginStatus} from '../../store/action'

class GMHeader extends React.Component {

    constructor(props) {
        super(props);
    }

    async unBindAccount() {
        const res = await functions.request(api.GM.unBindGMAccount, {
            method: "POST"
        });

        if (res.status === 1) {
            this.props.changeGMLoginStatus({GMIsBound: false})
        }
    }

    render() {
        return <div className={styles['header-container']}>
            <h1>NSO-自动下单</h1>
            <span onClick={this.unBindAccount.bind(this)}>解除账号绑定</span>
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


export default connect(mapStateToProps, mapDispatchToProps)(GMHeader);