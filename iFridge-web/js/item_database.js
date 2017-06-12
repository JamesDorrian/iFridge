$(document).ready(function(){
	$('.fa').html("<span style='visibility:hidden;'>xx</span>");
    $('#date').closest('th').find('.fa').html("&#xf063;");
	$.get("../php/security.php", function(response){
	 		if(response.result == "failure"){
	 			location.href='../user_login.html';
	 		} else {
	 			   $("#header").load("../header_logout.html");
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
                        $row = "<tr class='row'><td>" + $ProductName + "</td>" + "<td>" + $BrandName + "</td>" + "<td>" + $Weight + x + "</td>" + "<td>" + $Date + "</td>" + "<td class='rowbarcode' style='display:none;'>" + $BarcodeID + "</td>"  +  "<td>" + "<button class='delete'>Delete</button>" + "</td></tr>";
	 					$("tbody").append($row);
	 				}); //eo foreach
	 			}, "json");//eo post
	 		} //eo else
	 }, "json"); //eo get

	$("#contenttable").on('click', '.delete', function(){
    	var BarcodeID = $(this).closest('tr').find('.rowbarcode').text(); //get barcode of row to delete
        var row = $(this).closest('tr').hide();
    	//console.log(BarcodeID);
    	//send barcode ID and UserID to removescan
    	$.get("../php/security.php", function(response){ //get email
    		$.post("../php/profile.php", {email1:response.data.authUser}, function(data){ //get userID
    			//console.log("Email: " + response.data.authUser); 
    			$.post("../php/removescan.php", {UserID1:data.userID, Barcode1:BarcodeID}, function(newdata){ //remove item from intermediate database
    				//console.log("success/failure: " + newdata.result);
    				if (newdata.result == "success"){
    					//location.href="../item_database.html";
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

//HEADER SORTING
        $('th').each(function (column) {
            if($(this).is('.nosort')){ //stop the sorting of weights, as they contain both numbers and letters they are sorted as strings which looks terrible
                //possible work around is putting the 'g' or 'ml' in a seperate span. CURRENT: <td>100g</td> FUTURE: <td><span id='numerical'></span><span id='measure'></span></td>

            } else {
            $(this).addClass('sortable').click(function () {
                $('.fa').html("<span style='visibility:hidden;'>xx</span>");
                    var findSortKey = function ($cell) {
                        return $cell.find('.sort-key').text().toUpperCase()+ ' ' + $cell.text().toUpperCase();

                    };
                    var sorter = $(this).is('.sortAsc') ? -1 : 1;
                    $(this).is('.sortAsc') ? $(this).closest('th').find('.fa').html("&#xf062;") : $(this).closest('th').find('.fa').html("&#xf063;");
                    var $rows = $(this).parent().parent().parent().find('tbody tr').get();
                    var bob = 0;

                    //cycle rows and find
                    $.each($rows, function (index, row) {
                        row.sortKey = findSortKey($(row).children('td').eq(column));
                    });

                    //compare and sort the rows alphabetically or numerically
                    $rows.sort(function (a, b) {                       
                        if (a.sortKey.indexOf('-') == -1 && (!isNaN(a.sortKey) && !isNaN(a.sortKey))) {
                             //Rough Numeracy check                          
                                
                                if (parseInt(a.sortKey) < parseInt(b.sortKey)) {
                                    return -sorter;
                                }
                                if (parseInt(a.sortKey) > parseInt(b.sortKey)) {                                
                                    return sorter;
                                }

                        } else {
                            if (a.sortKey < b.sortKey) {
                                return -sorter;
                            }
                            if (a.sortKey > b.sortKey) {
                                return sorter;
                            }
                        }
                        return 0;
                    });

                    //add the rows to the end of table
                    $.each($rows, function (index, row) {
                        $('tbody').append(row);
                        row.sortKey = null;
                    });

                    //get column order
                    $('th').removeClass('sortAsc sortDes');
                    var $sortColumn = $('th').filter(':nth-child(' + (column + 1) + ')');
                    sorter == 1 ? $sortColumn.addClass('sortAsc') : $sortColumn.addClass('sortDes');

                    //find the column to be sorted
                    $('td').removeClass('sorted').filter(':nth-child(' + (column + 1) + ')').addClass('sorted');
                });}
            });//EO TH each

});//eof