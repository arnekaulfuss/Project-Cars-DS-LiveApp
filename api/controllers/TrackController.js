/**
 * ServerController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

    index: function (req, res) {
        if (req.param('page')) {
            Track.count(function(err, count){
                Track.find().sort("name ASC").paginate({page: req.param('page'), limit: 50}).exec(function (err, tracks){
                    return res.view('Admin/Track/index',{
                        tracks: tracks,
                        admin: true,
                        pagination: {
                            page: req.param('page'),
                            href: '/admin/tracks/',
                            count: Math.round((count / 50))
                        }
                    });
                });
            });
        } else {
            Track.count(function(err, count){
                Track.find().sort("name ASC").limit(50).exec(function (err, tracks){
                    return res.view('Admin/Track/index',{
                        tracks: tracks,
                        admin: true,
                        pagination: {
                            page: 1,
                            href: '/admin/tracks/',
                            count: Math.round((count / 50))
                        }

                    });
                });
            });

        }
    },

    edit: function (req, res) {
        if (req.method === "POST") {
            dirname = 'images/tracks';
            fileName = req.param('name').split(' ').join('_');
            reqFile = req.file('thumbnail');

            reqFile.upload({
                dirname: '../public/images/tracks',
                maxBytes: 10000000,
                saveAs: fileName+'.jpg'
            },function whenDone(err, uploadedFiles) {
                if (err) {
                    return res.negotiate(err);
                }
                data = {
                    name: req.param('name'),
                    location: req.param('location'),
                    distance: req.param('distance')
                };
                // If no files were uploaded, respond with an error.
                if (uploadedFiles.length > 0){
                       data.thumb = '/'+dirname+'/'+fileName+'.jpg';
                }
                //console.log(uploadedFiles);
                Track.update(req.param('id'), data).exec(function(err, track) {
                    if (err) {
                        res.redirect('/admin/tracks');
                    }
                    Track.find().sort('name ASC').exec(function(error, records) {
                        return res.view('Admin/Track/index',{
                            admin: true,
                            tracks: records,
                            msg: 'Track Updated!'
                        });
                    });

                });


            });
        } else {
            Track.findOne({id: req.param('id')}).exec(function(error, record) {
                return res.view('Admin/Track/edit',{
                    admin: true,
                    track: record
                });
            });
        }

    }


};
