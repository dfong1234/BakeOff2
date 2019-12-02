//  ................................................................................
//  bakeoff2.ai.js
//  javascript for AI of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 11/28/2019
//  ................................................................................

/*  --- ---  */
// --- Initialization ---

// --- Variables ---

// --- Functions ---

// --- In-Use ---



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



/*  --- Load Diet Profile ---  */
// --- Variables ---
var userDietProfile = {};
var userPref_calories_cutoff = 9999;  // initialize to a very large number for case where user not set cutoff
var userPref_carbohydrate_cutoff = 9999;  // initialize to a very large number for case where user not set cutoff
var userPref_protein_cutoff = 9999;  // initialize to a very large number for case where user not set cutoff
var userPref_fat_cutoff = 9999;  // initialize to a very large number for case where user not set cutoff


// --- Functions ---
function loadDietProfile() {
    $.get("/food-pref", function(data){
        userDietProfile = data["plan"];
        if (data["plan"]["cutoff_calories"] != null) 
            userPref_calories_cutoff = parseFloat(data["plan"]["cutoff_calories"]);
        
        if (data["plan"]["cutoff_carbohydrates"] != null) 
            userPref_carbohydrate_cutoff = parseFloat(data["plan"]["cutoff_carbohydrates"]);
        
        if (data["plan"]["cutoff_proteins"] != null) 
            userPref_protein_cutoff  = parseFloat(data["plan"]["cutoff_proteins"]); 
        
        if (data["plan"]["cutoff_fats"] != null) 
            userPref_fat_cutoff = parseFloat(data["plan"]["cutoff_fats"]);
    });

}

// --- In-Use ---
loadDietProfile();




/*  --- Food Choice Decision Making ---  */
// --- Variables ---

var userFood_name;
var userFood_calories;
var userFood_carbohydrate;
var userFood_protein;
var userFood_fat;



var foodChoice_decision = "";
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


    var food_nutrition = findFoodFacts(userFood);
    userFood_name = food_nutrition["name"];
    userFood_calories = parseFloat(food_nutrition["calories"]); 
    userFood_carbohydrate = parseFloat(food_nutrition["carbohydrates"]);
    userFood_protein = parseFloat(food_nutrition["proteins"]);
    userFood_fat = parseFloat(food_nutrition["fats"]);

    foodChoice_decision = "Good Food";

    if (userFood_calories > userPref_calories_cutoff) {
        // calories_reason[calories_reason_count] =  "has calories > that of "
        // calories_reason_count++;
        foodChoice_decision = "Bad Food";
    }

    if (userFood_carbohydrate > userPref_carbohydrate_cutoff) {
        // calories_reason[calories_reason_count] =  "has calories > that of "
        // calories_reason_count++;
        foodChoice_decision = "Bad Food";
    }


    if (userFood_protein > userPref_protein_cutoff) {
        calories_reason[calories_reason_count] =  "has calories > that of "
        // calories_reason_count++;
        foodChoice_decision = "Bad Food";
    }

    if (userFood_fat > userPref_fat_cutoff) {
        // calories_reason[calories_reason_count] =  "has calories > that of "
        // calories_reason_count++;
        foodChoice_decision = "Bad Food";
    }

    return foodChoice_decision;
}



/*
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
*/



/*  --- Food Suggestion Decision Making ---  */
function foodSuggestEvaluation(aiFood) {



}



/*

var calories_reason = [];
var calories_reason_count = 0;
var calories_explain = "";
var calories_suggest = "";

if (userFood_calories > userPref_calories_cutoff) {
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