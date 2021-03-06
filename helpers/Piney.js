/* For common actions to https://liquidpineapple.com:3000 */

import React from 'react';
import PineyConstants from '../constants/PineyConstants'

	const Piney = {
		/// UserProfiles PUT
		///
		///
		userProfilesPut: function(accessToken,data) {
			/* data should be like this:
				{
					'id': id,			//optional. if null, creates new entry
					'user_id': userId,
					'user_name': userName,
					'picture': picture,
				}
			
			console.log('debug -- accessToken is ' + accessToken);
			console.log('debug -- data is ' + JSON.stringify(data));

			console.log('debug -- data.id is ' + data.ide
			console.log('debug -- data.userId is ' + data.userId);
			console.log('debug -- data.userName is ' + data.userName);
			console.log('debug -- data.picture is ' + data.picture);
			*/

			console.log('debug -- Piney userProfilesPut() data is ' + JSON.stringify(data));

			let bb = '';

			let a = data.id;
			let b = data.user_id;
			let c = data.name;
			let d = data.picture;

			if(a){
				bb = JSON.stringify({
					'id' : a,
					'user_id': b ? b : '',
					'user_name': c ? c : '',
					'picture': d ? d : ''
				})
			}
			else {
				bb = JSON.stringify({
					'user_id': b ? b : '',
					'user_name': c ? c : '',
					'picture': d ? d : ''
				});
			}

			console.log('debug -- Piney userProfilesPut() bb is ' + bb);

		  	let theUrl = 'https://liquidpineapple.com:3000/api/UserProfiles?access_token=' + accessToken;
		  	
		  	console.log('debug -- Piney userProfilesPut() theUrl is ' + theUrl);
		  	let x = fetch(theUrl,{
				method: 'PUT',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
				},
				body: bb
			})
			.then((response) => {
			console.log('debug -- userProfilesPut() response is ' + JSON.stringify(response));
			return response;
			})
			.catch((err) => {
			console.log('error was ' + err);
			return err;
			})

			console.log('x is ' + x);
			return x;
		},

		/// UserProfiles GET
		///
		///
		userProfilesGetById: function(accessToken,userId) {

			//where user_id = userId
			let theUrl = 'https://liquidpineapple.com:3000/api/UserProfiles?filter=%7B%22where%22%3A%7B%22user_id%22%3A%22'+ userId +'%22%7D%7D' + '&access_token=' + accessToken;
			let x = fetch(theUrl,{
				method: 'GET',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
				}
			})
			.then((response) => {
			//console.log('server response is ' + JSON.stringify(response));
			return response;
			})
			.catch((err) => {
			//console.log('error was ' + err);
			return err;
			})

			//console.log('x is ' + );
			return x;
		},

		/// BobaOrders GET
		///
		///
		bobaOrdersGet: function(accessToken,theId){


			//where id = theId
			let theUrl = 'https://liquidpineapple.com:3000/api/BobaOrders/' + theId + '&access_token=' + accessToken;
			//console.log('debug -- bobaOrdersGet theUrl is ' + theUrl);

			let x = fetch(theUrl,{
				method: 'GET',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
				}
			})
			.then((response) => {
			//console.log('debug -- bobaOrdersGet() is ' + JSON.stringify(response));
			return response.json();
			})
			.catch((err) => {
			//console.log('debug -- bobaOrdersGet.catch() error: ' + err);
			return err;
			})

			//console.log('x is ' + x);
			return x;

		},

		/// BobaOrders GET by id
		///
		///
		bobaOrdersGetById: function(accessToken,userId) {

			//console.log('debug -- bobaOrdersGetById userId is ' + userId);

			//where user_id = userId
			let theUrl = 'https://liquidpineapple.com:3000/api/BobaOrders?filter=%7B%22where%22%3A%7B%22user_id%22%3A%22'+ userId +'%22%7D%7D' + '&access_token=' + accessToken;
			//console.log('debug -- bobaOrdersGetById theUrl is ' + theUrl);

			let x = fetch(theUrl,{
				method: 'GET',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
				}
			})
			.then((response) => {
			//console.log('debug -- bobaOrdersGetById() is ' + JSON.stringify(response));
			return response.json();
			})
			.catch((err) => {
			//console.log('debug -- bobaOrdersGetById.catch() error: ' + err);
			return err;
			})

			//console.log('x is ' + x);
			return x;
		},

		/// BobaOrders GET by partition
		///
		///
		bobaOrdersGetByPartition: function(accessToken,data) {


			let e = PineyConstants.stationLinesPartition;
			let f = data.commentId

			let bb = '';

		  	let theUrl = encodeURI('https://liquidpineapple.com:3000/api/BobaOrders?access_token=' + accessToken + '&filter={"where":{"station_name":"' + e + '"}}');
		  	
		  	console.log('debug -- Piney bobaOrdersGetByPartition() theUrl is ' + theUrl);
		  	let x = fetch(theUrl,{
				method: 'GET',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
				},
				body: bb
			})
			.then((response) => {
			console.log('debug -- Piney bobaOrdersGetByPartition() response is ' + JSON.stringify(response));
			return response;
			})
			.catch((err) => {
			//console.log('error was ' + err);
			return err;
			})

			//console.log('x is ' + x);
			return x;
		},

		/// BobaOrders PUT
		///
		///
		bobaOrdersPut: function(accessToken,data) {
			/* data should be like this:
				{
					'id': id,			//optional. if null, creates new entry
					'name' : name,
					'user_id' : theUserId,
					'phone' : thePhone,
					'email' : theEmail,
					'order_accepted' : orderAccepted,
					'plus_one' : thePlusOne,
					'drink_pref' : theDrinkPref,
					'food_allergies' : theFoodAllergies
				}
			
			console.log('debug -- accessToken is ' + accessToken);
			console.log('debug -- data is ' + JSON.stringify(data));

			console.log('debug -- data.id is ' + data.id);
			console.log('debug -- data.userId is ' + data.userId);
			console.log('debug -- data.userName is ' + data.userName);
			console.log('debug -- data.picture is ' + data.picture);
			*/

			let bb = ''

			let a = data.id;
			let b = data.name;
			let c = data.theUserId;
			let d = data.thePhone;
			let e = data.theEmail;
			let f = data.orderAccepted;
			let g = data.thePlusOne;
			let h = data.theDrinkPref;
			let i = data.theFoodAllergies;

			if(a){
				bb = JSON.stringify({
					'id': a,			//optional. if null, creates new entry
					'name' : b ? b : '',
					'user_id' : c ? c : '',
					'phone' : d ? d : '',
					'email' : e ? e : '',
					'order_accepted' : f ? f : '',
					'plus_one' : g ? g : '',
					'drink_pref' : h ? h : '',
					'food_allergies' : i ? i : ''
				})
			}
			else {
				bb = JSON.stringify({
					'name' : b ? b : '',
					'user_id' : c ? c : '',
					'phone' : d ? d : '',
					'email' : e ? e : '',
					'order_accepted' : f ? f : '',
					'plus_one' : g ? g : '',
					'drink_pref' : h ? h : '',
					'food_allergies' : i ? i : ''
				});
			}


		  	let theUrl = 'https://liquidpineapple.com:3000/api/BobaOrders?access_token=' + accessToken;
		  	let x = fetch(theUrl,{
				method: 'PUT',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
				},
				body: bb
			})
			.then((response) => {
			console.log('debug -- bobaOrdersPut() response is ' + JSON.stringify(response));
			return response;
			})
			.catch((err) => {
			console.log('error was ' + err);
			return err;
			})

			console.log('x is ' + x);
			return x;
		},

		/// RiderComments PUT
		///
		///
		riderCommentsPut: function(accessToken,data) {

			/* data should be like this:
				{
					'id': id,			//optional. if null, creates new entry
					'user_id': userId,
					'user_name': userName,
					'comment_body': commentBody,
				}
			
			console.log('debug -- accessToken is ' + accessToken);
			console.log('debug -- data is ' + JSON.stringify(data));

			console.log('debug -- data.id is ' + data.id);
			console.log('debug -- data.userId is ' + data.userId);
			console.log('debug -- data.userName is ' + data.userName);
			console.log('debug -- data.commentBody is ' + data.commentBody);
			console.log('debug -- PineyConstants.stationLinesPartition is ' + PineyConstants.stationLinesPartition);
			console.log('debug -- Date.now() is ' + Date.now());
			*/

			let a = data.id;
			let b = data.userId;
			let c = data.userName;
			let d = data.commentBody;
			let e = data.stationName;
			let f = PineyConstants.stationLinesPartition;

			let bb = '';

			if(a){
				bb = JSON.stringify({
					'id': a,
					'user_id': b ? b : '',
					'user_name': c ? c : '',
					'comment_body': d ? d : '',
					'station_name': e ? e : f,		//if not set, use the stationLinesPartition
					'station_lines': f,
					'station_uid' : f,
					'comment_on_line' : f,
					'status' : f,
					'timestamp': Date.now()
				})
			}
			else {
				bb = JSON.stringify({
					'user_id': b ? b : '',
					'user_name': c ? c : '',
					'comment_body': d ? d : '',
					'station_name': e,
					'station_lines': f,
					'station_uid' : f,
					'comment_on_line' : f,
					'status' : f,
					'timestamp': Date.now()
				});
			}

			console.log('debug -- Piney.riderCommentsPut() bb is ' + bb);

		  	let theUrl = 'https://liquidpineapple.com:3000/api/RiderComments?access_token=' + accessToken;
		  	let x = fetch(theUrl,{
				method: 'PUT',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
				},
				body: bb
			})
			.then((response) => {
			console.log('debug -- riderCommentsPut() response is ' + JSON.stringify(response));
			response.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
			//console.log('error was ' + err);
			return err;
			})
		},

		/// RiderComments GET by partition
		///
		///
		riderCommentsGetByPartition: function(accessToken,data) {


			let e = PineyConstants.stationLinesPartition;

			let bb = '';

		  	let theUrl = encodeURI('https://liquidpineapple.com:3000/api/RiderComments?access_token=' + accessToken + '&filter={"where":{"station_name":"' + e + '"},"order":"timestamp DESC"}');
		  	let x = fetch(theUrl,{
				method: 'GET',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
				},
				body: bb
			})
			.then((response) => {
			//console.log('debug -- riderCommentsGet() response is ' + JSON.stringify(response));
			return response;
			})
			.catch((err) => {
			//console.log('error was ' + err);
			return err;
			})

			//console.log('x is ' + x);
			return x;
		},

		/// RiderComments GET by partition and paginate
		///
		///
		riderCommentsGetByPartitionPaginate: function(accessToken,data,theLimit,theSkip) {


			let e = PineyConstants.stationLinesPartition;

			let bb = '';

		  	let theUrl = encodeURI('https://liquidpineapple.com:3000/api/RiderComments?access_token=' + accessToken + '&filter={"where":{"station_name":"vfx924k"},"order":"timestamp DESC","limit":'+theLimit+',"skip":'+theSkip+'}');
		  	let x = fetch(theUrl,{
				method: 'GET',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
				},
				body: bb
			})
			.then((response) => {
			//console.log('debug -- riderCommentsGetByPartitionPaginate() response is ' + JSON.stringify(response));
			return response;
			})
			.catch((err) => {
			//console.log('error was ' + err);
			return err;
			})

			//console.log('x is ' + x);
			return x;
		},

		/// RiderComments GET my last
		///
		///
		riderCommentsFindMyLast: function(accessToken,data) {

			/* data should be like this:
				{
					'user_id': userId,
				}
			
			console.log('debug -- data.userId is ' + data.userId);
			*/

			let b = data.userId;
			let theFilter = '%7B%22where%22%3A%7B%22user_id%22%3A%22' + data.userId + '%7D%2C%22order%22%3A%22id%20DESC%22%7D';
			//let theFilter = "%7B%22where%22%3A%7B%22user_id%22%3A%22" + b + "%7D%2C%22order%22%3A%22id%20DESC%22%7D%0A";
			//console.log('debug -- riderCommentsFindMyLast() accessToken is ' + accessToken);
			//console.log('debug -- riderCommentsFindMyLast() data.userId is ' + data.userId);
			//console.log('debug -- riderCommentsFindMyLast() theFilter is ' + theFilter);
			/*
				{"where":{"user_id":"5D892243-D552-4731-AEE4-9EF4E93CFACA"},"order":"id DESC"}
				https://meyerweb.com/eric/tools/dencoder/

			*/

		  	let theUrl = encodeURI('https://liquidpineapple.com:3000/api/RiderComments/FindOne?access_token=' + accessToken + '&filter=' 
		  	+ '{"where":{"user_id":"' + data.userId + '"},"order":"id DESC"}');
		  	//console.log('debug -- riderCommentsFindMyLast() theUrl is ' + theUrl)
		  	//let theUrl = 'https://liquidpineapple.com:3000/api/RiderComments/FindOne?access_token=YTf7xWE1s9qt34YdUyK2ZJrb3qdXDWpPCgFFZWUERe9Tq7bovknIQw0It25MizDB&filter=%7B%22where%22%3A%7B%22user_id%22%3A%225D892243-D552-4731-AEE4-9EF4E93CFACA%22%7D%2C%22order%22%3A%22id%20DESC%22%7D'
		  	let x = fetch(theUrl,{
				method: 'GET',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
				},
			})
			.then((response) => {
			//console.log('debug -- riderCommentsFindMyLast() response is ' + JSON.stringify(response));
			return response;
			})
			.catch((err) => {
			//console.log('error was ' + err);
			return err;
			})

			//console.log('x is ' + x);
			return x;
		},

		/// RiderComments GET last
		///
		///
		riderCommentsFindLast: function(accessToken) {


		  	let theUrl = encodeURI('https://liquidpineapple.com:3000/api/RiderComments/FindOne?access_token=' + accessToken + '&filter={"order":"id DESC"}');
		  	console.log('debug -- Piney riderCommentsFindLast() theUrl is ' + theUrl)
		  	//let theUrl = 'https://liquidpineapple.com:3000/api/RiderComments/FindOne?access_token=YTf7xWE1s9qt34YdUyK2ZJrb3qdXDWpPCgFFZWUERe9Tq7bovknIQw0It25MizDB&filter=%7B%22where%22%3A%7B%22user_id%22%3A%225D892243-D552-4731-AEE4-9EF4E93CFACA%22%7D%2C%22order%22%3A%22id%20DESC%22%7D'
		  	let x = fetch(theUrl,{
				method: 'GET',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
				},
			})
			.then((response) => {
			//console.log('debug -- riderCommentsFindLast() response is ' + JSON.stringify(response));
			return response;
			})
			.catch((err) => {
			//console.log('error was ' + err);
			return err;
			})

			//console.log('x is ' + x);
			return x;
		},

		/// CommentEvents GET by partition
		///
		///
		commentEventsGetByPartition: function(accessToken,data) {


			let e = PineyConstants.stationLinesPartition;
			let f = data.commentId

			let bb = '';

		  	let theUrl = encodeURI('https://liquidpineapple.com:3000/api/CommentEvents?access_token=' + accessToken + '&filter={"where":{"station_name":"vfx924k","comment_id":"' + f + '"},"order":"timestamp ASC"}');
		  	
		  	//console.log('debug -- Piney commentEventsGetByPartition() theUrl is ' + theUrl);
		  	let x = fetch(theUrl,{
				method: 'GET',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
				},
				body: bb
			})
			.then((response) => {
			//console.log('debug -- commentEventsGet() response is ' + JSON.stringify(response));
			return response;
			})
			.catch((err) => {
			//console.log('error was ' + err);
			return err;
			})

			//console.log('x is ' + x);
			return x;
		},

		/// CommentEvents PUT
		///
		///
		commentEventsPost: function(accessToken,data){

			let a = data.commentId;
			let b = data.commentUserId;
			let c = data.commentUserName;
			let d = data.eventName;
			let e = data.eventUserId;
			let f = data.eventUserName;
			let g = data.eventBody;
			let h = PineyConstants.stationLinesPartition;

			let bb = JSON.stringify({

				'comment_id': a ? a : '',
				'comment_user_id': b ? b : '',
				'comment_user_name': c ? c : '',
				'event_name': d ? d : '',
				'event_user_id': e ? e : '',
				'event_user_name': f ? f : '',
				'event_body': g ? g : '',
				'timestamp': Date.now(),
				'station_name': h,
				'riderCommentId': h
			})


			//console.log('debug -- Piney.commentEventsPost() bb is ' + bb);

		  	let theUrl = 'https://liquidpineapple.com:3000/api/CommentEvents?access_token=' + accessToken;
		  	let x = fetch(theUrl,{
				method: 'POST',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
				},
				body: bb
			})
			.then((response) => {
			//console.log('debug -- commentEventsPost() response is ' + JSON.stringify(response));
			response.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
			//console.log('error was ' + err);
			return err;
			})
		},

		commentEventsPut: function(accessToken,data){

			let xx = data.commentEventId;

			let a = data.commentId;
			let b = data.commentUserId;
			let c = data.commentUserName;
			let d = data.eventName;
			let e = data.eventUserId;
			let f = data.eventUserName;
			let g = data.eventBody;

			let h = PineyConstants.stationLinesPartition;
			let hh = data.stationName;


			let bb = JSON.stringify({
				'id' : xx ? xx : '',
				'comment_id': a ? a : '',
				'comment_user_id': b ? b : '',
				'comment_user_name': c ? c : '',
				'event_name': d ? d : '',
				'event_user_id': e ? e : '',
				'event_user_name': f ? f : '',
				'event_body': g ? g : '',
				'timestamp': Date.now(),
				'station_name': hh ? hh : h,
				'riderCommentId': h
			})


			//console.log('debug -- Piney.commentEventsPut() bb is ' + bb);

		  	let theUrl = 'https://liquidpineapple.com:3000/api/CommentEvents?access_token=' + accessToken;
		  	let x = fetch(theUrl,{
				method: 'PUT',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
				},
				body: bb
			})
			.then((response) => {
			//console.log('debug -- commentEventsPut() response is ' + JSON.stringify(response));
			response.json();
			})
			.then((data) => {
				return data;
			})
			.catch((err) => {
			//console.log('error was ' + err);
			return err;
			})

			return x;
		},

		/// RiderComments/{id}/CommentEvents GET

		riderCommentsCommentEventsGet: function(accessToken,theId){

		  	let theUrl = encodeURI(
		  		'https://liquidpineapple.com:3000/api/RiderComments/' 
		  		+ theId 
		  		+ '/commentEvents?access_token=' 
		  		+ accessToken
		  	 	+ '&filter={"where":{"station_name":"'
		  	 	+ PineyConstants.stationLinesPartition
		  	 	+ '"}}'
		  	);

		  	console.log('debug -- Piney riderCommentsCommentEventsGet theUrl is ' + theUrl );

		  	let x = fetch(theUrl,{
				method: 'GET',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json',
				}
			})
			.then((response) => {
			//console.log('debug -- bobaOrdersGetById() is ' + JSON.stringify(response));
			return response.json();
			})
			.catch((err) => {
			//console.log('debug -- bobaOrdersGetById.catch() error: ' + err);
			return err;
			})

			//console.log('x is ' + x);
			return x;

		}


	}

	export default Piney;

	

