// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState,Component,useCallback} from 'react';
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


import UserLoginScreen from '../Auth/UserLoginScreen';
import ForgetPasswordScreen from '../Users/ForgetPasswordScreen';
import CommanClass from './CommanClass';
import * as SecureStore from 'expo-secure-store';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();

class LoginNavigationStack extends Component {

 constructor(props) {
    super(props);
    this.state = {
      SelectedNav:'UserLoginScreen'
    };
  }
  render (){
    const {SelectedNav} = this.state;
    return  <Stack.Navigator initialRouteName={SelectedNav}>
        <Stack.Screen
            name="UserLoginScreen"
            component={UserLoginScreen}
            options={{headerShown: false}}
          /> 
          <Stack.Screen
            name="ForgetPasswordScreen"
            component={ForgetPasswordScreen}
            options={{headerShown: false}}
          />
          </Stack.Navigator>
  }
};
export default LoginNavigationStack;

const styles = StyleSheet.create({
  topheadSection:{
   
  }
});