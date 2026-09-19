from flask import Flask, jsonify, request, render_template
from arduino.app_utils import Bridge

app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static"
)

current_msg1 = "AVAILABLE"
current_msg2 = ""


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
        "msg1": current_msg1,
        "msg2": current_msg2
    })


@app.route("/status", methods=["POST"])
def update_status():
    global current_msg1
    global current_msg2

    data = request.get_json()

    if not data or "msg1" not in data or "msg2" not in data:
        return jsonify({
            "error": "Missing msg1 or msg2"
        }), 400

    current_msg1 = str(data["msg1"])[:16]
    current_msg2 = str(data["msg2"])[:16]

    set_display(current_msg1, current_msg2)

    return jsonify({
        "success": True,
        "msg1": current_msg1,
        "msg2": current_msg2
    })


@app.route("/led", methods=["POST"])
def led():
    toggle_led()

    return jsonify({
        "success": True
    })


