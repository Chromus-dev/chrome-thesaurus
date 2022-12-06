// https://stackoverflow.com/questions/33217344/chrome-extension-contextmenus-create-title-property-validator
document.addEventListener('selectionchange', (e) => {
	chrome.runtime.sendMessage({ selection: getSelection().toString().trim() });
});
