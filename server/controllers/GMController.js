import puppeteer from 'puppeteer';
import axios from 'axios';
import GMModel from '../models/GMModel';
import GMProductModel from '../models/GMProductModel';
import functions from '../functions';
import jsdom from "jsdom";
import mongoose from 'mongoose';

const {JSDOM} = jsdom;

import config from '../../config/config';

const {loginUrl} = config.GM.urls;

const GMConfig = {
    origin: "https://login.gome.com.cn",
    addToCartAction: "https://cart.gome.com.cn/home/api/cart/addToCart",
    smartCheckoutOrder: 'https://cart.gome.com.cn/home/api/checkout/checkout',
    smartInitOrder: 'https://cart.gome.com.cn/home/api/order/initOrder',
    smartSubmitOrder: 'https://cart.gome.com.cn/home/api/checkout/commit',
    loadCart: 'https://cart.gome.com.cn/home/api/cart/loadCart',
    setDefaultAddress: "https://cart.gome.com.cn/home/api/consignee/setDefaultAddress",
    selectAddress:'https://cart.gome.com.cn/home/api/consignee/selectAddress',
    headers: {
        "loginStep": "application/json, text/javascript, */*; q=0.01",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "content-length": 0,
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
        "x-requested-with": "with:XMLHttpRequest"
    }
};

const checkGMScan = async (ctx) => {

    const GMInfo = await GMModel.findOne().exec();

    let result = await axios({
        method: 'post',
        url: "https://login.gome.com.cn/LoadingBarcodeLogin.no?loginStep=waitScan&sendtimestamp=" + (new Date).getTime(),
        headers: Object.assign({}, GMConfig, {
            "cookie": functions.cookieParser(GMInfo.loginBaseCookie),
            "origin": "https://login.gome.com.cn",
            "referer": "https://login.gome.com.cn/login",
        })
    });

    ctx.body = functions.setResponse(1, '更新成功', result.data);

};

const checkGMLogin = async (ctx) => {

    const GMInfo = await GMModel.findOne().exec();

    let result = await axios({
        method: 'post',
        url: "https://login.gome.com.cn/LoadingBarcodeLogin.no?loginStep=checkLogin&sendtimestamp=" + (new Date).getTime(),
        headers: Object.assign({}, GMConfig, {
            "cookie": functions.cookieParser(GMInfo.loginBaseCookie),
            "origin": "https://login.gome.com.cn",
            "referer": "https://login.gome.com.cn/login",
        })
    });

    if (result.data.loginStatus === 'success') {

        let submitOrderCookie = result.headers['set-cookie'].map((item) => {

            const temp = item.split(';');
            let obj = {};

            for (let i = 0; i < temp.length; i++) {
                if (temp[i].indexOf('=') >= 0) {
                    if (i === 0) {
                        obj.name = temp[i].split('=')[0];
                        obj.value = temp[i].split('=')[1];
                    } else {
                        obj[temp[i].split('=')[0]] = temp[i].split('=')[1];
                    }

                } else {
                    obj[temp[i].trim()] = true;
                }
            }

            return obj;
        });


        await GMModel.update({}, {submitOrderCookie});

        ctx.body = functions.setResponse(1, '登录成功', {loginStatus: 1});
    } else {
        ctx.body = functions.setResponse(1, '等待确认登录', {loginStatus: 0});
    }

};

const setGMBindQR = async (ctx) => {

    //获取过没登录页二维码
    await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']}).then(async browser => {

        console.log('建立浏览器');

        const page = await browser.newPage();

        await page.goto('https://login.gome.com.cn/login');

        console.log('浏览器载入登录页面')

        //保存二维码
        page.setViewport({
            width: 1200,
            height: 480
        });

        await page.screenshot({
            path: 'dist/QR.png', clip: {
                x: 840,
                y: 253,
                width: 165,
                height: 165
            }
        });

        console.log('成功获取二维码');
        console.log('开始读取cookie');

        //存储登录基本cookie
        let cookie = await page.cookies(loginUrl) || [];

        let loginBaseCookie = cookie.map((item) => {
            return functions.JSONKeyToLowercase(item);
        });

        const GMInfo = await GMModel.findOne().exec();
        if (GMInfo) {
            await GMModel.update({}, {loginBaseCookie});
        } else {
            const GM = new GMModel({
                username: '',
                password: '',
                loginBaseCookie,
                submitOrderCookie: ''
            });
            await GM.save();
        }

        await browser.close();

        console.log('获取二维码结束关闭浏览器');

    });

    ctx.body = functions.setResponse(1, '更新成功');
};

const getProductInfoByPidSid = async (ctx) => {
    const param = ctx.request.query, {pid, sid} = param;
    const productJSDOM = await JSDOM.fromURL(`https://item.gome.com.cn/${pid}-${sid}.html`, {runScripts: "dangerously"})

    if (productJSDOM.window.prdInfo) {
        ctx.body = functions.setResponse(1, '恭喜您，获取成功', productJSDOM.window.prdInfo);
    } else {
        ctx.body = functions.setResponse(0, '抱歉，商品不存在');
    }

};

const GMAddProduct = async (ctx) => {
    const param = ctx.request.body, {pid, sid, price, productName} = param;

    let productHTML = '';

    try {
        productHTML = await axios({
            method: 'get',
            url: `https://item.gome.com.cn/${pid}-${sid}.html`,
        });
    } catch (e) {
        ctx.body = functions.setResponse(0, '该商品不存在');
        return;
    }

    const findProduct = await GMProductModel.findOne({pid, sid}).exec(), productExist = !!findProduct;

    if (!productExist) {
        const newProduct = new GMProductModel({
            pid,
            sid,
            productName,
            price,
            status: 0,
            step: 0
        });

        await newProduct.save();
        ctx.body = functions.setResponse(1, '添加成功');
    } else {
        ctx.body = functions.setResponse(0, '该商品已存在');
    }

};

const GMGetList = async (ctx) => {
    const param = ctx.request.query, {page = 1} = param, pageSize = 10;
    const GMProducts = await GMProductModel.find().limit(pageSize).skip(pageSize * (page - 1)).exec(),
        GMProductsCount = await GMProductModel.count().exec();

    let totalPage = 0;

    if (GMProductsCount > 0) {
        totalPage = Math.ceil(GMProductsCount / pageSize);
    }

    ctx.body = functions.setResponse(1, '恭喜您，获取成功', {
        list: GMProducts,
        pages: {totalPage, page}
    });
};

const GMCheckoutOrder = async (ctx) => {

    const GMInfo = await GMModel.findOne().exec() || {
        submitOrderCookie: [],
        loginBaseCookie: []
    };

    let result = await axios({
        method: 'post',
        url: GMConfig.smartCheckoutOrder,
        headers: Object.assign({}, GMConfig, {
            "cookie": functions.cookieParser(GMInfo.loginBaseCookie.concat(GMInfo.submitOrderCookie)),
            "origin": "https://login.gome.com.cn",
            "referer": 'https://cart.gome.com.cn/',
        })
    });

    if (!ctx) {
        return {status: result.data.errCode !== '003000001' ? 1 : 0};
    } else if (result.data.loginStatus === 'success') {

        ctx.body = functions.setResponse(1, '登录成功', {loginStatus: 1});

        let submitOrderCookie = result.headers['set-cookie'].map((item) => item.split(';')[0]);

        await GMModel.update({}, {submitOrderCookie});

    } else {
        ctx.body = functions.setResponse(1, '等待确认登录', {loginStatus: 0});
    }

};

const addToConnectCart = async (ctx) => {
    const param = ctx.request.body, {connectIds} = param;

    let errorIds = [];

    for (let i = 0; i < connectIds.length; i++) {
        try {
            await GMProductModel.findByIdAndUpdate(connectIds[i], {status: 1});
        } catch (e) {
            errorIds.push(connectIds[i]);
        }
    }

    ctx.body = functions.setResponse(1, '添加成功', {errorIds});

};

const smartOrder = async (ctx) => {
    const ids = await GMProductModel.find({status: 1}).exec();
    const GMInfo = await GMModel.findOne().exec(),
        GMInfoCookie = functions.cookieParser(GMInfo.loginBaseCookie.concat(GMInfo.submitOrderCookie));

    console.log('---准备加入购物车---');

    for (let i = 0; i < ids.length; i++) {
        let addToCartResult = await smartAddToCart(ids[i].pid, ids[i].sid, GMInfoCookie);

        if (addToCartResult.status === 1) {
            try {
                await GMProductModel.findByIdAndUpdate(ids[i], {step: 1});
            } catch (e) {
                console.log(e)
            }
        }
    }

    console.log('---准备检查下单状态---');

    const smartCheckoutOrderResult = await smartCheckoutOrder(GMInfoCookie);

    if (smartCheckoutOrderResult.status === 0) {
        ctx.body = functions.setResponse(0, '下单失败');
        return;
    }

    console.log('---开始下单---');
    const smartSubmitOrderResult = await smartSubmitOrder(GMInfoCookie);

    if (smartSubmitOrderResult.status === 1) {
        try {
            await GMProductModel.updateMany({status: 1}, {status: 0});
        } catch (e) {
            console.log(e)
        }
        ctx.body = functions.setResponse(1, '下单成功');
    } else {
        ctx.body = functions.setResponse(0, '下单失败');
    }

};

const smartSubmitOrder = async (cookie) => {
    let result = await axios({
        method: 'post',
        url: GMConfig.smartSubmitOrder,
        headers: Object.assign({}, GMConfig, {
            "cookie": cookie,
            "origin": "https://cart.gome.com.cn",
            "referer": "https://cart.gome.com.cn/shopping",
        }),
        params: {
            _: new Date().valueOf()
        }
    });

    return {
        status: result.data.success ? 1 : 0
    };
};

const initOrder = async (cookie) => {
    //初始化订单数据
    let result = await axios({
        method: 'post',
        url: GMConfig.smartInitOrder,
        headers: Object.assign({}, GMConfig, {
            "cookie": cookie,
            "origin": "https://cart.gome.com.cn",
            "referer": "https://cart.gome.com.cn/shopping",
        }),
        params: {
            _: new Date().valueOf()
        }
    });

    return result;
};

const smartCheckoutOrder = async (cookie) => {

    //检查订单结果
    let checkout = await GMCheckoutOrder();
    if (checkout.status === 0) {
        console.log('检查下单状态错误');
        return checkout;
    }

    //初始化订单数据
    let initOrderData = await initOrder(cookie);

    if (!initOrderData.data.success) {
        console.log('初始化订单数据失败');
        return {status: 0}
    }

    let ss = initOrderData.data.data.shops[0].groups.map((item) => {
        return item.commerceItemsGroup[0].skuId
    });

    ss = ss.join(',');

    let ac = initOrderData.data.data.pg.paymentMethods[5].a.countyCode;

    console.log('开始配置订单参数');

    //配置订单参数
    let getInstallInfo = await axios({
        method: 'post',
        url: 'https://cart.gome.com.cn/home/api/product/getInstallInfos',
        headers: Object.assign({}, GMConfig, {
            "cookie": cookie,
            "origin": "https://cart.gome.com.cn",
            "referer": "https://cart.gome.com.cn/shopping",
        }),
        params: {
            ss,
            ac
        }
    });

    if (!getInstallInfo.data.success) {
        console.log('配置订单参数失败');
        return {status: 0}
    }

    return {status: 1}
};

const smartAddToCart = async (pid, sid, cookie) => {


    console.log('准备加入购物车', pid, sid);

    const data = {
        type: 0,
        homesite: 'home',
        pid: pid,
        sid: sid,
        pcount: 1,
        is: '',
        k: '',
        m: '',
        s: '',
        cr: 0,
        _: (new Date).getTime(),
        _r: (new Date).getTime(),
    };

    let action = '';

    for (let i in data) {
        action += "&" + i + '=' + data[i];
    }

    action = '?' + action.substr(1, action.length);

    let result = await axios({
        method: 'get',
        url: GMConfig.addToCartAction + action,
        headers: {
            "loginStep": "application/json, text/javascript, */*; q=0.01",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "content-length": 0,
            "cookie": cookie,
            "origin": GMConfig.origin,
            "referer": `https://item.gome.com.cn/product-${pid}-${sid}.html`,
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
            "x-requested-with": "with:XMLHttpRequest"
        },
    });

    return {status: result.data.success ? 1 : 0};
};

const unBindGMAccount = async (ctx) => {
    try {
        await GMModel.findOneAndUpdate({}, {loginBaseCookie: [], submitOrderCookie: []});
        ctx.body = functions.setResponse(1, '解绑成功');
    } catch (e) {
        ctx.body = functions.setResponse(0, '解绑失败');
    }
};

const GMConnectList = async (ctx) => {

    const GMInfo = await GMModel.findOne().exec(),
        GMInfoCookie = functions.cookieParser(GMInfo.loginBaseCookie.concat(GMInfo.submitOrderCookie));

    let result = await axios({
        method: 'post',
        url: GMConfig.loadCart,
        headers: {
            "loginStep": "application/json, text/javascript, */*; q=0.01",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "content-length": 0,
            "cookie": GMInfoCookie,
            "origin": GMConfig.origin,
            "referer": 'https://cart.gome.com.cn/',
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
            "x-requested-with": "with:XMLHttpRequest"
        },
    });

    if (result.data.success) {

        const data = result.data.data.siVOs || [];
        let list = [];

        for (let i = 0; i < data.length; i++) {
            let Groups = data[i].commerceItemsGroups;
            for (let j = 0; j < Groups.length; j++) {
                let Group = Groups[j].commerceItemsGroup;
                for (let k = 0; k < Group.length; k++) {
                    list.push(Group[k])
                }
            }
        }

        ctx.body = functions.setResponse(1, '获取成功', list);
    } else {
        ctx.body = functions.setResponse(0, '获取失败');
    }
};

const GMInitOrderData = async (ctx) => {

    const GMInfo = await GMModel.findOne().exec(),
        GMInfoCookie = functions.cookieParser(GMInfo.loginBaseCookie.concat(GMInfo.submitOrderCookie));

    let initOrderData = await initOrder(GMInfoCookie);

    if (initOrderData.data.success) {
        ctx.body = functions.setResponse(1, '获取成功', initOrderData.data.data);
    } else {
        ctx.body = functions.setResponse(0, '获取失败');
    }
};

const GMSetDefaultAddress = async (ctx) => {
    const param = ctx.request.body,
        {addressId} = param,
        GMInfo = await GMModel.findOne().exec(),
        GMInfoCookie = functions.cookieParser(GMInfo.loginBaseCookie.concat(GMInfo.submitOrderCookie));

    let result = await axios({
        method: 'post',
        url: GMConfig.setDefaultAddress,
        headers: {
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "content-length": 0,
            "cookie": GMInfoCookie,
            "origin": 'https://cart.gome.com.cn',
            "referer": 'https://cart.gome.com.cn/shopping',
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
            "x-requested-with": "with:XMLHttpRequest"
        },
        params: {
            id: addressId,
            _: new Date().valueOf()
        }
    });

    let result1 = await axios({
        method: 'post',
        url: GMConfig.selectAddress,
        headers: {
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "content-length": 0,
            "cookie": GMInfoCookie,
            "origin": 'https://cart.gome.com.cn',
            "referer": 'https://cart.gome.com.cn/shopping',
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
            "x-requested-with": "with:XMLHttpRequest"
        },
        params: {
            id: addressId,
            _: new Date().valueOf()
        }
    });

    console.log(result.data)
    console.log(result1.data)

    if (result.data.success && result1.data.success) {
        ctx.body = functions.setResponse(1, '设置成功');
    } else {
        ctx.body = functions.setResponse(0, '设置失败');
    }
};

export {
    setGMBindQR,
    checkGMScan,
    checkGMLogin,
    GMAddProduct,
    GMGetList,
    GMCheckoutOrder,
    getProductInfoByPidSid,
    addToConnectCart,
    smartOrder,
    unBindGMAccount,
    GMConnectList,
    GMInitOrderData,
    GMSetDefaultAddress
}