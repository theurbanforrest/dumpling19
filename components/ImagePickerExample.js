import React from 'react';
import { Button, Image, View, Text, TouchableOpacity } from 'react-native';
import { ImagePicker } from 'expo';
import { Avatar, Badge } from 'react-native-elements';

export default class ImagePickerExample extends React.Component {
  state = {
    image: "https://s3.amazonaws.com/shukforrestwedding-userfiles-mobilehub-1260711576/public/shuk-moji.png",
  };

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
            color: 'rgba(178,158,7,1.0)'
          }}>
            + Edit Photo
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

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
}