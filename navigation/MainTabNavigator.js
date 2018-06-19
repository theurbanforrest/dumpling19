import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HomeFeed from '../screens/HomeFeed';
import SuperMap from '../screens/SuperMap';
import FeedScreen from '../screens/HomeScreen';
import Profile from '../screens/Profile';
import EventCalendar from '../screens/EventCalendar';


const HomeFeedStack = createStackNavigator({
  Home: HomeFeed
})

const EventCalendarStack = createStackNavigator({
  Calendarey: EventCalendar,
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



export default createBottomTabNavigator({
  HomeFeedStack,
  EventCalendarStack,
  SuperMapStack,
  ProfileStack
});
