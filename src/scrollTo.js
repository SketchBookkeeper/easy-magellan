import {updateHash} from './utils';

/**
 * ScrollTo
 *
 * @param {String} linkSelector CSS class of links to watch for animated scroll
 * @returns null
 */
export const ScrollTo = (function(linkSelector) {
	const BuildScrollTo = function(linkSelector) {
		let publicAPIs = {};

		const animateScrollTo = function(destination) {
			const destinationToScrollTo = destination.offsetTop;

			if ('scrollTo' in window === false) {
				window.scroll(0,destinationToScrollTo);
				return;
			}

			window.scrollTo({
				'behavior': 'smooth',
				'top': destinationToScrollTo,
			});
		}

		const runAnimateScrollTo = function(event) {
			if (!event.target.matches(linkSelector)) return;
			event.preventDefault();

			const contentID = String(event.target.getAttribute('href'));
			const content = document.querySelector(contentID);
			if(!content) return;

			animateScrollTo(content);
			updateHash(contentID);
		}

		publicAPIs.init = function(linkSelector) {
			document.addEventListener('click', runAnimateScrollTo, false);
		}

		publicAPIs.destroy = function() {
			document.removeEventListener('click', runAnimateScrollTo);
		}

		publicAPIs.init(linkSelector);

		return publicAPIs;
	}

	return BuildScrollTo;
})(window, document)
