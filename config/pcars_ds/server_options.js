var appGlobals = require('../globals.js').globals;
var _ = require('lodash');

module.exports = {
  name: _name(_name(_.camelCase(appGlobals.sitename))),
  password: '',
  maxPlayerCount: 64,
  bindIP: '', // your home ip
  httpApiInterface: '127.0.0.1',
  httpApiPort: 9000,
  _name: _name,
  _siteName: _.camelCase(appGlobals.sitename)
}

function _name (prefix) {
  return prefix + '-' + Math.round(Math.random() * 10000);
}
