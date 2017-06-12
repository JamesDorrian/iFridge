<?php
	$servername = "localhost";
	$username = "ifridgea_console";
	$dbpassword = "password";
	$dbname = "ifridgea_personal_data";

	//Establish server connection
	$conn = new mysqli($servername, $username, $dbpassword, $dbname);

	//Session
	session_start();
	$email = mysqli_real_escape_string($conn, $_POST['email1']);

	//Check connection for failure 
	if (mysqli_connect_errno()) {
	    $error = (mysqli_connect_error());
	    echo "error";
	    exit();
	}
	
	$sql = "SELECT Name, Age, Address, UserID FROM personal_data WHERE Email='$email' LIMIT 1";
	$result = mysqli_query($conn, $sql);
	$value = mysqli_fetch_array($result, MYSQLI_ASSOC);
	$name = $value["Name"];

	echo json_encode(array("Name"=>$value["Name"], "Age"=>$value["Age"], "Address"=>$value["Address"], "userID"=>$value["UserID"]));
	mysqli_close($conn);
?>