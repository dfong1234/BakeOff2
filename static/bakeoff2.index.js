//	................................................................................
//  bakeoff2.index.js
//	javascript for index page of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 10/23/2019
//	................................................................................

var tabName = 'Food';
var color = 'tomato';
  
openTab(tabName, color) 


$("#b_search").click(function(){
  var my_data = {"user": "Daniel",
                 "food": $("#search").val(),
                 "meal": $("#meal_time").val(),
                 "date": $("#datepicker").val()
                };
  $.post("/food-log", my_data, null, "json");
  alert("Sent Data to History");
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
