'use strict';

var admin = require("firebase-admin");

module.exports = function() {

	var app = function() {
		// fire service account: firebase-adminsdk-681x8@johnnycrossfit-399db.iam.gserviceaccount.com
		var serviceAccount = require("../keys/johnnycrossfit-399db-firebase-adminsdk-681x8-1a0ee8cc34.json");
		var app = admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
			databaseURL: "https://johnnycrossfit-399db.firebaseio.com"
		});
		return app;
	}

	var receive = function(event) {
  };

	return {
    app: app
  }

}



