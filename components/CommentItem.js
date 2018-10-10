import React from 'react';
import PropTypes from 'prop-types';
import { 
  Button,
  Image,
  Animated,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Avatar, Badge, Icon } from 'react-native-elements';
import { Storage } from 'aws-amplify';
import Colors from '../constants/Colors';
import Piney from '../helpers/Piney';
import PineyConstants from '../constants/PineyConstants';
import Interactions from '../components/Interactions';

const textColor = Colors.primaryText;
const textSize = 14;


/*-- THE COMPONENT --*/
export default class CommentItem extends React.Component {

  constructor(props) {
      super(props);

      let a = this.props.accessToken;
      let b = this.props.userId;

      this.state = {
        fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
        access_token: a ? a : null,
        event_user_id: b ? b : null
      }

    }

  componentWillMount(){
    let { height, width } = Dimensions.get('window');

      this.setState({
        bestHeight: width * 0.9,
        bestWidth: width
      });

    //this._getThePics();
    
  }

  componentDidMount() {
    ///Fade In Animation
    ///
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 2000,              // Make it take a while
      }
    ).start();                        // Starts the animation


    ///Clean up display name
    var a = this.props.userName.replace(/\s/g,'');
    a = a.toLowerCase();
    this.setState({
      userNameForDisplay: a
    })


    ///Get this event's profile pic
    this._getProfilePic();

  }
          
  render(){
    console.log('CommentItem.render() started');
    let { fadeAnim } = this.state;

		return(
			/** Feed Item **/

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: '3%',
        }}>
          <View style={{
            paddingRight: '3%'
          }}>
            <Avatar
              small
              rounded
              source={{ uri: this.state.event_user_profile_pic }}
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
            {this.state.userNameForDisplay}
            <Text style={{fontWeight: 'normal'}}>
              {' '}{this.props.postCopy}
            </Text>
          </Text>
          {
            this._showEditable()
          }
        </View>

		);
  }

  _showEditable(){

    if(this.props.editable == true){
      return(
        <TouchableOpacity
          onPress={()=>console.log('touchable touched')}
        >
          <Icon
            name='ellipsis-h'
            type='font-awesome'
            color={Colors.tabIconDefault}
            onPress={() => this._removeThisCommentEventFromPartition(this.state)}
          />
        </TouchableOpacity>
      )
    }
    else return(<View><Text>Bro</Text></View>)
  }

  _getBobaOrderByUserId = async (accessToken,theUserId) => {

    let theGet = await Piney.bobaOrdersGetById(
        accessToken,
        theUserId);

    console.log('debug -- CommentItem _getBobaOrderByUserId() theGet is ' + JSON.stringify(theGet));
    
    return theGet ? theGet : false;
  }

  _getProfilePic = async () => {
    /// Get the User Pic

    let bobaOrder = await this._getBobaOrderByUserId(this.state.access_token,this.state.event_user_id);
    
    console.log('debug -- CommentItem _getProfilePic bobaOrder is ' + bobaOrder);

    let theFileName = PineyConstants.profilePicturePrefix + bobaOrder[0].id + '.jpeg';

    console.log('debug -- CommentItem _getProfilePic() theFileName is ' + theFileName);

    Storage.get(theFileName)
    .then((response) => {

      this.setState({
        event_user_profile_pic: response
      })
      //console.log('this.state is ' + JSON.stringify(this.state));
      //console.log('this.props is ' + JSON.stringify(this.props));
    })
    .catch((err) => {
      console.log('debug -- CommentDetail _getProfilePic() catch error: ' + err);
    });
  }

  _removeThisCommentEventFromPartition = async (data) => {

      Piney.commentEventsPut(data.access_token, {

        commentEventId: this.props.eventId,

        commentId: this.props.commentId,
        commentUserId: this.props.commentUserId, 
        commentUserName: this.props.commentUserName,

        eventName: this.props.eventName,
        eventUserId: this.props.userId,
        eventUserName: this.props.userName,

        eventBody: this.props.postCopy,
        stationName: PineyConstants.stationLinesPartitionDeleteKey
      })
      .then(() => {
        Alert.alert(
        'Shoots..',
        'Your Comment has been deleted. Pull to refresh your view.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      )
      })
      .catch((err) => console.log('error - CommentItem _removeThisCommentEventFromPartition errored w/ ' + err))



  }
  
}







