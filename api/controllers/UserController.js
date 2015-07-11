/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var _ = require('lodash');

 module.exports = {


  profile: function (req, res) {

    User
      .findOne(req.session.me)
      .populate('drivers')
      .populate('serverKeys')
      .exec(function(err, user){
        if (err) return res.negotiate(err);

        res.view('User/profile', {
          user: user,
          flash: {
            content:''
          }
        });
      });
  },

  update: function (req, res, next) {
    User.findOne(req.session.me).exec(function(err, user){
      if (err) return res.negotiate(err);

      if (user.driver.length != 0) {
        Driver.update({user:user.id}, {steam_id: req.param('steam_id')}).exec(function(err, driver) {
          res.view('User/profile', {
            user: user,
            flash: {
              content:"Driver updated",
              flashClass: "success"
            }
          });
        });
      } else {
        user.driver.add({ steam_id: req.param('steam_id')});
        user.save(function(err, user) {
          res.view('User/profile', {
            user: user,
            flash: {
              content:"Driver updated",
              flashClass: "success"
            }
          });
        });
      }
    });
  },

  addKey: function (req, res) {
    User
      .findOne(req.session.me)
      .populate('serverKeys')
      .exec(function (err, user) {
        if (user.serverKeys.length > 5) {
          req.flash('error', "Cannot add key. Delete an existing key to add a new one.")
          return res.redirect('/profile');
        }

        ServerKey.create({name: req.body.name, user: req.session.me}).exec(function (err, key) {
          if (err) return res.negotiate(err);
          req.flash('info', "Added key")
          res.redirect('/profile');
        });
      });
  },

  destroyKey: function (req, res) {
    var id = req.param('id');
    User
      .findOne(req.session.me)
      .populate('serverKeys')
      .exec(function (err, user) {
        var match = false;
        user.serverKeys.forEach(function (key) {
          if (key.id == id) match = true;
        });

        if (!match) {
          req.flash('error', "Cannot delete key")
          sails.log("Cannot delete key");
          return res.redirect('/profile');
        }

        ServerKey.destroy(id).exec(function (err) {
          if (err) return res.negotiate(err);

          req.flash('info', "Key Removed")
          res.redirect('/profile');
        });
      });
  },

  /**
   * `UserController.logout()`
   */
  logout: function (req, res) {
    var user = req.session;
    sails.sockets.blast({
      msg: user.username+' Disconnected',
      class: 'alert-danger'
    });

    req.session.me = req.session.user = null;

    // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
    // send a simple response letting the user agent know they were logged out
    // successfully.
    if (req.wantsJSON) return res.ok('Logged out successfully!');

    res.redirect('/');
  },

};
