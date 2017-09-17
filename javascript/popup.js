let d = document;
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
        let h4Status = d.createElement("h4");
        h4Status.textContent = status;
        statusDiv.appendChild(h4Status);
    }

    function populate(intercomData) {
        let installType, userInfo, appInfo, compInfo;
        if(intercomData.install == "s"){
            installType = "Segment.io";
        }else if(intercomData.install == "g"){
            installType = "Google Tag Manager";
        }else{
            installType = "Intercom script";
        }

        appInfo = `App ID: ${intercomData.app_id}`;

        if(typeof intercomData.user_id === "undefined"){
            userInfo = "Current user is a lead";
        }else{
            userInfo = `User Name: ${info.name}<br>Email: ${info.email}<br>User ID: ${info.user_id}`;
        }

        if(intercomData.comp_id !== null){
            compInfo = `Company Name: ${info.comp_name}<br>Company ID: ${info.comp_id}`;
        }else{
            compInfo = "User has no company information.";
        }

        let infoDiv = d.getElementById("info");
        let table = d.createElement("table");
        let tableHead = d.createElement("thead");
        let tableBody = d.createElement("tbody");

        table.border = "1";

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

        tableBody.appendChild(trBody);

        table.appendChild(tableHead);
        table.appendChild(tableBody);

        infoDiv.appendChild(table);
    }

    infoButton.addEventListener("click", function(e){
        console.log("Sending message to update Intercom");
        chrome.runtime.sendMessage({update: "update_intercom"});
        openTab(e, 'info');
    });
    statusButton.addEventListener("click", function(e){
        openTab(e, 'status');
    });

    updateBtn.addEventListener("click", function(e){
        chrome.runtime.sendMessage({update: "update_intercom"});
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
                populate(intercomData);
            }
        }else{
            console.log("Data not found yet");
        }
    });

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
});
