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
//import SuperCamera from '../components/SuperCamera';
import Colors from '../constants/Colors';

export default class PostInitiator extends React.Component {

  //constructor
    constructor(props) {
      super(props);

      this.state = {
        fetchIsLoading: false,
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        autoFocus: Camera.Constants.AutoFocus.on,
        photo: {}
      }
    }

    async componentWillMount() {

      //EventRegister > pictureTaken
        this.listener = EventRegister.addEventListener('pictureTaken', (photo) => {
            console.log('pictureTaken received in PostInitiator with ' + JSON.stringify(photo));

            this.setState({
                photo,
            })

            //console.log('this.state.photo is ' + JSON.stringify(this.state.photo))

            console.log('try to navigate to Edit');
            this.props.navigation.navigate('Edit',{
              photo
            });
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
          
        </View>
      </View>
    )
  }

  componentWillUnmount(){
    EventRegister.removeEventListener(this.listener);
  }
  

}

/***
  
  <Icon
      reverse
      name='camera'
      type='font-awesome'
      color={Colors.tintColor}
      onPress={() => this.props.navigation.navigate('Edit',{
        editPhotoUrl: this.state.photo.uri
      })}
      size={40}
          />

***/


