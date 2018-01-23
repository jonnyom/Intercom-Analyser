let ping_filter = {urls: ["*://*.intercom.io/messenger/web/ping"]};
let err_filter = {urls: ["*://*.intercom.io/*", "*://*.intercom.com/*"]}
let out_extraInfoSpec = ["blocking", "requestBody"];
let version = "1.0";

let postComplete = false;
let statusComplete = false;
let errorComplete = false;
let urlComplete = true;

let headers = [];
let errors = [];

let url;
let currentTab;

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

function insertMethod(method){
	chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
        let activeTab = tabs[0];
        ensureSendMessage(activeTab.id, {message: method});
	});
}

chrome.runtime.onMessage.addListener(function(message){
	switch (message.method){
		case "update":
			insertMethod("update");
			break;
		case "shutdown":
			insertMethod("shutdown");
			break;
		case "boot":
			insertMethod("boot");
			break;
		default:
			break;
	}
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.request === "checkData") {
    	if(!postComplete && !urlComplete){
            sendResponse({done: postComplete});
    	}else{
				sendResponse({done: postComplete, intercomData: intercomData});
		}
	}
	return true;
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
   if(message.request === "checkStatus"){
       if(!statusComplete){
           sendResponse({done: statusComplete});
       }else{
				 sendResponse({done: statusComplete, headers: headers});
       }

   }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message.request === "checkError"){
        if(!errorComplete){
            sendResponse({done: errorComplete});
        }else{
            sendResponse({done: errorComplete, errors: errors});
        }

    }
});

chrome.webRequest.onBeforeRequest.addListener(
	function (details){
		const FORM_DATA = details["requestBody"]["formData"];
		const USER_DATA = JSON.parse(FORM_DATA["user_data"]);
		const COMP_DATA = USER_DATA["company"];

		if(details.method==="POST"){
			let install = FORM_DATA["i"];
			let app_id = FORM_DATA["app_id"];
			
			let user_id = USER_DATA["user_id"];
			let email = USER_DATA["email"];
			let name = USER_DATA["name"];
			
			let comp_id = null;
			let comp_name = null;
			
			if(typeof COMP_DATA !== "undefined") {
				comp_id = COMP_DATA["id"];
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

chrome.webRequest.onErrorOccurred.addListener(
	function(details){
		errors.push(details);
		errorComplete = true;
	},
	err_filter
);