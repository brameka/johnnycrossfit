'use strict';

module.exports = function() {

	var getUser = function(db, facebookId) {
		var ref = db.ref('users/' + facebookId);
		return ref.once('value');
	}

	var createUser = function(db, facebookId) {
		var users = db.ref('users/' + facebookId).set({
			name: 'bronr'
		});
	}

	return {
    getUser: getUser,
		createUser: createUser
  }

}



