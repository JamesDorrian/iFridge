$(document).ready(function(){
	$.get("../php/security.php", function(response){
            if(response.result == "failure"){
                //location.href='../user_login.html';
            } else {
                   $("#header").load("../header_logout.html");
               }
    }, "json");//EO get

	$("#lastRow").hide();
	$('#backButton').hide();
	$('#layout').hide();

    $("#getMealsFromCurrent").click(function(){ //remove s to fix
    	$('#foodstuffs').empty();//stop duplication on double click
    	$('#layout').show();
    	$.get("../php/security.php", function(secure){
    		$.post("../php/meals.php", {email: secure.data.authUser}, function(res){
                // res.weight.forEach(function(arr){
                //     alert(arr);
                // });
                $("#getMealsFromCurrent").hide();
    			$("#button2").hide();
    			$("#list").show();
    			res.result.forEach(function(element){
    				$.post("../php/getmeals.php", {mealID: element}, function(meals){
    					var mealID = meals.MealID;
    					var mealName = meals.MealName;
    					//save to 2d array
    					var listItem = "<li style='border: 3px solid white; border-radius: 5px; width:80vw; margin: 0 auto; margin-bottom: 5px; background-color: #BDBDBD;' id='row'>" + "<span id='mealID' style='display:none;'>" + mealID + "</span>" + mealName + "</li>";
    					//use array for event binding
    					$(listItem).appendTo('#foodstuffs');
    					//display each element as part of list
    					//when clicked hide list and show individual recipe as based on mealID
    					//have back button which will redisplay all meals
 						}, "json"); //eo getMeals
    				//post array of mealIDs and display
    			});//EO foreach
    			
    		}, "json");//EO post to meals.php
    	}, "json");//EO security
    });//EO click

    $("#list").on('click', '#row', function(){
    	$('#list').hide();
    	var id = $(this).closest('li').find('#mealID').text();
    	$('#display').show();
    	$('#backButton').show();
    	$.post("../php/getmeals.php", {mealID: id}, function(meals){
    					var mealid = meals.MealID;
    					var mealname = meals.MealName;
    					var cooktime = meals.CookTime;
    					var ingredients = meals.Ingredients;
                        var weight = meals.Weight;
    					var directions = meals.Directions;
    					var difficulty = meals.Difficulty;
    					var link = meals.ImageURL;
    					$('#image').html("<img src='" + link + "' style='height:40vh; width:60vw;' >")
    					$('#title').html("<h1>"+mealname+"</h1>")
    					$('#difficulty').html("<p><b>Difficulty:</b>"+difficulty+"/5</p>")
    					$('#cookTime').html("<p><b>CookTime:</b>"+cooktime+" (minutes)</p>")
                        var ingredients_arr = ingredients.split(",");
                        var weight_arr = weight.split(",");
                        $('#ingredients').html("<p><b>Ingredients:</b></p>");
                        for (var i = ingredients_arr.length - 1; i >= 0; i--) {
                            $('#ingredients').after("<p class='removable'>" + weight_arr[i] + " " + ingredients_arr[i] + "</p>");
                        }
    					$('#directions').html("<h3>Directions:</h3>")
    					var direction = directions.split("&&");
    					direction.reverse();
    					direction.forEach(function(element){
    						$('#directions').after("<p class='removable'>"+element+"</p>");
    					});
    	}, "json");
	});

	$("#back").on('click', '#backButton', function(){
    	$('.removable').remove(); //removes elements added by .after
		$('#list').show();
    	$('#display').hide();
    	$('#backButton').hide();
	})
});