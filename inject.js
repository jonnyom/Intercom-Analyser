var w = window;

try{
	if(typeof w.intercomSettings !== "undefined"){
		console.log("Calling Intercom('update');...")
		Intercom('update');
		var app_id = w.intercomSettings.app_id;
		var company_id;
		var company_name;
		console.log("Checking for company information");
		if(typeof w.intercomSettings.company!== "undefined"){
			company_id = w.intercomSettings.company.id;
			company_name = w.intercomSettings.company.name;
			console.log(`Company information exists: ${company_name}, ${company_id}`);
		}
		console.log("Checking for user information...");
		var user_id = w.intercomSettings.user_id;
		var email = w.intercomSettings.email;
		var message = `Intercom is defined. \nAPP_ID: ${app_id}`;
		if(typeof user_id !== "undefined"){
			message+= `\nUser ID: ${user_id}`;
		}else{
			message+= `\nUser ID is null.`;
		}
		if(typeof email !== "undefined"){
			message+= `\nEmail: ${email}`;
		}else{
			message+= `\nEmail is null.`;
		}
		if(typeof company_id !== "undefined"){
			message+= `\nCompany ID: ${company_id}`;
		}else{
			message+= `\nCompany ID is null.`;
		}
		if(typeof company_name !== "undefined"){
			message+= `\nCompany Name: ${company_name}`;
		}else{
			message+= `\nCompany Name is null.`;
		}
		alert(message);
	}else if (typeof w.intercomSettings === "undefined" && typeof w.analytics.identify()!=="undefined"){
		var message = "Intercom is probably defined using Segment - check console for Analytics. \nYou are looking for a user object \nanalytics:user identify {user_id}";
		// var output = analytics.debug();
		if(w.location.href.indexOf("refresh")){
			console.log("Location has already been refreshed");
			// alert(JSON.stringify(analytics.debug()));
		}else{
			console.log("Calling analytics.debug()...");
			w.analytics.debug();
			console.log('Adding hash fragment to URL...')
			w.location = window.location.href + "#refresh";
			console.log("Reloading page...");
			w.location.reload();
		}
		
		// sessionStorage.reloadAfterPageLoad = false;
		// $( function () {
		//     if ( sessionStorage.reloadAfterPageLoad ) {
		//         alert(JSON.stringify(output));
		//         sessionStorage.reloadAfterPageLoad = true;
		//     }
		// });
		alert(message);
	}else{
		alert("Nothing to see here");
	}
}catch(err){
	alert(`Intercom is not defined. \nError: ${err}`);
}