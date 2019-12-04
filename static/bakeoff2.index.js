//  ................................................................................
//  bakeoff2.index.js
//  javascript for index page of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 12/02/2019
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


//Wait till document is "loaded" before starting data stuff, just in case of bugs or something
$(document).ready(function() {
    /*  --- Datepiacker ---  */
    // --- Initialization ---
    $(function() {
        $("#datepicker").datepicker();
    });


    /*  --- DataTable ---  */
    // --- Initialization ---
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





/*  --- Load Local Food Database ---  */
// --- Variables ---
var foods_localData = [];

// --- Functions ---
function loadLocalFoodDatabase() {
    $.get("/food-database", function(data){
        foods_localData = data;
    });
}

// --- In-Use ---
loadLocalFoodDatabase();





/*  --- Food Database Exapansion --- */ 
// --- Variables ---
var foods_onlineData = {};  // Data of multiple foods obtained from online database

var api_key = "5015be239c92535807bae011a26fbcd2";
var app_id = "8ea44c06";
// url for obtaining detailed nutrient breakdown of requested food(s)
var nutrient_url = "https://trackapi.nutritionix.com/v2/natural/nutrients";
// url for providing list of commonon foods to a search field     
var instant_url = "https://trackapi.nutritionix.com/v2/search/instant";         


// --- Functions ---
// Helper Function: obtain vitamins and ions data from the online food data
// Nutritionix Micronutrient IDs:
// https://docs.google.com/spreadsheets/d/14ssR3_vFYrVAidDLJoio07guZM80SMR5nxdGpAX-1-A/edit#gid=0
function findVitaminValue(food, attribute_ID){
    for(let i = 0; i < food["full_nutrients"].length; i++) {
        if(attribute_ID == food["full_nutrients"][i]["attr_id"]){
            return food["full_nutrients"][i]["value"];
        }
    }
    return 0;
}

// Helper Function: Fill in the obtained foods to the search result table
function fillResultTable() {
    $("#result-table").DataTable().clear().draw();
    for(let i = 0; i < foods_onlineData.length; i++){
        var food_array = foods_onlineData[i];
        var name = food_array["food_name"];
        var serving_size = food_array["serving_weight_grams"].toString();
        var calories = food_array["nf_calories"].toString();
        var carbohydrate = food_array["nf_total_carbohydrate"].toString();
        var protein = food_array["nf_protein"].toString();
        var fat = food_array["nf_total_fat"].toString();
        $("#result-table").DataTable().row.add([name, serving_size, calories, carbohydrate, protein, fat]).draw();
    };  
}

/*  --- Update Local Food Database ---  */
function updateLocalFoodDatabase(food) {
    // Create the food's nutrition dictionary object
    food_localData = {
        "name": food["food_name"],
        "serving": food["serving_weight_grams"].toString(),

        // macronutrients
        "calories": food["nf_calories"].toString(),
        "carbohydrates": food["nf_total_carbohydrate"].toString(),
        "proteins": food["nf_protein"].toString(),
        "fats": food["nf_total_fat"].toString(),

        // important micronutrients in nutrition deficiency
        "iron": findVitaminValue(food,303),
        "vitaminD": findVitaminValue(food, 324),
        "vitaminB12": findVitaminValue(food, 418),
        "calcium": findVitaminValue(food, 301),
        "magnesium": findVitaminValue(food, 304)
    };
    
    $.post('/food-database', food_localData, null, "json");
}

//  Major Function: Access the onine food database
//  Nutritionix - Largest Verified Nutrition Database:
//  https://developer.nutritionix.com/docs/v2
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

            for(let i = 0; i < foods_onlineData.length; i++){
                var food = foods_onlineData[i];
                updateLocalFoodDatabase(food);
            }

            alert("Success in obtaining information from database");
        },
        error: function(xhr, status, error){
            alert("Failed to obtain information from database");
        }
    });
};

// --- In-Use ---
$('#index-search-icon').click(function() {
    searchFood($("#search-keyword").val());
});





/*  --- Nutrition Fact Board  --- */
// --- Variables ---
var food_nutritionData = {};  // Data of the food that will be loaded to the Nutrition Fact Label
var food_mealData = {};   // Data of the food that will be added to user's meal log

var url_params = new URLSearchParams(window.location.search); //search parameters after the main URL

// --- Functions ---
// Helper Function: Find a food's nutrition facts from local database
function findFoodFacts_Online(food){
    for(let i = 0; i < foods_onlineData.length; i++){
        if(foods_onlineData[i]["food_name"] == food){
            return foods_onlineData[i];
        }
    }
}

// Helper function: obtain vitamins and ions data from the online food data
// Nutritionix Micronutrient IDs:
// https://docs.google.com/spreadsheets/d/14ssR3_vFYrVAidDLJoio07guZM80SMR5nxdGpAX-1-A/edit#gid=0
function findVitaminValue_Online(attribute_ID){
    for(let i = 0; i < food_nutritionData["full_nutrients"].length; i++) {
        if(attribute_ID == food_nutritionData["full_nutrients"][i]["attr_id"]){
            return food_nutritionData["full_nutrients"][i]["value"];
        }
    }
    return 0;
}

// --- In-Use ---
$("#result-table tbody").on('click', 'button', function(){
    // Assume we have already done:
    // (1) online database search
    // (2) populate search result table with found foods
    // (3) populate nutrition fact label with a single food


    // Grab the selected food from the search result table
    var row_data = $('#result-table').DataTable().row($(this).parents('tr')).data();

    // Find the corresponding nutrition facts from the online food database
    food_nutritionData = findFoodFacts_Online(row_data[0]);

    // Populate food_mealData with data that will be saved to user's meal log
    if(url_params.has('user')){
        food_mealData["user"] = url_params.get('user');
    }
    else{
        food_mealData["user"] = "test";
    }
    food_mealData["name"] = row_data[0];
    food_mealData["serving"] = row_data[1];
    food_mealData["calories"] = row_data[2];
    food_mealData["carbohydrates"] = row_data[3];
    food_mealData["proteins"] = row_data[4];
    food_mealData["fats"] = row_data[5];
    food_mealData["iron"] = findVitaminValue_Online(303);
    food_mealData["vitaminD"] = findVitaminValue_Online(324);
    food_mealData["vitaminB12"] = findVitaminValue_Online(418);
    food_mealData["calcium"] = findVitaminValue_Online(301);
    food_mealData["magnesium"] = findVitaminValue_Online(304);

    // Populate food_nutritionData with data that will be loaded to the Nutrition Fact Label
    $('#nutrition-facts').nutritionLabel({
        itemName : food_nutritionData["food_name"],

        // Nutrition Fact Label Options
        decimalPlacesForQuantityTextbox : 2,
        valueServingUnitQuantity : 1,
        allowFDARounding : true,
        decimalPlacesForNutrition : 1,
        showPolyFat : false,
        showMonoFat : false,

        // macronutrients with details
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


        // important micronutrients in nutrition deficiency

        //additional nutrients -- determined by user preferences. 
        valueVitaminD       : findVitaminValue_Online(324),
        valuePotassium_2018 : findVitaminValue_Online(306),
        valueCalcium        : findVitaminValue_Online(301),
        valueIron           : findVitaminValue_Online(303),
        valueAddedSugars    : findVitaminValue_Online(539),

        //serving info
        valueServingWeightGrams : food_nutritionData["serving_weight_grams"],
        showLegacyVersion : false
    });
});

$('#food-add-icon').click(function() {
    // Add the selected food to meal history
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
