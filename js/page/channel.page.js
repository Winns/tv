(function() {
	if (! app.hasOwnProperty( 'page' )) app.page = {};

	app.page.channel = new Page({
		url: 'channel/:channel',

		view: null,

		el: {},
		provider: null,
		flags: {
			loaded: false
		},

		channel: null,

		// Methods
		cacheElements: function() {
			this.el.$page 			= $( '#page-channel' );
			this.el.$btnFollowing 	= this.el.$page.find( '.btn-follow' );
			this.el.$btnMulti 		= this.el.$page.find( '.btn-multi' );
		},

		onShow: function( e ) {
			app.widget.loading.show( e.params.channel );

			this.reset();

			this.provider.setUrl( 'https://api.twitch.tv/kraken/streams/'+ e.params.channel +'?a=b' );
			this.provider.enable();
			this.provider.update();
			this.provider.startAutoUpdate();

			this.el.$page.addClass( 'active' );
		},
		onHide: function() {
			this.el.$page.removeClass( 'active' );
			this.provider.disable();
			this.reset();

			app.widget.loading.hide();
		},
		onBlur: function() {
			this.provider.startAutoUpdate();
		},
		onFocus: function() {
			this.provider.stopAutoUpdate();
		},
		onMenuRefresh: function() {
			app.widget.loading.show( 'Refresh..' );
			this.provider.update();
		},

		reset: function() {
			this.flags.loaded = false;
			this.el.$page.html( '' );
		},

		onProviderUpdate: function( data ) {
			if (data.stream === null) {
				app.widget.loading.hide();
				app.widget.loading.reset();
				app.setTitle( 'channel not found' );
			} else {
				app.setTitle( data.stream.channel.display_name );

				this.render( data );
				this.cacheElements();
				this.flags.loaded = true;
				this.channel = data.stream.channel.name;

				window.userProfile.trigger( 'render' );
				app.widget.loading.hide();
			}
		},

		onProviderProgress: function( prc ) {
			if (this.flags.loaded) return;

			app.widget.loading.show();
			app.widget.loading.progress( prc );

			app.setTitle( prc + '%' );
		},

		render: function( data ) {
			if (this.flags.loaded) {
				this.view.update( data );
			} else {
				this.view.render( data );
			}
		},

		bindEvents: function() {
			var self = this;

			$(document).on( 'click', '#page-channel .btn-follow', function() {
				var data = window.userProfile.load();
				
				if ( data.following.hasOwnProperty( self.channel ) ) {
					delete data.following[ self.channel ];
				} else {
					data.following[ self.channel ] = true;
				}

				window.userProfile.save( data );
			});

			$(document).on( 'click', '#page-channel .btn-multi', function() {
				var data = window.userProfile.load();
				
				if ( data.multi.hasOwnProperty( self.channel ) ) {
					delete data.multi[ self.channel ];
				} else {
					data.multi[ self.channel ] = true;
				}

				window.userProfile.save( data );
			});

			window.userProfile.on( 'render', function( data ) {
				(function handleFollowButton() {
					if (app.currentPage !== 'channel') return;

					if (data.following.hasOwnProperty( self.channel ))
						self.el.$btnFollowing.addClass( 'active' );
					else
						self.el.$btnFollowing.removeClass( 'active' );
				})();

				(function handleMultiButton() {
					if (app.currentPage !== 'channel') return;

					if (data.multi.hasOwnProperty( self.channel ))
						self.el.$btnMulti.addClass( 'active' );
					else
						self.el.$btnMulti.removeClass( 'active' );
				})();
			});
		},

		init: function() {
			var self = this;

			this.view = new ViewChannel({
				$page: $( '#page-channel' )
			});

			this.cacheElements();

			this.provider = new Provider({
				url: '',
				onUpdate: this.onProviderUpdate.bind( this ),
				onProgress: this.onProviderProgress.bind( this )
			});

			this.bindEvents();
		}
	});

})();
