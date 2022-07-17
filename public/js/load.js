//
// Onload
//
const menu_btn = document.querySelector('.navbar--toggler');
const HamburgerIcon = document.querySelector('.navbar--toggler--icon');
const header = document.querySelector('.navbar__collapse');

menu_btn.addEventListener('click', function () {
	HamburgerIcon.classList.toggle('is-active');
	header.classList.toggle('is-active');
});

const myNav = document.querySelector('.navbar');

window.onscroll = function () {
	'use strict';
	if (
		document.body.scrollTop >= 20 ||
		document.documentElement.scrollTop >= 20
	) {
		myNav.classList.add('scroll');
	} else {
		myNav.classList.remove('scroll');
	}
};

function setNavigation() {
	let current_location = location.pathname.split('/')[1];

	let menu_items = document
		.querySelector('.navbar__nav')
		.getElementsByTagName('a');

	for (let i = 0, len = menu_items.length; i < len; i++) {
		if (
			menu_items[i].getAttribute('href') === `/${current_location}` ||
			(menu_items[i].classList.contains('home') && current_location === '')
		) {
			menu_items[i].className = 'selected';
		}
	}
}

setNavigation();
