// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({5:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.debounce = debounce;
exports.extend = extend;
exports.removeClassFromAll = removeClassFromAll;
/**
 * UTILITIES
 */

/**
 * Debounce
 */
function debounce(func) {
	var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
	var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	var timeout;
	return function () {

		var context = this,
		    args = arguments;

		var later = function later() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};

		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);

		if (callNow) func.apply(context, args);
	};
};

/**
 * Merge Two Objects
 */
function extend() {
	var extended = {};
	var deep = false;
	var i = 0;

	// Check if a deep merge
	if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
		deep = arguments[0];
		i++;
	}

	// Merge the object into the extended object
	var merge = function merge(obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				// If property is an object, merge properties
				if (deep && Object.prototype.toString.call(obj[prop]) === "[object Object]") {
					extended[prop] = extend(extended[prop], obj[prop]);
				} else {
					extended[prop] = obj[prop];
				}
			}
		}
	};

	// Loop through each object and conduct a merge
	for (; i < arguments.length; i++) {
		var obj = arguments[i];
		merge(obj);
	}

	return extended;
};

/**
 * Remove class from all elements passed
 */
function removeClassFromAll(items, className) {

	//TODO some check

	for (var i = 0; i < items.length; i++) {
		items[i].classList.remove(className);
	}
}
},{}],4:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * ScrollTo
 *
 * @param {String} linkSelector CSS class of links to watch for animated scroll
 * @returns null
 */
var ScrollTo = exports.ScrollTo = function (linkSelector) {
	var BuildScrollTo = function BuildScrollTo(linkSelector) {
		var publicAPIs = {};

		var animateScrollTo = function animateScrollTo(destination) {
			var destinationToScrollTo = destination.offsetTop;

			if ('scrollTo' in window === false) {
				window.scroll(0, destinationToScrollTo);
				return;
			}

			window.scrollTo({
				'behavior': 'smooth',
				'top': destinationToScrollTo
			});
		};

		var runAnimateScrollTo = function runAnimateScrollTo() {
			if (!event.target.matches(linkSelector)) return;
			event.preventDefault();

			var contentID = String(event.target.getAttribute('href'));
			contentID = contentID.replace('#', '');

			var content = document.getElementById(contentID);
			if (!content) return;

			animateScrollTo(content);
		};

		publicAPIs.init = function (linkSelector) {
			document.addEventListener('click', function () {
				runAnimateScrollTo();
			}, false);
		};

		publicAPIs.init(linkSelector);

		return publicAPIs;
	};

	return BuildScrollTo;
}(window, document);
},{}],3:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Magellan = undefined;

var _utils = require('./utils');

var _scrollTo = require('./scrollTo');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } //--------------------------------------------------------------
// MAGELLAN NAV
//--------------------------------------------------------------


/**
 * Magellan
 *
 * @param {String} contentSelector CSS class for Magellan content blocks
 * @param {String} linkSelector CSS class for Magellan links
 * @param {Function} onComplete
 * @param {Object} options
 * @returns null
 */
var Magellan = exports.Magellan = function (contentSelector, linkSelector, options) {
	var defaults = {
		activeLinkClass: 'is-active',
		onEnterViewport: function onEnterViewport(content) {}

		// Constructor
	};var BuildMagellan = function BuildMagellan(contentSelector, linkSelector, options) {
		var publicAPIs = {};
		var settings = void 0;

		var runMagellan = function runMagellan(contents) {

			function createObserver(element) {
				var observerOptions = {
					threshold: 1
				};

				var observer = new IntersectionObserver(handleIntersect, observerOptions);

				observer.observe(element);
			}

			function handleIntersect(entries, observer) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						var content = entry.target;

						publicAPIs.deactivateAllLinks();
						activateContentsLink(content);

						// Callback
						settings.onEnterViewport(content);
					}
				});
			}

			contents.map(function (content) {
				createObserver(content);
			});
		};

		var activateContentsLink = function activateContentsLink(content) {
			var contendID = content.getAttribute('id');
			var activeItem = document.querySelector('[href="#' + contendID + '"]');

			if (!activeItem) return;
			activeItem.classList.add(settings.activeLinkClass);
		};

		// Public API
		publicAPIs.deactivateAllLinks = function () {
			var links = [].concat(_toConsumableArray(document.querySelectorAll(linkSelector)));
			(0, _utils.removeClassFromAll)(links, settings.activeLinkClass);
		};

		publicAPIs.destroy = function () {};

		publicAPIs.init = function (options) {
			settings = (0, _utils.extend)(defaults, options || {});

			var contents = [].concat(_toConsumableArray(document.querySelectorAll(contentSelector)));
			var links = [].concat(_toConsumableArray(document.querySelectorAll(linkSelector)));

			if (!contents || !links) return;

			window.addEventListener('load', function () {
				runMagellan(contents);
			});

			var handleClicks = new _scrollTo.ScrollTo(linkSelector);
		};

		publicAPIs.init(options);

		return publicAPIs;
	};

	return BuildMagellan;
}(window, document);
},{"./utils":5,"./scrollTo":4}],2:[function(require,module,exports) {
'use strict';

var _magellan = require('./src/magellan.js');

window.Magellan = _magellan.Magellan;
},{"./src/magellan.js":3}],14:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '60053' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[14,2])
//# sourceMappingURL=/dist/easy-magellan.map