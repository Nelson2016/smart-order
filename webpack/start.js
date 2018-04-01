//编译通过require引入的node
require('babel-register')({
    presets: ['es2015', 'react', 'stage-0'],
    plugins: ['transform-runtime']
});

//处理scss
require('css-modules-require-hook')({
    extensions: ['.scss', '.css'],
    preprocessCss: (data, filename) => require('node-sass').renderSync({
        data,
        file: filename
    }).css,
    camelCase: true,
    generateScopedName: '[name]-[local]-[hash:8]'
});


//处理图片
require('asset-require-hook')({
    limit: 10000,
    name: '/images/[hash:8].[ext]',
    extensions: ['jpg', 'png'],
});


require('../server/server');

