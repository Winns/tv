var Page = function( cfg ) {
	this.flags = {
		active: false
	};

	this.onShow 	= function() {};
	this.onHide		= function() {};
	this.onBlur 	= function() {};
	this.onFocus 	= function() {};

	this.show = function( params ) {
		if (this.status == 'show')
			return;
		else
			this.status = 'show';

		this.onShow( params );
	};
	this.hide = function() {
		if (this.status == 'hide')
			return;
		else
			this.status = 'hide';

		this.onHide();
	};

	this._constructor = function() {
		for (var key in cfg) {
			this[ key ] = cfg[ key ];
		};

		if (this.hasOwnProperty( 'init' )) {
			this.init();
		};
	};

	this._constructor();
};

	