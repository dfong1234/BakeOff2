//	................................................................................
//  bakeoff2.preference.js
//	javascript for User Preference page of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 11/30/2019
//	................................................................................

/*  --- ---  */
// --- Initialization ---

// --- Variables ---

// --- Functions ---

// --- In-Use ---


/*  --- Website Header and Tabs ---  */
// --- Variables ---
var tabName = 'Preference';
var color = 'dodgerblue';

// --- In-Use ---
openTab(tabName, color) 



/*  --- Loading Diet Profile ---  */
// --- Variables ---
var userDietProfile = {};

// --- Functions ---
function loadDietProfile() {
    $.get("/food-pref", function(data){
        userDietProfile = data["plan"];

        if (data["plan"] != null) {
            $("#dri-calories").val(data["plan"]["target_calories"]);
            $("#age").val(data["plan"]["age"]);
            $("#height").val(data["plan"]["height"]);
            $("#weight").val(data["plan"]["weight"]);    
            $("#sex").val(data["plan"]["sex"]);
            $("#activity").val(data["plan"]["activity_level"]);

            $("#user-calories").val(data["plan"]["plan_calories"]);
            $("#user-carbohydrates").val(data["plan"]["plan_carbohydrates"]);
            $("#user-proteins").val(data["plan"]["plan_proteins"]);
            $("#user-fats").val(data["plan"]["plan_fats"]);

            $("#cutoff-calories").val(data["plan"]["cutoff_calories"]);
            $("#cutoff-carbohydrates").val(data["plan"]["cutoff_carbohydrates"]);
            $("#cutoff-proteins").val(data["plan"]["cutoff_proteins"]);
            $("#cutoff-fats").val(data["plan"]["cutoff_fats"]);
            $("#slider-user-carbohydrates").slider("value", Math.round(data["plan"]["plan_carbohydrates"] * 4 / data["plan"]["plan_calories"] * 100) );
            $("#slider-user-proteins").slider("value", Math.round(data["plan"]["plan_proteins"] * 4 / data["plan"]["plan_calories"]* 100) );
            $("#slider-user-fats").slider("value", Math.round(data["plan"]["plan_fats"] * 9 / data["plan"]["plan_calories"] * 100) );

            for(let i = 0; i < data["plan"]["micronutrient_rules"].length; i++){
                $("#rules-table").DataTable().row.add([data["plan"]["micronutrient_rules"][i]["micronutrient"], data["plan"]["micronutrient_rules"][i]["operator"], data["plan"]["micronutrient_rules"][i]["amount"], "0"]).draw();
                micronutrientRules.push({
                    "micronutrient": data["plan"]["micronutrient_rules"][i]["micronutrient"],
                    "operator": data["plan"]["micronutrient_rules"][i]["operator"],
                    "amount": data["plan"]["micronutrient_rules"][i]["amount"]
                })
            }
        }
    });
}

/*  --- Daily Reference Intake Planner ---  */
// Dietary Reference Intakes: The Essential Guide to Nutrient Requirements (2006)
// https://www.nap.edu/read/11537/chapter/8
// http://www.nationalacademies.org/hmd/~/media/Files/Activity%20Files/Nutrition/DRI-Tables/8_Macronutrient%20Summary.pdf

// --- Variables ---
var userSex = $("#sex").val();
var userAge = $("#age").val();
var userHeight = $("#height").val();
var userWeight = $("#weight").val();
var userActivityLevel = $("#activity").val();

var dri_calories = $("#dri-calories").val();
var user_calories = $("#user-calories").val();
var carbohydrate = $("#user-carbohydrates").val();
var protein = $("#user-proteins").val();
var fat = $("#user-fats").val();

// --- Functions ---
function calculateCalories_EER() {
    // EER for ages 0 to 2
    if (userAge == 0) {
        return Math.round(((89 * userWeight) - 100) + 68.75);
    }
    if (userAge <= 2) {
        return Math.round(((89 * userWeight) - 100) + 20.00);
    }

    // Get PA coefficient
    var userPA;
    if (userActivityLevel == "Sedentary") userPA = 1.00;
    if (userActivityLevel == "Low Active") {
        if (userSex == "Male") {
            userPA = (userAge <= 18 ? 1.13 : 1.11);
        }
        if (userSex == "Female") {
            userPA = (userAge <= 18 ? 1.16 : 1.12);
        }
    }

    if (userActivityLevel == "Active") {
        if (userSex == "Male") {
            userPA = (userAge <= 18 ? 1.26 : 1.25);
        }
        if (userSex == "Female") {
            userPA = (userAge <= 18 ? 1.31 : 1.27);
        }
    }

    if (userActivityLevel == "Very Active") {
        if (userSex == "Male") {
            userPA = (userAge <= 18 ? 1.42 : 1.48);
        }
        if (userSex == "Female") {
            userPA = (userAge <= 18 ? 1.56 : 1.45);
        }
    }

    function EER_Equation(d){
        return (Math.round((d[0] - (d[1] * userAge) + (userPA * ((d[2] * userWeight) + (d[3] * userHeight)) ) + d[4]) / 10 ) * 10);
    }

    // EER for ages 3 to 18
    if (userAge <= 8) {
        if (userSex == "Male") {
            return EER_Equation([88.5, 61.9, 26.7, 903, 20]);
            //return Math.round(88.5 - (61.9 * userAge) + (userPA * ((26.7 * userWeight) + (903 * userHeight)) ) + 20);
        }
        if (userSex == "Female") {
            return EER_Equation([135.3, 30.8, 10.0, 934, 20]);
            //return Math.round(135.3 - (30.8 * userAge) + (userPA * ((10.0 * userWeight) + (934 * userHeight)) ) + 20);
        }
    }

    if (userAge <= 18) {
        if (userSex == "Male") {
            return EER_Equation([88.5, 61.9, 26.7, 903, 25]);
            //return Math.round(88.5 - (61.9 * userAge) + (userPA * ((26.7 * userWeight) + (903 * userHeight)) ) + 25);
        }
        if (userSex == "Female") {
            return EER_Equation([135.3, 30.8, 10.0, 934, 25])
            //return Math.round((135.3 - (30.8 * userAge) + (userPA * ((10.0 * userWeight) + (934 * userHeight))) + 25));
        }
    }
    
    // EER for ages 19+
    if (userAge > 18) {
        if (userSex == "Male") {
            return EER_Equation([662, 9.53, 15.91, 539.6, 0]);
            //return Math.round((662 - (9.53 * userAge) + (userPA * ((15.91 * userWeight) + (539.6 * userHeight)))));
        }
        if (userSex == "Female") {
            return EER_Equation([354, 6.91, 9.36, 726, 0]);
            //return (Math.round((354 - (6.91 * userAge) + (userPA * ((9.36 * userWeight) + (726 * userHeight)))) * 100) / 100);
        }
    }

}
//Keep these simple since everything is an approximation anyway
function calculateCarbohydrate() {
    // 1 gram carbohydrate gives 4 calories
    // Account for 45% to 65% of EER --> use 50%
    return Math.round(0.50 * dri_calories / 4);
}

function calculateProtein() {
    // 1 gram protein gives 4 calories
    // Account for 10% to 35% of EER --> use 25%
    return Math.round(0.25 * dri_calories / 4);

}

function calculateFat() {
    // 1 gram fat gives 9 calories
    // Account for 20% to 35% of EER --> use 25%
    return Math.round(0.25 * dri_calories / 9);
}


// --- In-Use ---
$("#dri-calculate-button").click(function() {
    userAge = $("#age").val();
    userHeight = $("#height").val();
    userWeight = $("#weight").val();    
    userSex = $("#sex").val();
    userActivityLevel = $("#activity").val();
    
	dri_calories = calculateCalories_EER();
    $("#dri-calories").val(dri_calories);
    
    carbohydrate = calculateCarbohydrate();
    $("#user-carbohydrates").val(carbohydrate);
    protein = calculateProtein();
    $("#user-proteins").val(protein);
    fat = calculateFat();
    $("#user-fats").val(fat);

    user_calories = dri_calories;
    $("#user-calories").val(user_calories);

    $("#slider-user-carbohydrates").slider("value", 50);
    $("#slider-user-proteins").slider("value", 25);
    $("#slider-user-fats").slider("value", 25);

    alert("Diet Plan updated!");
});

$("#dri-adjust-button").click(function() {
    carbohydrate = $("#user-carbohydrates").val();
    protein = $("#user-proteins").val();
    fat = $("#user-fats").val();

    user_calories = Math.round((4 * carbohydrate + 4 * protein + 9 * fat) / 10) * 10;
    $("#user-calories").val(user_calories);

    alert("Diet Plan Adjusted!");
});

/*  --- Single Food's Cutoffs Planner ---  */
// --- Variables ---
var userFood_calories_cutoff = $("#cutoff-calories").val();
var userFood_carbohydrate_cutoff = $("#cutoff-carbohydrates").val();
var userFood_protein_cutoff = $("#cutoff-proteins").val();
var userFood_fat_cutoff = $("#cutoff-fats").val();

// --- In-Use ---
$("#food-cutoff-button").click(function() {
    userFood_calories_cutoff = $("#cutoff-calories").val();
    userFood_carbohydrate_cutoff = $("#cutoff-carbohydrates").val();
    userFood_protein_cutoff = $("#cutoff-proteins").val();
    userFood_fat_cutoff = $("#cutoff-fats").val();

    alert("Food Cutoffs updated!");
});


/*  --- Micronutrient Rules ---  */
// --- Variables ---
var micronutrientRules = []; 

// --- In-Use ---
$("#add-micronutrient-button").click(function() {
    var rule = {
        "micronutrient": $("#rule-micronutrient").val(),
        "operator": $("#rule-operator").val(),
        "amount": $("#rule-amount").val()
    };
    micronutrientRules.push(rule);
    $("#rules-table").DataTable().row.add([rule["micronutrient"], rule["operator"], rule["amount"], "0"]).draw();
});

/*  --- Saving Diet Profile ---  */
// --- In-Use ---
$("#preference-save-button").click(function() {
    //create user's diet profile object

    user_DietProfile = {
		"age"       	 : userAge,
		"sex" 			 : userSex,
		"height"		 : userHeight,
		"weight"		 : userWeight,
		"activity_level" : userActivityLevel,

        "target_calories": dri_calories,
        "plan_calories": user_calories,
        "plan_carbohydrates": carbohydrate,
        "plan_proteins": protein,
        "plan_fats": fat,

        "cutoff_calories": userFood_calories_cutoff,
        "cutoff_carbohydrates": userFood_carbohydrate_cutoff,
        "cutoff_proteins": userFood_protein_cutoff,
        "cutoff_fats": userFood_fat_cutoff,

        "micronutrient_rules" : JSON.stringify(micronutrientRules)
    };

    $.post("/food-pref", user_DietProfile, null, "json");

    alert("Preference Profile Saved!");
});

$("#preference-restore-button").click(function() {
    loadDietProfile();
    alert("Preferences Restored!");
});


$("#rules-table tbody").on('click', 'button', function () {
    $("#rules-table").DataTable().row($(this).parents('tr')).remove().draw();
});

//Wait till document is "loaded" before starting data stuff, just in case of bugs or something
$( document ).ready(function() {
    $("#slider-user-proteins").slider({
        max: 100,
        min: 0,
        step: 1,
        slide: function(event, ui){
            var calories = $("#dri-calories").val();
            var percentage = parseInt(ui.value);
            protein = Math.round(percentage * 0.01 * calories / 4);
            $("#user-proteins").val(protein);
            user_calories = Math.round((4 * carbohydrate + 4 * protein + 9 * fat) / 10) * 10;
            $("#user-calories").val(user_calories);
        },
    });

    $("#slider-user-carbohydrates").slider({
        max: 100,
        min: 0,
        step: 1,
        slide: function(event, ui){
            var calories = $("#dri-calories").val();
            var percentage = ui.value;
            carbohydrate = Math.round(percentage * 0.01 * calories / 4);
            $("#user-carbohydrates").val(carbohydrate);
            user_calories = Math.round((4 * carbohydrate + 4 * protein + 9 * fat) / 10) * 10;
            $("#user-calories").val(user_calories);
        }
    });

    $("#slider-user-fats").slider({
        max: 100,
        min: 0,
        step: 1,
        slide: function(event, ui){
            var calories = $("#dri-calories").val();
            var percentage = ui.value;
            fat = Math.round(percentage * 0.01 * calories / 9);
            $("#user-fats").val(fat);
            user_calories = Math.round((4 * carbohydrate + 4 * protein + 9 * fat) / 10) * 10;
            $("#user-calories").val(user_calories);
        }
    });

    $('#rules-table').DataTable({
        "columnDefs": [{
            "targets": -1,
            "data": null,
            "defaultContent": "<button type=\"submit\" id=\"b_expand_food\"><i class=\"fas fa-trash-alt\"></i></button>"
        }],
        "searching": false,
        "info": false
    }).clear().draw();

    loadDietProfile();
});
