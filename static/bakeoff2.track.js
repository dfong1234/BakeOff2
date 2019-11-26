//	................................................................................
//  bakeoff2.index.js
//	javascript for index page of BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 10/23/2019
//	................................................................................

var tabName = 'Track';
var color = 'lightseagreen';
openTab(tabName, color) 


var chart_box = document.getElementById('chart-type');
var ctx = document.getElementById('nutrition-chart').getContext('2d');

var line_data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
        label: 'Carbohydrate [g]',
        data: [96,114,83,106,117,71,133],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false
      }, {
        label: 'Protein [g]',
        data: [43,64,51,57,38,61,31],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: false
      }, {
        label: 'Fat [g]',
        data: [33,21,27,16,35,24,29],
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
        data: [(96 + 114 + 83 + 106 + 117 + 71 + 133),
               (43 + 64 + 51 + 57 + 38 + 61 + 31),
               (33 + 21 + 27 + 16 + 35 + 24 + 29)
        ],
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
        data: [(96 + 114 + 83 + 106 + 117 + 71 + 133),
               (43 + 64 + 51 + 57 + 38 + 61 + 31),
               (33 + 21 + 27 + 16 + 35 + 24 + 29)
        ],
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
    },
    tooltips: {
        enabled: false
    },
    plugins: {
        datalabels: {
            formatter: (value, ctx) => {
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;
                dataArr.map(data => {
                    sum += data;
                });
                let percentage = (value*100 / sum).toFixed(2)+"%";
                return percentage;
            },
            color: '#fff',
        }
    }
};



function makeNutritionChart(chart) {
    if (chart_box.value == 'Line Plot' || chart == 'Line Plot') {
        if (window.myChart) window.myChart.destroy();
        new Chart(ctx, {
            type: 'line',
            data: line_data,
            options: line_options
        });
    }

    if (chart_box.value == 'Bar Graph' || chart == 'Bar Graph') {
        if (window.myChart) window.myChart.destroy();
        new Chart(ctx, {
            type: 'bar',
            data: bar_data,
            options: bar_options
        });
    }

    if (chart_box.value == 'Pie Chart' || chart == 'Pie Chart') {
        if (window.myChart) window.myChart.destroy();
        new Chart(ctx, {
            type: 'pie',
            data: pie_data,
            options: pie_options
        });
    }
}

makeNutritionChart("Line Plot")

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







/*  ---  ---  */

// --- Label Initialization ---


// --- Variables ---



// --- Subroutine Functions ---


// --- In-Use ---


/*  ---  ---  */


// --- Variables ---

// --- Subroutine Functions ---


// --- In-Use ---
