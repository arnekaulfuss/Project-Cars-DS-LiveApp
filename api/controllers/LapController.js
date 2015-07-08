/**
 * LapController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


 module.exports = {

  adminIndex : function(req, res) {
    res.locals.layout = 'Admin/layout';
    Lap.count(function(err, count){
      Lap.find().sort("createdAt DESC").paginate({
        page: req.param('page') || 1,
        limit: sails.config.personnalConfig.pagination.laps.admin.limit
      }).populateAll().exec(function (err, laps){
        return res.view('Admin/Lap/index',{
          laps: laps,
          pagination: {
            page: req.param('page'),
            href: '/admin/laps/',
            count: Math.round((count / sails.config.personnalConfig.pagination.laps.admin.limit))
          }
        });
      });
    });
  },

  delete: function (req, res, next()) {
    if (!req.param('id')) return next();
    Lap.findOne(req.param('id')).exec(function (err, lap){
      if (err) return res.json(500, {msg: "Unable to find the lap in Database", class: 'alert-danger'});
      Lap.destroy(lap.id).exec(function(err){
        if (err) return res.json(500, {msg: err});
        return res.json(200, {msg: "Lap deleted", class: 'alert-success'});
      });
    });
  }
};
