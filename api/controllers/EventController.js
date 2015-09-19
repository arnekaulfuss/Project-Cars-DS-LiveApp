/**
 * EventsController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

  index: function(req, res) {
    Event.count(function(err, count) {
      Event.find().sort('name ASC').paginate({
        page: req.param('page') || 1,
        limit: sails.config.personnalConfig.pagination.events.frontend.limit
      }).exec(function(err, events) {
        var view = 'Event/index';
        var href = '/events/';
        if (res.locals.layout) {
          view = 'Admin/Event/index';
          href = '/admin/events/';
        }
        res.view(view, {
          events: events,
          pagination: {
            page: req.param('page') || 1,
            href: href,
            count: Math.round((count / sails.config.personnalConfig.pagination.events.frontend.limit))
          }
        });
      });
    });
  },

  indexAdmin: function(req, res) {
    res.locals.layout = 'Admin/layout';
    this.index(req, res);
  },

  edit: function(req, res) {
    res.locals.layout = 'Admin/layout';

    async.series({
      tracks: function(callback) {
        Track.find().sort('name ASC').exec(function(error, results) {
          callback(null, results);
        });
      },
      cars: function(callback) {
        Car.find().sort('name ASC').exec(function(error, results) {
          callback(null, results);
        });
      },
      groups: function(callback) {
        Group.find().sort('name ASC').exec(function(error, results) {
          callback(null, results);
        });
      },
      Event: function(callback) {
        Event.findOne({
          id: req.param('id')
        }).exec(function(error, record) {
          callback(null, record);
        });
      }
    }, function(err, results) {
      return res.view('Admin/Event/edit', {
        tracks: results.tracks,
        cars: results.cars,
        groups: results.groups,
        event: results.Event
      });
    });
  },

  update: function(req, res, next) {
    if (!req.param('name')) return next();

    var dirname = 'images/events';
    var fileName = req.param('name').split(' ').join('_');
    var reqFile = req.file('thumbnail');

    reqFile.upload({
      dirname: '../public/images/events',
      maxBytes: 10000000,
      saveAs: fileName + '.jpg'
    }, function(err, uploadedFiles) {
      if (err) return res.negotiate(err);

      var flags = 0;
      for (var i in req.param('Flags')) flags += parseInt(req.param('Flags')[i]);

      var data = {
        name: req.param('name'),
        servername: req.param('servername'),
        dateIngame: req.param('dateIngame_submit') + ' ' + req.param('timeIngame_submit') + ':00',
        //Flags: flags,
        PracticeLength: parseInt(req.param('PracticeLength')),
        QualifyLength: parseInt(req.param('QualifyLength')),
        RaceLength: parseInt(req.param('RaceLength')),
        DamageType: parseInt(req.param('DamageType')),
        TireWearType: parseInt(req.param('TireWearType')),
        FuelUsageType: parseInt(req.param('FuelUsageType')),
        PenaltiesType: parseInt(req.param('PenaltiesType')),
        AllowedViews: parseInt(req.param('AllowedViews')),
        DateProgression: parseInt(req.param('DateProgression')),
        ForecastProgression: parseInt(req.param('ForecastProgression')),
        WeatherSlot1: parseInt(req.param('WeatherSlot1')),
        WeatherSlot2: parseInt(req.param('WeatherSlot2')),
        WeatherSlot3: parseInt(req.param('WeatherSlot3')),
        WeatherSlot4: parseInt(req.param('WeatherSlot4')),
        start: req.param('start_submit'),
        end: req.param('end_submit'),
        track: parseInt(req.param('track')),
        group: parseInt(req.param('group')),
        car: parseInt(req.param('car')),
        content: req.param('content')
      };
      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length > 0) data.thumb = '/' + dirname + '/' + fileName + '.jpg';

      //console.log(uploadedFiles);
      Event.update(parseInt(req.param('id-val')), data).exec(function(err, event) {
        Event.find().sort('createdAt DESC').exec(function(error, records) {
          if (err) {
            console.log(err);
            return res.view('Admin/Event/index', {
              locals: {
                layout: 'layout_admin'
              },
              events: records,
              msg: 'There are an error when creating your event!'
            });
          }
          return res.redirect('admin/events');
        });
      });
    });
  },

  show: function(req, res) {
    Event.findOne(req.param('id')).populateAll().exec(function(error, record) {
      return res.view('Event/show', {
        event: record
      });
    });
  },

  add: function(req, res) {
    if (req.method === "POST") {
      this.create(req, res, next);
    } else {
      async.series({
        tracks: function(callback) {
          Track.find().sort('name ASC').exec(function(error, results) {
            callback(null, results);
          });
        },
        cars: function(callback) {
          Car.find().sort('name ASC').exec(function(error, results) {
            callback(null, results);
          });
        },
        groups: function(callback) {
          Group.find().sort('name ASC').exec(function(error, results) {
            callback(null, results);
          });
        }
      }, function(err, results) {
        return res.view('Admin/Event/add', {
          tracks: results.tracks,
          cars: results.cars,
          groups: results.groups
        });
      });
    }
  },

  create: function(req, res, next) {
    if (!req.param('name')) return next();
    console.log('okay on create');
    var dirname = 'images/events';
    var fileName = req.param('name').split(' ').join('_');
    var reqFile = req.file('thumbnail');

    reqFile.upload({
      dirname: '../public/images/events',
      maxBytes: 10000000,
      saveAs: fileName + '.jpg'
    }, function(err, uploadedFiles) {
      if (err) return res.negotiate(err);

      var flags = 0;
      for (var i in req.param('Flags')) flags += parseInt(req.param('Flags')[i]);

      var data = {
        name: req.param('name'),
        servername: req.param('servername'),
        dateIngame: req.param('dateIngame') + ' ' + req.param('timeIngame'),
        //Flags:                  flags,
        PracticeLength: req.param('PracticeLength'),
        QualifyLength: req.param('QualifyLength'),
        RaceLength: req.param('RaceLength'),
        DamageType: req.param('DamageType'),
        TireWearType: req.param('TireWearType'),
        FuelUsageType: req.param('FuelUsageType'),
        PenaltiesType: req.param('PenaltiesType'),
        AllowedViews: req.param('AllowedViews'),
        DateProgression: req.param('DateProgression'),
        ForecastProgression: req.param('ForecastProgression'),
        WeatherSlot1: req.param('WeatherSlot1'),
        WeatherSlot2: req.param('WeatherSlot2'),
        WeatherSlot3: req.param('WeatherSlot3'),
        WeatherSlot4: req.param('WeatherSlot4'),
        start: req.param('start'),
        end: req.param('end'),
        track: req.param('track'),
        group: req.param('group'),
        car: req.param('car')
      };
      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length > 0) data.thumb = '/' + dirname + '/' + fileName + '.jpg';

      //console.log(uploadedFiles);
      Event.create(data).exec(function(err, track) {
        Event.find().sort('name ASC').exec(function(error, records) {
          if (err) {
            console.log(err);
            return res.view('Admin/Event/index', {
              events: records,
              msg: 'There are an error when creating your event!'
            });
          }
          return res.redirect('admin/events');
        });
      });
    });
  },

  delete: function(req, res) {

  }

};
