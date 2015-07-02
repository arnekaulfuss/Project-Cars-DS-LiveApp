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
        brand: 'string',
        HP: 'string',
        year: 'string',
        top_speed: 'integer',
        used: {
            collection: 'lap',
            via: 'Car'
        },
        group: {
            model:'Group'
        },
        thumb: 'string'
    }
};