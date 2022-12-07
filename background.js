'use strict';

const SINGLE_WORD_REGEX = /^[A-Za-z]+$/;
const MAX_RESULTS = 8;
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

let oldWordTypes = [];
let lastSelected;

chrome.contextMenus.onClicked.addListener((clickData, tab) => {
	console.log('uionsdfgiundsfg');
	if (clickData.menuItemId == 'noun1') {
		chrome.contextMenus.remove('nouns', () => {
				// console.log(chrome.contextMenus)
				if (chrome.runtime.lastError)
					console.log(chrome.runtime.lastError);
			})
	}
});

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
	console.log(msg);
	if (
		msg.selection &&
		SINGLE_WORD_REGEX.test(msg.selection) &&
		msg.selection !== '' &&
		msg.selection != lastSelected
	) {
		lastSelected = msg.selection
		
		// console.log(msg);
		
		// get json of thesaurus results
		const res = await fetch(
			`https://words.bighugelabs.com/api/2/7b753b239569335bfa21ad7ca313df1a/${msg.selection}/json`
		).then(r => r.json());
		createContextMenus(res);
		console.log(res);
		
		/*
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
		*/
	}
});

function createContextMenus(res){
	const types = Object.keys(res);
	
	// remove old menus but keep the ones that are still used
	oldWordTypes.forEach((oldType) => {
		if(!types.includes(oldType))
			chrome.contextMenus.remove(oldType, () => {
				if (chrome.runtime.lastError)
					console.log(chrome.runtime.lastError);
			})
	});
	
	console.log(types)
	
	types.forEach((type) => {
		
		console.log(type)
		
		if(!oldWordTypes.includes(type)) oldWordTypes.push(type)
			
		// create parent menu
		chrome.contextMenus.create({
			id: type,
			// capitalize first letter and add 's' to the end
			title: type.charAt(0).toUpperCase() + type.slice(1) + 's',
			contexts: ['selection'],
			type: 'normal',
			parentId: 'showSynonyms'
		})
		
		let i = 0;
		while(res[type].syn.length > i || i < MAX_RESULTS){
			chrome.contextMenus.create({
				id: `syn${res[type].syn[i]}`,
				title: res[type].syn[i],
				contexts: ['selection'],
				type: 'normal',
				parentId: type
			})
		}
	})
}

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
}
