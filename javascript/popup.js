var d = document;

window.addEventListener('DOMContentLoaded', function () {
    console.log("Dom Ready");

    var installType = d.getElementById("installType");
    var appInfo = d.getElementById("appInfo");
    var userInfo = d.getElementById("userInfo");
    var compInfo = d.getElementById("compInfo");
    var statusCode = d.getElementById("statusCode");
    // var updateBtn = d.getElementById("updateBtn");

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

    function populateStatus(status){
        statusCode.innerHTML = status;
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

    function populateIntercomSettings(info){
        installType.innerHTML = "<p>Information found by querying intercomSettings. Not necessarily reliable</p>";
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

    // updateBtn.addEventListener("click", function(e)){
    //     chrome.runtime.sendMessage({update: "update"});
    // }, false);


    chrome.runtime.sendMessage({request: "checkStatus"}, function(response) {
        console.log("Checking status...");
        if (response.done) {
            console.log("Good to go! Post and Status alright");
            console.log(response.intercomData);
            populate(response.intercomData);
            console.log(response.statusCode);
            populateStatus(response.statusCode);
        }else if(response.postComplete){
            console.log("Post is complete, but status is uncertain");
            console.log(response.intercomData);
            populate(response.intercomData);
            console.log(response.statusCode);
            populateStatus(response.statusCode);
        }else{
            console.log("Haven't received a response");
            chrome.runtime.onMessage.addListener(function(message){
               if(message.message === "intercomsettings_data_content"){
                   populateIntercomSettings(message.intercomData);
               }
            });
        }
    });

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        console.log("Received message");
        if (message.done) {
            console.log(message.intercomData);
            populate(message.intercomData);
            console.log(message.statusCode);
            populateStatus(message.statusCode);
        }
    });
});
