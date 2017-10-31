var messages = require('../messages')();
var messenger = require('../messenger')();
var _ = require('lodash');

module.exports = function() {

  var start = function(event) {
    console.log('calling start');
		messenger.startTyping();
    var facebookId = event.sender.id;
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
  