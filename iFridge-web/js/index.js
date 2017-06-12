$(document).ready(function(){
	$.get("../php/security.php", function(response){
	 		if(response.result == "failure"){
	 			$("#header").load("../header.html");
	 		} else {
	 			$("#header").load("../header_logout.html");
	 		}
	 }, "json");
});