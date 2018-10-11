import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Piney from '../helpers/Piney';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {

    /** Get userToken, User ID, and BobaOrder **/
      const userToken = await AsyncStorage.getItem('@ShukForrestWedding:userToken');
      let theUserId = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;
      let theBobaOrder = await this._getBobaOrderByUserId(userToken,theUserId);


    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.

    if(!userToken){
      this.props.navigation.navigate('Auth');
    }
    else if(!theBobaOrder[0]){
      this.props.navigation.navigate('Onboarding');
    }
    else this.props.navigation.navigate('Main');

  };

  _getBobaOrderByUserId = async (accessToken,theUserId) => {

    let theGet = await Piney.bobaOrdersGetById(
        accessToken,
        theUserId);

    console.log('debug -- AuthLoadingScreen _getBobaOrderByUserId() theGet is ' + JSON.stringify(theGet));
    
    return theGet ? theGet : false;
  }

  componentWillUnmount(){
    console.log('Start componentWillUnmount of AuthLoadingScreen.js');
  }

  // Render any loading content that you like here
  render() {
    console.log('Start render of AuthLoadingScreen.js');
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }

  

}