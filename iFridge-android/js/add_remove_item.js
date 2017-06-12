$(document).ready(function(){
	// THIS IS THE FILE RESPONSIBLE FOR CONTROLING THE TEST HTML PAGE FOR ADDING BARCODES
	$('#display_error').hide();
	$('#display_error1').hide();
	$('#display_error2').hide();
	$('#display_error3').hide();
	$.get("../php/security.php", function(response){
	 		if(response.result == "failure"){
	 			location.href='../user_login.html';
	 		} else {
	 			$("#header").load("../header_logout.html");
	 		} //eo else
	 		   });//eo get security
	
	//'manually add an item to DB' - spiderweb1
	$('#manualadd').click(function(){
		$('#options').toggle();
	});//eo manualadd click

	//'i know the barcode number of the item i wish to add' == THIS WILL BE USED FOR SCAN IN ==
	$('#hasbarcode').click(function(){
		$('#nobarcodeform').hide();
		// $('#options').show();
		$('#hasbarcodeform').toggle();
	});//eo hasbarcode click

	//'i do not know the barcode number'
	$('#nobarcode').click(function(){
		$('#hasbarcodeform').hide();
		//pictures here
	});

	//'manually remove an item to DB' - spiderweb2
	$('#manualremove').click(function(){
		$('#removeoptions').toggle();
	});//eo manualadd click

	//'i know the barcode number of the item i wish to remove' == THIS WILL BE USED FOR SCAN OUT ==
	$('#removebarcode').click(function(){
		// $('#removeoptions').show();
		$('#removebarcodeform').toggle();
	});

	//'i dont know the barcode of the item i want to remove, show me the list an i'll delete whatever i want
	$('#removelist').click(function(){
		window.location.replace('../item_database.html');
	});


	//checks that the 3 fields for new item addition are okay and adds to product DB
	$('#user_prompt').click(function(){
		//get 3 input vals
		var barcode = $('#barcodeIN').val();//not sure if this works
		var product = $('#ProductName').val();
		var brand = $('#BrandName').val();
		var weight = $('#Weight').val();
		if($('#gram').is(':checked')){
			$('#display_error3').hide();
			var state = 0;
		} else if ($('#ml').is(':checked')){
			$('#display_error3').hide();
			var state = 1;
		} else {
			$('#display_error3').html("*Error with Product Name");
		}
		//check them using regex
		if (checkProduct(product) && checkBrand(brand) && checkWeight(weight) && (state == 0 || state == 1)){
			//post 3 fields to manual_add.php where it will use loop to iterate and see where next free int is and create new product
			$.get("../php/security.php", function(response){ //get email
				$.post("../php/add_temp_scan.php", {email1: response.data.authUser, barcode1:barcode, product1:product, brand1:brand, weight1:weight, state1:state}, function(data){
					if(data.result == "success"){
						alert('win');
					} else {
						alert(data.result);
					}
				}, "json"); //end of outer post
			}, "json");//EO get
			//then adds product to temporary DB
			//some kind of are you sure these details are correct? YES/NO
		} else {
			console.log('REGEX failed');
		}
	}); //EO user_prompt.click()


	//checks the barcode you entered to add it
	$('#submitbarcodeIN').click(function(){
		//use regex to ensure correct barcode format
		var barcodeIN = $('#barcodeIN').val();
		console.log("barocde num: " + barcodeIN);
		if (checkBarcode(barcodeIN)){
			$('#barcodeIN_error').hide();
			//send to product DB check if the product exists, if exists add to intermediate DB for user
			$.get("../php/security.php", function(response){ //get email
				$.post("../php/product_query.php", {email1: response.data.authUser, barcode1: barcodeIN}, function(data){
					console.log("barcode Num returned: " + data.BarcodeID + "Email" + response.data.authUser);
					if(data.BarcodeID == barcodeIN){
						console.log("barcode ID after passing if: " + data.BarcodeID);
						//exists in the DB
						//simply add to intermediate db
						addToIntermediateDB(barcodeIN);
						console.log("addition executed");
					} else {
						$('#barcodeIN_error').show();
						$('#barcodeIN_error').html('This barcode is not in the any of our databases.<br>Fill in the details below to add it for future use.');
						$('#user_prompt_box').toggle();
						//does not exist in the DB, prompt user to add details, then add this info into database
					}
				}, "json"); //end of outer post
			}, "json");//EO get
				//if it doesn't exist, prompt user to enter the details manually
		} else {
			$('#barcodeIN_error').show();
			$('#barcodeIN_error').html('*Invalid barcodes');
		}
	}); //EO submitbarcode

	$('#submitbarcodeOUT').click(function(){
		//use regex to ensure correct barcode format
		var barcodeOUT = $('#barcodeOUT').val();

		if (checkBarcode(barcodeOUT)){ //regex check
			$('#barcodeOUT_error').hide(); //hide error
			//send barcode to product DB, check if the product exists
			$.get("../php/security.php", function(response){ //get email
				$.post("../php/product_query.php", {email1: response.data.authUser, barcode1: barcodeOUT}, function(data){
					console.log(data.BarcodeID);
					if(data.BarcodeID == barcodeOUT){ //either equal of null
						//barcode exists & now must be check in intermediate DB
						//get UserID & Barcode find it & remove it
						//check intermediate DB
					removeFromIntermediateDB(barcodeOUT);		
					} else {
						//product not in DB
						$('#barcodeOUT_error').show();
						$('#barcodeOUT_error').html('*Barcode not in our DB of products.');
					}
				}, "json");//end of post
			}, "json");//EO get
			//if it exists in both, remove it
			//if it does not exist in product DB throw error
			//if it does not exist in intermediate DB throw error
			//if it doesn't exist, prompt user to enter the details manually
			} else {
				$("#barcodeOUT_error").show();
				$('#barcodeOUT_error').html('*Invalid barcode');
			}
	});




function removeFromIntermediateDB(barcodeOUT){
	$.get("../php/security.php", function(response){ //get email
			// console.log(response.data.authUser);
			if(response.data.authUser != null){ //make sure not null
				$.post("../php/profile.php", {email1: response.data.authUser}, function(newdata){ //send to profile to get UserId
							// this is user ID 'newdata.UserID'
							$.post("../php/removescan.php", {UserID1: newdata.userID, Barcode1: barcodeOUT}, function(data){
								if(data.result == "success"){
									$('#barcodeOUT_error').show();
									$('#barcodeOUT_error').html("Item successfully removed from DB.");
								} else {
									$('#barcodeOUT_error').show();
									$('#barcodeOUT_error').html("Item is not in your DB");
								}
							}, "json");
						}, "json");//EO post
			} else {
				return null;
			}
					}, "json");//EO get
}

function addToIntermediateDB(barcodeIN){
	$.get("../php/security.php", function(response){ //get email
			console.log("Email: " + response.data.authUser);
			if(response.data.authUser != null){ //make sure not null
				$.post("../php/profile.php", {email1: response.data.authUser}, function(newdata){ //send to profile to get UserId, profile returns a user's data thats stored in personal_data
							// this is user ID 'newdata.UserID'
							console.log("UserID : " + newdata.userID + "BarcodeID: " + barcodeIN);
					$.post("../php/addscan.php", {UserID1: newdata.userID, Barcode1: barcodeIN}, function(data){
								$('#barcodeIN_error').show();
								$('#barcodeIN_error').html("New item added.");
							}, "json");//EO post
						}, "json");//EO post
			} else {
				return null;
			}
					}, "json");//EO get
}

//ALL FUNCTIONS BELOW ARE REGEX CHECKS
function checkProduct(product){ 
	var product_check = /^[A-Z ]{1,20}$/i;
	if (product_check.test(product)){
		$('#display_error').hide();
		return true;
	} else {
		$('#display_error').html("*Error with Product Name");
		return false;
	}
}

function checkBrand(brand){
	var brand_check = /^[A-Z ]{1,20}$/i;
	if (brand_check.test(brand)){
		$('#display_error1').hide();
		return true;
	} else {
		$('#display_error1').html("*Error with Brand Name");
		return false;
	}
}

function checkWeight(weight){
	var weight_check = /^[0-9 ]{1,20}$/i;
	if (weight_check.test(weight)){
		$('#display_error2').hide();
		return true;
	} else {
		$('#display_error2').html("*Ensure weight contains only numbers");
		return false;
	}
}

//check function to ensure one of the boxes for weight or volume are checked

function checkBarcode(barcode){
	var barcode_check = /^[0-9 ]{12,13}$/i;
	if (barcode_check.test(barcode)){
		return true;
	} else {
		return false;
	}
}

});//eof






