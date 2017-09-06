var w = window;
const WEB_REQUEST = chrome.webRequest;
var filter = {urls: ["*://*.intercom.io/messenger/web/ping"]};
var opt_extraInfoSpec = ["blocking", "requestBody"];
var FORM_DATA; 
var USER_DATA; 
var COMP_DATA; 
var intercomData;
var intercomComp;

function isEmpty(obj) {
	Object.keys(obj).length === 0 && obj.constructor === Object
}

function IntercomData(install, app_id, user_id, email, name){
	this.install = install;
	this.app_id = app_id;
	this.user_id = user_id;
	this.email = email;
	this.name = name;
}

function IntercomCompany(comp_id, comp_name){
	this.comp_id = comp_id;
	this.comp_name = comp_name; 
}

IntercomData.prototype.install_type = function(){
	console.log("Checking installation of current Intercom instance...");
	if(this.install == "s"){
		console.log("Installed using Segment.io");
	}else if(this.install == "g"){
		console.log("Installed using Google Tag Manager");
	}else{
		console.log("Installed using standard script");
	}
}

IntercomData.prototype.user_info = function() {
	console.log(`App ID: ${this.app_id}`);
	console.log(`USER ID: ${this.user_id}`);
	if(typeof this.user_id === "undefined"){
		console.log("Current user is a lead");
	}else{
		console.log(`User Name: ${this.name}\nEmail: ${this.email}\nUser ID: ${this.user_id}`);
	}
};

IntercomCompany.prototype.comp_info = function() {
	if(this.comp_id !== null){
		console.log(`Company Name: ${this.comp_name}\nCompany ID: ${this.comp_id}`);
	}
};

function checkDetails(){
	WEB_REQUEST.onBeforeRequest.addListener(
		function (details){
			FORM_DATA = details["requestBody"]["formData"];
			USER_DATA = JSON.parse(FORM_DATA["user_data"]);
			COMP_DATA = USER_DATA["company"];
			if(details.method=="POST"){
				var install = FORM_DATA["i"];
				var app_id = FORM_DATA["app_id"];
				
				var user_id = USER_DATA["user_id"];
				var email = USER_DATA["email"];
				var name = USER_DATA["name"];
				
				var comp_id = null;
				var comp_name = null;

				intercomData = new IntercomData(install, app_id, user_id, email, name);
				intercomData.install_type();
				intercomData.user_info();
				
				if(typeof COMP_DATA !== "undefined"){
					comp_id = COMP_DATA["id_code"];
					comp_name = COMP_DATA["name"];
					intercomComp = new IntercomCompany(comp_id, comp_name);
					intercomComp.comp_info();
				}	
			}else{
				console.log(`Failed with status code: ${details.statusCode}`);
			}		
		}, 
		filter, 
		opt_extraInfoSpec
	);
}

function checkRequest(){
	WEB_REQUEST.onCompleted.addListener(
		function(details){
			console.log(details.statusCode);
		}, 
		filter
	);	
}

checkDetails();
checkRequest();