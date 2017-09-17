console.log("Checking if Intercom exists...");
if(Intercom.booted){
    console.log("Intercom is booted and exists. Updating...")
    Intercom('update');
    // let app_id = intercomSettings.app_id;
    // let user_id = intercomSettings.user_id;
    // let email = intercomSettings.email;
    // let company = intercomSettings.company;
    // if(typeof company!== "undefined"){
    //     let comp_id = company.id;
    //     let comp_name = company.name;
    // }
    // intercomData = {
    //     app_id: app_id,
    //     user_id: user_id,
    //     email: email,
    //     name: name,
    //     comp_id: comp_id,
    //     comp_name: comp_name
    // };
    // chrome.runtime.sendMessage({message: "intercmosettings_data", intercomData: intercomData});
}
