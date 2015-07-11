var appGlobals = require('../globals.js').globals;
var _ = require('lodash');

module.exports = {
  name: _.camelCase(appGlobals.sitename) + '-' + Math.round(Math.random() * 10000),
  password: '',
  maxPlayerCount: 64,
  bindIP: '', // your home ip
  httpApiInterface: '127.0.0.1',
  httpApiPort: 9000
}
