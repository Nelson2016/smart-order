import Koa from 'koa';
import path from 'path';
import webpack from 'webpack';
import views from 'koa-views';
import asset from 'koa-static';
import serverRoutes from '../router/ServerRouter'
import config from '../config/config';
import {devMiddleware, hotMiddleware} from 'koa-webpack-middleware';
import webpackDevConfig from '../webpack/webpack.dev.config';
import mongoose from 'mongoose';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session-minimal';
import redis from 'koa-redis';
import uploader from 'koa2-file-upload';

mongoose.connect('mongodb://localhost/smart-order');

const app = new Koa(),
    rootPath = path.resolve(__dirname, '..'),
    viewsPath = path.resolve(rootPath, 'views'),
    assetPath = path.resolve(rootPath, 'dist'),
    compile = webpack(webpackDevConfig),
    isDev = process.env.NODE_ENV === 'development',
    isPro = process.env.NODE_ENV === 'production',
    port = isPro ? config.prod.port : config.dev.port,
    db = mongoose.connection;

db.on('error', () => {
    console.error('数据库初始化错误');
});

db.on('open', () => {
    console.log('数据库初始化成功');
});

//Session
app.use(session({
    store: redis(),
}));
//Body parser
app.use(bodyParser());
//处理试图
app.use(views(viewsPath, {map: {html: 'nunjucks'}}));
//处理静态资源
app.use(asset(assetPath));
//热替换
if (isDev) {
    app.use(devMiddleware(compile, {
        noInfo: false,
        publicPath: webpackDevConfig.output.publicPath,
        stats: {
            colors: true
        }
    }));
}
app.use(hotMiddleware(compile, {}));

//服务端API
app.use(serverRoutes.routes()).use(serverRoutes.allowedMethods());
//上传文件API
app.use(uploader({
    "url": '/api/admin/uploadArticleCover',
    "storeDir": 'upload/articleCover',
    "provider": "local",
    "mimetypes": ['image/png','image/jpg','image/jpeg'],
    "folder": "dist",
    "urlPath": ""
}));

//启动服务器
app.listen(port, function () {
    console.log(`👍====Server is running at localhost:${port}====👍`);
});