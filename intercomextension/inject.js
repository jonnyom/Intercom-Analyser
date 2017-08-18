try{
	if(typeof window.intercomSettings !== "undefined"){
		Intercom('update');
		var app_id = window.intercomSettings.app_id;
		var company_id;
		if(typeof window.intercomSettings.company!== "undefined"){
			company_id = window.intercomSettings.company.id;
		}
		var user_id = window.intercomSettings.user_id;
		var email = window.intercomSettings.email;
		var message = `Intercom is defined. \nAPP_ID: ${app_id}`;
		if(typeof company_id !== "undefined"){
			message+= `\nCompany ID: ${company_id}`;
		}
		if(typeof user_id !== "undefined"){
			message+= `\nUser ID: ${user_id}`;
		}
		if(typeof email !== "undefined"){
			message+= `\nEmail: ${email}`;
		}
		alert(message);
	}else if (typeof window.intercomSettings === "undefined" && typeof window.analytics.identify()!=="undefined"){
		var message = "Intercom is probably defined using Segment - check console for Analytics. \nYou are looking for a user object \nanalytics:user identify {user_id}";
		analytics.debug();
		location.reload();
		alert(message);
	}
}catch(err){
	alert(err);
}