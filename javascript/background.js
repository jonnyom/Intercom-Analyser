var ping_filter = {urls: ["*://*.intercom.io/messenger/web/ping"]};
var err_filter = {urls: ["*://*.intrcom.io/*", "*://*.intercom.com/*"]}
var out_extraInfoSpec = ["blocking", "requestBody"];
var statusCode;

var postComplete = false;
var taskComplete = false;

var currentURL = "";

function ensureSendMessage(tabId, message, callback){
  	chrome.tabs.sendMessage(tabId, {ping: true}, function(response){
    	if(response && response.pong) { // Content script ready
      		chrome.tabs.sendMessage(tabId, message, callback);
  		} else { // No listener on the other end
      		chrome.tabs.executeScript(tabId, {file: "javascript/content.js"}, function(){
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

function insertUpdateCall(){
	chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
        var activeTab = tabs[0];
        ensureSendMessage(activeTab.id, {message: "check_for_update"});
	});
}

// chrome.tabs.getCurrent(function(tab){
// 	console.log(`Setting currentURL to: ${tab.url}`);
// 	currentURL = tab.url;
// });


// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
// 	var url;
// 	chrome.tabs.getCurrent(function(tab){
// 		console.log(`Setting currentURL to: ${tab.url}`);
// 		url = tab.url;
// 	});
// 	if(url !== tab.url) {
//         console.log(`Updated tab to a different URL: ${tab.url}. Updating Intercom...`);
//         insertUpdateCall();
//     }else{
// 		console.log("Tab has the same URL");
// 	}
// });
//
// chrome.tabs.onCreated.addListener(function(tab){
// 	console.log("Created a new tab. Updating Intercom...");
// 	insertUpdateCall();
// });

chrome.runtime.onMessage.addListener(function(message){
	if(message.update === "update_intercom"){
		console.log("Asked to update Intercom");
		insertUpdateCall();
	}
});

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.request === "checkStatus") {
    	if(!taskComplete){
    		console.log("Task not yet complete...");
            sendResponse({done: taskComplete});
    	}else{
                console.log("Task complete");
                sendResponse({done: taskComplete, intercomData: intercomData, statusCode: statusCode});
		}

        if(!taskComplete && postComplete) {
    		console.log("post is complete tho...");
            sendResponse({postComplete: postComplete, intercomData: intercomData, statusCode: "Couldn't connect to Intercom"});
        }
	}
	return true;
});

chrome.webRequest.onBeforeRequest.addListener(
	function (details){
        console.log("In on before request");
        var FORM_DATA = details["requestBody"]["formData"];
		var	USER_DATA = JSON.parse(FORM_DATA["user_data"]);
		var	COMP_DATA = USER_DATA["company"];
		if(details.method==="POST"){

			var install = FORM_DATA["i"];
			var app_id = FORM_DATA["app_id"];
			
			var user_id = USER_DATA["user_id"];
			var email = USER_DATA["email"];
			var name = USER_DATA["name"];
			
			var comp_id = null;
			var comp_name = null;
			
			if(typeof COMP_DATA !== "undefined") {
                console.log("Company data isn't undefined");
                comp_id = COMP_DATA["id_code"];
                comp_name = COMP_DATA["name"];
            }else{
				console.log("Company data is undefined");
			}
			intercomData = {
				install: install,
				app_id: app_id,
				user_id: user_id,
				email: email,
				name: name,
				comp_id: comp_id,
				comp_name: comp_name
			};
			console.log(intercomData);
			postComplete = true;
			if(postComplete){
				console.log("Well: " + postComplete);
			}else{
				console.log("That didn't work..");
			}
		}
	}, 
	ping_filter, 
	out_extraInfoSpec
);	

chrome.webRequest.onHeadersReceived.addListener(
	function(details){
		console.log("Headers received");
		statusCode = JSON.stringify(details.statusCode);
		taskComplete = true;
	}, 
	err_filter
);	

if (taskComplete) {
	console.log("Task completed in other function");
    chrome.runtime.sendMessage({done: true, intercomData: intercomData, statusCode: statusCode});
}
