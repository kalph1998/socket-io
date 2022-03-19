import Express from "express";
import http from 'http';
import path from 'path';
import socket from "socket.io";
import BadWordsFilter from "bad-words";

const app = Express()
const server = http.createServer(app);
const io = new socket.Server(server)
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public/')

app.use(Express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('new web socket connection')
    socket.emit('message', 'welcome to socket')
    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('send', (message, callback) => {
        const filter = new BadWordsFilter();

        if (filter.isProfane(message)) {
            callback('Profanity is not allowed');
            return
        }

        io.emit('message', message)
        callback()
    })
    socket.on('disconnect', () => {
        io.emit('message', 'user has left')
    })

    socket.on('sendLocation', (location, callbacks) => {
        io.emit('message', `https://google.com/maps?q=${location.latitude},${location.longitude}`)
        callbacks('location is shared')
    })


})



server.listen(port, () => {
    console.log("Server is up on " + port);
});
