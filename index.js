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
let loggedIn = [];

io.on('connection', (socket) => {
    console.log(`Someone got connected with the id - ${socket.id}`);

    socket.on('send-msg', (data) => {
        
        if(data.dest){
            io.to(data.dest).emit('received-msg', {
                msg : data.msg,
                sender : users[socket.id]
            })
        }
        else{
            io.emit('received-msg', {
                msg: data.msg,
                sender: users[socket.id]
            })
        }

    });

    socket.on('login', (data) => {
        users[socket.id] = data.username;

        loggedIn.push(data.username);
        io.emit('currentOnlineUsers', loggedIn);

        //When user logs in, assigning room no(username only in case of private chat) to them
        socket.join(data.username);
    })

    //If user closes its tab then it should be set offline then
    socket.on("disconnect", () => {

        console.log(`User-${users[socket.id]} logged out with socket id-${socket.id}`)
        
        loggedIn = loggedIn.filter(username => username !== users[socket.id]);
        io.emit('user-logged-out', loggedIn);
    });
})



const port = process.env.PORT || 3000;
//method provided by node js http module, it is not same express method
server.listen(port, () => {
    console.log(`server started at port ${port}`);
});




//http server works on event based commmunication unlike express which is based on client server request response at same time