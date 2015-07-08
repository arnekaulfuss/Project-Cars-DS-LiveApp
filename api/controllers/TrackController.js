/**
 * ServerController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


 module.exports = {

  index: function (req, res) {
    res.locals.layout = 'Admin/layout';
    Track.count(function(err, count){
      Track.find().sort("name ASC").paginate({
        page: req.param('page') || 1,
        limit: sails.config.personnalConfig.pagination.tracks.admin.limit
      }).exec(function (err, tracks){
        return res.view('Admin/Track/index',{
          tracks: tracks,
          pagination: {
            page: req.param('page') || 1,
            href: '/admin/tracks/',
            count: Math.round((count / sails.config.personnalConfig.pagination.tracks.admin.limit))
          }
        });
      });
    });

  },

  edit: function (req, res) {
    res.locals.layout = 'Admin/layout';
    Track.findOne({id: req.param('id')}).exec(function(error, record) {
      res.view('Admin/Track/edit',{ track: record });
    });
  },

  update: function (req, res, next) {
    res.locals.layout = 'Admin/layout';
    dirname = 'images/tracks';
    fileName = req.param('name').split(' ').join('_');
    reqFile = req.file('thumbnail');

    reqFile.upload({
      dirname: '../public/images/tracks',
      maxBytes: 10000000,
      saveAs: fileName+'.jpg'
    },function whenDone(err, uploadedFiles) {
      if (err) return res.negotiate(err);

      var data = {
        name: req.param('name'),
        location: req.param('location'),
        distance: req.param('distance')
      };
      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length > 0) data.thumb = '/'+dirname+'/'+fileName+'.jpg';

      //console.log(uploadedFiles);
      Track.update(req.param('id'), data).exec(function(err, track) {
        if (err)  return res.redirect('/admin/tracks');

        Track.find().sort('name ASC').exec(function(error, records) {
          res.view('Admin/Track/index',{
            locals: {
              layout: 'layout_admin'
            },
            tracks: records,
            msg: 'Track Updated!'
          });
        });
      });
    });
  }
};
