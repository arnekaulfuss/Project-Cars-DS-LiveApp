var reference = $('#referencer');
var resultsIndex = $('#results_wrapper');

if (resultsIndex.length > 0) {
    resultsIndex.velocity('transition.bounceLeftIn');

    $('.getResult').click(function(e){
        e.preventDefault();
        $this = $(this);
        console.log($this.href);
        resultsIndex.velocity('transition.bounceLeftOut',{complete: function(){
            window.location = $this.attr('href');
        }});
    });
}

if (reference.length > 0) {
    $(".results_file_wrapper").hide();

    $('#backToResult').click(function(e){
        e.preventDefault();
        $this = $(this);
        console.log($this.href);
        $(".results_file_wrapper").velocity('transition.bounceRightOut',{complete: function(){
            window.location = $this.attr('href');
        }});
    });

    io.socket.get('/res', {id: reference.attr('data-id'), incidents:reference.attr('data-incidents')}, function(data, jwres){
        $(".results_file_wrapper").velocity('transition.bounceRightIn', {display:'block'});
        $(".loader").velocity('transition.fadeOut', {display:'none'});
        var $InfosTemplate = $('#results_file-infos_body').html();
        Mustache.parse($InfosTemplate);
        $('#results_file-infos_body').remove();

        var $Practice1Template = $('#results_file-practice1_body').html();
        Mustache.parse($Practice1Template);
        $('#results_file-practice1_body').remove();

        var $Practice2Template = $('#results_file-practice2_body').html();
        Mustache.parse($Practice2Template);
        $('#results_file-practice2_body').remove();


        var $QualifTemplate = $('#results_file-qualif_body').html();
        Mustache.parse($QualifTemplate);
        $('#results_file-qualif_body').remove();

        var $WarmupTemplate = $('#results_file-warmup_body').html();
        Mustache.parse($WarmupTemplate);
        $('#results_file-warmup_body').remove();

        var $Race1Template = $('#results_file-race1_body').html();
        Mustache.parse($Race1Template);
        $('#results_file-race1_body').remove();

        var $Race2Template = $('#results_file-race2_body').html();
        Mustache.parse($Race2Template);
        $('#results_file-race2_body').remove();
        $('.results_file--lapsByDriver_rows').hide();

        /*
         * Render Infos
         */
        var renderInfos = Mustache.render($InfosTemplate, data);
        $('#results_file-infos').html(renderInfos);

        /*
         * Render Practice
         */
        if ( data.file.Results.Practice1.length === 0 && data.file.Results.Practice2.length === 0 ) {
            $('#results_file-panel_practice').hide();
        } else {
            if ( data.file.Results.Practice1.length > 0) {
                var renderP1 = Mustache.render($Practice1Template, data.file.Results);
                $('#results_file-practice1').html(renderP1);
            }

            if ( data.file.Results.Practice2.length > 0) {
                var renderP2 = Mustache.render($Practice2Template, data.file.Results);
                $('#results_file-practice2').html(renderP2);
            }
        }

        /*
         * Render Qualifs
         */
        if ( data.file.Results.Qualifying.length > 0) {
            var renderQ = Mustache.render($QualifTemplate, data.file.Results);
            $('#results_file-qualif').html(renderQ);
        }

        /*
         * Render Warmup
         */
        if ( data.file.Results.Warmup.length > 0) {
            var renderW = Mustache.render($WarmupTemplate, data.file.Results);
            $('#results_file-warmup').html(renderW);
        }

        /*
         * Render Race
         */
        if ( data.file.Results.Race1.length > 0) {
            var renderR1 = Mustache.render($Race1Template, data.file.Results);
            $('#results_file-race1').html(renderR1);
        }
        if ( data.file.Results.Race2.length > 0) {
            var renderR2 = Mustache.render($Race2Template, data.file.Results);
            $('#results_file-race2').html(renderR2);
        }

        $('.results_file--lapsByDriver_btn').click(function(e){
            e.preventDefault();


            var $td = $(this).parent();
            var $tr = $td.parent();
            var $tbody = $tr.parent();

            var $fastest = parseInt($(this).attr( 'data-fastest' ));

            var $laps = $tbody.find($('tr.results_file--lapsByDriver_rows-laps'));

            $laps.each(function(elem){
                var $LapTime = $(this).find($('.LapTime'));
                var $lapModif = $LapTime.attr('data-lapTime');
                var $gapToBest =0;
                if ($LapTime.hasClass('Practice1') || $LapTime.hasClass('Practice2') || $LapTime.hasClass('Qualif') || $LapTime.hasClass('Warmup')) {
                    var $BestLap = 0;

                    if ($LapTime.hasClass('Practice1')) {
                        $BestLap = data.file.Results.Practice1[0].FastestLapTime;
                    } else if ($LapTime.hasClass('Practice2')) {
                        $BestLap = data.file.Results.Practice2[0].FastestLapTime;
                    } else if ($LapTime.hasClass('Qualif')) {
                        $BestLap = data.file.Results.Qualifying[0].FastestLapTime;
                    } else if ($LapTime.hasClass('Warmup')) {
                        $BestLap = data.file.Results.Warmup[0].FastestLapTime;
                    }
                    if ($lapModif > $fastest) {
                        $gap = $lapModif - $fastest;
                        $gapToBest = $lapModif - $BestLap;
                        $(this).find($('.results_file--gapToFastest')).html('+'+msToMinsAndSec($gap));
                        $(this).find($('.results_file--gapToBest')).html('<span class="text-danger">+'+msToMinsAndSec($gapToBest)+'</span>');
                    } else if ($lapModif == $fastest) {
                        $gapToBest = $lapModif - $BestLap;
                        $(this).css('font-weight', 'bold');
                        $(this).css('color', '#9A12B3');
                        $(this).css('font-size', '16px');
                        $(this).find($('.results_file--gapToBest')).html('+'+msToMinsAndSec($gapToBest));
                        $(this).find($('.results_file--gapToFastest')).html('<span class="text-info">BEST LAP</span>');
                    } else {
                        $gap = $fastest - $lapModif;
                        $gapToBest = $BestLap - $lapModif ;
                        $(this).css('background-color', 'rgba(104, 0, 0, 0.25)');
                        $(this).find($('.results_file--gapToFastest')).html('<span class="text-success">-'+msToMinsAndSec($gap)+'</span>');
                        $(this).find($('.results_file--gapToBest')).html('<span class="text-success">-'+msToMinsAndSec($gapToBest)+'</span>');
                    }
                } else {
                    var $BestTotal = 0;
                    if ($LapTime.hasClass('Race1')) {
                        $BestTotal = data.file.Results.Race1[0].FastestLapTime;
                    } else if ($LapTime.hasClass('Race2')) {
                        $BestTotal = data.file.Results.Race2[0].FastestLapTime;
                    }
                    if ($lapModif > $BestTotal) {
                        $gapToBest = $lapModif - $BestTotal;
                        $(this).find($('.results_file--gapToFastest')).html('<span class="text-danger">+'+msToMinsAndSec($gapToBest)+'</span>');
                    } else if ($lapModif == $BestTotal) {
                        $gapToBest = $BestTotal - $lapModif;
                        $(this).find($('.results_file--gapToFastest')).html('<span class="text-info">BEST LAP</span>');
                    } else {
                        $gapToBest = $BestTotal - $lapModif;
                        $(this).find($('.results_file--gapToFastest')).html('<span class="text-success">-'+msToMinsAndSec($gapToBest)+'</span>');
                    }
                    if ($lapModif > $fastest) {
                        $gap = $lapModif - $fastest;
                        $(this).find($('.results_file--gapToBest')).html('<span class="text-danger">+'+msToMinsAndSec($gap)+'</span>');
                    } else if ($lapModif == $fastest) {
                        $(this).css('font-weight', 'bold');
                        $(this).css('color', '#9A12B3');
                        $(this).css('font-size', '16px');
                        $(this).find($('.results_file--gapToBest')).html('<span class="text-info">BEST LAP</span>');
                    } else {
                        $gap = $fastest - $lapModif;
                        $(this).find($('.results_file--gapToBest')).html('<span class="text-success">-'+msToMinsAndSec($gap)+'</span>');
                    }
                }
            });

            if ($laps.hasClass('open')) {
                $tbody.find($('tr.results_file--lapsByDriver_rows-head')).velocity('transition.bounceUpOut');
                $laps.velocity('transition.perspectiveDownOut', {stagger:75, drag:true, backwards: true});
                $laps.removeClass('open');
            } else {
                $tbody.find($('tr.results_file--lapsByDriver_rows-head')).velocity('transition.bounceDownIn');
                $laps.addClass('open');
                $laps.velocity('transition.perspectiveDownIn', {stagger:75, drag:true});
            }

            if ($(this).find('i').hasClass('fa-plus')) {
                $(this).find('i').removeClass('fa-plus').addClass('fa-minus');
            } else {
                $(this).find('i').removeClass('fa-minus').addClass('fa-plus');
            }
        });

        $('.results_file--Race_gapToLead').each(function(elem){
            var $stage = $(this).attr('data-stage');
            var $totalTime = $(this).attr('data-totalTime');
            if ($stage == "Race1") {
                var $BestLap = data.file.Results.Race1[0].TotalTime;
                var $gapToBest = $totalTime - $BestLap;
                $(this).html('+'+msToMinsAndSec($gapToBest));
            }
        });

        $('.results_file--Race_gapToPrev').each(function(elem){
            var $stage = $(this).attr('data-stage');
            var $totalTime =  parseInt($(this).attr('data-totalTime'));
            var $pos = parseInt($(this).attr('data-pos'));
            var $prev = $pos-2;
            var $BestTotal = 0;
            if ($stage == "Race1") {
                if ($prev === -1) {
                    $BestTotal = data.file.Results.Race1[0].TotalTime;
                } else {
                    $BestTotal = data.file.Results.Race1[$prev].TotalTime;
                }
            }
            var $gapToBest = $totalTime - $BestTotal;
            $(this).html('+'+msToMinsAndSec($gapToBest));
        });

        $('.results--gapToLead').each(function(elem){
            var $stage = $(this).attr('data-stage');
            var $fastest = $(this).attr('data-fastest');
            if ($stage == "Qualif") {
                var $BestLap = data.file.Results.Qualifying[0].FastestLapTime;
                var $gapToBest = $fastest - $BestLap;
                $(this).html('+'+msToMinsAndSec($gapToBest));
            }
        });

        $('.results--gapToPrev').each(function(elem){
            var $stage = $(this).attr('data-stage');
            var $fastest =  parseInt($(this).attr('data-fastest'));
            var $pos = parseInt($(this).attr('data-pos'));
            var $prev = $pos-2;
            var $BestLap = 0;
            if ($stage == "Practice1") {
                if ($prev === -1) {
                    $BestLap = data.file.Results.Practice1[0].FastestLapTime;
                } else {
                    $BestLap = data.file.Results.Practice1[$prev].FastestLapTime;
                }
            } else if ($stage == "Practice2") {
                if ($prev === -1) {
                    $BestLap = data.file.Results.Practice2[0].FastestLapTime;
                } else {
                    $BestLap = data.file.Results.Practice2[$prev].FastestLapTime;
                }
            } else if ($stage == "Qualif") {
                if ($prev === -1) {
                    $BestLap = data.file.Results.Qualifying[0].FastestLapTime;
                } else {
                    $BestLap = data.file.Results.Qualifying[$prev].FastestLapTime;
                }
            } else if ($stage == "Warmup") {
                if ($prev === -1) {
                    $BestLap = data.file.Results.Warmup[0].FastestLapTime;
                } else {
                    $BestLap = data.file.Results.Warmup[$prev].FastestLapTime;
                }
            }
            var $gapToBest = $fastest - $BestLap;
            $(this).html('+'+msToMinsAndSec($gapToBest));
        });

        $('.results--time').each(function(elem){
            $old = $(this).html();
            $new = msToMinsAndSec(parseInt($old));
            $(this).html($new);
        });

        $('.results_file--lapNum').each(function(elem){
            $old = parseInt($(this).html());
            $new = $old+1;

            $(this).html($new);
        });

        $('.results_file--lapCounted').each(function(elem){
            if (parseInt($(this).html()) === 1) {
                $(this).html('<span class="text-success">Yes</span>');
            } else {
                $(this).html('<span class="text-danger">No</span>');
            }
        });



        $('#infos_tireWear').each(function(elem){
            $human = setTyreWearHumanReadable($(this).attr('data-tireWear'));
            $(this).html($human);
        });
        $('#results_file--privacy').each(function(elem){
            $human = setPrivacyHumanReadable(parseInt($(this).html()));
            $(this).html($human);
        });
        $('.results_file--collapser').click(function(e){
            e.preventDefault();
            var $link;
            var $head;
            var $panel;
            if ($(this).hasClass('open')) {
                $link = $(this).parent();
                $head = $link.parent();
                $panel = $head.parent();
                $panel.find($('.panel-body')).velocity('transition.bounceIn');
                $(this).removeClass('open');

            } else {
                $link = $(this).parent();
                $head = $link.parent();
                $panel = $head.parent();
                $panel.find($('.panel-body')).velocity('transition.bounceOut');
                $(this).addClass('open');

                //$laps.velocity('transition.slideRightBigIn', {stagger:25});
            }
            //$(this).next($('.panel-body')).velocity('')
        });

        $('#infos_damage').each(function(elem){
            $human = setDamageHumanReadable($(this).attr('data-damage'));
            $(this).html($human);
        });

        $('.infos_weather').each(function(elem){
            $icon = setWeatherHumanReadable($(this).attr('data-weather'));
            $(this).html($icon);
        });
        $('#infos_penalties').each(function(elem){
            $human = setPenaltiesHumanReadable($(this).attr('data-penalties'));
            console.log($human);
            $(this).html($human);
        });
    });
}
