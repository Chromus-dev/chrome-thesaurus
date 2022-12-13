// https://stackoverflow.com/questions/33217344/chrome-extension-contextmenus-create-title-property-validator
document.addEventListener('selectionchange', (e) => {
	chrome.runtime.sendMessage({ name: 'selectionUpdated', data: getSelection().toString().trim() });
});
chrome.runtime.onMessage.addListener(async (msg) => {
	if(msg.name === 'copyToClipboard'){
		await navigator.clipboard.writeText(msg.data);
	}
})
