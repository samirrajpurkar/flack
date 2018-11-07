import os
import requests

from flask import Flask, render_template, request, jsonify, redirect
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_socketio import SocketIO, emit, join_room, leave_room, send

app = Flask(__name__)

# Check for db and other environment variables
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")


# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))

# check socketio environment
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# inbuilt data structures

channel_views = [
  [
    "first message1",
    "first message2",
    "first message3"
  ],
  [
    "second message1",
    "second message2",
    "second message3"
  ],
  [
    "third message1",
    "third message2",
    "third message3"
  ],
];

names=[]



@app.route("/")
def index():
  return render_template("index.html")

@app.route("/channels")
def channels():
  return render_template("channels.html")
  
@app.route("/first")
def first():
    return jsonify(channel_views[0])

@app.route("/second")
def second():
    return jsonify(channel_views[1]) 

@app.route("/third")
def third():
    return jsonify(channel_views[2])

@app.route('/name', methods=['POST'])
def handle_name():
  # save form data to the database
  """Add name"""
  name = request.form.get("name")
  names.append(name)
  print('names : ', names)
  return render_template("message.html", name=name)

@app.route('/post', methods=["POST"])
def handle_post():
  # save form data to the database
  # Add Post

  name = request.form.get("name")
  post = request.form.get("post")

  try:
    db.execute("INSERT INTO MESSAGES (name, post) VALUES (:name, :post)", {
      "name": name,
      "post": post
      })
    db.commit()
  except ValueError:
    return render_template("error.html", message="Error in inserting name")

  try:
    messages = db.execute("SELECT * FROM MESSAGES").fetchall()
  except ValueError:
    return render_template("error.html", message="Error in inserting name")


  return render_template("post.html", name = name, messages = messages)

@socketio.on('first')
def on_join(data_json):
  print('received json: ' + str(data_json))
  username = data_json["username"]
  room = data_json["room"]
  post = data_json["post"]
  channel_views[0].append(post)
  print('channel_views[0] : ', channel_views[0])
  join_room(room)
  emit(room, data_json["post"], room = room)
  return 'first success'

@socketio.on('second')
def on_join(data_json):
  print('received json: ' + str(data_json))
  username = data_json["username"]
  room = data_json["room"]
  post = data_json["post"]
  channel_views[1].append(post)
  print('channel_views[1] : ', channel_views[1])
  join_room(room)
  emit(room, data_json["post"], room = room)
  return 'second success'

@socketio.on('third')
def on_join(data_json):
  print('received json: ' + str(data_json))
  username = data_json["username"]
  room = data_json["room"]
  post = data_json["post"]
  channel_views[2].append(post)
  print('channel_views[2] : ', channel_views[2])
  join_room(room)
  emit(room, data_json["post"], room = room)
  return 'third success'


@socketio.on('newpost')
def handle_new_post(message):
  print('-----message from newpost emit from client--')
  print(message)

  emit('broadcast_post',message, broadcast=True)  
  

  
