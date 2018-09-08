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
export default class FeedItem extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
        fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
      }

    }

  componentWillMount(){
    let { height, width } = Dimensions.get('window');

      this.setState({
        bestHeight: width * 0.9,
        bestWidth: width
      });

    this._getThePics();
    
  }

  componentDidMount() {
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 2000,              // Make it take a while
      }
    ).start();                        // Starts the animation

    var a = this.props.userName.replace(/\s/g,'');
    a = a.toLowerCase();
    this.setState({
      userNameForDisplay: a
    })

  }
          
  render(){
    console.log('FeedItem.render() started');
    let { fadeAnim } = this.state;

		return(
			/** Feed Item **/
            <Animated.View style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              paddingTop: '3%',
              opacity: fadeAnim
            }}>

              /* Header pic + name */
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '3%'
              }}>
                <View style={{
                  flex: 10,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <Avatar
                    small
                    rounded
                    source={{ uri: this.state.getProfPic }}
                  />
                  <Text style={{
                    color: textColor,
                    fontSize: textSize,
                    fontWeight: 'bold',
                    paddingLeft: '3%'
                  }}>
                    {this.state.userNameForDisplay}
                  </Text>
                </View>
                <View style={{
                  flex: 2,
                  justifyContent: 'flex-end',
                }}>

                {this._showEditable()}
                  
                </View>
              </View>
              <Image
                source={{ uri: this.state.getPostImage }}
                style={{
                	height: this.state.bestHeight,
                	width: this.state.bestWidth,
                 	resizeMode: 'cover'
                }}
                onLoadStart={console.log('Image did onLoadStart')}
                onLoadEnd={console.log('Image did onLoadEnd')}
                loadingIndicatorSource={require('../assets/images/gray-pine.png')}
              />
              /* Interactions */
              <Interactions
                showHeartAndComment={true}
                yolo={12}
              />
              /* Name and Copy Block */
              <View style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                padding: '3%',
                width: '100%',
              }}>
                  <Text 
                    style={{
                      color: textColor,
                      fontSize: textSize,
                      fontWeight: 'bold',
                      flex: 1,
                      flexGrow: 1
                    }}
                    numberOfLines={10}
                    ellipsizeMode='clip'
                  >
                    {this.state.userNameForDisplay}
                    <Text style={{fontWeight: 'normal'}}>
                      {''} {this.props.postCopy}
                    </Text>
                  </Text>
              </View>
              /* View Comments */
              <Interactions
                showViewComments={true}
              />
            </Animated.View>
		);
  }

  _getThePics(){

    /// Get the User Pic
    Storage.get(this.props.userPic)
    .then((response) => {

      this.setState({
        getProfPic: response
      })
      //console.log('this.state is ' + JSON.stringify(this.state));
      //console.log('this.props is ' + JSON.stringify(this.props));

    })
    .then(() => {

      /// Get the Post Image
      Storage.get(this.props.postImage)
      .then((response) => {
        this.setState({
          getPostImage: response
        })
        console.log('this.state is ' + JSON.stringify(this.state));
        console.log('this.props is ' + JSON.stringify(this.props));
      })
      .catch((err) => console.log('some error with getPostImage'))
    })
    .catch((err) => console.log('some error with getProfPic'));

  }

  _showEditable(){
    if(this.props.editable){
      return(
        <TouchableOpacity
          onPress={()=>console.log('touchable touched')}
        >
          <Icon
            name='ellipsis-h'
            type='font-awesome'
            color={Colors.tintColor}
            onPress={this.props.onActionPress}
          />
        </TouchableOpacity>
      )
    }
  }

  
}







