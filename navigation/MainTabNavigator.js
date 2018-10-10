import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
//import HomeFeed from '../screens/HomeFeed';
import SuperMap from '../screens/SuperMap';
import Profile from '../screens/Profile';
import EventCalendar from '../screens/EventCalendar';
import PostInitiator from '../screens/PostInitiator';
import PostMediaEditor from '../components/PostMediaEditor';
import CommentDetail from '../components/CommentDetail';

///Testing a HomeFeed with paging
///
import HomeFeed from '../screens/HomeFeed';


const HomeFeedStack = createStackNavigator({
  Home: HomeFeed,
  Start: PostInitiator,
  Edit: PostMediaEditor,
  Comment: CommentDetail
})

const EventCalendarStack = createStackNavigator({
  Calendar: EventCalendar,
})

/* const PostStack = createStackNavigator({
  Start: PostInitiator,
  Edit: PostMediaEditor,

}) */

const SuperMapStack = createStackNavigator({
  Map: SuperMap,
})

const ProfileStack = createStackNavigator({
  Profile: Profile,
})



HomeFeedStack.navigationOptions = {
  tabBarLabel: 'Feed',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-home${focused ? '' : '-outline'}` : 'md-home'}
    />
  ),
}

EventCalendarStack.navigationOptions = {
  tabBarLabel: 'The Big Day',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-calendar${focused ? '' : '-outline'}` : 'md-calendar'}
    />
  ),
}

SuperMapStack.navigationOptions = {
  tabBarLabel: 'Map',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-globe${focused ? '' : '-outline'}` : 'md-globe'}
    />
  ),
}

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options'}
    />
  ),
}


export default createBottomTabNavigator(
  {
    HomeFeedStack,
    EventCalendarStack,
    SuperMapStack,
    ProfileStack
  },
  {
    tabBarOptions: {
      showLabel: false
      //active and focused colors are in constants/Colors
    }
  }
);
