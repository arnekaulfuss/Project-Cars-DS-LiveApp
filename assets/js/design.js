(function($){

    
    io.socket.on('message', function(e){
        var $pos = 75;
        $id = Math.floor(Math.random()*10);
        $divAlert = '<div class="alert alert-global" id='+$id+'></div>';
        if ($('.alert-global').length > 0) {
            $pos = $('.alert-global').length *$pos;
        }
        $('.alert-container').append($divAlert);

        $('#'+$id).css('top',$pos).addClass(e.class).append(e.msg).velocity("transition.slideUpBigIn").delay(2000).velocity("transition.slideDownBigOut").delay(25).queue(function() { $(this).remove(); });

    });

    $('.global--time').each(function(e){
        NewDate = setDateHumanReadable($(this).html());
        $(this).html(NewDate);
    });
    $('.datepicker').pickadate({
        format:  'yyyy-mm-dd',
        formatSubmit: 'yyyy-mm-dd'
    });
    $('.timepicker').pickatime({
        format: 'HH:i',
        formatSubmit: 'HH:i'
    });

    $('textarea').trumbowyg();

    $('.infos_weather').each(function(elem){
        $icon = setWeatherHumanReadable($(this).attr('data-weather'));
        $(this).html($icon);
    });

    $('.owl-carousel').owlCarousel({
        items : 1,
        loop: true,
        autoplay:true,
        nav: true,
        autoplayTimeout:3000,
        autoplayHoverPause:true,
        animateOut: 'fadeOut',
        navText: [
            '<i class="fa fa-caret-left"></i>',
            '<i class="fa fa-caret-right"></i>',
        ]
    });
}(jQuery));