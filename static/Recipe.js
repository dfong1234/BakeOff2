//	................................................................................
//  bakeoff2.recipe.js
//	javascript for Recipe page of BakeOff2: NutriPlan
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 12/10/2019
//	................................................................................

/*  --- Website Header and Tabs ---  */
// --- Variables ---
var tabName = 'Recipes';
var color = 'purple';

// --- In-Use ---
openTab(tabName, color) 


// Load HTML utility elements after the web page is loaded
$(document).ready(function() {
    var x = document.getElementById("Vegan");
    var y = document.getElementById("Vegetarian");
    var z = document.getElementById("Non Vegetarian");
    z.style.display = "none";
    x.style.display = "none";
    y.style.display = "none";
});


/*  --- Recipe Display ---  */
function myFunction1() {
var x = document.getElementById("Vegan");
var y = document.getElementById("Vegetarian");
var z = document.getElementById("Non Vegetarian");
  
if (x.style.display === "none") {
  x.style.display = "block";
  y.style.display = "none";
  z.style.display = "none";

} 
 else {
  z.style.display = "none";
  x.style.display = "none";
  y.style.display = "none";
}
}
    
function myFunction2() {
  var x = document.getElementById("Vegan");
  var y = document.getElementById("Vegetarian");
  var z = document.getElementById("Non Vegetarian");
  z.style.display = "none";
    x.style.display = "none";
    y.style.display = "none";
  if (y.style.display === "none") {
    y.style.display = "block";
    x.style.display = "none";
    z.style.display = "none";

  } else {
    z.style.display = "none";
    x.style.display = "none";
    y.style.display = "none";
  }
}
function myFunction3() {
  var x = document.getElementById("Vegan");
  var y = document.getElementById("Vegetarian");
  var z = document.getElementById("Non Vegetarian");
  
  if (z.style.display === "none") {
    z.style.display = "block";
    x.style.display = "none";
    y.style.display = "none";
  } 
   else {
    z.style.display = "none";
    x.style.display = "none";
    y.style.display = "none";
  }
}