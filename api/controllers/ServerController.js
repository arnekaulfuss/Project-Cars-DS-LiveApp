/**
 * ServerController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

  start: function(req, res) {
    pcarsds.start();
  },

  stop: function(req, res) {
    pcarsds.stop();
  },

  admin: function(req, res) {
    res.locals.layout = 'Admin/layout';
    return res.view('Admin/server', {});
  }
};
