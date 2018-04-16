/**
 * UTILITIES
 */

/**
 * Debounce
 */
export function debounce(func, wait = 20, immediate = true) {
	var timeout;
	return function () {

		var context = this,
			args = arguments;

		var later = function () {
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
 * TODO attribution to Chris
 */
export function extend() {
	let extended = {};
	let deep = true;
	let i = 0;

	// Check if a deep merge
	if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
		deep = arguments[0];
		i++;
	}

	// Merge the object into the extended object
	var merge = function (obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				// If property is an object, merge properties
				if (
					deep &&
					Object.prototype.toString.call(obj[prop]) === "[object Object]"
				) {
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
export function removeClassFromAll(items, className) {

	//TODO some check

	for (let i = 0; i < items.length; i++) {
		items[i].classList.remove(className);
	}
}
