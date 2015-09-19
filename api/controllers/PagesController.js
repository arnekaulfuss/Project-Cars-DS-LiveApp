/**
 * PagesController
 *
 * @description :: SPages controller
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

  home: function(req, res) {
    req.flash('info', 'this is an info message');
    async.series({
      drivers: function(callback) {
        Driver.find().populateAll().exec(function(error, drivers) {
          callback(null, drivers);
        });
      },
      events: function(callback) {
        Event.find().populateAll().sort('name ASC').exec(function(error, results) {
          callback(null, results);
        });
      }
    }, function(err, results) {
      async.sortBy(results.drivers, function(driver, callback) {
        if (!driver.laps) {
          driver.laps.length = 0;
        }
        callback(null, driver.laps.length * -1);
      }, function(err, newArray) {
        return res.view('Pages/homepage', {
          drivers: newArray,
          events: results.events
        });
      });
    });
  }
};
