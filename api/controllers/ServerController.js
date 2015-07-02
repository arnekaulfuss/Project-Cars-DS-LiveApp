/**
 * ServerController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

    start: function (req, res) {
        
        sails.hooks.pcarsserver.start();
    },

    stop: function (req, res) {
        sails.hooks.pcarsserver.stop();
    },

    live: function(req, res) {

    },
    updateTracksAndCar: function (req, res) {
        console.log('ok');
        sails.hooks.pcarsserver.updateTracksAndCar();
    },
    updateCars: function (req, res) {
        sails.hooks.pcarsserver.updateCars();
    },

    admin: function(req, res) {
        return res.view('Admin/server',{
            admin: true
        });
    }
};
