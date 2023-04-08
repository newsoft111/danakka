function isEmpty(str){
	if(typeof str == "undefined" || str == null || str == "")
		return true;
	else
		return false ;
}

function getParams(name){
	const urlParams = new URL(location.href).searchParams;
	const value = urlParams.get(name);
	return value
}


