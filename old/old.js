// Background

// I think that the checkRequest guy is literally just going to go 
// "Cool that's a request thanks a mil here are the deets" for every single request.
// Need to add some functionality to check for specific requests that are coming from intercom
// AND need to make sure that they're hitting specific status updates i.e. they aren't fucking up

var receivedCntMessage = false;
var w = window;
var details;
var c = chrome.webRequest;
var callback;
var filter = {urls: ["*://*.intercom.io/*"]};
var opt_extraInfoSpec = ["blocking", "requestBody"];

function ensureSendMessage(tabId, message, callback){
  	chrome.tabs.sendMessage(tabId, {ping: true}, function(response){
    	if(response && response.pong) { // Content script ready
    		console.log("script ready");
      		chrome.tabs.sendMessage(tabId, message, callback);
  		} else { // No listener on the other end
    		console.log("Script not ready");
      		chrome.tabs.executeScript(tabId, {file: "content.js"}, function(){
	        	if(chrome.runtime.lastError) {
	          	console.error(chrome.runtime.lastError);
	          	throw Error("Unable to inject script into tab " + tabId);
	        }
	        // OK, now it's injected and ready
	        chrome.tabs.sendMessage(tabId, message, callback);
      		});
    	}
	});
}

function checkMethod(){
	console.log("In checkMethod");
	chrome.webRequest.onBeforeRequest.addListener(function (details){
		console.log("in onBeforeRequest");
		if(details.method=="POST"){
			console.log(details["requestBody"]["formData"]["i"]);
		}
		
	}, filter, opt_extraInfoSpec);
}

function checkRequest(){
	console.log("Checking request");
	chrome.webRequest.onCompleted.addListener(
		callback, filter), ["responseHeaders"];	
}

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	// Send a message to the active tab
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var activeTab = tabs[0];
		ensureSendMessage(activeTab.id, {"message": "clicked_browser_action"});
	});
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	  	console.log(request.message);
	    if( request.message === "FROM_CONTENT" && receivedCntMessage==false) {
	    	receivedCntMessage = true;
			console.log(`content message received: ${receivedCntMessage}`);
			console.log("Sending message back to content...");
		    callback = 
		    checkRequest();
		    console.log("Checking form data");
		    checkMethod();
	    }
	}
);