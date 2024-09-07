// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, Component, useCallback } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  FlatList,
  SafeAreaView,
  Image,
  Keyboard,
  TouchableOpacity,
  Alert,
  TouchableHighlight,
  KeyboardAvoidingView
} from 'react-native';

import LoginScreen from '../Auth/LoginScreen';
import UserLoginScreen from '../Auth/UserLoginScreen';
import ForgetPasswordScreen from '../Users/ForgetPasswordScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserdetailScreen from '../Users/UserdetailScreen';
import CommunitiesScreen from '../Users/CommunitiesScreen';
import LanguagesScreen from '../Users/LanguagesScreen';
import PersonalityTraits from '../Users/PersonalityTraits';
import UserstatusScreen from '../Users/UserstatusScreen';
import GeolocationM from '../GeolocationM';
import Otpscreen from '../Auth/Otpscreen';
import CommanClass from './CommanClass';
import * as SecureStore from 'expo-secure-store';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

class PublicNavigationStack extends Component {

  constructor(props) {
    super(props);
    // let userId = null;
    // AsyncStorage.getItem('userData').then((value) => {
    //   userId = JSON.parse(value).id;
    //   console.log("user id is--- " + userId);
    //   this.state = {
    //     SelectedNav: userId ? 'LoginScreen' : 'HomeCookiesScreen'
    //   };
    // }); 
    this.state = {
      SelectedNav:'LoginScreen'
    };
  }

  async getData() {
    let UserAccessToken = await AsyncStorage.getItem('UserAccessToken');
    let isAppLock = await AsyncStorage.getItem('isAppLock');
    if (UserAccessToken != null && isAppLock == 'U') {
      this.props.navigation.replace('DrawerNavigationRoutes');
    } else {
      let fcmtoken = await SecureStore.getItemAsync('secure_deviceid');

      if (fcmtoken === null) {
      } else {
        if (this.props.route.params) {
        } else {
          this.props.navigation.replace('LoginNavigationStack');
        }
      }
    }
  }

  componentDidMount() {
    this.getData();
  }
  render() {
    const { SelectedNav } = this.state;
    return <Stack.Navigator initialRouteName={SelectedNav}>
      <Stack.Screen
        name="GeolocationM"
        component={GeolocationM}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserLoginScreen"
        component={UserLoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgetPasswordScreen"
        component={ForgetPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Otpscreen"
        component={Otpscreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserdetailScreen"
        component={UserdetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CommunitiesScreen"
        component={CommunitiesScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="LanguagesScreen"
        component={LanguagesScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PersonalityTraits"
        component={PersonalityTraits}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserstatusScreen"
        component={UserstatusScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  }
};
export default PublicNavigationStack;

const styles = StyleSheet.create({
  topheadSection: {

  }
});
