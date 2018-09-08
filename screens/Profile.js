import React, { PropTypes, Component } from 'react';
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
import Colors from '../constants/Colors';
import PineyConstants from '../constants/PineyConstants';
import LoadingOverlay from '../components/LoadingOverlay';
import ImagePickerExample from '../components/ImagePickerExample';

import { Storage } from 'aws-amplify';
import Piney from '../helpers/Piney';


export default class Profile extends React.Component {
  static navigationOptions = {
    title: 'RSVP',
  };

  //constructor
    constructor(props) {
      super(props);

      this.state = {

        //variable
          name: '',
          user_id: '',
          plus_one: '',
          food_allergies: '',
          drink_pref: '',
          id: 0,
          email: '',
          phone: '',
          order_accepted: true,

          fetchIsLoading: false,
          user_profile_id: '',
          theToken: '',

        //constant
          profilePicturePrefix: PineyConstants.profilePicturePrefix
        
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


        //Expo 2.7 client temp fix - when deviceId is unidentified, use installationId

        let theIdentifier = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;

        console.log('Expo.Constants.deviceId is ' + Expo.Constants.deviceId);
        console.log('Expo.Constants.installationId is ' + Expo.Constants.installationId);
        console.log('Expo.Constants.expoVersion is ' + Expo.Constants.expoVersion);

        this.setState({
          user_id: theIdentifier
        });


        console.log('Profile.js componentDidMount');


      EventRegister.emit('fetchIsLoading',true);
      AsyncStorage.getItem('@ShukForrestWedding:userToken')
      .then((theId) => {

        this.setState({
          theToken: theId
        });

        //let a = await this._getThisBobaOrder();
        //let b = await this._getThisUserProfile();

      /*** REFACTORED with this._bobaOrdersGetById()
        console.log('this.state.theToken is ' + this.state.theToken);

      
        let theUrl = 'https://liquidpineapple.com:3000/api/BobaOrders?filter=%7B%22where%22%3A%7B%22user_id%22%3A%22'+ this.state.user_id +'%22%7D%7D' + '&access_token=' + theId;
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
          let x = response.json();  /// This is needed to make sure it gets converted before continuing!
          console.log('x is ' + x);
          return x;
        })
        .then((response) => {
          let rsvpData = response[0];
          this.setState({
            name: rsvpData.name,
            user_id: rsvpData.user_id,
            plus_one: rsvpData.plus_one,
            food_allergies: rsvpData.food_allergies,
            drink_pref: rsvpData.drink_pref,
            id: rsvpData.id,
            email: rsvpData.email,
            phone: rsvpData.phone,
            order_accepted: rsvpData.order_accepted
          })
          console.log('Profile.js state was set as ' + JSON.stringify(this.state));
      */
      /**** REFACTORED with userProfilesGetById()
          fetch('https://liquidpineapple.com:3000/api/UserProfiles?filter=%7B%22where%22%3A%7B%22user_id%22%3A%22'+ rsvpData.user_id +'%22%7D%7D' + '&access_token=' + this.state.theToken,
          {
            method: 'GET',
            headers: {
              'Accept' : 'application/json',
              'Content-Type' : 'application/json'
            }
          })
          .then((response) => response.json())
          .then((data) => {

            console.log('data is ' + JSON.stringify(data));

            let userProfileData = data[0];
            this.setState({
              user_profile_id: userProfileData.id
            })
            
            console.log('userProfileData.id is ' + userProfileData.id);
          })
          .catch((err) => {
            console.log('catch() when fetching UserProfile with code ' + err);
          })
      */

        EventRegister.emit('fetchIsLoading',false);
      })
      .then(() => console.log('debug -- Profile componentDidMount() this.state is ' + JSON.stringify(this.state)))
      .catch(() => {
        console.log("AsyncStorage.getItem()'s catch() was thrown")
        EventRegister.emit('fetchIsLoading',false);
      })
    }

    async componentDidMount() {
      let x = await this._getThisBobaOrder();
      let y = await this._getThisUserProfile();
      let z = await this._getThisUserPicture();
    }

    componentWillUnmount() {
      EventRegister.removeEventListener(this.listener);

    }

  //render

    render() {

      //Else free to proceed
      return(
          <KeyboardAvoidingView style={{
            backgroundColor: this.state.order_accepted ? Colors.secondaryBackground : Colors.primaryBackground,
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
                height: '100%',
                paddingTop: '5%'
              }}>
                <View style={{
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>

                  {this.state.user_profile_id > 0 ? this._showImagePicker() : ''}

                </View>
                <View style={{
                  //backgroundColor: 'cyan',  //debug color
                }}>

                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                  }}>
                    <TouchableOpacity
                      onPress={() => this._RSVP(true)}
                    >
                      <View style={{
                        padding: '6%',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}>
                        <Icon
                          size={52}
                          name='thumbs-up'
                          type='font-awesome'
                          color={this.state.order_accepted ? Colors.h2Accent.color : Colors.h2Reverse.color }
                          iconStyle={{
                            padding: '6%'
                          }}
                        />
                        <Text style={this.state.order_accepted ? Colors.h2Accent : Colors.h2Reverse }>
                          Attending
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this._RSVP(false)}
                    >
                      <View style={{
                        padding: '6%',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}>
                        <Icon
                          size={52}
                          name='times-circle'
                          type='font-awesome'
                          color={this.state.order_accepted ? Colors.h2ReverseDark.color : Colors.errorBackground}
                          iconStyle={{
                            padding: '6%'
                          }}
                        />
                        <Text style={this.state.order_accepted ? Colors.h2ReverseDark : Colors.h2Error}>
                          Not Attending
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

              /** INFO FIELDS **/
                  
                  <FormInput
                  placeholder='Howzit my name is..'
                  onChangeText={(text) => this.setState({name: text})}
                  value={this.state.name}
                  inputStyle={this.state.order_accepted ? Colors.h2Accent : Colors.h2Reverse }
                  containerStyle={{
                    paddingTop: 20
                  }}
                  />


                  <FormLabel
                    labelStyle={{
                      color: this.state.order_accepted ? Colors.tintColor : Colors.inactiveColor
                    }}
                  >How do you know us?</FormLabel>
                  <FormInput
                  placeholder="e.g. Nick's date, Barrel Room Crew"
                  onChangeText={(text) => this.setState({plus_one: text})}
                  value={this.state.plus_one}
                  inputStyle={this.state.order_accepted ? Colors.h3Accent : Colors.h3Reverse}
                  />
                  <FormLabel
                    labelStyle={{
                      color: this.state.order_accepted ? Colors.tintColor : Colors.inactiveColor
                    }}
                    >Email</FormLabel>
                  <FormInput
                  placeholder='andy.lau@chachantang.com'
                  onChangeText={(text) => this.setState({email: text})}
                  value={this.state.email}
                  inputStyle={this.state.order_accepted ? Colors.h3Accent : Colors.h3Reverse}
                  />
                  <FormLabel
                    labelStyle={{
                      color: this.state.order_accepted ? Colors.tintColor : Colors.inactiveColor
                    }}
                    >Phone</FormLabel>
                  <FormInput
                  placeholder='(808) 422-2222'
                  onChangeText={(text) => this.setState({phone: text})}
                  value={this.state.phone}
                  inputStyle={this.state.order_accepted ? Colors.h3Accent : Colors.h3Reverse}
                  />
                  <FormLabel
                    labelStyle={{
                      color: this.state.order_accepted ? Colors.tintColor : Colors.inactiveColor
                    }}
                  >Food allergies/lifestyle</FormLabel>
                  <FormInput
                  placeholder='We will try to accomodate you!'
                  onChangeText={(text) => this.setState({food_allergies: text})}
                  value={this.state.food_allergies}
                  inputStyle={this.state.order_accepted ? Colors.h3Accent : Colors.h3Reverse}
                  />
                  <FormLabel
                    labelStyle={{
                      color: this.state.order_accepted ? Colors.tintColor : Colors.inactiveColor
                    }}
                    >Drink Preferences</FormLabel>
                  <FormInput
                  placeholder='e.g. Beer and Old Fashioneds'
                  onChangeText={(text) => this.setState({drink_pref: text})}
                  value={this.state.drink_pref}
                  inputStyle={this.state.order_accepted ? Colors.h3Accent : Colors.h3Reverse}
                  />

                  
            }
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
                    large
                    icon={{
                      type: 'font-awesome',
                      name: 'leaf'}}
                    title='Submit'
                    backgroundColor={this.state.order_accepted > 0 ? Colors.tintColor : Colors.inactiveColorDark}
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
                        color: labelColor
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


  _RSVP = async(response) => {

    let x = true;
    if(response === false) x = false;

    console.log('debug -- _RSVP() x is ' + x);

    await this.setState({
      order_accepted: x
    });
    
    //this._putThisBobaOrder();

    this.putNewInfo();
  }

  putNewInfo(){
    
    if(this.state.name<1){
      Alert.alert(
          'Brah..',
          'You gotta enter a name first :)',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
    } 
    else {
      try { this._putThisBobaOrder(); }
      catch(e) {
        Alert.alert(
          'Brah..',
          'An error occurred. Code: ' + e,
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
      }
      try { this._putThisUserProfile(); }
        catch(e) {
          Alert.alert(
            'Brah..',
            'An error occurred. Code: ' + e,
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
        }

      //If no errors, profile was updated
      Alert.alert(
          'Chee!',
          'Your Profile has been updated',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
    }

    


    /** REFACTORED

      //If this Guest's device is already in the database, Update info
      if(x.id>0){
        theBody = JSON.stringify({
          'name': x.name,
          'user_id': x.user_id,
          'plus_one': x.plus_one,
          'drink_pref': x.drink_pref,
          'food_allergies': x.food_allergies,
          'id' : x.id,
          'email' : x.email,
          'phone' : x.phone,
          'order_accepted' : x.order_accepted
        });
      }
      //Else Create it 
      else {
        console.log('no id detected, theBody will be set up without id to PUT');
        console.log('user_id is ' + Expo.Constants.deviceId);

        theBody = JSON.stringify({
          'name': x.name,
          'user_id': x.user_id,
          'plus_one': x.plus_one,
          'drink_pref': x.drink_pref,
          'food_allergies': x.food_allergies,
          'email' : x.email,
          'phone' : x.phone,
          'order_accepted' : x.order_accepted
        })
      }

      //debug
      console.log('theBody is ' + JSON.stringify(theBody));
    **/

    /**REFACTORED

        AsyncStorage.getItem('@ShukForrestWedding:userToken')
        .then((theId) => {

          let url = 'https://liquidpineapple.com:3000/api/BobaOrders?access_token=' + theId;
          let theMethod = 'PUT';
          let theHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          };

          console.log('the PUT is ' + url);

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
                'Something went wrong.  Try again. code:'+response.status,
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
                'Something went wrong.  Try again. code:catch',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
              )
          })
        })
    ***/
  }

  _getThisUserProfile = async () => {

    let theToken = await AsyncStorage.getItem('@ShukForrestWedding:userToken');
    //let theToken = this.state.theToken;
    let theUserId = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;

    let theGet = await Piney.userProfilesGetById(theToken,theUserId);
      
    /// Things to do after you get the response
    let theGetResponse = await theGet.json();
    this.setState({
      user_profile_id: theGetResponse[0].id
    })

    return theGetResponse;
  }

  _putThisUserProfile = async () => {

    let theToken = this.state.theToken;
    let theUserId = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;

    console.log('debug -- Profile _putThisUserProfile() this.state is ' + JSON.stringify(this.state));

    let thePut = await Piney.userProfilesPut(theToken,{
      id: this.state.user_profile_id,
      user_id: this.state.user_id,
      user_name: this.state.name,
      picture: this.state.profilePicturePrefix + this.state.id + '.jpeg'
    });
    /// Things to do after you get the response


    let thePutResponse = await thePut.json();
    console.log('debug -- Profile _putThisUserProfile() thePutResponse is ' + JSON.stringify(thePutResponse));

    return thePut;
  }

  _getThisBobaOrder = async () => {

      let theToken = await AsyncStorage.getItem('@ShukForrestWedding:userToken');
      //let theToken = this.state.theToken;
      let theUserId = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;

      let theGet = await Piney.bobaOrdersGetById(theToken,theUserId);
      /// Things to do after you get the response

      console.log('debug -- theGet is ' + JSON.stringify(theGet));
     // let theGetResponse = theGet.json();
      let rsvpData = theGet[0];

      this.setState({
          name: rsvpData.name,
          user_id: rsvpData.user_id,
          plus_one: rsvpData.plus_one,
          food_allergies: rsvpData.food_allergies,
          drink_pref: rsvpData.drink_pref,
          id: rsvpData.id,
          email: rsvpData.email,
          phone: rsvpData.phone,
          order_accepted: rsvpData.order_accepted
        })

      console.log('debug -- Profile state is ' + JSON.stringify(this.state))

      /*
      .then((response) => {
        let x = response.json();  /// This is needed to make sure it gets converted before continuing!
        console.log('x is ' + x);
        return x;
      })
      

      .then((response) => {
        let rsvpData = response[0];
        this.setState({
          name: rsvpData.name,
          user_id: rsvpData.user_id,
          plus_one: rsvpData.plus_one,
          food_allergies: rsvpData.food_allergies,
          drink_pref: rsvpData.drink_pref,
          id: rsvpData.id,
          email: rsvpData.email,
          phone: rsvpData.phone,
          order_accepted: rsvpData.order_accepted
        })
      })
      .catch((err) => {
        console.log('error is ' + err);
      })

      return theGet; */
  }

  _putThisBobaOrder = async () => {

    console.log('debug -- Profile _putThisBobaOrder() this.state is ' + JSON.stringify(this.state));
    let theToken = this.state.theToken;
    let theUserId = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;

    let thePut = await Piney.bobaOrdersPut(theToken,{
      id: this.state.id,     //optional. if null, creates new entry
      name: this.state.name,
      theUserId: this.state.user_id,
      thePhone: this.state.phone,
      theEmail : this.state.email,
      orderAccepted : this.state.order_accepted,
      thePlusOne : this.state.plus_one,
      theDrinkPref : this.state.drink_pref,
      theFoodAllergies : this.state.food_allergies
    });
    /// Things to do after you get the response

    let thePutResponse = await thePut.json();
    console.log('debug -- Profile _putThisBobaOrder() thePutResponse is ' + JSON.stringify(thePutResponse));

    return thePut;

  }

  _getThisUserPicture = async () => {
    let x = encodeURI(PineyConstants.profilePicturePrefix + this.state.user_profile_id + '.jpeg');
       
        //let x = this.props.picToShow;
        console.log('debug -- Profile _getThisUserPicture() x is ' + x);

        let y = Storage.get(x)
        .then((result) => {

          this.setState({
            picToShow: result
          })

          console.log('debug -- Profile _getThisUserPicture() state is ' + JSON.stringify(this.state));

        })
        .catch(err => console.log(err)); 
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
            'Something went wrong. code:'+response.status,
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
          'Something went wrong. code:catch',
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
        'Something went wrong. code:catch',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
    })
  }

  _showImagePicker(){
    return(
      <ImagePickerExample
        metaData={this.state}
        picToShow={encodeURI(PineyConstants.profilePicturePrefix + this.state.id + '.jpeg')}
      />
    )
  }
}

const labelColor = Colors.tintColor;


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

/*** CONFETTI


  //componentDidMount()
    if(this._confettiView) {
       this._confettiView.startConfetti();

  //render()
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
