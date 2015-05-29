$(function() {
	var router = new Grapnel();

	app.currentPage = null;

	// Methods
	app.setTitle = function( title ) {
		document.title = 'PEKA-TV / ' + title;
	};

	app.setPage = function( name, data ) {
		this.currentPage = name;

		for (var key in this.page) {
			if (key !== name) 
				this.page[ key ].hide();
		}

		this.page[ name ].show( data );
		this.widget.menu.setPage( name );

		window.userProfile.trigger( 'render' );
	};

	app.initPages = function() {
		$( window ).on( 'pageHidden', function() {
			var page = app.page[ app.currentPage ];

			if (page.hasOwnProperty( 'onBlur' ))
				page.onBlur();
		});

		$( window ).on( 'pageVisible', function() {
			var page = app.page[ app.currentPage ];

			if (page.hasOwnProperty( 'onFocus' ))
				page.onFocus();
		});
	};
	
	app.initRouter = function() {
		var page, url;

		for (var name in this.page) {
			page = this.page[ name ];

			if (typeof page.url === 'string')
				arrURL = [ page.url ];
			else
				arrURL = page.url;

			for (var i=0; i < arrURL.length; i++) {
				(function(name) {

					router.get( arrURL[i], function( data ) {
						app.setPage( name, data );
					});

				})(name);
			}
		}
	};

	app.initWidgets = function() {
		if (! this.hasOwnProperty( 'widget' )) return;

		for (var key in this.widget) {
			if (this.widget[ key ].hasOwnProperty( 'init' ))
				this.widget[ key ].init();
		}
	};

	app.init = function() {
		this.initWidgets();
		this.initRouter();
		this.initPages();
	};

	app.init();
});