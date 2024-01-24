import { loadData } from './loaddata.js';

async function initSlider() {
	try {
		const images = await loadData();

		const slider = document.querySelector('.slider');
		const prevButton = document.querySelector('.prev-button');
		const nextButton = document.querySelector('.next-button');
		const pagination = document.querySelector('.pagination');

		let slideIndex = 0;

		images.forEach((image, index) => {
			const imgElement = document.createElement('img');
			imgElement.src = image;
			imgElement.setAttribute('alt', image);
			slider.appendChild(imgElement);

			const pageNumber = index + 1;
			const paginationItem = document.createElement('span');
			paginationItem.textContent = pageNumber;

			paginationItem.addEventListener('click', () => {
				showImage(index);
				updatePagination(index);
				slideIndex = index;
			});

			pagination.appendChild(paginationItem);
		});

		function showImage(index) {
			const allImages = slider.querySelectorAll('img');
			allImages.forEach((slide, i) => {
				slide.classList.toggle('display-none', i !== index);
			});
		}

		function updatePagination(activeIndex) {
			const allPaginationItems = pagination.querySelectorAll('span');
			allPaginationItems.forEach((item, index) => {
				item.classList.toggle('active', index === activeIndex);
			});
		}

		prevButton.addEventListener('click', showPreviousSlide);
		nextButton.addEventListener('click', showNextSlide);

		function showPreviousSlide() {
			slideIndex = (slideIndex - 1 + images.length) % images.length;
			updateSlider();
			updatePagination(slideIndex);
		}

		function showNextSlide() {
			slideIndex = (slideIndex + 1) % images.length;
			updateSlider();
			updatePagination(slideIndex);
		}

		function updateSlider() {
			const slides = Array.from(slider.querySelectorAll('img'));
			slides.forEach((slide, index) => {
				slide.classList.toggle('display-none', index !== slideIndex);
			});
		}

		updateSlider();
		updatePagination(0);
	} catch (error) {
		console.error('Error initializing slider:', error.message);
	}
}

initSlider();
