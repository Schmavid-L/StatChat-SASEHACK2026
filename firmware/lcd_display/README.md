# StatChat LCD Display

The StatChat display uses an Arduino UNO Q and a 16×2 LCD to show status messages received from the Python application through Arduino Router Bridge.

## Hardware

* Arduino UNO Q
* LCD1602A display
* 10 kΩ potentiometer
* External LED
* 220–330 Ω resistor
* Breadboard and jumper wires

## Pin Connections

```cpp
// RS, RW, Enable, D4, D5, D6, D7
LiquidCrystal lcd(12, 11, 10, 5, 4, 3, 2);
```

| LCD pin | Signal | Connection               |
| ------: | ------ | ------------------------ |
|       1 | VSS    | GND                      |
|       2 | VDD    | 5 V                      |
|       3 | V0     | Potentiometer center pin |
|       4 | RS     | D12                      |
|       5 | RW     | D11                      |
|       6 | Enable | D10                      |
|    7–10 | D0–D3  | Not connected            |
|      11 | D4     | D5                       |
|      12 | D5     | D4                       |
|      13 | D6     | D3                       |
|      14 | D7     | D2                       |
|      15 | LED+   | 5 V                      |
|      16 | LED−   | GND                      |

The external LED connects to D8 through a current-limiting resistor.

For contrast adjustment, connect the potentiometer’s outside pins to 5 V and GND and its center pin to LCD pin 3 (`V0`).

## Bridge Commands

| Command      | Purpose                          |
| ------------ | -------------------------------- |
| `print_msg`  | Displays one message on each row |
| `clear_msg`  | Clears the LCD                   |
| `led_toggle` | Toggles the external LED         |

Example:

```python
from arduino.app_utils import Bridge

Bridge.call("print_msg", "AVAILABLE", "COME IN")
Bridge.call("led_toggle")
```

Each LCD row can display up to 16 characters.

## Status Messages

| Status         | Row 1            | Row 2         |
| -------------- | ---------------- | ------------- |
| Available      | `AVAILABLE`      | `COME IN`     |
| Busy           | `BUSY`           | `PLEASE WAIT` |
| Lunch          | `OUT TO LUNCH`   | `BACK SOON`   |
| Do Not Disturb | `DO NOT DISTURB` | Blank         |
| Please Knock   | `PLEASE KNOCK`   | Blank         |
