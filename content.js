var receivedBkgMessage = false;
var receivedInjMessage = false;
var w = window;

function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}

// content.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  	console.log(request.message);
	    if( request.message === "clicked_browser_action" && receivedBkgMessage==false) {
	    	receivedBkgMessage=true;
	      	console.log(`message received: ${receivedBkgMessage}`);
		    injectScript( chrome.extension.getURL('inject.js'), 'body');
		    console.log("getting url...");
	    }
	}
);