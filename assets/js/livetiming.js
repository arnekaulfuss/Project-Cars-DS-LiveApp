(function($){
    var datas = {
        Session : null,
        Players : [],
        Laps: [],
        Log: []
    };
    var logLimit = 100;

    var SessionTPL = $('#server_infos_wrapper').html();
    $('#server_infos_wrapper').remove();
    var ParticipantsTPL = $('#table-live').html();
    $('#table-live').remove();

    var LogTPL = $('#live_log').html();
    $('#live_log').remove();

    var ConnectedTPL = $('#live_connected').html();
    $('#live_connected').remove();

    /*io.socket.on('SessionDestroy', function(e){
        datas.Players = [];
        datas.Log = [];
        datas.Laps = [];

        var renderedSession = Mustache.render(SessionTPL,e.Session);
        $('#server_infos').html(renderedSession);
        var rendered2 = Mustache.render(ParticipantsTPL, datas);
        $('#live_table').html(rendered2);
    });*/

    io.socket.on('NewLog', function(e){
        datas.Log.push(setLogHumanReadable(e, datas));
        var rendered = Mustache.render(LogTPL, datas);
        $('#live_log_wrapper').html(rendered);
        if (datas.Log.length > logLimit) {
            datas.Log.shift();
        }
        $('#live_log_wrapper').animate({scrollTop : $('#live_log_wrapper').prop('scrollHeight') }, 500);
    });

    io.socket.on('SessionUpdater', function(e){

        datas.Session = e.Session;
        datas.Players = e.Players;
        datas.Connected = e.Connected;

        setSessionHumanReadable(e);

        if (datas.Players.length > 0) {
            renderSortedPlayer(datas, ParticipantsTPL, $);
        } else {
            $('#table-live').remove();
        }

        if (datas.Connected.length > 0) {
            setMemberHumanReadable(datas.Connected);
            sortMembers(datas);
        }
        var renderedSession = Mustache.render(SessionTPL, e.Session);
        $('#server_infos').html(renderedSession);

        var renderedConnected = Mustache.render(ConnectedTPL, datas);
        $('#live_connected_wrapper').html(renderedConnected);

    });

    io.socket.on('firstData', function(e){
        datas.Session = e.Session;
        $('#infos').velocity("transition.expandIn");
        var renderedSession = Mustache.render(SessionTPL, datas.Session);
        $('#server_infos').html(renderedSession);

        var renderedConnected = Mustache.render(ConnectedTPL, datas);
        $('#live_connected_wrapper').html(renderedConnected);

        var renderedLog = Mustache.render(LogTPL, datas);
        $('#live_log_wrapper').html(renderedLog);

    });

    io.socket.on('NewLap', function(e){

        pushPlayerLaps(e.Player, datas, e.Lap);
        renderSortedPlayer(datas, ParticipantsTPL, $);

        var driver = $('#participant-'+ e.Player.participant.id);
        driver.LapTime = driver.find('.live_table_players--Last-lap');
        driver.LapTime.html('');
        var $class;
        var $icon;
        if (e.Lap.attributes.CountThisLapTimes === 0) {
            $class = "text-danger";
            $icon = ' <i class="fa fa-exclamation-triangle"></i>';
        } else {
            $class = "text-success";
            $icon ='';
        }
        console.log(datas.Laps);
        driver.LapTime.html(e.Lap.attributes.LapTime).append($icon).addClass($class);
        driver.find('.live_table_players--Last-lap').html(e.Lap.attributes.LapTime);
        driver.find('.live_table_players--Sector-1').html(e.Lap.attributes.Sector1Time);
        driver.find('.live_table_players--Sector-2').html(e.Lap.attributes.Sector2Time);
        driver.find('.live_table_players--Sector-0').html(e.Lap.attributes.Sector3Time);

    });

})(jQuery);

