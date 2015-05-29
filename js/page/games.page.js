(function() {
	if (! app.hasOwnProperty( 'page' )) app.page = {};

	var dataHandler = new (function() {
		var self = this;

		this.data = { full: {}, sel: {} };

		// Filters
		this.filter = {};

		this.filter.list = {};

		this.filter.list.search = {
			$el: null,
			reset: function() {
				this.$el.val( '' );
			},
			getValues: function() { return this.$el.val(); },
			isPassedFilter: function( options, item ) {
				if (options.search === '') return true;

				var query = item.game.name.toLowerCase();

				return (query.indexOf( options.search.toLowerCase() ) > -1);
			},
			init: function() {
				var timer;

				this.$el = self.page.el.$page.find( '#games-search' );

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
			$buttons: $( '#sort-games li' ),
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
			channels: {
				MinMax: function() {
					self.data.sel.sort(function( a, b ) { return a.channels - b.channels; });
				},
				MaxMin: function() {
					self.data.sel.sort(function( a, b ) { return b.channels - a.channels; });
				}
			},
			name: {
				MinMax: function() {
					self.data.sel.sort(function( a, b ) {
						if (a.game.name < b.game.name) return -1;
						if (a.game.name > b.game.name) return 1;
						return 0;
					});
				},
				MaxMin: function() {
					self.data.sel.sort(function( a, b ) {
						if (a.game.name < b.game.name) return 1;
						if (a.game.name > b.game.name) return -1;
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



	app.page.games = new Page({
		url: ['', 'games'],

		view: new ViewGames(),

		el: {},
		provider: null,
		
		// Methods
		cacheElements: function() {
			this.el.$page 	= $( '#page-games' );
			this.el.$list 	= this.el.$page.find( '.list' );
			this.el.$total 	= this.el.$page.find( '.total' );
		},

		onShow: function() {
			this.provider.enable();

			if (this.provider.getUpdateTime() > 10000) {
				app.widget.loading.show( 'Games' );
				
				this.clearView();
				this.provider.update();
			}

			this.el.$page.addClass( 'active' );
		},
		onHide: function() {
			this.el.$page.removeClass( 'active' );

			this.provider.disable();

			app.widget.loading.hide();
			app.widget.loading.reset();
		},
		onBlur: function() {
			
		},
		onFocus: function() {
			
		},
		onMenuRefresh: function() {
			app.widget.loading.show( 'Games' );
			this.provider.update();
		},

		clearView: function() {
			this.el.$list.html('');
			this.el.$total.html('');
		},

		onProviderUpdate: function( data ) {
			dataHandler.run( data.top );

			this.render();

			app.widget.loading.hide();
			app.widget.loading.reset();

			app.setTitle( 'Games' );
		},

		onProviderProgress: function( prc ) {
			app.widget.loading.progress( prc );

			app.setTitle( prc + '%' );
		},

		render: function() {
			var data = dataHandler.getData();

			this.el.$total.html( data.full.length );
			this.el.$list.html(
				this.view.getHTML( data.sel )
			);

			window.psdevLazyLoad.add(
				this.el.$list.find( '.img' )
			);
		},

		init: function() {
			var self = this;

			this.cacheElements();

			dataHandler.init( this );

			this.provider = new Provider({
				prop: 'top',
				url: 'https://api.twitch.tv/kraken/games/top?a=b',
				onUpdate: this.onProviderUpdate.bind( this ),
				onProgress: this.onProviderProgress.bind( this )
			});
		}
	});

})();