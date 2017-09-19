if(typeof window.extId==="undefined"){
    let extId = "abogndmoaomemldginodpgileenpmeke";
}

console.log("Checking if Intercom exists...");
try{
    console.log("Shutting down...")
    Intercom('shutdown');

}catch(e){
    chrome.runtime.sendMessage(extId, {message: "error", error: e});
}

