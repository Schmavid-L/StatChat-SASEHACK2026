from arduino.app_utils import App
from app import app
import threading

def run_flask():
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False,
        use_reloader=False
    )

threading.Thread(
    target=run_flask,
    daemon=True
).start()

App.run()
