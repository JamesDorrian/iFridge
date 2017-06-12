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
$barcode = mysqli_real_escape_string($conn, $_POST['barcode1']);
$email = mysqli_real_escape_string($conn, $_POST['email1']);


//check if in product DB if not send user back a prompt asking for detailed info which will then be added to DB
$sql = "SELECT BarcodeID, BrandName, ProductName, Weight, State FROM product_data WHERE BarcodeID='$barcode' LIMIT 1";
$result = mysqli_query($conn, $sql);
$value = mysqli_fetch_array($result, MYSQLI_ASSOC);

$getID = "SELECT UserID FROM personal_data WHERE Email='$email'";
$resultID = mysqli_query($conn, $getID);
$valueID = mysqli_fetch_array($resultID);
$UserID = $valueID["UserID"];


//perhaps a better return value than "email" => $email might be to return: "type" => "master" / "temp"; depending on whether or not the barcode is stored in the master DB or the user's temporary DB
if($value["BarcodeID"] == $barcode){
	echo json_encode(array("BarcodeID" => $barcode, "email" => $email, "UserID" => $UserID));
} else {
	//get UserID
	//User USerID and BarcodeID to check against temporaryDB to see if the user has already scanned this item in the past and if so, add to intermediate DB
	$tempQuery = "SELECT BarcodeID FROM temporary_product_data WHERE UserID='$UserID' AND BarcodeID='$barcode' LIMIT 1";
	$resultQuery = mysqli_query($conn, $tempQuery);
	$valueQuery = mysqli_fetch_array($resultQuery);

	if($valueQuery["BarcodeID"] == $barcode){ //query has returned data relating to a barcodeID from DB => add to intermediate DB
		echo json_encode(array("BarcodeID" => $barcode, "email" => $email, "UserID" => $UserID));
	} else {
		echo json_encode(array("BarcodeID" => "failure", "email"=> $email ,"UserID" => $UserID));
	}
}

mysqli_close($conn);
?>