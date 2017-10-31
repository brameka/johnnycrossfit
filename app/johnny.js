'use strict';


var introSequence = require('./sequence/intro.sequence')();
var introSequence = require('./sequence/intro.sequence')();
var _ = require('lodash');

module.exports = function(users, database) {
  const application = 'crossfit';
  const sessions = {};

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
        users.createUser(facebookId);
      }
      processEvent(event, user);
    }).catch(function(error) {
      console.log('Error getting firebase user: ', error);
      users.createUser(facebookId);
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
				standby(event);
			break;

			default:
        selectWod(event, user);
    }
  } 

  var processMessage = function(event, user) {
    var facebookId = event.sender.id;
    var message = event.message;
    var messageId = message.mid;
    var text = message.text;

    // var messageAttachments = message.attachments;
    // var entities = message.nlp.entities;
    // var recipientId = event.recipient.id;
    // var timeOfMessage = event.timestamp;

    // console.log("sender: ", senderId);
    // console.log("message: ", message);
    // console.log("entities: ", entities);

    switch(text.toLowerCase()) {
      case 'wod':
        getWods(event);
      break;

      default:
    }
  }

  var standby = function(event) {
    console.log('calling standby');
    var facebookId = event.sender.id;
    users.createUser(facebookId);
    introSequence.start();
  }





  // get wods
  // var getWods = function(event) {
  //   var facebookId = event.sender.id;
	//   var message = event.message;
  //   var messageId = message.mid;
  //   var text = message.text;

  //   var elements = [];
  //   _.each([1,2,3,4,5], function(value) {
  //     elements.push(wods.getElement());
  //   });
  //   messenger.generic(facebookId, elements);
  // }

  // var selectWod = function(event, user) {
  //   var senderId = event.sender.id;
	//   var recipientId = event.recipient.id;
	//   var timeOfPostback = event.timestamp;
	//   var payload = event.postback.payload;
  // }

  // get Started
  

	return {
    process: process
	}
}