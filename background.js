'use strict';

const SINGLE_WORD_REGEX = /^[A-Za-z]+$/;
const MAX_RESULTS = 8;

// version 1 returns an array
// version 2 returns an object with snys for diff word types
const API_VERSION = 1;

chrome.runtime.onInstalled.addListener(() => {
    createMainParent();
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

chrome.runtime.onMessage.addListener(async(msg, sender, sendResponse) => {
    console.log(msg);
    if (
        msg.selection &&
        SINGLE_WORD_REGEX.test(msg.selection) &&
        msg.selection !== '' &&
        msg.selection != lastSelected) {
        lastSelected = msg.selection

            // console.log(msg);

            // get json of thesaurus results
            const res = await fetch(
'https://words.bighugelabs.com/api/' + API_VERSION + `/7b753b239569335bfa21ad7ca313df1a/${msg.selection}/json`).then(r => r.json());
        createContextMenus(res);
    }
});

function createContextMenus(res) {
	// remove old menus and recreate main parent 'show synonyms'
	chrome.contextMenus.removeAll();
	createMainParent();
	
	console.log('res', res)
	
    // sometimes res will be an array of synonyms instead of an object
    // example word that uses an array: 'answer'
    if (Array.isArray(res)) {
		// remove old menus and recreate main parent 'show synonyms'
		chrome.contextMenus.removeAll();
		createMainParent();
		
        // create menus with first values up to MAX_RESULTS or length of results
		for(let i = 0; i < Math.min(res.length, MAX_RESULTS); i++){
			chrome.contextMenus.create({
				id: `syn${res[i]}`,
				title: res[i],
				contexts: ['selection'],
                type: 'normal',
                parentId: 'showSynonyms'
			})
		}
    } else {
        // otherwise it's an object
        const types = Object.keys(res);

        console.log(types)
        types.forEach((type) => {
            console.log(type)
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
            while (res[type].syn.length > i || i > MAX_RSEULTS) {
                chrome.contextMenus.create({
                    id: `syn${res[type].syn[i]}`,
                    title: res[type].syn[i],
                    contexts: ['selection'],
                    type: 'normal',
                    parentId: type
                });
				i++;
            }
        })
    }
}

function createMainParent() {
    // parent menu
    chrome.contextMenus.create({
        id: 'showSynonyms',
        title: "Synonyms for '%s'",
        contexts: ['selection'],
        type: 'normal',
    },
        () => {
        // console.log(chrome.contextMenus)
        if (chrome.runtime.lastError)
            console.log(chrome.runtime.lastError);
    });
}
