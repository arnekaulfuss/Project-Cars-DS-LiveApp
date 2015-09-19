/**
 * Result.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {
    sessions: {
      model: 'serversession'
    },
    SessionStage: 'string',
    driver: {
      model: 'driver'
    },
    car: {
      model: 'car'
    },
    RacePosition: 'integer',
    Lap: 'integer',
    State: 'string',
    TotalTime: 'integer',
    FastestLapTime: 'integer'
  }
};
