(function($){
    $('.delete--lap').on('click', function(e){
        e.preventDefault();
        var td = $(this).parent();
        var tr = td.parent();
        io.socket.get($(this).attr('href'), null, function(data, jwres){
            if (jwres.statusCode === 200) {
                Notification(data);
                tr.velocity('transition.slideUpOut');
            }
        })
    });
}(jQuery));