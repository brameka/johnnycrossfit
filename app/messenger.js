'use strict';

var request = require('request-promise');

module.exports = function() {
	const PAGE_ACCESS_TOKEN = 'EAABygwXeEvIBAAHZCB1oT9t6DL0TaCZBC518p61uKZAVxhZCuACmNeY8sqZBEIEkJgVJch9beSrFZCGyhbgspbmc9byWHyUG4aEP7ZATWDrFWEHxFBzAHinZB6biAbGgt3JVeHJcfVQqJGRz0zsTnQW7LZC9ZBOaCJ4GngYr8yBHifUAZDZD';
  	const WIT_TOKEN = 'J65XVFFFIEHMXQT4PIQ6Q5V5C7TZGE65';
  	const TYPING_ON = 'typing_on';
  	const TYPING_OFF = 'typing_off';
  	const sessions = {};

	var send = function(data){
		return request({
			uri: 'https://graph.facebook.com/v2.6/me/messages',
			qs: { access_token: PAGE_ACCESS_TOKEN },
			method: 'POST',
			json: data
		});
	}

	var action = function(facebookId, action){
		var data = {
		    recipient: {
		      id: facebookId
		    },
		    sender_action: action
		};
		return send(data);
	}

	var profile = function(facebookId) {
		console.log('calling messenger profile');
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

	var postAttachment = function(facebookId, type, attachmentId) {
		var data = {
		    recipient: {
		      id: facebookId
		    },
				message: {
					attachment: {
						type: type,
						payload: {
							attachment_id: attachmentId
						}
					}
				}
		};
		return send(data);
	}

	var generic = function(facebookId, elements) {
		var data = {
			recipient: {
				id: facebookId
			},
			message: {
				attachment: {
					type: 'template',
					payload: {
						template_type: 'generic',
						elements: elements
					}
				}
			}
		}
		send(data);
	}

	var startTyping = function(facebookId) {
		action(facebookId, TYPING_ON);
	};

	var stopTyping = function(facebookId) {
		action(facebookId, TYPING_OFF);
	};

	return {
    send: send,
		action: action,
		profile: profile,
		generic: generic,
		stopTyping: stopTyping,
		startTyping: startTyping
  }
}