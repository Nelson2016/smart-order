import React from 'react';
import {Button} from 'nr';
import {Route, Switch} from 'react-router-dom';

import GMHeader from './GMHeader';

import GMList from './GMList';
import GMAddProduct from './GMAddProduct';
import GMConnectList from './GMConnectList';
import GMSetOrderParam from './GMSetOrderParam';

import styles from '../../asset/scss/GM/GM.scss';

class GM extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div className="container">
            <GMHeader/>
            <div className={styles['GM-container']}>
                <Switch>
                    <Route exact path="/GM" component={GMList}/>
                    <Route exact path="/GM/GMAddProduct" component={GMAddProduct}/>
                    <Route exact path="/GM/GMConnectList" component={GMConnectList}/>
                    <Route exact path="/GM/GMSetOrderParam" component={GMSetOrderParam}/>
                </Switch>
            </div>
        </div>
    }

}

export default GM;