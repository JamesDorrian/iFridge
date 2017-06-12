$(document).ready(function() {

//temp header
// $("#header").load("../header.html");
	//load header
	$.get("../php/security.php", function(response){
	 		if(response.result == "failure"){
	 			$("#header").load("../html/header.html");
	 		} else {
	 			$("#header").load("../html/header_logout.html");
	 		}
	 }, "json");
    
    // button control
    $('#submit_button').click(function()
	{
		//read in values
		var name = $('#name').val();
		var email = $('#email').val();
		var age = $('#age').val();
		var address = $('#address').val();
		var password = $('#password').val();
		var confirm_password = $('#confirm_password').val();
		
		if ( checkEmail(email) && checkName(name) && checkAge(age) && checkAddress(address) && checkPassword(password) && checkPasswordMatch(password,confirm_password) ){
               console.log("passes testss");
			$.post('../php/register.php', {name1:name, email1:email, age1:age, address1:address, password1:password}, function(data) {
                    console.log("response : " + data.response);
                    if (data.response == "success") {
                         $('#invalid_email').show();
                         $('invalid_email').html("Successfully registered. You are being redirected.");
                         location.href='../html/user_login.html';
                    } 
                    else if(data.response == "EmailExists") {
                         $('#invalid_email').show();
                         $('invalid_email').html("Email already exists. Try a different email or log in.");
                    } else {
                         $('#invalid_email').show();
                         $('invalid_email').html("Registration Error.");
                    }
		}, "json");  //end of post

          } else {
			// console.log('Regex error');
		}
		});
	

     function checkEmail(email){
     	var email_check = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
     	if (email_check.test(email)){
     		$("#invalid_email").hide();
     		return true;
     	} else {
               $('#invalid_email').show();
     		$("#invalid_email").html("Invalid Email");
     		return false;
     	}
     }

     function checkName(name){
     	var name_check = /^[A-Z ]{1,40}$/i;
     	if (name_check.test(name)){
     		$("#invalid_name").hide();
     		return true;
     	} else {
               $('#invalid_name').show();
     		$("#invalid_name").html("Invalid Name");
     		return false;
     	}
     }

     function checkAge(age){
     	var age_check = /^[0-9]{1,5}$/;
     	if (age_check.test(age)){
     		$("#invalid_age").hide();
     		return true;
     	} else {
               $('#invalid_age').show();
     		$("#invalid_age").html("Invalid Age");
     		return false;
     	}
     }

     function checkAddress(address){
     	var address_check = /^[a-z0-9]{3,20}$/i;
     	if (address_check.test(address)){
     		$("#invalid_address").hide();
     		return true;
     	} else {
               $('#invalid_address').show();
     		$("#invalid_address").html("Invalid Address");
     		return false;
     	}
     }

     function checkPassword(password){
     	//1 uppercase, 1 lowercase, 1 number
     	var password_check = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/; 
     	if (password_check.test(password)){
     		$("#invalid_password").hide();
     		return true;
     	} else {
               $('#invalid_password').show();
     		$("#invalid_password").html("Passwords must contain 1 uppercase, 1 lowercase and 1 number and be at least 6 digits long");
     		return false;
     	}
     }

     function checkPasswordMatch(password, confirm_password){
     	if (password != confirm_password){
                $('#password_match_error').show();
			$("#password_match_error").html("Passwords didn't match");
			return false;
		} else {
			$("#password_match_error").hide();
			return true;
		}
     }
    
    
});//eof


