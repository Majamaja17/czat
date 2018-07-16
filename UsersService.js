import index from 'index.js';
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, function(){
  console.log('listening on *:3000');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {

socket.on('join', function(name){
  // użytkownika, który pojawił się w aplikacji zapisujemy do serwisu trzymającego listę osób w czacie
  userService.addUser({
    id: socket.id,
    name
  });
  // aplikacja emituje zdarzenie update, które aktualizuje informację na temat listy użytkowników każdemu nasłuchującemu na wydarzenie 'update'
  io.emit('update', {
    users: userService.getAllUsers()
  });
});
});

server.listen(3000, function(){
  console.log('listening on *:3000');
});


io.on('connection', function(socket) {
  socket.on('disconnect', () => {
    userService.removeUser(socket.id);
    socket.broadcast.emit('update', {
      users: userService.getAllUsers()
    });
  });
});

io.on('connection', function(socket) {
  socket.on('message', function(message){
    const {name} = userService.getUserById(socket.id);
    socket.broadcast.emit('message', {
      text: message.text,
      from: name
    });
  });
});

class UsersService {
  constructor() {
    this.users = [];
  }

  getAllUsers() {
    return this.users;
  }

  getUserById(userId) {
    return this.users.find(user => user.id === userId);
  }

  addUser(user) {
    this.users = [user, ...this.users];
  }

  removeUser(userId) {
    this.users = this.users.filter(user => user.id !== userId);
  }
}
module.exports = UsersService;