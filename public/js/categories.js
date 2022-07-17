const categories = document.querySelector('.categories');

categories.addEventListener('click', e => {
	if (e.target.tagName === 'IMG') {
		sessionStorage.setItem(
			'department',
			e.target.parentElement.parentElement.getAttribute('value')
		);
		sessionStorage.setItem('artCategory', '');
		sessionStorage.setItem('indexCategory', '');
	}
});
