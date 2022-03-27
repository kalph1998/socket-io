import Express from "express";
import http from "http";
import path from "path";
import socket from "socket.io";
import BadWordsFilter from "bad-words";
import { generateMessage, generateLocationMessage } from "./utils/messages";
import { addUser, getUser, getUsersInRoom, removeUser } from './utils/users'

const app = Express();
const server = http.createServer(app);
const io = new socket.Server(server);
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public/");

app.use(Express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }, callback) => {


    const { error, user } = addUser({ id: socket.id, username, room })

    if (error) {
      return callback(error)
    }

    socket.join(user?.room!);

    socket.emit("message", generateMessage('Admin', "welcome"));
    socket.broadcast
      .to(user?.room!)
      .emit("message", generateMessage(user?.username!, `${user?.username} has joined!`));
    io.to(user?.room!).emit('roomData', {
      room: user?.room!,
      users: getUsersInRoom(user?.room!)
    })
    callback()

  });

  socket.on("send", (message, callback) => {


    let user = getUser(socket.id)


    const filter = new BadWordsFilter();

    if (filter.isProfane(message)) {
      callback("Profanity is not allowed");
      return;
    }

    io.to(user!.room).emit("message", generateMessage(user?.username!, message));
    callback();
  });
  socket.on("disconnect", () => {
    let user = removeUser(socket.id)

    if (user) {
      io.to(user.room).emit("message", generateMessage('Admin', user?.username + " has left"));
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
    }

  });

  socket.on("sendLocation", (location, callbacks) => {

    let user = getUser(socket.id)

    io.to(user?.room!).emit(
      "locationMessage",
      generateLocationMessage(
        user?.username!,
        `https://google.com/maps?q=${location.latitude},${location.longitude}`
      )
    );
    callbacks(generateLocationMessage(user?.username!, "location is shared"));
  });
});

server.listen(port, () => {
  console.log("Server is up on " + port);
});
