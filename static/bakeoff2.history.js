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


$.get("/food-log", function(data){
  alert("Data was retrieved for user: " + data["user"]);

  var meal_items = data["Breakfast"];
  for(i = 0; i < meal_items.length; i++){
      $("#b_list").append("<li>" + meal_items[i] + "</li>");
  }

  meal_items = data["Lunch"];
  for(i = 0; i < meal_items.length; i++){
      $("#l_list").append("<li>" + meal_items[i] + "</li>");
  }

  meal_items = data["Dinner"];
  for(i = 0; i < meal_items.length; i++){
      $("#d_list").append("<li>" + meal_items[i] + "</li>");
  }
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
