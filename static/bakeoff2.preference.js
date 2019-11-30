//	................................................................................
//  bakeoff2.preference.js
//	javascript for User Preference page of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 10/23/2019
//	................................................................................

var tabName = 'Preference';
var color = 'dodgerblue';

openTab(tabName, color) 

//Initialize sliders
$(".nutrient-slider").slider({
	max: 100,
	min: 0,
	step: 1	
});

//Basal Metabolic Rate, Mifflin St Jeor Equation:
function BMREquation(){
	var s = $("#sex").val() == "Male" ? 5 : -161 ;
	return ((10 * $("#weight").val()) + (6.25 * $("#height").val() * 100) - (5 * $("#age").val()) + s);
};

$("#dri-defaults").click(function() {
	var calories = BMREquation();
	$("#dri-calories").val(calories);
	alert("Default calories restored.");
});

