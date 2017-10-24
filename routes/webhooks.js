var request = require('request');
var bot = require('../app/botservice')();
var users = require('../app/userservice')();

module.exports = function(app, router, database){

	var VALIDATION_TOKEN = "slay_me";

		router.get('/users', function(req, res) {
			users.createUser(database, 'fb111');
			res.status(200).send('test');
		});

		router.get('/get-user', function(req, res) {
			// users.getUser(database, 'fb111').then(function(snapshot){
			// 	res.status(200).send(snapshot.val());
			// })
			var ref = database.ref('users').once('value').then(function(snapshot){
				res.status(200).send(snapshot.val());
			}).catch(function(error){
				res.status(404).send('something went wrong with the fb query');
			})
		});

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

