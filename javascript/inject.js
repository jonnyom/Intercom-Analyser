console.log("Checking if Intercom exists...");
if(typeof Intercom !== "undefined" && Intercom.booted){
    console.log("Intercom is booted and exists. Updating...")
    Intercom('update');
}else{
    console.log("Intercom isn't defined nor booted")
    chrome.runtime.sendMessage("abogndmoaomemldginodpgileenpmeke", {message: "not_defined", booted: false});
}
