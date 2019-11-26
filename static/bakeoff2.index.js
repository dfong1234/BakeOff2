//  ................................................................................
//  bakeoff2.index.js
//  javascript for index page of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 10/23/2019
//  ................................................................................

var tabName = 'Food';
var color = 'tomato';
    
openTab(tabName, color) 

var searchParams = new URLSearchParams(window.location.search)

var food_url = "/food-log" + window.location.search;

var food_data = {};

$("#table-search tbody").on('click', 'button', function(){
    //Do database search, and populate row with data
    //fillTable();

    //Grab data from row in table
    var data = $('#table-search').DataTable().row($(this).parents('tr')).data();

    //create data object
    food_data = {"user": "Daniel",
        "food": data[0],
        "meal": $("#meal-time").val(),
        "date": $("#datepicker").val()
    };

    //update nutrition label according to row data
    $('#nutrition-facts').nutritionLabel({
        showServingUnitQuantity : false,
        itemName : data[0],
        ingredientList : data[0],

        decimalPlacesForQuantityTextbox : 2,
        valueServingUnitQuantity : 1,

        allowFDARounding : true,
        decimalPlacesForNutrition : 2,

        showPolyFat : false,
        showMonoFat : false,

        valueCalories : 450,
        valueFatCalories : 430,
        valueTotalFat : 48,
        valueSatFat : 6,
        valueTransFat : 0,
        valueCholesterol : 30,
        valueSodium : 780,
        valueTotalCarb : 3,
        valueFibers : 0,
        valueSugars : 3,
        valueProteins : 3,
        valueVitaminD : 12.22,
        valuePotassium_2018 : 4.22,
        valueCalcium : 7.22,
        valueIron : 11.22,
        valueAddedSugars : 17,
        valueCaffeine : 15.63,
        showLegacyVersion : false
    });
});

$('#food_add_icon').click(function() {
    $.post(food_url, food_data, null, "json");
    alert("Sent Data to History");
});


$('#search-icon').click(function() {
    alert("Searching");
});

$( function() {
    $("#datepicker").datepicker();
} );

$(document).ready( function () {
    $('#table-search').DataTable({
        "columnDefs": [{
            "targets": -1,
            "data": null,
            "defaultContent": "<button type=\"submit\" id=\"b_expand_food\"><i class=\"fas fa-angle-double-right\"></i></button>"
        }],
        "searching": false,
        "info": false
    });
    $('#nutrition-facts').nutritionLabel({showLegacyVersion : false});
});