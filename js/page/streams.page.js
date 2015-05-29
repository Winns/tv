(function() {
	if (! app.hasOwnProperty( 'page' )) app.page = {};

	var dataHandler = new (function() {
		var self = this;

		this.data = { full: {}, sel: {} };

		this.el = {
			$filter: $( '#filter-streams' )
		};

		// Filters
		this.filter = {};

		this.filter.list = {};

		this.filter.list.fps = {
			$el: self.el.$filter.find( '[data-filter="fps"]' ),
			reset: function() {
				this.$el.removeClass( 'active' );
			},
			getValues: function() { return this.$el.hasClass( 'active' ); },
			isPassedFilter: function( options, item ) {
				if (options.fps) 
					return item.average_fps > 30;
				else
					return true;
			},
			init: function() {
				this.$el.on( 'click', function() {
					$(this).toggleClass( 'active' );
					self.filter.trigger();
				});
			}
		};

		this.filter.list.language = {
			$el: self.el.$filter.find( '[data-filter="language"]' ),
			reset: function() {
				this.$el.val( 'all' );
			},
			getValues: function() { return this.$el.val(); },
			isPassedFilter: function( options, item ) {
				if (options.language === 'all') 
					return true;

				return (item.channel.language === options.language);
			},
			init: function() {
				this.$el.on( 'change', function() {
					self.filter.trigger();
				});
			}
		};

		this.filter.list.search = {
			$el: null,
			reset: function() {
				this.$el.val( '' );
			},
			getValues: function() { return this.$el.val(); },
			isPassedFilter: function( options, item ) {
				if (options.search === '') return true;

				var query = (	item.channel.name + 
								item.channel.display_name + 
								item.channel.status	
							).toLowerCase();

				return (query.indexOf( options.search.toLowerCase() ) > -1);
			},
			init: function() {
				var timer;

				this.$el = self.page.el.$page.find( '#streams-search' );

				this.$el.on( 'input', function() {
					clearTimeout( timer );

					timer = setTimeout(function() {
						self.filter.trigger();
					}, 300);
				});
			}
		};

		// Methods
		this.filter.trigger = function() {
			self.data.sel = self.filter.run( self.data.full );
			self.sort.byCurrentMethod();
			self.page.render();
		};

		this.filter.isPassedFilter = function( options, item ) {
			var module, moduleName, filter,
				r = true;

			for (var key in self.filter.list) {
				filter = self.filter.list[ key ];

				if (! filter.isPassedFilter( options, item )) {
					r = false;
					break;
				}
			}

			return r;
		}

		this.filter.run = function( data ) {
			var options = {},
				arr 	= [];

			// Get filter options
			for (var key in self.filter.list) {
				options[ key ] = self.filter.list[ key ].getValues();
			}

			// Filter data
			for (var i=0; i < data.length; i++) {
				if (self.filter.isPassedFilter( options, data[i] ))
					arr.push( data[i] );
			}

			return arr;
		};

		this.filter.init = function() {
			var f;
			for (var key in self.filter.list) {
				f = self.filter.list[ key ];

				if (f.hasOwnProperty( 'init' )) f.init();
			}
		};

		// Sort
		this.sort = {
			$buttons: $( '#sort-streams li' ),
			currentMethod: ['viewers', 'MaxMin']
		};

		this.sort.list = {
			viewers: {
				MinMax: function() {
					self.data.sel.sort(function( a, b ) { return a.viewers - b.viewers; });
				},
				MaxMin: function() {
					self.data.sel.sort(function( a, b ) { return b.viewers - a.viewers; });
				}
			},
			streamer: {
				MinMax: function() {
					self.data.sel.sort(function( a, b ) {
						if (a.channel.display_name < b.channel.display_name) return -1;
						if (a.channel.display_name > b.channel.display_name) return 1;
						return 0;
					});
				},
				MaxMin: function() {
					self.data.sel.sort(function( a, b ) {
						if (a.channel.display_name < b.channel.display_name) return 1;
						if (a.channel.display_name > b.channel.display_name) return -1;
						return 0;
					});
				}
			}
		};

		this.sort.run = function() {
			self.sort.byCurrentMethod();
		};

		this.sort.by = function( name, type ) {
			self.sort.updateUI( name, type );
			self.sort.currentMethod = [ name, type ];
			self.sort.list[ name ][ type ]();
		};

		this.sort.byCurrentMethod = function() {
			if (self.sort.currentMethod === null) return;

			self.sort.by( 
				self.sort.currentMethod[0], 
				self.sort.currentMethod[1]
			);
		};

		this.sort.updateUI = function( name, type ) {
			var $el = self.sort.$buttons.filter( '[data-name="'+ name +'"]' );

			self.sort.$buttons.removeClass( 'MinMax MaxMin' );

			$el.addClass( type );
			$el.attr( 'data-type', type );
		};

		this.sort.init = function() {
			self.sort.$buttons.on( 'click', function() {
				self.sort.$buttons.removeClass( 'up down' );


				if ($( this ).attr( 'data-type' ) === 'MinMax') {
					$( this ).attr( 'data-type', 'MaxMin' );
				} else {
					$( this ).attr( 'data-type', 'MinMax' );
				}

				self.sort.by( 
					$( this ).attr( 'data-name' ), 
					$( this ).attr( 'data-type' ) 
				);

				self.page.render();
			});
		};
		// End Sort

		this.getData = function() {
			return this.data;
		};

		this.run = function( data ) {
			this.data.full 	= data;
			this.data.sel 	= this.filter.run( data.slice(0) );
			this.sort.run();
		};

		this.init = function( page ) {
			this.page = page;
			
			this.filter.init();
			this.sort.init();
		};
	});



	app.page.streams = new Page({
		url: 'streams/:game',

		view: new ViewStreams(),

		el: {},
		provider: null,

		// Methods
		cacheElements: function() {
			this.el.$page 		= $( '#page-streams' );
			this.el.$list 		= this.el.$page.find( '.list' );
			this.el.$total 		= this.el.$page.find( '.total' );
			this.el.$gameName 	= this.el.$page.find( '.game-name' );
		},

		onShow: function( e ) {
			app.widget.loading.show( e.params.game );

			this.clearView();

			dataHandler.data.gameName = e.params.game;

			this.provider.setUrl( 'https://api.twitch.tv/kraken/search/streams?q=' + e.params.game );
			this.provider.enable();
			this.provider.update();

			this.el.$page.addClass( 'active' );
		},
		onHide: function() {
			this.el.$page.removeClass( 'active' );

			this.provider.disable();

			app.widget.loading.hide();
		},
		onBlur: function() {
			
		},
		onFocus: function() {
			
		},
		onMenuRefresh: function() {
			app.widget.loading.show( dataHandler.data.gameName );
			this.provider.update();
		},

		clearView: function() {
			this.el.$list.html('');
			this.el.$total.html('');
			this.el.$gameName.html('');
		},

		onProviderUpdate: function( data ) {
			dataHandler.run( data.streams );

			this.render();

			app.widget.loading.hide();

			app.setTitle( dataHandler.data.gameName );
		},

		onProviderProgress: function( prc ) {
			app.widget.loading.progress( prc );

			app.setTitle( prc + '%' );
		},

		render: function() {
			var data = dataHandler.getData();

			this.el.$gameName.html( data.gameName );
			this.el.$total.html( data.full.length );

			this.el.$list.html(
				this.view.getHTML( data.sel )
			);

			window.psdevLazyLoad.add(
				this.el.$list.find( '.preview' )
			);
		},

		init: function() {
			var self = this;

			this.cacheElements();

			dataHandler.init( this );

			this.provider = new Provider({
				prop: 'streams',
				url: 'https://api.twitch.tv/kraken/search/streams?q=',
				onUpdate: this.onProviderUpdate.bind( this ),
				onProgress: this.onProviderProgress.bind( this )
			});
		}
	});

})();