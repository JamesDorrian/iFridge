<?php
// echo "php test";
//server info
$servername = "localhost";
$username = "ifridgea_console";
$dbpassword = "password";
$dbname = "ifridgea_personal_data";


//Establish server connection
$conn = new mysqli($servername, $username, $dbpassword, $dbname);


// Check connection for failure 
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

//Read in info from registration.js
$name = mysqli_real_escape_string($conn, $_POST['name1']);
$email = mysqli_real_escape_string($conn, $_POST['email1']);
$age = mysqli_real_escape_string($conn, $_POST['age1']);
$address = mysqli_real_escape_string($conn, $_POST['address1']);
$password = mysqli_real_escape_string($conn, $_POST['password1']); //need to make safe using escapes

//check if email already exists == NOT WORKING ==
// if (mysqli_query($conn, "SELECT Email, Name FROM personal_data WHERE Email='$email'") === TRUE){
// 	echo json_encode(array("response"=>"EmailExists");
// }


//insert into table
$sql = "INSERT INTO personal_data (Name, Email, Age, Address, Password)
VALUES ('$name', '$email', '$age', '$address', '$password')";
$result = mysqli_query($conn, $sql);

//insert data into SQL and execute if successful

if ($result) {
    echo json_encode(array("response"=>"success"));
} else {
    echo json_encode(array("response"=>"Error"));
}

$conn->close(); //close server connection
?>