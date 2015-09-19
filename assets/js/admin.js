$(function() {

  $('.alert').hide();

  io.socket.on('ServerStatus', function(e) {
    if ($('#ServerStatus').hasClass('text-success')) {
      $('#ServerStatus').html(e.msg).removeClass('text-success').addClass(e.class);
    } else {
      $('#ServerStatus').html(e.msg).removeClass('text-danger').addClass(e.class);
    }

  });

  $('#server_start').click(function(e) {
    e.preventDefault();
    io.socket.get("/start", null, function(data, jwres) {

    });
  });
  $('#server_stop').click(function(e) {
    e.preventDefault();
    io.socket.get("/stop", null, function(data, jwres) {

    });
  });

  $('.admin_Driver--LapTime').each(function(elem) {
    var $time = parseInt($(this).html());
    var $newTime = msToMinsAndSec($time);
    $(this).html($newTime);
  });

  $('#reset--pass').click(function(e) {
    e.preventDefault();

    data = {
      passwordNew: $('input[name="passwordNew"]').val(),
      passwordNew2: $('input[name="passwordNew2"]').val()
    };
    io.socket.post("/reset", data, function(data, jwres) {
      $('input[name="passwordNew"]').val("");
      $('input[name="passwordNew2"]').val("");
    });


  })
});
