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
  FormInput
} from 'react-native-elements';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import { EventRegister } from 'react-native-event-listeners';
import LoadingOverlay from '../components/LoadingOverlay';


export default class Profile extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

  //constructor
    constructor(props) {
      super(props);

      this.state = {
        name: '',
        user_id: '',
        plus_one: '',
        food_allergies: '',
        drink_pref: '',
        id: '',

        rsvpData: {},
        accessKey: '',
        fetchIsLoading: false,
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
      console.log('Profile.js componentDidMount');

      EventRegister.emit('fetchIsLoading',true);
      
      AsyncStorage.getItem('@ShukForrestWedding:userToken')
      .then((theId) => {
        let theUrl = 'https://liquidpineapple.com:3000/api/BobaOrders?filter=%7B%22where%22%3A%7B%22user_id%22%3A%22'+ Expo.Constants.deviceId +'%22%7D%7D' + '&access_token=' + theId;
        let theMethod = 'GET';
        let theHeaders = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        };

        console.log('theUrl is ' + theUrl);
        EventRegister.emit('fetchIsLoading',true);

        fetch(theUrl,{
          method: theMethod,
          headers: theHeaders
        })
        .then((response) => {
          let x = response.json();
          console.log('x is ' + x);
          return x;
        })
        .then((response) => {

          let rsvpData = response[0];
          EventRegister.emit('fetchIsLoading',false);
          this.setState({
            name: rsvpData.name,
            user_id: rsvpData.user_id,
            plus_one: rsvpData.plus_one,
            food_allergies: rsvpData.food_allergies,
            drink_pref: rsvpData.drink_pref,
            id: rsvpData.id,
          })

          console.log('state is ' + JSON.stringify(this.state));

        })
        .catch(() => {
          console.log("fetch's catch() was thrown");
          EventRegister.emit('fetchIsLoading',false);
          })
      })
      .catch(() => {
        console.log("AsyncStorage.getItem()'s catch() was thrown")
        EventRegister.emit('fetchIsLoading',false);
      })
    }

    componentWillUnmount() {
      EventRegister.removeEventListener(this.listener)
    }

  //render

    render() {
    
      //Else free to proceed
      return(
          <KeyboardAvoidingView style={{
            backgroundColor: 'white',
            flex: 1,
            paddingLeft: '3%',
            paddingRight: '3%'
          }}
            behavior='position'
            enabled
          >
            <ScrollView>
              <View style={{
                justifyContent: 'space-around',
                height: '100%'
              }}>
                <View style={{
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  
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
                    uri: 'https://randomuser.me/api/portraits/men/41.jpg',
                    }}
                    onPress={() => console.log('this state is ' + JSON.stringify(this.state))}
                  />
                </View>
                <View style={{
                  //backgroundColor: 'cyan',  //debug color
                }}>
                  <FormLabel
                    labelStyle={{
                      color: 'rgba(178,158,7,1.0)'
                    }}
                  >Name</FormLabel>
                  <FormInput
                  placeholder='e.g. Braddah Kimo'
                  onChangeText={(text) => this.setState({name: text})}
                  value={this.state.name}
                  />
                  <FormLabel
                    labelStyle={{
                      color: 'rgba(178,158,7,1.0)'
                    }}
                  >Your Date</FormLabel>
                  <FormInput
                  placeholder="Original Guest or Plus One's Name"
                  onChangeText={(text) => this.setState({plus_one: text})}
                  value={this.state.plus_one}
                  />
                  <FormLabel
                    labelStyle={{
                      color: 'rgba(178,158,7,1.0)'
                  }}>Food allergies/lifestyle</FormLabel>
                  <FormInput
                  placeholder='We will try to accomodate you!'
                  onChangeText={(text) => this.setState({food_allergies: text})}
                  value={this.state.food_allergies}
                  />
                  <FormLabel
                    labelStyle={{
                      color: 'rgba(178,158,7,1.0)'
                  }}>Drink Preferences</FormLabel>
                  <FormInput
                  placeholder='e.g. Beer and Old Fashioneds'
                  onChangeText={(text) => this.setState({drink_pref: text})}
                  value={this.state.drink_pref}
                  />
                </View>
                <View style={{
                  //backgroundColor: 'green', //debug color
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  width: '100%',
                  paddingTop: 20
                }}>
                  <Button
                    rounded
                    icon={{
                      type: 'font-awesome',
                      name: 'leaf'}}
                    title='Submit'
                    backgroundColor={this.state.name.length > 0 ? 'rgba(178,158,7,1.0)' : '#999'}
                    onPress={()=> this.putNewInfo(this.state, this.state.accessKey)}
                  />
                  <View style={{
                    paddingTop: 20
                  }}>
                    <TouchableHighlight
                      onPress={() => this.anotherSignOut()}
                    >
                      <Text
                      style={{
                        fontSize: 14,
                        color: 'rgba(178,158,7,1.0)'
                      }}>
                        - or log out
                      </Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </ScrollView>
              <LoadingOverlay
                isVisible={this.state.fetchIsLoading}
                cancelOnPress={() => console.log('Cancel was pressed')}
              />
          </KeyboardAvoidingView>
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
              'Your Profile has been updated',
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
          console.log('catch() was triggered');
          Alert.alert(
              'Brahh..',
              'Something went wrong.  Try again.',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            )
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
