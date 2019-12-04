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

// --- Functions ---
function loadDietProfile() {
    $.get("/food-pref", function(data){
        userDietProfile = data["plan"];

        if (data["plan"] != null) {

            userFood_calories_cutoff = data["plan"]["cutoff_calories"];
            userFood_carbohydrate_cutoff = data["plan"]["cutoff_carbohydrates"];
            userFood_protein_cutoff = data["plan"]["cutoff_proteins"];
            userFood_fat_cutoff = data["plan"]["cutoff_fats"];
            userFood_iron_cutoff = data["plan"]["cutoff_iron"];
            userFood_calcium_cutoff = data["plan"]["cutoff_calcium"];
            userFood_magnesium_cutoff = data["plan"]["cutoff_magnesium"];
            userFood_vitaminD_cutoff = data["plan"]["cutoff_vitaminD"];
            userFood_vitaminB12_cutoff = data["plan"]["cutoff_vitaminB12"];
            
            aiFood_required_nutrient  = data["plan"]["required-nutrient"];
            aiFood_required_condition = data["plan"]["required-nutrient-value"];
            
            dailyPlan_calories = data["plan"]["target_calories"];
            dailyPlan_carbohydrates = data["plan"]["plan_carbohydrates"];
            dailyPlan_proteins = data["plan"]["plan_proteins"];
            dailyPlan_Fats = data["plan"]["plan_fats"];
        } 
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
var userFood_iron;
var userFood_calcium;
var userFood_magnesium;
var userFood_vitaminD;
var userFood_vitaminB12;

// From User Diet Profile:
var userFood_calories_cutoff = 99999;  // initialize to a very large number for case where user not set cutoff
var userFood_carbohydrate_cutoff = 99999;
var userFood_protein_cutoff = 99999;
var userFood_fat_cutoff = 99999;
var userFood_iron_cutoff = 99999;
var userFood_calcium_cutoff = 99999;
var userFood_magnesium_cutoff = 99999;
var userFood_vitaminD_cutoff = 99999;
var userFood_vitaminB12_cutoff = 99999;

// For Food Evaluation Results:
var foodChoice_decision = "";
var decisionData = [];
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
// Helper Function: generate an explanation for food evaluation
function makeEvaluateExplanation(foodName, nutrientName, foodNutrientValue, NutrientThreshold, operator){
    explanation = foodName + " " + nutrientName + " = " + foodNutrientValue + " " +
        operator + " allowed " + nutrientName + " = " + NutrientThreshold;
    
    return explanation;
}

// Major function:
function food_EvaluationByAI(userFood) {
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
    if (userFood_iron > userFood_iron_cutoff) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_iron = makeEvaluateExplanation(userFood_name, "iron", userFood_iron, userFood_iron_cutoff, ">");
        decisionData.push(food_explain_iron);
    } else {
        food_explain_iron = makeEvaluateExplanation(userFood_name, "iron", userFood_iron, userFood_iron_cutoff, "<=");
        decisionData.push(food_explain_iron);
    }

    if (userFood_calcium > userFood_calcium_cutoff) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_calcium = makeEvaluateExplanation(userFood_name, "calcium", userFood_calcium, userFood_calcium_cutoff, ">");
        decisionData.push(food_explain_calcium);
    } else {
        food_explain_calcium = makeEvaluateExplanation(userFood_name, "calcium", userFood_calcium, userFood_calcium_cutoff, "<=");
        decisionData.push(food_explain_calcium);
    }

    if (userFood_magnesium > userFood_magnesium_cutoff) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_magnesium = makeEvaluateExplanation(userFood_name, "magnesium", userFood_magnesium, userFood_magnesium_cutoff, ">");
        decisionData.push(food_explain_magnesium);
    } else {
        food_explain_magnesium = makeEvaluateExplanation(userFood_name, "magnesium", userFood_magnesium, userFood_magnesium_cutoff, "<=");
        decisionData.push(food_explain_magnesium);
    }

    if (userFood_vitaminD > userFood_vitaminD_cutoff) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_vitaminD = makeEvaluateExplanation(userFood_name, "vitamin D", userFood_vitaminD, userFood_vitaminD_cutoff, ">");
        decisionData.push(food_explain_vitaminD);
    } else {
        food_explain_vitaminD = makeEvaluateExplanation(userFood_name, "vitamin D", userFood_vitaminD, userFood_vitaminD_cutoff, "<=");
        decisionData.push(food_explain_vitaminD);
    }

    if (userFood_vitaminB12 > userFood_vitaminB12_cutoff) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_vitaminB12 = makeEvaluateExplanation(userFood_name, "vitamin B12", userFood_vitaminB12, userFood_vitaminB12_cutoff, ">");
        decisionData.push(food_explain_vitaminB12);
    } else {
        food_explain_vitaminB12 = makeEvaluateExplanation(userFood_name, "vitamin B12", userFood_vitaminB12, userFood_vitaminB12_cutoff, "<=");
        decisionData.push(food_explain_vitaminB12);
    }



    /* Decision Tree Level 2: Check macronutrients */
    if (userFood_carbohydrate > userFood_carbohydrate_cutoff) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_carbohydrate = makeEvaluateExplanation(userFood_name, "carbohydrates", userFood_carbohydrate, userFood_carbohydrate_cutoff, ">");
        decisionData.push(food_explain_carbohydrate);

    } else {
        food_explain_carbohydrate = makeEvaluateExplanation(userFood_name, "carbohydrates", userFood_carbohydrate, userFood_carbohydrate_cutoff, "<=");
        decisionData.push(food_explain_carbohydrate);
    }


    if (userFood_protein > userFood_protein_cutoff) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_protein = makeEvaluateExplanation(userFood_name, "proteins", userFood_protein, userFood_protein_cutoff, ">");
        decisionData.push(food_explain_protein);
    } else {
        food_explain_protein = makeEvaluateExplanation(userFood_name, "proteins", userFood_protein, userFood_protein_cutoff, "<=");
        decisionData.push(food_explain_protein);
    }

    if (userFood_fat > userFood_fat_cutoff) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_fat = makeEvaluateExplanation(userFood_name, "fats", userFood_fat, userFood_fat_cutoff, ">");
        decisionData.push(food_explain_fat);

    } else {
        food_explain_fat = makeEvaluateExplanation(userFood_name, "fats", userFood_fat, userFood_fat_cutoff, "<=");
        decisionData.push(food_explain_fat);
    }


    /* Decision Tree Level 3: Check calories */
    if (userFood_calories > userFood_calories_cutoff) {
        foodChoice_decision = "Bad Food";
        decisionData[1] = foodChoice_decision;
        food_explain_calories = makeEvaluateExplanation(userFood_name, "calories", userFood_calories, userFood_calories_cutoff, ">");
        decisionData.push(food_explain_calories);
    } else {
        food_explain_calories = makeEvaluateExplanation(userFood_name, "calories", userFood_calories, userFood_calories_cutoff, "<=");
        decisionData.push(food_explain_calories);
    }


    decisionData_string = decisionData.join();
    return decisionData_string;
}





/*  --- Food Suggestion Decision Making ---  */
// --- Variables ---
var aiFood_required_condition = "";
var aiFood_required_nutrient = "";


var dailyPlan_calories = 0; 
var dailyPlan_carbohydrates = 0; 
var dailyPlan_proteins = 0;  
var dailyPlan_fats = 0;  

var allMeals_calories = 0;
var allMeals_carbohydrates = 0;
var allMeals_proteins = 0;
var allMeals_fats = 0;


// --- Functions ---
// Helper Function: generate an explanation for food evaluation
function makeSuggestExplanation(foodName, nutrientName, foodNutrientValue, NutrientThreshold, operator){
 /*
    explanation = foodName + " " + nutrientName + " = " + foodNutrientValue + " " +
        operator + " allowed " + nutrientName + " = " + NutrientThreshold;
    
        return explanation;
 */
    return ("")
}

// Major function:
function foods_SuggestionByAI(aiFoods, nutrientCriteria) {
    // Get the food's nutrition data
    aiFood_name = aiFood["name"];
    aiFood_tags = aiFood["nutrition-tags"];

    aiFood_required_nutrient = nutrientCriteria[0];
    aiFood_required_condition = nutrientCriteria[1];


    decisionData = [aiFood_name];


    // Level 1: check the requested tag --> if ask high carb, check existence of high carb tag

    // Level 2: check if other high tags exist. if exists, ignore this food


    aiFood_required_tag = aiFood_required_nutrient + " " + aiFood_required_condition;
    if (aiFood_tags.includes(aiFood_required_tag)) {
        decisionData.push(aiFood_required_tag);

        food_explain_nutrient = makeSuggestExplanation(userFood_name, "calories", userFood_calories, userFood_calories_cutoff, "<=");

        decisionData.push(food_explain_calories);
    }


    if (aiFood_tags.includes(aiFood_required_tag)) {
        decisionData.push(aiFood_required_tag);

        food_explain_nutrient = makeSuggestExplanation(userFood_name, "calories", userFood_calories, userFood_calories_cutoff, "<=");

        decisionData.push(food_explain_calories);
    }





    // ...


    
    decisionData_string = decisionData.join();
    return decisionData_string;
}
