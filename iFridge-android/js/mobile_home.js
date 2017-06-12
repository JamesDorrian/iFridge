$(document).ready(function(){
	// $.ajaxSetup({async: false});
	$.get("../php/security.php", function(response){
	 		if(response.result == "failure"){
	 			location.href='../user_login.html';
	 		} else {
	 			//from here down is the relevant code
	 			$.post("../php/item_database.php", {email1:response.data.authUser}, function(indata){
	 				//console.log(indata.items);
	 				indata.items.forEach(function(element){
	 					//console.log(indata.items);
	 					$BarcodeID = element.BarcodeID;
	 					$BrandName = element.BrandName;
	 					$ProductName = element.ProductName;
	 					$Weight = element.Weight;
	 					$State = element.State;
                        if($State == 0){
                            var x = "g";
                        } else {
                            var x = "ml";
                        }
                        // console.log(jQuery.format.toBrowserTimeZone(element.Date));
                        // console.log(jQuery.format.prettyDate());
                        // $Date = jQuery.format.prettyDate(element.Date+"Z");
	 					$Date = element.Date;

	 					// $row = "<tr class='row'><td class='rowbarcode'>" + $BarcodeID + "</td>" + "<td>" + $ProductName + "</td>" + "<td>" + $BrandName + "</td>" + "<td>" + $Weight + x + "</td>" + "<td>" + $Date + "</td>" + "<td>" + "<button class='delete'>Delete</button>" + "</td></tr>";
                        $row = "<tr class='row'><td class='rowbarcode' style='display:none;'>" + $BarcodeID + "</td>" + "<td>" + $ProductName + "</td>" + "<td>" + $BrandName + "</td>" + "<td>" + $Weight + x + "</td>" + "<td>" + $Date + "</td>" + "<td>" + "<button class='delete'>Delete</button>" + "</td></tr>";
	 					$("#final_row").before($row);
	 				}); //eo foreach
	 			}, "json");//eo post
	 		} //eo else
	 }, "json"); //eo get

	$("#contenttable").on('click', '.delete', function(){
    	var BarcodeID = $(this).closest('tr').find('.rowbarcode').text(); //get barcode of row to delete
    	//console.log(BarcodeID);
    	//send barcode ID and UserID to removescan
    	$.get("../php/security.php", function(response){ //get email
    		$.post("../php/profile.php", {email1:response.data.authUser}, function(data){ //get userID
    			//console.log("Email: " + response.data.authUser); 
    			$.post("../php/removescan.php", {UserID1:data.userID, Barcode1:BarcodeID}, function(newdata){ //remove item from intermediate database
    				//console.log("success/failure: " + newdata.result);
    				if (newdata.result == "success"){
    					location.href="../item_database.html";
    				} else {
    					$('#display_error').html("An Error occured. Item not deleted.");
    				}
    			}, "json");
    		}, "json");
    	}, "json");
    	
    	//check if success or failure. if failure nothing has been removed. if success item has been removed.
    }); //EO CONTENTTABLE


$("#search").keyup(function () {
    var value = this.value.toLowerCase().trim();

    $("table tr").each(function (index) {
        if (!index) return;
        $(this).find("td").each(function () {
            var id = $(this).text().toLowerCase().trim();
            var not_found = (id.indexOf(value) == -1);
            $(this).closest('tr').toggle(!not_found);
            return not_found;
        });
    });
});

});//eof