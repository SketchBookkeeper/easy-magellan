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

		const runAnimateScrollTo = function() {
			if (!event.target.matches(linkSelector)) return;
			event.preventDefault();

			let contentID = String(event.target.getAttribute('href'));
			contentID = contentID.replace('#', '');

			let content = document.getElementById(contentID);
			if(!content) return;

			animateScrollTo(content);
		}

		publicAPIs.init = function(linkSelector) {
			document.addEventListener('click', () => {
				runAnimateScrollTo();
			}, false);
		}

		publicAPIs.init(linkSelector);

		return publicAPIs;
	}

	return BuildScrollTo;
})(window, document)
