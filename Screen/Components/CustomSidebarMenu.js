// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState,Component,useEffect} from 'react';
import {View, Text, Alert, StyleSheet,Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import { MaterialCommunityIcons } from '@expo/vector-icons';



const CustomSidebarMenu = (props) => {
 

  return (
    <View style={stylesSidebar.sideMenuContainer}>
      <View style={stylesSidebar.profileHeader}>
        <View style={stylesSidebar.profileHeaderPicCircle}>
          <Image
                    source={require('../../assets/icon.png')}
                     style={[{
                     resizeMode: 'contain',
                      width:30
                     
                    }]}
                    />
        </View>
        <Text style={stylesSidebar.profileHeaderText}>
          Kukiapp
        </Text>
      </View>
      
        <DrawerContentScrollView style={stylesSidebar.pDF} {...props}>
        
        <DrawerItem
          label={({color}) => 
            <View style={stylesSidebar.menuOuterSecc}>
            <FontAwesome5 
                name={'user'}
                size={24} 
                color={'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)'} 
              />
              <Text style={{color: '#000',width:'100%',fontFamily:'Abel',marginLeft:10}}>
              Login
            </Text>
            </View>
            
          }
          onPress={() => {
            props.navigation.navigate('LoginScreen');
          }}
        />
      </DrawerContentScrollView>
      
    </View>
  );
};

export default CustomSidebarMenu;

const stylesSidebar = StyleSheet.create({
  menuOuterSecc:{
   flexDirection:'row',
   alignItems:'center'
  },
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 10,
    color: 'white',
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: 'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)',
    padding: 15,
    textAlign: 'center',
  },
  profileHeaderPicCircle: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    color: 'white',
    backgroundColor: '#ffffff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderText: {
    color: 'white',
    alignSelf: 'center',
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  profileHeaderLine: {
    height: 1,
    marginHorizontal: 20,
    backgroundColor: '#e2e2e2',

  },
});