import PropTypes from 'prop-types'
import React from 'react'
import {
  View,
  TouchableHighlight,
  Text,
  Image
} from 'react-native'
import {
  Icon,
  Badge
} from 'react-native-elements'

/*-- THE COMPONENT --*/
const TextTile = (props: TextTileProps) => {

  //define constants to take in as props
  //e.g. const { all, the, things } = props
    const {
      isVisible,
      onCancelPress,

    } = props;

  //do functions
    //insert some functions here


    return(
      <View style={{
        width: '100%',
        backgroundColor: 'gold',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{
          fontFamily: 'Futura-Bold',
          size: 48
        }}>
          Feb. 16
        </Text>
      </View>
    );
    
}

  //Enter the default values of the props
    TextTile.defaultProps = {

        isVisible: false,
        onCancelPress: () => console.log('onCancelPress initiated')
    };

  //Define the props here
    TextTile.propTypes = {

        isVisible: PropTypes.bool,
        onCancelPress: PropTypes.func
    };


export default TextTile;



