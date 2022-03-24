const socket = io();

//Elements
const $messageForm = document.getElementById("message-form");
const $inputBox = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const locationInput = document.getElementById("location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

socket.on("message", (welcomeMessage) => {
  const html = Mustache.render(messageTemplate, {
    message: welcomeMessage.text,
    createdAt: moment(welcomeMessage.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (url) => {
  const html = Mustache.render(locationTemplate, {
    url: url.url,
    createdAt: moment(url.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const message = e.target.elements.message.value;

  if (!message) {
    return;
  }
  $inputBox.disabled = true;

  socket.emit("send", message, (error) => {
    $inputBox.disabled = false;
    $inputBox.value = "";
    $inputBox.focus();
    if (error) {
      return console.log(error);
    }
    console.log("the message was delivered");
  });
});

locationInput.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
      },
      (acknowledge) => {
        console.log(acknowledge);
      }
    );
  });
});
