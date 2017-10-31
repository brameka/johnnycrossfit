'use strict';

var messenger = require('./messenger')();
var messages = require('./messages')();
var _ = require('lodash');

module.exports = function(users, wods) {
  const application = 'crossfit';
  const sessions = {};

  var process = function(event) {
    console.log('process...');
    if (event.message || event.postback) {
      preprocess(event);
    } else {
      console.log("Webhook received unknown messagingEvent: ", event);
    }
  }

  var preprocess = function(event) {
    console.log('preprocess...');
    var facebookId = event.sender.id;
    getUser(facebookId).then(function(snapshot) {
      var user = {};
      if (snapshot.exists()) { 
        console.log('user exists:')
        user = snapshot.val();
      } else {
        console.log('user doesnt exist');
        createUser(facebookId);
      }
      processEvent(event, user);
    }).catch(function(error) {
      console.log('Error getting firebase user: ', error);
      createUser(facebookId, {});
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

  // get wods
  var getWods = function(event) {
    var facebookId = event.sender.id;
	  var message = event.message;
    var messageId = message.mid;
    var text = message.text;

    // get 5 random wods from categories
    var elements = [];
    _.each([1,2,3,4,5], function(value) {
      elements.push(wods.getElement());
    });
    messenger.generic(facebookId, elements);
  }

  var selectWod = function(event, user) {
    var senderId = event.sender.id;
	  var recipientId = event.recipient.id;
	  var timeOfPostback = event.timestamp;
	  var payload = event.postback.payload;

    // set context
    // 

  }

  // get Started
  var standby = function(event) {
    console.log('calling standby');
    var facebookId = event.sender.id;
    messenger.startTyping(facebookId);
    start(event);
  }

	var start = function(event) {
    console.log('calling start');
    var facebookId = event.sender.id;
    createUser(facebookId);
    messenger.profile(facebookId)
      .then(function(response){
        console.log('response from messenger profile');
        var firstname = response.first_name;
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

  //user management
  var getUser = function(facebookId) {
    return users.getUser(facebookId);
  }

  var createUser = function(facebookId) {
    messenger.profile(facebookId)
      .then(function(response){
        console.log('response from messenger profile');
        var firstname = response.first_name;
        var data = {
          firstname: response.first_name,
          lastname: response.last_name,
          profile_pic: response.profile_pic,
          gender: response.gender,
          locale: response.locale,
          timezone: response.timezone,
          context: {
            topic: application
          }
        }
        users.createUser(facebookId, data);
      }).catch(function(error){
        console.log('error getting profile: ', error);
      });
  }

	return {
    process: process
	}
}