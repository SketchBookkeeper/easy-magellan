//--------------------------------------------------------------
// MAGELLAN NAV
//--------------------------------------------------------------
import {extend, removeClassFromAll, updateHash} from './utils';
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
		updateHashOnScroll: true,
		rootMargin: '0px', //TODO group observer options in object
		root: null,
		threshold: 1,
	}

	// Constructor
	const BuildMagellan = function(contentSelector, linkSelector, options) {
		let publicAPIs = {};
		let settings;

		const runMagellan = function(contents) {

			// TODO separate this out
			function createObserver(element) {
				const observerOptions = {
					root: settings.root,
					rootMargin: settings.rootMargin,
					threshold: settings.threshold,
				}

				const observer = new IntersectionObserver(handleIntersect, observerOptions);

				observer.observe(element);
			}

			function handleIntersect(entries, observer) {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const content = determineActiveContent(contents);

						if (!content) return;

						publicAPIs.deactivateAllLinks();
						activateContentsLink(content);

						if (settings.updateHashOnScroll && 'id' in content === true) {
							updateHash(`#${content.id}`);
						}
					}
				});
			}

			contents.map(content => {
				createObserver(content);
			});
		}

		const determineActiveContent = function(contents) {
			const windowTop = window.scrollY;

			for (let i = 0; i < contents.length; i++) {
				if (contents[i].offsetTop >= windowTop) {
					return contents[i];
				}
			}

			return false;
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

		publicAPIs.contentSelector = contentSelector; // Make option available for reinit

		publicAPIs.reinit = function() {
			const contents = [...document.querySelectorAll(publicAPIs.contentSelector)];
			runMagellan(contents);
		}

		publicAPIs.init = function(contentSelector, linkSelector, options) {
			settings = extend(defaults, options || {});

			const contents = [...document.querySelectorAll(contentSelector)];
			const links    = [...document.querySelectorAll(linkSelector)];

			if (!contents || !links) return;

			window.addEventListener('load', () => {
				runMagellan(contents);
			});

			const handleClicks = new ScrollTo(linkSelector);
		}

		publicAPIs.init(contentSelector,linkSelector, options);

		return publicAPIs;
	}

	return BuildMagellan;
})(window, document);
