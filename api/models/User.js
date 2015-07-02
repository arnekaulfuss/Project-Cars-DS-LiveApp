/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

bcrypt = require('bcrypt-nodejs');

module.exports = {
    attributes: {
       username: {
            type: 'string',
            required: true,
            size: 50
        },
        email: {
            type: 'email',
            unique: true,
            required: true
        },
        password: {
            type: 'string',
            required: true
        }
    },


    /**
     * Create a new user using the provided inputs,
     * but encrypt the password first.
     *
     * @param  {Object}   inputs
     *                     • name     {String}
     *                     • email    {String}
     *                     • password {String}
     * @param  {Function} cb
     */

    signup: function (inputs, cb) {
        bcrypt.hash(inputs.password, null, null, function(err, hash) {
            User.create({
                username: inputs.username,
                email: inputs.email,
                password: hash
            })
                .exec(cb);
        });
    },

    passwordReset: function(inputs, cb) {
        bcrypt.hash(inputs.passwordNew, null, null, function(err, hash) {
            User.update({
                username: inputs.username
            }, {
                password: hash
            }).exec(cb);
        });
    },


    /**
     * Check validness of a login using the provided inputs.
     * But encrypt the password first.
     *
     * @param  {Object}   inputs
     *                     • email    {String}
     *                     • password {String}
     * @param  {Function} cb
     */

    attemptLogin: function (inputs, cb) {
            User.findOne({
                email: inputs.email
            })
                .exec(cb);
    }


};
