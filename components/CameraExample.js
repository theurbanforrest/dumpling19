import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera, Permissions, FileSystem } from 'expo';
import { Icon } from 'react-native-elements';
import { EventRegister } from 'react-native-event-listeners';
import Colors from '../constants/Colors';

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    autoFocus: Camera.Constants.AutoFocus.on,
    flashMode: Camera.Constants.FlashMode.off,
    photo: {}
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    

    FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photos').catch(e => {
      console.log(e, 'Directory exists');
    });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
            <Camera 
              style={{
                flex: 1
              }}
              type={this.state.type}
              autoFocus={this.state.autoFocus}
              flashMode={this.state.flashMode}
              ref={ref => { 
                this.camera = ref;
                }
              } 
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    padding: 20
                  }}
                  onPress={() => {
                    this.setState({
                      type: this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                    });
                  }}>
                  <Icon
                    name='ios-sync'
                    type='ionicon'
                    color='white'
                    //onPress={() => console.log('hello')}
                    size={36}
                    containerStyle={{
                      //paddingLeft: 20,
                      //paddingBottom: 20
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    padding: 20
                  }}
                  onPress={this.takePicture}>
                  <Icon
                    name='ios-camera'
                    type='ionicon'
                    color='white'
                    size={36}
                  />
                </TouchableOpacity>
              </View>
            </Camera>
        </View>
      );
    }
  }

  componentWillUnmount(){
    EventRegister.removeEventListener(this.listener);
  }

  takePicture = () => {
    console.log('takePicture')

    if (this.camera) {
      this.camera.takePictureAsync({ 
        //base64: true,
        //onPictureSaved: this.onPictureSaved 
      })
      .then((photoPromise) => {

        console.log('takePictureAsync called, photoPromise is ' + JSON.stringify(photoPromise))

        EventRegister.emit('pictureTaken', photoPromise);

        console.log('emitted pictureTaken');

      });


    }
    else console.log('this.camera is null');
  };


}