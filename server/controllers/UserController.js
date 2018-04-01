import crypto from 'crypto';
import UserModel from '../models/UserModel';

import functions from '../functions';
import config from "../../config/config";

/**
 * @description     用户登录
 * @param ctx
 * @returns {Promise.<void>}
 */
const login = async (ctx) => {
    const param = ctx.request.body, {mail, password} = param;

    if (!functions.isPassword(password)) {
        ctx.body = functions.setResponse(0, '密码为6-16位字符，可包含.或_');
    } else {
        const userInfo = await UserModel.findOne({mail}).exec();
        const isLogged = !!ctx.session.user;

        if (!userInfo) {
            ctx.body = functions.setResponse(0, '抱歉，用户名或密码错误');
        } else {
            const passwordPlus = crypto.createHash('md5').update(password + userInfo.random).digest('hex');
            if (passwordPlus !== userInfo.password) {
                ctx.body = functions.setResponse(0, '抱歉，用户名或密码错误');
            } else if (isLogged) {
                ctx.body = functions.setResponse(0, '抱歉，该用户已经登录');
            } else {
                ctx.session.user = {mail, passwordPlus};
                ctx.body = functions.setResponse(1, '恭喜您，登陆成功', {userInfo});
            }
        }
    }
};

/**
 * @description     用户注册
 * @param ctx
 * @returns {Promise.<void>}
 */
const register = async (ctx) => {
    const param = ctx.request.body, {mail = 'admin', password = 'mdc888', username = mail} = param;

    const random = functions.randomString(6);

    const user = new UserModel({
        username,
        mail,
        password: crypto.createHash('md5').update(password + random).digest('hex'),
        random,
        token: crypto.createHash('md5').update(username + random + Date.now()).digest('hex')
    });

    const findUsers = await UserModel.find({
        mail
    }).exec(), userExist = !!findUsers[0];

    if (userExist) {
        ctx.body = functions.setResponse(0, '抱歉，该用户已经注册');
    } else {
        try {
            await user.save();
            ctx.body = functions.setResponse(1, '恭喜您，注册成功');
        } catch (e) {
            ctx.body = functions.setResponse(0, '抱歉，注册失败');
        }
    }
};

/**
 * @description     退出登录
 * @param ctx
 * @returns {Promise.<void>}
 */
const logout = async (ctx) => {
    ctx.session.user = undefined;
    ctx.body = functions.setResponse(1, '恭喜您，退出登录成功');
};

export {login, register, logout};