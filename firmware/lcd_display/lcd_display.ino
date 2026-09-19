#include <LiquidCrystal.h>
#include "Arduino_RouterBridge.h"

// rs, rw, enable, D4, D5, D6, D7
LiquidCrystal lcd(12, 11, 10, 5, 4, 3, 2);

bool led_state = false;

void print_msg(String msg1, String msg2) {
  // first row
  lcd.setCursor(0, 0);
  lcd.print("                ");
  lcd.setCursor(0, 0);
  lcd.print(msg1.substring(0, 16));

  // second row
  lcd.setCursor(0, 1);
  lcd.print("                ");
  lcd.setCursor(0, 1);
  lcd.print(msg2.substring(0, 16));
}

void led_toggle(){
  led_state = !led_state;

  // green led on first toggle call
  digitalWrite(8, led_state ? HIGH : LOW);
  // red led
  digitalWrite(7, led_state ? LOW : HIGH);
}

void setup() {
  // initialize lcd (16 col, 2 rows)
  lcd.begin(16, 2);

  // give python side the c++ functions
  Bridge.begin();
  Bridge.provide("print_msg", print_msg);
  Bridge.provide("led_toggle", led_toggle);
}

void loop() {

}
