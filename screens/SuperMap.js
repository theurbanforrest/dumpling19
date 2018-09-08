import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';
import {
  Button
} from 'react-native-elements';
import { 
  WebBrowser,
  MapView
} from 'expo';

import CoreMapMarkers from '../constants/CoreMapMarkers';
import Colors from '../constants/Colors';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class SuperMap extends React.Component {
  static navigationOptions = {
    header: null,
  };


  //constructor
    constructor(props) {
      super(props);

      this.state = {
      };
    }

  //render

    render() {

    const styles = StyleSheet.create({
      actionButtonIcon: {
          fontSize: 20,
          height: 22,
          color: 'white',
      },
    });

    return(
      <View style={{
        flex: 1
      }}>
        <MapView
          style={{
            flex: 1,
            zIndex: -1
          }}
          initialRegion={{
            latitude: 21.316714,
            longitude: -157.820200,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >

          //Data moved to CoreMapMarkers for reference

          /* ---- CoreMapMarkers via mapping ---- */

            {

                //import CoreMapMarkers
                CoreMapMarkers.map( (marker) => (
                    <MapView.Marker
                      key={marker.lat}
                      coordinate={{
                        latitude: marker.lat,
                        longitude: marker.long
                      }}
                      pinColor={marker.pinColor}
                      onPress={() => console.log(marker.callOut.h1 + ' pressed')}
                    >
                      <MapView.Callout
                        tooltip={false}
                        onPress={() => console.log(marker.callOut.cap1 + ' pressed')}
                        style={{
                          width: 200
                        }}
                      >
                        <View style={{
                          width: '100%'
                        }}>
                          <Text style={{
                            color: Colors.primaryText,
                            fontWeight: 'bold'
                          }}>
                            {marker.callOut.h1}
                          </Text>
                          <Text style={{
                            color: 'gray'
                          }}>
                            {marker.callOut.cap1}
                          </Text>
                        </View>
                      </MapView.Callout>
                    </MapView.Marker>
                  )
                )
            }

          /* ---- End CoreMapMarkers ---- */
        </MapView>

        /*
        <ActionButton buttonColor={Colors.tintColor}>
          <ActionButton.Item buttonColor='#1abc9c' title="Oahu" onPress={() => console.log('howzit')}>
            <Icon name="search" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="#shukforrestadventuretime" onPress={() => console.log('howzit')}>
            <Icon name="search" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
        */
      </View> 

    )
  }
}
