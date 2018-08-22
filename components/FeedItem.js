import React from 'react';
import PropTypes from 'prop-types';
import { 
  Button,
  Image,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Avatar, Badge } from 'react-native-elements';
import { Storage } from 'aws-amplify';
import Colors from '../constants/Colors';

const textColor = Colors.primaryText;
const textSize = 14;


/*-- THE COMPONENT --*/
export default class FeedItem extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
      }
    }

  componentWillMount(){
    let { height, width } = Dimensions.get('window');

      this.setState({
        bestHeight: width * 0.9,
        bestWidth: width
      });

    Storage.get(this.props.userPic)
    .then((response) => {

      this.setState({
        getProfPic: response
      })
      console.log('this.state is ' + JSON.stringify(this.state));
      console.log('this.props is ' + JSON.stringify(this.props));

    })
    .then(() => {
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
          
  render(){
		return(
			/** Feed Item **/
            <View style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              paddingTop: '3%',
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '3%'
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
                    {this.props.userName}
                  </Text>
              </View>
              <Image
                source={{ uri: this.state.getPostImage }}
                style={{
                	height: this.state.bestHeight,
                	width: this.state.bestWidth,
                 	resizeMode: 'center'
                }}
                onLoadStart={console.log('Image did onLoadStart')}
                onLoadEnd={console.log('Image did onLoadEnd')}
                loadingIndicatorSource={require('../assets/images/gray-pine.png')}
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
                    {this.props.userName}
                    <Text style={{fontWeight: 'normal'}}>
                      {''} {this.props.postCopy}
                    </Text>
                  </Text>
              </View>
            </View>
		);
  }
}







