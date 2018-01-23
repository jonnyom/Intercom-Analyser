let d = document;
let oldData = null;
let intercomData = null;
let err = null;

window.addEventListener('DOMContentLoaded', function () {
    let infoLoader = d.getElementById("infoLoader");
    let statusLoader = d.getElementById("statusLoader");

    let infoButton = d.getElementById("informationButton");
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

    function populateStatus(headers) {
        let statusDiv = d.getElementById("status");
        let details = d.createElement("p");
        let lastUrl = null;
        let lastStatus = null;
        for (let i = 0; i < headers.length; i++) {
            let url = JSON.stringify(headers[i].url);
            if (!url.includes("intercomrades")) {
                console.log("Contains intercomrades");
                continue;
            }
            let status = JSON.stringify(headers[i].statusCode);
            let method = JSON.stringify(headers[i].method);
            if (lastStatus !== status || lastUrl !== url) {
                lastStatus = status;
                lastUrl = url;
            } else {
                continue;
            }
            details.textContent = url + ": " + status + " method: " + method;
            statusDiv.appendChild(details);
        }
    }


    function populateRows(body, installType, appInfo, userInfo, compInfo){

        let trBody = d.createElement("tr");

        let tdInstall = d.createElement("td");
            tdInstall.className = "text-left";
        let tdAppID = d.createElement("td");
            tdInstall.className = "text-left";
        let tdUserInfo = d.createElement("td");
            tdInstall.className = "text-left";
        let tdCompInfo = d.createElement("td");
            tdInstall.className = "text-left";

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

        if(error === null && intercomData!==null){
            let installType, userInfo, appInfo, compInfo;
            if (intercomData.install[0] === "s") {
                installType = "Segment.io";
            } else {
                installType = "Intercom script";
            }

            appInfo = `App ID: ${intercomData.app_id}`;

            if (typeof intercomData.user_id === "undefined" && typeof intercomData.email === "undefined") {
                userInfo = "Current user is a lead";
            } else {
                userInfo = `User Name: ${intercomData.name} Email: ${intercomData.email} User ID: ${intercomData.user_id}`;
            }

            if (intercomData.comp_id !== null) {
                compInfo = `Company Name: ${intercomData.comp_name} Company ID: ${intercomData.comp_id}`;
            } else {
                compInfo = "User has no company information.";
            }

            let table = d.createElement("table");
            table.className = "table-fill";
            let tableHead = d.createElement("thead");
            tableHead.className = "text-left";
            let tableBody = d.createElement("tbody");
            tableBody.className = "table-hover";

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
        if(intercomData!== null){
            $("#info").empty();
            populate(null, intercomData);
        }else{
            $("#info").empty();
            populate(err, null);
        }
        openTab(e, 'info');
    });

    errorButton.addEventListener("click", function(e){
        populateErrors(errors);
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
        if (response.done) {
            intercomData = response.intercomData;
            if(intercomData!== null){
                infoLoader.style.visibility = "hidden";
                oldData = intercomData;
                populate(null, intercomData);
            }
        }
    });

    chrome.runtime.sendMessage({request: "checkError"}, function(response){
        if(response.done){
            errors = response.errors;
            if(!errors.length<=0){
                statusLoader.style.visibility = "hidden";
                populateErrors(errors);
            }
        }
    });


    chrome.runtime.onMessage.addListener(function(message){
        if(message.message==="error"){
            err = message.error;
            populate(err, null);
        }
    });
});
