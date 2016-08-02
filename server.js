var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var users = 0;

io.on('connection', function(socket){

	//--Username Assignment--//
	users++;
	console.log('Client connected:', users);
	socket.emit('newName', users);
	socket.on('userConfirm', function(useName){
		console.log('I am user confirm');
		socket.broadcast.emit('newUser', useName, users);
	});

	//--Message Broadcast--//
	socket.on('message', function(message){
		console.log('Recieved message:', message);
		socket.broadcast.emit('message', message);
	});

	//--UserLeave Broadcast--//
	socket.on('userLeave', function(useName){
		users--;
		console.log('Client disconnected:', users);
		socket.broadcast.emit('userBye', useName, users);
	});

});

console.log('Custom Chatroom Online:')
server.listen(process.env.PORT || 8080);