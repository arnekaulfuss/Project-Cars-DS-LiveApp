/**
 * CarController
 *
 * @description :: Server-side logic for managing cars
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

    index: function (req, res) {
        if (req.param('page')) {
            Car.count(function(err, count){
                Car.find().sort('name ASC').paginate({page: req.param('page'), limit: sails.config.personnalConfig.pagination.cars.admin.limit}).exec(function (err, cars){
                    return res.view('Admin/Car/index',{
                        cars: cars,
                        layout: 'layout_admin',
                        pagination: {
                            page: req.param('page'),
                            href:'/admin/cars/',
                            count: Math.round((count / sails.config.personnalConfig.pagination.cars.admin.limit))
                        }
                    });
                });
            });
        } else {
            Car.count(function(err, count){
                Car.find().sort('name ASC').paginate({page: 1, limit: sails.config.personnalConfig.pagination.cars.admin.limit}).exec(function (err, cars){
                    return res.view('Admin/Car/index',{
                        cars: cars,
                        layout: 'layout_admin',
                        pagination: {
                            page: 1,
                            href:'/admin/cars/',
                            count: Math.round((count / sails.config.personnalConfig.pagination.cars.admin.limit))
                        }
                    });
                });
            });
        }
    },

    edit: function (req, res) {
        console.log('Method: '+req.method);
        console.log('Body: '+req.body);
        if (req.method === "POST") {

            dirname = 'images/cars';
            fileName = req.param('name').split(' ').join('_');
            reqFile = req.file('thumbnail');

            reqFile.upload({
                dirname: '../public/images/cars',
                maxBytes: 10000000,
                saveAs: fileName+'.jpg'
            },function whenDone(err, uploadedFiles) {
                if (err) {
                    return res.negotiate(err);
                }
                data = {
                    name: req.param('name'),
                    brand: req.param('brand'),
                    HP: req.param('HP'),
                    year: req.param('year'),
                    top_speed: req.param('top_speed')

                };
                // If no files were uploaded, respond with an error.
                if (uploadedFiles.length > 0){
                    data.thumb = '/'+dirname+'/'+fileName+'.jpg';
                }
                //console.log(uploadedFiles);
                Car.update(req.param('id'), data).exec(function(err, car) {
                    if (err) {
                        res.redirect('/admin/cars');
                    }
                    Car.find().sort('name ASC').exec(function(error, records) {
                        return res.view('Admin/Car/index',{
                            layout: 'layout_admin',
                            cars: records,
                            msg: 'Car Updated!'
                        });
                    });

                });


            });
        } else {
            Car.findOne({id: req.param('id')}).exec(function(error, record) {
                return res.view('Admin/Car/edit',{
                    layout: 'layout_admin',
                    car: record
                });
            });
        }

    }
};
