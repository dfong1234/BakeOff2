# flask_server.py

# Some simple code to serve some static files through a flask app
# JS files need to be in static folder, which flask automatically serves up
# html will be in template since we're using render_template()

from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
import json

app = Flask(__name__)

@app.route("/")
def home():
    message = "Test Home"        #Unused
    return render_template('index.html', message=message)

@app.route("/index.html")
def index():
    message = "Test Index"       #Unused
    return render_template('index.html', message=message)

@app.route("/history.html")
def history():
    message = "Test History"     #Unused
    return render_template('history.html', message=message)

@app.route("/track.html")
def track():
    message = "Test Track"       #Unused
    return render_template('track.html', message=message)

@app.route("/preference.html")
def preference():
    message = "Test Preferences" #Unused
    return render_template('preference.html', message=message)

@app.route("/food-log", methods = ['GET', 'POST', 'DELETE'])
def foodLog():
    if request.method == 'GET':
        with open('user_data/user_test.txt') as file:
            data = json.load(file)
            print(data)
            return jsonify(data)

    elif request.method == 'POST':
        with open('user_data/user_test.txt', 'r+') as file:
            stored_data = json.load(file)
            received_data = request.form.to_dict()
            process_data(received_data, stored_data)
            json_data = json.dumps(stored_data)
            file.seek(0)
            file.write(json_data)
            file.truncate()
            return json_data

def process_data(received_data, stored_data):
    if received_data["food"] != "":
        if received_data["date"] in stored_data:
            if received_data["meal"] in stored_data[received_data["date"]]:
                stored_data[received_data["date"]][received_data["meal"]].append(received_data["food"])
            else:
                stored_data[received_data["date"]] = {"Breakfast": [], "Lunch": [], "Dinner": []}
                stored_data[received_data["date"]][received_data["meal"]].append(received_data["food"])
        else:
            stored_data[received_data["date"]] = {"Breakfast": [], "Lunch": [], "Dinner": []}
            stored_data[received_data["date"]][received_data["meal"]].append(received_data["food"])
    #stored_data.update(request.form.to_dict())


if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0', port=8080)
