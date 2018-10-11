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
  Avatar,
  Button,
  FormLabel,
  FormInput,
  Icon,
} from 'react-native-elements';

import Colors from '../constants/Colors';
import { Storage } from 'aws-amplify';

import Piney from '../helpers/Piney';
import PineyConstants from '../constants/PineyConstants';


export default class Welcome extends React.Component {

  //constructor
    constructor(props) {
      super(props);

    }

    componentWillMount() {}

    async componentDidMount() {

      //let theToken = await AsyncStorage.getItem('@ShukForrestWedding:userToken');
      //let theUserId = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;

    }

  //render

    render() {
      return(
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',

          }}
        >
          <View style={{
            flex: 5,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingLeft: '3%',
            paddingRight: '3%',
          }}>
            <Image
              source={require('../assets/images/pray-for-me.png')}
              style={{
                height: '100%',
                resizeMode: 'contain',
                //width: '70%'
              }}
              onPress={() => this.props.navigation.navigate('Step2')}
            />
          </View>
          <View style={{
            flex: 4,
            flexDirection: 'column'
          }}>
            <Text
              style={Colors.h2Center}
            >
              Hey Fam!
              {'\n'}
            </Text>
            <Text
              style={Colors.h3}
            >
              We're excited to have you join us at our wedding.
              {'\n\n'}
              Let's get you RSVP'd and set up in our app!
            </Text>
          </View>
          <View style={{
            flex: 3,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingBottom: '6%'
          }}>
              <Button
                large
                rounded
                icon={{
                  type: 'font-awesome',
                  name: 'leaf'}}
                title='Yeeeah buddy!'
                onPress={()=> this.props.navigation.navigate('Step2')}
                backgroundColor={Colors.tintColor}
            />
          </View>
        </View>
      );
    }
}
