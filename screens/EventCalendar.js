import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  KeyboardAvoidingView,
  AsyncStorage,
  Alert
} from 'react-native';
import {
  Button,
  FormLabel,
  FormInput,
  Icon
} from 'react-native-elements';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import { EventRegister } from 'react-native-event-listeners';
import LoadingOverlay from '../components/LoadingOverlay';


export default class EventCalendar extends React.Component {
  static navigationOptions = {
    title: 'The Big Day',
  };

  //constructor
    constructor(props) {
      super(props);

      this.state = {
        fetchIsLoading: false
      }
    }

    componentWillMount() {

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

        //EventRegister > fetchIsLoading
        this.listener = EventRegister.addEventListener('fetchIsLoading', (fetchIsLoading) => {
            console.log('fetchIsLoading emitted with ' + fetchIsLoading);
            this.setState({
                fetchIsLoading,
            })
        })
    }

    componentDidMount() {
      
    }

  //render

    render() {
    
      //Else free to proceed
      return(
              <View style={{
                backgroundColor: 'white',
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%'
              }}>
                <Icon
                  name='check-circle-o'
                  type='font-awesome'
                  color='#517fa4'
                />
                <Text style={{
                  color: 'gray'
                }}>
                  Details for The Big Day
                </Text>
              </View>
      )
  }

    putNewInfo(x,theId){
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


      AsyncStorage.getItem('@ShukForrestWedding:userToken')
      .then((theId) => {

        let url = 'https://liquidpineapple.com:3000/api/BobaOrders?access_token=' + theId;
        let theMethod = 'PUT';
        let theHeaders = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        };

        EventRegister.emit('fetchIsLoading',true);

        fetch(url, {
          method: theMethod,
          headers: theHeaders,
          body: theBody
        })
        .then((response) => {
           
           console.log('response is ' + JSON.stringify(response));

           if(response.status == 200){
            Alert.alert(
              'Chee!',
              'Your RSVP has been updated',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            )
           } 
           else {
            Alert.alert(
              'Brahh..',
              'Something went wrong.  Try again.',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            )
           }

           EventRegister.emit('fetchIsLoading',false);
           return response.json()
        })
        .catch(() => {
          EventRegister.emit('fetchIsLoading',false);
          console.log('catch() was triggered')
        })
      })
    }

  anotherSignOut(){

    EventRegister.emit('fetchIsLoading',true);

    AsyncStorage.getItem('@ShukForrestWedding:userToken')
    .then((theToken) => {
      let theUrl = 'https://liquidpineapple.com:3000/api/CustomUsers/logout?access_token=' + theToken;
      let theMethod = 'POST';
      let theHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      fetch(theUrl,{
          method: theMethod,
          headers: theHeaders
      })
      .then((response) => {
        console.log('logout response is ' + JSON.stringify(response))
        if(response.status != 204){

          EventRegister.emit('fetchIsLoading',false);
          Alert.alert(
            'Brah..',
            'Something went wrong. Error code responseNot204',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
        }
        else return response.json();
      })
      .catch(() => {
        /*console.log('catch after /logout fetch');
        Alert.alert(
          'Brah..',
          'Something went wrong. Error code catch20.',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )*/
      })
    })
    .then((response) => {
      AsyncStorage.removeItem('@ShukForrestWedding:userToken')
      .then(() => {
        console.log('AsyncStorage.removeItem(..) passed');
        this.props.navigation.navigate('AuthLoading');
      })
      .catch(() => {
        EventRegister.emit('fetchIsLoading',false);
        Alert.alert(
          'Brah..',
          'Something went wrong. Error code catch20.',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
      })
    })
    .catch(() => {
      EventRegister.emit('fetchIsLoading',false);
      Alert.alert(
        'Brah..',
        'Something went wrong. Error code catch20.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
    })
  }
}


/** EVENT REGISTER

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

                  **/
