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
import Piney from '../helpers/Piney';
import Buffer from 'buffer';
import Colors from '../constants/Colors';

export default class ImagePickerExample extends React.Component {
  //constructor
    constructor(props) {
      super(props);

      this.state = {
        image: this.props.metaData.picToShow,
      }

      console.log('debug -- ImagePickerExample constructor() this.props is ' + JSON.stringify(this.props));
      console.log('debug -- ImagePickerExample constructor() this.state is ' + JSON.stringify(this.state));

    }

  async componentWillMount(){

    let x = await this._getThePics();

  }

  componentDidMount(){


  }

  render() {
    let { image } = this.state;
    console.log('ImagePickerExample.render() this.props is ' + JSON.stringify(this.props));

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
                uri: this.state.image
              }} 
            />
          }
          <Text style={{
            paddingTop: 10,
            paddingBottom: 10,
            color: Colors.tintColor
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
    console.log('the result.uri is ' + result.uri); 

      const manipResult = await ImageManipulator.manipulate(
        result.uri,
        [{ 
          resize: {
            width: 600
          }
        }],
        { format: 'jpeg' }
      );

      const thePath = await fetch(manipResult.uri);

      this.setState({
        image: manipResult.uri
      })

      const theBlob = await thePath.blob();
      const thePut = await Storage.put(
        this.props.metaData.profilePicturePrefix + this.props.metaData.id + '.jpeg',
        theBlob,
        {
          contentType: 'image/jpeg'
        }
      );
        /*
        Piney.userProfilesPut(
          this.props.metaData.theToken,
          this.props.metaData.user_id,
          this.props.metaData.name,
          this.props.metaData.profilePicturePrefix + this.props.metaData.id + '.jpeg',
          this.props.metaData.user_profile_id,
        )
        */

        Piney.userProfilesPut(this.props.metaData.theToken,{
          id: this.props.metaData.user_profile_id,
          user_id: this.props.metaData.user_id,
          name: this.props.metaData.name,
          picture: this.props.metaData.profilePicturePrefix + this.props.metaData.id + '.jpeg'
        })
        .then(()=>{
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
        });
  if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  _getThePics(){

      /// Get the Post Image
      console.log('debug -- ImagePickerExample _getThePics() before get, this.props is ' + JSON.stringify(this.props));
      Storage.get(this.props.picToShow)
      .then((response) => {
        console.log('debug -- ImagePickerExample _getThePics() response is ' + JSON.stringify(response));
        this.setState({
          image: response
        })
        //console.log('this.state is ' + JSON.stringify(this.state));
        console.log('debug -- ImagePickerExample _getThePics() this.props is ' + JSON.stringify(this.props));
      })
      .catch((err) => console.log('debug -- ImagePickerExample _getThePics() catch ' + err))

  }
}




/*** ======= OLD STUFF  =========== ***/

    /*
      fetch(manipResult.uri)
      .then(response => {
        console.log('response is ' + JSON.stringify(response));
        
        response.blob()
        .then(blob => {

          console.log('blob is ' + JSON.stringify(blob));

          Storage.put('profileImage.jpeg', blob, {
            contentType: 'image/jpeg',
            //level: 'public'
          })
          .then(data => {
            console.log('data is ' + JSON.stringify(data));
            console.log('this.props.metaData is ' + JSON.stringify(this.props.metaData));

            Piney.userProfilesPut(
              this.props.metaData.access_token,
              this.props.metaData.user_profile_id,
              this.props.metaData.name,
              Date.now()
            );
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
    */




/**
      const response = await fetch(manipResult.uri);
        console.log('response is ' + JSON.stringify(response));
**/

      



/**
          

      const blob = await response.blob();
        console.log('blob is ' + JSON.stringify(blob));

      const fileName = 'profileImage.jpeg';

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

    



/**
            let theTime = Date.now();
            let theUrl = 'https://liquidpineapple.com:3000/api/UserProfiles?access_token=' + this.props.metaData.theToken;
            let theHeaders = {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
            let theMethod = 'PUT';
            let theBody = JSON.stringify({
              'id' : this.props.metaData.user_profile_id,
              'user_id': this.props.metaData.user_id,
              'user_name': this.props.metaData.name,
              'picture': theTime
            })

            fetch(theUrl,{
              method: theMethod,
              headers: theHeaders,
              body: theBody
            })
            .then((response) => {
              console.log('success!  response is ' + JSON.stringify(response));
              return true;
            })
            .catch((err) => {
              console.log('error was ' + err);
              return false;
            })

          **/