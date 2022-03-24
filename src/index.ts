import Express from "express";
import http from "http";
import path from "path";
import socket from "socket.io";
import BadWordsFilter from "bad-words";
import { generateMessage, generateLocationMessage } from "./utils/messages";

const app = Express();
const server = http.createServer(app);
const io = new socket.Server(server);
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public/");

app.use(Express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  socket.emit("message", generateMessage("welcome to socket"));
  socket.broadcast.emit("message", generateMessage("A new user has joined!"));

  socket.on("send", (message, callback) => {
    const filter = new BadWordsFilter();

    if (filter.isProfane(message)) {
      callback("Profanity is not allowed");
      return;
    }

    io.emit("message", generateMessage(message));
    callback();
  });
  socket.on("disconnect", () => {
    io.emit("message", generateMessage("user has left"));
  });

  socket.on("sendLocation", (location, callbacks) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${location.latitude},${location.longitude}`
      )
    );
    callbacks(generateLocationMessage("location is shared"));
  });
});

server.listen(port, () => {
  console.log("Server is up on " + port);
});
