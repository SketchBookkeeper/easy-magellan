//--------------------------------------------------------------
// MAGELLAN NAV
//--------------------------------------------------------------

import {extend, removeClassFromAll} from './utils';

//------------------------------
// Animated Scroll To
//------------------------------
function animateScrollTo(destination) {
	const destinationToScrollTo = typeof destination === 'number' ? destination : destination.offsetTop;

	if ('scrollTo' in window === false) {
		window.scroll(0,destinationToScrollTo);
		return;
	}

	window.scrollTo({
		'behavior': 'smooth',
		'top': destinationToScrollTo,
	})
}

function runAnimateScrollTo() {
	if (!event.target.classList.contains('js-magellan-link')) return;
	event.preventDefault();

	let contentID = String(event.target.getAttribute('href'));
	contentID = contentID.replace('#', '');

	let content = document.getElementById(contentID);

	const optionalArgument = parseInt(event.target.dataset.magellanScrollTo);
	if (optionalArgument !== null && optionalArgument >= 0) {
		animateScrollTo(optionalArgument);
		return;
	}

	if(!content) return;

	animateScrollTo(content);
}

document.addEventListener('click', runAnimateScrollTo, false);


//------------------------------
// Magellan
//------------------------------
export const Magellan = (function(contentSelector, linkSelector, options) {
	let defaults = {
		activeLinkClass: 'is-active',
	}

	// Constructor
	const BuildMagellan = function(contentSelector, linkSelector, options) {
		let publicAPIs = {};
		let settings;

		// Private Methods
		const runMagellan = function(contents) {

			function createObserver(element) {
				const options = {
					threshold: 1,
				}

				const observer = new IntersectionObserver(handleIntersect, options);

				observer.observe(element);
			}

			function handleIntersect(entries, observer) {
				entries.forEach(function(entry) {
					if (entry.isIntersecting) {
						publicAPIs.deactivateAllLinks();
						const activeItem = determineActiveContent(contents);
						activateContentsLink(activeItem);
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

		const activateContentsLink =function(content) {
			const contendID = content.getAttribute('id');
			const activeItem = document.querySelector(`[href="#${contendID}"]`);

			if (!activeItem) return;
			activeItem.classList.add(settings.activeLinkClass);
		}

		// Public API
		publicAPIs.deactivateAllLinks = function() {
			const links    = [...document.querySelectorAll(linkSelector)];
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
		}

		publicAPIs.init(options);

		return publicAPIs;
	}

	return BuildMagellan;
})(window, document);
