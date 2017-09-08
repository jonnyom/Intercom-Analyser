var w = window;
var d = document;
var ping_filter = {urls: ["*://*.intercom.io/messenger/web/ping"]};
var err_filter = {urls: ["*://*.intrcom.io/*", "*://*.intercom.com/*"]}
var out_extraInfoSpec = ["blocking", "requestBody"];
var in_extraInfoSpec = ["responseHeaders"];
var statusCode;

var postComplete = false;
var taskComplete = false;

function ensureSendMessage(tabId, message, callback){
  	chrome.tabs.sendMessage(tabId, {ping: true}, function(response){
    	if(response && response.pong) { // Content script ready
      		chrome.tabs.sendMessage(tabId, message, callback);
  		} else { // No listener on the other end
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

// chrome.runtime.onMessage.addListener(function(message){
// 	if(message.update == "update"){
// 		console.log("Updating");
// 		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
// 		var activeTab = tabs[0];
// 		ensureSendMessage(activeTab.id, {"message": "clicked_browser_action"});
// 	});
// 	}
// });


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.request == "checkStatus") {
    	if(!taskComplete){
    		sendResponse({done: taskComplete});
    	}else{
    		sendResponse({done: taskComplete, intercomData: intercomData, statusCode: statusCode});
    	}
    }
});

chrome.webRequest.onBeforeRequest.addListener(
	function (details){
		var FORM_DATA = details["requestBody"]["formData"];
		var	USER_DATA = JSON.parse(FORM_DATA["user_data"]);
		var	COMP_DATA = USER_DATA["company"];
		if(details.method=="POST"){

			var install = FORM_DATA["i"];
			var app_id = FORM_DATA["app_id"];
			
			var user_id = USER_DATA["user_id"];
			var email = USER_DATA["email"];
			var name = USER_DATA["name"];
			
			var comp_id = null;
			var comp_name = null;
			
			if(typeof COMP_DATA !== "undefined"){
				comp_id = COMP_DATA["id_code"];
				comp_name = COMP_DATA["name"];					
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
			postComplete = true;
		}
	}, 
	ping_filter, 
	out_extraInfoSpec
);	

chrome.webRequest.onHeadersReceived.addListener(
	function(details){
		statusCode = JSON.stringify(details.statusCode);
		taskComplete = true;
	}, 
	err_filter
);	

if (taskComplete) {
    chrome.runtime.sendMessage({done: true, intercomData: intercomData, statusCode: statusCode});
}

// chrome.runtime.onMessage.addListener(
//     function(message, sender, sendResponse) {
//         switch(message.message) {
//             case "getIntercomData":
//                 sendResponse({"intercomData": intercomData});
//                 break;
//             case "getIntercomCompany":
//             	sendResponse({"install_type": intercomCompany});
//             	break;
//             default:
//                 console.error("Unrecognised message: ", message);
//         }
//     }
// );


