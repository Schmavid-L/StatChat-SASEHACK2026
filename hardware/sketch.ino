#include <LiquidCrystal.h>
#include "Arduino_RouterBridge.h"

// rs, rw, enable, D4, D5, D6, D7
LiquidCrystal lcd(12, 11, 10, 5, 4, 3, 2);


// Print two lines to the LCD
void print_msg(String msg1, String msg2) {

  // Clear row 1
  lcd.setCursor(0, 0);
  lcd.print("                ");

  // Print row 1
  lcd.setCursor(0, 0);
  lcd.print(msg1.substring(0, 16));


  // Clear row 2
  lcd.setCursor(0, 1);
  lcd.print("                ");

  // Print row 2
  lcd.setCursor(0, 1);
  lcd.print(msg2.substring(0, 16));
}


// Clear LCD
void clear_msg() {
  lcd.clear();
}


// Set LED state directly
void set_led(bool green_on) {

  if (green_on) {
    // Green ON
    digitalWrite(8, HIGH);

    // Red OFF
    digitalWrite(7, LOW);
  }

  else {
    // Green OFF
    digitalWrite(8, LOW);

    // Red ON
    digitalWrite(7, HIGH);
  }
}


void setup() {

  // External LEDs
  pinMode(8, OUTPUT); // Green
  pinMode(7, OUTPUT); // Red

  // Default state
  digitalWrite(8, LOW);
  digitalWrite(7, HIGH);


  // Initialize LCD
  lcd.begin(16, 2);


  // Start Router Bridge
  Bridge.begin();


  // Functions Python can call
  Bridge.provide_safe("print_msg", print_msg);
  Bridge.provide_safe("clear_msg", clear_msg);
  Bridge.provide_safe("set_led", set_led);
}


void loop() {

}
