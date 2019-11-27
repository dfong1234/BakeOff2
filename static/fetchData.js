//  ................................................................................
//  fetchData.js
//  javascript for accessing nutrition apis for BakeOff2:
//  Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
//  Date Created: 10/15/2019
//  Last Modified: 11/26/2019
//  ................................................................................

//Don't use this stuff, this database hurts...
/*var api_key = "xMEfr5SuW0FGSB10rgz70JnydjjLEQKFctkGevhv";
var fdc_url = `https://api.nal.usda.gov/fdc/v1/search?api_key=${api_key}`;
function searchItem(searchTerm) {
    var data_params = {
        "generalSearchInput" : searchTerm
    };
    var data_string = JSON.stringify(data_params);
    $.ajax({
        type: "POST",
        url: fdc_url,
        dataType: "json",
        contentType: "application/json",
        data: data_string,
        success: function(data){
            alert(JSON.stringify(data["foodSearchCriteria"]));
        },
        error: function(xhr, status, error){
            alert(xhr.responseText);
        }
    });
}*/

var api_key = "5015be239c92535807bae011a26fbcd2";
var app_id = "8ea44c06";
var url = "https://trackapi.nutritionix.com/v2/natural/nutrients";
function searchItem(searchTerm) {
    var data_params = {
        "query" : "apple"
    };
    var data_string = JSON.stringify(data_params);
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        contentType: "application/json",
        headers: {
            "x-app-id": app_id,
            "x-app-key": api_key,
            "x-remote-user-id": "0"
        },
        data: data_string,
        success: function(data){
            alert(JSON.stringify(data["foods"]));
        },
        error: function(xhr, status, error){
            alert("Failed to search database");
        }
    });
}

searchItem();