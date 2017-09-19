let d = document;
let oldData = null;
let intercomData = null;
let err = null;

window.addEventListener('DOMContentLoaded', function () {
    let infoLoader = d.getElementById("infoLoader");
    let statusLoader = d.getElementById("statusLoader");

    let infoButton = d.getElementById("informationButton");
    let statusButton = d.getElementById("statusButton");
    let errorButton = d.getElementById("errorButton");
    let functionButton = d.getElementById("functionButton");

    let updateBtn = d.getElementById("updateBtn");
    let shtdwnBtn = d.getElementById("shtdwnBtn");
    let bootBtn = d.getElementById("bootBtn");

    function openTab(evt, tabName) {
        // Declare all variables
        let i, tabcontent, tablinks;

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

    function populateStatus(headers){
        let statusDiv = d.getElementById("status");
        let lastUrl = null;
        let lastStatus = null;
        for(let i = 0; i<headers.length; i++){
            let details = d.createElement("p");
            let url = JSON.stringify(headers[i].url);
            let status = JSON.stringify(headers[i].statusCode);
            if(lastUrl!==url && lastStatus!==status){
                lastUrl = url;
                lastStatus = status;
            }else{
                continue;
            }
            details.textContent = url + ": " + status;
            statusDiv.appendChild(details);
        }
    }

    function populateRows(body, installType, appInfo, userInfo, compInfo){

        let trBody = d.createElement("tr");

        let tdInstall = d.createElement("td");
        let tdAppID = d.createElement("td");
        let tdUserInfo = d.createElement("td");
        let tdCompInfo = d.createElement("td");

        tdInstall.textContent = installType;
        tdAppID.textContent = appInfo;
        tdUserInfo.textContent = userInfo;
        tdCompInfo.textContent = compInfo;

        trBody.appendChild(tdInstall);
        trBody.appendChild(tdAppID);
        trBody.appendChild(tdUserInfo);
        trBody.appendChild(tdCompInfo);

        body.appendChild(trBody);

        return body;
    }

    function populate(error, intercomData) {
        let infoDiv = d.getElementById("info");

        if(error === null){
            oldData = intercomData;

            let installType, userInfo, appInfo, compInfo;
            if (oldData.install[0] === "s") {
                console.log("Installed with Segment");
                installType = "Segment.io";
            } else {
                installType = "Intercom script";
            }

            appInfo = `App ID: ${oldData.app_id}`;

            if (typeof oldData.user_id === "undefined") {
                userInfo = "Current user is a lead";
            } else {
                userInfo = `User Name: ${oldData.name} Email: ${oldData.email} User ID: ${oldData.user_id}`;
            }

            if (oldData.comp_id !== null) {
                compInfo = `Company Name: ${oldData.comp_name}<br>Company ID: ${oldData.comp_id}`;
            } else {
                compInfo = "User has no company information.";
            }
            
            let table = d.createElement("table");
            let tableHead = d.createElement("thead");
            let tableBody = d.createElement("tbody");

            table.border = ".5";

            let trHead = d.createElement("tr");

            let thInstall = d.createElement("th");
            let thAppId = d.createElement("th");
            let thUserInfo = d.createElement("th");
            let thCompInfo = d.createElement("th");

            thInstall.textContent = "Installation";
            thAppId.textContent = "App ID";
            thUserInfo.textContent = "User Information";
            thCompInfo.textContent = "Company Information";

            trHead.appendChild(thInstall);
            trHead.appendChild(thAppId);
            trHead.appendChild(thUserInfo);
            trHead.appendChild(thCompInfo);

            tableHead.appendChild(trHead);

            tableBody = populateRows(tableBody, installType, appInfo, userInfo, compInfo);

            table.appendChild(tableHead);
            table.appendChild(tableBody);

            infoDiv.appendChild(table);
        }else{
            let err = d.createElement('p');
            err.textContent = error;
            infoDiv.appendChild(err);
        }
    }

    function populateErrors(errors){
        let errorDiv = d.getElementById("error");
        let lastUrl = null;
        let lastError = null;
        for(let i = 0; i<errors.length; i++){
            let details = d.createElement("p");
            let url = JSON.stringify(errors[i].url);
            let error = JSON.stringify(errors[i].error);
            if(lastUrl!==url && lastError!==error){
                console.log("URL and error are different. Assigning...");
                lastUrl = url;
                lastError = error;
            }else{
                continue;
            }
            details.textContent = url + ": " + error;
            errorDiv.appendChild(details);
        }
    }


    infoButton.addEventListener("click", function(e){
        console.log("Sending message to update Intercom");
        chrome.runtime.sendMessage({update: "update"});
        if(intercomData!== null){
            $("#info").empty();
            populate(null, intercomData);
            console.log("Update: "+ JSON.stringify(intercomData));
        }else{
            populate(err, null);
        }
        openTab(e, 'info');
    });

    statusButton.addEventListener("click", function(e){
        if(!headers.length<=0){
            $("#status").empty();
            populateStatus(headers);
        }
        openTab(e, 'status');
    });

    errorButton.addEventListener("click", function(e){
        if(!errors.length<=0){
            $("#error").empty();
            populateErrors(errors);
        }
        openTab(e, 'error');
    });

    functionButton.addEventListener("click", function(e){
       openTab(e, 'functions');
    });

    updateBtn.addEventListener("click", function(){
        chrome.runtime.sendMessage({method: "update"});
    });

    shtdwnBtn.addEventListener("click", function(){
        chrome.runtime.sendMessage({method: "shutdown"});
    });

    bootBtn.addEventListener("click", function(){
        chrome.runtime.sendMessage({method: "boot"});
    });

    chrome.runtime.sendMessage({request: "checkData"}, function(response) {
        console.log("Checking data...");
        if (response.done) {
            console.log("Data found");
            console.log(response.intercomData);
            intercomData = response.intercomData;
            if(intercomData!== null){
                console.log("Intercom Data: " + JSON.stringify(intercomData));
                infoLoader.style.visibility = "hidden";
                oldData = intercomData;
                populate(null, intercomData);
            }
        }else{
            console.log("Data not found yet");
        }
    });


    chrome.runtime.sendMessage({request: "checkStatus"}, function(response){
        console.log("Checking status...");
        if(response.done){
            headers = response.headers;
            if(status!==null){
                console.log("Status found: " + status);
                statusLoader.style.visibility = "hidden";
                populateStatus(headers);
            }
        }else{
            console.log("Status not received..");
        }
    });

    chrome.runtime.sendMessage({request: "checkError"}, function(response){
        if(response.done){
            errors = response.errors;
            if(!errors.length<=0){
                statusLoader.style.visibility = "hidden";
                populateErrors(errors);
            }
        }else{
            console.log("Status not received..");
        }
    });


    chrome.runtime.onMessage.addListener(function(message){
        if(message.message==="error"){
            console.log("Error occurred: " + message.error);
            err = message.error;
            populate(err, null);
        }
    });
});
