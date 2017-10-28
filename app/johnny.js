'use strict';

var messenger = require('./messenger')();
var messages = require('./messages')();

module.exports = function() {
  const sessions = {};

	var postback = function(event) {
	  var senderId = event.sender.id;
	  var recipientId = event.recipient.id;
	  var timeOfPostback = event.timestamp;
	  var payload = event.postback.payload;

	  console.log("Received postback for user %d and page %d with payload '%s' at %d", senderId, recipientId, payload, timeOfPostback);

		switch(payload){

			case 'standby':
				standbyDelayed(event);
			break;

			default:
    }

	  // var data = {
		// 		recipient: {
		// 			id: senderId 
		// 		},
		// 		message: {
		// 			text: payload
		// 		}
		// };
	  // messenger.send(data);
	}

	var receive = function(event) {
    var senderId = event.sender.id;
    var recipientId = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
    var messageId = message.mid;
    var text = message.text;
    var messageAttachments = message.attachments;
    var entities = message.nlp.entities;

		console.log("sender: ", senderId);
    console.log("message: ", message);
    console.log("entities: ", entities);

	  switch(text) {
        case 'greeting':
          greeting(event);
        break;

        case 'booking':
          booking(event);
        break;
        
        case 'cancellation':
          cancellation(event);
        break;
        
        case 'settings':
          settings(event);
        break;

        default:
    }
  };

  var standbyDelayed = function(event) {
    console.log('standby delayed');
    var facebookId = event.sender.id;
    messenger.startTyping(facebookId);
		setTimeout(function () {
				standby(event);
		}, 5000);
  }

	var standby = function(event) {
    console.log('standby...');
    var facebookId = event.sender.id;
    messenger.profile(facebookId)
      .then(function(response){
        var name = response.first_name;
        sendGreeting(facebookId, name);
      }).catch(function(error){
        console.log('error getting profile: ', error);
      });
  }

  var sendGreeting = function(facebookId, name) {
    var greeting = messages.greeting(name);
    var data = {
      recipient: {
        id: facebookId 
      },
      message: {
        text: greeting
      }
    };
    messenger.send(data)
    .then(function(response){
        console.log('greeting sent...');
    }).catch(function(error){
        console.log('error getting profile: ', error);
    });
  }

	return {
		postback: postback,
    receive: receive
	}
}