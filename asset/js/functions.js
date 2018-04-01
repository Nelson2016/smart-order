import "isomorphic-fetch";
import promise from 'es6-promise';
import {Toast} from 'nr';
import api from './api';

promise.polyfill();

export default {
    request: (url, options) => {

        url = api.host + url;

        const defaultOptions = {method: 'GET', credentials: 'same-origin', body: {}};

        options = Object.assign({}, defaultOptions, options);

        const requestBody = options.body;


        //GET请求序列化数据到URL
        if (options.method.toUpperCase() === 'GET') {
            let paramString = '';
            if (requestBody.toString() === '[object Object]') {
                for (let i in requestBody) {
                    if (requestBody.hasOwnProperty(i)) {
                        paramString += "&" + i + "=" + requestBody[i];
                    }
                }
                paramString = "?" + paramString.substring(1);
                url += paramString;
                delete options.body;
            }
        } else {
            options.headers = {
                'Content-Type': 'application/json'
            };
            options.body = JSON.stringify(requestBody);
        }


        return fetch(url, options).then((res) => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error('Server Error : ' + res.status);
            }
        }).then((res) => {
            if (res.status !== 1) {
                Toast.error(res.message);
            }
            return res;
        })

    },
}