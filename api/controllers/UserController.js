/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * `UserController.login()`
     */
    login: function (req, res) {

        // See `api/responses/login.js`
        return res.login({
            email: req.param('email'),
            password: req.param('password'),
            successRedirect: '/',
            invalidRedirect: '/login'
        });

    },
    pass: function (req, res) {
        return res.view('User/passwordReset', {
            admin:true
        });
    },

    passwordReset: function (req, res) {
        if (!req.isSocket) return res.badRequest();

        var socketId = sails.sockets.id(req.socket);
        User.findOne(req.session.me).exec(function(err, user){
                if (err) return res.negotiate(err);

                if (req.param('passwordNew') === req.param('passwordNew2')){
                    if (req.method === "POST") {
                        User.passwordReset({
                            username: user.username,
                            passwordNew: req.param('passwordNew')
                        }, function (err, user) {
                            sails.sockets.emit(socketId, 'message', {msg: 'Password successfully updated', class: "alert-success"});
                            res.json(200, { msg: 'Password successfully updated' });
                        })
                    }
                } else {
                    sails.sockets.emit(socketId, 'message', {msg: 'New Password 1 and 2 don\'t match', class: "alert-danger"});
                    res.json(500, { msg: 'New Password 1 and 2 don\'t match' });

                }

        });
    },

    profile: function (req, res) {

        User.findOne(req.session.me).exec(function(err, user){
            if (err) return res.negotiate(err);

            if (req.method === "GET") {
                return res.view('User/profile', {
                    user: user,
                    flash: {
                        content:''
                    }
                });
            }

            if (req.method === "POST") {
                if (user.driver.length != 0) {
                    Driver.update({user:user.id}, {steam_id: req.param('steam_id')}).exec(function(err, driver) {
                        return res.view('User/profile', {
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
                        return res.view('User/profile', {
                            user: user,
                            flash: {
                                content:"Driver updated",
                                flashClass: "success"
                            }
                        });

                    });
                }

            }

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
        // "Forget" the user from the session.
        // Subsequent requests from this user agent will NOT have `req.session.me`.
        req.session.me = null;

        // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
        // send a simple response letting the user agent know they were logged out
        // successfully.
        if (req.wantsJSON) {
            return res.ok('Logged out successfully!');
        }

        // Otherwise if this is an HTML-wanting browser, do a redirect.
        return res.redirect('/');
    },


    /**
     * `UserController.signup()`
     */
    signup: function (req, res) {

        // Attempt to signup a user using the provided parameters
        User.signup({
            username: req.param('username'),
            email: req.param('email'),
            password: req.param('password')
        }, function (err, user) {
            // res.negotiate() will determine if this is a validation error
            // or some kind of unexpected server error, then call `res.badRequest()`
            // or `res.serverError()` accordingly.
            if (err) return res.negotiate(err);

            // Go ahead and log this user in as well.
            // We do this by "remembering" the user in the session.
            // Subsequent requests from this user agent will have `req.session.me` set.
            req.session.me = user.id;

            // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
            // send a 200 response letting the user agent know the signup was successful.
            if (req.wantsJSON) {
                return res.ok('Signup successful!');
            }

            // Otherwise if this is an HTML-wanting browser, redirect to /welcome.
            return res.redirect('/welcome');
        });
    }
};
