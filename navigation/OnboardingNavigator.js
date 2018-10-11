import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';

import Welcome from '../screens/Welcome';
import OnboardingAllowThings from '../screens/OnboardingAllowThings';
import OnboardingSelfie from '../screens/OnboardingSelfie';
import OnboardingRequired from '../screens/OnboardingRequired';
import OnboardingAll from '../screens/OnboardingAll';


/// The Onboarding

const OnboardingNavigator = createStackNavigator(
  {
    Step1: Welcome,
    Step2: OnboardingAllowThings,
    Step3: OnboardingRequired,
    Step4: OnboardingSelfie,
    Step5: OnboardingAll
  },
  /**
  {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }}
  **/
);

export default OnboardingNavigator;
