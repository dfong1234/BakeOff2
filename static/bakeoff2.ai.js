//  ................................................................................
//  bakeoff2.ai.js
//  javascript for AI of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 12/03/2019
//  ................................................................................

/*  --- ---  */
// --- Initialization ---

// --- Variables ---

// --- Functions ---

// --- In-Use ---


//Wait till document is "loaded" before starting data stuff, just in case of bugs or something
$(document).ready(function() {
    loadLocalFoodDatabase();
    loadDietProfile();
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





/*  --- Load Diet Profile ---  */
// --- Variables ---
var userDietProfile = {};

var evaluate_calories_max = 9999;      // initialize to a very large number for case where user not set cutoff
var evaluate_carbohydrate_max = 9999;
var evaluate_protein_max = 9999;
var evaluate_fat_max = 9999;
var evaluate_iron_max = 9999;
var evaluate_calcium_max = 9999;
var evaluate_magnesium_max = 9999;
var evaluate_vitaminD_max = 9999;
var evaluate_vitaminB12_max = 9999;

var suggest_nutrient_name = "";
var suggest_nutrient_min = 0;  // // initialize to a very small number for case where user not set cutoff 


var daily_planCalories;
var daily_planCarbohydrate;
var daily_planProtein;
var daily_planFat;

var daily_userCalories;
var daily_userCarbohydrate;
var daily_userProtein;
var daily_userFat;


// --- Functions ---
function loadDietProfile() {
    $.get("/food-pref", function(data){
        userDietProfile = data["plan"];

        if (data["plan"] != null) {

            evaluate_calories_max = data["plan"]["cutoff_calories"];
            evaluate_carbohydrate_max = data["plan"]["cutoff_carbohydrates"];
            evaluate_protein_max = data["plan"]["cutoff_proteins"];
            evaluate_fat_max = data["plan"]["cutoff_fats"];
            evaluate_iron_max = data["plan"]["cutoff_iron"];
            evaluate_calcium_max = data["plan"]["cutoff_calcium"];
            evaluate_magnesium_max = data["plan"]["cutoff_magnesium"];
            evaluate_vitaminD_max = data["plan"]["cutoff_vitaminD"];
            evaluate_vitaminB12_max = data["plan"]["cutoff_vitaminB12"];
            
            suggest_nutrient_name = data["plan"]["required-nutrient"];
            suggest_nutrient_min = data["plan"]["required-nutrient-value"];
            
            daily_planCalories = data["plan"]["target_calories"];
            daily_planCarbohydrate = data["plan"]["plan_carbohydrates"];
            daily_planProtein = data["plan"]["plan_proteins"];
            daily_planFat = data["plan"]["plan_fats"];
        } 
    });

}


/*  --- Food Choice Decision Making ---  */
// --- Variables ---
var userFood_name;
var userFood_calories;
var userFood_carbohydrate;
var userFood_protein;
var userFood_fat;
var userFood_iron;
var userFood_calcium;
var userFood_magnesium;
var userFood_vitaminD;
var userFood_vitaminB12;

/* Impoartant parameters for food evaluation:
 * evaluate_calories_max
 * evaluate_carbohydrate_max
 * evaluate_protein_max
 * evaluate_fat_max
 * evaluate_iron_max
 * evaluate_calcium_max
 * evaluate_magnesium_max
 * evaluate_vitaminD_max
 * evaluate_vitaminB12_max
 */

var foodChoice_decision = "";
var foodchoice_reason = [];
var food_explain_calories = "";
var food_explain_carbohydrate = "";
var food_explain_protein = "";
var food_explain_fat = "";
var food_explain_iron = "";
var food_explain_calcium = "";
var food_explain_magnesium = "";
var food_explain_vitaminD = "";
var food_explain_vitaminB12 = "";


// --- Functions ---
//Helper Function: generate an explanation for food evaluation
function makeFoodChoiceExplanation(foodName, nutrientName, foodNutrientValue, NutrientThreshold, operator){

    explanation = foodName + " " + nutrientName + " = " + foodNutrientValue + " " +
        operator + " allowed " + nutrientName + " = " + NutrientThreshold;
    
        return explanation;
}



// Major function:
function foodChoiceEvaluation(userFood) {

    // Get the food's nutrition data
    userFood_name = userFood["name"];
    userFood_calories = parseFloat(userFood["calories"]); 
    userFood_carbohydrate = parseFloat(userFood["carbohydrates"]);
    userFood_protein = parseFloat(userFood["proteins"]);
    userFood_fat = parseFloat(userFood["fats"]);
    userFood_iron = parseFloat(userFood["iron"]);
    userFood_calcium = parseFloat(userFood["calcium"]);
    userFood_magnesium = parseFloat(userFood["magnesium"]);
    userFood_vitaminD = parseFloat(userFood["vitaminD"]);
    userFood_vitaminB12 = parseFloat(userFood["vitaminB12"]);

    foodChoice_decision = "Good Food"; // Assume a good food initially
    decisionData = [userFood_name, foodChoice_decision];


    /* Decision Tree Level 1: Check micronutrients */
    if (userFood_iron > evaluate_iron_max) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_iron = makeFoodChoiceExplanation(userFood_name, "iron", userFood_iron, evaluate_iron_max, ">");
        decisionData.push(food_explain_iron);
    } else {
        food_explain_iron = makeFoodChoiceExplanation(userFood_name, "iron", userFood_iron, evaluate_iron_max, "<=");
        decisionData.push(food_explain_iron);
    }

    if (userFood_calcium > evaluate_calcium_max) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_calcium = makeFoodChoiceExplanation(userFood_name, "calcium", userFood_calcium, evaluate_calcium_max, ">");
        decisionData.push(food_explain_calcium);
    } else {
        food_explain_calcium = makeFoodChoiceExplanation(userFood_name, "calcium", userFood_calcium, evaluate_calcium_max, "<=");
        decisionData.push(food_explain_calcium);
    }

    if (userFood_magnesium > evaluate_magnesium_max) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_magnesium = makeFoodChoiceExplanation(userFood_name, "magnesium", userFood_magnesium, evaluate_magnesium_max, ">");
        decisionData.push(food_explain_magnesium);
    } else {
        food_explain_magnesium = makeFoodChoiceExplanation(userFood_name, "magnesium", userFood_magnesium, evaluate_magnesium_max, "<=");
        decisionData.push(food_explain_magnesium);
    }

    if (userFood_vitaminD > evaluate_vitaminD_max) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_vitaminD = makeFoodChoiceExplanation(userFood_name, "vitamin D", userFood_vitaminD, evaluate_vitaminD_max, ">");
        decisionData.push(food_explain_vitaminD);
    } else {
        food_explain_vitaminD = makeFoodChoiceExplanation(userFood_name, "vitamin D", userFood_vitaminD, evaluate_vitaminD_max, "<=");
        decisionData.push(food_explain_vitaminD);
    }

    if (userFood_vitaminB12 > evaluate_vitaminB12_max) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_vitaminB12 = makeFoodChoiceExplanation(userFood_name, "vitamin B12", userFood_vitaminB12, evaluate_vitaminB12_max, ">");
        decisionData.push(food_explain_vitaminB12);
    } else {
        food_explain_vitaminB12 = makeFoodChoiceExplanation(userFood_name, "vitamin B12", userFood_vitaminB12, evaluate_vitaminB12_max, "<=");
        decisionData.push(food_explain_vitaminB12);
    }



    /* Decision Tree Level 2: Check macronutrients */
    if (userFood_carbohydrate > evaluate_carbohydrate_max) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_carbohydrate = makeFoodChoiceExplanation(userFood_name, "carbohydrates", userFood_carbohydrate, evaluate_carbohydrate_max, ">");
        decisionData.push(food_explain_carbohydrate);

    } else {
        food_explain_carbohydrate = makeFoodChoiceExplanation(userFood_name, "carbohydrates", userFood_carbohydrate, evaluate_carbohydrate_max, "<=");
        decisionData.push(food_explain_carbohydrate);
    }


    if (userFood_protein > evaluate_protein_max) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_protein = makeFoodChoiceExplanation(userFood_name, "proteins", userFood_protein, evaluate_protein_max, ">");
        decisionData.push(food_explain_protein);
    } else {
        food_explain_protein = makeFoodChoiceExplanation(userFood_name, "proteins", userFood_protein, evaluate_protein_max, "<=");
        decisionData.push(food_explain_protein);
    }

    if (userFood_fat > evaluate_fat_max) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_fat = makeFoodChoiceExplanation(userFood_name, "fats", userFood_fat, evaluate_fat_max, ">");
        decisionData.push(food_explain_fat);

    } else {
        food_explain_fat = makeFoodChoiceExplanation(userFood_name, "fats", userFood_fat, evaluate_fat_max, "<=");
        decisionData.push(food_explain_fat);
    }


    /* Decision Tree Level 3: Check calories */
    if (userFood_calories > evaluate_calories_max) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_calories = makeFoodChoiceExplanation(userFood_name, "calories", userFood_calories, evaluate_calories_max, ">");
        decisionData.push(food_explain_calories);
    } else {
        food_explain_calories = makeFoodChoiceExplanation(userFood_name, "calories", userFood_calories, evaluate_calories_max, "<=");
        decisionData.push(food_explain_calories);
    }


    decisionData_string = decisionData.join();
    return decisionData_string;
}





/*  --- Food Suggestion Decision Making ---  */
function foodSuggestEvaluation(aiFood) {



}



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