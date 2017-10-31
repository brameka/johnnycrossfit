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

	var getElement = function(wod) {
		return {
			title: 'HERO - Murph',
			subtitle: 'Death By EMOM,\n7 Pull-ups,\n7 Thrusters 35/25kg,\n7 Burpees',
			item_url: 'http://crossfitkumba.com/wp-content/uploads/2014/07/crossfit-kumba-box.jpg',
			buttons: [
				{
				type: 'postback',
				title: 'I Want Some',
				payload: 'wodId'
				},
				{
				type: 'postback',
				title: 'More Like This',
				payload: 'category'
				},
				{
				type: 'element_share'
				}]
			};
	}

	return {
		getRandomWods: getRandomWods,
		getWodByTag: getWodByTag,
		getWodByTags: getWodByTags,
		getElement: getElement
	}
}