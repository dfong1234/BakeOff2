//	................................................................................
//  bakeoff2.index.js
//	javascript for index page of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 10/23/2019
//	................................................................................

var tabName = 'Food';
var color = 'crimson';
openTab(tabName, color) 


$("#search-icon").click(function(){
   var name = $("search-keyword").val();
   $("food-name").val(name);
});


$("#food_add_icon").click(function(){
  var my_data = {"user": "Daniel",
                 "food": $("#search").val(),
                 "meal": $("#meal_time").val()
                };
  $.post("/food-log", my_data, null, "json");
  alert("Sent Data to History");
});


// Find a <table> element with id="food-fact":
var table = document.getElementById("food-fact");





/*  ---  ---  */

// --- Label Initialization ---


// --- Variables ---



// --- Subroutine Functions ---


// --- In-Use ---


/*  ---  ---  */


// --- Variables ---

// --- Subroutine Functions ---


// --- In-Use ---
