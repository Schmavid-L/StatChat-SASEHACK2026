#include <LiquidCrystal.h>
#include "Arduino_RouterBridge.h"

// rs, rw, enable, D4, D5, D6, D7
LiquidCrystal lcd(12, 11, 10, 5, 4, 3, 2);

bool led_state = false;


void print_msg(String msg1, String msg2) {
  // Row 1
  lcd.setCursor(0, 0);
  lcd.print(msg1);

  // Row 2
  lcd.setCursor(0, 1);
  lcd.print(msg2);
}

void clear_msg() {
  lcd.clear();
}


void led_toggle() {
  led_state = !led_state;

  // green led
  digitalWrite(8, led_state ? HIGH : LOW);
  // red led
  digitalWrite(7, led_state ? LOW : HIGH);
}

void setup() {
  // green led
  pinMode(8, OUTPUT);
  digitalWrite(8, LOW);
  // red led
  pinMode(7, OUTPUT);
  digitalWrite(7, LOW);

  // LCD
  lcd.begin(16, 2);

  // Router Bridge
  Bridge.begin();

  // Functions Python can call
  Bridge.provide_safe("print_msg", print_msg);
  Bridge.provide_safe("led_toggle", led_toggle);
  Bridge.provide_safe("clear_msg", clear_msg);
}

void loop() {
}
