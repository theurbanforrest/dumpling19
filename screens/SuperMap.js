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


export default class SuperMap extends React.Component {
  static navigationOptions = {
    header: null,
  };


  //constructor
    constructor(props) {
      super(props);

      this.state = {
        cheeBoiButtonSelected: false
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
        <MapView.Marker
          key={'AlohaWorld1'}
          coordinate={{
            latitude: 21.316714,
            longitude: -157.819206
          }}
          pinColor={'gold'}
          onPress={() => console.log('Marker pressed')}
        >
          <MapView.Callout
            tooltip={false}
            onPress={()=> console.log('Callout pressed')}
            style={{
              //width: 150
            }}
          >
            <View>
              <Text style={{
                color: 'black'}}
              >
                The Big Day @
              </Text>
              <Text style={{
                color: 'black'}}
              >
                Nutridge Estates
              </Text>
              <Text style={{
                color: 'gray'
              }}>
                2780 Nutridge St.
              </Text>
              <Text style={{
                color: 'gray'
              }}>
                Honolulu, HI 96822
              </Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
        <MapView.Marker
          key={'AlohaWorld2'}
          coordinate={{
            latitude: 45.505501, 
            longitude: -122.783539
          }}
          pinColor={'blue'}
          onPress={() => console.log('Marker pressed')}
        >
          <MapView.Callout
            tooltip={false}
            onPress={()=> console.log('Callout pressed')}
            style={{
              //width: 150
            }}
          >
            <View>
              <Text style={{
                color: 'gray'
              }}>
                Cedar Hills PDX
              </Text>
              <Text style={{
                color: 'gray'
              }}>
                Our first apartment!
              </Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
        <MapView.Marker
          key={'AlohaWorld3'}
          coordinate={{
            latitude: 51.513306,
            longitude: -0.129871
          }}
          pinColor={'blue'}
          onPress={() => console.log('Marker pressed')}
        >
          <MapView.Callout
            tooltip={false}
            onPress={()=> console.log('Callout pressed')}
            style={{
              //width: 150
            }}
          >
            <View>
              <Text style={{
                color: 'gray'
              }}>
                London 2017 Trip
              </Text>
              <Text style={{
                color: 'gray'
              }}>
                Harry Potter mania
              </Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
        <MapView.Marker
          key={'AlohaWorld3.1'}
          coordinate={{
            latitude: 22.442815, 
            longitude: 114.164448
          }}
          pinColor={'blue'}
          onPress={() => console.log('Marker pressed')}
        >
          <MapView.Callout
            tooltip={false}
            onPress={()=> console.log('Callout pressed')}
            style={{
              //width: 150
            }}
          >
            <View>
              <Text style={{
                color: 'gray'
              }}>
                Taipo HK
              </Text>
              <Text style={{
                color: 'gray'
              }}>
                Suki's OG hood
              </Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
        <MapView.Marker
          key={'AlohaWorld4'}
          coordinate={{
            latitude: 22.442815, 
            longitude: 114.164448
          }}
          pinColor={'blue'}
          onPress={() => console.log('Marker pressed')}
        >
          <MapView.Callout
            tooltip={false}
            onPress={()=> console.log('Callout pressed')}
            style={{
              //width: 150
            }}
          >
            <View>
              <Text style={{
                color: 'gray'
              }}>
                Taipo HK
              </Text>
              <Text style={{
                color: 'gray'
              }}>
                Suki's OG hood
              </Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
        <MapView.Marker
          key={'AlohaWorld5'}
          coordinate={{
            latitude: 36.129493, 
            longitude: -115.165687
          }}
          pinColor={'blue'}
          onPress={() => console.log('Marker pressed')}
        >
          <MapView.Callout
            tooltip={false}
            onPress={()=> console.log('Callout pressed')}
            style={{
              //width: 150
            }}
          >
            <View>
              <Text style={{
                color: 'gray'
              }}>
                Encore Beach Club
              </Text>
              <Text style={{
                color: 'gray'
              }}>
                #vegaslife
              </Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
         <MapView.Marker
          key={'AlohaWorld6'}
          coordinate={{
            latitude: 47.618397, 
            longitude: -122.191252
          }}
          pinColor={'blue'}
          onPress={() => console.log('Marker pressed')}
        >
          <MapView.Callout
            tooltip={false}
            onPress={()=> console.log('Callout pressed')}
            style={{
              //width: 150
            }}
          >
            <View>
              <Text style={{
                color: 'gray'
              }}>
                Bellevue
              </Text>
              <Text style={{
                color: 'gray'
              }}>
                A quick stint in Seattle
              </Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
        <MapView.Marker
          key={'AlohaWorld7'}
          coordinate={{
            latitude: 40.692809, 
            longitude: -73.986019
          }}
          pinColor={'blue'}
          onPress={() => console.log('Marker pressed')}
        >
          <MapView.Callout
            tooltip={false}
            onPress={()=> console.log('Callout pressed')}
            style={{
              //width: 150
            }}
          >
            <View>
              <Text style={{
                color: 'gray'
              }}>
                Downtown Brooklyn
              </Text>
              <Text style={{
                color: 'gray'
              }}>
                Our home
              </Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
        <MapView.Marker
          key={'AlohaWorld8'}
          coordinate={{
            latitude: 40.731204, 
            longitude: -73.863594
          }}
          pinColor={'blue'}
          onPress={() => console.log('Marker pressed')}
        >
          <MapView.Callout
            tooltip={false}
            onPress={()=> console.log('Callout pressed')}
            style={{
              //width: 150
            }}
          >
            <View>
              <Text style={{
                color: 'gray'
              }}>
                Fidelis
              </Text>
              <Text style={{
                color: 'gray'
              }}>
                Suki's work digs
              </Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
        <MapView.Marker
          key={'AlohaWorld9'}
          coordinate={{
            latitude: 45.523764, 
            longitude: -122.680406
          }}
          pinColor={'blue'}
          onPress={() => console.log('Marker pressed')}
        >
          <MapView.Callout
            tooltip={false}
            onPress={()=> console.log('Callout pressed')}
            style={{
              //width: 150
            }}
          >
            <View>
              <Text style={{
                color: 'gray'
              }}>
                Splash Bar
              </Text>
              <Text style={{
                color: 'gray'
              }}>
                Where we met
              </Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
        <MapView.Marker
          key={'AlohaWorld10'}
          coordinate={{
            latitude: 45.524183, 
            longitude: -122.673583
          }}
          pinColor={'blue'}
          onPress={() => console.log('Marker pressed')}
        >
          <MapView.Callout
            tooltip={false}
            onPress={()=> console.log('Callout pressed')}
            style={{
              //width: 150
            }}
          >
            <View>
              <Text style={{
                color: 'gray'
              }}>
                Barrel Room
              </Text>
              <Text style={{
                color: 'gray'
              }}>
                Forrest and da boyz party spot
              </Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
      </MapView>
    )
  }
}
