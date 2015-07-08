/**
 * SessionsController
 *
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

    index: function(req, res) {
        if (req.param('page')) {
            ServerSession.count(function(err, count){
                ServerSession.find().sort("createdAt DESC").paginate({page: req.param('page'), limit: sails.config.personnalConfig.pagination.sessions.admin.limit}).populateAll().exec(function (err, sessions){
                    return res.view('Admin/Session/index',{
                        sessions: sessions,
                        admin: true,
                        pagination: {
                            page: req.param('page'),
                            href: '/admin/sessions/',
                            count: Math.round((count / sails.config.personnalConfig.pagination.sessions.admin.limit))
                        }
                    });
                });
            });
        } else {
            ServerSession.count(function(err, count){
                ServerSession.find().sort("createdAt DESC").paginate({page: 1, limit: sails.config.personnalConfig.pagination.sessions.admin.limit}).populateAll().exec(function (err, sessions){
                    return res.view('Admin/Session/index',{
                        sessions: sessions,
                        admin: true,
                        pagination: {
                            page: 1,
                            href: '/admin/sessions/',
                            count: Math.round((count / sails.config.personnalConfig.pagination.sessions.admin.limit))
                        }

                    });
                });
            });

        }
    },

    delete: function(req,res) {
        if (req.param('id')) {
            async.series({
                laps: function (callback) {
                    Lap.destroy({session: parseInt(req.param('id'))}).exec(function(err, results){
                        callback(null, results);
                    });
                },
                Session: function (callback) {
                    ServerSession.destroy({id: parseInt(req.param('id'))}).exec(function(err, results){
                        callback(null, results);
                    });
                },
                Result: function (callback) {
                    Result.destroy({sessions: parseInt(req.param('id'))}).exec(function(err, results){
                        callback(null, results);
                    });
                }
            },function (err, result) {
                ServerSession.find().sort('createdAt DESC').populateAll().exec(function(err, sessions){
                    return res.view('Admin/Session/index',{
                        sessions: sessions,
                        admin: true
                    });
                });
            });
        }

    }

};
