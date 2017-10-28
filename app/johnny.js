'use strict';

var messenger = require('./messengerservice')();

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
				standby(event);
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

	var standby = function(event) {
    console.log('stanby called:');
    messenger.profile().then(function(response){
      console.log('profile response: ', response);
      var facebookId = event.sender.id;
      var data = {
        recipient: {
          id: facebookId 
        },
        message: {
          text: 'standing by'
        }
      };
	    messenger.send(data);
    }).catch(function(error){

    });
  }

	return {
		postback: postback,
    receive: receive
	}
}