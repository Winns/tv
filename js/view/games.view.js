var ViewGames = function() {
	this.template = function( o ) {
		var html = '';

		if (! o.game.hasOwnProperty( 'box' ) || o.game.box === null) {
			console.log( 'error:', o );
			return '';
		}

		html += '<li>';
		html += 	'<a href="/tv/#streams/'+ o.game.name +'">';

		if (window.psdevLazyLoad.isCached( o.game.box.medium ))
			html += '<div class="img js-lazyload-done" style="background-image: url('+ o.game.box.medium +');"></div>';
		else
			html += '<div class="img" data-image="'+ o.game.box.medium +'" style="background-image: url(/tv/img/loading.gif); background-size: auto;"></div>';

		html += 	'</a>';
		html += 	'<div class="game" title="'+ o.game.name +'">'+ o.game.name +'</div>';
		html += 	'<div class="statistic">';
		html += 		'<span class="viewers left"><i class="fa fa-user"></i> '+ o.viewers +' </span>';
		//html += 		'<span class="channels right"><i class="fa fa-play-circle"></i> '+ o.channels +'</span>';
		html += 	'</div">';
		html += '</li>';

		return html;
	};

	this.getHTML = function( data ) {
		var html = '';

		for (var i=0; i < data.length; i++) {
			html += this.template( data[i] );
		}

		return html;
	};
};