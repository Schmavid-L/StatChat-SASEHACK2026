#include <LiquidCrystal.h>
#include "Arduino_RouterBridge.h"

// rs, rw, enable, D4, D5, D6, D7
LiquidCrystal lcd(12, 11, 10, 5, 4, 3, 2);

bool green_state = false;
bool red_state = false;

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

void green_led(){
  // pin D8
  green_state = !green_state;
  digitalWrite(8, green_state ? HIGH : LOW);
}

void red_led(){
  // pin D7
  red_state = !red_state;
  digitalWrite(7, red_state ? HIGH : LOW);
}

void setup() {
  // initialize lcd (16 col, 2 rows)
  lcd.begin(16, 2);
  Bridge.begin();

  // give python side the c++ functions
  Bridge.provide("print_msg", print_msg);
  Bridge.provide("green_led", green_led);
  Bridge.provide("red_led", red_led);
}

void loop() {

}
