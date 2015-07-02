(function($){

    $('.events_weather').each(function(elem){
        $icon = setWeatherHumanReadable($(this).attr('data-weather'));
        $(this).html($icon);
    });

    $('#events_tireWear').each(function(elem){
        $human = setTyreWearHumanReadable($(this).attr('data-tireWear'));
        $(this).html($human);
    });

    $('#events_damage').each(function(elem){
        $human = setDamageHumanReadable($(this).attr('data-damage'));
        $(this).html($human);
    });

    $('#events_penalties').each(function(elem){
        $human = setPenaltiesHumanReadable($(this).attr('data-penalties'));
        $(this).html($human);
    });

}(jQuery));

