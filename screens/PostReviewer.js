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
import { Camera, Permissions } from 'expo';

import { MonoText } from '../components/StyledText';
import { EventRegister } from 'react-native-event-listeners';
import LoadingOverlay from '../components/LoadingOverlay';

import CameraExample from '../components/CameraExample';
import Colors from '../constants/Colors';

export default class PostReviewer extends React.Component {

  //constructor
    constructor(props) {
      super(props);

      this.state = {
        fetchIsLoading: false,
        hasCameraPermission: null,
        type: Camera.Constants.Type.back
      }
    }

    async componentWillMount() {

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

        //Permission to use Camera
        const { cameraPermissionStatus } = await Permissions.askAsync(Permissions.CAMERA);
          this.setState({ hasCameraPermission: cameraPermissionStatus === 'granted' });

        //Permission to use Camera Roll
        const { cameraRollPermissionStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          this.setState({ hasCameraPermission: cameraRollPermissionStatus === 'granted' });
    }

    componentDidMount() {
      
    }

  //render
  render(){

    return(
      <View style={{
        height: '100%',
        width: '100%'
      }}>
        <View style={{
          height: '70%',
        }}>
          <CameraExample />
        </View>
        <View style={{
          height: '30%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Icon
            reverse
            name='camera'
            type='font-awesome'
            color={Colors.tintColor}
            onPress={() => console.log('hello')}
            size={40}
          />
        </View>
      </View>
    )
  }
  

}


