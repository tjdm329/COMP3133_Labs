// dependencies : npm install express socket.io nodemon
// to run the app : npx nodemon server.js

const express = require('express')
const path = require('path');
const socketio = require('socket.io') //import socket.io module

const SERVER_PORT = process.env.PORT || 3000
const app = express()

app.use(express.static(path.join(__dirname, 'socket/views')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'socket/views/client.html'))
})

//start listening to server on PORT
const appServer = app.listen(SERVER_PORT, () => {
    console.log(`Server running on http://localhost:${SERVER_PORT}/`)
})

//associate appServer with socket server
const ioServer = socketio(appServer)

//on() function listens to connection event
//when the event occurs, callback is executed
ioServer.on("connection", (socket) => {
    console.log(`Client connected. Client ID : ${socket.id}`);

    //listener for 'ping' event
    socket.on('ping', (data) => {
        //perform necessary operation to process the event request
        console.log(`ON SERVER - PING - RECEIVED - with data : ${data}`);

        //emitting event from server to client
        socket.emit('ping-ack', "Hello from Server")
        console.log(`ON SERVER - PING-ACK - SENT - with "Hello from Server"`);
    })

    //listener for 'chat-from-client' event
    socket.on('chat-from-client', (data) => {
        console.log(`ON SERVER - CHAT-FROM-CLIENT - RECEIVED - with data : ${data}`);

        //emit the event to all the clients
        socket.emit('chat-ack')
        console.log(`ON SERVER - CHAT-ACK - SENT - chat message received`);
    })

    //listener for 'feedback' event
    socket.on('feedback', (data) => {
        console.log(`ON SERVER - FEEDBACK - RECEIVED - with data : ${JSON.stringify}`);

        const res = {
            message : "Thank you for your valuable feedback",
            ticketNum : 1234
        }
        //emit the event to all the clients
        socket.emit('feedback-ack', res)
        console.log(`ON SERVER - FEEBACK-ACK - SENT - with response : ${JSON.stringify(res)}`);
    })

    //listener for 'join-group' event
    socket.on('join-group', (group_name) => {
        console.log(`ON SERVER - JOIN GROUP - RECEIVED - for group name ${group_name}`);

        //group clients under group_name
        socket.join(group_name)

        const message = `Welcome our new member ${socket.id} to group ${group_name}`
        //respond to request
        // socket.emit('group-ack', message)

        //broadcast event to all clients
        //socket.broadcast.emit('group-ack', message)

        //broadcast event only to group members
        ioServer.to(group_name).emit('group-ack', message)

        console.log(`ON SERVER - GROUP-ACK - SENT - with response : ${message}`);
    })

       //listener for 'leave-group' event
    socket.on('leave-group', (group_name) => {
        console.log(`ON SERVER - LEAVE GROUP - RECEIVED - for group name ${group_name}`);

        const message = `Client ${socket.id} is removed from group ${group_name}`
        //respond to request
        socket.emit('group-ack', message)

        console.log(`ON SERVER - GROUP-ACK - SENT - with response : ${message}`);

        //remove clients from group_name
        socket.leave(group_name)
    })

    //when client disconnected
    socket.on("disconnect", () => {
        //perform necessary wind up operations
        console.log(`Client ${socket.id} is disconnected`);
    })
})
