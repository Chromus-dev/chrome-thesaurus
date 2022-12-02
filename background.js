'use strict';

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create(
		{
			id: 'showSynonyms',
			title: 'Synonyms for %s',
			contexts: ['selection'],
			type: 'normal',
			onclick: (clickData) => {
				console.log(clickData.selectionText);
			},
		},
		() => console.log(chrome.runtime.lastError)
	);
});

chrome.contextMenus.onClicked.addListener(function (clickData) {
	console.log(clickData.selectionText);
});
