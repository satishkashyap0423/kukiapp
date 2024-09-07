// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState,Component} from 'react';


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
import MultiSelect from 'react-native-multiple-select';

import Loader from '../../Components/Loader';

const pesodata=[  
                        {key: 'Artist',icon:require('../../../assets/images/icons/camera.png'),isSelect:false,selectedClass:'flatMainsection'},{key: 'Creative',icon:require('../../../assets/images/icons/weixin-market.png'),isSelect:false,selectedClass:'flatMainsection'}, {key: 'Simple',icon:require('../../../assets/images/icons/voice.png'),isSelect:false,selectedClass:'flatMainsection'},{key: 'Foodie',icon:require('../../../assets/images/icons/viencharts.png'),isSelect:false,selectedClass:'flatMainsection'},  
                        {key: 'Cooking Freak',icon:require('../../../assets/images/icons/noodles.png'),selectedClass:'flatMainsection'},{key: 'Day dreamer',icon:require('../../../assets/images/icons/tennis.png'),selectedClass:'flatMainsection'},{key: 'Fitness Freak',icon:require('../../../assets/images/icons/sport.png'),selectedClass:'flatMainsection'},  
                        {key: 'Swimming',icon:require('../../../assets/images/icons/ripple.png'),selectedClass:'flatMainsection'},{key: 'Art',icon:require('../../../assets/images/icons/Art.png'),selectedClass:'flatMainsection'}, {key: 'Traveling',icon:require('../../../assets/images/icons/outdoor.png'),selectedClass:'flatMainsection'},  
                        {key: 'Extreme',icon:require('../../../assets/images/icons/parachute.png'),selectedClass:'flatMainsection'},{key: 'Music',icon:require('../../../assets/images/icons/music.png'),selectedClass:'flatMainsection'},{key: 'Drink',icon:require('../../../assets/images/icons/goblet-full.png'),selectedClass:'flatMainsection'},  
                        {key: 'Video games',icon:require('../../../assets/images/icons/game-handle.png'),selectedClass:'flatMainsection'} 
                    ];  

class GenderScreen extends Component {

 constructor(props) {
    super(props);
    this.state = {
      checked:'male',
      selectedMValCont:'',
      selectedFValCont:'',
      selectedOValCont:'',
    };

  
  }

 createAlert = (FirstName) =>
  Alert.alert(
    "Required",
    FirstName,
    [
     
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]
  );
  backScreen(){
    
    this.props.navigation.navigate('UserstatusScreen');
  }
  nextScreen(){
    
    this.props.navigation.navigate('UserstatusScreen');
  }

  checkVal(val){
    
    this.setState({checked:val});
    if(val == 'male'){
      this.setState({
         selectedMValCont: 'selectdVal'
       });
      this.setState({
         selectedFValCont: ''
       });
      this.setState({
         selectedOValCont: ''
       });
    }else if(val == 'female'){
       this.setState({
         selectedFValCont: 'selectdVal'
       });
        this.setState({
         selectedMValCont: ''
       });
      this.setState({
         selectedOValCont: ''
       });
     }else{
       this.setState({
         selectedOValCont: 'selectdVal'
       });
        this.setState({
         selectedFValCont: ''
       });
      this.setState({
         selectedMValCont: ''
       });
     }
   
    
  }

  render (){

    const { checked,selectedMValCont,selectedFValCont,selectedOValCont} = this.state;

     const handleSubmitPress = () => {
   if(!this.state.setChecked){
      this.createAlert('Selected');
      
      return;
    }
    this.props.navigation.navigate('UserstatusScreen');
  };
    return <View style={styles.mainBody}>
            <View style={styles.topheadSection}>
            <TouchableOpacity onPress={() => this.backScreen()}>
              <View style={styles.backIconsCont}>
                
                 <Image
                                source={require('../../../assets/images/back-icon.png')}
                                style={{
                                 resizeMode: 'contain',
                                  height:16
                                }}
                 

                              />
                              </View>
                 </TouchableOpacity>
              
              <TouchableOpacity onPress={() => this.nextScreen()}>
                    <Text style={styles.skipSection} >Skip</Text>

              </TouchableOpacity>
            </View>

            <View style={styles.mainStection}>
              <Text style={styles.SectionHeadStyle}>Gender</Text>

              <TouchableOpacity onPress={() => this.checkVal('male')}>
              <View     style={[styles.selectionContainer ,selectedMValCont != '' ? styles.selectedMValCont : styles.selectionContainer]}>
              
                <Text>Male</Text>
                 <Image
                                source={require('../../../assets/images/icons/arrowgray.png')}
                                style={{
                                 resizeMode: 'contain',
                                  height:16
                                }}
                 

                              />
                              
              </View></TouchableOpacity>

               <TouchableOpacity onPress={() => this.checkVal('female')}><View style={[styles.selectionContainer ,selectedFValCont != '' ? styles.selectedFValCont : styles.selectionContainer]}>
              
                <Text>Female</Text>
                 <Image
                                source={require('../../../assets/images/icons/arrowgray.png')}
                                style={{
                                 resizeMode: 'contain',
                                  height:16
                                }}
                 

                              />
                              
              </View></TouchableOpacity>


               <TouchableOpacity onPress={() => this.checkVal('other')}><View style={[styles.selectionContainer ,selectedOValCont != '' ? styles.selectedOValCont : styles.selectionContainer]}>
              
                <Text>Other</Text>
                 <Image
                                source={require('../../../assets/images/icons/arrowgray.png')}
                                style={{
                                 resizeMode: 'contain',
                                  height:16
                                }}
                 

                              />
                              
              </View></TouchableOpacity>

              
            </View>
            <View style={styles.btnCont}>
               <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>Countinue</Text>
            </TouchableOpacity>
              </View>
          </View>
           
        
      
  }
};
export default GenderScreen;

const styles = StyleSheet.create({
  mainBody: {
   flex:1,
    
    backgroundColor: AppStyle.appColor,
     paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
     paddingBottom: 35,
     paddingTop: 40,
     height:'100%'
  
  },
  ContentHeadStyle:{
    marginBottom:20
  },
  skipSection:{
    color:'rgba(253, 139, 48, 0.69)',
    fontSize:16
  },
  topheadSection:{
    
    display:'flex',
    justifyContent:'space-between',
  alignItems:'center',
    flexDirection:'row',
    marginBottom:15
  },
  backIconsCont:{
     borderWidth:1,
                  borderColor:'#E8E6EA',
                  borderRadius:15,
                  paddingTop:15,
                  paddingBottom:15,
                  paddingLeft:20,
                  paddingRight:20
  },
  mainStection:{
    paddingTop: 25,
    width:'100%',
  },
  SectionHeadStyle: {
    fontSize:34,
    fontFamily: 'Abel',
    marginBottom:35
  },
  selectionContainer:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',
    padding:15,
    borderColor:'#E8E6EA',
    borderRadius:15,
    borderWidth:1,
    marginBottom:15
  },
  selectedMValCont:{
    backgroundColor:'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)'
  },
  selectedFValCont:{
    backgroundColor:'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)'
  },
  selectedOValCont:{
    backgroundColor:'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)'
  },
  btnCont:{
    position:'absolute',
     paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
    bottom:10,
    left:0,
    right:0,
  },
  buttonStyle: AppStyle.AppbuttonStyle,
  buttonTextStyle: {
    color: '#FFFFFF',
    fontSize: AppStyle.buttonFontsize,
    fontFamily: 'Abel'
  },

  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});