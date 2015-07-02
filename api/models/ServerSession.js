/**
 * ServerSession.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        GridSize: 'integer',
        MaxPlayers: 'integer',
        Practice1Length: 'integer',
        Practice2Length: 'integer',
        QualifyLength: 'integer',
        WarmupLength: 'integer',
        Race1Length: 'integer',
        Race2Length: 'integer',
        Flags: 'integer',
        Privacy: 'integer',
        DamageType: 'integer',
        TireWearType: 'integer',
        FuelUsageType: 'integer',
        PenaltiesType: 'integer',
        AllowedViews: 'integer',
        TrackId: 'integer',
        VehicleGroupId: 'integer',
        VehicleModelId: 'integer',
        DateProgression: 'integer',
        ForecastProgression: 'integer',
        WeatherSlot1: 'integer',
        WeatherSlot2: 'integer',
        WeatherSlot3: 'integer',
        WeatherSlot4: 'integer',
        GameMode: 'integer',
        SessionState: 'string',
        SessionStage: 'string',
        SessionPhase: 'string',
        SessionTimeElapsed: 'integer',
        SessionTimeDuration: 'integer',
        NumParticipantsValid: 'integer',
        NumParticipantsDisqualified: 'integer',
        NumParticipantsRetired: 'integer',
        NumParticipantsDNF: 'integer',
        NumParticipantsFinished: 'integer',        
        Drivers: {
            collection: 'driver',
            via: 'sessionsplayed'
        },
        Laps: {
            collection: 'lap',
            via: 'session'
        },
        Track: {
          model: 'Track'
        },
        group: {
            model: 'group'
        },
        name: 'string',
        Events: {
            model: 'event'
        },
        incidents: {
            collection: 'incident',
            via: 'sessions'
        }
    }
};