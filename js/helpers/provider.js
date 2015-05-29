var Provider = function( cfg ) {
	this.data 		= null;
	this.timer 		= null;
	this.updateTime = 0;

	this.cfg = $.extend({
		prop: null,
		interval: 15000,
		onProgress: function() {}
	}, cfg);

	this.flags = {
		enable: false,
		autoUpdate: true
	};
};

Provider.prototype.get = function( callback ) {
	var self 		= this,
		offset 		= 0,
		limit 		= 100,
		fullData 	= {};

	function mergeObjects( o1, o2 ) {
		for (var key in o2) {
			if (Array.isArray( o2[key] )) {
				o1[ key ] = o1[ key ].concat( o2[key] );
			}
		}

		return o1;
	};

	function _handler() {
		var url = self.cfg.url;

		url += '&limit=' + limit;
		url += '&offset=' + offset;

		JSONP( url, function( data ) {
			if (! self.flags.enable) return;

			if (self.cfg.hasOwnProperty( 'prop' )) {

				var done 	= false,
					prc 	= 0;

				if (self.cfg.prop !== null) {
					done 		= (data[ self.cfg.prop ].length <= 0);
					fullData 	= mergeObjects( data, fullData );
					prc 		= (fullData[ self.cfg.prop ].length * 100 / fullData._total) >> 0;
				} else {
					done 		= true;
					fullData 	= data;
					prc 		= 100;
				}

				self.cfg.onProgress( prc );

				if (done) {
					console.log( 'callback', fullData);
					callback( fullData );
				} else {
					offset += limit;
					_handler();
				}

			}

		});
	};

	_handler();
};

Provider.prototype.update = function( progress ) {
	if (progress !== undefined)
		this.cfg.onProgress = progress;

	this.get( this.handleUpdate.bind( this ) );
};

Provider.prototype.isNewData = function( data ) {
	return true;
};

Provider.prototype.setUrl = function( url ) {
	this.cfg.url = url;
};

Provider.prototype.enable = function() {
	this.flags.enable = true;
};

Provider.prototype.disable = function() {
	this.flags.enable = false;
	this.stopAutoUpdate();
};

Provider.prototype.startAutoUpdate = function() {
	var self = this;

	this.flags.autoUpdate = true;

	clearInterval( this.timer );
	this.timer = setInterval( 
		self.update.bind( self ), this.cfg.interval
	);
};

Provider.prototype.stopAutoUpdate = function() {
	this.flags.autoUpdate = false;
	clearInterval( this.timer );
};

Provider.prototype.run = function( cfg ) {
	/*
	clearTimeout( this.timeout );

	cfg = cfg || {};

	if (cfg.hasOwnProperty( 'updateNow' ) && cfg.updateNow == false) {
		this.timeout = setTimeout( 
			this.update.bind( this ), 
			this.cfg.interval - this.getUpdateTime()
		);
	} else {
		this.update();
	}
	*/

	this.update();
};

Provider.prototype.handleUpdate = function( data ) {

	// On error
	if (data.hasOwnProperty( 'error' )) {
		this.cfg.onError( data );
	} else {
		if (this.isNewData( data )) {
			this.data = data;
			this.updateTime = new Date().getTime();

			this.cfg.onUpdate( data );
		}
	}
};

Provider.prototype.getUpdateTime = function() {
	return new Date().getTime() - this.updateTime;
};