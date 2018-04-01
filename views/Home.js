import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Toast} from 'nr'

import config from '../config/config'

import CommonHeader from './CommonHeader';

import styles from '../asset/scss/home.scss';

class Home extends React.Component {

    constructor(props) {
        super(props);
    }

    goGM() {
        this.props.history.push({
            pathname: config.common.breadcrumb.GM.GM,
        })
    }

    goJD() {
        Toast.warning('该功能暂未开放');
    }

    render() {
        return <div className="container">
            <CommonHeader/>

            <div className={styles['home-container']}>
                <ul>
                    <li className={styles['GM']} onClick={this.goGM.bind(this)}>
                        <div className={styles['logo-container']}>
                            <span>国美</span>
                        </div>
                    </li>
                    <li className={styles['JD']} onClick={this.goJD.bind(this)}>
                        <div className={styles['logo-container']}>
                            <span>京东</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    }

}

const mapStateToProps = (state) => {
    return {state}
};

export default withRouter(connect(mapStateToProps)(Home));