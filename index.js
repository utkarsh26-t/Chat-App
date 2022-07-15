const express = require('express');
const app = express();
//Getting http module
const http = require('http');
//forming http server and passing express app as request handler
const server = http.createServer(app);
const path = require('path');
const socketio = require('socket.io');
const io = socketio(server);

app.use('/', express.static(path.join(__dirname, 'public')));

const users = {};

io.on('connection', (socket) => {
    console.log(`Someone got connected with the id - ${socket.id}`);

    socket.on('send-msg', (data) => {
        
        io.emit('received-msg', {
            msg : data.msg,
            username : users[socket.id],
        })

    })

    socket.on('login', (data) => {
        users[socket.id] = data.username;
    })
})



const port = process.env.PORT || 3000;
//method provided by node js http module, it is not same express method
server.listen(port, () => {
    console.log(`server started at port ${port}`);
});




//http server works on event based commmunication unlike express which is based on client server request response at same time