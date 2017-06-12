<?php

//server info
$servername = "localhost";
$username = "ifridgea_console";
$dbpassword = "password";
$dbname = "ifridgea_personal_data";

//Establish server connection
$conn = new mysqli($servername, $username, $dbpassword, $dbname);

//start session
session_start();

	//Check connection for failure 
	if (mysqli_connect_errno()) {
	    $error = (mysqli_connect_error());
	    echo "error";
	    exit();
	}

//Read in email & password
$email = mysqli_real_escape_string($conn, $_POST['email1']);
//get UserID
$getID = "SELECT UserID FROM personal_data WHERE Email='$email'";
$resultID = mysqli_query($conn, $getID);
$valueID = mysqli_fetch_array($resultID);
$UserID = $valueID["UserID"];

$BarcodeID = mysqli_real_escape_string($conn, $_POST['barcode1']);
$ProductName = mysqli_real_escape_string($conn, $_POST['product1']);
$BrandName = mysqli_real_escape_string($conn, $_POST['brand1']);
$Weight = mysqli_real_escape_string($conn, $_POST['weight1']);
$State = mysqli_real_escape_string($conn, $_POST['state1']);

print_r($BarcodeID);
print_r($UserID);
print_r($BrandName);
print_r($ProductName);
print_r($Weight);
print_r($State);

//insert into temporary product data
$sql = "INSERT INTO temporary_product_data (BarcodeID, UserID, BrandName, ProductName, Weight, State) VALUES ('$BarcodeID', '$UserID', '$BrandName', '$ProductName', '$Weight', '$State')";// currently not working and goes straight to failure
//insert into intermediate DB
// print_r($result);
	if($result = mysqli_query($conn, $sql)){
		$sql_int = "INSERT INTO current_inventory (UserID, BarcodeID) VALUES ('$UserID','$BarcodeID')";
		if($result_int = mysqli_query($conn, $sql_int)){
			echo json_encode(array("result" => "success"));
		} else {
			echo json_encode(array("result" => "failure to add to intermediateDB"));
		}		
	} else {
		print_r($result);
		echo json_encode(array("result" => "failure to add to temp_prod_db"));
	}


mysqli_close($conn);
?>