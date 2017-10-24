'use strict';

var request = require('request');
var scottie = require('./scottie')();

module.exports = function() {

  const PAGE_ACCESS_TOKEN = 'EAARF62yuwKgBALGMevxwZAh1HWoZBmw3at6iC7qLwnMiXWq7ukVzLAs4d5cBucyrVHWEcJeBEr9Xz2ohccHjbN22a8PHPOoOHtuKDxfcFMiLHCZCNgat8F2M4UWbC8KdLZAllzxHGwZAF4g147rPHdjfNxI91MFu2EFTfiBEm6AZDZD';
  const WIT_TOKEN = 'J65XVFFFIEHMXQT4PIQ6Q5V5C7TZGE65';
  const TYPING_ON = 'typing_on';
  const TYPING_OFF = 'typing_off';
  const sessions = {};

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

    console.log("message: ", message);
    console.log("entities: ", entities);

	  if (text) {
      sendAction(senderId, TYPING_ON);
      stateChange(senderId);
      // sendGenericMessage(senderId);
      // process(senderId, text, sessionId, entities);
    }
  };

  function stateChange(senderId) {
		setTimeout(function () {
				sendGenericMessage(senderId);
		}, 5000);
  }

  var process = function(senderId, message) {
    sendAction(senderId, TYPING_ON);
    var response = scottie.process(senderId, message);
    sendMessage(senderId, text);
  };

  var sendMessage = function(recipientId, messageText) {
		var messageData = {
			recipient: {
				id: recipientId
			},
			message: {
				text: messageText
			}
		};
		send(messageData);
	}

  var sendAction = function(recipientId, action){
		var data = {
		    recipient: {
		      id: recipientId
		    },
		    sender_action: action
		};
		send(data);
	}

	var send = function(data){
		request({
		    uri: 'https://graph.facebook.com/v2.6/me/messages',
		    qs: { access_token: PAGE_ACCESS_TOKEN },
		    method: 'POST',
		    json: data

		  }, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		      var recipientId = body.recipient_id;
		      var messageId = body.message_id;
          sendAction(recipientId, TYPING_OFF);
		    } else {
		      console.error("Unable to send message.");
		      console.error(response);
		      console.error(error);
		    }
		  });
	}

  var sendGenericMessage = function(recipientId) {
	  var data = {
	    recipient: {
	      id: recipientId
	    },
	    message: {
	      attachment: {
	        type: "template",
	        payload: 
	        {
	          template_type: "generic",
	          elements: [
	          	{
		            title: "Reward",
		            subtitle: "Next-generation virtual reality",
		            item_url: "https://www.oculus.com/en-us/rift/",               
		            image_url: "http://cdn-mf1.heartyhosting.com/sites/mensfitness.com/files/rehband_crossfit_2_main.jpg",
		            buttons: [{
		              type: "web_url",
		              url: "https://www.oculus.com/en-us/rift/",
		              title: "Open Web URL"
		            }, {
		              type: "postback",
		              title: "Call Postback",
		              payload: "Payload for first bubble",
		            }],
		        }, {
		            title: "touch",
		            subtitle: "Your Hands, Now in VR",
		            item_url: "https://www.oculus.com/en-us/touch/",               
		            image_url: "http://cdn-mf1.heartyhosting.com/sites/mensfitness.com/files/rehband_crossfit_2_main.jpg",
		            buttons: [{
				              type: "web_url",
				              url: "https://www.oculus.com/en-us/touch/",
				              title: "Open Web URL"
				            }, {
				              type: "postback",
				              title: "Call Postback",
				              payload: "Payload for second bubble",
				            }]
	            }]
	        }
	      }
	    }
	  };  
	  send(data);
	}

  // todo: persist to firebase
  var findOrCreateSession = (fbid) => {
    let sessionId;
    Object.keys(sessions).forEach(k => {
      if (sessions[k].fbid === fbid) {
        sessionId = k;
      }
    });
    if (!sessionId) {
        // No session found for user fbid, let's create a new one
        sessionId = new Date().toISOString();
        sessions[sessionId] = {
            fbid: fbid, 
            context: {}
        };
    }
    return sessionId;
  };

  return {
    receive: receive
  }
}