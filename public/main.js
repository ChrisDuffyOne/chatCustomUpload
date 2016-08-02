$(document).ready(function(){
	var socket = io();
	var input = $('input');
	var messages = $('#messages');

	var addMessage = function(message){
		var says = ':   ';
		messages.append('<div class="mesg">'+message+'</div>');
	};

	var newArrival = function(user, num){
		$('#userCount').html('Current Number of Users: '+num);
		messages.append('<div class="newGuy">'+user+' has entered the room</div>');
	};

	var fareWell = function(user, num){
		$('#userCount').html('Current Number of Users: '+num);
		messages.append('<div class="oldGuy">'+user+' has left the room</div>');
	};

	//--Username Assignment--//
	var useName = '';
	socket.on('newName', function(num){
		useName = useName.concat('CHATTER', num);
		$('#userCount').html('Current Number of Users: '+num);
		socket.emit('userConfirm', useName);
	});

	//--Message Broadcast--//
	input.on('keydown', function(event){
		if(event.keyCode != 13){
			return;
		}else{
			//--Change Username--//
			if(input.val().indexOf('changeName:') === 0){
				console.log('you want to change yo name!');
				var arrayName = input.val().split(':');
				console.log(arrayName);
				useName = arrayName[1];
				input.val('');
			}else{
				var message = useName.concat(':   ', input.val());
				addMessage(message);
				socket.emit('message', message);
				input.val('');
			};
		};
	});

	//--UserLeave Broadcast--//
	window.addEventListener("beforeunload", function () {
  		socket.emit('userLeave', useName);
	});

	socket.on('newUser', newArrival);
	socket.on('userBye', fareWell);
	socket.on('message', addMessage);
});