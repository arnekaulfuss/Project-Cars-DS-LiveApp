(function($){

	io.socket.on('homeData', function(e){
		for (var i in e.players) {
			$('#home_server--connected').append(e.Connected[i].name + ' | '+ e.Connected[i].LoadState);
		}
		$('#home_server--status').html(e.Status.response.attributes.SessionState);
	});

})(jQuery);