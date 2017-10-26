'use strict';

var request = require('request-promise');

module.exports = function() {
	const PAGE_ACCESS_TOKEN = 'EAABygwXeEvIBAAHZCB1oT9t6DL0TaCZBC518p61uKZAVxhZCuACmNeY8sqZBEIEkJgVJch9beSrFZCGyhbgspbmc9byWHyUG4aEP7ZATWDrFWEHxFBzAHinZB6biAbGgt3JVeHJcfVQqJGRz0zsTnQW7LZC9ZBOaCJ4GngYr8yBHifUAZDZD';
	const WIT_TOKEN = 'J65XVFFFIEHMXQT4PIQ6Q5V5C7TZGE65';
  const TYPING_ON = 'typing_on';
  const TYPING_OFF = 'typing_off';
  const sessions = {};

	var send = function(data){
		request({
		    uri: 'https://graph.facebook.com/v2.6/me/messages',
		    qs: { access_token: PAGE_ACCESS_TOKEN },
		    method: 'POST',
		    json: data

		  }).then(function(response, body){

			}).catch(function(err){

			});

			// , function (error, response, body) {
		  //   if (!error && response.statusCode == 200) {
		  //     var recipientId = body.recipient_id;
		  //     var messageId = body.message_id;
      //     //sendAction(recipientId, TYPING_OFF);
		  //   } else {
		  //     console.error("Unable to send message.");
		  //     console.error(response);
		  //     console.error(error);
		  //   }
		  // }


	}

	var action = function(facebookId, action){
		var data = {
		    recipient: {
		      id: facebookId
		    },
		    sender_action: action
		};
		send(data);
	}

	var profile = function(facebookId){
		return request({
			uri: 'https://graph.facebook.com/v2.6/' + facebookId,
			qs: { 
				fields: 'first_name,last_name,profile_pic,locale,timezone,gender', 
				access_token: PAGE_ACCESS_TOKEN 
			},
			method: 'GET',
			json: true
		});
	}

	return {
    send: send,
		action: action,
		profile: profile
  }
}