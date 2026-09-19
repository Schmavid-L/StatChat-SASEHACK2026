// Find the HTML elements that JavaScript needs
const result = document.getElementById("result");
const presetButtons = document.querySelectorAll(".programButton");
const customStatusForm = document.getElementById("customStatusForm");

// Add a click event to each preset status button
presetButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const msg1 = button.dataset.msg1;
    const msg2 = button.dataset.msg2;

    sendStatus(msg1, msg2);
  });
});

// Send the custom status when the form is submitted
customStatusForm.addEventListener("submit", function (event) {
  // Prevent the page from refreshing
  event.preventDefault();

  const msg1 = document.getElementById("customLine1").value.trim();
  const msg2 = document.getElementById("customLine2").value.trim();

  sendStatus(msg1, msg2);
});

// Send a status to the Flask /status route
function sendStatus(msg1, msg2) {
  result.textContent = "Sending status...";

  fetch("/status", {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      msg1: msg1,
      msg2: msg2
    })
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.success) {
        result.textContent =
          "LCD updated: " + data.msg1 + " | " + data.msg2;

        // Clear the custom text boxes
        customStatusForm.reset();
      } else {
        result.textContent =
          data.error || "The status could not be updated.";
      }
    })
    .catch(function (error) {
      result.textContent =
        "Could not connect to the Flask server.";

      console.error(error);
    });
}
