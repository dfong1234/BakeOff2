//	................................................................................
//  bakeoff2.index.js
//	javascript for index page of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 10/23/2019
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
                "targets": -1,
                "data": null,
                "defaultContent": "<input type=\"checkbox\" id=\"b_check_item\"></input>",
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



/*  --- Load Diet Profile ---  */
// --- Variables ---
var userDietProfile = {};
var userPref_plan_calories = 0; 
var userPref_plan_carbohydrates = 0; 
var userPref_plan_proteins = 0;  
var userPref_plan_fats = 0;  

// --- Functions ---
function loadDietProfile() {
    $.get("/food-pref", function(data){
        userDietProfile = data["plan"];
        if (data["plan"]["plan_calories"] != null) 
            userPref_plan_calories = parseFloat(data["plan"]["plan_calories"]);
        
        if (data["plan"]["plan_carbohydrates"] != null) 
            userPref_plan_carbohydrates = parseFloat(data["plan"]["plan_carbohydrates"]);
        
        if (data["plan"]["plan_proteins"] != null) 
            userPref_plan_proteins  = parseFloat(data["plan"]["plan_proteins"]); 
        
        if (data["plan"]["plan_fats"] != null) 
            userPref_plan_fats = parseFloat(data["plan"]["plan_fats"]);
    });

}

// --- In-Use ---
loadDietProfile();




/*  --- Nutrition Chart Report ---  */
// 10 Chart.js example charts to get you started
// https://tobiasahlin.com/blog/chartjs-charts-to-get-you-started/
// --- Variables ---
var chart_box = document.getElementById('chart-type');
var ctx = document.getElementById('nutrition-chart').getContext('2d');
var nutritionChart;


var user;
var foods_breakfast = [];
var foods_lunch = [];
var foods_dinner = [];

var breakfast_calories;
var breakfast_carbohydrates;
var breakfast_proteins;
var breakfast_fats;

var lunch_calories;
var lunch_carbohydrates;
var lunch_proteins;
var lunch_fats;

var dinner_calories;
var dinner_carbohydrates;
var dinner_proteins;
var dinner_fats;



var line_data = {
    labels: ["After Breakfast", " After Lunch", "After Dinner"],
    datasets: [
        {
            label: 'Calories [kcal]',
            data: [0, 0, 0],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false
     }, {
            label: 'Carbohydrate [g]',
            data: [0, 0, 0],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false
     }, {
            label: 'Protein [g]',
            data: [0, 0, 0],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: false
     }, {
            label: 'Fat [g]',
            data: [0, 0, 0],
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            fill: false
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
    labels: ["Calories [kcal]", "Carbohydrate [kcal]", "Protein [kcal]", "Fat [kcal]"],
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
//helper function for find a food's nutrition facts from local database
function findFoodFacts(food){
    for(i = 0; i < foods_localData.length; i++) {
        if(foods_localData[i]["name"] == food){
            return foods_localData[i];
        }
    }
}

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
// Initialize a Chart
// https://www.chartjs.org/docs/latest/getting-started/usage.html
makeNutritionChart("Line Plot");

$("#track-search-icon").click(function(){

    $.get("/food-log" + window.location.search, function(data){
        var sel_date = $("#datepicker").val()
        var meal_items;

        user = data["user"];
        foods_breakfast = data[sel_date]["Breakfast"];
        foods_lunch = data[sel_date]["Lunch"];
        foods_dinner = data[sel_date]["Dinner"];


        //load breakfast report
        breakfast_calories = 0;
        breakfast_carbohydrates = 0;
        breakfast_proteins = 0;
        breakfast_fats = 0;
        meal_items = data[sel_date]["Breakfast"];
        
        for(i = 0; i < meal_items.length; i++){
            var food_nutrition = findFoodFacts(meal_items[i]);
            var food_name = toString(food_nutrition["name"]);

            breakfast_calories += parseFloat(food_nutrition["calories"]);
            breakfast_carbohydrates += parseFloat(food_nutrition["carbohydrates"]);
            breakfast_proteins += parseFloat(food_nutrition["proteins"]);
            breakfast_fats += parseFloat(food_nutrition["fats"]);
        };


        //load lunch report
        lunch_calories = 0;
        lunch_carbohydrates = 0;
        lunch_proteins = 0;
        lunch_fats = 0;
        meal_items = data[sel_date]["Lunch"];
        
        for(i = 0; i < meal_items.length; i++){
            var food_nutrition = findFoodFacts(meal_items[i]);
            var food_name = toString(food_nutrition["name"]);
        
            lunch_calories += parseFloat(food_nutrition["calories"]);
            lunch_carbohydrates += parseFloat(food_nutrition["carbohydrates"]);
            lunch_proteins += parseFloat(food_nutrition["proteins"]);
            lunch_fats += parseFloat(food_nutrition["fats"]);
        };

        //load dinner report
        dinner_calories = 0;
        dinner_carbohydrates = 0;
        dinner_proteins = 0;
        dinner_fats = 0;
        meal_items = data[sel_date]["Dinner"];
        
        for(i = 0; i < meal_items.length; i++){
            var food_nutrition = findFoodFacts(meal_items[i]);
            var food_name = toString(food_nutrition["name"]);

            dinner_calories += parseFloat(food_nutrition["calories"]);
            dinner_carbohydrates += parseFloat(food_nutrition["carbohydrates"]);
            dinner_proteins += parseFloat(food_nutrition["proteins"]);
            dinner_fats += parseFloat(food_nutrition["fats"]);
        };

        // Update nutritionChart datas
        line_data.datasets[0].data = getNewCalories("Line Plot");
        line_data.datasets[1].data = getNewCarbohydrates("Line Plot");
        line_data.datasets[2].data = getNewProteins("Line Plot");
        line_data.datasets[3].data = getNewFats("Line Plot");

        bar_data.datasets[0].data[0] = getNewCalories("Bar Graph");
        bar_data.datasets[0].data[1] = getNewCarbohydrates("Bar Graph");
        bar_data.datasets[0].data[2] = getNewProteins("Bar Graph");
        bar_data.datasets[0].data[3] = getNewFats("Bar Graph");

        bar_options.annotation.annotations[0] = bar_getNewTargetLine(userPref_plan_calories, "rgb(255, 99, 132)");
        bar_options.annotation.annotations[1] = bar_getNewTargetLine(userPref_plan_carbohydrates, "rgb(75, 192, 192)");
        bar_options.annotation.annotations[2] = bar_getNewTargetLine(userPref_plan_proteins, "rgb(54, 162, 235)");
        bar_options.annotation.annotations[3] = bar_getNewTargetLine(userPref_plan_fats, "rgb(255, 206, 86)");


        pie_data.datasets[0].data[0] = getNewCalories("Pie Chart");
        pie_data.datasets[0].data[1] = getNewCarbohydrates("Pie Chart");
        pie_data.datasets[0].data[2] = getNewProteins("Pie Chart");
        pie_data.datasets[0].data[3] = getNewFats("Pie Chart");


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

            nutritionChart.options.annotation.annotations[0] = bar_getNewTargetLine(userPref_plan_calories, "rgb(255, 99, 132)");
            nutritionChart.options.annotation.annotations[1] = bar_getNewTargetLine(userPref_plan_carbohydrates, "rgb(75, 192, 192)");
            nutritionChart.options.annotation.annotations[2] = bar_getNewTargetLine(userPref_plan_proteins, "rgb(54, 162, 235)");
            nutritionChart.options.annotation.annotations[3] = bar_getNewTargetLine(userPref_plan_fats, "rgb(255, 206, 86)");
        } 
        
        
        if (chart_box.value == 'Pie Chart') {
            nutritionChart.data.datasets[0].data[0] = getNewCalories(chart_box.value);
            nutritionChart.data.datasets[0].data[1] = getNewCarbohydrates(chart_box.value);
            nutritionChart.data.datasets[0].data[2] = getNewProteins(chart_box.value);
            nutritionChart.data.datasets[0].data[3] = getNewFats(chart_box.value);

        }   

        nutritionChart.update();


        alert("Data was retrieved for user: " + user);
    });
});


/*  --- Cutoff for suggestions ---  */