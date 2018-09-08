import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { Camera, Permissions, ImageManipulator } from 'expo';

import { MonoText } from '../components/StyledText';
import { EventRegister } from 'react-native-event-listeners';
import LoadingOverlay from '../components/LoadingOverlay';

import CameraExample from '../components/CameraExample';
import Colors from '../constants/Colors';

import { Storage } from 'aws-amplify';
import Piney from '../helpers/Piney';
import PineyConstants from '../constants/PineyConstants';

export default class PostMediaEditor extends React.Component {

  //constructor
    constructor(props) {
      super(props);

      /// expecting this.props.navigation.state.params.photo.uri (the photo to post)

      var tryingToAddNewPost = true; 
      try{ this.props.navigation.state.params.photo.uri; }
      catch(e) {
          tryingToAddNewPost = false;
      }

      this.state = {
        fetchIsLoading: false,
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        text: '',
        newPostMode: tryingToAddNewPost
      }
    }

    async componentWillMount() {

        //Permission to use Camera
        const { cameraPermissionStatus } = await Permissions.askAsync(Permissions.CAMERA);
          this.setState({ hasCameraPermission: cameraPermissionStatus === 'granted' });

        //Permission to use Camera Roll
        const { cameraRollPermissionStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          this.setState({ hasCameraPermission: cameraRollPermissionStatus === 'granted' });
    

        //console.log('PostMediaEditor will mount')
        console.log('debug -- PostMediaEditor this.state is ' + JSON.stringify(this.state));
        console.log('debug -- PostMediaEditor this.props is ' + JSON.stringify(this.props));

        
    }

    async componentDidMount() {
      let theToken = await AsyncStorage.getItem('@ShukForrestWedding:userToken');
      let theUserId = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;

            await this.setState({
              access_token: theToken,
              user_id: theUserId
            });

      let theGet = await Piney.bobaOrdersGetById(
        this.state.access_token,
        this.state.user_id);

      //console.log('debug -- PostMediaEditor componentDidMount() theGet is ' + theGet.name);

            await this.setState({
              user_name: theGet[0].name
            });

      
      if(this.state.newPostMode === false){
        console.log('debug -- PostMediaEditor componentDidMount() ..photo.uri does not exist. Trying Storage.get()..');
        
        let a = await Storage.get(encodeURI(PineyConstants.postPicturePrefix + this.props.navigation.state.params.x.id + '.jpeg'));
        console.log('debug -- PostMediaEditor componentDidMount() is ' + JSON.stringify(a));

        this.setState({
          pictureToEdit: a,
          comment: this.props.navigation.state.params.x.comment_body
        })
        
      }
      else {
        console.log('debug -- PostMediaEditor componentDidMount ..photo.uri exists.  Setting as pictureToEdit now..');
        this.setState({
          pictureToEdit: this.props.navigation.state.params.photo.uri,
          //comment is blank so show placeholder
        })
      }
      

    }

  //render
  render(){

    console.log('PostMediaEditor renders');

    return(
      <KeyboardAvoidingView style={{
        height: '100%',
        width: '100%'
      }}
        behavior='position'
        enabled
      >
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
              uri: this.state.pictureToEdit
             }}
          />
        </View>
        <View style={{
          height: '30%',
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <TextInput
            style={{
              height: '50%',
              width: '94%',
              fontSize: 18,
              //borderColor: 'gray',
              //borderWidth: 1
            }}
            multiline={true}
            placeholder={this.state.newPostMode ? "Leave a comment.." : null}
            numberOfLines={8}
            onChangeText={(text) => this.setState({
              comment: text
            })}
            value={this.state.comment}
            onSubmitEditing={this._sendPiccy}
          />
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Icon
              reverse
              name='paper-plane'
              type='font-awesome'
              color={Colors.tintColor}
              onPress={() => this._sendPiccy(this.state.pictureToEdit)}
              size={26}
            />
            <TouchableOpacity
              onPress={() => this._removeThisRiderCommentFromPartition(this.state)}
            >
              <Text>
                -- or delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }

    _sendPiccy = async () => {

      console.log('debug -- _sendPiccy() this.state is ' + JSON.stringify(this.state));


      if(this.state.newPostMode){
          /// If newPostMode, we have to also put the picture up
          this._putThisToS3(
          this.state.pictureToEdit,
          this.props,
          this.state
        );
      }

      this._putThisRiderComment(this.state);
      
      Alert.alert(
        'Okay la!',
        'Your Post has been updated. Pull to refresh and view your Post.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
      this.props.navigation.navigate('Home');

    }

    _removeThisRiderCommentFromPartition = async (data) => {
      let thePut = await Piney.riderCommentsPut(data.access_token, {
        id: this.state.newPostMode ? null : this.props.navigation.state.params.x.id,         //for some reason, this cannot be set which makes no sense
                          //need to debug in order for Updates to be made properly
                          //this works for BobaOrders PUT  
                          //
                          //
        userId: this.state.newPostMode ? data.user_id : this.props.navigation.state.params.x.user_id ,
        userName: this.state.newPostMode ? data.user_name : this.props.navigation.state.params.x.user_name ,
        commentBody: data.comment,
        stationName: PineyConstants.stationLinesPartitionDeleteKey
      })

      Alert.alert(
        'Shoots..',
        'Your Post has been deleted. Pull to refresh your view.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
      this.props.navigation.navigate('Home');
    }

    _putThisRiderComment = async (data) => {
      /// RiderComment PUT
      /// data expeted to come from this.state
      /// expecting .TheToken, .theUserId

      //let theToken = await AsyncStorage.getItem('@ShukForrestWedding:userToken');
      //let theUserId = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;
      //let theUserName = 'jimmy choo';
      let theCommentBody = 'another one';
      let thePut = await Piney.riderCommentsPut(data.access_token, {
        id: this.state.newPostMode ? null : this.props.navigation.state.params.x.id,         //for some reason, this cannot be set which makes no sense
                          //need to debug in order for Updates to be made properly
                          //this works for BobaOrders PUT  
                          //
                          //
        userId: this.state.newPostMode ? data.user_id : this.props.navigation.state.params.x.user_id ,
        userName: this.state.newPostMode ? data.user_name : this.props.navigation.state.params.x.user_name ,
        commentBody: data.comment,
        stationName: PineyConstants.stationLinesPartition
      })

    }

    _putThisToS3 = async (theMediaUri,theProps,theState) => {
      /// Storage PUT
      /// expecting .TheToken, .theUserId
      let theToken = await AsyncStorage.getItem('@ShukForrestWedding:userToken');
      let theUserId = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;
     
      let theLastRecord = await Piney.riderCommentsFindMyLast(theToken,{
        userId: theUserId
      });

      let theLastRecordResponse = await theLastRecord.json();

      //console.log('theLastRecord is ' + JSON.stringify(theLastRecordResponse));

      const manipResult = await ImageManipulator.manipulate(
        theMediaUri,
        [{ 
          resize: {
            width: 600
          }
        }],
        { format: 'jpeg' }
      );

      const thePath = await fetch(manipResult.uri);
      const theBlob = await thePath.blob();
      const thePut = await Storage.put(
        PineyConstants.postPicturePrefix + theLastRecordResponse.id + '.jpeg',
        theBlob,
        {
          contentType: 'image/jpeg'
        }
      );

    }


/**
    _sendPiccy = async (theMediaUri) => {

      let theFetch = await fetch(theMediaUri);
      let theBlob = await theFetch.blob();
      let theToken = await AsyncStorage.getItem('@ShukForrestWedding:userToken');
      let theUserId = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;

      let theUserName = 'jimmy choo';
      let theCommentBody = 'another one';


      let thePut = await Piney.riderCommentsPut(theToken, {
        id: null,         //for some reason, this cannot be set which makes no sense
                          //need to debug in order for Updates to be made properly
                          //this works for BobaOrders PUT  
                          //
                          //
        userId: theUserId,
        userName: theUserName,
        commentBody: theCommentBody,
      })

      console.log('debug -- thePut after fetching is ' + thePut);

    }
**/
    
}


