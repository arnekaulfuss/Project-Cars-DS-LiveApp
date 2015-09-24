module.exports = function pcarsds(sails) {

  var sails = require('sails');

  var initStarted = false;
  var initDone = false;

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

  return {

    start: function() {
      if (!initStarted) {
        //sails.on('hook:orm:loaded', function() {
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

          sails.hooks.pcarsserver.start(2000, errorCallback, connectionCallback);
          initDone = true;
        //});

        initStarted = true;
      }
    },


    stop: function() {
      sails.hooks.pcarsserver.stop();
    },


    getLive: function(req, from) {
      // NOT TESTED. Just copy/pasted here
      // Generate error "Status is not defined"

      // var sockId = req;
      // var Connected = [];
      // if (Status.length > 0) {
      //   Connected = Status.response.members;
      // }
      //
      // async.sortBy(players, function(x, callback) {
      //   callback(null, x.GridPosition);
      // }, function(err, result) {
      //   if (from === 'home') {
      //     sails.sockets.emit(sockId, 'homeData', {
      //       Session: Session,
      //       Players: result,
      //       Connected: Connected,
      //       Status: Status
      //     });
      //   } else {
      //     sails.sockets.emit(sockId, 'firstData', {
      //       Session: Session,
      //       Players: result,
      //       Connected: Connected
      //     });
      //   }
      // });
    },

    updateTracksAndGroup: function() {
      updateTracksAndGroup();
    },

    updateCars: function() {
      updateCars();
    }

  };

  function errorCallback(error) {
    console.log("ERROR in PCARS DS service")
    console.log(error);
    sails.sockets.blast({
      msg: 'ERROR in PCARS DS service', // TODO use traduction in locales
      class: 'alert-danger'
    });
  }

  function connectionCallback() {
    updateTracksAndGroup();
  }


  function onStatusChangedCallback() {

  }


  function onLogEventCallback() {

  }


  function updateTracksAndGroup() {
    async.series({
      Groups: function(callback) {
        sails.hooks.pcarsserver.getVehicleClasses(function(data) {
          callback(null, data);
        });
      },
      Tracks: function(callback) {
        sails.hooks.pcarsserver.getTracks(function(data) {
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
        return;
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
            updateCars();
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
    });
  }

  function updateCars() {
    sails.hooks.pcarsserver.getVehicles(function(data) {
      // if (err) {
      //   sails.sockets.blast({
      //     msg: 'Impossible to update cars',
      //     class: 'alert-danger'
      //   });
      //   console.log('Impossible to update cars');
      //   return 'Error';
      // } else {
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
      // }
    });
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


}();  // Use Imediately Invoked  Function Expression (IIFE) because I don't know better. JS newbie here
