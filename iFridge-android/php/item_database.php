<<?php 

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

//get email from $.post() in JS file
$email = mysqli_real_escape_string($conn, $_POST['email1']);
// print_r($email); //works,

//get userID from DB
$getUserID = "SELECT UserID FROM personal_data WHERE Email='$email' LIMIT 1";
$resultUserID = mysqli_query($conn, $getUserID);
$valueUserID = mysqli_fetch_array($resultUserID, MYSQLI_ASSOC);
$UserID = $valueUserID["UserID"]; //get quser ID - RETURNS 1 for jimdor@live.ie
// print_r($UserID);//returns 1

//get all barcodeNumbers from intermediate DB
$getItemsInDB = "SELECT BarcodeID, TimeIn FROM current_inventory WHERE UserID='$UserID'"; 
$resultItems = mysqli_query($conn, $getItemsInDB); 
// $valueItems = mysqli_fetch_all($resultItems, MYSQLI_ASSOC);
//this works
$valueItems = array();
while ($valueItems[] = mysqli_fetch_array($resultItems));

//get row for each Barcode in productDb and return to JS

$mainArray = array();
for ($i = 0; $i < count($valueItems); $i++){
	$location = $valueItems[$i]["BarcodeID"];
	$getBarcodeID =  "SELECT BarcodeID, BrandName, ProductName, Weight, State FROM product_data WHERE BarcodeID='$location'";
	$resultBarcode = mysqli_query($conn, $getBarcodeID);
	$valueBarcode = mysqli_fetch_array($resultBarcode);

	if(!isset($valueBarcode)){
		$tempSqlCheck = "SELECT BarcodeID, BrandName, ProductName, Weight, State FROM temporary_product_data WHERE BarcodeID='$location' AND UserID='$UserID'";
		$tempCheck = mysqli_query($conn, $tempSqlCheck);
		$valueTemp = mysqli_fetch_array($tempCheck);
		$subArray = array("BarcodeID" => $valueTemp["BarcodeID"], "BrandName" => $valueTemp["BrandName"], "ProductName" => $valueTemp["ProductName"], "Weight" => $valueTemp["Weight"], "State" => $valueTemp["State"], "Date" => $valueItems[$i]["TimeIn"]); //this is for fetch array
	
		array_push($mainArray, $subArray);
	} else {
		$subArray = array("BarcodeID" => $valueBarcode["BarcodeID"], "BrandName" => $valueBarcode["BrandName"], "ProductName" => $valueBarcode["ProductName"], "Weight" => $valueBarcode["Weight"],"State" => $valueBarcode["State"], "Date" => $valueItems[$i]["TimeIn"]); //this is for fetch array
	
		array_push($mainArray, $subArray);
	}
	// $subArray = json_encode(array("BarcodeID" => $valueBarcode[0], "BrandName" => $valueBarcode[1], "ProductName" => $valueBarcode[2], "Weight" => $valueBarcode[3]));
}

// $getBarcodeID =  "SELECT BarcodeID, BrandName, ProductName, Weight FROM product_database WHERE BarcodeID='$item'";

array_pop($mainArray);
echo json_encode(array("UserID" => $valueUserID["UserID"], "items" => $mainArray));
?>