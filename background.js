'use strict';

let selectedText;

// https://stackoverflow.com/questions/33217344/chrome-extension-contextmenus-create-title-property-validator
// https://stackoverflow.com/questions/25107774/how-do-i-send-an-http-get-request-from-a-chrome-extension

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create(
		{
			id: 'showSynonyms',
			title: 'Synonyms for \'%s\'',
			contexts: ['selection'],
			type: 'normal',
		},
		() => {
			console.log(chrome.contextMenus)
			if (chrome.runtime.lastError) console.log(chrome.runtime.lastError)
		}
	);
	for(let i = 0; i < 5; i++){
		chrome.contextMenus.create({
			id: `synonym${i}`,
			title: '%s',
			contexts: ['selection'],
			type: 'normal',
			parentId: 'showSynonyms'
		},
		() => {
			// console.log('%s')
			if (chrome.runtime.lastError) console.log(chrome.runtime.lastError)
		})
	}
});

chrome.contextMenus.onClicked.addListener((clickData) => {
	console.log(clickData);
});
