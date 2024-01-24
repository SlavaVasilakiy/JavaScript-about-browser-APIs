import { token } from './token.js';

export async function loadData() {
	try {
		const url = `https://api.unsplash.com/photos/?page=1&per_page=20&client_id=${token}`;

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		const imageUrls = data.map(element => element.urls.small);

		if (imageUrls.length === 0) {
			throw new Error(`No images found in the response`);
		}

		return imageUrls;
	} catch (error) {
		console.error('Error while loading data:', error.message);
		throw error;
	}
}
