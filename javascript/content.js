function injectScript(file, node) {
    let th = document.getElementsByTagName(node)[0];
    let s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}

// content.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	    if( request.message === "update") {
		    injectScript(chrome.extension.getURL('javascript/functions/update.js'), 'body');
		    sendResponse({pong: true});
	    }
	}
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "shutdown") {
            injectScript(chrome.extension.getURL('javascript/functions/shutdown.js'), 'body');
            sendResponse({pong: true});
        }
    }
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "boot") {
            injectScript(chrome.extension.getURL('javascript/functions/boot.js'), 'body');
            sendResponse({pong: true});
        }
    }
);