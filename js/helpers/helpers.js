function wDefArg(x, def) {
	if (x === undefined) { return def; } 
	return x;
}

var JSONP = (function(){
	var counter = 0;

	var memoryleakcap = function() {
		if (this.readyState && this.readyState !== "loaded" && this.readyState !== "complete") { return; }

		try {
			this.onload = this.onreadystatechange = null;
			this.parentNode.removeChild(this);
		} catch(ignore) {}
	};

	return function(url, callback) {
		var uniqueName = 'callback_json' + (++counter);

		var script = document.createElement('script');
		script.src = url + (url.toString().indexOf('?') === -1 ? '?' : '&') + 'callback=' + uniqueName;
		script.async = true;

		window[ uniqueName ] = function(data){
			callback(data);
			window[ uniqueName ] = null;
			try { delete window[ uniqueName ]; } catch (ignore) {}
		};

		script.onload = script.onreadystatechange = memoryleakcap;

		document.getElementsByTagName('head')[0].appendChild( script );

		return uniqueName;
	};
})();


(function hidden() {
	var hidden = 'hidden';

	// Standards:
	if (hidden in document) {
		document.addEventListener( 'visibilitychange', onChange );
	} else if ('mozHidden' in document) {
		hidden = 'mozHidden';
		document.addEventListener('mozvisibilitychange', onChange);
	} else if ('webkitHidden' in document) {
		hidden = 'webkitHidden';
		document.addEventListener('webkitvisibilitychange', onChange);
	} else if ('msHidden' in document) {
		hidden = 'msHidden';
		document.addEventListener('msvisibilitychange', onChange);
	// IE 9 and lower:
	} else if ('onfocusin' in document) {
		document.onfocusin = document.onfocusout = onChange;
	// All others:
	} else {
		window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onChange;
	}

	function onChange (e) {
		var state 	= '',
			v 		= 'visible', 
			h 		= 'hidden';
			
		var eMap = {
			focus: v, focusin: v, pageshow: v, 
			blur: h, focusout: h, pagehide: h
		};

		e = e || window.event;

		if (e.type in eMap)
			state = eMap[e.type];
		else
			state = this[hidden] ? 'hidden' : 'visible';

		if (state === 'visible')
			$( window ).trigger( 'pageVisible' );
		else
			$( window ).trigger( 'pageHidden' );
	}

	// set the initial state (but only if browser supports the Page Visibility API)
	if( document[ hidden ] !== undefined )
		onChange({ type: document[ hidden ] ? 'blur' : 'focus' });
})();

$(function switcher() {

	$( document ).on( 'click', '.js-switcher', function() {
		var $target 	= $($( this ).attr( 'data-switcher-target' )),
			useClass 	= $( this ).attr( 'data-switcher-class' );

		if (useClass === undefined) useClass = 'active';

		if ($( this ).hasClass( useClass )) {
			$target.removeClass( useClass );
			$( this ).removeClass( useClass );
		} else {
			$target.addClass( useClass );
			$( this ).addClass( useClass );
		}
	});

});

window.userProfile = new (function () {
	var self = this;

	this.updateTime = null;

	this.onPool = [];
	this.on = function( method, f ) {
		this.onPool.push({
			method: method,
			f: f
		});
	};
	this.onTrigger = function( method, data ) {
		var o;

		for (var i=0; i < this.onPool.length; i++) {
			o = this.onPool[i];
			if (o.method == method) o.f( data );
		}
	};
	this.trigger = function( method ) {
		switch (method) {
			case 'render':
			default:
				this.onTrigger( method, this.load() );
				break;
		}
	};

	this.formatData = function( data ) {
		if (data === undefined || data === null) data = {};

		return {
			'multi': wDefArg( data.multi, {} ),
			'following': wDefArg( data.following, {} ),
			'updateTime': new Date().getTime()
		};
	};

	this.save = function( data ) {
		var o = this.formatData( data );

		this.updateTime = o.updateTime;

		localStorage.setItem( 'userProfile', JSON.stringify(o) );
		this.onTrigger( 'update', this.load() ); 
		this.onTrigger( 'render', this.load() ); 
	};

	this.load = function() {
		if (localStorage.getItem( 'userProfile' ) === null) {
			this.save({});
			return this.load();
		} else {
			return JSON.parse( localStorage.getItem( 'userProfile' ) );
		}
	};

	this.clear = function() {
		localStorage.removeItem( 'userProfile' );
		
		this.onTrigger( 'update', this.load() ); 
		this.onTrigger( 'render', this.load() ); 
	};

	this.init = function() {
		this.updateTime = this.load().updateTime;

		// Start localstorage auto sync
		setInterval(function() {
			var data = self.load();

			if (data.updateTime !== self.updateTime) {
				self.updateTime = data.updateTime;
				self.onTrigger( 'render', data );
			}
		}, 5000 );
	};

	this.init();
});