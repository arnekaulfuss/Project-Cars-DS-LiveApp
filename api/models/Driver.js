/**
 * Driver.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        steam_id: {
            type: 'string',
            required: true,
            size: 50
        },
        name: 'string',
        pole_count: {
            defaultsTo:0,
            type: 'integer'
        },
        first_count: {
            defaultsTo:0,
            type: 'integer'
        },
        second_count: {
           defaultsTo:0,
            type: 'integer'
        },
        third_count: {
            defaultsTo:0,
            type: 'integer'
        },
        top_10:{
            defaultsTo:0,
            type: 'integer'
        },
        best_pos: {
            defaultsTo:0,
            type: 'integer'
        },
        bestlaps_count: {
            defaultsTo:0,
            type: 'integer'
        },
        laps: {
            collection: 'lap',
            via: 'owner'
        },
        sessionsplayed: {
            collection: 'ServerSession',
            via: 'Drivers'
        },
        incidents : {
            collection: 'Incident',
            via: 'collider'
        },
        collided: {
            collection: 'Incident',
            via: 'collided'
        },
        Results: {
            collection: 'result',
            via: 'driver'
        },
        avatar: 'string'
    }
};