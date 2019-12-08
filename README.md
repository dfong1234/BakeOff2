# BakeOff2 - NutriPlan

## Description
NutriPlan is a nutrition/diet web application. It allows users to set up a dietary plan and search for food items using the Nutritionix database. The AI will give food recommendations based on features extracted from the foods, user input, and dietary needs. It can also nicely display prospective nutritional data based off these food suggestions. Recommended calorie requirements are determined using the most recent Estimated Energy Requirement (EER) equation. 


## Installation Guide
1. Install python 3.
2. Install flask using `pip install flask`
3. Run the server using `python flask_server.py`

## Usage

### Adding a Food
This page allows users to add foods to their food log. Through the Nutritionix NLP API, the query can consist of multiple food items. For example: 
![Search 1](/pictures/index_search.PNG)

This will then add the food items to the results datatable:
![Search 2](/pictures/index_search2.PNG)

Finally, clicking the double arrow icon will propogate the nutrition facts to the nutrition label, and the user can select the time and date to add the food to the food log.
![Search 3](/pictures/index_search3.PNG)

When searching for foods, it will also add the food to our local database. A feature extraction algorithm is run to label the foods as High/Low in its macronutrient contents. This will later be used in our food suggestions.

### Food History Log
This page shows the user food history for the selected day. After loading the data, the user can also delete items from their history by pressing the delete icon. Feedback is incorporated by adding the labels in the history tab. When clicking on the labels, the decision tree algorithm is displayed to show the user how it came upon this label to incorporate explainable AI. For the demo's sake, the rules are also presented and made editable by the user.

### Tracking Nutrition
This page shows the macronutrient breakdown for the selected day. It also will load suggestions of foods to eat based off the previously mentioned tagging system.

### User Preferences
This page allows the user to develop their own user preferences/diet plan. Recommended values are given, and the user can adjust macronutrient needs as necessary using the sliders.
