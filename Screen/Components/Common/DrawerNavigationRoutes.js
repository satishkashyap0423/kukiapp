// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React
import React from 'react';

// Import Navigators from React Navigation
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Import Screens
import ProtectedNavigationStack from './ProtectedNavigationStack';
import CustomLoggedInSidebarMenu from '../CustomLoggedInSidebarMenu';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { getHeaderTitle } from '@react-navigation/elements';
import Headright from '../Common/Headright';
import ListIcon from '../Common/ListIcon';
import AppStyle from '../../Constants/AppStyle.js';

import {
  Text
} from 'react-native';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Header = (screen) => {
  return <Text>{screen.title}</Text>;
};


const DrawerNavigatorRoutes = (props) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: "white",
          zIndex: 100,
          paddingTop: 0
        },

        drawerPosition: "left",
      }}
      drawerContent={CustomLoggedInSidebarMenu}
    >
      <Drawer.Screen
        name="PublicStack"
        component={ProtectedNavigationStack}
        options={({ navigation }) => ({
          title: '',
          headerStyle: {
            backgroundColor: "#fff",
            height: 94,

            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
          },
          headerLeft: () => (

            <ListIcon />

          ), headerRight: () => {
            return (
              <Headright iconColor={AppStyle.iconColorblack} />

            );
          }
        })}
      />

      {/* This screen can be accessible even if when user is not authenticated */}


    </Drawer.Navigator>

  );
};

export default DrawerNavigatorRoutes;