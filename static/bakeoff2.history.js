//	................................................................................
//  bakeoff2.history.js
//	javascript for index page of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 10/23/2019
//	................................................................................

var tabName = 'History';
var color = 'orange';

openTab(tabName, color) 

$("#b_load").click(function(){
  $.get("/food-log", function(data){
    var sel_date = $("#datepicker").val()
    $(".food_list").empty();
    var meal_items = data[sel_date]["Breakfast"];
    for(i = 0; i < meal_items.length; i++){
        $("#b_list").append("<li>" + meal_items[i] + "</li>");
    }

    meal_items = data[sel_date]["Lunch"];
    for(i = 0; i < meal_items.length; i++){
        $("#l_list").append("<li>" + meal_items[i] + "</li>");
    }

    meal_items = data[sel_date]["Dinner"];
    for(i = 0; i < meal_items.length; i++){
        $("#d_list").append("<li>" + meal_items[i] + "</li>");
    }
    alert("Data was retrieved for user: " + data["user"]);
  });
});








/*  ---  ---  */

// --- Label Initialization ---


// --- Variables ---



// --- Subroutine Functions ---


// --- In-Use ---


/*  ---  ---  */


// --- Variables ---

// --- Subroutine Functions ---


// --- In-Use ---
