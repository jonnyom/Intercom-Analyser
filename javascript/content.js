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
	  	console.log(request.message);
	    if( request.message === "update") {
	    	console.log("Received Message from Background");
		    injectScript(chrome.extension.getURL('javascript/functions/update.js'), 'body');
		    console.log("Injecting script...");
		    sendResponse({pong: true});
	    }
	}
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request.message);
        if( request.message === "shutdown") {
            console.log("Received Message from Background");
            injectScript(chrome.extension.getURL('javascript/functions/shutdown.js'), 'body');
            console.log("Injecting script...");
            sendResponse({pong: true});
        }
    }
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request.message);
        if( request.message === "boot") {
            console.log("Received Message from Background");
            injectScript(chrome.extension.getURL('javascript/functions/boot.js'), 'body');
            console.log("Injecting script...");
            sendResponse({pong: true});
        }
    }
);