$(document).ready(function(){
	 // temp header
	 // $("#header").load("../header.html");
	 // header
	 //
	 //
	 $.get("../php/security.php", function(response){
	 		if(response.result == "failure"){
	 			$("#header").load("../header.html");
	 		} else {
	 			$("#header").load("../header_logout.html");
	 			//location.href="../index.html";
	 		}
	 }, "json");
	
	$('#login_button').click(function(){
		var email = $('#email').val();
		var password = $('#password').val();
		if (checkEmail(email) && checkPassword(password)){
			$.post('../php/login.php', {email1:email, password1:password}, function(data) {
			//input in form array('result' -> 'success')
			if (data.result == 'success'){
				window.location.replace("profile.html");
				// alert('success-this should be returned to profile window');
			} else {
				$('#invalid_details').html("<p>Username/Password not in system.</p>");
			}
		}, "json");}//end of checkEmail & checkPassword 
		else {
			// $('#invalid_details').html("Invalid Username/password.");
			exit();
		}
	});//eo login_button

	function checkEmail(email){
     	var email_check = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
     	if (email_check.test(email)){
     		return true;
     	} else {
     		$('#invalid_details').html("<p>Invalid Email.</p>");
     		return false;
     	}
     }

     function checkPassword(password){
     	//1 uppercase, 1 lowercase, 1 number
     	var password_check = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/; 
     	if (password_check.test(password)){
     		return true;
     	} else {
     		$('#invalid_details').html("<p>Invalid Password.</p>");
     		return false;
     	}
     }
});//eof