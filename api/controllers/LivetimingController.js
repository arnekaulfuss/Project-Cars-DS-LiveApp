/**
 * LivetimingController
 *
 * @description :: Server-side logic for managing tracks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require('fs-extra');

module.exports = {

  getLiveData: function(req, res) {
    if (req.param('from')) {
      sails.hooks.pcarsserver.getLive(req.socket, req.param('from'));
    } else {
      var roomName = "Live";
      sails.sockets.join(req.socket, roomName);
      sails.hooks.pcarsserver.getLive(req.socket);
    }


  },

  bestlapsQuery: function(req, res) {
    var thisdriver = [];
    var QueryConditions = {};
    var LapConditions = {};
    var DriverConditions = {
      select: ['id', 'name']
    };
    var request = req.allParams();
    var json = {};

    if (typeof request.Track == 'number') {
      if (typeof request.Track != 'undefined') {
        QueryConditions = {
          id: request.Track
        };
        Track.findOne(QueryConditions).populateAll().exec(function(err, track) {
          json.track = track;
        });
      }
    }

    Track.find(QueryConditions).exec(function(err, tracks) {
      async.eachSeries(tracks, function(track, FirstCallback) {

        //LapConditions.session.name = request.session;
        LapConditions.Track = track.id;
        LapConditions.CountThisLapTimes = 1;
        LapConditions.min = "LapTime";

        if (typeof request.Driver == 'number' && request.Driver !== null) {
          if (typeof request.Driver != 'undefined') {
            DriverConditions.id = request.Driver;
          }
        }

        if (typeof request.Car == 'number') {
          if (typeof request.Car != 'undefined') {
            LapConditions.car = request.Car;
          }
        }

        if (typeof request.Event == 'number') {
          if (typeof request.Event != 'undefined') {
            LapConditions.Events = request.Event;
          }
        }

        if (typeof request.Group == 'number') {
          if (typeof request.Group != 'undefined') {
            LapConditions.group = request.Group;
          }
        }

        if (typeof request.SessionStage == 'number') {
          if (typeof request.SessionStage != 'undefined') {
            var stage = "";
            if (request.SessionStage === 1) {
              stage = "Practice1";
            } else if (request.SessionStage === 2) {
              stage = "Practice2";
            } else if (request.SessionStage === 3) {
              stage = "Qualifying";
            } else if (request.SessionStage === 4) {
              stage = "Warmup";
            } else if (request.SessionStage === 5) {
              stage = "Race1";
            } else if (request.SessionStage === 6) {
              stage = "Race2";
            }
            LapConditions.SessionStage = stage;
          }
        }

        Driver.find(DriverConditions).exec(function(err, drivers) {

          async.eachSeries(drivers, function(driver, callback2) {

            LapConditions.owner = driver.id;

            Lap.find(LapConditions).exec(function(err, record) {
              if (record.length > 0) {
                if (record[0].LapTime != null) {

                  Lap.findOne({
                    LapTime: record[0].LapTime
                  }).populateAll().exec(function(err, result) {
                    var data = {};
                    data = result;
                    thisdriver.push(data);
                    callback2();
                  });
                } else {
                  callback2();
                }
              }
            });
          }, function(err) {
            FirstCallback();
          });
        });
      }, function(err) {
        async.sortBy(thisdriver, function(x, callback) {
          callback(null, x.LapTime);
        }, function(err, result) {
          json.lap = result;
          return res.json(json);
        });
      });
    });
  },

  bestlapsView: function(req, res) {
    async.series({
      drivers: function(callback) {
        Driver.find().sort('name ASC').exec(function(error, results) {
          callback(null, results);
        });
      },
      tracks: function(callback) {
        Track.find().sort('name ASC').populateAll().exec(function(error, results) {
          callback(null, results);
        });
      },
      cars: function(callback) {
        Car.find().sort('name ASC').exec(function(error, results) {
          callback(null, results);
        });
      },
      events: function(callback) {
        Event.find().sort('name ASC').exec(function(error, results) {
          callback(null, results);
        });
      },
      groups: function(callback) {
        Group.find().sort('name ASC').exec(function(error, results) {
          callback(null, results);
        });
      }
    }, function(err, results) {
      return res.view('Livetiming/bestlaps', {
        drivers: results.drivers,
        tracks: results.tracks,
        cars: results.cars,
        events: results.events,
        groups: results.groups
      });
    });
  },

  stats: function(req, res) {
    async.series({
      drivers: function(callback) {
        Driver.find().sort('name ASC').populateAll().exec(function(error, results) {
          async.each(results, function(result, callback2) {
            result.distanceTravelled = 0;
            async.each(result.laps, function(lap, callback3) {
              result.distanceTravelled = result.distanceTravelled + lap.DistanceTravelled;
              callback3();
            });
            callback2()
          });

          callback(null, results);
        });
      },
      tracks: function(callback) {
        Track.find().sort('name ASC').populateAll().exec(function(error, results) {
          callback(null, results);
        });
      },
      cars: function(callback) {
        Car.find().sort('name ASC').populateAll().exec(function(error, results) {
          callback(null, results);
        });
      },
      laps: function(callback) {
        Lap.find().exec(function(error, results) {
          var counted = 0;
          var travelled = 0;
          async.each(results, function(result, callback2) {
            if (result.CountThisLapTimes == 1) {
              counted++;
            }
            travelled = travelled + result.DistanceTravelled;
            callback2();
          });
          var data = {
            global: {
              counted: counted,
              all: results.length,
              distance: travelled
            }
          };
          callback(null, data);
        });
      },
      sessions: function(callback) {
        ServerSession.find().populateAll().exec(function(error, results) {
          callback(null, results);
        });
      },
      groups: function(callback) {
        Group.find().populateAll().exec(function(error, results) {
          callback(null, results);
        });
      },
      events: function(callback) {
        Event.find().populateAll().exec(function(error, results) {
          callback(null, results);
        });
      }
    }, function(err, results) {
      return res.view('Livetiming/stats', {
        drivers: results.drivers,
        tracks: results.tracks,
        cars: results.cars,
        laps: results.laps,
        sessions: results.sessions,
        groups: results.groups,
        events: results.events
      });
    });
  },

  resultsIndex: function(req, res) {
    ServerSession.count(function(err, count) {
      ServerSession.find().sort("createdAt DESC").paginate({
        page: req.param('page') || 1,
        limit: sails.config.personnalConfig.pagination.results.frontend.limit
      }).populateAll().exec(function(err, sessions) {
        return res.view('Result/index', {
          sessions: sessions,
          pagination: {
            page: req.param('page') || 1,
            href: '/results/',
            count: Math.round((count / sails.config.personnalConfig.pagination.results.frontend.limit))
          }
        });
      });
    });
    /*ServerSession.find().sort('createdAt DESC').populateAll().exec(function(err, results) {
        return res.view('Result/index',{
            sessions: results
        });
    });*/
  },

  resultsView: function(req, res) {
    var request = req.allParams();
    ServerSession.findOne({
      id: request.id
    }).exec(function(err, result) {
      if (err) return res.negotiate(err);
      if (typeof result == "undefined") return res.notFound(undefined, '404');

      var filename = result.id + '.json';
      var folder = sails.config.personnalConfig.logResultsPath;

      fs.readJson(folder + filename, function(err, file) {

        if (typeof file == "undefined") return res.notFound(undefined, '404');

        return res.view('Result/view', {
          file: file,
          Incidents: result.incidents.length
        });
      });

    });

  },

  resultsQuery: function(req, res) {
    var request = req.allParams();
    var filename = request.id + '.json';
    var folder = sails.config.personnalConfig.logResultsPath;

    fs.readJson(folder + filename, function(err, file) {
      res.json({
        file: file,
        Incidents: request.incidents
      });
    });
  }

};
