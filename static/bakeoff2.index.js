//  ................................................................................
//  bakeoff2.index.js
//  javascript for index page of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 11/27/2019
//  ................................................................................

/*  --- ---  */
// --- Initialization ---

// --- Variables ---

// --- Functions ---

// --- In-Use ---


/*  --- Website Header and Tabs ---  */
// --- Variables ---
var tabName = 'Food';
var tabColor = 'tomato';

// --- In-Use ---
openTab(tabName, tabColor) 



/*  --- Datepiacker ---  */
// --- Initialization ---
$(function() {
    $("#datepicker").datepicker();
});



/*  --- DataTable ---  */
// --- Initialization ---
$(document).ready(function() {
    $('#result-table').DataTable({
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



/*  --- Nutrition Database Access ---  
 *  Nutritionix - Largest Verified Nutrition Database
 *  https://developer.nutritionix.com/docs/v2
 */
// --- Variables ---
var api_key = "5015be239c92535807bae011a26fbcd2";
var app_id = "8ea44c06";

// url for obtaining detailed nutrient breakdown of requested food(s)
var nutrient_url = "https://trackapi.nutritionix.com/v2/natural/nutrients";
// url for providing list of commonon foods to a search field     
var instant_url = "https://trackapi.nutritionix.com/v2/search/instant";         

var foods_onlineData = {};  // Data of multiple foods obtained from online database

// --- Functions ---
function searchFood(searchTerm) {
    var data_params = {
        "query" : searchTerm
    };
    var data_string = JSON.stringify(data_params);

    // jQuery.ajax() 
    // Perform an asynchronous HTTP (Ajax) request
    // https://api.jquery.com/jquery.ajax/
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
            // save all data for use in populating nutrition facts
            // https://gist.github.com/mattsilv/7122853
            foods_onlineData = data["foods"]; 
            $("#table-search").DataTable().clear().draw();
            fillResultTable();
            alert("Success in obtaining infotmation from database");
        },
        error: function(xhr, status, error){
            alert("Failed to obtain infotmation from database");
        }
    });
};

function fillResultTable() {
    $("#result-table").DataTable().clear().draw();
    for(i = 0; i < foods_onlineData.length; i++){
        var food_array = foods_onlineData[i];
        var name = food_array["food_name"];
        var serving_size = food_array["serving_weight_grams"].toString();
        var calories = food_array["nf_calories"].toString();
        var carbohydrate = food_array["nf_total_carbohydrate"].toString();
        var protein = food_array["nf_protein"].toString();
        var fat = food_array["nf_total_fat"].toString();
        $("#result-table").DataTable().row.add([name, serving_size, calories, carbohydrate, protein, fat, "0"]).draw();
    };  
}

function addFoodToLocalDatabase(food) {

    //create the food's nutrition dictionary object
    food_localData = {
        "name": food["food_name"],
        "serving": food["serving_weight_grams"].toString(),
        "calories": food["nf_calories"].toString(),
        "carbohydrates": food["nf_total_carbohydrate"].toString(),
        "proteins": food["nf_protein"].toString(),
        "fats": food["nf_total_fat"].toString()
    };
    
    $.post('/food-database', food_localData, null, "json");
}

// --- In-Use ---
$('#index-search-icon').click(function() {
    searchFood($("#search-keyword").val());
        
    for(i = 0; i < foods_onlineData.length; i++){
        var food = foods_onlineData[i];
        addFoodToLocalDatabase(food);
    }
});



/*  --- Nutrition Fact Board  --- */
// --- Variables ---
var food_mealData = {};   // Data of single food that will be added to user's meal history
var food_nutritionData = {};  // Data of single food that will be loaded to Nutrition Fact Label

// --- Functions ---
//helper function for filling out nutrition table
function findVitaminValue(attribute_ID){
    for(i = 0; i < food_nutritionData["full_nutrients"].length; i++) {
        if(attribute_ID == food_nutritionData["full_nutrients"][i]["attr_id"]){
            return food_nutritionData["full_nutrients"][i]["value"];
        }
    }
}

// --- In-Use ---
//Clicking column button to display data in nutrition label
$("#result-table tbody").on('click', 'button', function(){
    //Assuming we have already done database search, and populated row with data...

    //Grab data from row in table
    var row_data = $('#result-table').DataTable().row($(this).parents('tr')).data();

    //find correct food item in the saved data from when we populated the table
    for(i = 0; i < foods_onlineData.length; i++){
        food_nutritionData = foods_onlineData[i];
        if(food_nutritionData["food_name"] == row_data[0]) { //found it, so break
            break;
        }
    }

    //food_mealData will contain user, and food name, meal time, meal date of food.
    food_mealData["user"] = "test";
    food_mealData["food"] = row_data[0];


    //food_nutritionData will contain important nutrition facts of food. Update nutrition label accordingly
    $('#nutrition-facts').nutritionLabel({
        itemName : food_nutritionData["food_name"],

        decimalPlacesForQuantityTextbox : 2,
        valueServingUnitQuantity : 1,

        allowFDARounding : true,
        decimalPlacesForNutrition : 1,

        showPolyFat : false,
        showMonoFat : false,

        //main nutrients
        valueCalories    : food_nutritionData["nf_calories"],
        valueTotalFat    : food_nutritionData["nf_total_fat"],
        valueSatFat      : food_nutritionData["nf_saturated_fat"],
        valueTransFat    : food_nutritionData["nf_trans_fatty_acid"],
        valueCholesterol : food_nutritionData["nf_cholesterol"],
        valueSodium      : food_nutritionData["nf_sodium"],
        valueTotalCarb   : food_nutritionData["nf_total_carbohydrate"],
        valueFibers      : food_nutritionData["nf_dietary_fiber"],
        valueSugars      : food_nutritionData["nf_sugars"],
        valueProteins    : food_nutritionData["nf_protein"],

        //additional nutrients -- determined by user preferences. Vitamin ID's can be found here: https://docs.google.com/spreadsheets/d/14ssR3_vFYrVAidDLJoio07guZM80SMR5nxdGpAX-1-A/edit#gid=0
        valueVitaminD       : findVitaminValue(324),
        valuePotassium_2018 : findVitaminValue(306),
        valueCalcium        : findVitaminValue(301),
        valueIron           : findVitaminValue(303),
        valueAddedSugars    : findVitaminValue(539),

        //serving info
        valueServingWeightGrams : food_nutritionData["serving_weight_grams"],
        showLegacyVersion : false
    });
});

//Clicking add button to add to meal history
$('#food-add-icon').click(function() {
    food_mealData["meal"] = $("#meal-time").val();
    food_mealData["date"] = $("#datepicker").val();
    $.post("/food-log" + window.location.search, food_mealData, null, "json");
    alert("Sent Data to History");
});






//Example of autocomplete functionality
$( function() {
    var recentlyUsed = [
        "chicken",
        "rice"
    ];

    $("#search-keyword").autocomplete({
        source: recentlyUsed
    });
});
