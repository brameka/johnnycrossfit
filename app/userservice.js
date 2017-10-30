'use strict';

module.exports = function(db) {

	var getUsers = function(facebookId) {
		var ref = db.ref('users');
		return ref.once('value');
	}

	var getUser = function(facebookId) {
		var ref = db.ref('users/' + facebookId);
		return ref.once('value');
	}

	var createUser = function(facebookId, data) {
		console.log('calling create user');
		db.ref('users/' + facebookId).set(data);
		console.log('after create user');
	}

	var updateUser = function(facebookId) {
		var uid = 2;
		
		// the data for the object being created/updated.
		var user = {
				name: "Luis",
				twitter: "@luisgo"
		};

		// attempt to get the child in the collection by uid.
		db.ref().child('users').child(facebookId).once('value', function(snapshot){
				// if data exists
				if (snapshot.exists()) {
						// get the ref (in this case /users/2) and update its contents
						snapshot.ref().update(user);
				} else {
						// data does not exist so we wrap the data in an object with
						// a member named after the uid so we can pass it as an update
						// to the parent.
						var payload = {};
								payload[uid] = user;
						// get the ref's parent and call update on it.
						snapshot.ref().parent().update(payload);
				}
		});
	}

	return {
    getUser: getUser,
		getUsers: getUsers,
		createUser: createUser
  }

}



