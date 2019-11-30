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


var userFood_name = 'hamburger';
var userFood_calories = 500;
var userFood_carbohydrate = 50;
var userFood_protein = 35;
var userFood_fat = 25;


var aiFood_name = 'hamburger';
var aiFood_calories = 500;
var aiFood_carbohydrate = 50;
var aiFood_protein = 35;
var aiFood_fat = 25;


var userPref_calories_threshold = 300;
var userPref_carbohydrate_threshold = 40;
var userPref_protein_threshold = 20;
var userPref_fat_threshold = 10;



/*  --- Food Choice Decision Making ---  */
function foodChoiceEvaluation(userFood) {



}


/*  --- Food Suggestion Decision Making ---  */
function foodSuggestEvaluation(aiFood) {



}





var calories_reason = [];
var calories_reason_count = 0;
var calories_explain = "";
var calories_suggest = "";

if (food_calories > user_calories_threshold) {
    calories_reason[calories_reason_count] =  "has calories > that of "
    calories_reason_count++;
       
} else {
    calories_reason[calories_reason_count] =  "has calories \u2264 that of "
    calories_reason_count++;
}



calories_suggest = food_name;

for(var i = 0; i < calories_reason_count; i++) {
    if (typeof reason === 'string' || reason instanceof String)
        calories_suggest = claories_suggest + reason;
        calories_reason.splice()

}    
