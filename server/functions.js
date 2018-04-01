export default {
    /**
     * @description     检测用户名是否合法
     * @param username
     * @returns {boolean}
     */
    isUsername: (username) => {

        const usernameRegExp = /^[a-zA-Z0-9]{4,16}$/;

        if (usernameRegExp.test(username)) {
            return true
        }

        return false;

    },
    /**
     * @description     检测密码是否合法
     * @param username
     * @returns {boolean}
     */
    isPassword: (username) => {
        const passwordRegExp = /^[a-zA-Z0-9._]{6,16}$/;

        if (passwordRegExp.test(username)) {
            return true
        }

        return false;

    },
    /**
     * @description     验证邮箱是否合法
     * @param mail
     * @returns {boolean}
     */
    isMail: (mail) => {
        const mailRegExp = /^[A-Za-z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

        if (mailRegExp.test(mail)) {
            return true
        }

        return false;
    },
    /**
     * @description     同意设置数据返回格式
     * @param status
     * @param message
     * @param data
     * @returns {{status: number, message: string, data: {}}}
     */
    setResponse: (status = 1, message = '', data = {}) => {

        return {
            status,
            message,
            data
        }

    },
    /**
     * @description     返回指定长度的随机字符串（除去不易识别字符）
     * @param length
     * @returns {string}
     */
    randomString: (length) => {
        length = length || 6;
        //默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
        const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        let str = '';
        for (let i = 0; i < length; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return str;
    },
    /**
     * @description 解析cookie为字符串
     *
     * @param cookies
     */
    cookieParser: (cookies) => {
        const result = cookies.map(cookie => {
            return cookie.name + '=' + cookie.value;
        });
        return result.join(';');
    },
    /**
     * @description 转换JSON的key为小写
     * @param obj
     * @constructor
     */
    JSONKeyToLowercase: (obj) => {
        let _obj = {};
        for (let key in obj) {
            _obj[key.toLowerCase()] = obj[key];
        }
        return _obj;
    }
}