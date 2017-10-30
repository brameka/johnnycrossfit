'use strict';

module.exports = function(db) {

	var getWod = function(id) {
		var ref = db.ref('wods/' + id);
		return ref.once('value');
	}
	
	var getRandomWods = function(count) {
		var ref = db.ref('wods');
		
		// order -> query
		// orderByChild('name').equalTo('hulk');
		//startAt('')
		//endAt('')
		//limitToFirst(10)
		//limitToLast(10)

		return ref.once('value');
	};

	var getWodByTag = function(tag) {

	}

	var getWodByTags = function(tags) {

	}

	return {
		getRandomWods: getRandomWods,
		getWodByTag: getWodByTag,
		getWodByTags: getWodByTags
	}
}