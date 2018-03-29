//--------------------------------------------------------------
// MAGELLAN NAV
//--------------------------------------------------------------
import {extend, removeClassFromAll} from './utils';
import {ScrollTo} from './scrollTo';

/**
 * Magellan
 *
 * @param {String} contentSelector CSS class for Magellan content blocks
 * @param {String} linkSelector CSS class for Magellan links
 * @param {Function} onComplete
 * @param {Object} options
 * @returns null
 */
export const Magellan = (function(contentSelector, linkSelector, options) {
	let defaults = {
		activeLinkClass: 'is-active',
		onEnterViewport: function(content) {},
	}

	// Constructor
	const BuildMagellan = function(contentSelector, linkSelector, options) {
		let publicAPIs = {};
		let settings;

		const runMagellan = function(contents) {

			function createObserver(element) {
				const observerOptions = {
					threshold: 1,
				}

				const observer = new IntersectionObserver(handleIntersect, observerOptions);

				observer.observe(element);
			}

			function handleIntersect(entries, observer) {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const content = entry.target;

						publicAPIs.deactivateAllLinks();
						activateContentsLink(content);

						// Callback
						settings.onEnterViewport(content);
					}
				});
			}

			contents.map(content => {
				createObserver(content);
			});
		}

		const activateContentsLink = function(content) {
			const contendID = content.getAttribute('id');
			const activeItem = document.querySelector(`[href="#${contendID}"]`);

			if (!activeItem) return;
			activeItem.classList.add(settings.activeLinkClass);
		}

		// Public API
		publicAPIs.deactivateAllLinks = function() {
			const links = [...document.querySelectorAll(linkSelector)];
			removeClassFromAll(links, settings.activeLinkClass);
		}

		publicAPIs.destroy = function() {

		}

		publicAPIs.init = function(options) {
			settings = extend(defaults, options || {});

			const contents = [...document.querySelectorAll(contentSelector)];
			const links    = [...document.querySelectorAll(linkSelector)];

			if (!contents || !links) return;

			window.addEventListener('load', () => {
				runMagellan(contents);
			});

			const handleClicks = new ScrollTo(linkSelector);
		}

		publicAPIs.init(options);

		return publicAPIs;
	}

	return BuildMagellan;
})(window, document);
