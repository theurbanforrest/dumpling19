import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';

//AWS
import Amplify from 'aws-amplify';
import {
  Analytics,
  API,
  Storage
} from 'aws-amplify';
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);



export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {

    //AWS Analytics
    Analytics.record('appRender');

    //Source
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <RootNavigation />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),

        //Any important assets needed for the entire app should be required here
          require('./assets/images/gray-pine.png'),
          require('./assets/images/nutridge-overlook.png'),
          require('./assets/images/engaged.png'),
          require('./assets/images/bg-piney.png'),
          require('./assets/images/pray-for-me.png'),
          require('./assets/images/ayo.png'),
          require('./assets/images/hey-mama.png'),
          require('./assets/images/flashing-cameras.png')
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
      

      
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
