const result = document.getElementById("result");
const presetButtons = document.querySelectorAll(".programButton");
const customStatusForm = document.getElementById("customStatusForm");

// Send each preset status when its button is clicked
presetButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const line1 = button.dataset.msg1;
    const line2 = button.dataset.msg2;

    sendStatus(line1, line2);
  });
});

// Send the custom status when the form is submitted
customStatusForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const line1 = document.getElementById("customLine1").value;
  const line2 = document.getElementById("customLine2").value;

  sendStatus(line1, line2);
});

// Send the status to Flask
function sendStatus(line1, line2) {
  result.textContent = "Sending status...";

  fetch("/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      line1: line1,
      line2: line2
    })
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.success) {
        result.textContent =
          "LCD updated: " + data.line1 + " | " + data.line2;
      } else {
        result.textContent = data.message;
      }
    })
    .catch(function (error) {
      result.textContent = "Could not connect to the LCD.";
      console.error(error);
    });
}
