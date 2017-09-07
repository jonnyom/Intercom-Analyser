var w = window;
var d = document;
var receivedBkgMessage = false;
var receivedIntMessage = false;
var intercomData;
var details;

function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		if(request.message === "from_bkg_intercomInfo"){
			receivedBkgMessage = true;
			details = request.details;
			
		}
	}
);

if(receivedBkgMessage){
	console.log(intercomData);
	chrome.runtime.sendMessage({message: "From Content", intercomData: intercomData});
}

chrome.runtime.onMessage.addListener(
	function (msg, sender, response) {
  		if ((msg.from === 'popup') && (msg.subject === 'populate')) {
  			console.log("Received Popup Message to Content");
    		chrome.runtime.sendMessage({message: "content"});
  		}
	}
);

// updateBtn.addEventListener("click", function(){
// 	console.log("clicked");   
//     injectScript( chrome.extension.getURL('inject.js'), 'body');
// });