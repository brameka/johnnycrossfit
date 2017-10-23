var request = require('request');
var bot = require('../app/botservice')();

module.exports = function(app, router){

	var VALIDATION_TOKEN = "slay_me";

    router.get('/hook', function(req, res) {

	   	if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VALIDATION_TOKEN) {
		    console.log("Validating webhook");
		    res.status(200).send(req.query['hub.challenge']);
	  	} else {
		    console.error("Failed validation. Make sure the validation tokens match.");
		    res.sendStatus(403);          
	  	} 

    });

    router.post('/hook', function(req, res) {
    	var data = req.body;
			
		  if (data.object == 'page') {
		    data.entry.forEach(function(pageEntry) {
		      var pageID = pageEntry.id;
		      var timeOfEvent = pageEntry.time;

		      pageEntry.messaging.forEach(function(messagingEvent) {
		        if (messagingEvent.optin) {
		        	//console.log("Received option: ", messagingEvent);
		          //receivedAuthentication(messagingEvent);
		        } else if (messagingEvent.message) {
		        	bot.receive(messagingEvent);
		        } else if (messagingEvent.delivery) {
		          //receivedDeliveryConfirmation(messagingEvent);
		          //console.log("Received delivery: ", messagingEvent);
		        } else if (messagingEvent.postback) {
		          	bot.postback(messagingEvent);
		        } else {
		          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
		        }
		      });
		    });
		  }

		  res.sendStatus(200);
    });
}

