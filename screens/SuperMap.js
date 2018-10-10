import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';
import {
  Button,
  Avatar
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
        mapFilter: 'shukforrest'
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
            latitudeDelta: 0.3,
            longitudeDelta: 0.3,
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
                      pinColor={this.state.mapFilter == marker.category ? Colors.errorBackground : Colors.inactiveColor}
                      onPress={() => this.setState({
                        focusOn: this._replTrimLower(marker.callOut.h1)
                        })
                      }
                      >
                      <MapView.Callout
                        tooltip={false}
                        onPress={() => console.log(marker.callOut.cap1 + ' pressed')}
                        style={{
                          width: 200
                        }}
                      >
                        <View style={{
                          maxWidth: '100%'
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

            /* ---- Nutridge is always shown --- */


            <MapView.Marker
                      coordinate={{
                        latitude: 21.316714,
                        longitude: -157.819206
                      }}
                      pinColor={Colors.tintColor}
                      onPress={() => this.setState({focusOn: this._replTrimLower('The Big Day at Nutridge Estate')})}
                    >
                      <MapView.Callout
                        tooltip={false}
                        //onPress={() => console.log(marker.callOut.cap1 + ' pressed')}
                        style={{
                          width: 200
                        }}
                      >
                        <View style={{
                          maxWidth: '100%'
                        }}>
                          <Text style={{
                            color: Colors.primaryText,
                            fontWeight: 'bold'
                          }}>
                            The Big Day @ Nutridge Estate
                          </Text>
                          <Text style={{
                            color: 'gray'
                          }}>
                            3280 Round Top Dr.  Honolulu, HI 96822
                          </Text>
                        </View>
                      </MapView.Callout>
                    </MapView.Marker>

          /* ---- End CoreMapMarkers ---- */
        </MapView>

        <ActionButton buttonColor={Colors.tintColor}>
          <ActionButton.Item buttonColor={this.state.mapFilter == 'lodging' ? Colors.errorBackground : Colors.inactiveColor } 
            title="Lodging"
            onPress={() => this.setState({mapFilter: 'lodging'})}>
              <Icon name="filter" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor={this.state.mapFilter == 'outdoors' ? Colors.errorBackground : Colors.inactiveColor } 
            title="Outdoors"
            onPress={() => this.setState({mapFilter: 'outdoors'})}>
              <Icon name="filter" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor={this.state.mapFilter == 'food' ? Colors.errorBackground : Colors.inactiveColor } 
            title="Food"
            onPress={() => this.setState({mapFilter: 'food'})}>
              <Icon name="filter" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor={this.state.mapFilter == 'drink' ? Colors.errorBackground : Colors.inactiveColor } 
            title="Drink"
            onPress={() => this.setState({mapFilter: 'drink'})}>
              <Icon name="filter" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>

        /* -- Avatar -- */


      </View> 

    )
  }

  _replTrimLower(str){
    let x = str.replace(/\s/g,'');
    let y = x.trim();
    let z = y.toLowerCase();

    return z;
  }

}

/**
        <View style={{
          position: 'absolute',
          bottom: 10,
          left: 10
        }}>
          <Avatar
              xlarge
              rounded
              source={require('../assets/images/engaged.png')}
            />
        </View>
        **/
