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

import {NavigationContainer,withNavigation, DrawerActions, DefaultTheme} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import PublicNavigationStack from './PublicNavigationStack';
import LoginNavigationStack from './LoginNavigationStack';
import Headright from './Headright';
import ListIcon from './ListIcon';
import ListCookiesScreen from '../Cookie/ListCookiesScreen';
import CustomSidebarMenu from '../CustomSidebarMenu';
import CustomLoggedInSidebarMenu from '../CustomLoggedInSidebarMenu';
import DrawerNavigationRoutes from './DrawerNavigationRoutes';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from '@react-navigation/stack';

import AppStyle from '../../Constants/AppStyle.js';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
class AppNavigation extends Component {

 constructor(props) {
    super(props);
    this.state = {
      isLoggedInUser:false
    };
    
  }

  render (){
   const {isLoggedInUser} = this.state;
   console.log('test');
 
    return  <NavigationContainer>
        <Stack.Navigator screenOptions={{
                headerTitle:'',
                  headerStyle: {
                  backgroundColor: "#f2f2f2",
                  height:50,
                  elevation: 0, // remove shadow on Android
                  shadowOpacity: 0, // remove shadow on iOS
                }
        }}>
       
        <Stack.Screen
          name="PublicNavigationStack"
          component={PublicNavigationStack}
          options={{headerShown: true}}
        />
       
          <Stack.Screen
          name="DrawerNavigationRoutes"
          component={DrawerNavigationRoutes}
           options={{headerShown: false}}
            />

          <Stack.Screen
          name="LoginNavigationStack"
          component={LoginNavigationStack}
          options={{headerShown: false}}
          
        />
          
      </Stack.Navigator>
   
    </NavigationContainer>
  }
};
export default AppNavigation;

const styles = StyleSheet.create({
  topheadSection:{
   
  }
});