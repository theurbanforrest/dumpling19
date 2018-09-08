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

import Piney from '../helpers/Piney';

/*-- THE COMPONENT --*/
const LoadingOverlay = (props: LoadingOverlayProps) => {

  //define constants to take in as props
  //e.g. const { all, the, things } = props
    const {
      isVisible,
      onCancelPress,

    } = props;

  //do functions
    //insert some functions here

  if(isVisible){
    return(
      <View style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <View style={{
          flexDirection: 'column',
          height: '20%',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Icon
            size={48}
            name='hand-peace-o'
            type='font-awesome'
            color='#97ACB3'
          />

          <Text style={{
            color: '#97ACB3',
            fontFamily: 'Menlo',
            fontSize: 24
          }}>
          Loading...
          </Text>
        </View>
        <Badge
          value='Cancel'
          containerStyle={{
            backgroundColor: 'white',
            borderColor: '#97ACB3',
            borderWidth: 1,
          }}
          textStyle={{
            color: '#97ACB3',
            fontSize: 24,
          }}
          onPress={() => Piney.aloha()}
        />
      </View>
    )
  } else return null;
    
}

  //Enter the default values of the props
    LoadingOverlay.defaultProps = {

        isVisible: false,
        onCancelPress: () => console.log('onCancelPress initiated')
    };

  //Define the props here
    LoadingOverlay.propTypes = {

        isVisible: PropTypes.bool,
        onCancelPress: PropTypes.func
    };


export default LoadingOverlay;


/**

//Peace sign as loading icon
<Icon
            size={48}
            name='hand-peace-o'
            type='font-awesome'
            color='#97ACB3'
          />


**/

