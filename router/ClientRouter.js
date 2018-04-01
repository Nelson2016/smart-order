import React from 'react';
import {BrowserRouter,withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import Routes from './Routes';

class ClientRouter extends React.Component {
    render() {

        return <BrowserRouter>
            {Routes(this.props.state)}
        </BrowserRouter>
    }
}

const mapStateToProps = (state) => {
    return {state};
};

export default connect(mapStateToProps)(ClientRouter);