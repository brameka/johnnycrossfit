'use strict';

var _ = require('lodash');

module.exports = function(database) {

  var users = require('./services/userservice')(database);
	var wods = require('./services/wodservice')(database);
  var introSequence = require('./sequence/intro.sequence')(users);
  var wodSequence = require('./sequence/wod.sequence')(users, wods);
  var workoutSequence = require('./sequence/wod.sequence')(users, wods);

  const application = 'crossfit';

  var process = function(event) {
    console.log('process...');

    // message | postback - supported fb events
    if (event.message || event.postback) {
      preprocess(event);
    }

  }

  var preprocess = function(event) {
    console.log('preprocess...');
    var facebookId = event.sender.id;
    users.getUser(facebookId).then(function(snapshot) {
      var user = {};
      if (snapshot.exists()) { 
        console.log('user exists:')
        user = snapshot.val();
      } else {
        console.log('user doesnt exist');
      }
      processEvent(event, user);
    }).catch(function(error) {
      console.log('Error getting firebase user: ', error);
      processEvent(event, user);
    });
  }

  var processEvent = function(event, user) {
    console.log('process event');
    if (event.message) {
      processMessage(event, user);
    } else if (event.postback) {
      processPostback(event, user);
    } else {
      console.log("Webhook received unknown messagingEvent: ", event);
    }
  }

  var processPostback = function(event, user) {
    var facebookId = event.sender.id;
	  var payload = event.postback.payload;
    console.log('process postback: ', payload);
    
    switch(payload){

			case 'standby':
				introSequence.start(event);
			break;

			default:
        workoutSequence(event, user);
    }
  } 

  var processMessage = function(event, user) {
    var facebookId = event.sender.id;
    var message = event.message;
    var messageId = message.mid;
    var text = message.text;

    switch(text.toLowerCase()) {
      case 'wod':
        wodSequence.start(event);
      break;

      default:
    }

    // var messageAttachments = message.attachments;
    // var entities = message.nlp.entities;
    // var recipientId = event.recipient.id;
    // var timeOfMessage = event.timestamp;

    // console.log("sender: ", senderId);
    // console.log("message: ", message);
    // console.log("entities: ", entities);
  }

	return {
    process: process
	}
}