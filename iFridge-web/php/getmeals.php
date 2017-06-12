<?php
	$servername = "localhost";
	$username = "ifridgea_console";
	$dbpassword = "password";
	$dbname = "ifridgea_personal_data";

	//Establish server connection
	$conn = new mysqli($servername, $username, $dbpassword, $dbname);

	//Session
	session_start();
	$mealID = mysqli_real_escape_string($conn, $_POST['mealID']);

	//Check connection for failure 
	if (mysqli_connect_errno()) {
	    $error = (mysqli_connect_error());
	    echo "error";
	    exit();
	}
	
	$sql = "SELECT MealID, MealName, CookTime, Ingredients, Weight, Directions, Difficulty, ImageURL FROM meal_data WHERE MealID='$mealID'";
	$result = mysqli_query($conn, $sql);
	$value = mysqli_fetch_array($result, MYSQLI_ASSOC);

	$val = $value["MealID"];

	echo json_encode(array("MealID"=>$val, "MealName"=>$value["MealName"], "CookTime"=>$value["CookTime"], "Ingredients"=>$value["Ingredients"], "Weight"=>$value["Weight"], "Directions"=>$value["Directions"], "Difficulty"=>$value["Difficulty"], "ImageURL"=>$value["ImageURL"]));
?>