//  ................................................................................
//  bakeoff2.index.js
//  javascript for index page of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 10/23/2019
//  ................................................................................

var tabName = 'Food';
var color = 'tomato';
    
openTab(tabName, color) 


$("#table_search tbody").on('click', 'button', function(){
    var data = $('#table_search').DataTable().row($(this).parents('tr')).data();
    var my_data = {"user": "Daniel",
        "food": data[0],
        "meal": $("#meal_time").val(),
        "date": $("#datepicker").val()
    };
    $.post("/food-log", my_data, null, "json");
    alert("Sent Data to History");
});

$('#b_search').click(function() {
    alert("Searching");
});


