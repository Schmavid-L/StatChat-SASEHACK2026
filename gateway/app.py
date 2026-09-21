from flask import Flask,jsonify,request
from flask_cors import CORS
from arduino.app_utils import Bridge

app=Flask(__name__)
CORS(app)

current_line1="AVAILABLE"
current_line2=""
current_led_state=False

def set_display(line1,line2):
    line1=str(line1)[:16]
    line2=str(line2)[:16]
    Bridge.call("print_msg",line1,line2)

def set_led(state):
    Bridge.call("set_led",state)

def clear_display():
    Bridge.call("clear_msg")

@app.route("/")
def home():
    return "StatChat gateway is running"

@app.route("/status",methods=["GET"])
def get_status():
    return jsonify({
        "line1":current_line1,
        "line2":current_line2,
        "led":current_led_state
    })

@app.route("/status",methods=["POST"])
def update_status():
    global current_line1,current_line2

    data=request.get_json()

    if not data or "line1" not in data or "line2" not in data:
        return jsonify({
            "success":False,
            "message":"Missing line1 or line2"
        }),400

    current_line1=str(data["line1"])[:16]
    current_line2=str(data["line2"])[:16]

    set_display(current_line1,current_line2)

    return jsonify({
        "success":True,
        "line1":current_line1,
        "line2":current_line2
    })

@app.route("/led",methods=["POST"])
def led():
    global current_led_state

    data=request.get_json()

    if not data or "state" not in data:
        return jsonify({
            "success":False,
            "message":"Missing state"
        }),400

    state=data["state"]

    if not isinstance(state,bool):
        return jsonify({
            "success":False,
            "message":"state must be true or false"
        }),400

    current_led_state=state
    set_led(current_led_state)

    return jsonify({
        "success":True,
        "state":current_led_state
    })

@app.route("/clear",methods=["POST"])
def clear():
    global current_line1,current_line2

    clear_display()

    current_line1=""
    current_line2=""

    return jsonify({
        "success":True
    })
