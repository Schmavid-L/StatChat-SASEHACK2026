#include <LiquidCrystal.h>
#include "Arduino_RouterBridge.h"

// rs, rw, enable, D4, D5, D6, D7
LiquidCrystal lcd(12, 11, 10, 5, 4, 3, 2);

void print_msg(String msg1, String msg2) {
  lcd.setCursor(0, 0);
  lcd.print("                ");
  lcd.setCursor(0, 0);
  lcd.print(msg1.substring(0, 16));

  lcd.setCursor(0, 1);
  lcd.print("                ");
  lcd.setCursor(0, 1);
  lcd.print(msg2.substring(0, 16));
}

void clear_msg() {
  lcd.clear();
}

void set_led(bool green_on) {
  if (green_on) {
    digitalWrite(8, HIGH);
    digitalWrite(7, LOW);
  } else {
    digitalWrite(8, LOW);
    digitalWrite(7, HIGH);
  }
}

void setup() {
  pinMode(8, OUTPUT);
  pinMode(7, OUTPUT);

  // Default = red
  digitalWrite(8, LOW);
  digitalWrite(7, HIGH);

  lcd.begin(16, 2);

  Bridge.begin();

  Bridge.provide_safe("print_msg", print_msg);
  Bridge.provide_safe("clear_msg", clear_msg);
  Bridge.provide_safe("set_led", set_led);
}

void loop() {
}
