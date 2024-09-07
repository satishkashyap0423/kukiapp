import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppStyle from '../Constants/AppStyle.js';

import {
  SafeAreaView,
  Text,
  ScrollView
} from 'react-native';

class HomeScreen extends Component {
  
   constructor(props) {
    super(props);
}

  render() {
   
    return (
      <ScrollView>
         <SafeAreaView style={{backgroundColor:AppStyle.splashappColor, paddingTop: 3, }}>
           
          </SafeAreaView>
      </ScrollView>
          
        );
  }
}


const styles = {  
 
};
export default HomeScreen;
