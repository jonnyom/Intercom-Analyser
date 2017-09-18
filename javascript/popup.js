let d = document;
let oldData = null;
let intercomData = null;
let status = null;

window.addEventListener('DOMContentLoaded', function () {
    console.log("Dom Ready");



    let infoLoader = d.getElementById("infoLoader");
    let statusLoader = d.getElementById("statusLoader");

    let infoButton = d.getElementById("informationButton");
    let statusButton = d.getElementById("statusButton");

    let updateBtn = d.getElementById("updateBtn");


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

    function populateStatus(status){
        let statusDiv = d.getElementById("status");
        let h4Status = d.createElement("h3");
        h4Status.textContent = status;
        statusDiv.appendChild(h4Status);
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

    function populate(intercomData) {
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
            userInfo = `User Name: ${oldData.name}<br>Email: ${oldData.email}<br>User ID: ${oldData.user_id}`;
        }

        if (oldData.comp_id !== null) {
            compInfo = `Company Name: ${oldData.comp_name}<br>Company ID: ${oldData.comp_id}`;
        } else {
            compInfo = "User has no company information.";
        }

        let infoDiv = d.getElementById("info");
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
    }

    function populateError(){
        let infoDiv = d.getElementById("info");

        let pInfo = d.createElement("p");
        pInfo.textContent = "Intercom hasn't been booted on this page...";
        infoDiv.appendChild(pInfo);
    }


    infoButton.addEventListener("click", function(e){
        console.log("Sending message to update Intercom");
        chrome.runtime.sendMessage({update: "update_intercom"});
        if(intercomData!== null){
            checkData();
            console.log("Update: "+ JSON.stringify(intercomData));
        }else{
            populateError();
        }
        openTab(e, 'info');
    });

    statusButton.addEventListener("click", function(e){
        checkStatus();
        openTab(e, 'status');
    });

    updateBtn.addEventListener("click", function(){
        chrome.runtime.sendMessage({update: "update_intercom"});
    });

    function checkData(){
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
                    populate(intercomData);
                }
            }else{
                console.log("Data not found yet");
            }
        });
    }

    function checkStatus(){
        chrome.runtime.sendMessage({request: "checkStatus"}, function(response){
            console.log("Checking status...");
            if(response.done){
                status = response.status;
                if(status!==null){
                    console.log("Status found: " + status);
                    statusLoader.style.visibility = "hidden";
                    populateStatus(status);
                }
            }else{
                console.log("Status not received..");
            }

        });
    }

    chrome.runtime.onMessage.addListener(function(message){
        if(message.message==="not_defined" && message.booted === false){
            console.log("Intercom not installed on current page")
            populateError();
        }
    })

    checkData();
    checkStatus();
});
