'use strict';

module.exports = function() {

  var greeting = function(name) {
    var message = 'Hi ' + name + ', I\'m Johnny, I just no rep\'d my burpee muscle-up to msg u back...';
    return message;
  }

  var intro = function() {
    var message = 'I\'ll give you a list of mouthwatering wods on demand whenever you say my name.'
  }

  return {
		greeting: greeting,
    intro: intro
	}
}