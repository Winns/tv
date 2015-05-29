if (! app.hasOwnProperty( 'widget' )) app.widget = {};

app.widget.loading = new (function() {
	var self = this;

	this.el 			= {};
	this.el.$widget 	= $( '#loading' );
	this.el.$bar 		= this.el.$widget.find( '.progress div' );
	this.el.$prc 		= this.el.$widget.find( '.prc' );
	this.el.$text 		= this.el.$widget.find( '.text' );

	this.show = function( text ) {
		text = text || '';

		this.reset();
		this.el.$widget.addClass( 'active' );
		this.el.$text.html( text );
	};

	this.hide = function() {
		this.el.$widget.removeClass( 'active' );
		this.reset();
	};

	this.reset = function() {
		this.el.$bar.css( 'width', 0 );
		this.el.$prc.html( '0%' );
	};

	this.progress = function( prc ) {
		this.el.$bar.css( 'width', prc + '%' );
		this.el.$prc.html( prc + '%' );
	};

	this.init = function() {
		
	};
});