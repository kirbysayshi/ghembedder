/**
 * Modules in this bundle
 * 
 * ghembedder:
 *   license: MIT
 *   author: Andrew Petersen <senofpeter@gmail.com>
 * 
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ghembedder=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var ghe = module.exports = {
	 _apiBase: 'https://api.github.com'
	,_library: {}
	,_rLeadSlash: /^\/+|\/+$/g
	,_rWhiteSpace: /\s/g
};

ghe._decodeContent = function( content ){
	var decoded = window.atob( content.replace( ghe._rWhiteSpace, '' ) );
	
	return decoded;
};
	
ghe._keygen = function(){
	return 'ghembedder_key_' + ~~(Math.random() * 100000);
};

ghe._jsonpCallback = function(key){
	return window[key] = function(resp){
		var  lib = ghe._library[key]
			,linenos = false
			,hasLineRange = lib.lineBegin > -1 && lib.lineEnd > -1
			,decoded
			,lines
			,nums
			,tabSpace = new Array(lib.tabSize + 1).join(' ');
		
		if( resp.data && resp.data.content ){
			
			lib.data = resp.data;
			
			decoded = ghe._decodeContent( resp.data.content );
			//replace the tags so that they will be interpreted as text, and not source
			decoded = decoded.replace(/[&<>"'`]/g, (function() {
				var chars = {
					"&": "&amp;"
					,"<": "&lt;"
					,">": "&gt;"
					,'"': "&quot;"
					,"'": "&#x27;"
					,"`": "&#x60;"
				}
				return function(match) { return chars[match]; }
			}()));
			lines = decoded.split('\n');
			
			if( hasLineRange ){
				lines = lines.splice( lib.lineBegin - 1, lib.lineEnd - lib.lineBegin + 1 );
			}
			
			if( lib.linenos ){
				linenos = hasLineRange
					? lib.lineBegin
					: lib.linenos;
			} 
			
			// apply an anchor to each line, to be able to link to specifics
			lines = lines.map(function(l, i){
				return '<a class="nocode" id="' + lib.fileName + '-L' 
					+ (i + lib.lineBegin) + '">' 
					+ ( l ? '' : ' ' ) + '</a>' 
					+ l.replace(/\t/gi, tabSpace);
			});
				
			decoded = lines.join('\n');
			
			if(exports.prettyPrintOne){
				decoded = exports.prettyPrintOne( decoded, lib.lang, linenos ); 
			} 
			
			lib.el.className += ' ghe';
			
			lib.el.innerHTML = '<pre class="prettyprint"><code>' 
				+ decoded 
				+ '</code></pre>'
				+ (lib.annotate
					 ? ghe._annotation(key)
					 : '');

			// Remove the reference to this function.
			delete window[key];
			if (lib.onload) {
				lib.onload(null, lib);
			}
		}
	};
};

ghe._annotation = function( key ){
	var  lib = ghe._library[key]
			,hasLineRange = lib.lineBegin > -1 && lib.lineEnd > -1;
	
	return '<div class="ghe-annotation">' 
		+ lib.fileName 
		+ (hasLineRange 
			 ? ', lines ' + lib.lineBegin + '-' + lib.lineEnd 
			 : '') 
		+ (lib.data 
			 ? '. <a href="' + lib.data._links.html + '" target="_blank">Source</a>' 
			 : '')
		+ '</div>';

};
	
ghe._jsonp = function(fileUrl, cbName){
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = fileUrl 
		+ (fileUrl.indexOf('?') > -1 ? '&' : '?') 
		+ 'callback=' + cbName;
	
	document.getElementsByTagName('head')[0].appendChild(script);
};
	
ghe._parseNode = function(el){
	
	var lines = el.getAttribute('data-ghlines')
		,path = el.getAttribute('data-ghpath')
		,start
		,end;
	
	if(lines && lines.indexOf('-') > -1){
		lines = lines.split('-');
		start = parseInt( lines[0], 10 );
		end = parseInt( lines[1], 10 );
	} else if( lines ){
		start = end = parseInt( lines, 10 );
	} else {
		start = end = -1;
	}

	return {
		 path: path
		,userrepo: el.getAttribute('data-ghuserrepo')
		,ref: el.getAttribute('data-ghref') || 'master'
		,lineBegin: start
		,lineEnd: end
		,el: el
		,fileName: path.split('/').pop()
		,lang: el.getAttribute('data-ghlang')
		// "true" or ""/non-specified
		,linenos: el.getAttribute('data-ghlinenos')
		// "true" or ""/non-specified
		,annotate: el.getAttribute('data-ghannotate')
		,tabSize: parseInt( el.getAttribute('data-ghtabsize'), 10 ) || 4
	};
};

///////////////////////////////////////////////////////////////////////////////
// load: given a configuration object OR DOM Node that has the proper
// attributes, load the requested github file and display it.
///////////////////////////////////////////////////////////////////////////////
ghe.load = function(cfg, opt_cb){
	
	var key = ghe._keygen();
	
	if( cfg.nodeName ){
		cfg = ghe._parseNode(cfg);
	}

	if (opt_cb) {
		cfg.onload = opt_cb;
	}

	ghe._jsonpCallback(key);
	ghe._library[key] = cfg;
	ghe._jsonp(
		ghe._apiBase
			+ '/repos/'
			+ cfg.userrepo.replace(ghe._rLeadSlash, '')
			+ '/contents/'
			+ cfg.path.replace(ghe._rLeadSlash, '')
			+ '?ref=' + cfg.ref
		, key
	);
};

///////////////////////////////////////////////////////////////////////////////
// Look through the DOM for any nodes matching [data-ghpath], and automatically
// load them as embedded github files.
///////////////////////////////////////////////////////////////////////////////
ghe.autoload = function(){
	var nodes; 
	
	if( window.jQuery ){
		nodes = window.jQuery('[data-ghpath]');
	} else {
		nodes = document.querySelectorAll('[data-ghpath]');
	}
	
	for(var i = 0; i < nodes.length; i++){
		ghe.load(nodes[i]);
	}
};

},{}]},{},[1])(1)
});