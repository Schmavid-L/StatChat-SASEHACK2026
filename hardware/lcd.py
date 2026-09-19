from arduino.app_utils import Bridge


def set_display(msg1, msg2):
    # Keep each LCD row within 16 characters
    msg1 = str(msg1)[:16]
    msg2 = str(msg2)[:16]

    # Call the C++ print_msg function on the microcontroller
    Bridge.call("print_msg", msg1, msg2)


def toggle_led():
    # Call the C++ led_toggle function on the microcontroller
    Bridge.call("led_toggle")
