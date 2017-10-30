'use strict';

var messenger = require('./messenger')();
var messages = require('./messages')();

module.exports = function(users, wods) {
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
    console.log('calling standby');
    var facebookId = event.sender.id;
    messenger.startTyping(facebookId);
    start(event);
    
    //https://gist.github.com/anantn/4323949
    // getUser(facebookId).then(function(snapshot) {
    //   if (snapshot.exists()) { 
    //     var user = snapshot.val();
    //   } else {
    //     users.createUser(facebookId);
    //   }
    //   start(event);
    // }).catch(function(error) {
    //   console.log('Error getting fb user: ', error);
    // });
  }

	var start = function(event) {
    console.log('calling start');
    var facebookId = event.sender.id;
    messenger.profile(facebookId)
      .then(function(response){
        console.log('response from messenger profile');
        var firstname = response.first_name;
        var data = {
          firstname: firstname,
          lastname: response.last_name,
          profile_pic: response.profile_pic,
          gender: response.gender,
          locale: response.locale,
          timezone: response.timezone,
          context: {
            topic: 'crossfit',
            message: 'hero'
          }
        }

        users.createUser(facebookId, data);
        sendGreeting(facebookId, firstname);
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

  var getUser = function(facebookId) {
    return users.getUser(facebookId);
    
    
    // users.getUser(facebookId).then(function(snapshot) {
    //   res.status(200).send(snapshot.val());
    // }).catch(function(error) {
    //   res.status(404).send('something went wrong with the fb query');
    // });
  }

	return {
		postback: postback,
    receive: receive
	}
}