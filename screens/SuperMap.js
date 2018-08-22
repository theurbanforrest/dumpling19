import React from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';
import {
  Button
} from 'react-native-elements';
import { 
  WebBrowser,
  MapView
} from 'expo';

import CoreMapMarkers from '../constants/CoreMapMarkers';

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

    return(
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 34.080397,
          longitude: -118.067417,
          latitudeDelta: 144.0,
          longitudeDelta: 144.0,
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
                        //width: 150
                      }}
                    >
                      <View>
                        <Text style={{
                          color: 'gray'
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
    )
  }
}
