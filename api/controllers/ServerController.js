/**
 * ServerController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

    start: function (req, res) {
        sails.hooks.pcarsserver.start();
    },

    stop: function (req, res) {
        sails.hooks.pcarsserver.stop();
    },

    admin: function(req, res) {
      res.locals.layout = 'Admin/layout';
        return res.view('Admin/server', {});
    }
};
