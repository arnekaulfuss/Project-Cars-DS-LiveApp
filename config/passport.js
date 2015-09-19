/**
 * Passport configuration
 *
 * This is the configuration for your Passport.js setup and where you
 * define the authentication strategies you want your application to employ.
 *
 * I have tested the service with all of the providers listed below - if you
 * come across a provider that for some reason doesn't work, feel free to open
 * an issue on GitHub.
 *
 * Also, authentication scopes can be set through the `scope` property.
 *
 * For more information on the available providers, check out:
 * http://passportjs.org/guide/providers/
 */

module.exports.passport = {
  // local: {
  //   strategy: require('passport-local').Strategy
  // },

  steam: {
    name: 'Steam',
    protocol: 'openid',
    strategy: require('passport-steam').Strategy,
    options: {
      apiKey: '39AA26D4A9FBAE08C174DF4CE58FF3E0'
    }
  }
};
