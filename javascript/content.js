var w = window;
var d = document;
var receivedBkgMessage = false;
var receivedIntMessage = false;

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
	    if( request.message === "check_for_update" && receivedBkgMessage===false) {
	    	console.log("Received Message from Background");
	    	receivedBkgMessage=true;
	      	console.log(`message received: ${receivedBkgMessage}`);
		    injectScript( chrome.extension.getURL('javascript/inject.js'), 'body');
		    console.log("getting url...");
		    sendResponse({pong: true});
	    }
	}
);

chrome.extension.onMessage.addListener(function(message){
	if(message.message === "intercomsettings_data"){
		chrome.runtime.sendMessage({message: "intercomsettings_data_content",
			intercomData: message.intercomData});
	}
});

//if the html hasn't yet been populated query the background file again to try and get the information
// keep polling the background file until the information has been received
// display some sort of loading screen while the html page doesn't load properly
// profit