// import { artArr } from './app';
// import { currIndex } from './app';

let artArr = JSON.parse(sessionStorage.art);
let currIndex = JSON.parse(sessionStorage.index);
let addImg = [];

console.log(artArr);
console.log(currIndex);
const leftImg = document.querySelector('.left__img');
const moreRight = document.querySelector('.more__right');
const moreCarousel = document.querySelector('.more__carousel');
const loadData = arr => {
	leftImg.innerHTML = `
        <div class="more__artworkwrapper">
            <img class="object-fit" src="${artArr[currIndex].primaryImage}" alt="${artArr[currIndex].title}">
        </div>
        <div class="more__carousel">
        <div class="more__carousel--nav">
            <p><i class="fa-solid fa-chevron-left"></i></p>
        </div>
	`;

	// `<div class="carousel__pic selected">
	//     <img class="object-fit" src="${art}" alt="${artArr[currIndex].title}">
	// </div>`;

	moreRight.innerHTML = `
    <p class="more__heart favorite__heart"><i class="fa-regular fa-heart"></i></p>
                <div class="container flex--column ml-4 more__container">
                    <h2 class="more__header">DETAILS</h2>
                    <div class="more__description">
                        <p class="more__artist"><span class="bold sm desc">Artist</span>: ${artArr[currIndex].artistDisplayName}</p>
                        <p class="more__bio">${artArr[currIndex].artistDisplayBio}</p>
                        <p class="more__classification"><span class="bold sm desc">Type</span>:${artArr[currIndex].classification}</p>
                    </div>
                    <div class="more__title--group">
                        <h2 class="more__title">${artArr[currIndex].title}</h2>
                        <p class="more__period">${artArr[currIndex].period}</p>
                    </div>
                    <div class="more__info">
                        <p class="more__medium"><span class="bold sm desc">Medium</span>: ${artArr[currIndex].medium}</p>
                        <p class="more__objdates"><span class="bold sm desc">Created</span>: ${artArr[currIndex].objectDate}</p>
                        <p class="more__dimensions"><span class="bold sm desc">Dimensions</span>:   ${artArr[currIndex].dimensions}</p>
                        <p class="more__department"><span class="bold sm desc">Categories</span>: ${artArr[currIndex].department}</p>
                        <a class="more__moreinfo" href="${artArr[currIndex].objectURL}"  target="_blank" rel="noopener noreferrer">More Info</a>
                    </div>
                    <div class="more--read">
                        <a href="/" class="btn btn--big">Home</a>
                    </div>
                </div>
    `;
};

window.onload = function () {
	loadData(artArr);
};
