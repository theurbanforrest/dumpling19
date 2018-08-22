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
  Dimensions
} from 'react-native';
import {
  Button,
  FormLabel,
  FormInput,
  Avatar
} from 'react-native-elements';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';
import { EventRegister } from 'react-native-event-listeners';
import LoadingOverlay from '../components/LoadingOverlay';
import FeedItem from '../components/FeedItem'; 
import { Storage, API } from 'aws-amplify';
import HomeFeedItems from '../constants/HomeFeedItems';



export default class HomeFeed extends React.Component {
  static navigationOptions = {
    title: '#shukforrestwedding',
  };

  //constructor
    constructor(props) {
      super(props);

      this.state = {
        fetchIsLoading: false,
        awsPicture: 'https://randomuser.me/api/portraits/women/59.jpg'
      }
    }

    componentWillMount() {

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

        Storage.get('profileImage.png')
        .then(result => {

          this.setState({
            image: result,
          })
          console.log(result);

        })
        .catch(err => console.log(err));
        
      }

      

    componentDidMount() {
      

      

    }
  //render

    render() {

      let { image } = this.state;
      console.log('this.state is ' + JSON.stringify(this.state));

      let { height, width } = Dimensions.get('window');

      const bestHeight = width * 0.9;
      const bestWidth = width;

      let str = '../assets/images/engaged.png';
    
      //Else free to proceed
      return(
        <View style={{
          position: 'relative'
        }}>
          <ScrollView style={{
            flexDirection: 'column',
          }}
          >


          {

              //import FeedItems
              HomeFeedItems.map( (x) => (

                  <FeedItem
                    key={x.id}
                    userName={x.name}
                    userPic={x.profile}
                    postImage={x.picture}
                    postCopy={x.caption}
                  /> 
              ))
          }  
          
          </ScrollView>
        </View>
      )
  }


}