//	................................................................................
//  bakeoff2.index.js
//	javascript for index page of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 12/03/2019
//	................................................................................

/*  --- ---  */
// --- Initialization ---

// --- Variables ---

// --- Functions ---

// --- In-Use ---


/*  --- Website Header and Tabs ---  */
// --- Variables ---
var tabName = 'Track';
var color = 'lightseagreen';

// --- In-Use ---
openTab(tabName, color) 


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
            "columnDefs": [
                /*{
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
                },*/
                {
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<input type=\"checkbox\" class=\"b_check_item\" id=\"b_check_item\"></input><button class=\"b_remove_item\" id=\"b_remove_item\"><i class=\"fas fa-trash-alt\"></i></button>",
                }
            ],
            "searching": false,
            "paging": false,
            "info": false
    })  //Default clear the table until filled
    .clear().draw();
    $('table.display').DataTable().row.add([0, 0, 0]).draw(); 
    
    // Initialize a Chart
    // https://www.chartjs.org/docs/latest/getting-started/usage.html
    makeNutritionChart("Line Plot");
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





/*  --- Load Diet Profile ---  */
// --- Variables ---
var userDietProfile = {};

// --- Functions ---
function loadDietProfile() {
    $.get("/food-pref", function(data){
        userDietProfile = data["plan"];

        if (data["plan"] != null) {
            plan_calories = parseFloat(data["plan"]["plan_calories"]);
            plan_carbohydrates = parseFloat(data["plan"]["plan_carbohydrates"]);
            plan_proteins  = parseFloat(data["plan"]["plan_proteins"]); 
            plan_fats = parseFloat(data["plan"]["plan_fats"]);
            aiFood_required_condition = data["plan"]["required_condition"]; 
            aiFood_required_nutrient = data["plan"]["required_nutrient"];

            $("#suggest-cutoff-conditions").val(data["plan"]["required_condition"]);
            $("#suggest-cutoff-nutrients").val(data["plan"]["required_nutrient"]);
        }
        
    });

}

// --- In-Use ---
loadDietProfile();




/*  --- Nutrition Chart Report ---  */
// --- Variables ---
// From User Diet Profile:
var plan_calories = 0; 
var plan_carbohydrates = 0; 
var plan_proteins = 0;  
var plan_fats = 0;  

var aiFood_required_condition = "";
var aiFood_required_nutrient = "";
var aiFoods_result = [];

// From User Food Log:
var user = "";
var foods_breakfast = [];
var foods_lunch = [];
var foods_dinner = [];

var breakfast_calories = 0;
var breakfast_carbohydrates = 0;
var breakfast_proteins = 0;
var breakfast_fats = 0;

var lunch_calories = 0;
var lunch_carbohydrates = 0;
var lunch_proteins = 0;
var lunch_fats = 0;

var dinner_calories = 0;
var dinner_carbohydrates = 0;
var dinner_proteins = 0;
var dinner_fats = 0;

var total_intake_calories = 0;
var total_intake_carbohydrates = 0;
var total_intake_proteins = 0;
var total_intake_fats = 0;

// For Nutrition Chart:
// 10 Chart.js example charts to get you started:
// https://tobiasahlin.com/blog/chartjs-charts-to-get-you-started/
var chart_box = document.getElementById('chart-type');
var ctx = document.getElementById('nutrition-chart').getContext('2d');
var nutritionChart;

var line_data = {
    labels: ["After Breakfast", " After Lunch", "After Dinner"],
    datasets: [
        {
            label: 'Calories [kcal]',
            data: [0, 0, 0],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false,
            lineTension: 0
     }, {
            label: 'Carbohydrate [g]',
            data: [0, 0, 0],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
            lineTension: 0
     }, {
            label: 'Protein [g]',
            data: [0, 0, 0],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: false,
            lineTension: 0
     }, {
            label: 'Fat [g]',
            data: [0, 0, 0],
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            fill: false,
            lineTension: 0
    }]
};

var line_options = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
        display: true,
        text: 'Macronutrients Intake',
        fontSize: 16
    },
    scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true,
                      suggestedMin: 0,
                      suggestedMax: 1000
                  },
                  scaleLabel: {
                       display: true,
                  }
              }]            
          }  
  };


var bar_data = {
    labels: ["Calories [kcal]", "Carbohydrate [g]", "Protein [g]", "Fat [g]"],
    datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
        ]
      }]
  };

var bar_options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
        display: false
    },
    title: {
        display: true,
        text: 'Macronutrients Intake',
        fontSize: 16
    },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                suggestedMin: 0,
                suggestedMax: 3000
            },
            scaleLabel: {
                display: true,
            }
        }]            
    },
    // https://github.com/chartjs/chartjs-plugin-annotation
    // https://www.npmjs.com/package/chartjs-plugin-annotation
    annotation: {
        annotations: [],
        drawTime: "afterDraw" // (default)
    }
  };

  var pie_data = {
    labels: [/*"Calories [kcal]",*/ "Carbohydrate [kcal]", "Protein [kcal]", "Fat [kcal]"],
    datasets: [{
        data: [0, 0, 0],
        backgroundColor: [
            // 'rgba(255, 99, 132, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
        ],
        borderColor: [
            // 'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
        ]
      }]
  };

var pie_options = {
    responsive: true,
    maintainAspectRatio: false,
    title: {
        display: true,
        text: 'Macronutrients Intake',
        fontSize: 16
    }
};


// --- Functions ---
function makeNutritionChart(chart) {
    if (chart_box.value == 'Line Plot' || chart == 'Line Plot') {
        if (window.nutritionChart) window.nutritionChart.destroy();
        nutritionChart = new Chart(ctx, {
            type: 'line',
            data: line_data,
            options: line_options
        });
    }

    if (chart_box.value == 'Bar Graph' || chart == 'Bar Graph') {
        if (window.nutritionChart) window.nutritionChart.destroy();
        nutritionChart = new Chart(ctx, {
            type: 'bar',
            data: bar_data,
            options: bar_options
        });
    }

    if (chart_box.value == 'Pie Chart' || chart == 'Pie Chart') {
        if (window.nutritionChart) window.nutritionChart.destroy();
        nutritionChart = new Chart(ctx, {
            type: 'pie',
            data: pie_data,
            options: pie_options
        });
    }
}

function getNewCalories(chartType){
    if (chartType == "Line Plot") {
        return ([breakfast_calories, breakfast_calories + lunch_calories, 
            breakfast_calories + lunch_calories + dinner_calories]);
    }

    if (chartType == 'Bar Graph' || chartType == 'Pie Chart') {
        return (breakfast_calories + lunch_calories + dinner_calories);
    }
    return null;
}

function getNewCarbohydrates(chartType){
    if (chartType == "Line Plot") {
        return ([breakfast_carbohydrates, breakfast_carbohydrates + lunch_carbohydrates, 
            breakfast_carbohydrates + lunch_carbohydrates + dinner_carbohydrates]);
    }
    if (chartType == 'Bar Graph') {
        return (breakfast_carbohydrates + lunch_carbohydrates + dinner_carbohydrates);
    }
    if (chartType == 'Pie Chart') {
        return ((breakfast_carbohydrates + lunch_carbohydrates + dinner_carbohydrates) * 4);
    }
    return null;
}

function getNewProteins(chartType){
    if (chartType == "Line Plot") {
        return ([breakfast_proteins, breakfast_proteins + lunch_proteins, 
            breakfast_proteins + lunch_proteins + dinner_proteins]);
    }
    if (chartType == 'Bar Graph') {
        return (breakfast_proteins + lunch_proteins + dinner_proteins);
    }
    if (chartType == 'Pie Chart') {
        return ((breakfast_proteins + lunch_proteins + dinner_proteins) * 4);
    }
    return null;
}

function getNewFats(chartType){
    if (chartType == "Line Plot") {
        return ([breakfast_fats, breakfast_fats + lunch_fats, 
            breakfast_fats + lunch_fats + dinner_fats]);
    }
    if (chartType == 'Bar Graph') {
        return (breakfast_fats + lunch_fats + dinner_fats);
    }
    if (chartType == 'Pie Chart') {
        return ((breakfast_fats + lunch_fats + dinner_fats) * 9);
    }
    return null;
}

function bar_getNewTargetLine(targetValue, targetColor) {
    targetLine = {
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: targetValue,
        borderColor: targetColor,
        borderWidth: 1,
        borderDash: [2, 2],
        label: {
            enabled: true,
            position: "left",
            content: "Target: " + targetValue 
        }
    }
    return targetLine
}


// --- In-Use ---
$("#track-search-icon").click(function(){

    var aiFood_query = {
        "condition": aiFood_required_condition,
        "nutrient": aiFood_required_nutrient
    }


    $.post("/food-tag-query" + window.location.search, aiFood_query).done(function(data){
        aiFoods_result = data["selected_foods"];
    });



    $.get("/food-log" + window.location.search, function(data){
        var sel_date = $("#datepicker").val()

        user = data["user"];
        foods_breakfast = data[sel_date]["Breakfast"];
        foods_lunch = data[sel_date]["Lunch"];
        foods_dinner = data[sel_date]["Dinner"];
        
        total_intake_calories = 0;
        total_intake_carbohydrates = 0;
        total_intake_proteins = 0;
        total_intake_fats = 0;



        // compute breakfast data
        breakfast_calories = 0;
        breakfast_carbohydrates = 0;
        breakfast_proteins = 0;
        breakfast_fats = 0;
        
        for(i = 0; i < foods_breakfast.length; i++){
            var food_nutrition = foods_breakfast[i];
            var food_name = food_nutrition["name"];

            breakfast_calories += parseFloat(food_nutrition["calories"]);
            breakfast_carbohydrates += parseFloat(food_nutrition["carbohydrates"]);
            breakfast_proteins += parseFloat(food_nutrition["proteins"]);
            breakfast_fats += parseFloat(food_nutrition["fats"]);
        };

        total_intake_calories += breakfast_calories;
        total_intake_carbohydrates += breakfast_carbohydrates;
        total_intake_proteins += breakfast_proteins;
        total_intake_fats += breakfast_fats;



        // compute lunch data
        lunch_calories = 0;
        lunch_carbohydrates = 0;
        lunch_proteins = 0;
        lunch_fats = 0;
        
        for(i = 0; i < foods_lunch.length; i++){
            var food_nutrition = foods_lunch[i];
            var food_name = food_nutrition["name"];
        
            lunch_calories += parseFloat(food_nutrition["calories"]);
            lunch_carbohydrates += parseFloat(food_nutrition["carbohydrates"]);
            lunch_proteins += parseFloat(food_nutrition["proteins"]);
            lunch_fats += parseFloat(food_nutrition["fats"]);
        };

        total_intake_calories += lunch_calories;
        total_intake_carbohydrates += lunch_carbohydrates;
        total_intake_proteins += lunch_proteins;
        total_intake_fats += lunch_fats;



        // compute dinner data
        dinner_calories = 0;
        dinner_carbohydrates = 0;
        dinner_proteins = 0;
        dinner_fats = 0;
        
        for(i = 0; i < foods_dinner.length; i++){
            var food_nutrition = foods_dinner[i];
            var food_name = food_nutrition["name"];

            dinner_calories += parseFloat(food_nutrition["calories"]);
            dinner_carbohydrates += parseFloat(food_nutrition["carbohydrates"]);
            dinner_proteins += parseFloat(food_nutrition["proteins"]);
            dinner_fats += parseFloat(food_nutrition["fats"]);
        };

        total_intake_calories += dinner_calories;
        total_intake_carbohydrates += dinner_carbohydrates;
        total_intake_proteins += dinner_proteins;
        total_intake_fats += dinner_fats;


        // Update nutritionChart datas
        line_data.datasets[0].data = getNewCalories("Line Plot");
        line_data.datasets[1].data = getNewCarbohydrates("Line Plot");
        line_data.datasets[2].data = getNewProteins("Line Plot");
        line_data.datasets[3].data = getNewFats("Line Plot");

        bar_data.datasets[0].data[0] = getNewCalories("Bar Graph");
        bar_data.datasets[0].data[1] = getNewCarbohydrates("Bar Graph");
        bar_data.datasets[0].data[2] = getNewProteins("Bar Graph");
        bar_data.datasets[0].data[3] = getNewFats("Bar Graph");

        // bar_options.annotation.annotations[0] = bar_getNewTargetLine(plan_calories, "rgb(255, 99, 132)");
        // bar_options.annotation.annotations[1] = bar_getNewTargetLine(plan_carbohydrates, "rgb(75, 192, 192)");
        // bar_options.annotation.annotations[2] = bar_getNewTargetLine(plan_proteins, "rgb(54, 162, 235)");
        // bar_options.annotation.annotations[3] = bar_getNewTargetLine(plan_fats, "rgb(255, 206, 86)");

        pie_data.datasets[0].data[0] = getNewCarbohydrates("Pie Chart");
        pie_data.datasets[0].data[1] = getNewProteins("Pie Chart");
        pie_data.datasets[0].data[2] = getNewFats("Pie Chart");


        // Update nutritionChart
        if (chart_box.value == 'Line Plot') {
            nutritionChart.data.datasets[0].data = getNewCalories("Line Plot");          
            nutritionChart.data.datasets[1].data = getNewCarbohydrates("Line Plot");
            nutritionChart.data.datasets[2].data = getNewProteins("Line Plot");
            nutritionChart.data.datasets[3].data = getNewFats("Line Plot");
        }       
        
        if (chart_box.value == 'Bar Graph') {
            nutritionChart.data.datasets[0].data[0] = getNewCalories(chart_box.value);
            nutritionChart.data.datasets[0].data[1] = getNewCarbohydrates(chart_box.value);
            nutritionChart.data.datasets[0].data[2] = getNewProteins(chart_box.value);
            nutritionChart.data.datasets[0].data[3] = getNewFats(chart_box.value);

            // nutritionChart.options.annotation.annotations[0] = bar_getNewTargetLine(plan_calories, "rgb(255, 99, 132)");
            // nutritionChart.options.annotation.annotations[1] = bar_getNewTargetLine(plan_carbohydrates, "rgb(75, 192, 192)");
            // nutritionChart.options.annotation.annotations[2] = bar_getNewTargetLine(plan_proteins, "rgb(54, 162, 235)");
            // nutritionChart.options.annotation.annotations[3] = bar_getNewTargetLine(plan_fats, "rgb(255, 206, 86)");
        } 
        
        if (chart_box.value == 'Pie Chart') {
            nutritionChart.data.datasets[0].data[0] = getNewCarbohydrates(chart_box.value);
            nutritionChart.data.datasets[0].data[1] = getNewProteins(chart_box.value);
            nutritionChart.data.datasets[0].data[2] = getNewFats(chart_box.value);

        }   

        nutritionChart.update();

        alert("Data was retrieved for user: " + user);
    });
});



/*  --- Food Suggestion Criteria Planner ---  */
// --- In-Use ---
$("#food-suggest-cutoff-button").click(function() {
    //update user's diet profile object
    userDietProfile["required-nutrient"] = $("#suggest-cutoff-nutrients").val();
    userDietProfile["required-nutrient-value"] = $("#suggest-cutoff-value").val();

    $.post("/food-pref", userDietProfile, null, "json");

    alert("Suggestion Criteria Saved!");
});















/*  --- Dislike food for suggestions ---  */
$("#table-suggest tbody").on('click', 'button.b_remove_item', function(){
    var data = $("#table-suggest").DataTable().row($(this).parents('tr')).data();
    var my_data = {"user": "tester",
        "dislike": data[0]
    };
    $("#table-suggest").DataTable().row($(this).parents('tr')).remove().draw();
    $.post("/food-dislike" + window.location.search, my_data, null, "json");
});
