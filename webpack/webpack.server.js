const { root } = require('./helpers');
const fs = require('fs');
const { AotPlugin } = require('@ngtools/webpack');

/**
 * This is a server config which should be merged on top of common config
 */
module.exports = {
  entry: root('./src/main.server.ts'),
  output: {
    filename: 'server.js'
  },
  target: 'node',
  // когда падают ошибки типа Module not found: Error: Can't resolve 'tedious'
  externals: ["pg-native", "sqlite3", "tedious", "pg-hstore"]
};
