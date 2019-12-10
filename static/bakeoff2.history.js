//  ................................................................................
//  bakeoff2.history.js
//  javascript for Food Log page of BakeOff2: NutriPlan
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 12/10/2019
//  ................................................................................

/*  --- Website Header and Tabs ---  */
// --- Variables ---
var tabName = 'History';
var tabColor = 'orange';

// --- In-Use ---
openTab(tabName, tabColor)


// Load HTML utility elements after the web page is loaded
$(document).ready(function() {
    /*  --- Datepiacker ---  */
    // --- Initialization ---
    $("#datepicker").datepicker();


    /*  --- DataTable ---  */
    // --- Initialization ---
    $('table.display').DataTable({

        "columnDefs": [
            {
                targets: -2,
                createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
                },
                render: function(data, type, full){
                    var data_array = data.split(",");
                    var data_class = "food-tag-" + data_array[1].replace(" ", "-");
                    return ("<label class=\""+ data_class + "\" for=\""+ data_array[0] + "\">" + data_array[1] + "</label>");
                }
            },
            {
                targets: -1,
                data: null,
                defaultContent: "<button type=\"submit\" id=\"b_delete_item\"><i class=\"fas fa-trash-alt\"></i></button>",
            },
            {
            	targets: -3,
            	render: function(data, type, full){
                    var data_array = data.split(",");
                    var return_string = ""
                    for (i = 0; i < data_array.length; i++) {
                        return_string += "<label class=\""+ data_array[i] + "\">" + data_array[i] + "</label><br><div style=\"margin-top: 4px\"></div>";
                    }
                    return return_string;
                }
            }
        ],
        "searching": false,
        "paging": false,
        "info": false
    })
    .clear().draw(); // Default: Clear any data from the table

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




/*  --- Load Food Evaluation Criteria ---  */
// --- Variables ---
var userDietProfile = {};

// --- Functions ---
function loadDietProfile() {
    $.get("/food-pref", function(data){
        userDietProfile = data["plan"];

        if (data["plan"] != null) {
            $("#cutoff-calories").val(data["plan"]["cutoff_calories"]);
            $("#cutoff-carbohydrates").val(data["plan"]["cutoff_carbohydrates"]);
            $("#cutoff-proteins").val(data["plan"]["cutoff_proteins"]);
            $("#cutoff-fats").val(data["plan"]["cutoff_fats"]);
            $("#cutoff-iron").val(data["plan"]["cutoff_iron"]);
            $("#cutoff-calcium").val(data["plan"]["cutoff_calcium"]);
            $("#cutoff-magnesium").val(data["plan"]["cutoff_magnesium"]);
            $("#cutoff-vitaminD").val(data["plan"]["cutoff_vitaminD"]);
            $("#cutoff-vitaminB12").val(data["plan"]["cutoff_vitaminB12"]);
        }
    });
}

// --- In-Use ---
loadDietProfile();





/*  --- Meal Table Report --- */
// --- Variables ---
var user = "";
var sel_date = "";
var foods_breakfast = [];
var foods_lunch = [];
var foods_dinner = [];

// --- Functions ---
// Helper Function: delete a food from user's meal log and meal tables
function deleteItem(meal_ID, meal, row_selector) {
    var data = $(meal_ID).DataTable().row(row_selector).data();
    var my_data = {"user": "tester",
        "name": data[0],
        "meal": meal,
        "date": $("#datepicker").val()
    };
    $(meal_ID).DataTable().row(row_selector).remove().draw();
    $.ajax({ // No $.delete, so do it manually 
        url: "/food-log" + window.location.search,
        type: "DELETE",
        data: my_data, 
        dataType: "json"             
    });
};

// --- In-Use ---
$("#history-search-icon").click(function(){

    $.get("/food-log" + window.location.search, function(data){
        //clear all meal tables
        $('table.display').DataTable().clear().draw();

        // Get the selected day's Food Log
        sel_date = $("#datepicker").val()
        user = data["user"];
        foods_breakfast = data[sel_date]["Breakfast"];
        foods_lunch = data[sel_date]["Lunch"];
        foods_dinner = data[sel_date]["Dinner"];


        /* Display calories and nutrients for Food Log Tables */
        // Load breakfast table
        for(let i = 0; i < foods_breakfast.length; i++){
            var food_nutrition = foods_breakfast[i];
            // Call AI for Food Evaluation
            var food_decision = food_EvaluationByAI(food_nutrition);

            var tags = food_nutrition["tags"].join(",");
            $("#table_breakfast").DataTable().row.add([food_nutrition["name"], food_nutrition["serving"],
                    food_nutrition["calories"], food_nutrition["carbohydrates"], 
                    food_nutrition["proteins"], food_nutrition["fats"], tags, food_decision]).draw();
        };

        // Load lunch table
        for(let j = 0; j < foods_lunch.length; j++){
            var food_nutrition = foods_lunch[j];
            // Call AI for Food Evaluation
            var food_decision = food_EvaluationByAI(food_nutrition);

            var tags = food_nutrition["tags"].join(",");
            $("#table_lunch").DataTable().row.add([food_nutrition["name"], food_nutrition["serving"],
                    food_nutrition["calories"], food_nutrition["carbohydrates"], 
                    food_nutrition["proteins"], food_nutrition["fats"], tags, food_decision]).draw();
        };

        // Load dinner table
        for(let k = 0; k < foods_dinner.length; k++){
            var food_nutrition = foods_dinner[k];
            // Call AI for Food Evaluation
            var food_decision = food_EvaluationByAI(food_nutrition);

            var tags = food_nutrition["tags"].join(",");
            $("#table_dinner").DataTable().row.add([food_nutrition["name"], food_nutrition["serving"],
                    food_nutrition["calories"], food_nutrition["carbohydrates"], 
                    food_nutrition["proteins"], food_nutrition["fats"], tags, food_decision]).draw();
        };


        // style food tags
        $("label:contains('Good Food')").css( "color", "white");
        $("label:contains('Good Food')").css( "padding", "5px");
        $("label:contains('Bad Food')").css( "color", "white");
        $("label:contains('Bad Food')").css( "padding", "5px");
        $("label:contains('Good Food')").css( "background-color", "lightseagreen" );
        $("label:contains('Bad Food')").css( "background-color", "tomato" );

        $("label:contains('High Proteins')").css( "background-color", "darkorange" );
        $("label:contains('High Proteins')").css( "color", "white");
        $("label:contains('High Proteins')").css( "padding", "5px");
        $("label:contains('High Proteins')").css( "display", "inline-block");
        $("label:contains('High Proteins')").css( "width", "100px");

        $("label:contains('Low Carbohydrates')").css( "background-color", "skyblue" );
        $("label:contains('Low Carbohydrates')").css( "color", "white");
        $("label:contains('Low Carbohydrates')").css( "padding", "5px");
        $("label:contains('Low Carbohydrates')").css( "display", "inline-block");
        $("label:contains('Low Carbohydrates')").css( "width", "120px");

        $("label:contains('Low Fats')").css( "background-color", "skyblue" );
        $("label:contains('Low Fats')").css( "color", "white");
        $("label:contains('Low Fats')").css( "padding", "5px");
        $("label:contains('Low Fats')").css( "display", "inline-block");
        $("label:contains('Low Fats')").css( "width", "100px");

        $("label:contains('Low Proteins')").css( "background-color", "skyblue" );
        $("label:contains('Low Proteins')").css( "color", "white");
        $("label:contains('Low Proteins')").css( "padding", "5px");
        $("label:contains('Low Proteins')").css( "display", "inline-block");
        $("label:contains('Low Proteins')").css( "width", "100px");

        $("label:contains('High Carbohydrates')").css( "background-color", "darkorange" );
        $("label:contains('High Carbohydrates')").css( "color", "white");
        $("label:contains('High Carbohydrates')").css( "padding", "5px");
        $("label:contains('High Carbohydrates')").css( "display", "inline-block");
        $("label:contains('High Carbohydrates')").css( "width", "120px");

        $("label:contains('High Fats')").css( "background-color", "darkorange" );
        $("label:contains('High Fats')").css( "color", "white");
        $("label:contains('High Fats')").css( "padding", "5px");
        $("label:contains('High Fats')").css( "display", "inline-block");
        $("label:contains('High Fats')").css( "width", "100px");

        alert("Data was retrieved for user: " + user);
    });
});


/* Explanalbe AI: show explanations when user click the AI-generated labels */
/* TODO: migrate these scattered codes to bakeoff2.ai.js */
$("#table_breakfast tbody").on('click', 'label', function () {
    var cell_row = $(this).parents('tr');
    var food_of_cell = $("#table_breakfast").DataTable().cell(cell_row, 0).data();
    var cell_data_Tags = $("#table_breakfast").DataTable().cell(cell_row, -3).data();
    var cell_data_abstractTag = $("#table_breakfast").DataTable().cell(cell_row, -2).data();
    var cell_data_Tags_array = cell_data_Tags.split(",");
    var cell_data_abstractTag_array = cell_data_abstractTag.split(",");

    console.log($(this).attr("class"));

    if ($(this).attr("class") == "food-tag-Good-Food" || $(this).attr("class") == "food-tag-Bad-Food"){
        document.getElementById("history-alert").innerHTML =  cell_data_abstractTag_array[0] + " is " + cell_data_abstractTag_array[1] + " because:" + "<br />";
        
        for (var i = 2; i < cell_data_abstractTag_array.length; i++) {
            document.getElementById("history-alert").innerHTML += "• " + cell_data_abstractTag_array[i] + "<br />";
        }

        if (cell_data_abstractTag_array[1] == "Good Food") alert('Good Food Label Clicked!');
        if (cell_data_abstractTag_array[1] == "Bad Food")  alert('Bad Food Label Clicked!');
    }

    if ($(this).attr("class") == "High Carbohydrates"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Carbohydrates" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " carbohydrates accounts for more than 40% of calories";
    }

    if ($(this).attr("class") == "High Proteins"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Proteins" + " because:" + "<br />";        
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " proteins accounts for more than 40% of calories";
    }
    
    if ($(this).attr("class") == "High Fats"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Fats" + " because:" + "<br />";   
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " fats accounts for more than 40% of calories";
    }

    if ($(this).attr("class") == "Low Carbohydrates"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Carbohydrates" + " because:" + "<br />"; 
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " carbohydrates accounts for less than 20% of calories";

    }

    if ($(this).attr("class") == "Low Proteins"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Proteins" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " proteins accounts for less than 20% of calories";
    }

    if ($(this).attr("class") == "Low Fats"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Fats" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " fats accounts for less than 20% of calories";
    }

} );


/* Explanalbe AI: show explanations when user click the AI-generated labels */
/* TODO: migrate these scattered codes to bakeoff2.ai.js */
$("#table_lunch tbody").on('click', 'label', function () {
    var cell_row = $(this).parents('tr');
    var food_of_cell = $("#table_lunch").DataTable().cell(cell_row, 0).data();
    var cell_data_Tags = $("#table_lunch").DataTable().cell(cell_row, -3).data();
    var cell_data_abstractTag = $("#table_lunch").DataTable().cell(cell_row, -2).data();
    var cell_data_Tags_array = cell_data_Tags.split(",");
    var cell_data_abstractTag_array = cell_data_abstractTag.split(",");


    console.log($(this).attr("class"));

    if ($(this).attr("class") == "food-tag-Good-Food" || $(this).attr("class") == "food-tag-Bad-Food"){
        document.getElementById("history-alert").innerHTML =  cell_data_abstractTag_array[0] + " is " + cell_data_abstractTag_array[1] + " because:" + "<br />";
        
        for (var i = 2; i < cell_data_abstractTag_array.length; i++) {
            document.getElementById("history-alert").innerHTML += "• " + cell_data_abstractTag_array[i] + "<br />";
        }

        if (cell_data_abstractTag_array[1] == "Good Food") alert('Good Food Label Clicked!');
        if (cell_data_abstractTag_array[1] == "Bad Food")  alert('Bad Food Label Clicked!');
    }


    if ($(this).attr("class") == "High Carbohydrates"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Carbohydrates" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " carbohydrates accounts for more than 40% of calories";
    }

    if ($(this).attr("class") == "High Proteins"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Proteins" + " because:" + "<br />";        
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " proteins accounts for more than 40% of calories";
    }
    
    if ($(this).attr("class") == "High Fats"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Fats" + " because:" + "<br />";   
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " fats accounts for more than 40% of calories";
    }

    if ($(this).attr("class") == "Low Carbohydrates"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Carbohydrates" + " because:" + "<br />"; 
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " carbohydrates accounts for less than 20% of calories";

    }

    if ($(this).attr("class") == "Low Proteins"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Proteins" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " proteins accounts for less than 20% of calories";
    }

    if ($(this).attr("class") == "Low Fats"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Fats" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " fats accounts for less than 20% of calories";
    }
} );


/* Explanalbe AI: show explanations when user click the AI-generated labels */
/* TODO: migrate these scattered codes to bakeoff2.ai.js */
$("#table_dinner tbody").on('click', 'label', function () {
    var cell_row = $(this).parents('tr');
    var food_of_cell = $("#table_dinner").DataTable().cell(cell_row, 0).data();
    var cell_data_Tags = $("#table_dinner").DataTable().cell(cell_row, -3).data();
    var cell_data_abstractTag = $("#table_dinner").DataTable().cell(cell_row, -2).data();
    var cell_data_Tags_array = cell_data_Tags.split(",");
    var cell_data_abstractTag_array = cell_data_abstractTag.split(",");

    console.log($(this).attr("class"));

    if ($(this).attr("class") == "food-tag-Good-Food" || $(this).attr("class") == "food-tag-Bad-Food"){
        document.getElementById("history-alert").innerHTML =  cell_data_abstractTag_array[0] + " is " + cell_data_abstractTag_array[1] + " because:" + "<br />";
        
        for (var i = 2; i < cell_data_abstractTag_array.length; i++) {
            document.getElementById("history-alert").innerHTML += "• " + cell_data_abstractTag_array[i] + "<br />";
        }

        if (cell_data_abstractTag_array[1] == "Good Food") alert('Good Food Label Clicked!');
        if (cell_data_abstractTag_array[1] == "Bad Food")  alert('Bad Food Label Clicked!');
    }

    if ($(this).attr("class") == "High Carbohydrates"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Carbohydrates" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " carbohydrates accounts for more than 40% of calories";
    }

    if ($(this).attr("class") == "High Proteins"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Proteins" + " because:" + "<br />";        
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " proteins accounts for more than 40% of calories";
    }
    
    if ($(this).attr("class") == "High Fats"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "High Fats" + " because:" + "<br />";   
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " fats accounts for more than 40% of calories";
    }

    if ($(this).attr("class") == "Low Carbohydrates"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Carbohydrates" + " because:" + "<br />"; 
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " carbohydrates accounts for less than 20% of calories";

    }

    if ($(this).attr("class") == "Low Proteins"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Proteins" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " proteins accounts for less than 20% of calories";
    }

    if ($(this).attr("class") == "Low Fats"){
        document.getElementById("history-alert").innerHTML =  food_of_cell + " has " + "Low Fats" + " because:" + "<br />";
        document.getElementById("history-alert").innerHTML += "• " + food_of_cell + 
            " fats accounts for less than 20% of calories";
    }
} );


$("#table_breakfast tbody").on('click', 'button', function () {
    deleteItem('#table_breakfast', 'Lunch', $(this).parents('tr'));
} );

$("#table_lunch tbody").on('click', 'button', function () {
    deleteItem('#table_lunch', 'Lunch', $(this).parents('tr'));
} );

$("#table_dinner tbody").on('click', 'button', function () {
    deleteItem('#table_dinner', 'Dinner', $(this).parents('tr'));
} );




/*  --- Food Evaluation Criteria Planner ---  */
// --- In-Use ---
$("#food-cutoff-button").click(function() {

    // Update user's diet profile object
    userDietProfile["cutoff_calories"] = $("#cutoff-calories").val();
    userDietProfile["cutoff_carbohydrates"] = $("#cutoff-carbohydrates").val();
    userDietProfile["cutoff_proteins"] = $("#cutoff-proteins").val();
    userDietProfile["cutoff_fats"] = $("#cutoff-fats").val();
    userDietProfile["cutoff_iron"] = $("#cutoff-iron").val();
    userDietProfile["cutoff_calcium"] = $("#cutoff-calcium").val();
    userDietProfile["cutoff_magnesium"] = $("#cutoff-magnesium").val();
    userDietProfile["cutoff_vitaminD"] = $("#cutoff-vitaminD").val();
    userDietProfile["cutoff_vitaminB12"] = $("#cutoff-vitaminB12").val();

    $.post("/food-pref", userDietProfile, null, "json");

    alert("Evaluation Criteria Saved!");
});