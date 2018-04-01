const ngtools = require('@ngtools/webpack');
const webpackMerge = require('webpack-merge');
const commonPartial = require('./webpack/webpack.common');
const clientPartial = require('./webpack/webpack.client');
const serverPartial = require('./webpack/webpack.server');
const prodPartial = require('./webpack/webpack.prod');
const { getAotPlugin } = require('./webpack/webpack.aot');


module.exports = function (options, webpackOptions) {
    options = options || {};

    if (options.aot) {
        console.log(`Running build for ${options.client ? 'client' : 'server'} with AoT Compilation`)
    }

    var serverConfig = webpackMerge({}, commonPartial, serverPartial, {
        entry: options.aot ? './src/main.server.aot.ts' : serverPartial.entry, // Temporary
        plugins: [
            getAotPlugin('server', !!options.aot)
        ]
    });

    let clientConfig = webpackMerge({}, commonPartial, clientPartial, {
        plugins: [
            getAotPlugin('client', !!options.aot)
        ]
    });

    if (webpackOptions.p) {
        clientConfig = webpackMerge({}, clientConfig, prodPartial.client);
        serverConfig = webpackMerge({}, prodPartial.server, serverConfig)
    }

    const configs = [];
    // допилил блок для раздельного билда серверной части и фронтовой
    if (options.client_only || options.server_only) {
        if (options.client_only) {
            configs.push(clientConfig);

        } else if (options.server_only) {
            configs.push(serverConfig);
        }
        // это было по умолчанию
    } else {
        if (!options.aot) {
            configs.push(clientConfig, serverConfig);

        } else if (options.client) {
            configs.push(clientConfig);

        } else if (options.server) {
            configs.push(serverConfig);
        }
    }


    return configs;
};
