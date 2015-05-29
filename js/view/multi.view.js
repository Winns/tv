var ViewMulti = function( cfg ) {
	var self = this;

	this.cfg = $.extend({}, cfg);

	this.template = {};

	this.template.video = function( o, i, play ) {
		var html = '';

		play = play || false;

		html +=	'<li class="i'+ i +'" data-id="'+ o +'">';
		//html +=		'<iframe src="http://www.twitch.tv/'+ o.channel.name +'/embed" frameborder="0" scrolling="no"></iframe>';

		//html +=		'<span style="color: #fff">Видео '+ o +'</span>';
		
		html += 	'<object bgcolor="#222" data="//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf" type="application/x-shockwave-flash">';
		html += 		'<param name="allowFullScreen" value="true">';
		html +=			'<param name="allowNetworking" value="all">';
		html +=			'<param name="allowScriptAccess" value="always">';
		html +=			'<param name="movie" value="//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf">';
		html +=			'<param name="flashvars" value="channel='+ o +'&auto_play='+ play +'&start_volume=50">';
		html +=			'<param name="wmode" value="opaque">';
		html += 	'</object>';
		

		html +=		'<div class="sort" data-id="'+ o +'">';
		html +=			'<div class="sort-handler">';
		html +=				'<span class="name">'+ o +'<div class="sort-preview"></div></span>';
		html +=				'<i class="btn-remove fa fa-trash"></i>';
		html +=			'</div>';
		html +=		'</div>';

		html +=	'</li>';

		return html;
	};

	this.template.chat = function( o, active ) {
		var html = '';

		active = active ? 'active' : '';

		html +=	'<li class="'+ active +'" data-id="'+ o +'">';
		//html +=		'<span style="color: #fff">Чат '+ o +'</span>';
		html +=		'<iframe src="http://www.twitch.tv/'+ o +'/chat?popout=" frameborder="0" scrolling="no"></iframe>';
		html +=	'</li>';

		return html;
	};

	this.template.chatSelect = function( o, active ) {
		var html = '';

		active = active ? 'selected' : '';

		html +=	'<option '+ active +' value="'+ o +'">'+ o +'</option>';

		return html;
	};

	this.template.chatSelectOff = function() {
		return '<option value="off">Hide Chat</option>';
	};

	this.append = function( data ) {
		var htmlVideo 		= '',
			htmlChat 		= '',
			htmlChatSelect 	= '',
			$el;

		for (var i=0; i < data.length; i++) {
			htmlVideo 		+= this.template.video( data[i], (i+1) );
			htmlChat 		+= this.template.chat( data[i] );
			htmlChatSelect 	+= this.template.chatSelect( data[i] );
		}

		this.cfg.$video.append( htmlVideo );
		this.cfg.$chat.append( htmlChat );
		this.cfg.$chatSelect.find( '[value="off"]' )
			.before( htmlChatSelect );


		// Remove elements over limit (8)
		$el = this.cfg.$video.find( 'li' );
		if ($el.length > 8) {
			$el.slice( 0, ($el.length - 8) ).remove();

			$el = this.cfg.$chat.find( 'li' );
			$el.slice( 0, ($el.length - 8) ).remove();

			$el = this.cfg.$chatSelect.find( 'option' );
			$el.slice( 0, ($el.length - 9) ).remove();
		}

		this.cfg.$video
			.removeClass( 'g1 g2 g3 g4 g5 g6 g7 g8' )
			.addClass( 'g' + this.cfg.$video.find( 'li' ).length );

		this.cfg.$video.find( 'li' )
			.removeClass( 'i1 i2 i3 i4 i5 i6 i7 i8' )
			.each(function( i ) {
				$(this).addClass( 'i' + (i+1) );
			});
	};

	this.render = function( data ) {
		var htmlVideo 		= '',
			htmlChat 		= '',
			htmlChatSelect	= '';

		for (var i=0; i < data.length; i++) {
			if (i == 0) {
				htmlVideo 		+= this.template.video( data[i], (i+1), true );
				htmlChat 		+= this.template.chat( data[i], true );
				htmlChatSelect 	+= this.template.chatSelect( data[i], true );
			} else {
				htmlVideo 		+= this.template.video( data[i], (i+1) );
				htmlChat 		+= this.template.chat( data[i] );
				htmlChatSelect 	+= this.template.chatSelect( data[i] );
			}
		}

		htmlChatSelect += this.template.chatSelectOff();

		this.cfg.$video.html( htmlVideo );
		this.cfg.$chat.html( htmlChat );
		this.cfg.$chatSelect.html( htmlChatSelect );

		this.cfg.$video.removeClass( 'g1 g2 g3 g4 g5 g6 g7 g8' );
		this.cfg.$video.addClass( 'g' + data.length );
	};
};