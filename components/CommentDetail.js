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
  Keyboard,
  AsyncStorage,
  Dimensions,
  RefreshControl,
  Alert
} from 'react-native';
import {
  Button,
  Avatar,
  Divider
} from 'react-native-elements';
import { 

} from 'expo';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/Colors';

import { MonoText } from '../components/StyledText';
import { EventRegister } from 'react-native-event-listeners';
import LoadingOverlay from '../components/LoadingOverlay';
import { Storage, API } from 'aws-amplify';
import Piney from '../helpers/Piney';
import PineyConstants from '../constants/PineyConstants';
import CommentItem from '../components/CommentItem';



export default class CommentDetail extends React.Component {
  static navigationOptions = {
    title: 'View Post',
  };

  //constructor
    constructor(props) {
      super(props);

      let a = null;
      let b = null;
      let c = null;
      let d = null;

      ///if(this.props.navigation.state.params.x){    //use x for HomeFeed, use item for HomeFeedPaging
      if(this.props.navigation.state.params.item){

        ///Get all the props for the Comment..
        ///

        ///For HomeFeed
        /**
        a = this.props.navigation.state.params.x.id;
        b = this.props.navigation.state.params.x.user_id;
        c = this.props.navigation.state.params.x.user_name;
        d = this.props.navigation.state.params.x.comment_body;
        **/

        ///For HomeFeed.  For HomeFeedPaging, use item instead of
        ///
        a = this.props.navigation.state.params.item.id;
        b = this.props.navigation.state.params.item.user_id;
        c = this.props.navigation.state.params.item.user_name;
        d = this.props.navigation.state.params.item.comment_body;
      }

      ///...and add to state with comment_ prefix
      ///
      this.state = {
        refreshing: false,
        fetchIsLoading: false,
        comment_id: a ? a : '',
        comment_user_id: b ? b : '',
        comment_user_name: c ? c : '',
        comment_copy: d ? d : '',

      }

      console.log('debug -- CommentDetail constructor() this.props is ' + JSON.stringify(this.props))
      console.log('debug -- CommentDetail constructor() this.state is ' + JSON.stringify(this.state))
    }

    async componentWillMount() {


        let theToken = await AsyncStorage.getItem('@ShukForrestWedding:userToken');
        let theUserId = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;

        ///Set the state with the current access token
        ///and the Event's userId to use (aka this user)
        ///
        this.setState({
          access_token: theToken,
          event_user_id: theUserId,

        });



        console.log('debug -- CommentDetail.componentWillMount() this.state is ' + JSON.stringify(this.state));

    }

    async componentDidMount() {

      ///Get all the Events for this Comment
      ///
      await this._getCommentEvents()
      .then((response) => {
        this.setState({
          commentItems: response
        });
        return true;
      })
      .catch((err) => console.log(err));


      ///Get the data of the potential Event's user (aka this user)
      ///
      await this._getBobaOrderByUserId(this.state.access_token,this.state.event_user_id)
      .then((response) => {
        console.log('debug -- CommentDetail.componentDidMount() response is ' + JSON.stringify(response));
        
        ///Set state with the potential Event's data
        ///
        this.setState({
          event_user_name: response[0].name,
          event_user_id: response[0].user_id,
        });
        
      })
      .then(() =>{

        ///Get the picture of the Comment's poster
        ///
        this._getCommentProfilePic(this.state.access_token,this.state.comment_user_id);

      })
      .then(() => {

        ///Get the picture of the Event's poster
        ///
        this._getEventProfilePic(this.state.access_token,this.state.event_user_id);

      })
      .catch((err) => console.log('debug -- CommentDetail componentDidMount() catch error: ' + err));

      var a = this.state.comment_user_name.replace(/\s/g,'');
      a = a.toLowerCase();
      this.setState({
        comment_user_name_for_display: a
      })

      try{
        ///If the Event's user (aka this user) has not RSVP'd, redirect to Profile
        ///
        await this._checkIfHasBobaOrder(this.state.access_token,this.state.event_user_id);
      }
      catch(err){
        console.log('debug -- HomeFeed componentDidMount() _checkIfHasBobaOrder() catch err ' + err);
      }

      console.log('debug -- CommentDetail componentDidMount() at the end, this.state is ' + JSON.stringify(this.state));

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


          <ScrollView style={{
            flexDirection: 'column',
            padding: '3%'
          }}
          contentContainerStyle={{
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          >
            /* Name and Copy Block */
            

              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingRight: '3%',
                paddingTop: '3%'
              }}>
                <View style={{
                  paddingRight: '3%'
                }}>
                  <Avatar
                    small
                    rounded
                    source={{ uri: this.state.comment_user_profile_pic}}
                  />
                </View>
                <Text 
                  style={{
                    //color: textColor,
                    //fontSize: textSize,
                    fontWeight: 'bold',
                    flex: 1,
                    flexGrow: 1
                  }}
                  numberOfLines={10}
                  ellipsizeMode='clip'
                >
                  {this.state.comment_user_name_for_display}
                  <Text style={{fontWeight: 'normal'}}>
                    {' '}{this.state.comment_copy}
                  </Text>
                </Text>
              </View>

              <View style={{
                paddingTop: '6%',
                paddingBottom: '6%'
              }}>
                <Divider style={{ backgroundColor: 'lightgray'}} />
              </View>

              

            /* Comments */

            {

              !this.state.refreshing && this.state.commentItems &&

                this.state.commentItems.map( (x) => (

                  <View
                  key={x.id}>
                    <CommentItem
                      accessToken={this.state.access_token}
                      userName={x.event_user_name}
                      userId={x.event_user_id}
                      postCopy={x.event_body}
                      editable={x.event_user_id == this.state.event_user_id ? true : false}

                      eventId={x.id}
                      eventName={x.event_name}

                      commentId={this.state.comment_id}
                      commentUserId={this.state.comment_user_id}
                      commentName={this.state.comment_user_name}

                    />
                    <View style={{
                      paddingTop: '3%'
                    }}>
                    </View>
                  </View>
                ))
            } 

            

              /** TEXT INPUT **/

              <KeyboardAvoidingView style={{

              }}
                behavior='padding'
                enabled
              >
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}>
                  <View style={{
                    paddingRight: '3%'
                  }}>
                    <Avatar
                      small
                      rounded
                      source={{ uri: this.state.event_user_profile_pic ? this.state.event_user_profile_pic : PineyConstants.defaultProfilePicture }}
                    />
                  </View>
                  <TextInput
                    style={{
                      width: '50%',
                      fontSize: 14,
                    }}
                    multiline={true}
                    placeholder={'Tap to Comment..'}
                    numberOfLines={8}
                    onChangeText={(text) => this.setState({
                      quote_body: text
                    })}
                    value={this.state.quote_body}
                    onSubmitEditing={this._sendCommenty}
                  />
                </View>
              </KeyboardAvoidingView>
          </ScrollView>
            
      )
    }

  _onRefresh = () => {
    console.log('_onRefresh started');

    this.componentDidMount();

    console.log('_onRefresh ended');
    
  }

  _getCommentEvents = async () => {

    let theToken = await AsyncStorage.getItem('@ShukForrestWedding:userToken');
    let theUserId = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;
     
    let theGet = await Piney.commentEventsGetByPartition(theToken,{
      commentId: this.state.comment_id
    });
    let theGetResponse = await theGet.json();

    console.log('debug -- _getCommentEvents() theGetResponse is ' + JSON.stringify(theGetResponse));
    return theGetResponse;

  }

  _getBobaOrderByUserId = async (accessToken,theUserId) => {

    let theGet = await Piney.bobaOrdersGetById(
        accessToken,
        theUserId);

    console.log('debug -- _getBobaOrderByUserId() theGet is ' + JSON.stringify(theGet));
    
    return theGet ? theGet : false;
  }

  _sendCommenty = async () => {

    ///If user has not RSVP'd, kill the send and redirect to Profile
    ///
    this._checkIfHasBobaOrder(this.state.access_token,this.state.event_user_id)
    .then((didReturn) => {

      console.log('debug -- CommentDetail _sendCommenty didReturn is ' + didReturn);
      if(!didReturn){
        console.log('debug -- CommentDetail _sendCommenty didReturn is not true. Will not send.');
        return false;
      }

      ///else continue
      ///
      console.log('debug -- CommentDetail _sendCommenty() _checkIfHasBobaOrder did not error, send comment now')
      console.log('debug -- CommentDetail _sendCommenty() this.state is ' + JSON.stringify(this.state));
      
      ///Post the CommentEvent for this user
      ///
      this._postThisCommentEvent(this.state);
      

      ///Alert the user of success...
      ///
      Alert.alert(
        'Raja!',
        'Your Comment has been posted.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )

      ///...and redirect to HomeFeed
      ///
      this.props.navigation.navigate('Home');
      
    })
    .catch((err) => {
      console.log('CommentDetail _checkIfHasBobaOrder catch err' + err);
      Alert.alert(
          'Howzit!',
          PineyConstants.pleaseRsvpMessage,
          [
            {
              text: 'OK',
              onPress: () => this.props.navigation.navigate('Profile')
            }
          ],
          { cancelable: false }
        )
    })
  }

  _postThisCommentEvent = async (data) => {


      let thePost = await Piney.commentEventsPost(data.access_token, {
        commentId: data.comment_id,
        commentUserId: data.comment_user_id,
        commentUserName: data.comment_user_name,
        eventName: 'quote',
        eventUserName: data.event_user_name,
        eventUserId: data.event_user_id,
        eventBody: data.quote_body
      })

    }

  _getCommentProfilePic = async (accessToken,userId) => {
    /// Get the User Pic

    let theBobaOrder = await this._getBobaOrderByUserId(accessToken,userId);

    console.log('debug -- CommentDetail _getCommentProfilePic() theBobaOrder is ' + JSON.stringify(theBobaOrder));

    let theFileName = PineyConstants.profilePicturePrefix + this.state.comment_user_id + '.jpeg';

    console.log('debug -- CommentDetail _getCommentProfilePic() theFileName is ' + theFileName);

    Storage.get(theFileName)
    .then((response) => {

      this.setState({
        comment_user_profile_pic: response
      })
      //console.log('this.state is ' + JSON.stringify(this.state));
      //console.log('this.props is ' + JSON.stringify(this.props));
    })
    .catch((err) => {
      console.log('debug -- CommentDetail _getCommentProfilePic() catch error: ' + err);
    });
  }

  _getEventProfilePic = async (accessToken,userId) => {
    /// Get the User Pic

    let bobaOrder = await this._getBobaOrderByUserId(accessToken,userId);
    let theFileName = PineyConstants.profilePicturePrefix + bobaOrder[0].id + '.jpeg';

    console.log('debug -- CommentDetail _getEventProfilePic() theFileName is ' + theFileName);

    Storage.get(theFileName)
    .then((response) => {

      this.setState({
        event_user_profile_pic: response
      })
      //console.log('this.state is ' + JSON.stringify(this.state));
      //console.log('this.props is ' + JSON.stringify(this.props));
    })
    .catch((err) => {
      console.log('debug -- CommentDetail _getCommentProfilePic() catch error: ' + err);
    });
  }

  _checkIfHasBobaOrder = async (accessToken,userId) => {


    let a = await this._getBobaOrderByUserId(accessToken,userId);

    let didReturn = a[0].id ? true : false;
      try{ a[0].id; }
      catch(e) {
          Alert.alert(
          'Howzit!',
          PineyConstants.pleaseRsvpMessage,
          [
            {
              text: 'OK',
              onPress: () => this.props.navigation.navigate('Profile')
            }
          ],
          { cancelable: false }
        )
      }

    return didReturn;
  }

}

/**

  <KeyboardAvoidingView style={{
            backgroundColor: this.state.order_accepted ? Colors.secondaryBackground : Colors.primaryBackground,
            padding: '3%',
            width: '100%',
          }}
            behavior='padding'
            enabled
          >
  </KeyboardAvoidingView>
**/

/**

 //Main Post
              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                paddingBottom: '10%',
                borderBottomWidth: 0.5,
                borderColor: 'gray',
                width: '100%'
              }}>
                <View style={{
                  paddingRight: '3%'
                }}>
                <Avatar
                  small
                  rounded
                  source={{ uri: '' }}
                />
                </View>
                <View>
                  <Text 
                    style={{
                      //color: textColor,
                      //fontSize: textSize,
                      fontWeight: 'bold',
                      flex: 1,
                      flexGrow: 1
                    }}
                    numberOfLines={10}
                    ellipsizeMode='clip'
                  >
                    {this.props.navigation.state.params.x.user_name}
                    <Text style={{fontWeight: 'normal'}}>
                      {''} {this.props.navigation.state.params.x.comment_body}
                    </Text>
                  </Text>
                </View>
              </View>

              **/
