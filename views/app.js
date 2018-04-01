import React from 'react';
import {hydrate} from 'react-dom';
import {Provider} from 'react-redux';
import configStore from '../store/configStore';
import ClientRouter from '../router/ClientRouter';

let store = configStore(window.REDUX_STATE);

console.log(window.REDUX_STATE);

if (module.hot) {
    module.hot.accept()
}


hydrate(
    <Provider store={store}>
        <ClientRouter/>
    </Provider>,
    document.getElementById('root')
);