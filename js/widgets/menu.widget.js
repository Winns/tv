if (! app.hasOwnProperty( 'widget' )) app.widget = {};

app.widget.menu = new (function() {
	var self = this;

	this.el 				= {};
	this.el.$menu 			= $( '#menu' );
	this.el.$btnPages 		= this.el.$menu.find( '.btn-page' );
	this.el.$btnRefresh 	= this.el.$menu.find( '.btn-refresh' );
	this.el.$btnMulti 		= this.el.$menu.find( '.btn-multi' );

	this.setPage = function( name ) {
		$el = this.el.$btnPages.filter( '[data-name="'+ name +'"]' );

		this.el.$btnPages.not( $el ).removeClass( 'active' );
		$el.addClass( 'active' );
	};

	this.init = function() {
		this.el.$btnRefresh.on( 'click', function() {
			var page = app.page[ app.currentPage ];

			if (page.hasOwnProperty( 'onMenuRefresh' ))
				page.onMenuRefresh();
		});

		window.userProfile.on( 'render', function( data ) {
			var profileData = window.userProfile.load();

			(function handleMultiButton() {
				var str = Object.keys( profileData.multi ).join('/');

				self.el.$btnMulti.attr( 'href', '/#multi/' + str );
			})();
		});
	};
});