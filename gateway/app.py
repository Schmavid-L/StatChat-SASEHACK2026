from flask import Flask, jsonify, request, render_template
from arduino.app_utils import Bridge

app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static"
)

# Predefined statuses and their corresponding LCD messages
STATUS_MESSAGES = {
    "available": ("AVAILABLE", "COME IN"),
    "busy": ("BUSY", "PLEASE WAIT"),
    "lunch": ("OUT TO LUNCH", "BACK SOON"),
    "do not disturb": ("DO NOT DISTURB", ""),
    "please knock": ("PLEASE KNOCK", "")
}

current_status = "available"
current_msg1, current_msg2 = STATUS_MESSAGES[current_status]

def set_display(msg1, msg2):
    Bridge.call("clear_msg")
    
    msg1 = str(msg1)[:16]
    msg2 = str(msg2)[:16]

    Bridge.call("print_msg", msg1, msg2)


def toggle_led():
    Bridge.call("led_toggle")

def clear_msg():
    Bridge.call("clear_msg")

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/status", methods=["GET"])
def get_status():
    return jsonify({
        "status": current_status,
        "msg1": current_msg1,
        "msg2": current_msg2
    })

@app.route("/status", methods=["POST"])
def update_status():
    global current_status
    global current_msg1
    global current_msg2

    data = request.get_json()

    if not data or "status" not in data:
        return jsonify({
            "error": "Missing status"
        }), 400

    requested_status = str(data["status"]).strip().lower()

    if requested_status not in STATUS_MESSAGES:
        return jsonify({
            "error": "Invalid status",
            "valid_statuses": list(STATUS_MESSAGES.keys())
        }), 400

    current_status = requested_status
    current_msg1, current_msg2 = STATUS_MESSAGES[current_status]

    set_display(current_msg1, current_msg2)

    return jsonify({
        "success": True,
        "status": current_status,
        "msg1": current_msg1,
        "msg2": current_msg2
    })


@app.route("/led", methods=["POST"])
def led():
    toggle_led()

    return jsonify({
        "success": True
    })


