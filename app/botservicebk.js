'use strict';

var request = require('request');
let Wit = require('node-wit').Wit;
let log = require('node-wit').log;

module.exports = function(){

	var PAGE_ACCESS_TOKEN = "EAARF62yuwKgBALGMevxwZAh1HWoZBmw3at6iC7qLwnMiXWq7ukVzLAs4d5cBucyrVHWEcJeBEr9Xz2ohccHjbN22a8PHPOoOHtuKDxfcFMiLHCZCNgat8F2M4UWbC8KdLZAllzxHGwZAF4g147rPHdjfNxI91MFu2EFTfiBEm6AZDZD";
  var WIT_TOKEN = "J65XVFFFIEHMXQT4PIQ6Q5V5C7TZGE65";

  var sessions = {};

  var receive = function(event) {
    var senderId = event.sender.id;
    var sessionId = findOrCreateSession(senderId);
	  var recipientId = event.recipient.id;
	  var timeOfMessage = event.timestamp;
	  var message = event.message;
		var messageId = message.mid;
	  var text = message.text;
	  var messageAttachments = message.attachments;

	  console.log("Received message for user %d and page %d at %d with message:", senderId, recipientId, timeOfMessage);
	  
	  //sendAction(senderID, "mark_seen");
	  //sendAction(senderID, "typing_off");
	  //sendAction(senderId, "typing_on");
	  
	  	if (text) {
	    
				switch (text) {
					case 'settings':
						helpMenu(senderId);
						break;
					
					case 'help':
						helpMenu(senderId);
						break;

					case 'image':
						//sendImageMessage(senderID);
						break;

					case 'button':
						//sendButtonMessage(senderID);
						break;

					case 'generic':
						sendGenericMessage(senderId);
						break;

					case 'receipt':
						//sendReceiptMessage(senderID);
						break;

					default:
						processCommand(senderId, text, sessionId);

				}
			} else if (messageAttachments) {
				processCommand(senderId, "Message with attachment received", sessionId);
			}
  }





  const firstEntityValue = (entities, entity) => {
	  const val = entities && entities[entity] &&
	    Array.isArray(entities[entity]) &&
	    entities[entity].length > 0 &&
	    entities[entity][0].value;
	  if (!val) {
	    return null;
	  }
	  return typeof val === 'object' ? val.value : val;
  };

  const actions = {
	  send (request, response) {
	    const {sessionId, context, entities} = request;
	    const {text, quickreplies} = response;
	    const recipientId = sessions[sessionId].fbid;
	    return new Promise(function(resolve, reject) {
	      	console.log("received from wit: ", JSON.stringify(response));
	      	if(response.text){
								var data = {
									recipient: {
										id: recipientId 
									},
									message: {
										text: response.text
								}
							};
							sendAction(recipientId, "typing_off");
							send(data);
	      	}
	        return resolve();
	    });
	  },
	  getAvailability({sessionId, context, entities}) {
	    return new Promise(function(resolve, reject) {
	      
	      var intent = firstEntityValue(entities, 'intent');
	      var datetime = firstEntityValue(entities, 'datetime');
	      var location = firstEntityValue(entities, 'location');

	      if(intent){ context.intent = intent; }
	      if(datetime){ context.datetime = datetime; }
	      if(location){ context.location = location; }

	      console.log("datetime: ", context.datetime, " intent: ", context.intent, " location: ", context.location);

	      if(context.location && context.datetime && context.intent){
	        context.availability = "Yup got appointments";
	        delete context.missingLocation;
	        delete context.missingDate;
	      }else if(context.datetime){
	        context.missingLocation = true;
	        delete context.availability;
	        delete context.missingDate;
	      }else if(context.location){
	        context.missingDate = true;
	        delete context.availability;
	        delete context.missingLocation;
	      }
	      return resolve(context);
	    });
	  },
	  greeting({sessionId, context, entities}) {
	  	return new Promise(function(resolve, reject) {
	  	  context.message = "Hi, my name is Pedro, but my friends call me 'Dirty Sanchez'...whats your name??"
	      return resolve(context);
	    });
	  },
	  help({sessionId, context, entities}) {
	  	const recipientId = sessions[sessionId].fbid;
	  	console.log("Sending help: ", recipientId);
	  	helpMenu(recipientId);

	  	return new Promise(function(resolve, reject) {
	  		context.help = true;
	  	  	return resolve(context);
	    });
	  }

	  //wit functions:
  };


var findOrCreateSession = (fbid) => {

	  let sessionId;
	  // Let's see if we already have a session for the user fbid
	  Object.keys(sessions).forEach(k => {
	    if (sessions[k].fbid === fbid) {
	      // Yep, got it!
	      sessionId = k;
	    }
	  });

	  if (!sessionId) {
	    // No session found for user fbid, let's create a new one
	    sessionId = new Date().toISOString();
	    sessions[sessionId] = {
				fbid: fbid, context: {}
			};
	  }
	  return sessionId;

};

  

  // recipientId: "1188807401190989"
  var processCommand = function(recipientId, text, sessionId) {
		sendAction(recipientId, "typing_on");
		sendTextMessage(recipientId, text);
		/*
			var wit = new Wit({
		  	accessToken: WIT_TOKEN,
		  	actions,
		  	logger: new log.Logger(log.INFO)
	    });
		*/

		var session = sessions[sessionId].context;
		console.log("session: ", session);
		console.log("session: ", JSON.stringify(session));

	    // var wit = new Wit({
		  // 	accessToken: WIT_TOKEN,
		  // 	actions
	    // });

		/*wit.runActions(
          sessionId, //recipientId the user's current session
          text,
          session
        ).then((context) => {
          // Based on the session state, you might want to reset the session.
          // This depends heavily on the business logic of your bot.
          // Example:
          // if (context['done']) {
          //   delete sessions[sessionId];
          // }

          // Updating the user's current session state
          sessions[sessionId].context = context;

        })
        .catch((err) => {
          console.error('Oops! Got an error from Wit: ', err.stack || err);
        })*/

	  	//send(data);
	  	
	}

	var sendTextMessage = function(recipientId, messageText) {
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

		        //console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
		    } else {
		      console.error("Unable to send message.");
		      console.error(response);
		      console.error(error);
		    }
		  });  

	}

	var sendAction = function(senderId, action){
		var data = {
		    recipient: {
		      id: senderId
		    },
		    sender_action: action
		};

		send(data);
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
		            title: "rift",
		            subtitle: "Next-generation virtual reality",
		            item_url: "https://www.oculus.com/en-us/rift/",               
		            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
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
		            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
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







	

	var helpMenu = function(recipientId) {
		console.log("sending help menu to: ", recipientId);
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
		            title: "Appointments",
		            subtitle: "Your appointments made easy",
		            buttons: [{
		              type: "postback",
		              title: "Make an ppointment",
		              payload: "book"
		            }, {
		              type: "postback",
		              title: "Cancel an appointment",
		              payload: "cancel",
		            },
		            {
		              type: "postback",
		              title: "Call me",
		              payload: "call",
		            }],
		        }, {
		            title: "Settings",
		            subtitle: "Set your location and stuff like that",
		            buttons: [{
				              type: "postback",
				              title: "Set Location",
				              payload: "location",
				            }, {
				              type: "postback",
				              title: "Other settings",
				              payload: "settings",
				            }]
	            }]
	        }
	      }
	    }
	  };  

	  send(data);
	}

	var postback = function(event) {
	  var senderId = event.sender.id;
	  var recipientID = event.recipient.id;
	  var timeOfPostback = event.timestamp;
	  var payload = event.postback.payload;

	  console.log("Received postback for user %d and page %d with payload '%s' at %d", senderId, recipientID, payload, timeOfPostback);

	  // When a postback is called, we'll send a message back to the sender to 
	  // let them know it was successful
	  /*var data = {
				    recipient: {
				      id: senderId 
				    },
				    message: {
				      text: payload
				    }
				};
	  
	  send(data);*/

	}

  return {
    receive: receive,
    postback: postback
  }

}