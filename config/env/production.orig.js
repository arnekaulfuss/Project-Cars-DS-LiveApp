/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  connections: {

    MysqlServer: {
      adapter: 'sails-mysql',
      host: 'YOUR_MYSQL_SERVER_HOSTNAME_OR_IP_ADDRESS',
      user: 'YOUR_MYSQL_USER',
      password: 'YOUR_MYSQL_PASSWORD',
      database: 'YOUR_MYSQL_DB'
    }

  },

  personnalConfig: {

    sitename: "Your Site Name",
    siteUrl: "http://localhost:1337",
    siteLogo50x: "/images/logo/logo50x50.png",

    logResultsPath: 'data/results/',

    DsApiUrl: {
      protocol: 'http://',
      host: '127.0.0.1',
      port: '9000'
    }

  },

  session: {
    secret: 'ab3c37c30aa80156ab468047012c0c1a',
  },

  /**
   * For advanced users only
   */
  port: 80,

  log: {
    level: "silent"
  },

  models: {
    connection: 'MysqlServer'
  },

  passport: {
      steam: {
          options: {
              returnURL: 'http://localhost:1337/auth/steam/callback',
              realm: 'http://localhost:1337/'
          }
      }
  }

};
