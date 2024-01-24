'use strict';

export async function loadDataToStorage() {
	try {
		const response = await fetch('./classes.json');

		if (!response.ok) {
			throw new Error(`Failed to load data from file: ${response.status}`);
		}

		const classesDataJson = await response.json();
		const classesId = 'classes';
		localStorage.setItem(classesId, JSON.stringify(classesDataJson));
	} catch (error) {
		console.error(error.text);
		throw error;
	}
}
