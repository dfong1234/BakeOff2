//  ................................................................................
//  bakeoff2.index.js
//  javascript for index page of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 11/27/2019
//  ................................................................................

/*  --- Website Header and Tabs ---  */
// --- Variables ---
var tabName = 'Food';
var tabColor = 'tomato';

// --- In-Use ---
openTab(tabName, tabColor) 




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

var foods_databaseData = {};  // Data of foods obtained from online database

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
            foods_databaseData = data["foods"]; 
            alert("Success in obtaining infotmation from database");
        },
        error: function(xhr, status, error){
            alert("Failed to obtain infotmation from database");
        }
    });
};


function fillResultTable() {
    $("#result-table").DataTable().clear().draw();
    for(i = 0; i < foods_databaseData.length; i++){
        var food_array = foods_databaseData[i];
        var name = food_array["food_name"];
        var protein = food_array["nf_protein"].toString();
        var carb = food_array["nf_total_carbohydrate"].toString();
        var fat = food_array["nf_total_fat"].toString();
        var serving_size = food_array["serving_weight_grams"].toString();
        $("#result-table").DataTable().row.add([name, protein, carb, fat, serving_size]).draw();
    };  
}

function addFoodToLocalDatabase(food) {

    //create data object
    food_localData = {
        "name": food["food_name"],
        "serving": food["serving_weight_grams"].toString(),
        "calories": food["nf_calories"].toString(),
        "carbohydrates": food["nf_total_carbohydrate"].toString(),
        "proteins": food["nf_protein"].toString(),
        "fat": food["nf_total_fat"].toString(),
        
    };
    
    $.post('/food-database', food_localData, null, "json");
}


// --- In-Use ---
$('#index-search-icon').click(function() {
    searchFood($("#search-keyword").val());
    
    fillResultTable();
    
    for(i = 0; i < foods_databaseData.length; i++){
        var food = foods_databaseData[i];
        addFoodToLocalDatabase(food);
    }
});



/*  --- ---  */

// --- Label Initialization ---


// --- Variables ---



// --- Functions ---


// --- In-Use ---




/*  --- Nutrition Fact Board  --- */
// --- Variables ---
var food_mealData = {};   // Data of food that willbe added to user's meal history
var food_nutrition = {};

// --- Functions ---
//helper function for filling out nutrition table
function findVitaminValue(attribute_ID){
    for(i = 0; i < food_nutrition["full_nutrients"].length; i++) {
        if(attribute_ID == food_nutrition["full_nutrients"][i]["attr_id"]){
            return food_nutrition["full_nutrients"][i]["value"];
        }
    }
}

// --- In-Use ---
//Clicking column button to display data in nutrition label
$("#result-table tbody").on('click', 'button', function(){
    //Assuming we have already done database search, and populated row with data...


    //Grab data from row in table
    var data = $('#result-table').DataTable().row($(this).parents('tr')).data();


    //create data object
    food_mealData = {
        "user": "test",
        "food": data[0]
    };


    //fist, find correct food item in the saved data from when we populated the table
    for(i = 0; i < foods_databaseData.length; i++){
        food_nutrition = foods_databaseData[i];
        if(food_nutrition["food_name"] == data[0]) { //found it, so break
            break;
        }
    }


    //food_nutrition will contain all nutrition facts of food. Update nutrition label accordingly
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
    food_mealData["meal"] = $("#meal-time").val();
    food_mealData["date"] = $("#datepicker").val();
    $.post("/food-log" + window.location.search, food_mealData, null, "json");
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
