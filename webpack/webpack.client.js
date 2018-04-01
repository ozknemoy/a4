const { root } = require('./helpers');

const { AotPlugin } = require('@ngtools/webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const ScriptExtPlugin = require('script-ext-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
/**
 * This is a client config which should be merged on top of common config
 */
module.exports = {
    entry: root('./src/main.browser.ts'),
    //entry: [root('./src/main.browser.ts'),'webpack-hot-middleware/client'],
    output: {
        filename: 'client.js'
    },
    target: 'web',
    plugins: [
        new HtmlWebpackPlugin({
            template: root('./src/index.html'),
            output: root('dist'),
            inject: 'head'
        }),
        new ScriptExtPlugin({
            defaultAttribute: 'defer'
        }),
        new CopyWebpackPlugin([
            {from: 'src/assets', to: 'assets'},

            {from: 'src/files', to: 'files'}
        ])
    ]
};
