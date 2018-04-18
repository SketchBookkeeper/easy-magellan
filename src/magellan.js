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
export const Magellan = (function(contentSelector, linkSelector, options) {
	let defaults = {
		activeLinkClass: 'is-active',
		intersectionObserverOptions: {
			rootMargin: '0px',
			root: null,
			threshold: 1
		},
	}

	// Constructor
	const BuildMagellan = function(contentSelector, linkSelector, options) {
		let publicAPIs = {};
		let settings;

		publicAPIs.observe = null;
		publicAPIs.contentItems = [];

		// Private Methods
		function runMagellan(contents) {
			publicAPIs.contentItems = setupItems(contents);
			createObserver(contents);
		}

		function setupItems(contents) {
			return contents.map(content => {
				return content = {target: content, bottom: Math.round(content.offsetTop + content.offsetHeight)};
			})
		}

		function getActiveItem() {
			const scrollPosition = window.pageYOffset;
			const itemsArrayLength = publicAPIs.contentItems.length;

			for(let i = 0; i < itemsArrayLength; i++) {
				if (publicAPIs.contentItems[i].bottom >= scrollPosition) {
					return publicAPIs.contentItems[i].target;
					break;
				}
			}

			return false;
		}

		function setActiveLink() {
			const activeItem = getActiveItem();
			if (!activeItem) return;

			publicAPIs.deactivateAllLinks();
			activateContentsLink(activeItem.id);
		}

		function createObserver(contents) {
			const observer = new IntersectionObserver(setActiveLink, settings.intersectionObserverOptions);

			contents.forEach(content => {
				observer.observe(content);
			});

			return publicAPIs.observer = observer;
		}

		/**
		* Activate Content Link
		* Add active link class to the link tag the corresponds with the Megallan content passed
		*/
		function activateContentsLink(contentID) {
			const activeItem = document.querySelector(`[href="#${contentID}"]`);

			if (!activeItem) return;
			activeItem.classList.add(settings.activeLinkClass);
		}

		function handleResize() {
			const contents = [...document.querySelectorAll(contentSelector)];
			setupItems(contents);
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

			window.removeEventListener('resize', handleResize);
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
			if (!contents) return;

			window.addEventListener('load', () => {
				runMagellan(contents);
			});

			window.addEventListener('resize', handleResize);
		}

		publicAPIs.init(contentSelector,linkSelector, options);

		return publicAPIs;
	}

	return BuildMagellan;
})(window, document);
