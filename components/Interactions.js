import React from 'react';
import PropTypes from 'prop-types';
import { 
  Button,
  Image,
  Animated,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Avatar, Badge, Icon } from 'react-native-elements';
import { Storage } from 'aws-amplify';
import Colors from '../constants/Colors';
import Piney from '../helpers/Piney';
import PineyConstants from '../constants/PineyConstants';


/*-- THE COMPONENT --*/
export default class FeedItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      numberOfLikes: this.props.yolo,
    }
  }

  componentWillMount(){
    
  }

  componentDidMount() {

  }
          
  render(){

		return(
      <View style={{
        
      }}>

      {this._showHeartAndComment()}

      {this._showLikesCounter()}

      {this._showViewComments()}

      </View>
		);
  }

  _showHeartAndComment(){
    if(this.props.showHeartAndComment){
      return(
        /* Heart and Comment */
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-end'
          }}>
            <View style={{
              padding: '3%'
            }}>
              <Icon
                name='heart'
                type='font-awesome'
                color={Colors.errorBackground}
                onPress={() => console.log('')}
                size={30}
              />
            </View>
            <View style={{
              padding: '3%'
            }}>
              <Icon
                name='comment-o'
                type='font-awesome'
                color={Colors.primaryText}
                onPress={this.props.addCommentFunc}
                size={31}
              />
            </View>
          </View>

      );
    }

    else return(<View></View>);
  }

  _showViewComments(){
    if(this.props.showViewComments){
      return(
        <View style={{
          flex: 1,
          flexDirection: 'row',
          paddingLeft: '3%'
        }}>
          <TouchableOpacity
            onPress={this.props.addCommentFunc}
          >
            <Text style={{
              color: 'gray'
            }}>
              View All Comments...
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    else return(<View></View>);
  }

  _showLikesCounter(){
    if(this.state.numberOfLikes > 0){
      return(
        <View style={{
            flex: 1,
            flexDirection: 'row',
            paddingLeft: '3%'
          }}>
            <Text style={{
              color: Colors.primaryText,
              fontWeight: 'bold'
            }}>
              {this.state.numberOfLikes} likes
            </Text>
          </View>
      );
    }
    else return(<View></View>);
  }

  _addComment(){

    let metaData = this.props.metaData;
    this.props.navvy.navigate('Comment',{
      metaData
    });
  }

}







