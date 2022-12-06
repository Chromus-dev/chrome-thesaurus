'use strict';

const SINGLE_WORD_REGEX = /^[A-Za-z]+$/;
const MAX_RESULTS = 9;
const PER_TYPE = {
	1: MAX_RESULTS,
	2: 4,
	3: 3,
	4: 2,
};

// * implement cache system
let cache = {
	selectedWords: [],
	synonyms: {},
};

chrome.runtime.onInstalled.addListener(() => {
	createMainMenu();
});

let synonymsForSelected = [];
let lastAmountOfSyns;
let lastSelected;

chrome.contextMenus.onClicked.addListener((clickData, tab) => {
	console.log('uionsdfgiundsfg');
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	// console.log(msg);

	// reset context menus
	synonymsForSelected = [];

	if (
		msg.selection &&
		SINGLE_WORD_REGEX.test(msg.selection) &&
		msg.selection !== '' &&
		msg.selection != lastSelected
	) {
		console.log(msg);
		fetch(
			`https://words.bighugelabs.com/api/2/7b753b239569335bfa21ad7ca313df1a/${msg.selection}/json`
		)
			.then((r) => r.json())
			.then((json) => {
				let amountOfTypes = Object.keys(json).length;

				// define i outside of loop because
				let i = 0;

				Object.values(json).forEach((type) => {
					while (i < PER_TYPE[amountOfTypes]) {
						let syns = type.syn;
						synonymsForSelected.push(syns[i]);
						// console.log(syns);
						chrome.contextMenus.update(
							`synonym${i}`,
							{
								title: syns[i],
							},
							() => {
								if (chrome.runtime.lastError)
									console.log(chrome.runtime.lastError);
							}
						);

						i++;
					}
				});

				lastAmountOfSyns = synonymsForSelected.length;
			})
			.then(() => console.log(synonymsForSelected));
	}
});

function createMainMenu() {
	// parent menu
	chrome.contextMenus.create(
		{
			id: 'showSynonyms',
			title: "Synonyms for '%s'",
			contexts: ['selection'],
			type: 'normal',
		},
		() => {
			// console.log(chrome.contextMenus)
			if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
		}
	);
	// children placeholders
	for (let i = 0; i < MAX_RESULTS; i++) {
		chrome.contextMenus.create(
			{
				id: `synonym${i}`,
				title: 'placeholder',
				contexts: ['selection'],
				type: 'normal',
				parentId: 'showSynonyms',
			},
			() => {
				// console.log(chrome.contextMenus)
				if (chrome.runtime.lastError)
					console.log(chrome.runtime.lastError);
			}
		);
	}
}
