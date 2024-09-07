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

import AppStyle from '../../Constants/AppStyle.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';


class ProgressBar extends Component {

 constructor(props) {
    super(props);
    this.state = {
      activeClass:'nm'
    };
    
  }


  async getData() {
      await AsyncStorage.getItem("activeClass").then((value) => {
          this.setState({activeClass: value});
      })
      .then(res => {
        
      });
  }
  componentDidMount(){
    this.getData();
  }

  render() {
    const { activeClass } = this.props;
  
    const steps = [];
    const selectBrColor = this.props.step;
  
    for (let i = 1; i <= 6; i++) {
      let actCls = '';
      let chk = [];
  
      if (i <= selectBrColor) {
        actCls = 'stepsRightActive';
        chk.push(
          <Text style={styles.stepsTextCount} key={i}>
            <Feather
              name={'check'}
              size={22}
              color={AppStyle.prgressSBColor}
            />
          </Text>
        );
      } else {
        chk.push(
          <Text style={styles.stepsTextCount} key={i}>
            {i}
          </Text>
        );
      }
      steps.push(
        <View style={styles.progressOuterSection} key={i}>
          <View style={[(i === 1 || i === 8 ? styles.stepsLeftNob : styles.stepsLeft), (actCls !== '' ? styles.stepsLeftActive : '')]}>
          </View>
          <View style={[styles.stepsRight, (actCls !== '' ? styles.stepsRightActive : '')]}>
            {chk}
          </View>
        </View>
      );
    }
  
    return (
      <View style={styles.progressSection}>
        {steps}
      </View>
    );
  }
  
};
export default ProgressBar;

const styles = StyleSheet.create({
  progressSection:{
    
   flexDirection:'row',

   alignItems:'center',
   marginBottom:20,
   marginTop:10
    
  },
  progressOuterSection:{
   flexDirection:'row',
   justifyContent:'center',
   alignItems:'center',
   width:'15%'
  },
  stepsLeft:{
   width:'50%',
   //borderBottomWidth:1,
   //borderColor:AppStyle.prgressUSBColor,
  paddingLeft:40,
   zIndex:1
   
  },
  stepsLeftActive:{
   //borderColor:AppStyle.prgressSBColor,
   zIndex:-1,
   paddingLeft:40
  },
  stepsLeftNob:{
   width:'50%',
    zIndex:1
  },
  stepsRight:{
   width:40,
   height:40,
   borderRadius:100,
   alignItems:'center',
   backgroundColor:AppStyle.prgressUSBColor,
   justifyContent:'center',
   zIndex:5,

  },
  stepsRightActive:{
  	borderWidth:1,
  	borderColor:AppStyle.prgressSBColor,
  	zIndex:6,
    overflow:'hidden',

  },
  stepsTextCount:{
    color:AppStyle.fontColor,
    fontSize: 15,
    fontFamily: 'GlorySemiBold',
  }
  
});