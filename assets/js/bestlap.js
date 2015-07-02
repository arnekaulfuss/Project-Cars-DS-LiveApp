(function($){

    var $template = $('#bst_row').html();
    Mustache.parse($template);
    $('#bst_row').remove();

    var $trackInfo = $('#track_infos').html();
    Mustache.parse($trackInfo);
    $('#track_infos').remove();

    $('#getBst').click(function(e){
        e.preventDefault();

        var $track;
        var $car;
        var $driver;
        var btn = $(this);

        $track = parseInt($('#Tracks-form').val());
        $group = parseInt($('#Group-form').val());
        $car = parseInt($('#Cars-form').val());
        $driver = parseInt($('#Drivers-form').val());
        $SessionStage = parseInt($('#SessionStage-form').val());

        $Event = parseInt($('#Event-form').val());


        $('#bestlaps_results_table').fadeOut();
        btn.val('Loading ...');

        io.socket.get("/bst", {Track: $track, Car: $car, Driver: $driver, SessionStage: $SessionStage, Event: $Event, Group: $group}, function (data, jwres){
            console.log(data);
            $('#bst_target').html('');
            $('#track_target').html('');
            if (data.track ) {
                data.track.laps = data.track.laps.length;
                data.track.sessions = data.track.sessions.length;
                var rendered = Mustache.render($trackInfo, data.track);
                $('#track_target').html(rendered);
            }

            for (i = 0; i < data.lap.length; i++) {
                data.lap[i].LapTime = msToMinsAndSec(data.lap[i].LapTime);
                data.lap[i].Sector1Time = msToMinsAndSec(data.lap[i].Sector1Time);
                data.lap[i].Sector2Time = msToMinsAndSec(data.lap[i].Sector2Time);
                data.lap[i].Sector3Time = msToMinsAndSec(data.lap[i].Sector3Time);

                $('#bst_target').append("<tr class='bst-row'>"+Mustache.render($template, data.lap[i])+"</tr>");


            }
            if (data.lap.length === 0) {
                $('#bst_target').append("<tr class='bst-row'>"+Mustache.render($template,{LapTime: 'No Lap recorded'})+"</tr>");
            }
            $('.table-bst').fadeIn();
            btn.val('Get Bestlaps');
        });

    });

})(jQuery);

function msToMinsAndSec(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(3);
    if (minutes == 0) {
        return (seconds < 10 ? '0' : '') + seconds;
    }
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds ;
}