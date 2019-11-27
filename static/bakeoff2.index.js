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

/* Database API access for filling up table */


var api_key = "5015be239c92535807bae011a26fbcd2";
var app_id = "8ea44c06";
var nutrient_url = "https://trackapi.nutritionix.com/v2/natural/nutrients";  //look up item
var instant_url = "https://trackapi.nutritionix.com/v2/search/instant";      //automatically searches, to be used for autocomplete (gives list of commonly used foods)
var food_data_all = {};

function fillTable(searchTerm) {
    var data_params = {
        "query" : searchTerm
    };
    var data_string = JSON.stringify(data_params);
    $.ajax({
        type: "POST",
        url: nutrient_url,
        dataType: "json",
        contentType: "application/json",
        headers: {
            "x-app-id": app_id,
            "x-app-key": api_key,
            "x-remote-user-id": "0"
        },
        data: data_string,
        success: function(data){
            food_data_all = data["foods"]; //save all data for use in populating nutrition facts
            $("#table-search").DataTable().clear().draw();
            for(i = 0; i < data["foods"].length; i++){
                var food_array = data["foods"][i];
                var name = food_array["food_name"];
                var protein = food_array["nf_protein"].toString();
                var carb = food_array["nf_total_carbohydrate"].toString();
                var fat = food_array["nf_total_fat"].toString();
                var serving_size = food_array["serving_weight_grams"].toString();
                $("#table-search").DataTable().row.add([name, protein, carb, fat, serving_size]).draw();
            };  
        },
        error: function(xhr, status, error){
            alert("Failed to search database");
        }
    });
};

//Search button
$('#search-icon').click(function() {
    fillTable($("#search-keyword").val());
});


/* Other parts for the index page */
var searchParams = new URLSearchParams(window.location.search)
var food_url = "/food-log" + window.location.search;
var food_data = {}; //food data for just the food we are going to add

//Clicking column button to display data in nutrition label
$("#table-search tbody").on('click', 'button', function(){
    //Assuming we have already done database search, and populated row with data...

    //Grab data from row in table
    var data = $('#table-search').DataTable().row($(this).parents('tr')).data();
    //searchItem(data[0])
    //create data object
    food_data = {
        "user": "Daniel",
        "food": data[0]
    };

    var food_nutrition = {};
    //fist, find correct food item in the saved data from when we populated the table
    for(i = 0; i < food_data_all.length; i++){
        food_nutrition = food_data_all[i];
        if(food_nutrition["food_name"] == data[0]) { //found it, so break
            break;
        }
    }

    //helper function for filling out nutrition table
    function findVitaminValue(attribute_ID){
        for(i = 0; i < food_nutrition["full_nutrients"].length; i++) {
            if(attribute_ID == food_nutrition["full_nutrients"][i]["attr_id"]){
                return food_nutrition["full_nutrients"][i]["value"];
            }
        }
    }
    
    //food_nutrition will contail all nutrition facts of food. Update nutrition label accordingly
    //$('#nutrition-facts').nutritionLabel().hide();
    $('#nutrition-facts').nutritionLabel({
        itemName : food_nutrition["food_name"],

        decimalPlacesForQuantityTextbox : 2,
        valueServingUnitQuantity : 1,

        allowFDARounding : true,
        decimalPlacesForNutrition : 1,

        showPolyFat : false,
        showMonoFat : false,

        //main nutrients
        valueCalories    : food_nutrition["nf_calories"],
        valueTotalFat    : food_nutrition["nf_total_fat"],
        valueSatFat      : food_nutrition["nf_saturated_fat"],
        valueTransFat    : food_nutrition["nf_trans_fatty_acid"],
        valueCholesterol : food_nutrition["nf_cholesterol"],
        valueSodium      : food_nutrition["nf_sodium"],
        valueTotalCarb   : food_nutrition["nf_total_carbohydrate"],
        valueFibers      : food_nutrition["nf_dietary_fiber"],
        valueSugars      : food_nutrition["nf_sugars"],
        valueProteins    : food_nutrition["nf_protein"],

        //additional nutrients -- determined by user preferences. Vitamin ID's can be found here: https://docs.google.com/spreadsheets/d/14ssR3_vFYrVAidDLJoio07guZM80SMR5nxdGpAX-1-A/edit#gid=0
        valueVitaminD       : findVitaminValue(324),
        valuePotassium_2018 : findVitaminValue(306),
        valueCalcium        : findVitaminValue(301),
        valueIron           : findVitaminValue(303),
        valueAddedSugars    : findVitaminValue(539),

        //serving info
        valueServingWeightGrams : food_nutrition["serving_weight_grams"],
        showLegacyVersion : false
    });
});

//Clicking button to add to food log
$('#food-add-icon').click(function() {
    food_data["meal"] = $("#meal-time").val();
    food_data["date"] = $("#datepicker").val();
    $.post(food_url, food_data, null, "json");
    alert("Sent Data to History");
});

//Example of autocomplete functionality
$( function() {
    var recentlyUsed = [
        "Chicken",
        "Rice"
    ];

    $("#search-keyword").autocomplete({
        source: recentlyUsed
    });
});

//Initialize datepicker
$( function() {
    $("#datepicker").datepicker();
} );

//Initialize tables
$(document).ready( function () {
    $('#table-search').DataTable({
        "columnDefs": [{
            "targets": -1,
            "data": null,
            "defaultContent": "<button type=\"submit\" id=\"b_expand_food\"><i class=\"fas fa-angle-double-right\"></i></button>"
        }],
        "searching": false,
        "info": false
    }).clear().draw();
    $('#nutrition-facts').nutritionLabel({showLegacyVersion : false});
});

