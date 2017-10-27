'use strict';

var messenger = require('./messengerservice')();

module.exports = function() {
	const PAGE_ACCESS_TOKEN = 'EAABygwXeEvIBAAHZCB1oT9t6DL0TaCZBC518p61uKZAVxhZCuACmNeY8sqZBEIEkJgVJch9beSrFZCGyhbgspbmc9byWHyUG4aEP7ZATWDrFWEHxFBzAHinZB6biAbGgt3JVeHJcfVQqJGRz0zsTnQW7LZC9ZBOaCJ4GngYr8yBHifUAZDZD';
	const WIT_TOKEN = 'J65XVFFFIEHMXQT4PIQ6Q5V5C7TZGE65';
  const TYPING_ON = 'typing_on';
  const TYPING_OFF = 'typing_off';
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

	  var data = {
				recipient: {
					id: senderId 
				},
				message: {
					text: payload
				}
		};
	  messenger.send(data);
	}

	var receive = function(event) {
    var senderId = event.sender.id;
    var recipientId = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
    var messageId = message.mid;
    var text = message.text;
    var messageAttachments = message.attachments;
    var sessionId = findOrCreateSession(senderId);
    var entities = message.nlp.entities;

		console.log("sender: ", senderId);
    console.log("message: ", message);
    console.log("entities: ", entities);

	  switch(text) {
        case 'greeting':
          greeting(data);
        break;

        case 'booking':
          booking(data);
        break;
        
        case 'cancellation':
          cancellation(data);
        break;
        
        case 'settings':
          settings(data);
        break;

        default:
    }
  };



	var standby = function(data) {

  }


	return {
		postback: postback
	}



}