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
  Alert,
  ImageStore
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

import { Storage } from 'aws-amplify';

export default class PostMediaEditor extends React.Component {

  //constructor
    constructor(props) {
      super(props);

      this.state = {
        fetchIsLoading: false,
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,

        
      }
    }

    async componentWillMount() {

        //Permission to use Camera
        const { cameraPermissionStatus } = await Permissions.askAsync(Permissions.CAMERA);
          this.setState({ hasCameraPermission: cameraPermissionStatus === 'granted' });

        //Permission to use Camera Roll
        const { cameraRollPermissionStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          this.setState({ hasCameraPermission: cameraRollPermissionStatus === 'granted' });
    

        console.log('PostMediaEditor will mount')
        console.log('PostMediaEditor.state is ' + JSON.stringify(this.state));
        console.log('PostMediaEditor.props is ' + JSON.stringify(this.props));
    }

    componentDidMount() {
      
    }

  //render
  render(){

    console.log('PostMediaEditor renders');

    return(
      <View style={{
        height: '100%',
        width: '100%'
      }}>
        <View style={{
          height: '70%',
        }}>
          <Image
            style={{
               //paddingVertical: 30,
               width: '100%',
               height: '100%',
               //borderRadius: 100
             }}
             resizeMode='cover'
             source={{
              uri: this.props.navigation.state.params.photo.uri
             }}
          />
        </View>
        <View style={{
          height: '30%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Icon
            reverse
            name='rocket'
            type='font-awesome'
            color={Colors.tintColor}
            onPress={() => this.sendToS3(this.props.navigation.state.params.photo.uri) }
            size={40}
          />
          <Text>
          </Text>
        </View>
      </View>
    )
  }

  sendToS3(theMediaUri){

      console.log('sendToS3() started');
      console.log('theMediaUri is ' + theMediaUri)

      const file = {
        uri: theMediaUri,
      };

      let name = 'hello.jpg';

      console.log('PostMediaEditor Storage.put(..)')

      Storage.put(name, file, {
        contentType: 'image/jpeg'
      }) //access
      .then((response) =>{
        console.log(JSON.stringify(response))
      })
      .catch((e) => {
        console.log(JSON.stringify(e));
      });

  }

  componentWillUnmount() {

    }
  

}


