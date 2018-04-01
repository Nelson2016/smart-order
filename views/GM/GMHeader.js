import React from 'react';
import {connect} from 'react-redux';

import styles from '../../asset/scss/GM/GM-header.scss';

class GMHeader extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className={styles['header-container']}>
            <h1>NSO-自动下单</h1>
            <span>接触账号绑定</span>
        </div>
    }

}

const mapStateToProps = (state) => {
    return {state}
};

export default connect(mapStateToProps)(GMHeader);