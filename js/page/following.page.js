(function() {
	if (! app.hasOwnProperty( 'page' )) app.page = {};

	app.page.following = new Page({
		url: 'following',

		el: {},
		provider: null,
		view: null,

		// Methods
		cacheElements: function() {
			this.el.$page 		= $( '#page-following' );
			this.el.$list 		= this.el.$page.find( '.list' );
			this.el.$total 		= this.el.$page.find( '.total' );
		},

		onShow: function( e ) {
			var str = this.getFollowingString();

			app.widget.loading.show( 'Following' );

			if (str === '') {
				this.onProviderUpdate( null );
			} else {
				this.provider.setUrl( 'https://api.twitch.tv/kraken/streams?channel=' + str );
				this.provider.enable();
				this.provider.update();
			}

			this.el.$page.addClass( 'active' );
		},
		onHide: function() {
			this.el.$page.removeClass( 'active' );
		},
		onBlur: function() {

		},
		onFocus: function() {
			
		},
		onMenuRefresh: function() {
			app.widget.loading.show( 'Refresh..' );
			this.provider.update();
		},

		onProviderUpdate: function( data ) {
			if (data !== null && data.streams === null) {
				app.widget.loading.reset();
				app.setTitle( 'channel not found' );
			} else {
				this.render( data );

				app.widget.loading.hide();

				app.setTitle( 'Following' );
			}
		},

		onProviderProgress: function( prc ) {
			app.widget.loading.progress( prc );

			app.setTitle( prc + '%' );
		},

		onProviderError: function( data ) {
			app.widget.loading.hide();
			app.setTitle( data.message );
		},

		getFollowingString: function() {
			var data = window.userProfile.load();

			return Object.keys( data.following ).join(',');
		},

		render: function( data ) {
			if (data === null) {
				data = {
					streams: [],
					_total: 0
				};
			}

			this.view.render( data.streams );
			this.el.$total.html( data._total );

			window.psdevLazyLoad.add(
				this.el.$list.find( '.preview' )
			);
		},

		init: function() {
			var self = this;

			this.view = new ViewStreams({
				$page: $( '#page-following' ),
				$list: $( '#page-following .list' )
			});

			this.cacheElements();

			this.provider = new Provider({
				url: '',
				onUpdate: this.onProviderUpdate.bind( this ),
				onProgress: this.onProviderProgress.bind( this ),
				onError: this.onProviderError.bind( this ),
			});
		}
	});

})();
