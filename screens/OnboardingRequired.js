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


export default class OnboardingRequired extends React.Component {

  //constructor
    constructor(props) {
      super(props);
      this.state = {
        name: ''
      }
    }

    async componentWillMount() {}

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
            width: '100%'

          }}
        >
          <View style={{
            flex: 5,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingLeft: '3%',
            paddingRight: '3%',
            width: '100%'
          }}>
            <Image
              source={require('../assets/images/hey-mama.png')}
              style={{
                height: '100%',
                resizeMode: 'contain',
                //width: '70%'
              }}
            />
          </View>
          <View style={{
            flex: 4,
            flexDirection: 'column',
            width: '100%'
          }}>
            <Text
              style={Colors.h2Center}
            >
              Who Are You?
              {'\n'}
            </Text>
            <Text
              style={Colors.h3}
            >
              Awesome. Now let's get you RSVP'd:
              {'\n\n'}

            </Text>
            <FormInput
              placeholder='Howzit my name is..'
              onChangeText={(text) => this.setState({name: text})}
              value={this.state.name}
              //inputStyle={this.state.order_accepted ? Colors.h2Accent : Colors.h2Reverse }
              containerStyle={{
                paddingTop: 20
              }}
              />
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
                onPress={()=> this.props.navigation.navigate('Step4')}
                backgroundColor={Colors.tintColor}
            />
          </View>
        </View>
      );
    }
}
