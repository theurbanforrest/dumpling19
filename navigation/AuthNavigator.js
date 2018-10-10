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
import Colors from '../constants/Colors';

export default class AuthNavigator extends React.Component {

  static navigationOptions = {
    title: 'Aloha',
  };

  constructor(props) {
      super(props);

      this.state = {
        userNameInput: 'forrest',
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
      "username": theName.toLowerCase(),
      "password": thePassword.toLowerCase()
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
                {text: 'OK', onPress: () => {
                  console.log('OK Pressed');
                  this.setState({
                    fetchIsLoading: false
                  })
                }},
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
        //EventRegister.emit('setAccessKey', theId);
        console.log('AsyncStorage.setItem(..)');
        AsyncStorage.setItem('@ShukForrestWedding:userToken', theId);

        console.log('theId is ' + theId);
        this.props.navigation.navigate('AuthLoading');
      }
      else {
        console.log('theId was undefined');
        //EventRegister.emit('fetchIsLoading',false);
        return theId;
      }
    })
    //If there was an error, catch() it
    .catch(() => {
      console.log('catch() was triggered');
      //EventRegister.emit('fetchIsLoading',false);
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

  componentDidMount(){
    if(this._confettiView) {
       this._confettiView.startConfetti();
    }
  }

  componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
        if (this._confettiView)
        {
            this._confettiView.stopConfetti();
        }
    }

  render() {
      console.log('Start render of AuthNavigator.js');

      return (
        <View style={{
          position: 'relative'
        }}>
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}>
            <Image source={require('../assets/images/bg-piney.png')}
            />
          </View>
        <KeyboardAvoidingView style={{
            backgroundColor: 'transparent',
            //flex: 1,
            flexDirection: 'column',
            paddingLeft: '3%',
            paddingRight: '3%',
            paddingTop: '20%',
            height: '100%'
          }}
          behavior='position'
          enabled
        >
          <ScrollView>
            <View style={{
              alignItems: 'center',
              justifyContent: 'space-around'
            }}>
              <Image
                style={{
                   paddingVertical: 30,
                   width: 200,
                   height: 200,
                   borderRadius: 100
                 }}
                 resizeMode='cover'
                 source={require('../assets/images/engaged.png')}
                 onPress={() => console.log('this state is ' + JSON.stringify(this.state))}
               />
               <Text style={{
                fontFamily: 'Futura',
                fontSize: 24,
                paddingTop: 20,
                paddingBottom: 20
               }}>
               #ShukForrestWedding
                <Text style={{
                  color: Colors.inactiveColor,
                  fontFamily: 'Futura',
                  fontSize: 12,
                  paddingTop: 20,
                  paddingBottom: 20
                 }}>
                    (Beta)
                 </Text>
               </Text>
            </View>
            <View style={{
              paddingTop: 20,
              paddingBottom: 20
            }}>
              
              <FormLabel
                labelStyle={{
                  color: labelColor
                }}
              >Password</FormLabel>
              <FormInput
              placeholder='Enter Password'
              onChangeText={(text) => this.setState({
                accessKeyInput: text
              })}
              secureTextEntry={true}
              value={this.state.accessKeyInput}
              />
              <View style={{
                paddingTop: '3%'
              }}>
                <Button
                  large
                  rounded
                  icon={{
                    type: 'font-awesome',
                    name: 'leaf'}}
                  title='Submit'
                  onPress={()=> this.loginAttempt(this.state.userNameInput,this.state.accessKeyInput,'XYZ123')}
                  backgroundColor={ this.state.accessKeyInput.length > 0 ? labelColor : '#999'}
                />
              </View>
            </View>
            <View style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-end',
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
          </ScrollView>
        </KeyboardAvoidingView>
        <LoadingOverlay
          isVisible={this.state.fetchIsLoading}
          onCancelPress={() => this.setState({ fetchIsLoading: false })}
         />
      </View>
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

const labelColor = Colors.tintColor;



/*** Removed Confetti

  <Confetti 
                ref={(node) => this._confettiView = node}
                colors={
                  [
                    "rgb(245,173,236)",
                    "rgb(255,223,0)",
                    "rgb(250,250,210)"
                  ]
                }
                untilStopped={true}
                duration={6000}
                confettiCount={200}
                timeout={1}
                size={2}
                bsize={2}
              />


***/

/*** Removed User Name

<FormLabel
                    labelStyle={{
                      color: labelColor
                    }}
                  >User Name</FormLabel>
                  <FormInput
                  placeholder='Enter User Name'
                  onChangeText={(text) => this.setState({
                    userNameInput: text
                  })}
                  secureTextEntry={true}
                  value={this.state.userNameInput}
                  />

***/