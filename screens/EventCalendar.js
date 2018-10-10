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
  Alert,
  FlatList
} from 'react-native';
import {
  Button,
  FormLabel,
  FormInput,
  Icon,
  Tile,
  ListItem
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

import Piney from '../helpers/Piney';
import PineyConstants from '../constants/PineyConstants';
import FeedItem from '../components/FeedItem';
import { Storage } from 'aws-amplify';

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

    async componentDidMount() {

      let theToken = await AsyncStorage.getItem('@ShukForrestWedding:userToken');
      let theUserId = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;
     
      this.setState({
        access_token: theToken,
        user_id: theUserId
      })


      await this._getBobaOrders()
      .then((response) => {
        this.setState({
          feedItems: response
        });
        return true;
      })
      .catch((err) => console.log(err));

    }

  //render
  render(){

    console.log('EventCalendar renders');

    return(
        <View style={{
          position: 'relative',
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
              width: '100%'
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
                <Text style={h3}>
                  Nutridge Estates
                  {'\n'}
                  3280 Round Top Drive
                  {'\n'}
                  Honolulu, HI 96812
                </Text>
              </View>

              <View style={tileStyleSec}>
                <Text style={h3Sec}>
                  Pre-game: 3:30p
                  {'\n'}
                  Official Doors Open: 4:00p
                  {'\n'}{'\n'}
                  <Text style={h1Sec}>
                  Ceremony: 4:30p
                  {'\n'}
                  </Text>
                  {'\n'}
                  Dinner: 5:00p
                  {'\n'}
                  DJ: 7:00p
                  {'\n'}
                  Blackjack & Craps: 8:00p
                  {'\n'}
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
                <Text style={h3}>
                  Preferred spaces for kupuna (elders), others park roadside w/ short walk. Please drive carefully, road is narrow and dimly lit.
                </Text>
              </View>

              <View style={tileStyleSec}>
                <Text style={h1Sec}>
                    Unofficial After Party
                </Text>
                <Text style={h3Sec}>
                  Cafe Duck Butt or Mai Tai's #cheehoo
                </Text>
              </View>
            </View>

          /// RSVP attendee list
          ///

          { /**

            !this.state.refreshing && this.state.feedItems &&

            this.state.feedItems.map((item) => (
              <ListItem
                roundAvatar
                avatar={{uri: Storage.get('proffy-46.jpeg')}}
                key={item.id}
                title={item.name ? item.name : ""}
                subtitle={item.drink_pref ? item.plus_one : ""}
              />
            ))

            **/
          }

          </ScrollView>
        </View>
      )
  }

  _getBobaOrders= async () => {

    let theToken = await AsyncStorage.getItem('@ShukForrestWedding:userToken');
    let theUserId = Expo.Constants.deviceId ? Expo.Constants.deviceId : Expo.Constants.installationId;
     
    let theGet = await Piney.bobaOrdersGetByPartition(theToken,{});
    let theGetResponse = await theGet.json();

    console.log('debug -- EventCalendar _getBobaOrders() theGetResponse is ' + JSON.stringify(theGetResponse));
    return theGetResponse;

  }

  _checkIfHasBobaOrder = async (userId) => {

    let a = await this._getBobaOrderByUserId(this.state.access_token,this.state.user_id);

      try{ a[0].id; }
      catch(e) {

          console.log('debug -- HomeFeed _checkIfHasBobaOrder catch error ' + e);

          Alert.alert(
          'Howzit!',
          "Looks like you haven't submitted your RSVP yet. Let's get that done now!",
          [
            {
              text: 'OK',
              onPress: () => this.props.navigation.navigate('Profile')
            }
          ],
          { cancelable: false }
        )
      }
  }

  _getBobaOrderByUserId = async (accessToken,theUserId) => {

    let theGet = await Piney.bobaOrdersGetById(
        accessToken,
        theUserId);

    console.log('debug -- _getBobaOrderByUserId() theGet is ' + JSON.stringify(theGet));
    
    return theGet ? theGet : false;
  }

}


const primTextColor = Colors.primaryText;
const primBgColor = 'transparent';

const secTextColor = Colors.tintColor;
const secBgColor = Colors.secondaryBackground;

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
  fontSize: 18,
  textAlign: 'left',
  color: primTextColor
}

const h3Sec = {
  fontFamily: 'Futura',
  fontSize: 18,
  textAlign: 'right',
  color: secTextColor
}

const h3Tert = {
  fontFamily: 'Futura',
  fontSize: 18,
  textAlign: 'right',
  color: tertTextColor
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