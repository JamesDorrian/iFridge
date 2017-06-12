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
	$BarcodeID = mysqli_real_escape_string($conn, $_POST['Barcode1']);

	//Check connection for failure 
	if (mysqli_connect_errno()) {
	    $error = (mysqli_connect_error());
	    echo "error";
	    exit();
	}
	
	$sql = "SELECT UserID, BarcodeID FROM current_inventory WHERE UserID='$UserID' AND BarcodeID='$BarcodeID' LIMIT 1";
	$result = mysqli_query($conn, $sql);
	$value = mysqli_fetch_array($result, MYSQLI_ASSOC);
	//some check will have to go here to tell the system to remove the oldest version if more than 1 of the same item exists

	if ($value["UserID"] == $UserID){
		//removed from current inventory
		$remove = "DELETE FROM current_inventory WHERE BarcodeID='$BarcodeID' AND UserID='$UserID' LIMIT 1";
		//add to recently removed
		$add_to_recently_removed = "INSERT INTO previous_inventory (UserID, BarcodeID) VALUES ('$UserID','$BarcodeID')";
		
		if($result_remove = mysqli_query($conn, $remove) && $result_recently_removed = mysqli_query($conn, $add_to_recently_removed)){
			echo json_encode(array("result" => "success"));
		}
	} else {
		echo json_encode(array("result" => "failure"));
	}



mysqli_close($conn);
?>