var d = document;

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

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function populate(info) {
    if(info.install == "s"){
        installType.innerHTML = "<br>Installed using Segment.io";
    }else if(info.install == "g"){
        installType.innerHTML = "<br>Installed using Google Tag Manager";
    }else{
        installType.innerHTML = "<br>Installed using standard Intercom script";
    }

    appInfo.innerHTML = `App ID: ${info.app_id}`;
    
    if(typeof info.user_id === "undefined"){
        userInfo.innerHTML = "<br>Current user is a lead";
    }else{
        userInfo.innerHTML = `<br>User Name: ${info.name}\nEmail: ${info.email}\nUser ID: ${info.user_id}`;
    }
    
    if(info.comp_id !== null){
        compInfo.innerHTML = `<br>Company Name: ${info.comp_name}\nCompany ID: ${info.comp_id}`;   
    }
}

function populateStatus(status){
    statusCode.innerHTML = status;
}

window.addEventListener('DOMContentLoaded', function () {
    console.log("Dom Ready");

    var installType = d.getElementById("installType");
    var appInfo = d.getElementById("appInfo");
    var userInfo = d.getElementById("userInfo");
    var compInfo = d.getElementById("compInfo");
    var statusCode = d.getElementById("statusCode");

    chrome.runtime.sendMessage({request: "checkStatus"}, function(response) {
        if (response.done) {
            console.log(response.intercomData);
            populate(response.intercomData);
        }
    });

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message.done) {
            console.log(message.intercomData);
            populate(message.intercomData);
        }
    });
});
