var w = window;
console.log("Checking if Intercom exists...");
if(Intercom.booted){
    console.log("Intercom is booted and exists. Updating...")
    w.Intercom('update');
    var app_id = w.intercomSettings.app_id;
    var user_id = w.intercomSettings.user_id;
    var email = w.intercomSettings.email;
    var company = w.intercomSettings.company;
    if(typeof company!== "undefined"){
        var comp_id = company.id;
        var comp_name = company.name;
    }
    intercomData = {
        app_id: app_id,
        user_id: user_id,
        email: email,
        name: name,
        comp_id: comp_id,
        comp_name: comp_name
    };
    chrome.runtime.sendMessage({message: "intercmosettings_data", intercomData: intercomData});
}
