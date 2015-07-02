/**
 * Lap.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        Car: {
            model: 'Car'
        },
        Track: {
            model: 'Track'
        },
        LiveryId: 'integer',
        RacePosition: 'integer',
        CurrentLap: 'integer',
        Sector1Time: 'integer',
        Sector2Time: 'integer',
        Sector3Time: 'integer',
        DistanceTravelled: 'integer',
        CountThisLapTimes: 'boolean',
        LapTime: 'integer',
        SessionStage: 'string',
        owner: {
            model: 'driver'
        },
        session: {
            model: 'ServerSession'
        },
        group: {
            model: 'group'
        },
        Events: {
            model: 'event'
        }
    },

    findGroupedByDrivers : function (opts, cb) {

    }
};