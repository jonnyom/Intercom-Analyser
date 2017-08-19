function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}
var receivedMessage = false;

// content.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  	console.log(request.message);
	    if( request.message === "clicked_browser_action" && receivedMessage==false) {
	    	receivedMessage=true;
	      	console.log("message received: " + receivedMessage);
		    injectScript( chrome.extension.getURL('inject.js'), 'body');
		    console.log("getting url...");
	    }
	}
);
