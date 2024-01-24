'use strict';

import {token} from './token.js'

export async function loadData() {
	try {
		const url = `https://api.unsplash.com/photos/?page=1&per_page=10&client_id=${token}`;

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		if (!data || data.length === 0) {
			throw new Error(`No images found in the response`);
		}

		const formattedData = data.map(e => ({
			id: e.id,
			img_description: e.description || 'Some description',
			img_url: e.urls.small,
			user_name: e.user.name || 'Anonymous',
			user_image: e.user.profile_image.medium,
			user_bio: e.user.bio || 'Some bio',
		}));

		return formattedData;
	} catch (error) {
		console.error('Error while loading data:', error.message);
		throw error;
	}
}
