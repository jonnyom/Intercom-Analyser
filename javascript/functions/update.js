if(typeof window.extId==="undefined"){
    let extId = "abogndmoaomemldginodpgileenpmeke";
}

try{
    let now = new Date().getTime();
    Intercom('update', {
        updated_at: now
    });
}catch(e){
    chrome.runtime.sendMessage(extId, {message: "error", error: e});
}
