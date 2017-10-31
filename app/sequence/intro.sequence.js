var messages = require('../serivces/messages')();
var messenger = require('../serivces/messenger')();
var _ = require('lodash');

module.exports = function(users) {

	var pumpedAttachmentId = '544081972605619';

  var start = function(event) {
    console.log('calling start');
		messenger.startTyping();
    var facebookId = event.sender.id;
		users.createUser(facebookId);
    profile(facebookId);
  }

	var profile = function(facebookId) {
		messenger.profile(facebookId)
      .then(function(response){
        console.log('response from messenger profile');
        var firstname = response.first_name;
				setTimeout(greet(facebookId, firstname), 4000);
      }).catch(function(error){
        console.log('error getting profile: ', error);
      });
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
			postPumpedImage(facebookId);
    }).catch(function(error){
        console.log('error getting profile: ', error);
    });
  }

	var postPumpedImage = function(facebookId) {
		var data = {
      recipient: {
        id: facebookId 
      },
      message: {
        attachment: {
					type: image,
					payload: {
						attachment_id: 'pumpedAttachmentId'
					}
				}
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
  