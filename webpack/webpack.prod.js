/**
 * это добавится в сборку с командой -p
 * минификация и добавится потом перенос assets
 */
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const commonReplaceBASE_URL = {
    // тут подменяю строки

    // для двух главных модулей server-app.module.ts browser-app.module.ts
    // не находит почему то хотя ниже настройка с /server-app\.module\.ts$/ находила
    test: /\.ts$/,
    loader: 'webpack-replace',
    query: {
        replace: [{
            from: 'testservice.prioriticlub.ru/v1/',
            to: 'service.prioriticlub.ru/v1/'
        }]
    }
};
module.exports = {
    client: {
        module: {
            rules: [/*commonReplaceBASE_URL*/]
        },
        plugins: [
            // ozk добавил чтобы обычным продом без аот пользоваться(аот сжимает по умолчанию)
            new UglifyJsPlugin({
                beautify: false, //prod
                output: {
                    comments: false
                }, //prod
                mangle: {
                    screw_ie8: true
                }, //prod
                compress: {
                    screw_ie8: true,
                    warnings: false,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true,
                    negate_iife: false // we need this for lazy v8
                }
            })
        ]
    },
    server: {
        module: {
            rules: [/*commonReplaceBASE_URL*/]
            /*rules: [{
             // тут подменяю строки
             test: /server-app\.module\.ts$/,
             loader: 'webpack-replace',
             query: {
             replace: [{
             from: 'service.prioriti.constart.ru',
             to: '192.168.100.28:81'
             }]
             }
             }]*/
        }
    }
};
