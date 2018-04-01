const { root } = require('./helpers');
const webpack  = require('webpack');
/**
 * This is a common webpack config which is the base for all builds
 */
module.exports = {
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        path: root('dist')
    },
    module: {
        rules: [
            {test: /\.ts$/, loader: '@ngtools/webpack'},
            {test: /\.css$/, loader: 'raw-loader'},
            {test: /\.html$/, loader: 'raw-loader'}
        ]
    },
    plugins: []
};
