var ViewStreams = function( cfg ) {
	var self = this;

	this.cfg = $.extend({}, cfg);

	this.template = function( o ) {

		var title 	= o.channel.display_name +' - '+ o.channel.status,
			html 	= '';

		html += '<li>';
		html += 	'<a class="images" href="/tv/#channel/'+ o.channel.name +'">';

		if (window.psdevLazyLoad.isCached( o.preview.medium ))
			html += '<div class="preview js-lazyload-done" style="background-image: url('+ o.preview.medium +')"></div>';
		else
			html += '<div class="preview" data-image="'+ o.preview.medium +'" style="background-image: url(/tv/img/loading.gif); background-size: auto;"></div>';

		html += 		'<div title="'+ title +'" class="logo" style="background-image: url('+ o.channel.logo +')"></div>';
		html += 	'</a>';
		html += 	'<div class="title" title="'+ title +'">';
		html += 		'<strong>'+ o.channel.display_name +'</strong> - '+ o.channel.status +'</div>';
		html += 	'</div>';
		html += 	'<div class="statistic">';
		html += 		'<span class="viewers left"><i class="fa fa-user"></i> '+ o.viewers +' </span>';
		html += 		'<span class="fps right"><i>FPS</i> '+ (o.average_fps >> 0) +'</span>';
		html += 	'</div">';
		html += '</li>';

		return html;
	};

	this.render = function( data ) {
		this.cfg.$list.html( this.getHTML(data) );
	};

	this.getHTML = function( data ) {
		var html = '';

		for (var i=0; i < data.length; i++) {
			html += this.template( data[i] );
		}

		return html;
	};
};