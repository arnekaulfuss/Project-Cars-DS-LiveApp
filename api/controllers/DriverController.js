/**
 * DriverController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


 module.exports = {

  index: function (req, res) {
    Driver.count(function(err, count){
      Driver.find().sort("name ASC").paginate({
        page: req.param('page') || 1,
        limit: sails.config.personnalConfig.pagination.drivers.admin.limit
      }).populateAll().exec(function (err, drivers){
        sails.log(res.locals.layout);

        var view = 'Driver/index';
        var href = '/drivers/';

        if (res.locals.layout) {
          view = 'Admin/Driver/index';
          href = '/admin/drivers/'
        }
        return res.view(view, {
          drivers: drivers,
          pagination: {
            page: req.param('page') || 1,
            href: href,
            count: Math.round(count / sails.config.personnalConfig.pagination.drivers.admin.limit)
          }
        });
      });
    });
  },

  adminIndex: function (req, res) {
    res.locals.layout = 'Admin/layout';
    this.index(req, res);
  },

  edit: function (req, res) {
    Driver.findOne({id: req.param('id')}).populate('sessionsplayed').exec(function(error, record) {
      async.series({
        laps: function(callback){
          Lap.find({owner: record.id}).populateAll().limit(50).exec(function(err, results){
           callback(null, results);
         });
        }
      },function (err, result) {
        record.sessions = [];
        async.each(record.sessionsplayed, function(session, callback) {
          ServerSession.findOne(session.id).populateAll().limit(50).exec(function(err, result){
            record.sessions.push(result);
            callback();
          });
        }, function(err){
          record.lapsDone = result.laps;
          res.locals.layout = 'Admin/layout';
          return res.view('Admin/Driver/edit',{
            driver: record
          });
        });
      });
    });
  },

  update: function (req, res, next) {
    res.locals.layout = 'Admin/layout';
    var dirname = 'images/drivers';
    var fileName = req.param('id');
    var reqFile = req.file('avatar');

    reqFile.upload({
      dirname: '../public/images/drivers',
      maxBytes: 10000000,
      saveAs: fileName+'.jpg'
    },function whenDone(err, uploadedFiles) {
      if (err) {
        req.flash('error', 'Couldn\'t upload file.')
        return res.redirect('back');
      }

      var data = {
        name: req.param('name')
      };

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length > 0){
        data.avatar = '/' + dirname + '/' + fileName + '.jpg';
      }

      //console.log(uploadedFiles);
      Driver.update(req.param('id'), data).exec(function(err, car) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/admin/drivers');
        }

        Driver.find().populateAll().sort('name ASC').exec(function(error, records) {
          req.flash('info', 'Driver updated!');
          res.redirect('/admin/drivers');
        });
      });
    });
  },

  view: function(req, res){
    Driver.findOne({id: req.param('id')}).populate('sessionsplayed', {sort:'id DESC'}).exec(function(error, record) {
      async.series({
        laps: function(callback){
          Lap.find({owner: record.id}).sort('createdAt DESC').limit(50).populateAll().exec(function(err, results){
            callback(null, results);
          });
        }
      },function (err, result) {
        record.sessions = [];
        async.each(record.sessionsplayed, function(session, callback) {
          ServerSession.findOne(session.id).populateAll().limit(50).exec(function(err, result){
            record.sessions.push(result);
            callback();
          });
        }, function(err){
          record.lapsDone = result.laps;
          return res.view('Driver/view',{
            driver: record
          });
        });
      });

    });
  }
};
