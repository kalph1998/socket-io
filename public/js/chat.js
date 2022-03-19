const socket = io();

socket.on("message", (welcomeMessage) => {
  console.log(welcomeMessage);
});

document.getElementById("#increment").addEventListener("click", function () {
  const inputBox = document.getElementById("inputBox");
  const message = document.getElementById("inputBox").value;

  if (!message) {
    return;
  }

  socket.emit("send", message, (error) => {
    if (error) {
      return console.log(error);
    }
    console.log("the message was delivered");
    inputBox.value = "";
    inputBox.focus();
  });
});

document.getElementById("location").addEventListener("click", () => {
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
