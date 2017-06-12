<?php
//server info
$servername = "localhost";
$username = "ifridgea_console";
$dbpassword = "password";
$dbname = "ifridgea_personal_data";

	//Establish server connection
	$conn = new mysqli($servername, $username, $dbpassword, $dbname);

	//Session
	session_start();
	$UserID = mysqli_real_escape_string($conn, $_POST['UserID1']);
	$Product = mysqli_real_escape_string($conn, $_POST['Product1']);

	//Check connection for failure 
	if (mysqli_connect_errno()) {
	    $error = (mysqli_connect_error());
	    echo "error";
	    exit();
	}

	$remove = "DELETE FROM shopping_list WHERE Product='$Product' AND UserID='$UserID'";
	//add to recently removed
	if($result = mysqli_query($conn, $remove)){
			echo json_encode(array("result" => "success"));
		}
	else {
		echo json_encode(array("result" => "failure"));
	}


mysqli_close($conn);
?>