/**
 * SessionsController
 *
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

  index: function(req, res) {
    res.locals.layout = 'Admin/layout';

    ServerSession.count(function(err, count) {
      ServerSession.find().sort("createdAt DESC").paginate({
        page: req.param('page') || 1,
        limit: sails.config.personnalConfig.pagination.sessions.admin.limit
      }).populateAll().exec(function(err, sessions) {
        return res.view('Admin/Session/index', {
          sessions: sessions,
          pagination: {
            page: req.param('page') || 1,
            href: '/admin/sessions/',
            count: Math.round((count / sails.config.personnalConfig.pagination.sessions.admin.limit))
          }
        });
      });
    });
  },

  delete: function(req, res, next) {
    res.locals.layout = 'Admin/layout';
    if (!req.param('id')) return next();

    async.series({
      laps: function(callback) {
        Lap.destroy({
          session: parseInt(req.param('id'))
        }).exec(function(err, results) {
          callback(null, results);
        });
      },
      Session: function(callback) {
        ServerSession.destroy({
          id: parseInt(req.param('id'))
        }).exec(function(err, results) {
          callback(null, results);
        });
      },
      Result: function(callback) {
        Result.destroy({
          sessions: parseInt(req.param('id'))
        }).exec(function(err, results) {
          callback(null, results);
        });
      }
    }, function(err, result) {
      ServerSession.find().sort('createdAt DESC').populateAll().exec(function(err, sessions) {
        return res.view('Admin/Session/index', {
          sessions: sessions
        });
      });
    });
  }
};
