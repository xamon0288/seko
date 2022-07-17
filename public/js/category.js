let randomValue = JSON.parse(sessionStorage.department);
const navigation = document.querySelector('.swipper__buttons');
const mainCard = document.querySelector('.swiper-slide-block-category-text');
const mainImg = document.querySelector('.swiper-slide-block-category-img');
let objectIdsUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${randomValue}`;
const artUrl =
	'https://collectionapi.metmuseum.org/public/collection/v1/objects/';
let objectIds = [];
export let artArr = [];
let artUrlArr = [];
export let currIndex = 0;
let max = 0;

const getIds = async url => {
	const response = await fetch(url);
	const ids = await response.json();

	objectIds = ids.objectIDs.sort(() => 0.5 - Math.random()).slice(0, 70);
};

const getArtUrls = async () => {
	for (const id of objectIds) {
		artUrlArr.push(`${artUrl}${id}`);
	}
};

const getArt = async url => {
	const response = await fetch(url);
	const art = await response.json();
	if (
		!artArr.some(e => e.objectID == art.objectID) &&
		art.primaryImage !== ''
	) {
		artArr.push(art);
		artUrlArr.splice(0, 1);
	} else {
		artUrlArr.splice(0, 1);
		await getData(objectIdsUrl);
	}
};

const getData = async url => {
	if (artUrlArr.length === 0) {
		await getIds(url);
		await getArtUrls();
	}
	await getArt(artUrlArr[0]);
};

// Render Logic
let counter = 0;
const imgLoop = (url, def = '', id) => {
	const newDiv = document.createElement('div');
	newDiv.classList.add('slider-item');
	if (def === 'primaryImage') {
		newDiv.classList.add('active');
		mainImg.innerHTML = `
			<ol class="slide-indicators">                     
			</ol>`;
	} else if (def === '' && counter === 0) {
		// Navigation
		const spanLeft = document.createElement('span');
		const spanRight = document.createElement('span');
		spanLeft.classList.add('slider-control-prev');
		spanRight.classList.add('slider-control-next');
		spanLeft.setAttribute('role', 'button');
		spanRight.setAttribute('role', 'button');

		const iLeft = document.createElement('i');
		const iRight = document.createElement('i');
		iLeft.classList.add(`fa-solid`);
		iLeft.classList.add(`fa-chevron-left`);
		iRight.classList.add('fa-solid');
		iRight.classList.add('fa-chevron-right');

		spanLeft.appendChild(iLeft);
		spanRight.appendChild(iRight);
		mainImg.appendChild(spanLeft);
		mainImg.appendChild(spanRight);
		counter++;
	}
	const anchorTag = document.createElement('a');

	// ANCHORS AND ATTRIBUTES
	anchorTag.setAttribute('href', url);
	anchorTag.setAttribute('data-lightbox', id);

	// IMG AND ATTRIBUTES
	const newImg = document.createElement('img');
	newImg.setAttribute('src', url);
	newImg.setAttribute('alt', `${artArr[currIndex].objectName}}`);

	// LIS AND ATTRIBUTES
	const ind = document.querySelector('.slide-indicators');
	const newLis = document.createElement('li');
	newLis.classList.add('slide-indicator');

	// APPENDING
	anchorTag.appendChild(newImg);
	newDiv.appendChild(anchorTag);
	mainImg.appendChild(newDiv);
	ind.appendChild(newLis);
};

const render = () => {
	mainCard.innerHTML = `
		<div class="title__container">
			<h2 class="main--title tac">${artArr[currIndex].title}</h2>
		</div>
		<div class="details__container">
		<h3 class="main--artist tae">${
			artArr[currIndex].artistDisplayName
		} <span class="dates">(${artArr[currIndex].artistBeginDate} - ${
		artArr[currIndex].artistEndDate
	})</span></h3>
		<p class="main--period"><span class="label">Period</span>: ${
			artArr[currIndex].period
		}</p>
		<p class="main--culture"><span class="label">Culture</span>: ${
			artArr[currIndex].culture
		}</p>
		<p class="main--medium"><span class="label">Medium:</span> ${
			artArr[currIndex].medium
		}</p>
		<p class="main--dimensions"><span class="label">Dimensions:</span> ${
			artArr[currIndex].dimensions
		}</p>
		<p class="main--classification"><span class="label">Classification:</span> ${
			artArr[currIndex].classification
		}</p>
		<p class="main--repository tae"><span class="label">Repository: </span> ${
			artArr[currIndex].repository
		}</p>
		<p class="main--department tae"><span class="label">Department:</span> <a href="" target="_blank""> ${
			artArr[currIndex].department
		}</a></p>
		<p class="main--obj"><a href="${
			artArr[currIndex].objectURL
		}" target="_blank">More Info</a><hr> </p>
		<form action="/favorites" method="post">
			<button type="submit" id="submit__btn"><i class="fa-regular fa-heart"></i></button>
		</form>
	</div>
	<span class="main--number">${currIndex + 1}</span>
		`;

	imgLoop(
		artArr[currIndex].primaryImage,
		'primaryImage',
		artArr[currIndex].objectID
	);
	if (artArr[currIndex].additionalImages.length > 0) {
		for (let add of artArr[currIndex].additionalImages) {
			imgLoop(add, '', artArr[currIndex].objectID);
		}
		counter = 0;
	}
};

const preloader = document.querySelector('.preloader__container');

const loadFunc = async url => {
	preloader.classList.add('flex');
	if (artArr.length < currIndex + 1) {
		await getData(objectIdsUrl);
		sessionStorage.setItem('artCategory', JSON.stringify(artArr));
		sessionStorage.setItem('indexCategory', JSON.stringify(currIndex));
	}
	render();

	preloader.classList.remove('flex');
};

navigation.addEventListener('click', async e => {
	if (e.target.classList.contains('fa-long-arrow-right')) {
		preloader.classList.add('flex');
		if (artArr.length !== 0) {
			currIndex++;
		}

		if (artArr.length < currIndex + 1) {
			await getData(objectIdsUrl);
			sessionStorage.setItem('artCategory', JSON.stringify(artArr));
			sessionStorage.setItem('indexCategory', JSON.stringify(currIndex));
		}

		render();
		preloader.classList.remove('flex');
	}

	if (e.target.classList.contains('fa-long-arrow-left') && currIndex > 0) {
		currIndex--;
		preloader.classList.add('flex');
		sessionStorage.setItem('indexCategory', JSON.stringify(currIndex));

		render();
		preloader.classList.remove('flex');
	}
});

//
// keyboard press
//
document.addEventListener('keydown', async e => {
	if (e.keyCode === 39) {
		preloader.classList.add('flex');
		if (artArr.length !== 0) {
			currIndex++;
		}

		if (artArr.length < currIndex + 1) {
			await getData(objectIdsUrl);
			sessionStorage.setItem('artCategory', JSON.stringify(artArr));
			sessionStorage.setItem('indexCategory', JSON.stringify(currIndex));
		}

		render();
		preloader.classList.remove('flex');
	}

	if (e.keyCode === 37 && currIndex > 0) {
		currIndex--;
		preloader.classList.add('flex');
		sessionStorage.setItem('indexCategory', JSON.stringify(currIndex));

		render();
		preloader.classList.remove('flex');
	}
});

//
// Finger Swipe
//
let touchstartX;
let touchendX;

document.querySelector('body').addEventListener(
	'touchstart',
	function (event) {
		touchstartX = event.changedTouches[0].screenX;
	},
	false
);

document.querySelector('body').addEventListener(
	'touchend',
	function (event) {
		touchendX = event.changedTouches[0].screenX;
		handleGesture();
	},
	false
);

async function handleGesture() {
	if (touchendX < touchstartX) {
		currIndex--;
		preloader.classList.add('flex');
		sessionStorage.setItem('indexCategory', JSON.stringify(currIndex));

		render();
		preloader.classList.remove('flex');
	}
	if (touchendX > touchstartX) {
		preloader.classList.add('flex');
		if (artArr.length !== 0) {
			currIndex++;
		}

		if (artArr.length < currIndex + 1) {
			await getData(objectIdsUrl);
			sessionStorage.setItem('artCategory', JSON.stringify(artArr));
			sessionStorage.setItem('indexCategory', JSON.stringify(currIndex));
		}

		render();
		preloader.classList.remove('flex');
	}
}

window.onload = async function () {
	if (sessionStorage.artCategory) {
		artArr = JSON.parse(sessionStorage.artCategory);
		currIndex = JSON.parse(sessionStorage.indexCategory);
		await loadFunc();
	} else {
		await loadFunc();
	}
};
