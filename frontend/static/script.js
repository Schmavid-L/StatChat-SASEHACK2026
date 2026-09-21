// ==========================================
// STATChat settings
// ==========================================

const FLASK_STATUS_URL =
  "http://172.20.10.4:5000/status";

const FLASK_LED_URL =
  "http://172.20.10.4:5000/led";

const SCHEDULE_TIME_ZONE =
  "America/Los_Angeles";

const scheduleStartHour = 8;
const scheduleEndHour = 22;
const slotHeight = 54;

let scheduleEvents = loadScheduleEvents();
let lastActivatedEventKey = null;
let scheduleWasActive = false;


// ==========================================
// Find HTML elements
// ==========================================

const result =
  document.getElementById("result");

const presetButtons =
  document.querySelectorAll(".programButton");

const customStatusForm =
  document.getElementById("customStatusForm");

const customLine1 =
  document.getElementById("customLine1");

const customLine2 =
  document.getElementById("customLine2");

const scheduleTimeline =
  document.getElementById("scheduleTimeline");

const scheduleDate =
  document.getElementById("scheduleDate");

const scheduleDateTitle =
  document.getElementById("scheduleDateTitle");

const previousDayButton =
  document.getElementById("previousDay");

const nextDayButton =
  document.getElementById("nextDay");

const scheduleForm =
  document.getElementById("scheduleForm");

const eventTitle =
  document.getElementById("eventTitle");

const eventDate =
  document.getElementById("eventDate");

const eventStart =
  document.getElementById("eventStart");

const eventEnd =
  document.getElementById("eventEnd");

const scheduledStatus =
  document.getElementById("scheduledStatus");

const customScheduleStatus =
  document.getElementById("customScheduleStatus");

const scheduleMsg1 =
  document.getElementById("scheduleMsg1");

const scheduleMsg2 =
  document.getElementById("scheduleMsg2");

const scheduleModal =
  document.getElementById("scheduleModal");

const openScheduleModalButton =
  document.getElementById("openScheduleModal");

const closeScheduleModalButton =
  document.getElementById("closeScheduleModal");

const lcdLine1 =
  document.getElementById("lcdLine1");

const lcdLine2 =
  document.getElementById("lcdLine2");

const automaticStatusMessage =
  document.getElementById("automaticStatusMessage");


// ==========================================
// Start the webpage
// ==========================================

const pacificNow = getPacificDateAndTime();

if (scheduleDate) {
  scheduleDate.value = pacificNow.date;
}

if (eventDate) {
  eventDate.value = pacificNow.date;
}

renderSchedule();
checkScheduledStatus();


// ==========================================
// Preset status buttons
// ==========================================

presetButtons.forEach(function (button) {
  button.addEventListener(
    "click",
    function () {
      const line1 =
        button.dataset.msg1 || "";

      const line2 =
        button.dataset.msg2 || "";

      sendStatus(line1, line2);
    }
  );
});


// ==========================================
// Custom status form
// ==========================================

if (customStatusForm) {
  customStatusForm.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      const line1 = customLine1
        ? customLine1.value.trim()
        : "";

      const line2 = customLine2
        ? customLine2.value.trim()
        : "";

      if (line1 === "") {
        showResult(
          "Please enter a custom status."
        );

        return;
      }

      sendStatus(line1, line2);
      customStatusForm.reset();
    }
  );
}


// ==========================================
// Send status to Flask and LCD
// ==========================================

function sendStatus(line1, line2) {
  line1 = String(line1 || "")
    .trim()
    .substring(0, 16);

  line2 = String(line2 || "")
    .trim()
    .substring(0, 16);

  showResult("Sending status...");

  return fetch(FLASK_STATUS_URL, {
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
      if (!response.ok) {
        throw new Error(
          "Flask returned status " +
          response.status
        );
      }

      return response.json();
    })
    .then(function (data) {
      showResult(
        "Updated: " +
        line1 +
        (line2 ? " | " + line2 : "")
      );

      updateLCDPreview(line1, line2);

      if (line1.toUpperCase() === "AVAILABLE") {
        return setLed(true).then(function () {
          console.log("Response:", data);
          return data;
        });
      } else {
        return setLed(false).then(function () {
          console.log("Response:", data);
          return data;
        });
      }
    })
    .catch(function (error) {
      showResult(
        "Could not connect to the server."
      );

      console.error(
        "Connection error:",
        error
      );

      throw error;
    });
}


// ==========================================
// Send LED state to Flask
// ==========================================

function setLed(state) {
  return fetch(FLASK_LED_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      state: state
    })
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error(
          "Flask returned status " +
          response.status
        );
      }

      return response.json();
    })
    .then(function (data) {
      console.log("LED response:", data);
      return data;
    })
    .catch(function (error) {
      console.error(
        "LED connection error:",
        error
      );

      throw error;
    });
}


function showResult(message) {
  if (result) {
    result.textContent = message;
  }
}


function updateLCDPreview(line1, line2) {
  if (lcdLine1) {
    lcdLine1.textContent = line1;
  }

  if (lcdLine2) {
    lcdLine2.textContent = line2;
  }
}


// ==========================================
// Previous and next day buttons
// ==========================================

if (previousDayButton) {
  previousDayButton.addEventListener(
    "click",
    function () {
      changeScheduleDate(-1);
    }
  );
}

if (nextDayButton) {
  nextDayButton.addEventListener(
    "click",
    function () {
      changeScheduleDate(1);
    }
  );
}

if (scheduleDate) {
  scheduleDate.addEventListener(
    "change",
    function () {
      renderSchedule();
    }
  );
}


function changeScheduleDate(numberOfDays) {
  if (
    !scheduleDate ||
    !scheduleDate.value
  ) {
    return;
  }

  const currentDate = new Date(
    scheduleDate.value + "T12:00:00"
  );

  currentDate.setDate(
    currentDate.getDate() + numberOfDays
  );

  scheduleDate.value =
    formatDateForInput(currentDate);

  renderSchedule();
}


// ==========================================
// Open and close event popup
// ==========================================

if (openScheduleModalButton) {
  openScheduleModalButton.addEventListener(
    "click",
    function () {
      openScheduleModal();
    }
  );
}

if (closeScheduleModalButton) {
  closeScheduleModalButton.addEventListener(
    "click",
    function () {
      closeScheduleModal();
    }
  );
}

if (scheduleModal) {
  scheduleModal.addEventListener(
    "click",
    function (event) {
      if (event.target === scheduleModal) {
        closeScheduleModal();
      }
    }
  );
}

document.addEventListener(
  "keydown",
  function (event) {
    if (event.key === "Escape") {
      closeScheduleModal();
    }
  }
);


function openScheduleModal() {
  if (!scheduleModal) {
    return;
  }

  scheduleModal.classList.remove("hidden");

  if (eventDate && scheduleDate) {
    eventDate.value = scheduleDate.value;
  }

  if (eventTitle) {
    eventTitle.focus();
  }
}


function closeScheduleModal() {
  if (!scheduleModal) {
    return;
  }

  scheduleModal.classList.add("hidden");
}


// ==========================================
// Custom scheduled-status fields
// ==========================================

if (scheduledStatus) {
  scheduledStatus.addEventListener(
    "change",
    function () {
      if (!customScheduleStatus) {
        return;
      }

      if (
        scheduledStatus.value === "custom"
      ) {
        customScheduleStatus.classList.remove(
          "hidden"
        );
      } else {
        customScheduleStatus.classList.add(
          "hidden"
        );
      }
    }
  );
}


// ==========================================
// Add a calendar event
// ==========================================

if (scheduleForm) {
  scheduleForm.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      const title =
        eventTitle.value.trim();

      const date =
        eventDate.value;

      const start =
        eventStart.value;

      const end =
        eventEnd.value;

      const selectedStatus =
        scheduledStatus.value;

      if (
        title === "" ||
        date === "" ||
        start === "" ||
        end === "" ||
        selectedStatus === ""
      ) {
        alert(
          "Please complete every event field."
        );

        return;
      }

      if (
        timeToMinutes(end) <=
        timeToMinutes(start)
      ) {
        alert(
          "The end time must be after the start time."
        );

        return;
      }

      let line1 = "";
      let line2 = "";

      if (selectedStatus === "custom") {
        line1 = scheduleMsg1.value
          .trim()
          .substring(0, 16);

        line2 = scheduleMsg2.value
          .trim()
          .substring(0, 16);

        if (line1 === "") {
          alert(
            "Please enter the custom status."
          );

          return;
        }
      } else {
        const statusParts =
          selectedStatus.split("|");

        line1 = statusParts[0] || "";
        line2 = statusParts[1] || "";
      }

      const newEvent = {
        id: Date.now(),
        title: title,
        date: date,
        start: start,
        end: end,
        line1: line1,
        line2: line2
      };

      scheduleEvents.push(newEvent);

      saveScheduleEvents();

      if (scheduleDate) {
        scheduleDate.value = date;
      }

      renderSchedule();
      scheduleForm.reset();

      if (eventDate) {
        eventDate.value = date;
      }

      if (customScheduleStatus) {
        customScheduleStatus.classList.add(
          "hidden"
        );
      }

      closeScheduleModal();
      checkScheduledStatus();
    }
  );
}


// ==========================================
// Create the hourly calendar
// ==========================================

function renderSchedule() {
  if (
    !scheduleTimeline ||
    !scheduleDate
  ) {
    return;
  }

  scheduleTimeline.innerHTML = "";

  updateScheduleDateTitle();

  for (
    let hour = scheduleStartHour;
    hour < scheduleEndHour;
    hour++
  ) {
    const timeSlot =
      document.createElement("div");

    timeSlot.className = "timeSlot";

    const timeLabel =
      document.createElement("div");

    timeLabel.className = "timeLabel";
    timeLabel.textContent =
      formatHour(hour);

    const slotArea =
      document.createElement("div");

    slotArea.className = "slotArea";

    timeSlot.appendChild(timeLabel);
    timeSlot.appendChild(slotArea);

    scheduleTimeline.appendChild(
      timeSlot
    );
  }

  renderScheduleEvents();
}


// ==========================================
// Display saved events
// ==========================================

function renderScheduleEvents() {
  if (
    !scheduleTimeline ||
    !scheduleDate
  ) {
    return;
  }

  const selectedDate =
    scheduleDate.value;

  const eventsForSelectedDate =
    scheduleEvents
      .filter(function (scheduleEvent) {
        return (
          scheduleEvent.date ===
          selectedDate
        );
      })
      .sort(
        function (
          firstEvent,
          secondEvent
        ) {
          return firstEvent.start.localeCompare(
            secondEvent.start
          );
        }
      );

  eventsForSelectedDate.forEach(
    function (scheduleEvent) {
      createScheduleEventBlock(
        scheduleEvent
      );
    }
  );
}


function createScheduleEventBlock(
  scheduleEvent
) {
  const scheduleStartMinutes =
    scheduleStartHour * 60;

  const scheduleEndMinutes =
    scheduleEndHour * 60;

  const eventStartMinutes =
    timeToMinutes(scheduleEvent.start);

  const eventEndMinutes =
    timeToMinutes(scheduleEvent.end);

  if (
    eventEndMinutes <= scheduleStartMinutes ||
    eventStartMinutes >= scheduleEndMinutes
  ) {
    return;
  }

  const visibleStart = Math.max(
    eventStartMinutes,
    scheduleStartMinutes
  );

  const visibleEnd = Math.min(
    eventEndMinutes,
    scheduleEndMinutes
  );

  const eventTop =
    (
      (
        visibleStart -
        scheduleStartMinutes
      ) /
      60
    ) * slotHeight;

  const eventHeight = Math.max(
    (
      (
        visibleEnd -
        visibleStart
      ) /
      60
    ) * slotHeight,
    32
  );

  const eventBlock =
    document.createElement("div");

  eventBlock.className =
    "scheduleEvent";

  if (isEventActive(scheduleEvent)) {
    eventBlock.classList.add(
      "activeEvent"
    );
  }

  eventBlock.style.top =
    eventTop + "px";

  eventBlock.style.height =
    eventHeight + "px";

  const title =
    document.createElement("p");

  title.className =
    "scheduleEventTitle";

  title.textContent =
    scheduleEvent.title;

  const details =
    document.createElement("p");

  details.className =
    "scheduleEventDetails";

  details.textContent =
    formatTime(scheduleEvent.start) +
    " – " +
    formatTime(scheduleEvent.end) +
    " • " +
    scheduleEvent.line1;

  const deleteButton =
    document.createElement("button");

  deleteButton.type = "button";

  deleteButton.className =
    "scheduleDeleteButton";

  deleteButton.textContent = "Delete";

  deleteButton.addEventListener(
    "click",
    function () {
      deleteScheduleEvent(
        scheduleEvent.id
      );
    }
  );

  eventBlock.appendChild(title);
  eventBlock.appendChild(details);
  eventBlock.appendChild(deleteButton);

  scheduleTimeline.appendChild(
    eventBlock
  );
}


// ==========================================
// Delete an event
// ==========================================

function deleteScheduleEvent(eventId) {
  const shouldDelete = confirm(
    "Delete this event?"
  );

  if (!shouldDelete) {
    return;
  }

  scheduleEvents =
    scheduleEvents.filter(
      function (scheduleEvent) {
        return (
          scheduleEvent.id !== eventId
        );
      }
    );

  saveScheduleEvents();
  renderSchedule();
  checkScheduledStatus();
}


// ==========================================
// Save and load calendar events
// ==========================================

function saveScheduleEvents() {
  localStorage.setItem(
    "scheduleEvents",
    JSON.stringify(scheduleEvents)
  );
}


function loadScheduleEvents() {
  try {
    const savedEvents =
      localStorage.getItem(
        "scheduleEvents"
      );

    if (!savedEvents) {
      return [];
    }

    return JSON.parse(savedEvents);
  } catch (error) {
    console.error(
      "Could not load calendar events:",
      error
    );

    return [];
  }
}


// ==========================================
// Automatic scheduled LCD updates
// ==========================================

function checkScheduledStatus() {
  const pacificTime =
    getPacificDateAndTime();

  const activeEvents = scheduleEvents
    .filter(function (scheduleEvent) {
      return isEventActive(
        scheduleEvent,
        pacificTime
      );
    })
    .sort(
      function (
        firstEvent,
        secondEvent
      ) {
        return secondEvent.start.localeCompare(
          firstEvent.start
        );
      }
    );

  if (activeEvents.length === 0) {
    if (scheduleWasActive) {
      scheduleWasActive = false;
      lastActivatedEventKey = null;

      sendStatus("AVAILABLE", "")
        .then(function () {
          console.log(
            "Event ended. Status changed to AVAILABLE."
          );

          if (automaticStatusMessage) {
            automaticStatusMessage.textContent =
              "The scheduled event ended. " +
              "Status is AVAILABLE.";
          }
        })
        .catch(function (error) {
          console.error(
            "Could not send AVAILABLE status:",
            error
          );
        });
    } else if (automaticStatusMessage) {
      automaticStatusMessage.textContent =
        "No scheduled event is active.";
    }

    refreshActiveEventColors();
    return;
  }

  const activeEvent = activeEvents[0];

  const activeEventKey =
    activeEvent.id +
    "-" +
    activeEvent.date +
    "-" +
    activeEvent.start;

  scheduleWasActive = true;

  if (automaticStatusMessage) {
    automaticStatusMessage.textContent =
      "Active event: " +
      activeEvent.title;
  }

  refreshActiveEventColors();

  if (
    activeEventKey ===
    lastActivatedEventKey
  ) {
    return;
  }

  lastActivatedEventKey =
    activeEventKey;

  sendStatus(
    activeEvent.line1,
    activeEvent.line2
  )
    .then(function () {
      console.log(
        "Scheduled status activated:",
        activeEvent.title
      );
    })
    .catch(function (error) {
      lastActivatedEventKey = null;

      console.error(
        "Could not activate scheduled status:",
        error
      );
    });
}


// ==========================================
// Check whether an event is active
// ==========================================

function isEventActive(
  scheduleEvent,
  suppliedPacificTime
) {
  const pacificTime =
    suppliedPacificTime ||
    getPacificDateAndTime();

  const currentMinutes =
    timeToMinutes(pacificTime.time);

  const startMinutes =
    timeToMinutes(scheduleEvent.start);

  const endMinutes =
    timeToMinutes(scheduleEvent.end);

  return (
    scheduleEvent.date ===
      pacificTime.date &&
    currentMinutes >= startMinutes &&
    currentMinutes < endMinutes
  );
}


// ==========================================
// Refresh active-event colors
// ==========================================

function refreshActiveEventColors() {
  if (!scheduleDate) {
    return;
  }

  const pacificTime =
    getPacificDateAndTime();

  if (
    scheduleDate.value ===
    pacificTime.date
  ) {
    renderSchedule();
  }
}


// ==========================================
// Pacific Time
// ==========================================

function getPacificDateAndTime() {
  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          SCHEDULE_TIME_ZONE,

        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
      }
    );

  const parts =
    formatter.formatToParts(
      new Date()
    );

  const values = {};

  parts.forEach(function (part) {
    if (part.type !== "literal") {
      values[part.type] =
        part.value;
    }
  });

  return {
    date:
      values.year +
      "-" +
      values.month +
      "-" +
      values.day,

    time:
      values.hour +
      ":" +
      values.minute
  };
}


// ==========================================
// Date and time formatting
// ==========================================

function updateScheduleDateTitle() {
  if (
    !scheduleDateTitle ||
    !scheduleDate.value
  ) {
    return;
  }

  const selectedDate = new Date(
    scheduleDate.value +
    "T12:00:00"
  );

  scheduleDateTitle.textContent =
    selectedDate.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    );
}


function formatDateForInput(date) {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return (
    year +
    "-" +
    month +
    "-" +
    day
  );
}


function timeToMinutes(time) {
  if (
    !time ||
    !time.includes(":")
  ) {
    return 0;
  }

  const parts = time.split(":");

  return (
    Number(parts[0]) * 60 +
    Number(parts[1])
  );
}


function formatHour(hour) {
  const period =
    hour >= 12 ? "PM" : "AM";

  const displayedHour =
    hour % 12 || 12;

  return (
    displayedHour +
    ":00 " +
    period
  );
}


function formatTime(time) {
  const parts = time.split(":");

  const hour = Number(parts[0]);
  const minute = parts[1];

  const period =
    hour >= 12 ? "PM" : "AM";

  const displayedHour =
    hour % 12 || 12;

  return (
    displayedHour +
    ":" +
    minute +
    " " +
    period
  );
}


// ==========================================
// Keep checking scheduled events
// ==========================================

setInterval(
  checkScheduledStatus,
  1000
);

