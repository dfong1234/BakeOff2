//  ................................................................................
//  bakeoff2.ai.js
//  javascript for AI of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 11/28/2019
//  ................................................................................


/*  --- ---  */

// --- Label Initialization ---


// --- Variables ---



// --- Functions ---


// --- In-Use ---


/*
{
   "Name" : "foo",
   "day_calories" : 2000,  // in kcal
   "day_carbohydrate" : 130,  // in g
   "day_protein" : 56,  // in g
   "day_fat" : 27,  // in g
   ...
};

{
    "name" : "apple",
    "calories" :  27,  // in kcal
    "carbohydrate" : 10.50,  // in g
    "protein" :  0.00,  // in g
    "fat" :  0.00,  // in g
    "vitamin_C" :  29.25,  // in mg
    ...
 };
*/


var daily_calories_goal = 2000;
var daily_carbohydrate_goal = 130;
var daily_protein_goal = 56;
var daily_fat_goal = 27;

var daily_userCalories = 1000;
var daily_userCarbohydrate = 70;
var daily_userProtein = 36;
var daily_userFat = 17;


var aiFood_name = 'hamburger';
var aiFood_calories = 500;
var aiFood_carbohydrate = 50;
var aiFood_protein = 35;
var aiFood_fat = 25;




/*  --- Food Choice Decision Making ---  */
// --- Variables ---
var foods_localData = [];

var userFood_name;
var userFood_calories;
var userFood_carbohydrate;
var userFood_protein;
var userFood_fat;

var userPref_calories_threshold = 50;
var userPref_carbohydrate_threshold = 30;
var userPref_protein_threshold = 20;
var userPref_fat_threshold = 10;


var foodChoice_decision = "Good Food";
var foodchoice_reason = [];

// --- Functions ---
//helper function for find a food's nutrition facts from local database
function findFoodFacts(food){
    for(i = 0; i < foods_localData.length; i++) {
        if(foods_localData[i]["name"] == food){
            return foods_localData[i];
        }
    }
}

function foodChoiceEvaluation(userFood) {

    $.get("/food-database", function(data){
        foods_localData = data;
    });

    var food_nutrition = findFoodFacts(userFood);

    userFood_name = food_nutrition["name"];
    userFood_calories = food_nutrition["calories"]; 
    userFood_carbohydrate = food_nutrition["carbohydrates"];
    userFood_protein = food_nutrition["proteins"];
    userFood_fat = food_nutrition["fats"];

    if (userFood_calories > userPref_calories_threshold) {
        // calories_reason[calories_reason_count] =  "has calories > that of "
        // calories_reason_count++;

        foodChoice_decision = "Bad Food";
    }


    if (userFood_carbohydrate > userPref_carbohydrate_threshold) {
        // calories_reason[calories_reason_count] =  "has calories > that of "
        // calories_reason_count++;

        foodChoice_decision = "Bad Food";
    }


    if (userFood_protein > userPref_protein_threshold) {
        // calories_reason[calories_reason_count] =  "has calories > that of "
        // calories_reason_count++;

        foodChoice_decision = "Bad Food";
    }

    if (userFood_fat > userPref_fat_threshold) {
        // calories_reason[calories_reason_count] =  "has calories > that of "
        // calories_reason_count++;

        foodChoice_decision = "Bad Food";
    }

    return foodChoice_decision;
}





/*  --- Food Suggestion Decision Making ---  */
function foodSuggestEvaluation(aiFood) {



}



/*

var calories_reason = [];
var calories_reason_count = 0;
var calories_explain = "";
var calories_suggest = "";

if (userFood_calories > userPref_calories_threshold) {
    calories_reason[calories_reason_count] =  "has calories > that of "
    calories_reason_count++;
       
} else {
    calories_reason[calories_reason_count] =  "has calories \u2264 that of "
    calories_reason_count++;
}
*/


/*
calories_suggest = userFood_name;
for(var i = 0; i < calories_reason_count; i++) {
    if (typeof reason === 'string' || reason instanceof String)
        calories_suggest = claories_suggest + reason;
        calories_reason.splice()

}    
*/


/* For AI on User preference


function calculateCarbohydrate() {
    // Carbohydrate for ages 0
    if (userAge == 0) {
        return (77.5)
    }

    // Carbohydrate for ages 1+
    if (userAge >= 1) {
        return (130)
    }
}


function calculateProtein() {
    // Protein for ages 0
    if (userAge == 0) {
        return (10)
    }

    // Protein for ages 1 to 3
    if (userAge <= 3) {
        return (13)
    }

    // Protein for ages 4 to 8
    if (userAge <= 8) {
        return (19)
    }

    // Protein for ages 9 to 13
    if (userAge <= 13) {
        return (34)
    }

    // Protein for ages 14 to 18
    if (userAge <= 18) {
        if (userSex == "Male") {
            return (52)
        }
        if (userSex == "Female") {
            return (46)
        }
    }

    // Protein for ages 19+
    if (userAge > 18) {
        if (userSex == "Male") {
            return (56)
        }
        if (userSex == "Female") {
            return (46)
        }
    }
}


function calculateFat() {
    // Fat for ages 0
    if (userAge == 0) {
        return (30)
    }

    // Fat for ages 1 to 3
    if (userAge <= 3) {
        return (35)
    }

    // Fat for ages 4 to 18
    if (userAge <= 18) {
        return (30)
    }
    
    // Fat for ages 19+
    if (userAge > 18) {
        return (27.5)
    }
}






*/