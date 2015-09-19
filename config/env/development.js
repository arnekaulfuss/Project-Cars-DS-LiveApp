/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  models: {
    connection: 'Mysql'
  },

  port: 1337,

  log: {
    level: "info"
  },

  connections: {

    Mysql: {
      adapter: 'sails-mysql',
      host: 'localhost',
      user: 'pcars',
      password: 'B2mtsf447YCBBSA6',
      database: 'pcars'
    }

  },

  session: {
    secret: 'ab3c37c30aa80156ab468047012c0c1a'
  },

  personnalConfig: {

    sitename: "noNameWEB hosted by surtic86",
    siteUrl: "http://game.nonameweb.ch:1337",
    siteLogo50x: "/images/logo/logo50x50.png",

    logResultsPath: 'LogResults/',

    DsApiUrl: {
      protocol: 'http://',
      host: '127.0.0.1',
      port: '9000'
    }

  }

};
