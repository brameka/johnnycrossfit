'use strict';

var request = require('request');
var scottie = require('./scottie')();

module.exports = function() {

  // const PAGE_ACCESS_TOKEN = 'EAARF62yuwKgBALGMevxwZAh1HWoZBmw3at6iC7qLwnMiXWq7ukVzLAs4d5cBucyrVHWEcJeBEr9Xz2ohccHjbN22a8PHPOoOHtuKDxfcFMiLHCZCNgat8F2M4UWbC8KdLZAllzxHGwZAF4g147rPHdjfNxI91MFu2EFTfiBEm6AZDZD';
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

	  var data = {
				recipient: {
					id: senderId 
				},
				message: {
					text: payload
				}
		};
	  send(data);
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

  // var process = function(senderId, message) {
  //   sendAction(senderId, TYPING_ON);
  //   var response = scottie.process(senderId, message);
  //   sendMessage(senderId, text);
  // };

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
		            title: "Bergerun Beep Test",
		            subtitle: "Death By EMOM,\n7 Pull-ups,\n7 Thrusters 35/25kg,\n7 Burpees",
		            item_url: "",               
		            image_url: "http://crossfitkumba.com/wp-content/uploads/2014/07/crossfit-kumba-box.jpg",
		            buttons: [{
		              type: "element_share",
		              
									share_contents: { 
						      attachment: {
										type: "template",
										payload: {
													template_type: "generic",
													elements: [
														{
															title: "Bergerun Beep Test",
															subtitle: "Death By EMOM,\n7 Pull-ups,\n7 Thrusters 35/25kg,\n7 Burpees",
															image_url: "http://crossfitkumba.com/wp-content/uploads/2014/07/crossfit-kumba-box.jpg",
															default_action: {
																type: "web_url",
																url: "https://www.oculus.com/en-us/rift/"
															},
															buttons: [
																{
																	type: "web_url",
																	url: "http://m.me/johnnycrossfit.me?ref=invited_by_24601", 
																	title: "Can YOU dig it?"
																}
															]
														}
													]
												}
						      }
		            }
							}],
		        }, {
		            title: "Murph",
		            subtitle: "5 Rounds\n20 Pull-ups,\n40 Push-ups,\n60 Squats",
		            item_url: "https://www.oculus.com/en-us/touch/",               
		            image_url: "http://cdn-mf1.heartyhosting.com/sites/mensfitness.com/files/rehband_crossfit_2_main.jpg",
		            buttons: [{
		              type: "element_share",
		              
									share_contents: { 
						      attachment: {
										type: "template",
										payload: {
													template_type: "generic",
													elements: [
														{
															title: "Murph",
															subtitle: "5 Rounds\n20 Pull-ups,\n40 Push-ups,\n60 Squats",
															image_url: "http://crossfitkumba.com/wp-content/uploads/2014/07/crossfit-kumba-box.jpg",
															default_action: {
																type: "web_url",
																url: "https://www.oculus.com/en-us/rift/"
															},
															buttons: [
																{
																	type: "web_url",
																	url: "http://m.me/johnnycrossfit.me?ref=invited_by_24601", 
																	title: "Can YOU dig it?"
																}
															]
														}
													]
												}
						      }
		            }
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
    receive: receive,
		postback: postback
  }
}