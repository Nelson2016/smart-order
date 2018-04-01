import React from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';

import Root from '../views/Root';
import Home from '../views/Home';
import Login from '../views/Login';

//GM
import GM from '../views/GM/GM';
import GMBindAccount from '../views/GM/GMBindAccount';


const Routes = (state) => <Root>
    <Switch>

        <Route path="/login" render={() => {
            return state.isLogged ? <Redirect to="/home"/> : <Login/>
        }}/>

        {/*GM*/}
        <Route path="/GM" render={() => {
            return state.isLogged ? state.GMIsBound ? <GM/> : <Redirect to="/GMBindAccount"/> : <Redirect to="/login"/>
        }}/>
        <Route path="/GMBindAccount" render={() => {
            return state.isLogged ? state.GMIsBound ? <Redirect to="/GM"/> : <GMBindAccount/> : <Redirect to="/login"/>
        }}/>


        {/*Home*/}
        <Route path="/home" render={() => {
            return state.isLogged ? <Home/> : <Redirect to="/login"/>
        }}/>

        {/*Is login*/}
        <Route path="/" render={() => {
            return state.isLogged ? <Redirect to="/home"/> : <Redirect to="/login"/>
        }}/>

        {/*404*/}
        <Route path="/404" render={() => <div>404</div>}/>
        <Redirect to="/404"/>
    </Switch>
</Root>;

export default Routes;