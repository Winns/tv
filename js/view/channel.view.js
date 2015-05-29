var ViewChannel = function( cfg ) {
	var self = this;

	this.cfg = $.extend({}, cfg);
	this.$c = {};

	this.template = function( o ) {
		var html = '';

		html += '<div class="wrapper">';
		html +=		'<div class="header">';
		html +=			'<img class="avatar" src="'+ o.channel.logo +'">';
		html +=			'<div class="info">';
		html +=				'<div class="title" data-bind="status" title="'+ o.channel.status +'">'+ o.channel.status +'</div>';
		html +=				'<div class="channel">';
		html +=					'<a href="http://twitch.tv/'+ o.channel.name +'" target="_blank">'+ o.channel.display_name +'</a> <span>playing</span> ';
		html += 				'<a href="/tv/#streams/'+ o.game +'" data-bind="game">'+ o.game +'</a>';
		html +=				'</div>';
		html +=			'</div>';

		html +=			'<i class="btn-togglechat js-switcher active fa fa-caret-right"';
		html +=				'data-switcher-target="#page-channel" data-switcher-class="hidechat"></i>';
		html +=	'</div>';

		html +=	'<div class="player">';
		html +=		'<iframe src="http://www.twitch.tv/'+ o.channel.name +'/embed" frameborder="0" scrolling="no"></iframe>';
		html += '</div>';

		html +=	'<div class="footer">';
		html +=		'<ul class="menu">';

		html +=			'<li>';
		html +=				'<i class="btn-follow fa fa-heart-o" title="Follow"></i>';
		html +=			'</li>';
		html +=			'<li>';
		html +=				'<i class="btn-multi wicon wicon-th-o" title="Multi Twitch"></i>';
		html +=			'</li>';
		
		html +=		'</ul>';

		html +=		'<div class="info">';
		html +=			'<table>';
		html +=				'<tr><td>Viewers:</td><td data-bind="viewers">'+ o.viewers +'</td></tr>';
		html +=				'<tr><td>Folowers:</td><td data-bind="followers">'+ o.channel.followers +'</td></tr>';
		html +=			'</table>';
		html +=			'<table>';
		html +=				'<tr><td>FPS:</td><td data-bind="fps">'+ parseInt(o.average_fps) +'</td></tr>';
		html +=				'<tr><td>Language:</td>';
		html +=				'<td data-bind="language">'+ o.channel.language.toUpperCase() +'</td></tr>';
		html +=			'</table>';

		html +=		'</div>';
		html +=	'</div>';

		html +=	'<div class="chat">';
		html +=		'<iframe src="http://www.twitch.tv/'+ o.channel.name +'/chat?popout=" frameborder="0" scrolling="no"></iframe>';
		html +=	'</div>';

		return html;
	};

	this.cacheElements = function() {
		var $c = this.cfg.$page.find( '[data-bind]' ),
			data;

		this.$c = {};

		$c.each(function() {
			data = $( this ).attr( 'data-bind' );

			self.$c[ data ] = $( this );
		});
	};

	this.update = function( data ) {
		this.$c[ 'status' ].html( data.stream.channel.status );
		this.$c[ 'game' ].html( data.stream.game );
		this.$c[ 'game' ].attr( 'href', '/#streams/'+ data.stream.game );
		this.$c[ 'viewers' ].html( data.stream.viewers );
		this.$c[ 'followers' ].html( data.stream.channel.followers );
		this.$c[ 'fps' ].html( parseInt(data.stream.average_fps) );
		this.$c[ 'language' ].html( data.stream.channel.language.toUpperCase() );
	};

	this.render = function( data ) {
		this.cfg.$page.html( this.getHTML(data) );
		this.cacheElements();
	};

	this.getHTML = function( data ) {
		return this.template( data.stream );
	};
};