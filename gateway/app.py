from flask import Flask, jsonify, request
from hardware.lcd import set_display

app = Flask(__name__)

# Stores the current LCD messages
current_msg1 = "AVAILABLE"
current_msg2 = ""


# Basic route used to confirm the gateway is running
@app.route("/")
def home():
    return "StatChat gateway is running"


# Returns the current LCD messages
@app.route("/status", methods=["GET"])
def get_status():
    return jsonify({
        "msg1": current_msg1,
        "msg2": current_msg2
    })


# Receives two LCD messages from the website
@app.route("/status", methods=["POST"])
def update_status():
    global current_msg1
    global current_msg2

    # Read JSON sent from the website
    data = request.get_json()

    # Make sure both messages are included
    if not data or "msg1" not in data or "msg2" not in data:
        return jsonify({
            "error": "Missing msg1 or msg2"
        }), 400

    # Convert messages to strings
    msg1 = str(data["msg1"])
    msg2 = str(data["msg2"])

    # Limit each LCD row to 16 characters
    msg1 = msg1[:16]
    msg2 = msg2[:16]

    # Save the current messages
    current_msg1 = msg1
    current_msg2 = msg2

    # Send both rows to the UNO Q microcontroller
    set_display(current_msg1, current_msg2)

    # Confirm the update
    return jsonify({
        "success": True,
        "msg1": current_msg1,
        "msg2": current_msg2
    })


# Start the Flask gateway
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )