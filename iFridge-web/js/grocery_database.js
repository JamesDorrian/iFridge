$(document).ready(function(){
    //THIS IS THE JAVASCRIPT FILE RESPONSIBLE FOR DISPLAYING THE USER's GROCERY LIST
    $('.fa').html("<span style='visibility:hidden;'>xx</span>");
    $('#date').closest('th').find('.fa').html("&#xf063;");
    
    //Nested PHP calls to display the grocery list
    $.get("../php/security.php", function(response){ //check if logged in, success-> continue, failure-> redirect
            if(response.result == "failure"){
                location.href='../user_login.html';
            } else {
                   $("#header").load("../header_logout.html");
                        //from here down is the code relevant to retreieving the db items
                        $.post("../php/getgrocery.php", {email1:response.data.authUser}, function(indata){ //get grocery list items
                            indata.items.forEach(function(element){
                                console.log(indata.items);
                                var ProductName = element.Product;
                                var TimeIn = element.TimeIn;
                                $row = "<tr class='row'>" + "<td class='rowproduct'>" + ProductName + "</td>" + "<td>" + TimeIn + "</td>" + "<td>" + "<button class='delete'>- <br>LIST</button>" + "</td></tr>";
                                $("tbody").append($row);
                            }); //eo foreach
                        }, "json");//eo post
            } //eo else
     }, "json"); //eo get



   $("#contenttable").on('click', '.delete', function(){ //remove an item when 'delete' is clicked
        var Product = $(this).closest('tr').find('.rowproduct').text(); //get barcode of row to delete
        var row = $(this).closest('tr').hide();
        //send barcode ID and UserID to removescan
        $.get("../php/security.php", function(response){ //get email
            $.post("../php/profile.php", {email1:response.data.authUser}, function(data){ //get userID
                $.post("../php/removegrocery.php", {UserID1:data.userID, Product1:Product}, function(newdata){ //remove item from intermediate database
                    //console.log("success/failure: " + newdata.result);
                    if (newdata.result == "success"){
                        // location.href="../grocery_database.html";
                    } else {
                        $('#display_error').html("An Error occured. Item not removed from shopping list.");
                    }
                }, "json");
            }, "json");
        }, "json");
        //check if success or failure. if failure nothing has been removed. if success item has been removed.
    }); //EO CONTENTTABLE

   $("#add_item").submit(function(e) {
    e.preventDefault();
    });

   $("#add_item").bind('click', function(){ //adding an item to the grocery list
   		var grocery = $('#input_add').val();
   		if(checkProduct(grocery)){
   		$.get("../php/security.php", function(response){ //get email
   			console.log("Email: " + response.data.authUser); 
    		$.post("../php/profile.php", {email1:response.data.authUser}, function(data){ //get userID
    			console.log("Email: " + response.data.authUser); 
    			$.post("../php/addgrocery.php", {UserID1:data.userID, Product1:grocery}, function(newdata){ //remove item from intermediate database
    				if (newdata.result == "success"){
    					//location.href="../grocery_database.html";
                        $row = "<tr class='row'>" + "<td class='rowproduct'>" + grocery + "</td>" + "<td>" + "JUST NOW" + "</td>" + "<td>" + "<button class='delete'>Remove from Shopping List</button>" + "</td></tr>";
                        $("#final_row").before($row);
    				} else {
    					$('#display_error').html("An Error occured while adding your product.");
    				}
    			}, "json");
    			return false; //prevent default following of href
    		}, "json");
    		return false;
    	}, "json");
    	return false;
    } else {
    	$('#display_error').html("Please enter a valid product.");
    	return false; //stop refresh before error is displayed
    }
    });//EO click
               

//search bar form at top of page
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

//REGEX
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

 //HEADER SORTING
        $('th').each(function (column) {
            $(this).addClass('sortable').click(function () {
                $('.fa').html("<span style='visibility:hidden;'>xx</span>");
                var name = $(this).text();
                    var findSortKey = function ($cell) {
                        return $cell.find('.sort-key').text().toUpperCase()+ ' ' + $cell.text().toUpperCase();

                    };
                    var sorter = $(this).is('.sortAsc') ? -1 : 1;
                    $(this).is('.sortAsc') ? $(this).closest('th').find('.fa').html("&#xf062;") : $(this).closest('th').find('.fa').html("&#xf063;");
                    var $rows = $(this).parent().parent().parent().find('tbody tr').get();
                    var bob = 0;

                    //loop through and find
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
                });
            });//EO TH each


});//eof