/*
{
   "firstName" : "foo",
   "lastName" : "bar",
   "day_calories" : 2000,  // in kcal
   "day_carbohydrate" : 130,  // in g
   "day_protein" : 56,  // in g
   "day_fat" : 27,  // in g
   ...
};

{
    "name" : "apple",
    "group" : "fruit"
    "intake_calories" :  27,  // in kcal
    "intake_carbohydrate" : 10.50,  // in g
    "intake_protein" :  0.00,  // in g
    "intake_fat" :  0.00,  // in g
    "intake_vitamin_C" :  29.25,  // in mg
    ...
 };
*/



var daily_calories_goal = 2000;




var food_name = 'hamburger';
var food_calories = 500;

var user_calories_threshold = 300;



var calories_reason = [];
var calories_reason_count = 0;
var calories_explain = "";
var calories_suggest = "";

if (food_calories > user_calories_threshold) {
    calories_reason[calories_reason_count] =  "has calories > that of "
    calories_reason_count++;
       
} else {
    calories_reason[calories_reason_count] =  "has calories \u2264 that of "
    calories_reason_count++;
}



calories_suggest = food_name;

for(var i = 0; i < calories_reason_count; i++) {
    if (typeof reason === 'string' || reason instanceof String)
        calories_suggest = claories_suggest + reason;
        calories_reason.splice()

}    
