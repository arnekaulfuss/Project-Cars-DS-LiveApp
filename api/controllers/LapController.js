/**
 * LapController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

    adminIndex : function(req, res) {
        if (req.param('page')) {
            Lap.count(function(err, count){
                Lap.find().sort("createdAt DESC").paginate({page: req.param('page'), limit: sails.config.personnalConfig.pagination.laps.admin.limit}).populateAll().exec(function (err, laps){
                    return res.view('Admin/Lap/index',{
                        laps: laps,
                        layout: 'layout_admin',
                        pagination: {
                            page: req.param('page'),
                            href: '/admin/laps/',
                            count: Math.round((count / sails.config.personnalConfig.pagination.laps.admin.limit))
                        }
                    });
                });
            });
        } else {
            Lap.count(function(err, count){
                Lap.find().sort("createdAt DESC").paginate({page: 1, limit: sails.config.personnalConfig.pagination.laps.admin.limit}).populateAll().exec(function (err, laps){
                    return res.view('Admin/Lap/index',{
                        laps: laps,
                        layout: 'layout_admin',
                        pagination: {
                            page: 1,
                            href: '/admin/laps/',
                            count: Math.round((count / sails.config.personnalConfig.pagination.laps.admin.limit))
                        }

                    });
                });
            });

        }
    },

    delete: function (req, res) {
        if (req.param('id')) {
            Lap.findOne(req.param('id')).exec(function (err, lap){
                if (err) {
                   return res.json(500, {msg: "Unable to find the lap in Database", class: 'alert-danger'});
               }
                Lap.destroy(lap.id).exec(function(err){
                    if (err) {
                        return res.json(500, {msg: err});
                    }
                    return res.json(200, {msg: "Lap deleted", class: 'alert-success'});
                });
            });

        }
    }
};
