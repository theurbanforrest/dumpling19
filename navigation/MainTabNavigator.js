import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeFeed from '../screens/HomeFeed';
import SuperMap from '../screens/SuperMap';
import Profile from '../screens/Profile';
import EventCalendar from '../screens/EventCalendar';
import PostInitiator from '../screens/PostInitiator';


const HomeFeedStack = createStackNavigator({
  Homey: HomeFeed
})

const EventCalendarStack = createStackNavigator({
  Calendary: EventCalendar,
})

const PostStack = createStackNavigator({
  Posty: PostInitiator
})

const SuperMapStack = createStackNavigator({
  Mappy: SuperMap,
})

const ProfileStack = createStackNavigator({
  Profiley: Profile,
})



HomeFeedStack.navigationOptions = {
  tabBarLabel: 'Feed',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-pulse${focused ? '' : '-outline'}` : 'md-pulse'}
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

PostStack.navigationOptions = {
  tabBarLabel: '',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-add-circle${focused ? '' : '-outline'}` : 'md-add-outline'}
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
      name={Platform.OS === 'ios' ? `ios-happy${focused ? '' : '-outline'}` : 'md-happy'}
    />
  ),
}


export default createBottomTabNavigator(
  {
    HomeFeedStack,
    EventCalendarStack,
    PostStack,
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
