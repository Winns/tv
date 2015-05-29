(function() {
	if (! app.hasOwnProperty( 'page' )) app.page = {};

	app.page.multi = new Page({
		url: [ 'multi', 'multi/*'],

		el: {},
		view: null,
		data: [],

		// Methods
		cacheElements: function() {
			this.el.$page 		= $( '#page-multi' );
			this.el.$video 		= this.el.$page.find( '.wrapper .video ul' );
			this.el.$chatWrap 	= this.el.$page.find( '.wrapper .chat' );
			this.el.$chat 		= this.el.$chatWrap.find( 'ul' );
			this.el.$chatSelect = this.el.$page.find( '.header .chat-select select' );

			this.el.$btnEdit 	= this.el.$page.find( '.header .btn-edit' );
			this.el.$btnSave 	= this.el.$page.find( '.header .btn-save' );
			this.el.$btnAdd 	= this.el.$page.find( '.header .btn-add' );

			this.el.$addInput	= this.el.$page.find( '.header .add-wrapper input' );
		},

		onShow: function( e ) {
			app.widget.loading.show( 'Multi Twitch' );

			this.data = (function() {
				var arr = e.matches.length ? e.matches[0].split( '/' ) : [];

				if (arr[ arr.length-1 ] == '')
					arr.splice(arr.length-1, 1);

				return arr;
			})();

			this.render();
			this.el.$page.addClass( 'active' );

			app.setTitle( 'Multi Twitch' );
			app.widget.loading.hide();
		},
		onHide: function() {
			this.el.$page.removeClass( 'active' );
			app.widget.loading.hide();
		},
		onBlur: function() {},
		onFocus: function() {},
		onMenuRefresh: function() {
			app.widget.loading.show( 'Refresh..' );
			this.render();
			app.widget.loading.hide();
		},

		render: function() {
			this.view.render( this.data );
		},

		removeStream: function( $el ) {
			var id = $el.attr( 'data-id' ), 
				$items, $opt;

			$el.remove();

			$items = this.el.$video.find( 'li' );
			$items.removeClass( 'i1 i2 i3 i4 i5 i6 i7 i8' );
			$items.each(function( i ) {
				$(this).addClass( 'i' + (i+1) );
			});

			this.el.$video
				.removeClass( 'g1 g2 g3 g4 g5 g6 g7 g8' )
				.addClass( 'g' + $items.length );

			this.el.$chat.find( 'li[data-id="'+ id +'"]' )
				.remove();

			this.el.$chatSelect.find( 'option[value="'+ id +'"]' )
				.remove();

			this.el.$chatSelect.trigger( 'change' );
		},

		initSort: function() {
			var self	= this,
				sel 	= '#page-multi .video li .sort-handler',
				down 	= false,
				enable 	= false,
				$o		= $([]),
				$from, $to;

			function clearPreview() {
				self.el.$video.find( '.sort-preview' )
					.removeClass( 'active' )
					.html( '' );

				self.el.$video.removeClass( 'mousedown' );
			}

			function swapElements() {
				var $fromWrap 		= $from.closest( 'li' ),
					$toWrap 		= $to.closest( 'li' ),
					$tmp 			= $( '<span>' ).hide(),
					currentChat 	= self.el.$chatSelect.val(),
					htmlChatSelect 	= '',
					$li,
					id;

				$fromWrap.before( $tmp );
				$toWrap.before( $fromWrap );
				$tmp.replaceWith( $toWrap );

				$li = self.el.$video.find( 'li' );
				$li.removeClass( 'i1 i2 i3 i4 i5 i6 i7 i8' );
				$li.each(function( i ) {
					$(this).addClass( 'i' + (i+1) );

					id = $(this).attr('data-id');

					htmlChatSelect += self.view.template.chatSelect( id );
				});

				htmlChatSelect += self.view.template.chatSelectOff();

				self.el.$chatSelect
					.html( htmlChatSelect )
					.val( currentChat );
			}

			$o = $o.add( $( document ) );
			$o = $o.add( this.el.$video );
			$o.on( 'mouseleave', function(e) {
				enable 	= false;
				down 	= false;

				clearPreview();
			});

			$( document ).on( 'mousedown', sel, function(e) {
				if (! $(e.target).hasClass( 'btn-remove' ))
					e.preventDefault();

				enable 	= true;
				down 	= true;
				$from 	= $(this);

				self.el.$video.addClass( 'mousedown' );
			});

			$( document ).on( 'mouseup', sel, function(e) {
				if (enable) {
					if (! $(e.target).closest( '.btn-remove' ).length )
						swapElements();
	
					clearPreview();
				}

				down 	= false;
				enable 	= false;
			});

			$( document ).on( 'mouseenter', sel, function(e) {
				if (!enable || !down) return;

				$to = $(this);

				if ( $from.get(0) === $to.get(0) ) return;

				clearPreview();

				$to.find( '.sort-preview' )
					.html( $from.closest('li').attr('data-id') )
					.addClass( 'active' );

				$from.find( '.sort-preview' )
					.html( $to.closest('li').attr('data-id') )
					.addClass( 'active' );
			});

		},

		bindEvents: function() {
			var self = this;

			this.el.$chatSelect.on( 'change', function() {
				if (this.value === 'off') {
					self.el.$chatWrap.addClass( 'off' );
				} else {
					var show = self.el.$chat.find( 'li[data-id="'+ this.value +'"]' ),
						hide = self.el.$chat.find( 'li' ).not( show );

					hide.removeClass( 'active' );
					show.addClass( 'active' );
					self.el.$chatWrap.removeClass( 'off' );
				}
			});

			(function bindSave() {
				var t;

				self.el.$btnSave.on( 'click', function() {
					var hash 	= 'multi/',
						$btn 	= $(this),
						arr 	= [],
						profile,
						o;

					o = (function() {
						var temp = {};

						self.el.$video.find( 'li' ).each(function() {
							temp[ $(this).attr('data-id') ] = true;
							hash += $(this).attr('data-id')  + '/';
							arr.push( $(this).attr('data-id') );
						});

						return temp;
					})();

					self.data = arr;

					profile = window.userProfile.load();
					profile.multi = o;

					window.userProfile.save( profile );
					window.location.hash = hash;

					$btn.addClass( 'saved' );

					clearTimeout( t );
					t = setTimeout(function() {
						$btn.removeClass( 'saved' );
					}, 750);
				});
			})();

			this.el.$btnEdit.on( 'click', function() {
				if ($(this).hasClass( 'active' )) {
					$(this).removeClass( 'active' );
					self.el.$video.removeClass( 'edit' );
				} else {
					$(this).addClass( 'active' );
					self.el.$video.addClass( 'edit' );
				}
			});


			this.el.$btnAdd.on( 'click', function() {
				var id = self.el.$addInput.val();

				if ($.inArray(id, self.data) === -1) {
					var index = self.el.$video.find( 'li' ).length;

					self.data.push( id );
					self.view.append( [id] );
				}

				self.el.$addInput.val( '' );
			});

			$( document ).on( 'click mouseup', '#page-multi .video .btn-remove', function() {
				self.removeStream( $(this).closest( 'li' ) );
			});
		},

		init: function() {
			var self = this;

			this.view = new ViewMulti({
				$page: 			$( '#page-multi' ),
				$video: 		$( '#page-multi .wrapper .video ul' ),
				$chat: 			$( '#page-multi .wrapper .chat ul' ),
				$chatSelect: 	$( '#page-multi .header .chat-select select' ),
			});

			this.cacheElements();
			this.bindEvents();
			this.initSort();
		}
	});

})();
