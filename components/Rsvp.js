//Base imports

import React from 'react';
import { 
	Text,
	View,
	ScrollView,
	Image,
	AsyncStorage
} from 'react-native';
import { 
	FormLabel,
	FormInput,
	FormValidationMessage,
	Button
} from 'react-native-elements';
import {
	EventRegister
} from 'react-native-event-listeners';

export class Rsvp extends React.Component {

	constructor(props) {
	    super(props);

	    this.state = {
	      name: null,
	      user_id: null,
	      plus_one: null,
	      food_allergies: null,
	      drink_pref: null,
	      id: null,

	      data: "Rsvp data string",
	      accessKey: "No Access Key set"

	    }
	}

	getUUID(){
		let x = Expo.Constants.deviceId
		console.log(x);
		return x;
	}

	getTimeStamp(){
		return Date.now();
	}

	getDefaultPic(theUuid){

		let baseUrl = 'https://liquidpineapple.com/api/UserPictures/picture/download/';
		return  baseUrl + theUuid + '.jpeg'
	}

	putNewInfo(x,theUuid){
		//posts info from this.state

		console.log('x is ' + JSON.stringify(x));

		let theBody = {};

		//If this Guest's device is already in the database, Update info
		if(x.id){
			theBody = JSON.stringify({
				'name': x.name,
				'user_id': Expo.Constants.deviceId,
				'plus_one': x.plus_one,
				'drink_pref': x.drink_pref,
				'food_allergies': x.food_allergies,
				'id' : x.id
			});
		}
		//Else Create it 
		else theBody = JSON.stringify({
				'name': x.name,
				'user_id': Expo.Constants.deviceId,
				'plus_one': x.plus_one,
				'drink_pref': x.drink_pref,
				'food_allergies': x.food_allergies
		})

		//debug
		console.log('theBody is ' + JSON.stringify(theBody));

		//Set up the request data
		let url = 'https://liquidpineapple.com:3000/api/BobaOrders';
		let theMethod = 'PUT';
		let theHeaders = {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json',
		};

		//Attempt to fetch
		fetch(url, {
			method: theMethod,
			headers: theHeaders,
			body: theBody
		})
		.then((response) => response.json())
		.then((response) => {
		  let printy = JSON.stringify(response);
		  console.log('putNewInfo() returned ' + printy);

		  //Return response
		  return response;
		})

		//catch() if error
		.catch(() => {
		  console.log('catch() was triggered')
		})
	}

	componentWillMount(){

		//Set up data
		//Currently using access token from forrest, will need to make dynamic
		let url = 'https://liquidpineapple.com:3000/api/BobaOrders?filter=%7B%22where%22%3A%7B%22user_id%22%3A%22'+ Expo.Constants.deviceId +'%22%7D%7D' + '&access_token=' + this.state.accessKey;

		let theMethod = 'GET';
		let theHeaders = {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json',
		};

		//Attempt the fetch
		fetch(url, {
			method: theMethod,
			headers: theHeaders
		})
		.then((response) => response.json())
		.then((response) => {

			//Should only return 1-item array
			console.log('response[0] is ' + JSON.stringify(response[0]));
			return response[0];
		})

		//Set the data into state
		.then((response) => this.setState(response))

		//catch() if error
		.catch(() => {
		  console.log('catch() was triggered')
		})


		//EventRegister > myCustomEvent
		this.listener = EventRegister.addEventListener('myCustomEvent', (data) => {
            this.setState({
                data,
            })
        })


		//EventRegister > setAccessKey
        this.listener = EventRegister.addEventListener('setAccessKey', (accessKey) => {
            this.setState({
                accessKey,
            })
        })
	}

	componentWillUnmount(){

	}

	render() {

		//If access key is invalid, roadblock with EnterAccessKey
	    if(!this.state.accessKey){
	      return(
	        <EnterAccessKey />
	      );
	    }
	    //Else free to proceed
	    else{
		    return (
		    	<View style={{
		    		//flex: 1,
			        //flexDirection: 'column',
					//justifyContent: 'space-between',
					//alignItems: 'center',
					//backgroundColor: 'powderblue', //debug color
					justifyContent: 'space-around',
					height: '100%'
					//paddingLeft: '15%',
					//paddingRight: '15%'
		        }}>
		        	<View style={{
		        		flexDirection: 'column',
		        		alignItems: 'center'
		        	}}>
		        		<Button
							rounded
							icon={{
								type: 'font-awesome',
								name: 'leaf'}}
							title='Emit'
							onPress={(props)=> EventRegister.emit('myCustomEvent','it works!!!')}
						/>
						<Text>
		               {this.state.data}
		               </Text>
		               <Text>
		               {this.state.accessKey}
		               </Text>

		        		<Image
		                 style={{
		                   paddingVertical: 30,
		                   width: 150,
		                   height: 150,
		                   borderRadius: 75
		                 }}
		                 resizeMode='cover'
		                 source={{
		                  uri: 'https://randomuser.me/api/portraits/men/37.jpg'
		                 }}
		                 onPress={() => console.log('this state is ' + JSON.stringify(this.state))}
		               />
		        	</View>
		        	<View style={{
		        		//backgroundColor: 'cyan',	//debug color
		        	}}>
						<FormLabel
							labelStyle={{
								color: 'rgba(178,158,7,1.0)'
							}}
						>Name</FormLabel>
							<FormInput
							placeholder='e.g. Braddah Kimo'
							onChangeText={(text) => this.setState({
								name: text
							})}
							value={this.state.name}
							/>

						<FormLabel
							labelStyle={{
								color: 'rgba(178,158,7,1.0)'
							}}
						>Your Date</FormLabel>
							<FormInput
							placeholder="Original Guest or Plus One's Name"
							onChangeText={(text) => this.setState({
								plus_one: text
							})}
							value={this.state.plus_one}
							/>
							

						<FormLabel
							labelStyle={{
								color: 'rgba(178,158,7,1.0)'
						}}>Food allergies/lifestyle</FormLabel>
							<FormInput
							placeholder='We will try to accomodate you!'
							onChangeText={(text) => this.setState({
								food_allergies: text
							})}
							value={this.state.food_allergies}
							/>

						<FormLabel
							labelStyle={{
								color: 'rgba(178,158,7,1.0)'
						}}>Drink Preferences</FormLabel>
							<FormInput
							placeholder='e.g. Beer and Old Fashioneds'
							onChangeText={(text) => this.setState({
								drink_pref: text
							})}
							value={this.state.drink_pref}
							/>
					</View>
					<View style={{
						//backgroundColor: 'green', //debug color
					}}>
					<Button
						rounded
						icon={{
							type: 'font-awesome',
							name: 'leaf'}}
						title='Submit'
						onPress={()=> this.putNewInfo(this.state, Expo.Constants.deviceId)}
					/>
					<Button
						rounded
						icon={{
							type: 'font-awesome',
							name: 'leaf'}}
						title='Clear @ShukForrestWedding:userToken'
						onPress={() => this.anotherSignOut()}
					/>
					<Button
						rounded
						icon={{
							type: 'font-awesome',
							name: 'leaf'}}
						title='Nav To Map'
						onPress={() => this.navigation.navigate('SuperMapStack')}
					/>
					</View>
		        </View>
		    );
		}
	}
	_signOutAsync = async () => { 
		await AsyncStorage.removeItem('@ShukForrestWedding:userToken');
	    this.props.navigation.navigate('Auth');
	  };

	anotherSignOut(){
		AsyncStorage.removeItem('@ShukForrestWedding:userToken')
		.then(() => {
			console.log('AsyncStorage.removeItem(..) passed');
			this.props.navigation.navigate('Auth');
		})
		.catch(() => {
			console.log('catch() was run');
		})
	}
}

/** Error Message Template

	<FormValidationMessage>Error message</FormValidationMessage>

**/