var messages = require('../serivces/messages')();
var messenger = require('../serivces/messenger')();
var _ = require('lodash');

module.exports = function(users, wods) {

  var start = function(event) {
    console.log('workout sequence start');
	messenger.startTyping();
    var facebookId = event.sender.id;
  }

  var greet = function(facebookId, name) {
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

    return {
        start: start
    }

}
  