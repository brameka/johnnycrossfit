'use strict';

var fire = require('../app/fireservice')();

module.exports = function() {

  const PAGE_ACCESS_TOKEN = 'EAARF62yuwKgBALGMevxwZAh1HWoZBmw3at6iC7qLwnMiXWq7ukVzLAs4d5cBucyrVHWEcJeBEr9Xz2ohccHjbN22a8PHPOoOHtuKDxfcFMiLHCZCNgat8F2M4UWbC8KdLZAllzxHGwZAF4g147rPHdjfNxI91MFu2EFTfiBEm6AZDZD';
  const WIT_TOKEN = 'J65XVFFFIEHMXQT4PIQ6Q5V5C7TZGE65';

  var process = function(data){
    switch(data.intent){
        // case 'generic'
        //   generic(data);
        //   break;

        case 'greeting':
          greeting(data);
        break;

        case 'booking':
          booking(data);
        break;
        
        case 'cancellation':
          cancellation(data);
        break;
        
        case 'settings':
          settings(data);
        break;

        default:
    }
  }

  var greeting = function(data) {

  }

  var onboarding = function(data) {

  }

  var booking = function(data) {

  }

  var cancellation = function(data) {

  }

  var settings = function(data) {

  }

  var generic = function(data) {

  }

  return {
    process: process
  }

}