/**
 * Created by KRiS on 27/05/2015.
 */
var App = {
    weatherTab : [
        {
            icon: '<i class="wi wi-day-sunny"></i>',
            gameId: -934211870
        },
        {
            icon: '<i class="wi wi-day-cloudy"></i>',
            gameId: 296956818
        },
        {
            icon: '<i class="wi wi-cloudy"></i>',
            gameId: 888299130
        },
        {
            icon: '<i class="wi wi-cloudy"></i>',
            gameId: -1293634875
        },
        {
            icon: '<i class="wi wi-sprinkle"></i>',
            gameId: 270338437
        },
        {
            icon: '<i class="wi wi-rain"></i>',
            gameId: 1461703858
        },
        {
            icon: '<i class="wi wi-rain-wind"></i>',
            gameId: -1592958063
        },
        {
            icon: '<i class="wi wi-thunderstorm"></i>',
            gameId: -2112363295
        },
        {
            icon: '<i class="wi wi-cloudy-windy"></i>',
            gameId: 2067843977
        },
        {
            icon: '<i class="wi wi-fog"></i>',
            gameId: -754279862
        },
        {
            icon: '<i class="wi wi-fog"></i> <i class="wi wi-rain-mix"></i>',
            gameId: -1604560069
        },
        {
            icon: '<i class="wi wi-day-cloudy-windy">',
            gameId: -1299791789
        },
        {
            icon: '<i class="fa fa-question"></i>',
            gameId: 1275961519
        },
    ],
    tiresWear :[
        {
            gameId: 0,
            human: "x7"
        },
        {
            gameId: 1,
            human: "x6"
        },
        {
            gameId: 2,
            human: "x5"
        },
        {
            gameId: 3,
            human: "x4"
        },
        {
            gameId: 4,
            human: "x3"
        },
        {
            gameId: 5,
            human: "x2"
        },
        {
            gameId: 6,
            human: "Standard"
        },
        {
            gameId: 7,
            human: "Slow"
        },
        {
            gameId: 8,
            human: "Off"
        }        
    ],
    damage: [
        {
            gameId: 0,
            human: "OFF"
        },
        {
            gameId: 1,
            human: "Visual Only"
        },
        {
            gameId: 2,
            human: "Performance impacting"
        },
        {
            gameId: 3,
            human: "Full"
        }
    ],
    penalties: [
        {
            gameId: 0,
            human: "None"
        },
        {
            gameId: 1,
            human: "Full"
        },
    ],
    privacy: [
        {
            gameId: 0,
            human: "Public"
        },
        {
            gameId: 1,
            human: "Friends Only"
        },
        {
            gameId: 2,
            human: "Private"
        }
    ]
};




function setWeatherHumanReadable(data){
    for (var i in App.weatherTab) {
        if (parseInt(data) === App.weatherTab[i].gameId) {
            return App.weatherTab[i].icon;
        }
    }
}

function setTyreWearHumanReadable(data){
    for (var i in App.tiresWear) {
        if (parseInt(data) === App.tiresWear[i].gameId) {
            return App.tiresWear[i].human;
        }
    }
}

function setDamageHumanReadable(data) {
    for (var i in App.damage) {
        if (parseInt(data) === App.damage[i].gameId) {
            return App.damage[i].human;
        }
    }
}

function setPenaltiesHumanReadable(data) {
    for (var i in App.penalties) {
        if (parseInt(data) === App.penalties[i].gameId) {
            return App.penalties[i].human;
        }
    }
}


function setPrivacyHumanReadable(data) {
    for (var i in App.privacy) {
        if (parseInt(data) === App.privacy[i].gameId) {
            return App.privacy[i].human;
        }
    }
}

function setSessionHumanReadable(e) {
    e.Session.Privacy           = setPrivacyHumanReadable(e.Session.Privacy);
    e.Session.WeatherSlot1      = setWeatherHumanReadable(e.Session.WeatherSlot1);
    e.Session.WeatherSlot2      = setWeatherHumanReadable(e.Session.WeatherSlot2);
    e.Session.WeatherSlot3      = setWeatherHumanReadable(e.Session.WeatherSlot3);
    e.Session.WeatherSlot4      = setWeatherHumanReadable(e.Session.WeatherSlot4);
    e.Session.DamageType        = setDamageHumanReadable(e.Session.PenaltiesType);
    e.Session.PenaltiesType     = setPenaltiesHumanReadable(e.Session.PenaltiesType);
}


function setLogHumanReadable(e, datas){
    var data = {
        icon: null,
        message: null
    };

    if (e.Log.name === "PlayerDestroyed" || e.Log.name === "PlayerLeft") {
        data.icon = '<i class="fa fa-trash-o"></i>';
        data.message = moment.unix(e.Log.time).format('H:mm:ss')+' - ' + e.Player.driver.name+": Leave the session";
        datas.Log.push(data);
    }

    if (e.Log.name === "ParticipantCreated") {
        data.icon = '<i class="fa fa-plug"></i>';
        data.message = moment.unix(e.Log.time).format('H:mm:ss')+' - ' + e.Player.driver.name+": Join the session";
        datas.Log.push(data);
    }

    if (e.Log.name === "Impact") {
        data.icon = '<i class="fa fa-exclamation-triangle"></i>';
        if (e.Log.attributes.OtherParticipantId === -1) {
            data.message = moment.unix(e.Log.time).format('H:mm:ss')+' - ' + e.Player.driver.name+" hit a wall!"
        } else {
            data.message = moment.unix(e.Log.time).format('H:mm:ss')+' - ' + e.Player.driver.name+" caused a collision with"+ e.Player2.driver.name;
        }
        datas.Log.push(data);
    }

    if (e.Log.name === "State") {
        if (e.Log.attributes.NewState === "ExitingPits") {
            data.icon = '<i class="fa fa-share"></i>';
        } else if (e.Log.attributes.NewState === "InGarage") {
            data.icon = '<i class="fa fa-home"></i>';
        } else if (e.Log.attributes.NewState === "Racing") {
            data.icon = '<i class="fa fa-road"></i>';
        } else if (e.Log.attributes.NewState === "InPits") {
            data.icon = '<i class="fa fa-cogs"></i>';
        }
        data.message = moment.unix(e.Log.time).format('H:mm:ss')+' - ' + e.Player.driver.name+": "+e.Log.attributes.NewState;
        datas.Log.push(data);
    }

    if (e.Log.name === "Sector" || e.Log.name === "Lap") {
        if (e.Log.attributes.CountThisLapTimes === 0) {
            data.icon = '<i class="fa fa-history text-danger"></i>';
        } else {
            data.icon = '<i class="fa fa-history text-success"></i>';
        }
        if (e.Log.name === "Lap") {
            data.message = moment.unix(e.Log.time).format('H:mm:ss')+' - ' + e.Player.driver.name+": Lap N° "+ e.Log.attributes.Lap+" => "+e.Log.attributes.LapTime;
        } else if (e.Log.name === "Sector") {
            data.message = moment.unix(e.Log.time).format('H:mm:ss')+' - ' + e.Player.driver.name+" Lap N° "+ e.Log.attributes.Lap+"  Sector "+ e.Log.attributes.Sector+" => "+e.Log.attributes.SectorTime;
        }
        datas.Log.push(data);
    }

    if (e.Log.name === "StageChanged") {
        data.icon = '<i class="fa fa-cogs"></i>';
        data.message = moment.unix(e.Log.time).format('H:mm:ss')+' - ' + "Stage Changed: "+ e.Log.attributes.NewStage;
        datas.Log.push(data);
    }

    if (e.Log.name === "StateChanged") {
        data.icon = '<i class="fa fa-cogs"></i>';
        data.message = moment.unix(e.Log.time).format('H:mm:ss')+' - ' + "State Changed: "+ e.Log.attributes.NewState;
        datas.Log.push(data);
    }

    if (e.Log.name === "CutTrackStart") {
        data.icon = '<i class="fa fa-warning text-danger"></i>';
        data.message = moment.unix(e.Log.time).format('H:mm:ss')+' - ' + e.Player.driver.name+": Leave the track";
        datas.Log.push(data);
    }

    if (e.Log.name === "CutTrackEnd") {
        data.icon = '<i class="fa fa-warning text-info"></i>';
        data.message = moment.unix(e.Log.time).format('H:mm:ss')+' - ' + e.Player.driver.name+": back to the track and lost/gain "+ e.Log.attributes.PlaceGain +"position(s)";
        datas.Log.push(data);
    }

}

function pushPlayerLaps(newValue, myArray, lap) {
    return myArray.Players.filter(function(obj) {
        if (obj.participantid == newValue.participant.id) {
            var currentSession = datas.Session.SessionStage;

            if ( myArray.Laps[newValue.participant.id]) {
                myArray.Laps[newValue.participant.id][currentSession].push(lap);
            } else {
                myArray.Laps[newValue.participant.id] = [];
                myArray.Laps[newValue.participant.id][currentSession].push(lap);
            }
            return obj;
        }
    })[0]
}

function setParticipantHumanReadable(Data){
    for (index = 0; index < Data.Players.length; ++index) {

        if (Data.Players[index].attributes.CurrentLap === 0) {
            Data.Players[index].attributes.CurrentLap = "Outlap";
        }

        Data.Players[index].attributes.Sector1Time = msToMinsAndSec( Data.Players[index].attributes.Sector1Time);
        Data.Players[index].attributes.Sector2Time = msToMinsAndSec( Data.Players[index].attributes.Sector2Time);
        Data.Players[index].attributes.Sector3Time = msToMinsAndSec( Data.Players[index].attributes.Sector3Time);
        Data.Players[index].attributes.LastLapTime = msToMinsAndSec( Data.Players[index].attributes.LastLapTime);
        Data.Players[index].attributes.FastestLapTime = msToMinsAndSec( Data.Players[index].attributes.FastestLapTime);
    }
}

function sortPlayers(Data) {
    Data.Players.sort(function (a, b) {
        return a.attributes.RacePosition > b.attributes.RacePosition;
    });
}

function setMemberHumanReadable(Data){
    for (index = 0; index < Data.length; ++index) {
        if (Data[index].attributes.LoadState === "UNKNOWN") {
            Data[index].attributes.LoadState = "Lobby";
        }
        if (Data[index].attributes.LoadState === "CLIENT_LOADING_RACE" || Data[index].attributes.LoadState === "ADMIN_LOADING_RACE") {
            Data[index].attributes.LoadState = "Loading";
        }

        if (Data[index].attributes.LoadState === "CLIENT_READY" || Data[index].attributes.LoadState === "ADMIN_STARTED_RACE") {
            Data[index].attributes.LoadState = "On Track";
        }
    }
}
function sortMembers(Data){
    Data.Connected.sort(function (a, b) {
        return a.attributes.LoadState > b.attributes.LoadState;
    });
}

function renderSortedPlayer(Data, ParticipantsTPL, $) {
    sortPlayers(Data);
    setParticipantHumanReadable(Data);
    var rendered = Mustache.render(ParticipantsTPL, Data);
    $('#live_table').html(rendered);
}

function setDateHumanReadable(date){
    date = new Date(date);
    FullYear = date.getFullYear();
    Month = ("0" + (date.getMonth() + 1)).slice(-2);
    Day = ("0" + (date.getDate() + 1)).slice(-2);
    Hours = date.getHours();
    Minutes= ("0" + (date.getMinutes() + 1)).slice(-2) ;

    return FullYear+"/"+Month+"/"+Day+" "+Hours+":"+Minutes;
}