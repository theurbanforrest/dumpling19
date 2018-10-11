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
  Dimensions,
  RefreshControl,
  Alert,
  FlatList
} from 'react-native';
import {
  Button,
  FormLabel,
  FormInput,
  Avatar
} from 'react-native-elements';
import { 
  WebBrowser,
  ImagePicker,
  ImageManipulator,
  Permissions
} from 'expo';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/Colors';

import { MonoText } from '../components/StyledText';
import { EventRegister } from 'react-native-event-listeners';
import LoadingOverlay from '../components/LoadingOverlay';
import FeedItem from '../components/FeedItem'; 
import { Storage, API } from 'aws-amplify';
import HomeFeedItems from '../constants/HomeFeedItems';
import Piney from '../helpers/Piney';
import PineyConstants from '../constants/PineyConstants';



export default class HomeFeed extends React.Component {
  static navigationOptions = {
    title: '#shukforrestwedding',
  };

  //constructor
    constructor(props) {
      super(props);

      this.state = {
        refreshing: false,
        fetchIsLoading: false,
        awsPicture: 'https://randomuser.me/api/portraits/women/59.jpg'
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

        let theToken = await AsyncStorage.getItem('@ShukForrestWedding:userToken');
        let theUserId = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;
     
        let theBobaOrder = await this._getBobaOrderByUserId(theToken,theUserId);

        this.setState({
          access_token: theToken,
          user_id: theUserId,
          boba_order: theBobaOrder,
        });

        console.log('debug -- HomeFeed componentDidMount this.state is ' + JSON.stringify(this.state));

        
    }

    async componentDidMount() {

      await this._getRiderComments()
      .then((response) => {
        this.setState({
          feedItems: response
        });
        return true;
      })
      .catch((err) => console.log(err));

      //console.log('debug -- HomeFeed componentDidMount() this.state.feedItems is ' + JSON.stringify(this.state.feedItems));

      try{
        await this._checkIfHasBobaOrder(this.state.access_token,this.state.user_id);
      }
      catch(err){
        //console.log('debug -- HomeFeed componentDidMount() _checkIfHasBobaOrder() catch err ' + err);
      }

      //await this._listBucketObjects();
    }
      
  //render

    render() {

      let { image } = this.state;
      //console.log('this.state is ' + JSON.stringify(this.state));

      let { height, width } = Dimensions.get('window');

      const bestHeight = width * 0.9;
      const bestWidth = width;
      const styles = StyleSheet.create({
        actionButtonIcon: {
            fontSize: 20,
            height: 22,
            color: 'white',
        },
      });
    
      //Else free to proceed
      return(
        <View style={{
          position: 'relative'
        }}>
          <ScrollView style={{
            flexDirection: 'column',
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          >

          {

            !this.state.refreshing && this.state.feedItems &&


              <FlatList
                data={this.state.feedItems}
                renderItem={ ({ item }) => (
                  <FeedItem
                    key={item.id}
                    accessToken={this.state.access_token}
                    editable={item.user_id == this.state.boba_order[0].id ? true : false} 
                    userName={item.user_name}
                    userId={item.user_id}
                    postId={item.id}
                    postImage={encodeURI(PineyConstants.postPicturePrefix + item.id + '.jpeg')}
                    postCopy={item.comment_body}
                    onActionPress={() => this.props.navigation.navigate('Edit',{
                        item
                      })
                    }
                    addCommentPress={() => this.props.navigation.navigate('Comment',{
                      item
                    })}
                    firstComment={this._getLastCommentEvent(item.id)}
                  />
                )}
                keyExtractor={item => encodeURI('stringMe-' + item.id)}
                //onEndReached={() => this._getRiderComments(this.state.fetchSize)}
              />

              /**

              this.state.feedItems.map( (x) => (

                  <FeedItem
                    key={x.id}
                    accessToken={this.state.access_token}
                    editable={x.user_id == this.state.user_id ? true : false}
                    userName={x.user_name}
                    userId={x.user_id}
                    postImage={encodeURI(PineyConstants.postPicturePrefix + x.id + '.jpeg')}
                    postCopy={x.comment_body}
                    onActionPress={() => this.props.navigation.navigate('Edit',{
                        x
                      })
                    }
                    addCommentPress={() => this.props.navigation.navigate('Comment',{
                      x
                    })}
                  /> 
              ))
              **/

          }  
          </ScrollView>
          <ActionButton buttonColor={Colors.tintColor}>
            <ActionButton.Item buttonColor={Colors.secondaryBackground} title="+ Smile!" onPress={() => this._takePictureWithCamera()}>
              <Icon name="camera" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor={Colors.secondaryBackground} title="+ Add Memory" onPress={() => this._pickFromLibrary()}>
              <Icon name="image" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>

        </View>
      )
    }

    componentWillUnmount() {

      EventRegister.removeEventListener(this.listener);
      
    }

  _onRefresh = () => {
    console.log('_onRefresh started');

    this.componentDidMount();

    console.log('_onRefresh ended');
    
  }

  _listBucketObjects = async () => {

    Storage.list('')
    .then(result => console.log('debug -- HomeFeed _listBucketObjects() returned ' + JSON.stringify(result)))
    .catch(err => console.log(err));

  }

  _getRiderComments = async () => {

    let theToken = await AsyncStorage.getItem('@ShukForrestWedding:userToken');
    let theUserId = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;
     
    let theGet = await Piney.riderCommentsGetByPartition(theToken,{});
    let theGetResponse = await theGet.json();

    //console.log('debug -- HomeFeed _getRiderComments() theGetResponse is ' + JSON.stringify(theGetResponse));
    return theGetResponse;

  }

  _getBobaOrderByUserId = async (accessToken,theUserId) => {

    let theGet = await Piney.bobaOrdersGetById(
        accessToken,
        theUserId);

    console.log('debug -- _getBobaOrderByUserId() theGet is ' + JSON.stringify(theGet));
    
    return theGet ? theGet : false;
  }

  _takePictureWithCamera = async () => {

    /// Get permission to use camera
    const { cameraPermissionStatus } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ hasCameraPermission: cameraPermissionStatus === 'granted' });

    if(this.state.hasCameraPermission != 'granted'){
      Alert.alert(
          'Auwee..',
          "You must allow Expo to access your camera to add a memory",
          [
            {
              text: 'OK',
            }
          ],
          { cancelable: false }
        );

      return false;
    }

    /// Else continue

    let result = await ImagePicker.launchCameraAsync({});

    //console.log(result);
    //console.log('the result.uri is ' + result.uri); 

      const manipResult = await ImageManipulator.manipulate(
        result.uri,
        [{ 
          resize: {
            width: 600
          }
        }],
        { format: 'jpeg' }
      );

    EventRegister.emit('pictureTaken', result);
    //console.log('emitted pictureTaken');
  }

  _pickFromLibrary = async () => {

    /// Get permission to use camera
    const { cameraRollPermissionStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({ hasCameraRollPermission: cameraRollPermissionStatus === 'granted' });

    if(this.state.hasCameraRollPermission != 'granted'){
      Alert.alert(
          'Auwee..',
          "You must allow Expo to access your camera roll to add a memory",
          [
            {
              text: 'OK',
            }
          ],
          { cancelable: false }
        );

      return false;
    }

    /// Else continue


    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    //console.log(result);
    //console.log('the result.uri is ' + result.uri); 

      const manipResult = await ImageManipulator.manipulate(
        result.uri,
        [{ 
          resize: {
            width: 600
          }
        }],
        { format: 'jpeg' }
      );

      EventRegister.emit('pictureTaken', manipResult);
      //console.log('emitted pictureTaken');

      //const thePath = await fetch(manipResult.uri);
      //const theBlob = await thePath.blob();
      
  }

  _checkIfHasBobaOrder = async (userId) => {

    let a = await this._getBobaOrderByUserId(this.state.access_token,this.state.user_id);

      try{ a[0].id; }
      catch(e) {

          //console.log('debug -- HomeFeed _checkIfHasBobaOrder catch error ' + e);

          Alert.alert(
          'Howzit!',
          "Looks like you haven't submitted your RSVP yet. Let's get that done now!",
          [
            {
              text: 'OK',
              onPress: () => this.props.navigation.navigate('Profile')
            }
          ],
          { cancelable: false }
        )
      }
  }

  _getLastCommentEvent = async (theId) => {

    let theGet = await Piney.riderCommentsCommentEventsGet(
      this.state.access_token,
      theId
    );

    //console.log('debug -- HomeFeed _getLastCommentEvent() returns ' + JSON.stringify(theGet));

    return theGet;
  }

}