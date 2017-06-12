<?php

//server info
$servername = "localhost";
$username = "ifridgea_console";
$dbpassword = "password";
$dbname = "ifridgea_personal_data";

//start session
session_start();

//Establish server connection
$conn = new mysqli($servername, $username, $dbpassword, $dbname);

//Check connection for failure 
if (mysqli_connect_errno()) {
    $error = (mysqli_connect_error());
    echo "error";
    exit();
}

//Read in email & password
$email = mysqli_real_escape_string($conn, $_POST['email1']);
$password = mysqli_real_escape_string($conn, $_POST['password1']); 

//sql query returning 1 row (if successful) and 0 if not
$sql = "SELECT Name, Age FROM personal_data WHERE Email='$email' AND Password='$password' LIMIT 1";
$result = mysqli_query($conn, $sql);

//start session for successful login, else, return error.
if(mysqli_num_rows($result) > 0){
		$_SESSION['authUser'] = $email; //gives session unique ID
		//session_commit();
		echo json_encode(array("result" => "success")); //send success to login.js & continue session
	} else {
		$error = "Username or Password is invalid";
		echo json_encode(array("result" => "failure")); //send failure to login.js, causing us to reload page and try again for email & password
	}

mysqli_close($conn);
?>