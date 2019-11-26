//  ................................................................................
//  bakeoff2.history.js
//  javascript for index page of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 10/23/2019
//  ................................................................................

var tabName = 'History';
var color = 'orange';

openTab(tabName, color)

var searchParams = new URLSearchParams(window.location.search)

var food_url = "/food-log" + window.location.search;

$("#b_load").click(function(){
    $.get(food_url, function(data){
        var sel_date = $("#datepicker").val()
        //clear all the food tables
        $('table.display').DataTable().clear().draw();

        var meal_items = data[sel_date]["Breakfast"];
        for(i = 0; i < meal_items.length; i++){
            $("#table_breakfast").DataTable().row.add([ meal_items[i], "0", "0", "0"]).draw();
        };

        meal_items = data[sel_date]["Lunch"];
        for(i = 0; i < meal_items.length; i++){
            $("#table_lunch").DataTable().row.add([meal_items[i], "0", "0", "0"]).draw();
        };

        meal_items = data[sel_date]["Dinner"];
        for(i = 0; i < meal_items.length; i++){
            $("#table_dinner").DataTable().row.add([meal_items[i], "0", "0", "0"]).draw();
        };
        alert("Data was retrieved for user: " + data["user"]);
    });
});

$("#table_breakfast tbody").on('click', 'button', function () {
    deleteItem('#table_breakfast', 'Breakfast', $(this).parents('tr'));
} );

$("#table_lunch tbody").on('click', 'button', function () {
    deleteItem('#table_lunch', 'Lunch', $(this).parents('tr'));
} );

$("#table_dinner tbody").on('click', 'button', function () {
    deleteItem('#table_dinner', 'Dinner', $(this).parents('tr'));
} );

function deleteItem(meal_ID, meal, row_selector) {
    var data = $(meal_ID).DataTable().row(row_selector).data();
    var my_data = {"user": "tester",
        "food": data[0],
        "meal": meal,
        "date": $("#datepicker").val()
    };
    $(meal_ID).DataTable().row(row_selector).remove().draw();
    $.ajax({        //theres no $.delete, so do it the sad ugly way 
        url: food_url,
        type: "DELETE",
        data: my_data, 
        dataType: "json"             
    });
};