import config from '../../config/config'

export default {

    host: config.debug ? 'http://localhost:3000' : 'http://nelsonlee.site:8088',

    GM: {
        loginQRLink: 'QR.png',
        setGMBindQR: '/api/setGMBindQR',
        unBindGMAccount: '/api/unBindGMAccount',
        checkGMScan: '/api/checkGMScan',
        checkGMLogin: '/api/checkGMLogin',
        GMAddProduct: '/api/GMAddProduct',
        GMGetList: '/api/GMGetList',
        getProductInfoByPidSid: '/api/getProductInfoByPidSid',
        addToConnectCart: '/api/addToConnectCart',
        smartOrder: '/api/smartOrder',
    },

    register: "/api/register",
    login: "/api/login",
}