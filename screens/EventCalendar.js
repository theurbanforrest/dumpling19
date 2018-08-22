import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  KeyboardAvoidingView,
  AsyncStorage,
  Alert
} from 'react-native';
import {
  Button,
  FormLabel,
  FormInput,
  Icon,
  Tile
} from 'react-native-elements';
import { 
  Camera,
  Permissions,
  Asset 
} from 'expo';

import { EventRegister } from 'react-native-event-listeners';
import LoadingOverlay from '../components/LoadingOverlay';
import CameraExample from '../components/CameraExample';
import Colors from '../constants/Colors';

export default class EventCalendar extends React.Component {
  static navigationOptions = {
    title: 'The Big Day',
  };

  //constructor
    constructor(props) {
      super(props);

      this.state = {
        fetchIsLoading: false,
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
        photo: {}
      }
    }

    async componentWillMount() {

      //EventRegister > myCustomEvent
        this.listener = EventRegister.addEventListener('myCustomEvent', (data) => {
          this.setState({
              data,
          })
        })

      //EventRegister > setAccessKey
        this.listener = EventRegister.addEventListener('setAccessKey', (accessKey) => {
            this.setState({
                accessKey,
            })
        })

        //EventRegister > fetchIsLoading
        this.listener = EventRegister.addEventListener('fetchIsLoading', (fetchIsLoading) => {
            console.log('fetchIsLoading emitted with ' + fetchIsLoading);
            this.setState({
                fetchIsLoading,
            })
        })

        //Permission to use Camera
        const { cameraPermissionStatus } = await Permissions.askAsync(Permissions.CAMERA);
          this.setState({ hasCameraPermission: cameraPermissionStatus === 'granted' });

        //Permission to use Camera Roll
        const { cameraRollPermissionStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          this.setState({ hasCameraPermission: cameraRollPermissionStatus === 'granted' });
    
    }

    componentDidMount() {
      
    }

  //render
  render(){

    console.log('EventCalendar renders');

    return(
        <View style={{
          position: 'relative'
        }}>
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}>
            <Image source={require('../assets/images/bg-piney.png')}
            />
          </View>
          <ScrollView
            style={{
              backgroundColor: 'transparent',
              flexDirection: 'column',
            }}
          >
            <View style={{
              flex: 1
            }}>
              <Image
                source={require('../assets/images/nutridge-overlook.png')}
                style={{
                  height: 250
                }}
              />
            </View>
            <View style={{
              flex: 3
            }}>
              <View style={tileStyle}>
                <Text style={h0}
                >
                  Feb. 16
                </Text>
                <Text style={h2}>
                    @ Nutridge Estates
                </Text>
                <Text style={h2}>
                  3280 Round Top Drive
                  Honolulu, HI 96812
                </Text>
              </View>

              <View style={tileStyleSec}>
                <Text style={h1Sec}>
                    Ceremony - 4:30p
                </Text>
                <Text style={h2Sec}>
                  Pre-game BYOB 3:00p. Come enjoy the venue with us!
                </Text>
              </View>
            </View>
            <View style={{
              flex: 3
            }}>
              <View style={tileStyle}>
                <Text style={h1}>
                    Parking
                </Text>
                <Text style={h2}>
                  Preferred spaces for kupuna (elders), others park roadside w/ short walk. Please drive carefully, road is narrow and dimly lit.
                </Text>
              </View>

              <View style={tileStyleTert}>
                <Text style={h1Tert}>
                    Pau Hana - 10:00p
                </Text>
                <Text style={h2Tert}>
                  Waikiki after party TBD
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      )
  }

}


const primTextColor = '#333';
const primBgColor = 'transparent';

const secTextColor = 'green';
const secBgColor = 'lightgreen';

const tertTextColor= 'gold';
const tertBgColor = 'crimson';

const h0 = {
  fontFamily: 'Futura-Bold',
  fontSize: 48,
  textAlign: 'left',
  color: primTextColor
}

const h1 = {
  fontFamily: 'Futura-Bold',
  fontSize: 24,
  textAlign: 'left',
  color: primTextColor
}

const h1Sec = {
  fontFamily: 'Futura-Bold',
  fontSize: 24,
  textAlign: 'right',
  color: secTextColor
}

const h1Tert = {
  fontFamily: 'Futura-Bold',
  fontSize: 24,
  textAlign: 'right',
  color: tertTextColor
}

const h2 = {
  fontFamily: 'Futura',
  fontSize: 24,
  textAlign: 'left',
  color: primTextColor
}

const h2Sec = {
  fontFamily: 'Futura',
  fontSize: 24,
  textAlign: 'right',
  color: secTextColor
}

const h2Tert = {
  fontFamily: 'Futura',
  fontSize: 24,
  textAlign: 'right',
  color: tertTextColor
}

const h3 = {
  fontFamily: 'Futura',
  fontSize: 12,
  textAlign: 'left',
  color: primTextColor
}

const h3Sec = {
  fontFamily: 'Futura',
  fontSize: 12,
  textAlign: 'right',
  color: secTextColor
}

const tileStyle = {
  flexDirection: 'column',
  padding: '3%',
  paddingTop: '6%',
  paddingBottom: '6%',
  backgroundColor: primBgColor
}

const tileStyleSec = {
  flexDirection: 'column',
  padding: '3%',
  paddingTop: '6%',
  paddingBottom: '6%',
  backgroundColor: secBgColor
}

const tileStyleTert = {
  flexDirection: 'column',
  padding: '3%',
  paddingTop: '6%',
  paddingBottom: '6%',
  backgroundColor: tertBgColor
}

/*** Image works when pictureTaken event listener is in play

<Image
          style={{
             paddingVertical: 30,
             width: 200,
             height: 200,
             borderRadius: 100
           }}
           resizeMode='cover'
           source={{
            uri: this.state.photo.uri
           }}
           onPress={() => console.log('this state is ' + JSON.stringify(this.state))}
         />

***/

/***  Coming Soon slate

              <Image
                  style={{
                   paddingVertical: 30,
                   width: 200,
                   height: 300,
                   borderRadius: 100
                 }}
                 resizeMode='cover'
                 source={require('../assets/images/gray-pine.png')}
                 onPress={() => console.log('this state is ' + JSON.stringify(this.state))}
               />
               <Text style={{
                fontFamily: 'Futura',
                fontSize: 24,
                paddingTop: 20,
                paddingBottom: 20,
                color: '#999',
                textAlign: 'center'
               }}>
               Coming soon..
               </Text>

***/


/*** In componenentWillMount, pictureTaken event works
        //EventRegister > pictureTaken
        this.listener = EventRegister.addEventListener('pictureTaken', (photo) => {
            console.log('pictureTaken received with ' + JSON.stringify(photo));

            this.setState({
                photo,
            })

            console.log('this.state.photo.uri in EventCalendar is ' + JSON.stringify(this.state.photo.uri))
        })
        ***/

/*** Tile with Nutridge photo

  <Tile
              imageSrc={require('../assets/images/nutridge.png')}
              title=""
              icon={{ name: 'play-circle', type: 'font-awesome' }} // optional
              contentContainerStyle={{
                height: 70,
                backgroundColor: 'gold',
              }}
            >
              <View
                style={{ 
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Text style={{
                  fontFamily: 'Futura-Bold',
                  fontSize: 48
                }}>
                  Feb. 16
                  <Text style={{
                    fontFamily: 'Futura',
                    fontSize: 24
                  }}>
                    @ Nutridge Estates
                  </Text>
                  <Text style={{
                    fontFamily: 'Futura',
                    fontSize: 12
                  }}>
                    3280 Round Top Dr.
                    Honolulu, HI 96822
                  </Text>
                </Text>
              </View>
            </Tile>

***/