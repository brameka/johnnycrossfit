// server.js
//https://warm-ridge-63912.herokuapp.com/api
//Page Access Token: EAAaDHWRZB0PwBAGyispIL3t25gWjAvkZC4i8Pt6uFTG4tEQppeM2C6e6zqZCW68qUImrHpkkR1b1SiDkMC2OvWjvuS4m3ZCBAyZBjf0dktAi87frvaaXtAYU0ZB9NT4SjlTsxjs3SiNYNlaRjI9ftgLUOPfXeGQnD9KYQ6heNowgZDZD




// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var firebase   = require('./app/fireservice')();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8098;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
var database = firebase.database();
var webhooks = require("./routes/webhooks")(app, router, database);

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'A bot that doesnt suck' });   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);


//logging
//http://stackoverflow.com/questions/2671454/heroku-how-to-see-all-the-logs
//heroku logs -n 1500
//heroku logs --tail

//https://wit.ai/docs/quickstart