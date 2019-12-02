function suggest(user_age, a[i], user_diet, user_activity, user_height, user_weight, user_problem)
{
	var BMI;
	BMI = user_weight/(user_height * user_height);
	if user_age < 3
	{
		console.log("Cerelac");
	}
	else
    {
    	for(i=0; i<l; i++)
    	{
         if a[i] == "Carbohydrates"
         {
         	console.log("Have bread, potatoes, beans etc.");
         	if(user_activity == "Active" || user_activity == "Very Active")
                {
                	console.log("Bananas and oats are highly recommended");
                }

         }
         else if a[i] == "Fats" || BMI < 18
         {
         	if user_diet == "Non-Vegetarian"
         	{
         		console.log("Have avocado, salmon etc.");
         	}
         	else
         	{
                console.log("Have avocado etc.")
         	}	
         }
          else if a[i] == "Proteins"
         {
         	if user_diet == "Vegan"
         	{
         		console.log("Have lentils, tofu and peanuts");
         		if(user_activity == "Active" || user_activity == "Very Active")
                {
                	console.log("Tofu and peanuts are highly recommended");
                }
         	}
         	else if user_diet == "Vegetarian"
         	{
                console.log("Have lentils, milk, eggs etc.");
                if(user_activity == "Active" || user_activity == "Very Active")
                {
                	console.log("Eggs, protein shakes and greek yoghurt are highly recommended");
                }
         	}
         	else
         	{
         		console.log("Have lentils, milk, eggs, meat etc.");
         		if(user_activity == "Active" || user_activity == "Very Active")
                {
                	console.log("Eggs, protein shakes and greek yoghurt are highly recommended");
                }
         	}	
         }
         
    	}
    	if b[i] == "Fats" || BMI > 25 || user_problem == "Gall baldder absent"
    	{
    		if user_diet == "Vegan"
    		{
    			console.log("Have green leafy vegetables and boiled potatoes and legumes");
    		}
    		if user_diet == "Vegetarian"
    		{
    			console.log("Have green leafy vegetables, boiled potatoes and legumes");
    		}
    		else
    		{
    			console.log("Have green leafy vegetables, boiled potatoes and legumes, tuna, avocados");
    		}
    	}
    	if user_problem == "Diabetes"
    	{
    		console.log("Have ")
    	}
    }
}