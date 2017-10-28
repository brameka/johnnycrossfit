'use strict';

module.exports = function() {

  var greeting = function(name) {
    var message = 'Hi ' + name + ', I\'m Johnny Crossfit and I just got no rep\'d mid thruster';
    return message;
  }

  return {
		greeting: greeting
	}
}