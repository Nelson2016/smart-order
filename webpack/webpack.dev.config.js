let path = require('path'),
    webpack = require('webpack'),
    autoPrefix = require('autoprefixer'),
    rootPath = path.resolve(__dirname, '..'),
    postCssImport = require('postcss-import'),
    extractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: rootPath,//设置解析入口
    entry: {
        main: [
            'babel-polyfill',
            'eventsource-polyfill',
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true',
            './views/app.js'
        ],
        vendor: [
            'react',
            'react-dom',
            'redux',
            'react-redux',
        ]
    },
    output: {
        path: path.resolve(rootPath, 'dist'),
        filename: "[name].bundle.js",
        publicPath: '/',
    },
    resolve: {
        extensions: [".js", ".jsx", '.scss']
    },
    module: {
        rules: [
            //编译js/jsx
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'stage-0', 'react'],
                    env: {
                        development: {
                            presets: ['react-hmre']
                        }
                    }
                },
            },
            //编译通过import动态引入的scss/css
            {
                test: /\.(css|scss)?$/,
                exclude: /node_modules/,
                use: extractTextPlugin.extract({
                    fallback: 'isomorphic-style-loader',
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                importLoaders: 1,
                                modules: true,
                                localIdentName: '[name]-[local]-[hash:8]'
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: () => [autoPrefix({browsers: ['last 5 versions']}), postCssImport()]//自动添加浏览器前缀
                            }
                        },
                        {loader: "sass-loader"}
                    ]
                }),
            },
            {
                test: /\.(png|jpg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10000,
                            name: "images/[hash:8].[ext]",
                        },
                    },
                ]
            },
            {
                test: /\.(woff|svg|eot|ttf)$/,
                use: [{
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                    }
                }]
            }
        ]
    },
    plugins: [
        new extractTextPlugin('style.bundle.css'),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)})
    ]
};