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
  Avatar,
} from 'react-native-elements';
import { 

} from 'expo';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/Colors';

import { MonoText } from '../components/StyledText';
import { EventRegister } from 'react-native-event-listeners';
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
        awsPicture: 'https://randomuser.me/api/portraits/women/59.jpg',
        selected: (new Map(): Map<string, boolean>),
        feedItems: [],
        endOfFeedIndex: 0,
        fetchSize: 2,
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

        /***
        //EventRegister > fetchIsLoading
        this.listener = EventRegister.addEventListener('fetchIsLoading', (fetchIsLoading) => {
            console.log('fetchIsLoading emitted with ' + fetchIsLoading);
            this.setState({
                fetchIsLoading,
            })
        })
        ***/

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

      await this._getRiderComments(this.state.fetchSize)
      .then((response) => {
        this.setState({
          feedItems: response
        });
        return true;
      })
      .catch((err) => console.log(err));

      try{
        await this._checkIfHasBobaOrder(this.state.access_token,this.state.user_id);
      }
      catch(err){
        console.log('debug -- HomeFeed componentDidMount() _checkIfHasBobaOrder() catch err ' + err);
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

      console.log('debug -- HomeFeedPaging render() this.state.feedItems ' + JSON.stringify(this.state.feedItems));

    
      //Else free to proceed
      return(
        <View style={{
          position: 'relative'
        }}>


          <FlatList
            data={this.state.feedItems}
            renderItem={ ({ item }) => (
              <FeedItem
                key={item.id}
                accessToken={this.state.access_token}
                editable={item.user_id == this.state.user_id ? true : false}
                userName={item.user_name}
                userId={item.user_id}
                postImage={encodeURI(PineyConstants.postPicturePrefix + item.id + '.jpeg')}
                postCopy={item.comment_body}
                onActionPress={() => this.props.navigation.navigate('Edit',{
                    item
                  })
                }
                addCommentPress={() => this.props.navigation.navigate('Comment',{
                  item
                })}
              />
            )}
            keyExtractor={item => encodeURI('stringMe-' + item.id)}
            onEndReached={() => this._getRiderComments(this.state.fetchSize)}
          />

          >
          /***
          {

            !this.state.refreshing && this.state.feedItems &&

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
          }  
          ***/



          <ActionButton buttonColor={Colors.tintColor}>
            <ActionButton.Item buttonColor='#1abc9c' title="+ Smile!" onPress={() => this._takePictureWithCamera()}>
              <Icon name="camera" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item buttonColor='#1abc9c' title="+ Add Memory" onPress={() => this._pickFromLibrary()}>
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

  _getRiderCommentsCountByPartition = async () => {

  }

  _getRiderComments = async (fetchSize) => {

    let x = fetchSize ? fetchSize : 1;

    let z = this.state.endOfFeedIndex + fetchSize;

    console.log('debug -- HomeFeedPaging _getRiderComments() z is ' + z);

    let theToken = await AsyncStorage.getItem('@ShukForrestWedding:userToken');

    let theGet = await Piney.riderCommentsGetByPartitionPaginate(theToken,{},fetchSize,this.state.endOfFeedIndex);
    let theGetResponse = await theGet.json();

    console.log('debug -- HomeFeed _getRiderComments() theGetResponse is ' + JSON.stringify(theGetResponse));
    
    this.setState({
      feedItems: [...this.state.feedItems, theGetResponse],
      endOfFeedIndex: this.state.endOfFeedIndex + fetchSize
    })

    console.log('debug -- HomeFeedPaging _getRiderComments this.state.feedItems is ' + JSON.stringify(this.state.feedItems));
    console.log('debug -- HomeFeedPaging _getRiderComments this.state.endOfFeedIndex is ' + JSON.stringify(this.state.endOfFeedIndex));

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

  _checkIfHasBobaOrder = async (userId) => {

    let a = await this._getBobaOrderByUserId(this.state.access_token,this.state.user_id);

      try{ a[0].id; }
      catch(e) {

          console.log('debug -- HomeFeed _checkIfHasBobaOrder catch error ' + e);

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


}