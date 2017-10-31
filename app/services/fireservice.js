'use strict';

var firebase = require("firebase-admin");

module.exports = function() {

	var admin = function() {
		// fire service account: firebase-adminsdk-681x8@johnnycrossfit-399db.iam.gserviceaccount.com
		var serviceAccount = require("../keys/johnnycrossfit-399db-firebase-adminsdk-681x8-1a0ee8cc34.json");
		var admin = firebase.initializeApp({
			credential: firebase.credential.cert(serviceAccount),
			databaseURL: "https://johnnycrossfit-399db.firebaseio.com"
		});
		console.log('app: ' + admin);
		return admin;
	}

	var database = function() {
		var serviceAccount = require("../keys/johnnycrossfit-399db-firebase-adminsdk-681x8-1a0ee8cc34.json");
		var admin = firebase.initializeApp({
			credential: firebase.credential.cert(serviceAccount),
			databaseURL: "https://johnnycrossfit-399db.firebaseio.com"
		});
		return admin.database();
	}

	return {
    admin: admin,
		database: database
  }

}



