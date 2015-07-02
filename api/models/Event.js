/**
 * Lap.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        name: {
            type: 'string',
            unique: true
        },
        servername: {
            type: 'string',
            unique: true
        },
        thumb: 'string',
        PracticeLength:{
            type: 'integer'
        },
        QualifyLength:{
            type: 'integer'
        },
        RaceLength:{
            type: 'integer'
        },
        Flags: {
            type: 'integer'
        },
        dateIngame: 'datetime',
        DamageType: {
            type: 'integer',
            defaultsTo: 0
        },
        TireWearType: {
            type: 'integer',
            defaultsTo: 0
        },
        FuelUsageType: {
            type: 'integer',
            defaultsTo: 0
        },
        PenaltiesType: {
            type: 'integer',
            defaultsTo: 0
        },
        AllowedViews: {
            type: 'integer'
        },
        DateProgression: {
            type: 'integer'
        },
        ForecastProgression: {
            type: 'integer'
        },
        WeatherSlot1: {
            type: 'integer'
        },
        WeatherSlot2: {
            type: 'integer'
        },
        WeatherSlot3: {
            type: 'integer'
        },
        WeatherSlot4: {
            type: 'integer'
        },
        start: {
            type: 'date'
        },
        end: {
            type: 'date'
        },
        track: {
            model: 'Track'
        },
        group: {
            model:'Group'
        },
        car: {
            model: 'Car'   
        },
        sessions: {
            collection: 'serversession',
            via: 'Events'
        },
        laps: {
            collection: 'lap',
            via: 'Events'
        },
        content: {
            type: 'text'
        }

    }
};