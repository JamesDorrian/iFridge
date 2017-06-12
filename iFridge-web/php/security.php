<?php
	session_start();


	if (!array_key_exists("authUser", $_SESSION)) {
		echo json_encode(["result"=>"failure"]);
		exit();
	}

	echo json_encode(["result"=>"success", "data"=>$_SESSION]); //returns email
?>

