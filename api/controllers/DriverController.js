/**
 * DriverController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

    adminIndex: function (req, res) {
        if (req.param('page')) {
            Driver.count(function(err, count){
                Driver.find().sort("name ASC").paginate({page: req.param('page'), limit: 50}).populateAll().exec(function (err, drivers){
                    return res.view('Admin/Driver/index',{
                        drivers: drivers,
                        admin: true,
                        pagination: {
                            page: req.param('page'),
                            count: Math.round((count / 50))
                        }
                    });
                });
            });
        } else {
            Driver.count(function(err, count){
                Driver.find().sort("name ASC").limit(50).populateAll().exec(function (err, drivers){
                    return res.view('Admin/Driver/index',{
                        drivers: drivers,
                        admin: true,
                        pagination: {
                            page: 1,
                            count: Math.round((count / 50))
                        }

                    });
                });
            });
        }
    },

    index: function (req, res) {
        if (req.param('page')) {
            Driver.count(function(err, count){
                Driver.find().sort("name ASC").paginate({page: req.param('page'), limit: 50}).populateAll().exec(function (err, drivers){
                    return res.view('Driver/index',{
                        drivers: drivers,
                        pagination: {
                            page: req.param('page'),
                            href: '/admin/driver/',
                            count: Math.round((count / 50))
                        }
                    });
                });
            });
        } else {
            Driver.count(function(err, count){
                Driver.find().sort("name ASC").limit(50).populateAll().exec(function (err, drivers){
                    return res.view('Driver/index',{
                        drivers: drivers,
                        pagination: {
                            page: 1,
                            href: '/admin/driver/',
                            count: Math.round((count / 50))
                        }

                    });
                });
            });
        }
    },

    edit: function (req, res) {
        if (req.method === "POST") {

            dirname = 'images/drivers';
            fileName = req.param('id');
            reqFile = req.file('avatar');

            reqFile.upload({
                dirname: '../public/images/drivers',
                maxBytes: 10000000,
                saveAs: fileName+'.jpg'
            },function whenDone(err, uploadedFiles) {
                if (err) {
                    return res.negotiate(err);
                }
                data = {
                    name: req.param('name')
                };
                // If no files were uploaded, respond with an error.
                if (uploadedFiles.length > 0){
                    data.avatar = '/'+dirname+'/'+fileName+'.jpg';
                }
                //console.log(uploadedFiles);
                Driver.update(req.param('id'), data).exec(function(err, car) {
                    if (err) {
                        res.redirect('/admin/drivers');
                    }
                    Driver.find().populateAll().sort('name ASC').exec(function(error, records) {
                        return res.view('Admin/Driver/index',{
                            admin: true,
                            drivers: records,
                            msg: 'Driver updated!'
                        });
                    });

                });


            });
        } else {
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
                            return res.view('Admin/Driver/edit',{
                                admin: true,
                                driver: record
                            });
                        });
                });
            });
        }

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
