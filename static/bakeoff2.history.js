//  ................................................................................
//  bakeoff2.history.js
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
var tabName = 'History';
var tabColor = 'orange';

// --- In-Use ---
openTab(tabName, tabColor)


//Wait till document is "loaded" before starting data stuff, just in case of bugs or something
$(document).ready(function() {
    /*  --- Datepiacker ---  */
    // --- Initialization ---
    $("#datepicker").datepicker();


    /*  --- DataTable ---  */
    // https://datatables.net/forums/discussion/50691/how-to-use-columndefs-multiple-time-in-a-datatable
    // https://datatables.net/forums/discussion/43625/change-a-cells-css-based-on-a-different-cells-value
    // --- Initialization ---
    $('table.display').DataTable({
        // https://datatables.net/forums/discussion/50691/how-to-use-columndefs-multiple-time-in-a-datatable
        "columnDefs": [
            {
                targets: -2,
                // https://datatables.net/reference/option/columns.createdCell
                createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
                },
                // https://datatables.net/reference/option/columns.render
                // https://datatables.net/forums/discussion/44145/showing-object-object-instead-of-showing-the-button-with-id-in-data-id-in-editor
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
            }
        ],
        "searching": false,
        "paging": false,
        "info": false
    })  //Default clear the table until filled
    .clear().draw();

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
        "food": data[0],
        "meal": meal,
        "date": $("#datepicker").val()
    };
    $(meal_ID).DataTable().row(row_selector).remove().draw();
    $.ajax({        //theres no $.delete, so do it the sad ugly way 
        url: "/food-log" + window.location.search,
        type: "DELETE",
        data: my_data, 
        dataType: "json"             
    });
};

// --- In-Use ---
$("#history-search-icon").click(function(){

    $.get("/food-log" + window.location.search, function(data){
        sel_date = $("#datepicker").val()

        //clear all meal tables
        $('table.display').DataTable().clear().draw();

        user = data["user"];
        foods_breakfast = data[sel_date]["Breakfast"];
        foods_lunch = data[sel_date]["Lunch"];
        foods_dinner = data[sel_date]["Dinner"];


        //load breakfast table
        // https://datatables.net/forums/discussion/43625/change-a-cells-css-based-on-a-different-cells-value
        // https://datatables.net/forums/discussion/48165/how-to-get-row-index-of-recently-added-row
        // https://datatables.net/forums/discussion/49576/get-specific-cell-value-using-row-col-index-coordinates
        // http://live.datatables.net/poyoqoda/1/edit
        // https://datatables.net/reference/api/cell()
        // https://datatables.net/reference/api/cell().data()
        // https://datatables.net/reference/api/cells()
        // https://www.geeksforgeeks.org/jquery-css-method/

        for(i = 0; i < foods_breakfast.length; i++){
            var food_nutrition = foods_breakfast[i];
            var food_name = food_nutrition["name"];
            var food_decision = foodChoiceEvaluation(food_nutrition);

            // https://www.tutorialrepublic.com/faq/how-to-convert-comma-separated-string-into-an-array-in-javascript.php
            $("#table_breakfast").DataTable().row.add([food_nutrition["name"], food_nutrition["serving"],
            food_nutrition["calories"], food_nutrition["carbohydrates"], 
            food_nutrition["proteins"], food_nutrition["fats"], food_decision]).draw();
        };


        //load lunch table
        for(i = 0; i < foods_lunch.length; i++){
            var food_nutrition = foods_lunch[i];
            var food_name = food_nutrition["name"];
            var food_decision = foodChoiceEvaluation(food_nutrition);

            $("#table_lunch").DataTable().row.add([food_nutrition["name"], food_nutrition["serving"],
            food_nutrition["calories"], food_nutrition["carbohydrates"], 
            food_nutrition["proteins"], food_nutrition["fats"], food_decision]).draw();
        };

        //load dinner table
        for(i = 0; i < foods_dinner.length; i++){
            var food_nutrition = foods_dinner[i];
            var food_name = food_nutrition["name"];
            var food_decision = foodChoiceEvaluation(food_nutrition);

            $("#table_dinner").DataTable().row.add([food_nutrition["name"], food_nutrition["serving"],
            food_nutrition["calories"], food_nutrition["carbohydrates"], 
            food_nutrition["proteins"], food_nutrition["fats"], food_decision]).draw();
        };

        // style food tags
        $("label:contains('Good Food')").css( "color", "white");
        $("label:contains('Good Food')").css( "padding", "5px");
        $("label:contains('Bad Food')").css( "color", "white");
        $("label:contains('Bad Food')").css( "padding", "5px");
        // https://api.jquery.com/contains-selector/
        $("label:contains('Good Food')").css( "background-color", "lightseagreen" );
        $("label:contains('Bad Food')").css( "background-color", "tomato" );

        alert("Data was retrieved for user: " + user);
    });
});

$("#table_breakfast tbody").on('click', 'button', function () {
    deleteItem('#table_breakfast', 'Breakfast', $(this).parents('tr'));
} );


$("#table_breakfast tbody").on('click', 'label', function () {
    var cell_row = $(this).parents('tr');
    var cell_data = $("#table_breakfast").DataTable().cell(cell_row, -2).data();
    var cell_data_array = cell_data.split(",");

    //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
    document.getElementById("history-alert").innerHTML =  cell_data_array[0] + " is " + cell_data_array[1] + " because:" + "<br />";
    
    // https://www.geeksforgeeks.org/how-to-append-html-code-to-a-div-using-javascript/
    for (var i = 2; i < cell_data_array.length; i++) {
        document.getElementById("history-alert").innerHTML += "• " + cell_data_array[i] + "<br />";
    }

    if (cell_data_array[1] == "Good Food") alert('Good Food Label Clicked!');
    if (cell_data_array[1] == "Bad Food")  lert('Bad Food Label Clicked!');

} );

$("#table_lunch tbody").on('click', 'label', function () {
    var cell_row = $(this).parents('tr');
    var cell_data = $("#table_lunch").DataTable().cell(cell_row, -2).data();
    var cell_data_array = cell_data.split(",");

    //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
    document.getElementById("history-alert").innerHTML =  cell_data_array[0] + " is " + cell_data_array[1] + " because:" + "<br />";
    
    // https://www.geeksforgeeks.org/how-to-append-html-code-to-a-div-using-javascript/
    for (var i = 2; i < cell_data_array.length; i++) {
        document.getElementById("history-alert").innerHTML += "• " + cell_data_array[i] + "<br />";
    }

    if (cell_data_array[1] == "Good Food") alert('Good Food Label Clicked!');
    if (cell_data_array[1] == "Bad Food") alert('Bad Food Label Clicked!');

} );



$("#table_dinner tbody").on('click', 'label', function () {
    var cell_row = $(this).parents('tr');
    var cell_data = $("#table_dinner").DataTable().cell(cell_row, -2).data();
    var cell_data_array = cell_data.split(",");

    //https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
    document.getElementById("history-alert").innerHTML =  cell_data_array[0] + " is " + cell_data_array[1] + " because:" + "<br />";
    
    // https://www.geeksforgeeks.org/how-to-append-html-code-to-a-div-using-javascript/
    for (var i = 2; i < cell_data_array.length; i++) {
        document.getElementById("history-alert").innerHTML += "• " + cell_data_array[i] + "<br />";
    }

    if (cell_data_array[1] == "Good Food") alert('Good Food Label Clicked!');
    if (cell_data_array[1] == "Bad Food") alert('Bad Food Label Clicked!');

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

    //update user's diet profile object
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
