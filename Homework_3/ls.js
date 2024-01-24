'use strict';

export function saveCurrentImageToLocalStorage(imageData, likesCount) {
	const currentImageId = imageData.id;
	const storedImages = JSON.parse(localStorage.getItem('images')) || [];
	const existingImageIndex = storedImages.findIndex(
		image => image.id === currentImageId
	);

	if (existingImageIndex !== -1) {
		storedImages[existingImageIndex].likesCount = likesCount;
	} else {
		storedImages.push({
			...imageData,
			likesCount: likesCount,
		});
	}

	localStorage.setItem('images', JSON.stringify(storedImages));
}

export function getCurrentImageFromLocalStorage(imageId) {
	const storedImages = JSON.parse(localStorage.getItem('images')) || [];
	const currentImage = storedImages.find(image => image.id === imageId);
	return currentImage;
}

export function getDataFromLS() {
	return JSON.parse(localStorage.getItem('images'));
}
