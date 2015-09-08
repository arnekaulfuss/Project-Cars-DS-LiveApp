/**
 * ServerController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


 module.exports = {

  adminConnect: function(req, res) {
    var roomName = "Admin";
    sails.sockets.join(req.socket, roomName);
  },

  dashboard: function (req, res) {
    res.locals.layout = 'Admin/layout';
    async.series({
      drivers: function (callback) {
        Driver.find().exec(function(error, found) {
          callback(null, found);
        });
      },
      laps : function (callback) {
        Lap.find().exec(function(error, found){
          callback(null, found);
        });
      },
      sessions: function (callback) {
        ServerSession.find().exec(function(error, found){
          callback(null, found);
        });
      }
    }, function (err, results) {

      return res.view('Admin/dashboard',{
        drivers: results.drivers,
        laps: results.laps,
        sessions: results.sessions
      });
    });
  }
};
