import React from 'react';
import { 
  Button,
  Image,
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import { ImagePicker, ImageManipulator } from 'expo';
import { Avatar, Badge } from 'react-native-elements';

import { Storage, API } from 'aws-amplify';
import Buffer from 'buffer';

export default class ImagePickerExample extends React.Component {
  state = {
    image: '',
  };

  componentWillMount(){
    Storage.get('profileImage.png')
    .then(result => {

      this.setState({
        image: result,
      })
      console.log(result);

    })
    .catch(err => console.log(err));
  }

  render() {
    let { image } = this.state;

    return (
      <View style={{ 
        //flex: 1,
        //alignItems: 'center',
        //justifyContent: 'center'
      }}>
        <TouchableOpacity
          onPress={this._pickImage}
          style={{
            alignItems: 'center'
          }}
        >
          {
            image &&
            <Avatar
              xlarge
              rounded
              source={{ 
                uri: image 
              }} 
            />
          }
          <Text style={{
            paddingTop: 10,
            paddingBottom: 10,
            color: 'plum'
          }}>
            + Edit Photo (Coming Soon)
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);
    console.log('the result.uri is ' + result.uri); 

      const manipResult = await ImageManipulator.manipulate(
        result.uri,
        [{ 
          resize: {
            width: 300
          }
        }],
        { format: 'png', compress: 1 }
      );

      fetch(result.uri)
      .then(response => {
        console.log('response is ' + JSON.stringify(response));
        
        response.blob()
        .then(blob => {

          console.log('blob is ' + JSON.stringify(blob));
          Alert.alert(
              'Yo',
              'blob is ' + JSON.stringify(blob),
              [
                {
                  text: 'OK',
                  onPress: () => console.log('OK Pressed')
                }
              ],
              { cancelable: false }
            )

          Storage.put('profileImage.png', blob, {
            contentType: 'application/octet-stream',
            //level: 'public'
          })
          .then(data => {
            console.log('data is ' + JSON.stringify(data));
            Alert.alert(
              'Chee!',
              'Your pic has been saved.',
              [
                {
                  text: 'OK',
                  onPress: () => console.log('OK Pressed')
                }
              ],
              { cancelable: false }
            )
          })
          .catch(err => {
            console.log('error is ' + err);
            Alert.alert(
                  'Brah..',
                  'Your pic was not saved. code: ' + err,
                  [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ],
                  { cancelable: false }
                )
          })
        })
        .catch(err => console.log('response.blob() had error: ' + err))
      })
      .catch(err => console.log('fetch() errored out'));





/**
      const response = await fetch(manipResult.uri);
        console.log('response is ' + JSON.stringify(response));
**/

      



/**
          

      const blob = await response.blob();
        console.log('blob is ' + JSON.stringify(blob));

      const fileName = 'profileImage.png';

      await Storage.put(fileName, blob, {
        contentType: blob.type,
        level: 'public'
      }).then(data => {
        console.log('data is ' + JSON.stringify(data));
        console.log('after Storage.put(), blob is ' + JSON.stringify(blob))
        Alert.alert(
              'Chee!',
              'Your pic has been saved.',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            )

      })
        .catch(err => {
          console.log('error is ' + err);
          Alert.alert(
              'Brah..',
              'Your pic was not saved. code: ' + err,
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              { cancelable: false }
            )

      })
**/

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
}