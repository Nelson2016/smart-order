import React from 'react';
import {createStore} from 'redux';
import reducer from './reducer';


export default (initState) => createStore(reducer, initState || {});
