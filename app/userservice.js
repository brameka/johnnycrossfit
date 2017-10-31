'use strict';
var messenger = require('./messenger')();
module.exports = function(db) {

	var getUsers = function(facebookId) {
		var ref = db.ref('users');
		return ref.once('value');
	}

	var getUser = function(facebookId) {
		var ref = db.ref('users/' + facebookId);
		return ref.once('value');
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

	var createUser = function(facebookId) {
		getFbProfileAndCreateUser(facebookId);
	}

	var createFirebaseUser = function(facebookId, data) {
		console.log('calling create user');
		db.ref('users/' + facebookId).set(data);
		console.log('after create user');
	}

	var getFbProfileAndCreateUser = function(facebookId) {
    messenger.profile(facebookId)
      .then(function(response){
        console.log('response from messenger profile in create user');
        var firstname = response.first_name;
        var data = {
          firstname: response.first_name,
          lastname: response.last_name,
          profile_pic: response.profile_pic,
          gender: response.gender,
          locale: response.locale,
          timezone: response.timezone,
          context: {
            topic: application
          }
        }
        createFirebaseUser(facebookId, data);
      }).catch(function(error){
        console.log('error getting profile: ', error);
      });
  }

	return {
    getUser: getUser,
		getUsers: getUsers,
		createUser: createUser
  }

}



