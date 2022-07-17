const departments = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18];
let randomValue = departments[Math.floor(Math.random() * departments.length)];
let objectIdsUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${randomValue}`;
const artUrl =
	'https://collectionapi.metmuseum.org/public/collection/v1/objects/';
let objectIds = [];
export let artArr = [];
let artUrlArr = [];
let departmentValue;
export let currIndex = 0;
let max = 0;

const getIds = async url => {
	const response = await fetch(url);
	const ids = await response.json();

	objectIds = ids.objectIDs.sort(() => 0.5 - Math.random()).slice(0, 70);
	departmentValue = randomValue;
	console.log(objectIds);
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
			console.log(counter);
		}
		counter = 0;
	}
};

const preloader = document.querySelector('.preloader__container');
const sectionSlider = document.querySelector('.section__slider');

const loadFunc = async url => {
	preloader.classList.add('flex');
	sectionSlider.classList.add('dspn');
	if (artArr.length < currIndex + 1) {
		await getData(objectIdsUrl);
		let here = new URL(window.location.href);
		console.log(here);
		here.searchParams.append('id', `${artArr[currIndex].objectID}`);
		sessionStorage.setItem('art', JSON.stringify(artArr));
		sessionStorage.setItem('index', JSON.stringify(currIndex));
	}
	render();

	preloader.classList.remove('flex');
	sectionSlider.classList.remove('dspn');
};

const navigation = document.querySelector('.swipper__buttons');
const mainCard = document.querySelector('.swiper-slide-block-text');
const mainImg = document.querySelector('.swiper-slide-block-img');

navigation.addEventListener('click', async e => {
	if (e.target.classList.contains('fa-long-arrow-right')) {
		sectionSlider.classList.add('dspn');
		preloader.classList.add('flex');
		if (artArr.length !== 0) {
			currIndex++;
		}

		if (artArr.length < currIndex + 1) {
			await getData(objectIdsUrl);
			sessionStorage.setItem('art', JSON.stringify(artArr));
			sessionStorage.setItem('index', JSON.stringify(currIndex));
		}

		render();
		preloader.classList.remove('flex');
		sectionSlider.classList.remove('dspn');
	}

	if (e.target.classList.contains('fa-long-arrow-left') && currIndex > 0) {
		currIndex--;
		sectionSlider.classList.add('dspn');
		preloader.classList.add('flex');
		sessionStorage.setItem('index', JSON.stringify(currIndex));

		render();
		preloader.classList.remove('flex');
		sectionSlider.classList.remove('dspn');
	}
});

//
// keyboard press
//
document.addEventListener('keydown', async e => {
	if (e.keyCode === 39) {
		sectionSlider.classList.add('dspn');
		preloader.classList.add('flex');
		if (artArr.length !== 0) {
			currIndex++;
		}

		if (artArr.length < currIndex + 1) {
			await getData(objectIdsUrl);
			sessionStorage.setItem('art', JSON.stringify(artArr));
			sessionStorage.setItem('index', JSON.stringify(currIndex));
		}

		render();
		preloader.classList.remove('flex');
		sectionSlider.classList.remove('dspn');
	}

	if (e.keyCode === 37 && currIndex > 0) {
		currIndex--;
		preloader.classList.add('flex');
		sectionSlider.classList.add('dspn');
		sessionStorage.setItem('index', JSON.stringify(currIndex));

		render();
		preloader.classList.remove('flex');
		sectionSlider.classList.remove('dspn');
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
		sectionSlider.classList.add('dspn');
		sessionStorage.setItem('index', JSON.stringify(currIndex));

		render();
		preloader.classList.remove('flex');
		sectionSlider.classList.remove('dspn');
	}
	if (touchendX > touchstartX) {
		preloader.classList.add('flex');
		sectionSlider.classList.add('dspn');
		if (artArr.length !== 0) {
			currIndex++;
		}

		if (artArr.length < currIndex + 1) {
			await getData(objectIdsUrl);
			sessionStorage.setItem('art', JSON.stringify(artArr));
			sessionStorage.setItem('index', JSON.stringify(currIndex));
		}

		render();
		preloader.classList.remove('flex');
		sectionSlider.classList.remove('dspn');
	}
}

window.onload = async function () {
	if (sessionStorage.art) {
		artArr = JSON.parse(sessionStorage.art);
		currIndex = JSON.parse(sessionStorage.index);
		await loadFunc();
	} else {
		await loadFunc();
	}
};
