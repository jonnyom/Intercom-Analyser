if(typeof window.extId==="undefined"){
    let extId = "abogndmoaomemldginodpgileenpmeke";
}

try{
    Intercom('boot');
}catch(e){
    chrome.runtime.sendMessage(extId, {message: "error", error: e});
}