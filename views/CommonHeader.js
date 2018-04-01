import React from 'react';
import {connect} from 'react-redux';

import styles from '../asset/scss/common-header.scss';

class CommonHeader extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className={styles['header-container']}>
            <h1>NSO-自动下单</h1>
            <span>{this.props.state.userInfo.username}</span>
        </div>
    }

}

const mapStateToProps = (state) => {
    return {state}
};

export default connect(mapStateToProps)(CommonHeader);