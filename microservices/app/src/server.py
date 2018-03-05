from src import app
# from flask import jsonify
from flask import render_template, url_for
import requests,json

@app.route("/")
def first():
    return "Hasura team 46"
	
@app.route("/home")
def home():
    print("hi")
    return render_template("index.html")


	


# Uncomment to add a new URL at /new

# @app.route("/json")
# def json_message():
#     return jsonify(message="Hello World")
