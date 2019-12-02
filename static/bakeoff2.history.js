//  ................................................................................
//  bakeoff2.history.js
//  javascript for index page of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 11/30/2019
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



/*  --- Datepiacker ---  */
// --- Initialization ---
$(function() {
    $("#datepicker").datepicker();
});



/*  --- DataTable ---  */
// --- Initialization ---
$(document).ready( function () {
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
                "targets": -1,
                "data": null,
                "defaultContent": "<button type=\"submit\" id=\"b_delete_item\"><i class=\"fas fa-trash-alt\"></i></button>",
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



/*  --- Meal Table Report --- */
// --- Variables ---
var user = "";
var sel_date = "";
var foods_breakfast = [];
var foods_lunch = [];
var foods_dinner = [];

// --- Functions ---
//helper function for find a food's nutrition facts from local database
function findFoodFacts(food){
    for(i = 0; i < foods_localData.length; i++) {
        if(foods_localData[i]["name"] == food){
            return foods_localData[i];
        }
    }
}

// --- In-Use ---
$("#history-search-icon").click(function(){

    $.get("/food-log" + window.location.search, function(data){
        sel_date = $("#datepicker").val()
        var meal_items;

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
        meal_items = data[sel_date]["Breakfast"];
        for(i = 0; i < meal_items.length; i++){
            var food_nutrition = findFoodFacts(meal_items[i]);
            var food_name = food_nutrition["name"];
            var food_label = foodChoiceEvaluation(food_name);

            https://www.tutorialrepublic.com/faq/how-to-convert-comma-separated-string-into-an-array-in-javascript.php
            $("#table_breakfast").DataTable().row.add([food_nutrition["name"], food_nutrition["serving"],
            food_nutrition["calories"], food_nutrition["carbohydrates"], 
            food_nutrition["proteins"], food_nutrition["fats"], food_name + "," + food_label]).draw();
        };


        //load lunch table
        meal_items = data[sel_date]["Lunch"];
        for(i = 0; i < meal_items.length; i++){
            var food_nutrition = findFoodFacts(meal_items[i]);
            var food_name = food_nutrition["name"];
            var food_label = foodChoiceEvaluation(food_name);

            $("#table_lunch").DataTable().row.add([food_nutrition["name"], food_nutrition["serving"],
            food_nutrition["calories"], food_nutrition["carbohydrates"], 
            food_nutrition["proteins"], food_nutrition["fats"], food_name + "," + food_label]).draw();
        };

        //load dinner table
        meal_items = data[sel_date]["Dinner"];
        for(i = 0; i < meal_items.length; i++){
            var food_nutrition = findFoodFacts(meal_items[i]);
            var food_name = food_nutrition["name"];
            var food_label = foodChoiceEvaluation(food_name);

            $("#table_dinner").DataTable().row.add([food_nutrition["name"], food_nutrition["serving"],
            food_nutrition["calories"], food_nutrition["carbohydrates"], 
            food_nutrition["proteins"], food_nutrition["fats"], food_name + "," + food_label]).draw();
        };

        // style food tags
        $("label").css( "color", "white");
        $("label").css( "padding", "5px");
        // https://api.jquery.com/contains-selector/
        $("label:contains('Good Food')").css( "background-color", "lightseagreen" );
        $("label:contains('Bad Food')").css( "background-color", "tomato" );

        // add eventlisteners to food tags
        // https://stackoverflow.com/questions/19655189/javascript-click-event-listener-on-class
        var goodFoodLabels = document.getElementsByClassName("food-tag-Good-Food");
        var badFoodLabels = document.getElementsByClassName("food-tag-Bad-Food");

        var explanation_GoodFood = function() {
            document.getElementById("history-alert").innerHTML = "I am a Good Food!";
            alert('Good Food Label Clicked!')
        };
        var explanation_BadFood = function() {
            document.getElementById("history-alert").innerHTML = "I am a Bad Food!";
            alert('Bad Food Label Clicked!')
        };

        for (var i = 0; i < goodFoodLabels.length; i++) {
            goodFoodLabels[i].addEventListener('click', explanation_GoodFood, false);
        }
        for (var i = 0; i < badFoodLabels.length; i++) {
            badFoodLabels[i].addEventListener('click', explanation_BadFood, false);
        }


        alert("Data was retrieved for user: " + user);
    });
});




/*
$(".food-tag-Good-Food").bind('click', function(){

    alert('Good Food Label Clicked!')
    var explanation_textbox = $('#history-alert');
    explanation_textbox.style.display = "block"; 

});
*/

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

$("#table_breakfast tbody").on('click', 'button', function () {
    deleteItem('#table_breakfast', 'Breakfast', $(this).parents('tr'));
} );

$("#table_lunch tbody").on('click', 'button', function () {
    deleteItem('#table_lunch', 'Lunch', $(this).parents('tr'));
} );

$("#table_dinner tbody").on('click', 'button', function () {
    deleteItem('#table_dinner', 'Dinner', $(this).parents('tr'));
} );
