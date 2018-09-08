import Colors from './Colors';

const primColor = Colors.tintColor;
const secColor = Colors.inactiveColor

export default
  [
    {
      lat: 45.5135,
      long: -122.6801,
      pinColor: secColor,
      callOut: {
        h1: "Portland",
        cap1: "Adventure #1"
      } 
    },
    {
      lat: 47.6101,
      long: -122.2015,
      pinColor: secColor,
      callOut: {
        h1: "Seattle",
        cap1: "Adventure #2"
      }
    },
    {
      lat: 40.692809,
      long: -73.986019,
      pinColor: secColor,
      callOut: {
        h1: "New York",
        cap1: "Adventure #3"
      }
    },
    {
      lat: 36.1293,
      long: -115.1661,
      pinColor: secColor,
      callOut: {
        h1: "Las Vegas",
        cap1: "Honorable mention"
      }
    },
    {
      lat: 21.316714,
      long: -157.819206,
      pinColor: primColor,
      callOut: {
        h1: "The Big Day @ Nutridge Estate",
        cap1: "3280 Round Top Dr.  Honolulu, HI 96822"
      }
    },
    {
      lat: 21.284270,
      long: -157.838591,
      pinColor: secColor,
      callOut: {
        h1: "Ilikai Condos",
        cap1: "Great AirBnB condos, also has hotel rooms. Beachy vibes, well priced"
      }
    },
    {
      lat: 21.282335, 
      long: -157.837535,
      pinColor: secColor,
      callOut: {
        h1: "Hilton Hawaiian Village",
        cap1: "Resort accomodations with everything you'd need. Upscale choice."
      }
    },

  ];



/*** SuperMap.render() marker data here for ref

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
                Cedar Hills
              </Text>
              <Text style={{
                color: 'gray'
              }}>
                First apartment
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
                London
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
                Vegas
              </Text>
              <Text style={{
                color: 'gray'
              }}>
                #honorablemention
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
                First home away from PDX
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
                Barrel Room
              </Text>
              <Text style={{
                color: 'gray'
              }}>
                #honorablemention
              </Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
        <MapView.Marker
          key={'AlohaWorld10'}
          coordinate={{
            latitude: 45.508944, 
            longitude: -122.666346
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
                OMSI
              </Text>
              <Text style={{
                color: 'gray'
              }}>
                First date
              </Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
        <MapView.Marker
          key={'AlohaWorld11'}
          coordinate={{
            latitude: 41.393311, 
            longitude: 2.161517
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
                Barcelona
              </Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
        <MapView.Marker
          key={'AlohaWorld12'}
          coordinate={{
            latitude: 52.512295, 
            longitude: 13.392826
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
                Berlin
              </Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
**/