$(document).ready(function(){
//stops annoying glitch when refreshing
$("#header").load("../header.html"); 

        $.get("../php/security.php", function(response){
            console.log("response:" + response);
            if (response.result == "failure") {
                //force them to login page if no session details
                location.href='../user_login.html';
                // alert("Please Enter your username/password");
            } else {
            	//loading header with logout button
            	$("#header").load("../header_logout.html"); 
            	//get user data and populate profile.html
            	var $email = response.data.authUser;
                console.log($email);
                $("#display_email").html($email);
                $.post("../php/profile.php", {email1:response.data.authUser}, function(data){
        		  $('#display_name').html("<p>Name:  " + data.Name + "</p>");
        		  $('#display_age').html("<p>Age:  " + data.Age + "</p>");
        		  $('#display_address').html("<p>Country: " + data.Address + "</p>");
        		  $('#display_userID').html("<p>UserID:  " + data.userID + "</p>");
        	}, "json");//end of post
            	}
        },"json");//end of get




                

        //get email here somehow

        

        //post request here to return data and fill display_name/display_age etc.

});//eof
