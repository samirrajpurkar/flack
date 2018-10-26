import os
import requests

from flask import Flask, render_template, request, jsonify, redirect
from flask_socketio import SocketIO, emit


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


messages = {"name": 'Default Name', "post": 'Default post'}

def get_messages():
  return messages

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/name', methods=['POST'])
def handle_name():
  # save form data to the database
  name = request.form.get("name")
  name = str(name)
  messages["name"] = name
  return render_template("post.html")

@app.route('/post', methods=["POST"])
def handle_post():
  # save form data to the database
  post = request.form.get("post")
  post = str(post)
  messages["post"] = post
  #emit('newpost event', messages, broadcast=True)
  return render_template("success.html")


# @socketio.on('post event')
# def handle_post_event(message):
#   print('-----handle_post_event--')
#   print(message)
#   emit('newpost event', message, broadcast=True)


# @app.route("/submit_name", methods=["POST"])
# def handle_submit_name():
#   display_name = str(request.form.get("display_name")).replace(" ", "")
  
#   messages["display_name"] = display_name
#   print('-----------submit_name----------')
#   print(messages)
#   return render_template("posts.html", messages=messages)

# @app.route("/post_message", methods=["POST"])
# def handle_post_message():
#   display_name = str(request.form.get("display_name")).replace(" ", "")
#   post = request.form.get("post_message")
#   messages["display_name"] = display_name
#   messages["post"] = post
#   print('----post_message--------')
#   print(messages)
#   return render_template("posts.html", messages = messages)
  
@socketio.on("submit message")
def handle_message():
  emit("new message",messages, broadcast=True)

