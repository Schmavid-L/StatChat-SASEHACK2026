# StatChat

**A web-controlled office-status display built for SASEhack 2026**

StatChat helps students know whether an instructor, tutor, advisor, or campus support professional is available before they wait outside an office or make an unnecessary trip across campus. A staff member selects a status from a web dashboard, and the message is sent through a Flask backend to an Arduino UNO Q, where it appears on a physical 16×2 LCD.

The project combines a familiar door sign with remote, real-time updates. It is designed as a low-cost communication tool for colleges, tutoring centers, advising offices, libraries, and other shared educational spaces.

## Why We Built It

Office hour schedules do not always reflect real-time availability. An instructor may be helping another student, teaching a class, at lunch, or temporarily unavailable. Students- especially commuters, first-generation students, and students balancing work or family responsibilities- may have limited time to wait or return later.

StatChat provides a physical status display for students on site and a web interface that staff can update remotely. This makes availability clearer without requiring an expensive digital-signage system or dedicated mobile application.

## Features

- Web dashboard for selecting an office status
- Five predefined status options
- Two-line, 16-character LCD output
- Flask API for reading and updating the current status
- Arduino Router Bridge communication between Python and the microcontroller
- Green and red status LEDs
- Adjustable LCD contrast and backlight
- Custom-message interface included in the frontend prototype

### Predefined statuses

| Status | LCD row 1 | LCD row 2 |
|---|---|---|
| Available | `AVAILABLE` | `COME IN` |
| Busy | `BUSY` | `PLEASE WAIT` |
| Lunch | `OUT TO LUNCH` | `BACK SOON` |
| Do Not Disturb | `DO NOT DISTURB` | Blank |
| Please Knock | `PLEASE KNOCK` | Blank |

## How It Works

1. The user selects a status from the browser dashboard.
2. JavaScript sends the selection to the Flask `/status` endpoint.
3. Flask validates the message and calls an Arduino function through `arduino.app_utils.Bridge`.
4. The Arduino sketch receives the bridge call and updates the LCD.
5. The LEDs provide an additional visual indication of availability.

```text
Web dashboard → Flask API → Arduino Router Bridge → UNO Q → LCD and LEDs
```

## Technology Stack

**Hardware:** Arduino UNO Q, LCD1602A display, 10 kΩ potentiometer, green and red LEDs, resistors, breadboard, and jumper wires.

**Software:** Arduino C++, Python, Flask, HTML, CSS, JavaScript, Arduino App Lab, and Arduino Router Bridge.

## Repository Structure

```text
StatChat-SASEHACK2026/
├── firmware/lcd_display/     # LCD firmware and wiring guide
├── frontend/static/          # Browser-side JavaScript
├── frontend/templates/       # Dashboard HTML and CSS
├── gateway/                  # Flask API and Python dependencies
├── hardware/                 # Hardware helpers and alternate sketch
└── README.md
```

## LCD Wiring

The LCD operates in 4-bit mode using:

```cpp
LiquidCrystal lcd(12, 11, 10, 5, 4, 3, 2);
//                RS  RW   E  D4 D5 D6 D7
```

| LCD pin | Signal | Arduino connection |
|---:|---|---|
| 1 | VSS | GND |
| 2 | VDD | 5 V |
| 3 | V0 | Potentiometer center pin |
| 4 | RS | D12 |
| 5 | RW | D11 |
| 6 | Enable | D10 |
| 7–10 | D0–D3 | Not connected |
| 11 | D4 | D5 |
| 12 | D5 | D4 |
| 13 | D6 | D3 |
| 14 | D7 | D2 |
| 15 | LED+ | 5 V |
| 16 | LED− | GND |

The green LED uses D8, and the red LED uses D7. All components must share a common ground. LCD pin 3 (`V0`) controls contrast; pins 15 and 16 power the backlight.

## Impact and Scalability

StatChat uses inexpensive, widely available hardware and a lightweight web interface. A future deployment could support multiple offices, each with its own display and dashboard, without requiring students to install an application. The same design could serve tutoring centers, advising offices, laboratories, libraries, accessibility services, and community learning spaces.
