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

	//validate user login (USE API KEY)
	if (!array_key_exists("authUser", $_SESSION)) {
		echo json_encode(["result"=>"failure"]);
		exit();
	}
	//check barcode1 and userid1 keys exist in post

	$barcode = mysqli_real_escape_string($conn, $_POST['Barcode1']);
	$user = mysqli_real_escape_string($conn, $_POST['UserID1']);

	//Check connection for failure 
	if (mysqli_connect_errno()) {
	    $error = (mysqli_connect_error());
	    echo "error";
	    exit();
	}
	
	$sql = "INSERT INTO current_inventory (UserID, BarcodeID) VALUES ('$user','$barcode')";
	if($result = mysqli_query($conn, $sql)){
		echo json_encode(array("result" => "success"));
	} else {
		echo json_encode(array("result" => "failure"));//include reasons
	}


mysqli_close($conn);
?>
