//!Colorful Comments Guide: & ! ^ ? * ~ TODO
const express = require('express'); //^ initialise the variable express with the express object
const app = express(); //^ start the server
const http = require('http'); //^ initialise the variable http with the http object
const server = http.createServer(app); //^ initialise the variable server with the object created by http.createServer method, passing it the app object. 

const { Server } = require('socket.io'); //^ initialise the variable Server with the property Server found in scoket.io object : google what does const { variable } = require('xxx') mean?
const io = new Server(server); //^ create a new socket.io server using already exisitng express.js server linked over http (is an object)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

nicknames = [];
clients = 0;

io.on('connection', (socket) => {
    clients++;
    console.log('A user connected on socket: ', socket.id, socket.connected);
    io.emit('new user has connected', (socket.id))
    socket.on('disconnect', () => {
        console.log('The user disconnected on socket: ', socket.id, socket.disconnected);
    });
    socket.on('message from client to server', (msg) => {
        io.emit('message from server to client', {message: msg, nickname: socket.nickname})
        console.log('message: ' + msg);
    });
    socket.on('typing', (data)=>{
      if(data.typing == true)
      socket.broadcast.emit('userIsTyping', data);
    });
    socket.on('nickname from client to server', (nickname, callback) => {
      if(nicknames.indexOf(nickname) != -1){
        callback(false);
      } else{
        callback(true);
        socket.nickname = nickname
        nicknames.push(socket.nickname) //here we can push the socket object that will have the property nickname so we can update the socket nickname next time we update the nickname
        io.emit('nicknames list from server to client', {nickname: nickname, nicknamesList: nicknames, totalNrSockets: clients, socketid: socket.id})
        console.log('nickname: ' + nickname + '\nnicknames list: ' + nicknames);
      }
    });
}) //^ What's happening here? We listen for a connection (when we load the index.html), then we take the socket and display whether we are connected to the socket or not.
   //! We then listen to see if the user has disconnected/exited from the socket s/he just connected.
   //* Note that whenever we reconnect the socket id changes to a new one.
   //^ We listen on the socket for a specific event called 'chat message' then we take that message and console.log it.

server.listen(3000, () => {
  console.log('listening on *:3000');
}); //^ This is making the server to listen ~ start on port 3000.