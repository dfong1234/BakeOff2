branch2
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
            document.getElementById("sex").value = data["plan"]["sex"]
            document.getElementById("activity").value = data["plan"]["activity_level"]

            $("#user-calories").val(data["plan"]["plan_calories"]);
            $("#user-carbohydrates").val(data["plan"]["plan_carbohydrates"]);
            $("#user-proteins").val(data["plan"]["plan_proteins"]);
            $("#user-fats").val(data["plan"]["plan_fats"]);

            $("#cutoff-calories").val(data["plan"]["cutoff_calories"]);
            $("#cutoff-carbohydrates").val(data["plan"]["cutoff_carbohydrates"]);
            $("#cutoff-proteins").val(data["plan"]["cutoff_proteins"]);
            $("#cutoff-fats").val(data["plan"]["cutoff_fats"]);
        }
    });

}

// --- In-Use ---
loadDietProfile();




/*  --- Daily Reference Intake Planner ---  */
// Dietary Reference Intakes: The Essential Guide to Nutrient Requirements (2006)
// https://www.nap.edu/read/11537/chapter/8
// http://www.nationalacademies.org/hmd/~/media/Files/Activity%20Files/Nutrition/DRI-Tables/8_Macronutrient%20Summary.pdf

// --- Variables ---
var userSex;
var userAge;
var userHeight;
var userWeight;
var userActivityLevel;

var dri_calories;
var user_calories;
var carbohydrate;
var protein;
var fat;


// --- Functions ---
function calculateCalories_EER() {
    // EER for ages 0 to 2
    if (userAge == 0) {
        return (Math.round((((89 * userWeight) - 100) + 68.75) * 100) / 100);
    }
    if (userAge <= 2) {
        return (Math.round((((89 * userWeight) - 100) + 20.00) * 100) / 100);
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

    // EER for ages 3 to 18
    if (userAge <= 8) {
        if (userSex == "Male") {
            return (Math.round((88.5 - (61.9 * userAge) + (userPA * 
                ((26.7 * userWeight) + (903 * userHeight))) + 20) * 100) / 100);
        }
        if (userSex == "Female") {
            return (Math.round((135.3 - (30.8 * userAge) + (userPA * 
                ((10.0 * userWeight) + (934 * userHeight))) + 20) * 100) / 100);
        }
    }

    if (userAge <= 18) {
        if (userSex == "Male") {
            return (Math.round((88.5 - (61.9 * userAge) + (userPA * 
                ((26.7 * userWeight) + (903 * userHeight))) + 25) * 100) / 100);
        }
        if (userSex == "Female") {
            return (Math.round((135.3 - (30.8 * userAge) + (userPA * 
                ((10.0 * userWeight) + (934 * userHeight))) + 25) * 100) / 100);
        }
    }
    
    // EER for ages 19+
    if (userAge > 18) {
        if (userSex == "Male") {
            return (Math.round((662 - (9.53 * userAge) + (userPA * 
                ((15.91 * userWeight) + (539.6 * userHeight)))) * 100) / 100);
        }
        if (userSex == "Female") {
            return (Math.round((354 - (6.91 * userAge) + (userPA * 
                ((9.36 * userWeight) + (726 * userHeight)))) * 100) / 100);
        }
    }

}

function calculateCarbohydrate() {
    // 1 gram carbohydrate gives 4 calories

    // Carbohydrate for all ages 
    // Account for 45% to 65% of EER --> use 55%
    return (Math.round((0.55 * dri_calories / 4) * 100) / 100);
}

function calculateProtein() {
    // 1 gram protein gives 4 calories

    // Protein for ages 0 to 3:
    // Account for 5% to 20% of EER (extrapolated)--> use 15%
    if (userAge <= 3) {
        return (Math.round((0.15 * dri_calories / 4) * 100) / 100);
    }

    // Protein for ages 4 to 18
    // Account for 10% to 30% of EER --> use 20%
    if (userAge <= 18) {
        return (Math.round((0.2 * dri_calories / 4) * 100) / 100);
    }

    // Protein for ages 19+
    // Account for 10% to 35% of EER --> use 22.5%
    if (userAge > 18) {
        return (Math.round((0.225 * dri_calories / 4) * 100) / 100);
    }
}

function calculateFat() {
    // 1 gram fat gives 9 calories

    // Fat for ages 0 to 3:
    // Account for 30% to 40% of EER (extrapolated)--> use 35%
    if (userAge <= 3) {
        return (Math.round((0.35 * dri_calories / 9) * 100) / 100);
    }

    // Fat for ages 4 to 18
    // Account for 25% to 35% of EER --> use 30%
    if (userAge <= 18) {
        return (Math.round((0.3 * dri_calories / 9) * 100) / 100);
    }

    // Fat for ages 19+
    // Account for 20% to 35% of EER --> use 27.5%
    if (userAge > 18) {
        return (Math.round((0.275 * dri_calories / 9) * 100) / 100);
    }
}


// --- In-Use ---
$("#dri-calculate-button").click(function() {
    var element;
    userAge = $("#age").val();
    userHeight = $("#height").val();
    userWeight = $("#weight").val();    
    element = document.getElementById("sex")
    userSex = element.options[element.selectedIndex].text;
    element = document.getElementById("activity")
    userActivityLevel = element.options[element.selectedIndex].text;

    
	dri_calories = calculateCalories_EER();
    $("#dri-calories").val(dri_calories);
    
    carbohydrate = calculateCarbohydrate();
    $("#user-carbohydrates").val(carbohydrate);
    protein = calculateProtein();
    $("#user-proteins").val(protein);
    fat = calculateFat();
    $("#user-fats").val(fat);

    user_calories = Math.round((4 * carbohydrate + 4 * protein +
        9 * fat) * 100) / 100;
    $("#user-calories").val(user_calories);

    alert("Diet Plan updated!");
});

$("#dri-adjust-button").click(function() {
    carbohydrate = $("#user-carbohydrates").val();
    protein = $("#user-proteins").val();
    fat = $("#user-fats").val();

    user_calories = Math.round((4 * carbohydrate + 4 * protein +
        9 * fat) * 100) / 100;
    $("#user-calories").val(user_calories);

    alert("Diet Plan Adjusted!");
});




/*  --- Single Food's Cutoffs Planner ---  */
// --- Variables ---
var userFood_calories_cutoff = null;
var userFood_carbohydrate_cutoff = null;
var userFood_protein_cutoff = null;
var userFood_fat_cutoff = null;

// --- In-Use ---
$("#food-cutoff-button").click(function() {
    userFood_calories_cutoff = $("#cutoff-calories").val();
    userFood_carbohydrate_cutoff = $("#cutoff-carbohydrates").val();
    userFood_protein_cutoff = $("#cutoff-proteins").val();
    userFood_fat_cutoff = $("#cutoff-fats").val();

    alert("Food Cutoffs updated!");
});




/*  --- Saving Diet Profile ---  */
// --- In-Use ---
$("#preference-save-button").click(function() {
    //create user's diet profile object
    user_DietProfile = {
		"age"       	 : userAge.toString(),
		"sex" 			 : userSex,
		"height"		 : userHeight.toString(),
		"weight"		 : userWeight.toString(),
		"activity_level" : userActivityLevel,

        "target_calories": dri_calories.toString(),
        "plan_calories": user_calories.toString(),
        "plan_carbohydrates": carbohydrate.toString(),
        "plan_proteins": protein.toString(),
        "plan_fats": fat.toString(),

        "cutoff_calories": userFood_calories_cutoff.toString(),
        "cutoff_carbohydrates": userFood_carbohydrate_cutoff.toString(),
        "cutoff_proteins": userFood_protein_cutoff.toString(),
        "cutoff_fats": userFood_fat_cutoff.toString()
    };
    
    $.post("/food-pref", user_DietProfile, null, "json");

    alert("Preference Profile Saved!");
});
//=======
//	................................................................................
//  bakeoff2.preference.js
//	javascript for User Preference page of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 10/23/2019
//	................................................................................
/*
var tabName = 'Preference';
var color = 'dodgerblue';

openTab(tabName, color) 

var pref_url = "/food-pref" + window.location.search;

//Initialize sliders
$("#slider-dri-proteins").slider({
	max: 100,
	min: 0,
	step: 5,
	slide: function(event, ui){
		var calories = parseInt($("#dri-calories").val());
		var percentage = parseInt(ui.value);
		$("#dri-proteins").val(Math.round(percentage*0.01*calories/4));
	}
});

$("#slider-dri-carbohydrates").slider({
	max: 100,
	min: 0,
	step: 5,
	slide: function(event, ui){
		var calories = parseInt($("#dri-calories").val());
		var percentage = ui.value;
		$("#dri-carbohydrates").val(Math.round(percentage*0.01*calories/4));
	}
});

$("#slider-dri-fats").slider({
	max: 100,
	min: 0,
	step: 5,
	slide: function(event, ui){
		var calories = parseInt($("#dri-calories").val());
		var percentage = ui.value;
		$("#dri-fats").val(Math.round(percentage*0.01*calories/9));
	}
});

//Basal Metabolic Rate, Mifflin St Jeor Equation:
function BMREquation(){
	var s = $("#sex").val() == "Male" ? 5 : -161 ;
	return ((10 * $("#weight").val()) + (6.25 * $("#height").val() * 100) - (5 * $("#age").val()) + s);
};

$("#dri-defaults").click(function() {
	var calories = Math.round(BMREquation());
	$("#dri-calories").val(calories);

	//Default to a 40 carbs/30 fats/30 protein calorie split
	$("#slider-dri-carbohydrates").slider("value", 40);
	$("#slider-dri-proteins").slider("value", 30);
	$("#slider-dri-fats").slider("value", 30);

	$("#dri-carbohydrates").val(Math.round(0.4*calories/4));
	$("#dri-proteins").val(Math.round(0.3*calories/4));
	$("#dri-fats").val(Math.round(0.3*calories/9));

	alert("Default calories restored.");
});

$("#dri-save").click(function() {
	var data = {
		"day_calories"      : $("#dri-calories").val(),
		"day_carbohydrates" : $("#dri-carbohydrates").val(),
		"day_fats"			: $("#dri-fats").val(),
		"day_calories"		: $("#dri-calories").val()
	};
	$.post(pref_url, data, null, "json");
});

$("#preference_update_icon").click(function(){
	var data = {
		"age"       	 : $("#age").val(),
		"sex" 			 : $("#sex").val(),
		"height"		 : $("#height").val(),
		"weight"		 : $("#weight").val(),
		"activity_level" : $("activity").val()
	};
	$.post(pref_url, data, null, "json");
});
*/
