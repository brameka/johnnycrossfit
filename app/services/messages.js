'use strict';

module.exports = function() {

  var greeting = function(name) {
    var message = 'Hi ' + name + ', I\'m Johnny, I\'m pumped you found me...';
    return message;
  }

  var intro = function() {
    var message = ' I just no rep\'d my burpee muscle-up to msg u back...You want mouthwatering wods on demand??? Just say \'wod\' and I\'ll send you what';
  }

  return {
		greeting: greeting,
    intro: intro
	}
}