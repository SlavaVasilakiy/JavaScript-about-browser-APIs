'use strict';

import { loadData } from './loaddata.js';
import {
	saveCurrentImageToLocalStorage,
	getCurrentImageFromLocalStorage,
	getDataFromLS,
} from './ls.js';


async function getRandomImage() {
	const images = await loadData();
	const randomIndex = Math.floor(Math.random() * images.length);
	return images[randomIndex];
}

async function initSlide() {
	try {
		const randomImage = await getRandomImage();
		const storedImage = getCurrentImageFromLocalStorage(randomImage.id);
		const imageToDisplay = storedImage || randomImage;
		displayImage(imageToDisplay);
		showHistoryModal();
		if (!storedImage) {
			saveCurrentImageToLocalStorage(randomImage, 0);
		}
	} catch (error) {
		console.error('Error initializing:', error.message);
	}
}

function displayImage(imageData) {
	const slideContainer = document.querySelector('.slide-container');
	const slide = document.querySelector('.slide');
	const imgElement = document.createElement('img');
	let likesCount =
		getCurrentImageFromLocalStorage(imageData.id)?.likesCount || 0;
	const likeBtn = document.createElement('button');
	likeBtn.classList.add('like-btn');
	likeBtn.innerHTML = '&#128150;';

	imgElement.src = imageData.img_url;
	imgElement.setAttribute('alt', imageData.img_description);
	slide.appendChild(imgElement);

	slideContainer.insertAdjacentHTML(
		'beforeend',
		`<div class="likes-container">
      <p class="likes-count">Likes: ${likesCount}</p>
    </div>
    <button type="button" class="show-more-btn">Show info</button>
    <div class="slide-description hidden">
      <p>Author image: <img src="${imageData.user_image}"></p>
      <p>Author Name: <strong>${imageData.user_name}</strong></p>
      <p>Author bio: <strong>${imageData.user_bio}</strong></p>
      <p>Image description: <strong>${imageData.img_description}</strong></p>
    </div>
    `
	);

	const likesCountElement = slideContainer.querySelector('.likes-count');

	function updateLikesCount() {
		likesCountElement.textContent = `Likes: ${likesCount}`;
	}

	likeBtn.addEventListener('click', () => {
		likeBtn.classList.add('liked');
		likesCount++;
		updateLikesCount();
		saveCurrentImageToLocalStorage(imageData, likesCount);
	});

	likeBtn.addEventListener('mouseup', () => {
		setTimeout(() => {
			likeBtn.classList.remove('liked');
		}, 500);
	});

	imgElement.onload = () => {
		const imgWidth = imgElement.offsetWidth;
		slideContainer.style.width = `${imgWidth}px`;
	};

	slide.appendChild(likeBtn);
	const showMoreBtn = document.querySelector('.show-more-btn');
	const slideDescription = document.querySelector('.slide-description');

	showMoreBtn.addEventListener('click', () => {
		if (showMoreBtn.textContent === 'Show info') {
			showMoreBtn.textContent = 'Hide info';
		} else {
			showMoreBtn.textContent = 'Show info';
		}
		slideDescription.classList.toggle('hidden');
	});
}

//================================================================================================================

function showHistoryModal() {
	const showHistoryBtnElement = document.querySelector('.show-history-btn');
	const modalWindowElement = document.querySelector('.modal-window');

	if (!showHistoryBtnElement || !modalWindowElement) {
		console.error('Error: Could not find necessary elements.');
		return;
	}

	const closeHistoryBtn = document.createElement('button');
	closeHistoryBtn.classList.add('close-history-btn');
	closeHistoryBtn.textContent = 'Close history';
	const slideContainerElement = document.querySelector('.slide-container');

	showHistoryBtnElement.addEventListener('click', () => {
		const lsData = getDataFromLS();

		if (!lsData || !lsData.length) {
			console.error('Error: No data found in localStorage.');
			return;
		}

		lsData.forEach(element => {
			const historyImageContainer = document.createElement('div');
			historyImageContainer.classList.add('history-image-container');

			historyImageContainer.insertAdjacentHTML(
				'beforeend',
				`
				<img src="${element.img_url}" alt="${element.img_description}" class="img-id-${element.id}">
				<div class="slide-description">
					<div class="likes-container">
						<p class="likes-count">Likes: ${element.likesCount}</p>
					</div>
					<p>Author image: <img src="${element.user_image}"></p>
					<p>Author Name: <strong>${element.user_name}</strong></p>
					<p>Author bio: <strong>${element.user_bio}</strong></p>
					<p>Image description: <strong>${element.img_description}</strong></p>
				</div>
				`
			);

			const imgElement = historyImageContainer.querySelector('img');

			if (imgElement) {
				imgElement.onload = () => {
					const imgWidth = imgElement.offsetWidth;
					historyImageContainer.style.width = `${imgWidth}px`;
				};
			}

			modalWindowElement.append(closeHistoryBtn, historyImageContainer);
		});

		showHistoryBtnElement.classList.toggle('hidden');
		slideContainerElement.classList.toggle('hidden');
		modalWindowElement.classList.remove('hidden');
	});

	closeHistoryBtn.addEventListener('click', () => {
		modalWindowElement.innerHTML = '';
		modalWindowElement.classList.add('hidden');
		showHistoryBtnElement.classList.toggle('hidden');
		slideContainerElement.classList.toggle('hidden');
	});
}

initSlide();
