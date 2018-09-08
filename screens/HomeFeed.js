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
  Alert
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
  ImageManipulator
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

        //EventRegister > fetchIsLoading
        this.listener = EventRegister.addEventListener('fetchIsLoading', (fetchIsLoading) => {
            console.log('fetchIsLoading emitted with ' + fetchIsLoading);
            this.setState({
                fetchIsLoading,
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
     
        this.setState({
          access_token: theToken,
          user_id: theUserId
        });

        
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

      let a = await this._getBobaOrderByUserId(this.state.user_id);

      try{ a[0].id; }
      catch(e) {
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

              this.state.feedItems.map( (x) => (

                  <FeedItem
                    key={x.id}
                    editable={x.user_id == this.state.user_id ? true : false}
                    userName={x.user_name}
                    //userPic={this._getBobaOrderByUserId(x.user_id)}
                    postImage={encodeURI(PineyConstants.postPicturePrefix + x.id + '.jpeg')}
                    postCopy={x.comment_body}
                    onActionPress={() => this.props.navigation.navigate('Edit',{
                        x
                      })
                    }
                  /> 
              ))
          }  
          
          </ScrollView>

          <ActionButton buttonColor={Colors.tintColor}>
            <ActionButton.Item buttonColor='#1abc9c' title="+ From Camera" onPress={() => this._takePictureWithCamera()}>//{() => this.props.navigation.navigate('Start')}>
              <Icon name="camera" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#1abc9c' title="+ From Phone" onPress={() => this._pickFromLibrary()}>//{() => this.props.navigation.navigate('Start')}>
              <Icon name="image" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        </View>
      )
    }

  _onRefresh = () => {
    console.log('_onRefresh started');

    this.componentDidMount();

    console.log('_onRefresh ended');
    
  }

  _getRiderComments = async () => {

    let theToken = await AsyncStorage.getItem('@ShukForrestWedding:userToken');
    let theUserId = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;
     
    let theGet = await Piney.riderCommentsGetByPartition(theToken,{});
    let theGetResponse = await theGet.json();

    console.log('debug -- _getRiderComments() theGetResponse is ' + JSON.stringify(theGetResponse));
    return theGetResponse;

  }

  _getBobaOrderByUserId = async (theUserId) => {

    let theGet = await Piney.bobaOrdersGetById(
        this.state.access_token,
        theUserId);

    console.log('debug -- _getBobaOrderByUserId() theGet is ' + JSON.stringify(theGet));
    
    return theGet ? theGet : false;
  }

  _takePictureWithCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({});

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

    EventRegister.emit('pictureTaken', result);
    console.log('emitted pictureTaken');
  }

  _pickFromLibrary = async () => {
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

      EventRegister.emit('pictureTaken', manipResult);
      console.log('emitted pictureTaken');

      //const thePath = await fetch(manipResult.uri);
      //const theBlob = await thePath.blob();
      
  }
    /**
      <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
        <Icon name="md-create" style={styles.actionButtonIcon} />
      </ActionButton.Item>
      <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
        <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
      </ActionButton.Item>
    **/

}