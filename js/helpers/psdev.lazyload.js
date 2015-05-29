window.psdevLazyLoad = new (function() {
	var self = this;

	this.$el = null;
	this.cached = {};

	// Timers
	this._t = {
		onScroll: null,
		afterScroll: null
	};

	this.time = {
		afterScroll: 1000,
		onScroll: 300
	};

	this.flags = {
		scrolling: false
	};

	this._isVisible = function( $el ) {
		if (! $el.length) return false;

		var winTop		= $( window ).scrollTop(),
			winBottom	= winTop + $( window ).height(),
			elTop, elBottom;


		elTop = elBottom = $el.offset().top + $el.height()/2;

		return ((winTop <= elTop) && (winBottom >= elBottom));
	};

	this._onScroll = function() {
		if (this.flags.scrolling) {
			clearTimeout( this._t.afterScroll );

			this._t.afterScroll = setTimeout(function() {
				self.checkImages();
			}, this.time.afterScroll);

			return;
		} else {
			this.checkImages();

			this.flags.scrolling = true;

			this._t.onScroll = setTimeout(function() {
				self.flags.scrolling = false;
			}, this.time.onScroll);
		}
	};

	this._markAsCached = function( url ) {
		if (! this.cached.hasOwnProperty( url ))
			this.cached[ url ] = true;
	};

	this.isCached = function( url ) {
		return this.cached.hasOwnProperty( url );
	};

	this.checkImages = function() {
		if (this.$el === null || !this.$el.length) return;

		var x = 0;

		this.$el = this.$el.not( '.js-lazyload-done' );
		this.$el.each(function() {

			if (self._isVisible( $(this) )) {

				(function( $el ) {
					setTimeout(function() {
						self._markAsCached( $el.attr( 'data-image' ) );

						$el.addClass( 'js-lazyload-done' );
						$el.css({
							'background-image': 'url('+ $el.attr( 'data-image' ) +')',
							'background-size': 'contain'
						});
					}, x);

					x += 80;
				})( $(this));
			}
		});
	};

	this.add = function( $elements ) {
		this.$el = $elements;
		this.checkImages();
	};

	this.init = function() {
		$( window ).on( 'scroll', this._onScroll.bind(this) );
	};

	this.init();
});