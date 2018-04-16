//--------------------------------------------------------------
// MAGELLAN NAV
//--------------------------------------------------------------
import {extend, removeClassFromAll} from './utils';

/**
 * Magellan
 *
 * @param {any} contentSelector
 * @param {any} linkSelector
 * @param {any} options
 * @returns null
 */
const Magellan = (function(contentSelector, linkSelector, options) {
	let defaults = {
		activeLinkClass: 'is-active',
		threshold: 50,
		intersectionObserverOptions : {
			rootMargin: '0px',
			root: null,
			threshold: 1,
		},
	}

	// Constructor
	const BuildMagellan = function(contentSelector, linkSelector, options) {
		let publicAPIs = {};
		let settings;

		const runMagellan = function(contents) {
			createObserver(contents);
		}

		function createObserver(contents) {
			const observerOptions = {
				root: settings.intersectionObserverOptions.root,
				rootMargin: settings.intersectionObserverOptions.rootMargin,
				threshold: settings.intersectionObserverOptions.threshold,
			}

			const observer = new IntersectionObserver(handleIntersect, observerOptions);

			contents.forEach(content => {
				observer.observe(content);
			});

			return publicAPIs.observer = observer;
		}

		/**
		* Handle Intersect
		* Handle Magellan content when entering the viewport
		*/
		function handleIntersect(entries, observer) {
			const activeContent = entries.find(entry => {
				if(entry.intersectionRect.top <= settings.threshold) {
					return entry;
				}
			});

			if (!activeContent) return;

			publicAPIs.deactivateAllLinks();
			activateContentsLink(activeContent.target.id);
		}

		/**
		* Activate Content Link
		* Add active link class to the link tag the corresponds with the Megallan content passed
		*/
		const activateContentsLink = function(contentID) {
			const activeItem = document.querySelector(`[href="#${contentID}"]`);

			if (!activeItem) return;
			activeItem.classList.add(settings.activeLinkClass);
		}

		// Public API
		publicAPIs.deactivateAllLinks = function() {
			const links = [...document.querySelectorAll(linkSelector)]; //could be cached somewhere?
			removeClassFromAll(links, settings.activeLinkClass);
		}

		publicAPIs.contentSelector = contentSelector; // Make option available for reinit

		publicAPIs.destroy = function() {
			if(publicAPIs.hasOwnProperty('observer')) {
				publicAPIs.observer.disconnect();
			}

			publicAPIs.deactivateAllLinks();
		}

		publicAPIs.reinit = function() {
			publicAPIs.destroy();

			const contents = [...document.querySelectorAll(publicAPIs.contentSelector)];
			runMagellan(contents);
		}

		publicAPIs.init = function(contentSelector, linkSelector, options) {
			settings = extend(defaults, options || {});

			publicAPIs.destroy();

			const contents = [...document.querySelectorAll(contentSelector)];
			const links    = [...document.querySelectorAll(linkSelector)];

			if (!contents || !links) return;

			window.addEventListener('load', () => {
				runMagellan(contents);
			});
		}

		publicAPIs.init(contentSelector,linkSelector, options);

		return publicAPIs;
	}

	return BuildMagellan;
})(window, document);

export {Magellan};
