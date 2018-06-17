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


const HomeFeedStack = createStackNavigator({
  Home: HomeFeed
})

const SuperMapStack = createStackNavigator({
  Mappy: SuperMap,
})

HomeFeedStack.navigationOptions = {
  tabBarLabel: 'Feed',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-heart${focused ? '' : '-outline'}` : 'md-heart'}
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



export default createBottomTabNavigator({
  HomeFeedStack,
  SuperMapStack
});
