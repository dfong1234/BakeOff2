#   ................................................................................
#   flask_server.py
#   Python code of a flask sever for local Web development 
#   Written by: Daniel Fong, Mark Chen, Riyya Hari Iyer
#   Date Created: 10/15/2019
#   Last Modified: 11/26/2019
#   ................................................................................

import os
import json
from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify

# --- Define a local Web server --- #
app = Flask(__name__)

@app.route("/")
def hello():
    message = "Hello World!"
    return render_template('index.html', message=message)

@app.route("/index.html")
def index():
    message = "Welcome to index.html!"  
    return render_template('index.html', message=message)

@app.route("/history.html")
def history():
    message = "Welcome to history.html!"  
    return render_template('history.html', message=message)

@app.route("/track.html")
def track():
    message = "Welcome to track.html!"  
    return render_template('track.html', message=message)

@app.route("/preference.html")
def preference():
    message = "Welcome to preference.html!"   
    return render_template('preference.html', message=message)



@app.route("/food-database", methods = ['GET', 'POST', 'DELETE'])
def foodDatabase():
    if request.method == 'GET':
        json_file = os.path.join(app.root_path, 'food_data', 'localFoods.json')
        if not os.path.isfile(json_file):
            with open(json_file, 'w') as file:
                json.dump([{"name": "placeholder"}], file)

        # TODO: need to work on this for AI decision
        with open(json_file) as file:
            data = json.load(file)
            return jsonify(data)

    elif request.method == 'POST' or request.method == 'DELETE':
        json_file = os.path.join(app.root_path, 'food_data', 'localFoods.json')
        if not os.path.isfile(json_file):
            with open(json_file, 'w') as file:
                json.dump([], file)

        stored_data = None
        received_data = None

        with open(json_file, 'r') as file:
            stored_data = json.load(file)  # in python list

        print(type(stored_data))
        print(stored_data)

        received_data = request.form.to_dict()  # in python dict
        print(type(received_data))
        print(received_data)

        stored_data.append(received_data.copy())
        print(type(stored_data))
        print(stored_data)

        # Remove duplicate dicts
        # https://stackoverflow.com/questions/9427163/remove-duplicate-dict-in-list-in-python
        seen = set()
        combined_data = []
        for dictionary in stored_data:
            dictionary_tuple = tuple(dictionary.items())
            if dictionary_tuple not in seen:
                seen.add(dictionary_tuple)
                combined_data.append(dictionary)

        print(type(combined_data))
        print(combined_data)

        # dictonary to string
        json_combined_data = json.dumps(combined_data)
        print(type(json_combined_data))
        print(json_combined_data)

        with open(json_file, 'w') as file:
            file.seek(0)
            file.write(json_combined_data) 
            file.truncate()
        
        return json_combined_data


@app.route("/food-log", methods = ['GET', 'POST', 'DELETE'])
def foodLog():
    user = request.args.get('user', default = 'tester', type = str)
    if request.method == 'GET':
        with open('user_data/{}_log.txt'.format(user)) as file:
            data = json.load(file)
            return jsonify(data)

    elif request.method == 'POST' or request.method == 'DELETE':
        with open('user_data/{}_log.txt'.format(user), 'r+') as file:
            stored_data = json.load(file)
            received_data = request.form.to_dict()
            processFoodData(received_data, stored_data, request.method)
            json_data = json.dumps(stored_data)
            file.seek(0)
            file.write(json_data)
            file.truncate()
            return json_data

@app.route("/food-pref", methods = ['GET', 'POST', 'DELETE'])
def foodPref():
    user = request.args.get('user', default = 'tester', type = str)
    if request.method == 'GET':
        with open('user_data/{}_pref.txt'.format(user)) as file:
            data = json.load(file)
            return jsonify(data)

    elif request.method == 'POST' or request.method == 'DELETE':
        with open('user_data/{}_pref.txt'.format(user), 'r+') as file:
            stored_data = json.load(file)
            received_data = request.form.to_dict()
            processPrefData(received_data, stored_data, request.method)
            json_data = json.dumps(stored_data)
            file.seek(0)
            file.write(json_data)
            file.truncate()
            return json_data


def processFoodData(received_data, stored_data, method):
    if received_data["food"] != "":
        if received_data["date"] in stored_data:
            if received_data["meal"] in stored_data[received_data["date"]]:
                if method == 'POST':
                    stored_data[received_data["date"]][received_data["meal"]].append(received_data["food"])
                elif method == 'DELETE':
                    stored_data[received_data["date"]][received_data["meal"]].remove(received_data["food"])
            else:
                stored_data[received_data["date"]] = {"Breakfast": [], "Lunch": [], "Dinner": []}
                stored_data[received_data["date"]][received_data["meal"]].append(received_data["food"])
        else:
            stored_data[received_data["date"]] = {"Breakfast": [], "Lunch": [], "Dinner": []}
            stored_data[received_data["date"]][received_data["meal"]].append(received_data["food"])
    #stored_data.update(request.form.to_dict())

def processPrefData(received_data, stored_data, method):
    print("Fill this in")

# --- Initialize a local Web server --- #
if __name__ == "__main__":
    app.debug = True
    # access the website through http://localhost:8080/
    app.run(host='0.0.0.0', port=8080)