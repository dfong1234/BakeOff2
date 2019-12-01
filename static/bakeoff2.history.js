//  ................................................................................
//  bakeoff2.history.js
//  javascript for index page of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 10/23/2019
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
// https://datatables.net/forums/discussion/50691/how-to-use-columndefs-multiple-time-in-a-datatable
// https://datatables.net/forums/discussion/43625/change-a-cells-css-based-on-a-different-cells-value
// --- Initialization ---
$(document).ready( function () {
    $('table.display').DataTable({
        "columnDefs": [
            {
                targets: -2,
                createdCell: function (td, cellData, rowData, row, col) {
                    if (cellData == "Good Food" ) {
                        $(td).css('color', 'green');
                    }

                    if (cellData == "Bad Food" ) {
                        $(td).css('color', 'red');
                    }
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



/*  --- Meal Tables --- */
//food1_calories = data[0]["calories"]
// --- Variables ---
var foods_localData = [];

var user;
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
    
    $.get("/food-database", function(data){
        foods_localData = data;
    });

    $.get("/food-log" + window.location.search, function(data){
        var sel_date = $("#datepicker").val()
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
            var food_label = foodChoiceEvaluation(meal_items[i]);
            $("#table_breakfast").DataTable().row.add([food_nutrition["name"], food_nutrition["serving"],
            food_nutrition["calories"], food_nutrition["carbohydrates"], 
            food_nutrition["proteins"], food_nutrition["fats"], food_label]).draw();
        };


        //load lunch table
        meal_items = data[sel_date]["Lunch"];
        for(i = 0; i < meal_items.length; i++){
            var food_nutrition = findFoodFacts(meal_items[i]);
            var food_label = foodChoiceEvaluation(meal_items[i]);
            $("#table_lunch").DataTable().row.add([food_nutrition["name"], food_nutrition["serving"],
            food_nutrition["calories"], food_nutrition["carbohydrates"], 
            food_nutrition["proteins"], food_nutrition["fats"], food_label]).draw();
        };

        //load dinner table
        meal_items = data[sel_date]["Dinner"];
        for(i = 0; i < meal_items.length; i++){
            var food_nutrition = findFoodFacts(meal_items[i]);
            var food_label = foodChoiceEvaluation(meal_items[i]);
            $("#table_dinner").DataTable().row.add([food_nutrition["name"], food_nutrition["serving"],
            food_nutrition["calories"], food_nutrition["carbohydrates"], 
            food_nutrition["proteins"], food_nutrition["fats"], food_label]).draw();
        };

        alert("Data was retrieved for user: " + user);
    });
});





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
