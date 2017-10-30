

module.exports = function(app, router, database){

	var users = require('../app/userservice')(database);
	var wods = require('../app/wodservice')(database);
	var johnny = require('../app/johnny')(users, wods);

	var VALIDATION_TOKEN = "murph_grace_jackie_johnny";

		router.get('/test/postback', function(req, res) {
			var data = {
				sender: {
					id: '1486936298049783',
				},
				recipient: {
					id: '1486936298049783',
				},
				timestamp: '12345',
				postback: {
					payload: 'standby'
				}
			};

			johnny.postback(data);
			res.status(200).send('test');
		});

		router.get('/users/create', function(req, res) {
			users.createUser('fb222');
			res.status(200).send('test');
		});

		router.get('/users/all', function(req, res) {
			users.getUsers().then(function(snapshot) {
				res.status(200).send(snapshot.val());
			}).catch(function(error) {
				res.status(404).send('something went wrong with the fb query');
			})
		});

		router.get('/users/fb222', function(req, res) {
			users.getUser('fb222').then(function(snapshot) {
				res.status(200).send(snapshot.val());
			}).catch(function(error) {
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
		      
					// var pageID = pageEntry.id;
		      // var timeOfEvent = pageEntry.time;

		      pageEntry.messaging.forEach(function(event) {
		        if (event.optin) {
		        	//console.log("Received option: ", messagingEvent);
		          //receivedAuthentication(messagingEvent);
		        } else if (event.message) {
		        	johnny.receive(event);
		        } else if (event.delivery) {
		          //receivedDeliveryConfirmation(messagingEvent);
		          //console.log("Received delivery: ", messagingEvent);
		        } else if (event.postback) {
		          johnny.postback(event);
		        } else {
		          console.log("Webhook received unknown messagingEvent: ", event);
		        }
		      });
		    });
		  }
		  res.sendStatus(200);
    });
}

