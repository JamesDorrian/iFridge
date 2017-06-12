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

$email = mysqli_real_escape_string($conn, $_POST['email']);

$getID = "SELECT UserID FROM personal_data WHERE Email='$email'";
$resultID = mysqli_query($conn, $getID);
$valueID = mysqli_fetch_array($resultID);
$UserID = $valueID["UserID"];
// echo(json_encode($UserID)); //works
$ingredientArray = array();

//take in users ingredient list
//current inventory get barcodes
$getUserIngredients = "SELECT BarcodeID FROM current_inventory WHERE UserID = '$UserID'";
$resultIngredients = mysqli_query($conn, $getUserIngredients);
while ($ingredientValues = mysqli_fetch_array($resultIngredients, MYSQLI_ASSOC)){
	$ingred = $ingredientValues["BarcodeID"];
	// echo(json_encode($ingred));//works
	$getProductNames = "SELECT ProductName FROM product_data WHERE BarcodeID = '$ingred'";
	$productNameResults = mysqli_query($conn, $getProductNames);
	$productName = mysqli_fetch_array($productNameResults);
	if(!isset($productName)){
		$tempSqlCheck = "SELECT ProductName FROM temporary_product_data WHERE BarcodeID='$ingred'";
		$tempCheck = mysqli_query($conn, $tempSqlCheck);
		$valueTemp = mysqli_fetch_array($tempCheck);
		array_push($ingredientArray, $valueTemp["ProductName"]);
	} else {
		array_push($ingredientArray, $productName["ProductName"]);
	}

}
//echo(json_encode($ingredientArray));//works


$chosenArray = array();
$weightArray = array();
$availableMeals = array();
//take in meal ingredients
$getMeals = "SELECT MealID, Ingredients, Weight FROM meal_data";
$result = mysqli_query($conn, $getMeals);
while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
	$subArray = array();
    $sub_weight = array();
	array_push($subArray, $row["MealID"]);
    $ingredients = $row["Ingredients"];
    $weights = $row["Weight"];
    $weightValues = explode(",", $weights);
    $individual = explode(",", $ingredients); //pasta pesto salt
    //if ingredients in user ingredient list add mealid to array
    $counter = 0;
    foreach ($individual as $key1 => $value1) {
    	foreach ($ingredientArray as $key2 => $value2) {
    		//list of adjectives
    		$percent = levenshtein($value1, $value2, 1, 7, 5);//insertion, replacement, deletion
    		$percentInverse = levenshtein($value1, $value2, 5, 7, 1);
    		if($percent <= 8 || $percentInverse <= 8){
                $counter += 1;
    			array_push($subArray, $value2);
    			break 1;
    		}
    	}
    }
    $sizeOfMeal = count($individual);

    if ($sizeOfMeal == $counter){
        array_push($chosenArray, $subArray);
    	array_push($availableMeals, $row["MealID"]);
        array_push($sub_weight, $row["MealID"]);
        foreach ($weightValues as $key1 => $value1){
            array_push($sub_weight, $value1);
        }
        array_push($weightArray, $sub_weight);
    }
    //echo(json_encode($individual)); //works
}

echo(json_encode(array("result" => $availableMeals, "chosen" => $chosenArray, "weight" => $weightArray)));
//seperate into ingredients

//THIS IS COMPARING THE 2 ARRAYS BUT IS INACCURATE
// while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
//     $ingredients = $row["Ingredients"];
//     $individual = explode(",", $ingredients); //pasta pesto salt
//     //if ingredients in user ingredient list add mealid to array
//     $interimArray = array_intersect($individual, $ingredientArray);
//     //echo(json_encode($individual));
//     //echo(json_encode($interimArray));
//     $common = count($interimArray);
//     $recipe = count($individual);
//     if ($common == $recipe){
//     	array_push($availableMeals, $row["MealID"]);
//     }
//     //echo(json_encode($individual)); //works
// }

//do check to see if all ingredients for meal in ingredient list and if so save to array of meals to be returned

//return meal IDs

?>