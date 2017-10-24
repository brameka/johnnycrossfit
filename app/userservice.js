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

	var createUser = function(facebookId) {
		var users = db.ref('users/' + facebookId).set({
			name: 'test'
		});
	}

	return {
    getUser: getUser,
		getUsers: getUsers,
		createUser: createUser
  }

}



