from flask import Flask, jsonify, request
from hardware.lcd import set_display

# Create the Flask application
app = Flask(__name__)

# Stores the most recent status received by the gateway
current_status = "AVAILABLE"


# Basic route used to confirm the gateway is running
@app.route("/")
def home():
    return "StatChat gateway is running"


# Returns the current status to the frontend
@app.route("/status", methods=["GET"])
def get_status():
    return jsonify({
        "status": current_status
    })


# Receives a new status from the frontend
@app.route("/status", methods=["POST"])
def update_status():
    global current_status

    # Read incoming JSON data
    data = request.get_json()

    # Make sure the request contains a status value
    if not data or "status" not in data:
        return jsonify({
            "error": "Missing status"
        }), 400

    # Save the new status
    current_status = data["status"]

    # Send the status to the hardware display layer
    set_display(current_status)

    # Confirm the update was successful
    return jsonify({
        "success": True,
        "status": current_status
    })


# Start the Flask gateway
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )