<?php 

//server info
$servername = "localhost";
$username = "ifridgea_console";
$dbpassword = "password";
$dbname = "ifridgea_personal_data";

$conn = new mysqli($servername, $username, $dbpassword, $dbname);

session_start();

if (!array_key_exists("authUser", $_SESSION)) {
		echo json_encode(["result"=>"failure"]);
		exit();
	}


if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$email = mysqli_real_escape_string($conn, $_POST['email1']);

//get userID
$getUserID = "SELECT UserID FROM personal_data WHERE Email='$email' LIMIT 1";
$resultUserID = mysqli_query($conn, $getUserID);
$valueUserID = mysqli_fetch_array($resultUserID, MYSQLI_ASSOC);
$UserID = $valueUserID["UserID"]; 

//get all barcodeNumbers from grocery list
$getItemsInDB = "SELECT Product, TimeIn FROM shopping_list WHERE UserID='$UserID'"; 
$resultItems = mysqli_query($conn, $getItemsInDB); 
// $valueItems = mysqli_fetch_all($resultItems, MYSQLI_ASSOC);
$valueItems = array();
while ($valueItems[] = mysqli_fetch_array($resultItems));
array_pop($valueItems);
echo json_encode(array("UserID" => $valueUserID["UserID"], "items" => $valueItems));
?>