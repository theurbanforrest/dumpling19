import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Alert,
  ScrollView
} from 'react-native';
import {
  Button,
  FormInput,
  FormLabel
} from 'react-native-elements';
import { EventRegister } from 'react-native-event-listeners';
import LoadingOverlay from '../components/LoadingOverlay';

export default class AuthNavigator extends React.Component {

  static navigationOptions = {
    title: 'Aloha',
  };

  constructor(props) {
      super(props);

      this.state = {
        theName: 'forrest',
        accessKeyInput: '',

        data: 'no data this is a string',
        accessKey: ''
      }
  }


  loginAttempt(theName,thePassword,existingAccessToken){

    //1. Authenticate
    let url = 'https://liquidpineapple.com:3000/api/CustomUsers/login';
    let theMethod = 'POST';
    let theHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    let theCredentials = {
      "username":"forrest",
      "password":thePassword
    };

    EventRegister.emit('fetchIsLoading',true);

    //Attempt to fetch the access key
    fetch(url, {
      method: theMethod,
      headers: theHeaders,
      body: JSON.stringify(theCredentials),
    })
    //Convert to json
    .then((response) => {
      return response.json();
    })
    //Grab the id
    .then((response) => {
      console.log('response is ' + JSON.stringify(response));
      
      switch(response.error != null){
          case true:
            Alert.alert(
              'Oops!',
              'You entered an unauthorized access key',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            )
          break;
          default:
            console.log('default switch happened')
        }
      return response.id;
    })
    //If userToken was returned: EventRegister.emit(), AsyncStorage.setItem(), then navigate
    .then((theId) => {

      if(theId){
        console.log('EventRegister.emit(..)');
        EventRegister.emit('setAccessKey', theId);
        console.log('AsyncStorage.setItem(..)');
        AsyncStorage.setItem('@ShukForrestWedding:userToken', theId);

        console.log('theId is ' + theId);
        this.props.navigation.navigate('AuthLoading');
      }
      else {
        console.log('theId was undefined');
        EventRegister.emit('fetchIsLoading',false);
        return theId;
      }
    })
    //If there was an error, catch() it
    .catch(() => {
      console.log('catch() was triggered');
      EventRegister.emit('fetchIsLoading',false);
    })
  }

  componentWillMount(){
    this.listener = EventRegister.addEventListener('myCustomEvent', (data) => {
            this.setState({
                data,
            })
        })

        this.listener = EventRegister.addEventListener('setAccessKey', (accessKey) => {
            this.setState({
                accessKey,
            })
        })

        this.listener = EventRegister.addEventListener('fetchIsLoading', (fetchIsLoading) => {
            console.log('fetchIsLoading emitted with ' + fetchIsLoading);
            this.setState({
                fetchIsLoading,
            })
        })
  }

  componentWillUnmount() {
        EventRegister.removeEventListener(this.listener)
    }

  render() {
      console.log('Start render of AuthNavigator.js');

      return (
        <KeyboardAvoidingView style={{
            backgroundColor: 'white',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: '3%',
            paddingRight: '3%',

          }}
          behavior='position'
          enabled
        >
          <View style={{
            justifyContent: 'space-between',
            //backgroundColor: 'magenta', //debug

          }}>
            <View style={{
              alignItems: 'center',
              //backgroundColor: 'green'  //debug
            }}>
              <Image
                style={{
                   paddingVertical: 30,
                   width: 200,
                   height: 200,
                   borderRadius: 100
                 }}
                 resizeMode='cover'
                 source={{
                  uri: 'https://forrestching.com/wedding19/assets/engaged.png'
                 }}
                 onPress={() => console.log('this state is ' + JSON.stringify(this.state))}
               />
               <Text style={{
                fontFamily: 'Futura',
                fontSize: 24,
                paddingTop: 20,
                paddingBottom: 20
               }}>
               #ShukForrestAdventureTime
               </Text>
             </View>
            <View style={{
              //backgroundColor: 'blue' //debug
            }}>
              <FormLabel
                labelStyle={{
                  color: 'rgba(178,158,7,1.0)'
                }}
              >Access Key</FormLabel>
                <FormInput
                placeholder='Enter Access Key'
                onChangeText={(text) => this.setState({
                  accessKeyInput: text
                })}
                value={this.state.accessKeyInput}
                />
            </View>
            <View style={{
              paddingTop: 20,
              paddingBottom: 20
            }}>
            <Button
              large
              rounded
              icon={{
                type: 'font-awesome',
                name: 'leaf'}}
              title='Submit'
              onPress={()=> this.loginAttempt(this.state.theName,this.state.accessKeyInput,'XYZ123')}
              backgroundColor={ this.state.accessKeyInput.length > 0 ? 'rgba(178,158,7,1.0)' : '#999'}
            />
            </View>
            <View style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}>
              <Text
              style={{
                fontSize: 12,
                color: '#999999'
              }}>
                An app by Rise And Pine Co.
              </Text>
              <Text
              style={{
                fontSize: 12,
                color: '#999999'
              }}>
                Copyright 2018 • Honolulu • New York
              </Text>
            </View>
          </View>


          <LoadingOverlay
            isVisible={this.state.fetchIsLoading}
            onCancelPress={() => console.log('onCancelPress')}
           />
          </KeyboardAvoidingView>
      );
  }

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