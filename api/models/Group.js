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
    cars: {
      collection: 'car',
      via: 'group'
    },
    laps: {
      collection: 'lap',
      via: 'group'
    },
    sessions: {
      collection: 'serversession',
      via: 'group'
    }
  }
};
