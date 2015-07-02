/**
 * Lap.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        name: 'string',
        gameId: 'integer',
        thumb: 'string',
        distance: 'integer',
        location: 'string',
        laps : {
            collection: 'lap',
            via: 'Track'
        },
        sessions: {
            collection: 'serversession',
            via: 'Track'
        }
    }
};