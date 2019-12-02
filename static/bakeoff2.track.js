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



/*  --- Nutrition Report Chart ---  */
// --- Initialization ---
var chart_box = document.getElementById('chart-type');
// Creating a Chart
// https://www.chartjs.org/docs/latest/getting-started/usage.html
var ctx = document.getElementById('nutrition-chart').getContext('2d');
var nutritionChart = makeNutritionChart("Line Plot");


// --- Variables ---
var foods_localData = [];

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
    labels: ["Breakfast", "Lunch", "Dinner"],
    datasets: [{
        label: 'Carbohydrate [g]',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false
      }, {
        label: 'Protein [g]',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: false
      }, {
        label: 'Fat [g]',
        data: [],
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
                      max: 250,
                      min: 0,
                      stepSize: 50
                  },
                  scaleLabel: {
                       display: true,
                  }
              }]            
          }  
  };


var bar_data = {
    labels: ["Carbohydrate [g]", "Protein [g]", "Fat [g]"],
    datasets: [{
        data: [],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
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
                      max: 1000,
                      min: 0,
                      stepSize: 50
                  },
                  scaleLabel: {
                       display: true,
                  }
              }]            
          }  
  };

  var pie_data = {
    labels: ["Carbohydrate [g]", "Protein [g]", "Fat [g]"],
    datasets: [{
        data: [],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
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

// --- In-Use ---
$("#track-search-icon").click(function(){
    
    $.get("/food-database", function(data){
        foods_localData = data;
    });

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
            var food_name = food_nutrition["name"];

            breakfast_calories += food_nutrition["calories"];
            breakfast_carbohydrates += food_nutrition["carbohydrates"];
            breakfast_proteins += food_nutrition["proteins"];
            breakfast_fats += food_nutrition["fats"];
        };


        //load lunch report
        lunch_calories = 0;
        lunch_carbohydrates = 0;
        lunch_proteins = 0;
        lunch_fats = 0;
        meal_items = data[sel_date]["Lunch"];
        
        for(i = 0; i < meal_items.length; i++){
            var food_nutrition = findFoodFacts(meal_items[i]);
            var food_name = food_nutrition["name"];
        
            lunch_calories += food_nutrition["calories"];
            lunch_carbohydrates += food_nutrition["carbohydrates"];
            lunch_proteins += food_nutrition["proteins"];
            lunch_fats += food_nutrition["fats"];
        };

        //load dinner report
        dinner_calories = 0;
        dinner_carbohydrates = 0;
        dinner_proteins = 0;
        dinner_fats = 0;
        meal_items = data[sel_date]["Dinner"];
        
        for(i = 0; i < meal_items.length; i++){
            var food_nutrition = findFoodFacts(meal_items[i]);
            var food_name = food_nutrition["name"];

            dinner_calories += food_nutrition["calories"];
            dinner_carbohydrates += food_nutrition["carbohydrates"];
            dinner_proteins += food_nutrition["proteins"];
            dinner_fats += food_nutrition["fats"];
        };


        // Updating Charts
        // https://www.chartjs.org/docs/latest/developers/updates.html
        var newData = [];

        nutritionChart.data.datasets.forEach((dataset) => {
            dataset.data.pop();
        });

        if (chart_box.value == 'Line Plot') {
            newData[0] = [breakfast_calories, lunch_calories, dinner_calories]
            newData[1] = [breakfast_carbohydrates, lunch_carbohydrates, dinner_carbohydrates]
            newData[2] = [breakfast_proteins, lunch_proteins, dinner_proteins]
            newData[3] = [breakfast_fats, lunch_fats, dinner_fats]

            for (i = 0; i < nutritionChart.data.datasets.length; i++) {
                nutritionChart.data.datasets[i].push(newData[i]);
            }
        }       


        if (chart_box.value == 'Bar Graph') {
            newData[0] = [breakfast_calories + lunch_calories + dinner_calories]
            newData[1] = [breakfast_carbohydrates + lunch_carbohydrates + dinner_carbohydrates]
            newData[2] = [breakfast_proteins + lunch_proteins + dinner_proteins]
            newData[3] = [breakfast_fats + lunch_fats + dinner_fats]

            for (i = 0; i < nutritionChart.data.datasets.length; i++) {
                nutritionChart.data.datasets[i].push(newData[i]);
            }
        }   

        if (chart_box.value == 'Pie Chart') {
            newData[0] = [breakfast_calories + lunch_calories + dinner_calories]
            newData[1] = [breakfast_carbohydrates + lunch_carbohydrates + dinner_carbohydrates]
            newData[2] = [breakfast_proteins + lunch_proteins + dinner_proteins]
            newData[3] = [breakfast_fats + lunch_fats + dinner_fats]

            for (i = 0; i < nutritionChart.data.datasets.length; i++) {
                nutritionChart.data.datasets[i].push(newData[i]);
            }
        }   

        nutritionChart.update();


        alert("Data was retrieved for user: " + user);
    });
});

// makeNutritionChart("Line Plot")

/*
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Calories', 'Carbohydrate', 'Protein', 'Fat', 'Sodium', 'Calcium'],
        datasets: [{
            label: 'nutrient',
            data: [540, 35, 17, 9, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    max: 1000,
                    min: 0,
                    stepSize: 100,
                    beginAtZero: true
                }
            }]
        }
    }
});
*/