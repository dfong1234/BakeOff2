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

$("#b_load").click(function(){
    $.get("/food-log", function(data){
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
    var data = $("#table_breakfast").DataTable().row($(this).parents('tr')).data();
    var my_data = {"user": "tester",
        "food": data[0],
        "meal": "Breakfast",
        "date": $("#datepicker").val()
    };
    alert("WABBADUBDUB");
    $("#table_breakfast").DataTable().row($(this).parents('tr')).remove().draw();
    $.ajax({
        url: "/food-log",
        type: "DELETE",
        data: my_data, 
        dataType: "json"             
    });
} );

$("#table_lunch tbody").on('click', 'button', function () {
    $("#table_lunch").DataTable().row($(this).parents('tr')).remove().draw();
} );

$("#table_dinner tbody").on('click', 'button', function () {
    $("#table_dinner").DataTable().row($(this).parents('tr')).remove().draw();
} );
