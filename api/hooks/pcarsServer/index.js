module.exports = function enableServer(sails) {

  var LiveConfig = sails.config.personnalConfig.DsApiUrl;

  //load dependencies
  var http = require('http');
  var request = require('request-json');
  var client = request.createClient(LiveConfig.protocol + LiveConfig.host + ":" + LiveConfig.port);
  var Sails = require('sails');
  var fs = require('fs-extra');


  //Initalize vars for Models
  var usersDB = null;
  var CarDB = null;
  var TrackDB = null;
  var lapsDB = null;
  var driversDB = null;
  var ServerSessionDB = null;
  var ResultDB = null;
  var IncidentDB = null;
  var GroupDB = null;
  var EventDB = null;
  var lastlog = 0;
  var api = {
    status: "api/session/status?attributes&members&participants",
    cars: {
      list: "api/list/liveries",
      group: "api/list/vehicle_classes"
    },
    tracks: "api/list/tracks",
    kick: "api/session/kick",
    log: {
      last: "api/log/range?offset=" + lastlog + "&count=100000",
      full: "api/log/range?offset&count=1000000"
    }
  };
  //Define global variables
  var loopStatus = null; // If null no Relation to Project Cars  Http DS Api
  var Session = null;
  var session_ready = false;
  var players = [];
  var Status = {};

  var saved = 0;
  var fileResult, Logs, log, player;

  return {

    initialize: function(cb) {
      sails.on('hook:orm:loaded', function() {
        // initialize models
        // this is breaking `sails console`
        usersDB = sails.models.user;
        lapsDB = sails.models.lap;
        driversDB = sails.models.driver;
        ServerSessionDB = sails.models.serversession;
        CarDB = sails.models.car;
        TrackDB = sails.models.track;
        GroupDB = sails.models.group;
        EventDB = sails.models.event;
        ResultDB = sails.models.result;
        IncidentDB = sails.models.incident;

        return cb();
      });
    },

    /**
     *
     * This is way too procedural, and as such very hard to comprehend.
     * Try not to add to this method, and instead refactor it.
     *
     **/

    start: function() {
      var thisHook = this;
      client.get(api.status, function(err, res, data) {
        if (err) {
          if (err.code == "ECONNREFUSED") {
            sails.sockets.blast({
              msg: 'Pcars DS is not running',
              class: 'alert-danger'
            });
          }
        } else {
          thisHook.updateTracksAndGroup();
          thisHook.startListener();
        }
      });
    },

    startListener: function() {
      if (loopStatus !== null) {
        return sails.sockets.blast({
          msg: 'Listener already running !',
          class: 'alert-info'
        });
      }

      sails.sockets.blast({
        msg: 'Listener Launched',
        class: 'alert-success'
      });
      sails.log("Server start!");

      loopStatus = setInterval(function() {
        poll_server();
      }, 2000);
    },


    getLive: function(req, from) {
      var sockId = req;
      var Connected = [];
      if (Status.length > 0) {
        Connected = Status.response.members;
      }

      async.sortBy(players, function(x, callback) {
        callback(null, x.GridPosition);
      }, function(err, result) {
        if (from === 'home') {
          sails.sockets.emit(sockId, 'homeData', {
            Session: Session,
            Players: result,
            Connected: Connected,
            Status: Status
          });
        } else {
          sails.sockets.emit(sockId, 'firstData', {
            Session: Session,
            Players: result,
            Connected: Connected
          });
        }
      });
    },

    stop: function(req, res) {
      if (!loopStatus) {
        sails.sockets.blast({
          msg: 'Listener already stopped !',
          class: 'alert-danger'
        });
        return sails.sockets.blast('ServerStatus', {
          msg: 'Stopped',
          class: 'text-danger'
        });
      }

      clearInterval(loopStatus);
      console.log('Server stopped !');
      sails.sockets.blast({
        msg: 'Listener stopped !',
        class: 'alert-danger'
      });
      sails.sockets.blast('ServerStatus', {
        msg: 'Stopped',
        class: 'text-danger'
      });
      loopStatus = null;
    },

    kick: function(req, res, refId, Bantime) {
      var options = {
        hostname: host,
        port: port,
        path: api.kick.link + '?' + refId + '&' + Bantime
      };

      req = http.get(options, function(res) {
        return true;
      });

      req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
    },

    updateTracksAndGroup: function(callback) {
      var thisHook = this;
      async.series({
          Groups: function(callback) {
            client.get(api.cars.group, function(err, res, data) {
              callback(null, data);
            });
          },
          Tracks: function(callback) {
            client.get(api.tracks, function(err, res, data) {
              callback(null, data);
            });
          }
        },
        function(err, results) {
          if (typeof results.Groups == 'undefined' && typeof results.Tracks == 'undefined') {
            sails.sockets.blast({
              msg: 'Is the PCARS dedicated server running?',
              class: 'alert-danger'
            });
            console.log('Is the PCARS dedicated server running?');
            return callback;
          } else {
            async.each(results.Groups.response.list, function(group, callback) {
              GroupDB.findOrCreate({
                gameId: group.value
              }, {
                gameId: group.value,
                name: group.name
              }).exec(function(err, result) {
                callback();
              });
            }, function(err) {
              if (err) {
                console.log("Error an Group update");
              } else {
                thisHook.updateCars();
              }

            });
            async.each(results.Tracks.response.list, function(track, callback) {
              TrackDB.findOrCreate({
                gameId: track.id
              }, {
                gameId: track.id,
                name: track.name
              }).exec(function(err, result) {
                callback();
              });
            });
            console.log('Track and Group updated');
          }
        }
      );
    },

    updateCars: function() {
      client.get(api.cars.list, function(err, res, data) {
        if (err) {
          sails.sockets.blast({
            msg: 'Impossible to update cars',
            class: 'alert-danger'
          });
          console.log('Impossible to update cars');
          return 'Error';
        } else {
          async.each(data.response.list, function(car, callback) {
            GroupDB.findOne({
              name: car.class
            }).exec(function(err, group) {
              if (group) {
                CarDB.findOrCreate({
                  gameId: car.id,
                  name: car.name,
                  group: group.id
                }, {
                  gameId: car.id,
                  name: car.name,
                  group: group.id
                }).exec(function(err, result) {
                  callback();
                });
              } else {
                console.log('Cannot find class: ' + car.class + ' for car: ' + car.name);
                callback();
              }
            });
          });
          console.log('Cars updated');
        }
      });
    }

  };


  function poll_server() {
    sails.sockets.blast('ServerStatus', {
      msg: 'Running',
      class: 'text-success'
    });

    async.series({
      Status: function(callback) {
        client.get(api.status, function(err, res, data_status) {
          if (err && err.code == "ECONNREFUSED") {
            Session = null;
            sails.sockets.broadcast('Live', 'SessionUpdater', {
              Session: {
                SessionState: 'Offline'
              },
              Players: [],
              Connected: []
            });
            return callback('Connection refused for Status');
          }
          callback(null, data_status);
        });
      },
      Logs: function(callback) {
        client.get("api/log/range?offset=" + lastlog + "&count=100000", function(err, res, data_log) {
          if (err && err.code == "ECONNREFUSED") return callback('Connection refused for Logs');
          callback(null, data_log);
        });
      }
    }, function(err, results) {
      if (err) return console.log(err);
      handle_server_response(results);
    });
  }


  function handle_server_response(results) {
    Status = results.Status;
    Logs = results.Logs;

    if (!Status || !Logs) return sails.log("No server response");

    if (Status.result != "ok" || Logs.result != "ok") return sails.log("Server response not parsable");

    if (Status.response.state != "Running") {
      Session = null;
      players = [];

      Status.response.attributes.SessionState = "Waiting to be launched in game";
      sails.sockets.broadcast('Live', 'SessionUpdater', {
        Session: Status.response.attributes,
        Players: [],
        Connected: []
      });
      return sails.log(Status.response.attributes.SessionState);
    }

    if (Session && session_ready) {
      handle_existing_session();
    } else if (serverStartedNoSession(Status)) {
      handle_no_session();
    } else {
      handle_new_session();
    }
  }


  function handle_existing_session() {
    async.series({
      Track: function(callback) {
        TrackDB.findOne({
          gameId: Status.response.attributes.TrackId
        }).exec(function(err, track) {
          callback(null, track);
        });
      },
      Group: function(callback) {
        GroupDB.findOne({
          gameId: Status.response.attributes.VehicleClassId
        }).exec(function(err, group) {
          callback(null, group);
        });
      }
    }, function(err, results) {
      Status.response.attributes.Track = results.Track;
      Status.response.attributes.CarGroup = results.Group;
      Status.response.attributes.name = Status.response.name;
      sails.sockets.broadcast('Live', 'SessionUpdater', {
        Session: Status.response.attributes,
        Players: Status.response.participants,
        Connected: Status.response.members
      });
    });

    handle_logs();
  }


  function handle_no_session() {
    players = [];
    Session = null;
    async.series({
      Track: function(callback) {
        TrackDB.findOne({
          gameId: Status.response.attributes.TrackId
        }).exec(function(err, track) {
          callback(null, track);
        });
      },
      Group: function(callback) {
        GroupDB.findOne({
          gameId: Status.response.attributes.VehicleClassId
        }).exec(function(err, group) {
          callback(null, group);
        });
      }
    }, function(err, results) {
      Status.response.attributes.Track = results.Track;
      Status.response.attributes.CarGroup = results.Group;
      Status.response.attributes.name = Status.response.name;
      sails.sockets.broadcast('Live', 'SessionUpdater', {
        Session: Status.response.attributes,
        Players: Status.response.participants,
        Connected: Status.response.members
      });
    });
  }

  function handle_new_session() {
    saved = 0;
    session_ready = false;
    Session = Status.response.attributes;
    Session.name = Status.response.name;
    async.series({
      Track: function(callback) {
        TrackDB.findOne({
          gameId: Status.response.attributes.TrackId
        }).exec(function(err, track) {
          callback(null, track);
        });
      },
      Group: function(callback) {
        GroupDB.findOne({
          gameId: Status.response.attributes.VehicleClassId
        }).exec(function(err, group) {
          callback(null, group);
        });
      }
    }, function(err, results) {

      Session.Track = results.Track;
      Session.group = results.Group;
      Session.name = Status.response.name;

      EventDB.findOne({

        servername: Status.response.name,
        DamageType: Status.response.attributes.DamageType,
        TireWearType: Status.response.attributes.TireWearType,
        FuelUsageType: Status.response.attributes.FuelUsageType,
        AllowedViews: Status.response.attributes.AllowedViews,
        track: results.Track.id,
        group: results.Group.id,
        dateIngame: Status.response.attributes.DateYear + '-' + ("0" + (Status.response.attributes.DateMonth)).slice(-2) + '-' + ("0" + (Status.response.attributes.DateDay)).slice(-2) + ' ' + Status.response.attributes.DateHour + ':' + Status.response.attributes.DateMinute + ':00',
        DateProgression: Status.response.attributes.DateProgression,
        ForecastProgression: Status.response.attributes.ForecastProgression,
        WeatherSlot1: Status.response.attributes.WeatherSlot1,
        WeatherSlot2: Status.response.attributes.WeatherSlot2,
        WeatherSlot3: Status.response.attributes.WeatherSlot3,
        WeatherSlot4: Status.response.attributes.WeatherSlot4

      }).exec(function(err, Event) {

        var date = new Date();
        if (typeof Event != "undefined" && new Date(Event.end) >= date) Session.Events = Event;

        ServerSessionDB.create(Session).exec(function(err, sessionStored) {
          Session.id = sessionStored.id;
          sails.log('New Session - Session id: ' + sessionStored.id);

          var minutes = date.getMinutes();

          if (minutes.length == 1) minutes = minutes > 9 ? minutes : '0' + minutes;

          fileResult = sails.config.personnalConfig.logResultsPath + sessionStored.id + ".json";

          fs.outputJsonSync(fileResult, {
            Session: Session,
            Drivers: players,
            Results: {
              "Practice1": [],
              "Practice2": [],
              "Qualifying": [],
              "Warmup": [],
              "Race1": [],
              "Race2": []
            },
            Logs: []
          });

          session_ready = true;

          sails.log("New Session File saved.");
          saved = 1;
          sails.sockets.broadcast('Live', 'SessionUpdater', {
            Session: Session,
            Players: Status.response.participants,
            Connected: Status.response.members
          });
        });
      });
    });
  }


  function handle_logs() {
    // do not process log entry in parallell, order matters
    // but still process syncronously not to block app
    async.series([function(callback) {
      Logs.response.events.forEach(function(log) {
        handle_log_entry(log, function() {});
      });
      callback();
    }], undefined);

    lastlog = Logs.response.count;
  }


  function handle_log_entry(log, callback) {
    var CurrentLog = log;
    var SessionStage = Status.response.attributes.SessionStage;

    filedata = fs.readJsonSync(fileResult, {
      throws: false
    });
    filedata.Logs.push(log);
    fs.outputJsonSync(fileResult, filedata);

    if (log.name == "ParticipantDestroyed" || log.name == "PlayerLeft") {
      player = getPlayerByRefId(log.refid, players);
      sails.sockets.broadcast('Live', 'NewLog', {
        Player: player,
        Log: log
      });
      callback();
    }

    if (log.name === "Impact") {
      player = getPlayerByParticipantId(log.participantid, players);
      var driver1 = player ? player.driver : 0;

      pushPlayerIncident(CurrentLog, players, SessionStage);

      if (log.attributes.OtherParticipantId < 0) {
        sails.sockets.broadcast('Live', 'NewLog', {
          Player: player,
          Log: log
        });
        callback();
      }

      var player2 = getPlayerByParticipantId(log.attributes.OtherParticipantId, players);
      var driver2 = player2 ? player2.driver : 0;
      IncidentDB
        .create({
          sessions: Session.id,
          collider: driver1,
          collided: driver2,
          CollisionMagnitude: log.attributes.CollisionMagnitude
        })
        .exec(function(err, incident) {
          sails.sockets.broadcast('Live', 'NewLog', {
            Player: getPlayerByParticipantId(log.participantid, players),
            Log: log,
            Player2: player2
          });
          callback();
        });
    }

    if (log.name == "StateChanged") {
      if (log.attributes.PreviousState === "Returning" && log.attributes.NewState === "Lobby") {
        Session = null;
        players = [];
      }
      sails.sockets.broadcast('Live', 'NewLog', {
        Log: log
      });
      callback();
    }

    if (log.name == "ParticipantCreated" && (typeof getByRefId(log.refid, Status.response.members) != 'undefined')) {
      var sessionTemplate = {
        "Practice1": [],
        "Practice2": [],
        "Qualifying": [],
        "Warmup": [],
        "Race1": [],
        "Race2": []
      };
      var d = {
        member: getByRefId(log.refid, Status.response.members),
        participant: getByParticipantId(log.participantid, Status.response.participants),
        driver: {},
        car: {},
        Laps: sessionTemplate,
        Incidents: sessionTemplate,
        Cut: sessionTemplate
      };

      CarDB.findOne({
        gameId: d.member.attributes.VehicleId
      }).populate('group').exec(function(err, car) {
        d.car = car;
      });

      driversDB.findOrCreate({
        steam_id: d.member.steamid
      }, {
        steam_id: d.member.steamid,
        name: d.member.name
      }).exec(function(err, driver) {
        d.driver = driver;
        if (d.participant.attributes.IsPlayer != 1) return;

        driver.sessionsplayed.add(Session);
        driver.save(function(err, result) {
          if (err) {
            console.log("Err upd driver");
            console.log(err);
          }
        });
      });

      players.push(d);
      filedata = fs.readJsonSync(fileResult, {
        throws: false
      });
      filedata.Drivers.push(d);
      fs.outputJsonSync(fileResult, filedata);
      sails.sockets.broadcast('Live', 'NewLog', {
        Player: d,
        Log: log
      });

      callback();
    }

    if (log.name == "State") {
      if (getByParticipantId(CurrentLog.participantid, Status.response.participants)) {
        pushPlayerNewAttributes(getByParticipantId(CurrentLog.participantid, Status.response.participants), players);
        player = getPlayerByParticipantId(CurrentLog.participantid, players);
        sails.sockets.broadcast('Live', 'NewLog', {
          Player: player,
          Log: log
        });
      }
      callback();
    }

    if (log.name == "Sector") {
      if (getByParticipantId(CurrentLog.participantid, Status.response.participants)) {
        pushPlayerNewAttributes(getByParticipantId(CurrentLog.participantid, Status.response.participants), players);
        player = getPlayerByParticipantId(CurrentLog.participantid, players);
        sails.sockets.broadcast('Live', 'NewLog', {
          Player: player,
          Log: log
        });
      }
      callback();
    }

    if (log.name == "Lap") {
      player = getPlayerByParticipantId(CurrentLog.participantid, players);
      if (typeof player != "undefined") { // } || player.length > 0 ) {
        if (player.participant.attributes.IsPlayer === 1) {
          SaveLap(player, CurrentLog, Session, SessionStage);
        }

        if (getByParticipantId(CurrentLog.participantid, Status.response.participants)) {
          pushPlayerNewAttributes(getByParticipantId(CurrentLog.participantid, Status.response.participants), players);
          pushPlayerLap(CurrentLog, players, SessionStage);

          filedata = fs.readJsonSync(fileResult, {
            throws: false
          });
          filedata.Drivers = players;
          fs.outputJsonSync(fileResult, filedata);

          sails.sockets.broadcast('Live', 'NewLap', {
            Player: getPlayerByParticipantId(log.participantid, players),
            Lap: log
          });
          sails.sockets.broadcast('Live', 'NewLog', {
            Player: player,
            Log: log
          });
          CurrentLog = null;
        }

      }
      callback();
    }

    if (log.name == "CutTrackStart" || log.name == "CutTrackEnd") {
      player = getPlayerByParticipantId(log.participantid, players);
      pushPlayerCut(CurrentLog, players, SessionStage);

      filedata = fs.readJsonSync(fileResult, {
        throws: false
      });
      filedata.Drivers = players;
      fs.outputJsonSync(fileResult, filedata);
      sails.sockets.broadcast('Live', 'NewLog', {
        Player: player,
        Log: log
      });
      callback();
    }

    if (log.name == "Results") {
      player = getPlayerByParticipantId(log.participantid, players);
      var data = {
        sessions: Session.id,
        SessionStage: SessionStage,
        driver: player,
        car: player.car,
        RacePosition: log.attributes.RacePosition,
        Lap: log.attributes.lap,
        State: log.attributes.State,
        TotalTime: log.attributes.TotalTime,
        FastestLapTime: log.attributes.FastestLapTime
      };

      ResultDB
        .create(data)
        .exec(function(err, result) {
          console.log(SessionStage + ':' + log.attributes.RacePosition + ': ' + player.driver.name + ' - ' + log.attributes.State);
        });

      if (SessionStage == "Qualifying" && log.attributes.RacePosition === 1) {
        driversDB.update(player.driver.id, {
          pole_count: parseInt(player.driver.pole_count) + 1
        }).exec(function(err, upd) {
          console.log(err || ("Pole count for driver: " + player.driver.name + " updated"));
        });
      }

      if (SessionStage == "Race1" && log.attributes.RacePosition === 1) {
        driversDB.update(player.driver.id, {
          first_count: parseInt(player.driver.first_count) + 1
        }).exec(function(err, upd) {
          console.log("First pos. count for driver: " + player.driver.name + " updated");
        });
      }

      if (SessionStage == "Race1" && log.attributes.RacePosition === 2) {
        driversDB.update(player.driver.id, {
          second_count: parseInt(player.driver.second_count) + 1
        }).exec(function(err, upd) {
          console.log("First pos. count for driver: " + player.driver.name + " updated");
        });
      }

      if (SessionStage == "Race1" && log.attributes.RacePosition === 3) {
        driversDB.update(player.driver.id, {
          third_count: parseInt(player.driver.third_count) + 1
        }).exec(function(err, upd) {
          console.log("First pos. count for driver: " + player.driver.name + " updated");
        });
      }

      if (SessionStage == "Race1" && log.attributes.RacePosition <= 10) {
        driversDB.update(player.driver.id, {
          top_10: parseInt(player.driver.top_10) + 1
        }).exec(function(err, upd) {
          console.log("top_10. count for driver: " + player.driver.name + " updated");
        });
      }

      filedata = fs.readJsonSync(fileResult, {
        throws: false
      });
      filedata.Results[SessionStage].push(data);
      fs.outputJsonSync(fileResult, filedata);
    }
  }


  function getPlayerByRefId(id, myArray) {
    return myArray.filter(function(obj) {
      if (obj.member.refid == id) {
        return obj;
      }
    })[0];
  }


  function getByRefId(id, myArray) {
    return myArray.filter(function(obj) {
      if (obj.refid == id) {
        return obj;
      }
    })[0];
  }


  function getByParticipantId(id, myArray) {
    return myArray.filter(function(obj) {
      if (obj.id == id) {
        return obj;
      }
    })[0];
  }


  function pushPlayerLap(lap, myArray, SessionStage) {
    return myArray.filter(function(obj) {
      if (obj.participant.id == lap.participantid) {
        if (obj.Laps[SessionStage]) {
          obj.Laps[SessionStage].push(lap);
        } else {
          obj.Laps.SessionStage = [];
          obj.Laps[SessionStage].push(lap);
        }
        return obj;
      }
    })[0];
  }


  function serverStartedNoSession(status) {
    return status.response.attributes.SessionState === "Lobby" ||
      status.response.attributes.SessionState === "Loading" ||
      status.response.attributes.SessionState === "None" ||
      status.response.attributes.SessionPhase === "PreCountDownSync";
  }


  function pushPlayerCut(cut, myArray, SessionStage) {
    return myArray.filter(function(obj) {
      if (obj.participant.id == cut.participantid) {
        if (obj.Cut[SessionStage]) {
          obj.Cut[SessionStage].push(cut);
        } else {
          obj.Cut.SessionStage = [];
          obj.Cut[SessionStage].push(cut);
        }
        return obj;
      }
    })[0];
  }


  function pushPlayerIncident(incident, myArray, SessionStage) {
    return myArray.filter(function(obj) {
      if (obj.participant.id == incident.participantid) {
        if (obj.Incidents[SessionStage]) {
          obj.Incidents[SessionStage].push(incident);
        } else {
          obj.Incidents.SessionStage = [];
          obj.Incidents[SessionStage].push(incident);
        }
        return obj;
      }
    })[0];
  }


  function pushPlayerNewAttributes(attr, myArray) {
    return myArray.filter(function(obj) {
      if (obj.participant.id == attr.id) {
        obj.participant = attr;
        return obj;
      }
    })[0];
  }


  function getPlayerByParticipantId(id, myArray) {
    return myArray.filter(function(obj) {
      if (obj.participant.id == id) {
        return obj;
      }
    })[0];
  }


  function SaveLap(player, currentlog, Session, SessionStage) {
    lapsDB.create({
      Car: player.car,
      Track: Session.Track,
      LiveryId: player.member.attributes.LiveryId,
      RacePosition: currentlog.attributes.RacePosition,
      CurrentLap: currentlog.attributes.Lap,
      Sector1Time: currentlog.attributes.Sector1Time,
      Sector2Time: currentlog.attributes.Sector2Time,
      Sector3Time: currentlog.attributes.Sector3Time,
      DistanceTravelled: currentlog.attributes.DistanceTravelled,
      CountThisLapTimes: currentlog.attributes.CountThisLapTimes,
      LapTime: currentlog.attributes.LapTime,
      SessionStage: SessionStage,
      session: Session,
      owner: player.driver,
      group: player.car.group,
      //Events: Session.Events
    }).exec(function(err, lapstored) {
      if (err) {
        console.log('Lap error:' + err);
      } else {
        /*if (Session.Events.length > 0) {
        lapstored.Events.add(Session.Events);
        lapstored.save(function(err, res){
        if (err) {
        console.log("Err add Event to lap");
        console.log(err);
      } else {
      console.log("Event added to lap");
    }
  });

  }*/

        console.log('Lap ' + lapstored.CurrentLap + ' by: ' + player.driver.name);
      }

    });
  }
};
