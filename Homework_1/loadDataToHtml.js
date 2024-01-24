'use strict';

function createTableCell(text, className) {
	const cell = document.createElement('td');
	cell.textContent = text;
	if (className) {
		cell.classList.add(className);
	}
	return cell;
}

function createButton(text, clickHandler, isDisabled = false) {
	const button = document.createElement('button');
	button.textContent = text;
	button.addEventListener('click', clickHandler);
	button.disabled = isDisabled;
	return button;
}

function addRowToTable(tableBody, rowData) {
	const row = document.createElement('tr');

	row.setAttribute('data-id', rowData.id);
	row.appendChild(createTableCell(rowData.name));
	row.appendChild(createTableCell(rowData.time));
	row.appendChild(
		createTableCell(rowData.maxParticipants, `max-participants${rowData.id}`)
	);
	row.appendChild(
		createTableCell(
			rowData.currentParticipants,
			`current-participants${rowData.id}`
		)
	);

	let signUpButtonState = JSON.parse(
		localStorage.getItem(`classes-${rowData.id}-signup-state`)
	);
	let cancelButtonState = JSON.parse(
		localStorage.getItem(`classes-${rowData.id}-cancel-state`)
	);

	if (
		!signUpButtonState &&
		rowData.currentParticipants >= rowData.maxParticipants
	) {
		signUpButtonState = true;
		cancelButtonState = true;
	}
	if (!cancelButtonState && !signUpButtonState) {
		cancelButtonState = true;
	}

	const signUpButton = createButton(
		'Записаться',
		() => {
			signUpButton.disabled = true;
			cancelSignUpButton.disabled = false;
			switchState(signUpButton, cancelSignUpButton, rowData.id);
			const currentParticipants = document.querySelector(
				`.current-participants${rowData.id}`
			);
			currentParticipants.textContent =
				'' + (+currentParticipants.textContent + 1);
			const currentClass = storedDataJson.find(item => item.id === rowData.id);
			currentClass.currentParticipants = +currentParticipants.textContent;
			localStorage.setItem('classes', JSON.stringify(storedDataJson));
		},
		signUpButtonState
	);
	localStorage.setItem(
		`classes-${rowData.id}-signup-state`,
		JSON.stringify(signUpButton.disabled)
	);

	const cancelSignUpButton = createButton(
		'Отменить запись',
		() => {
			signUpButton.disabled = false;
			cancelSignUpButton.disabled = true;
			switchState(signUpButton, cancelSignUpButton, rowData.id);
			const currentParticipants = document.querySelector(
				`.current-participants${rowData.id}`
			);
			currentParticipants.textContent =
				'' + (+currentParticipants.textContent - 1);
			const currentClass = storedDataJson.find(item => item.id === rowData.id);
			currentClass.currentParticipants = +currentParticipants.textContent;
			localStorage.setItem('classes', JSON.stringify(storedDataJson));
		},
		cancelButtonState
	);
	localStorage.setItem(
		`classes-${rowData.id}-cancel-state`,
		JSON.stringify(cancelSignUpButton.disabled)
	);

	function switchState(button1, button2, id) {
		if (button1.disabled) {
			localStorage.setItem(`classes-${id}-signup-state`, 'true');
			localStorage.setItem(`classes-${id}-cancel-state`, 'false');
		} else {
			localStorage.setItem(`classes-${id}-signup-state`, 'false');
			localStorage.setItem(`classes-${id}-cancel-state`, 'true');
		}
	}
	signUpButton.setAttribute('data-signUpButtonid', rowData.id);
	cancelSignUpButton.setAttribute('data-cancelButtonid', rowData.id);

	const actionCell = document.createElement('td');
	actionCell.appendChild(signUpButton);
	actionCell.appendChild(cancelSignUpButton);
	row.appendChild(actionCell);

	tableBody.appendChild(row);
}

function displayDataOnPage(data) {
	const tableBody = document.querySelector('.classes-data');

	tableBody.innerHTML = '';

	data.forEach(rowData => {
		addRowToTable(tableBody, rowData);
	});
}

import { loadDataToStorage } from './loadClassesData.js';

const storedDataString = localStorage.getItem('classes');
let storedDataJson = JSON.parse(storedDataString);

if (!storedDataJson) {
	loadDataToStorage()
		.then(() => {
			const updatedDataString = localStorage.getItem('classes');
			storedDataJson = JSON.parse(updatedDataString);
			displayDataOnPage(storedDataJson);
		})
		.catch(error => {
			console.error(error);
		});
} else {
	displayDataOnPage(storedDataJson);
}
