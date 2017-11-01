var messages = require('../serivces/messages')();
var messenger = require('../serivces/messenger')();
var _ = require('lodash');

module.exports = function(users, wods) {

  var start = function(event) {
    console.log('calling wod sequence start');
		messenger.startTyping();
    var facebookId = event.sender.id;
		
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
		
  }

  var greet = function(facebookId, name) {
		console.log('greet..');
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
			messenger.startTyping();
      setTimeout(intro(event), 4000);
    }).catch(function(error){
        console.log('error getting profile: ', error);
    });
  }

  var intro = function(facebookId) {
		console.log('intro..');
    var intro = messages.intro();
    var data = {
      recipient: {
        id: facebookId 
      },
      message: {
        text: intro
      }
    };
    messenger.send(data)
    .then(function(response){
        
    }).catch(function(error){
        console.log('error getting profile: ', error);
    });
  }

	return {
		start: start
	}

}
  