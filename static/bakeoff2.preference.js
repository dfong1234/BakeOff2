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

var pref_url = "/food-pref" + window.location.search;

//Initialize sliders
$("#slider-dri-proteins").slider({
	max: 100,
	min: 0,
	step: 5,
	slide: function(event, ui){
		var calories = parseInt($("#dri-calories").val());
		var percentage = parseInt(ui.value);
		$("#dri-proteins").val(Math.round(percentage*0.01*calories/4));
	}
});

$("#slider-dri-carbohydrates").slider({
	max: 100,
	min: 0,
	step: 5,
	slide: function(event, ui){
		var calories = parseInt($("#dri-calories").val());
		var percentage = ui.value;
		$("#dri-carbohydrates").val(Math.round(percentage*0.01*calories/4));
	}
});

$("#slider-dri-fats").slider({
	max: 100,
	min: 0,
	step: 5,
	slide: function(event, ui){
		var calories = parseInt($("#dri-calories").val());
		var percentage = ui.value;
		$("#dri-fats").val(Math.round(percentage*0.01*calories/9));
	}
});

//Basal Metabolic Rate, Mifflin St Jeor Equation:
function BMREquation(){
	var s = $("#sex").val() == "Male" ? 5 : -161 ;
	return ((10 * $("#weight").val()) + (6.25 * $("#height").val() * 100) - (5 * $("#age").val()) + s);
};

$("#dri-defaults").click(function() {
	var calories = Math.round(BMREquation());
	$("#dri-calories").val(calories);

	//Default to a 40 carbs/30 fats/30 protein calorie split
	$("#slider-dri-carbohydrates").slider("value", 40);
	$("#slider-dri-proteins").slider("value", 30);
	$("#slider-dri-fats").slider("value", 30);

	$("#dri-carbohydrates").val(Math.round(0.4*calories/4));
	$("#dri-proteins").val(Math.round(0.3*calories/4));
	$("#dri-fats").val(Math.round(0.3*calories/9));

	alert("Default calories restored.");
});

$("#dri-save").click(function() {
	var data = {
		"day_calories"      : $("#dri-calories").val(),
		"day_carbohydrates" : $("#dri-carbohydrates").val(),
		"day_fats"			: $("#dri-fats").val(),
		"day_calories"		: $("#dri-calories").val()
	};
	$.post(pref_url, data, null, "json");
});

$("#preference_update_icon").click(function(){
	var data = {
		"age"       	 : $("#age").val(),
		"sex" 			 : $("#sex").val(),
		"height"		 : $("#height").val(),
		"weight"		 : $("#weight").val(),
		"activity_level" : $("activity").val()
	};
	$.post(pref_url, data, null, "json");
});