import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {

    /** USERTOKEN WITH ASYNCSTORAGE **/
    const userToken = await AsyncStorage.getItem('@ShukForrestWedding:userToken');
    

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'Main' : 'Auth');

  };

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