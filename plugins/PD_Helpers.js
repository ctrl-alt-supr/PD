//=============================================================================
// SD_Helpers.js
//=============================================================================
/*:
 * @plugindesc C1 - Some useful functions that are used by the system.
 * @author Alex
 *
 * @help Sin comandos de plugin.
 * 
 * */

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
	Object.defineProperty(Array.prototype, 'find', {
	  value: function(predicate) {
	   // 1. Let O be ? ToObject(this value).
		if (this == null) {
		  throw new TypeError('"this" is null or not defined');
		}
  
		var o = Object(this);
  
		// 2. Let len be ? ToLength(? Get(O, "length")).
		var len = o.length >>> 0;
  
		// 3. If IsCallable(predicate) is false, throw a TypeError exception.
		if (typeof predicate !== 'function') {
		  throw new TypeError('predicate must be a function');
		}
  
		// 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
		var thisArg = arguments[1];
  
		// 5. Let k be 0.
		var k = 0;
  
		// 6. Repeat, while k < len
		while (k < len) {
		  // a. Let Pk be ! ToString(k).
		  // b. Let kValue be ? Get(O, Pk).
		  // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
		  // d. If testResult is true, return kValue.
		  var kValue = o[k];
		  if (predicate.call(thisArg, kValue, k, o)) {
			return kValue;
		  }
		  // e. Increase k by 1.
		  k++;
		}
  
		// 7. Return undefined.
		return undefined;
	  },
	  configurable: true,
	  writable: true
	});
  }

var PD=PD||{};
PD.Helpers=PD.Helpers||{};
/**
 * @function randomInteger
 * @description Returns a random integer between min and max included
 * @param {number} min - The minimun number that can be returned by the call
 * @param {number} max - The maximun number that can be returned by the call
 * @returns {number} A random integer between min and max (both included)
 */
PD.Helpers.randomInteger=function(min, max){
    if(max==undefined || max==null){
        max=min;
        min=0;
    }
    return Math.floor(Math.random()*(max-min+1)+min);
}
/**
 * @function randomFrom
 * @description Returns a random element from listToPickFrom.
 * @function randomFrom
 * @param {array} listToPickFrom - The list of elements to pick from.
 * @returns A random element in listToPickFrom.
 */
PD.Helpers.randomFrom=function(listToPickFrom){
    var min=0;
    var max=listToPickFrom.length-1;
    return listToPickFrom[PD.Helpers.randomInteger(min,max)];
}
/**
 * @function randomFromWithWeight
 * @description Returns a random element from listToPickFrom using different weights (chances to be picked) for each element.
 * @param {Object[]} listToPickFrom - The list of elements to pick from.
 * @param {number} listToPickFrom[].weightProperty - A property inside each element in the list that should determine its weight.
 * @param {string} weightProperty - The name of the weightProperty of the elements in the array.
 * @returns A random element in listToPickFrom using the weigths given.
 */
PD.Helpers.randomFromWithWeight=function(listToPickFrom, weightProperty){
	listToPickFrom=listToPickFrom.filter(function(ea){
		return (ea[weightProperty]!=undefined && ea[weightProperty]!=null) && ea[weightProperty]>0;
	})
    var sumOfWeights = listToPickFrom.reduce(function(memo, elm) {
        return memo + elm[weightProperty];
    }, 0);
    var rng = Math.floor(Math.random() * (sumOfWeights + 1));
    var findFnc = function(el) {
        rng -= el[weightProperty];
        return rng <= 0;
    };
    return listToPickFrom.find(findFnc);
}
/**
 * @function randomChance
 * @description Returns true with chances probabiliy
 * @param {number} chances - Chance of returning true (over 100).
 * @returns Returns true with chances probabiliy or false
 */
PD.Helpers.randomChance=function(chances){
    return PD.Helpers.randomInteger(100)<=chances;
}
/**
 * @function shuffleArray
 * @description Returns a suffled (each element of the array placed in a random position) version of the input.
 * @param {array} input - The array to suffle.
 * @returns Returns the shuffled array.
 */
PD.Helpers.shuffleArray=function(input){
    var out=input;
    var j, x, i;
    for (i = out.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = out[i];
        out[i] = out[j];
        out[j] = x;
    }
    return out;
}
/**
 * @function transposeArray
 * @description Returns a transposed (each axis swapped) version of the input.
 * @param {array[]} input - The two dimensional array to transpose.
 * @returns Returns the transposed array.
 */
PD.Helpers.transposeArray=function(a){
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { return r[c]; });
    });
}

PD.Helpers.paintGrid=function(tGrid, h, w){
    var res="";
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < h; x++) {
            var tileToPaint=tGrid[y][x];
            res+=tileToPaint;
        }
        res+="\n"; 
    }
    console.log("%c"+res, "font-family: serif, sans-serif; line-height: 15px; font-size:15px");
}

// JSON.prune : a function to stringify any object without overflow
// two additional optional parameters :
//   - the maximal depth (default : 6)
//   - the maximal length of arrays (default : 50)
// You can also pass an "options" object.
// examples :
//   var json = JSON.prune(window)
//   var arr = Array.apply(0,Array(1000)); var json = JSON.prune(arr, 4, 20)
//   var json = JSON.prune(window.location, {inheritedProperties:true})
// Web site : http://dystroy.org/JSON.prune/
// JSON.prune on github : https://github.com/Canop/JSON.prune
// This was discussed here : http://stackoverflow.com/q/13861254/263525
// The code is based on Douglas Crockford's code : https://github.com/douglascrockford/JSON-js/blob/master/json2.js
// No effort was done to support old browsers. JSON.prune will fail on IE8.
(function () {
	'use strict';

	var DEFAULT_MAX_DEPTH = 6;
	var DEFAULT_ARRAY_MAX_LENGTH = 50;
	var DEFAULT_PRUNED_VALUE = '"-pruned-"';
	var seen; // Same variable used for all stringifications
	var iterator; // either forEachEnumerableOwnProperty, forEachEnumerableProperty or forEachProperty
	
	// iterates on enumerable own properties (default behavior)
	var forEachEnumerableOwnProperty = function(obj, callback) {
		for (var k in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, k)) callback(k);
		}
	};
	// iterates on enumerable properties
	var forEachEnumerableProperty = function(obj, callback) {
		for (var k in obj) callback(k);
	};
	// iterates on properties, even non enumerable and inherited ones
	// This is dangerous
	var forEachProperty = function(obj, callback, excluded) {
		if (obj==null) return;
		excluded = excluded || {};
		Object.getOwnPropertyNames(obj).forEach(function(k){
			if (!excluded[k]) {
				callback(k);
				excluded[k] = true;
			}
		});
		forEachProperty(Object.getPrototypeOf(obj), callback, excluded);
	};

	Object.defineProperty(Date.prototype, "toPrunedJSON", {value:Date.prototype.toJSON});

	var	cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		meta = {	// table of character substitutions
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		};

	function quote(string) {
		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
			var c = meta[a];
			return typeof c === 'string'
				? c
				: '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' : '"' + string + '"';
	}


	var prune = function (value, depthDecr, arrayMaxLength) {
		var prunedString = DEFAULT_PRUNED_VALUE;
		var replacer;
		if (typeof depthDecr == "object") {
			var options = depthDecr;
			depthDecr = options.depthDecr;
			arrayMaxLength = options.arrayMaxLength;
			iterator = options.iterator || forEachEnumerableOwnProperty;
			if (options.allProperties) iterator = forEachProperty;
			else if (options.inheritedProperties) iterator = forEachEnumerableProperty
			if ("prunedString" in options) {
				prunedString = options.prunedString;
			}
			if (options.replacer) {
				replacer = options.replacer;
			}
		} else {
			iterator = forEachEnumerableOwnProperty;
		}
		seen = [];
		depthDecr = depthDecr || DEFAULT_MAX_DEPTH;
		arrayMaxLength = arrayMaxLength || DEFAULT_ARRAY_MAX_LENGTH;
		function str(key, holder, depthDecr) {
			var i, k, v, length, partial, value = holder[key];

			if (value && typeof value === 'object' && typeof value.toPrunedJSON === 'function') {
				value = value.toPrunedJSON(key);
			}
			if (value && typeof value.toJSON === 'function') {
				value = value.toJSON(); 
			}

			switch (typeof value) {
			case 'string':
				return quote(value);
			case 'number':
				return isFinite(value) ? String(value) : 'null';
			case 'boolean':
			case 'null':
				return String(value);
			case 'object':
				if (!value) {
					return 'null';
				}
				if (depthDecr<=0 || seen.indexOf(value)!==-1) {
					if (replacer) {
						var replacement = replacer(value, prunedString, true);
						return replacement===undefined ? undefined : ''+replacement;
					}
					return prunedString;
				}
				seen.push(value);
				partial = [];
				if (Object.prototype.toString.apply(value) === '[object Array]') {
					length = Math.min(value.length, arrayMaxLength);
					for (i = 0; i < length; i += 1) {
						partial[i] = str(i, value, depthDecr-1) || 'null';
					}
					v = '[' + partial.join(',') + ']';
					if (replacer && value.length>arrayMaxLength) return replacer(value, v, false);
					return v;
				}
				iterator(value, function(k) {
					try {
						v = str(k, value, depthDecr-1);
						if (v) partial.push(quote(k) + ':' + v);
					} catch (e) { 
						// this try/catch due to forbidden accessors on some objects
					}				
				});
				return '{' + partial.join(',') + '}';
			case 'function':
			case 'undefined':
				return replacer ? replacer(value, undefined, false) : undefined;
			}
		}
		return str('', {'': value}, depthDecr);
	};
	
	prune.log = function() {
		console.log.apply(console, Array.prototype.map.call(arguments, function(v) {
			return JSON.parse(JSON.prune(v));
		}));
	};
	prune.forEachProperty = forEachProperty; // you might want to also assign it to Object.forEachProperty

	if (typeof module !== "undefined") module.exports = prune;
	else JSON.prune = prune;
}());