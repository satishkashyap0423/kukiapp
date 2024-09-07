// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState,Component} from 'react';
import { StyleSheet, Button, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput, Alert,Keyboard,KeyboardAvoidingView } from 'react-native';
import AppStyle from '../../Constants/AppStyle.js';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';
import ProgressBar from '../Common/ProgressBar';
import axios from 'axios';
import Api from '../../Constants/Api.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Otpscreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      one: '',
      two: '',
      three: '',
      oneFocus: false,
      twoFocus: false,
      threeFocus: false,
      fourFocus: false,
      second:0,
      showSec:0,
      minute:0,
      errMsg:'Error',
      ishowMOdal:false,
      userDataPhone:""
    };

    this.onStart(0);
  }

  async componentDidMount() {
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
      let userSignupData = await AsyncStorage.getItem('userSignupData');
      console.log(userSignupData)
      let uParseData = JSON.parse(userSignupData);
      this.setState({
        userDataPhone:uParseData
      })
      this.refs.one.focus();
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  keyboardDidHide = () => {
      Keyboard.dismiss();
  };

  

  handleChangeTextOne = (text) => {
    this.setState({ one: text }, () => { if (this.state.one) this.refs.two.focus(); });
  }
  handleChangeTextTwo = (text) => {
    this.setState({ two: text }, () => { if (this.state.two) this.refs.three.focus(); });
  }
  handleChangeTextThree = (text) => {
    this.setState({ three: text }, () => { if (this.state.three) this.refs.four.focus(); });
  }
  handleChangeTextFour = (text) => {
    this.setState({ four: text });
  }


    backspace = (id) => {
      if (id === 'two') {
        if (this.state.two) { this.setState({ two: '' }); } else if (this.state.one) { this.setState({ one: '' }); this.refs.one.focus(); }
      } else if (id === 'three') {
        if (this.state.three) { this.setState({ three: '' }); } else if (this.state.two) { this.setState({ two: '' }); this.refs.two.focus(); }
      }
      else if (id === 'four') {
        if (this.state.four) { this.setState({ four: '' }); } else if (this.state.three) { this.setState({ three: '' }); this.refs.three.focus(); }
      }
    }
	onStart = (elmm) => {
    this.setState({minute:'0'});
    this._interval = setInterval(() => {
    this.setState({
      second: this.state.second + 1,
    })

    if(this.state.second == 120){
      this.state.second = 0;
      if(elmm != 1){
        this.setState({errMsg:'Otp has been expired!'});
        this.setState({ishowMOdal:true});
      }
      this.setState({minute:'02'});
      clearInterval(this._interval);
    }
    this.setState({showSec:this.state.second});
    if(this.state.second >= 60){
      this.setState({minute:'01'});
      this.setState({showSec:this.state.second-60});
    }
    }, 1000);

  if(elmm == 1){
    clearInterval(this._interval);
  }
}

handleSendagainPress = async() => {
   /*this.props.navigation.navigate('UserdetailScreen');
   return*/
 //alert('Otp sent again!');
 if(this.state.one == '' || this.state.two == '' || this.state.three == '' || this.state.four == ''){
  this.setState({errMsg:AlertMessages.otpErr});
  this.setState({ishowMOdal:true});
  return;
 }

 let userSignupData = await AsyncStorage.getItem('userSignupData');
  let uParseData = JSON.parse(userSignupData);

 this.setState({loading:true});
      let data = JSON.stringify({
        phone_number: uParseData.phone_number,
        otp: this.state.one+this.state.two+this.state.three+this.state.four
      });
      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      }
      axios.post(Api.apiUrl+'/verify-otp', data, headers)
      .then(res => {
        console.log('login data otp screen--',data); 
        console.log('otp data--',res.data); 
        this.setState({loading:false});
        if(res.data.status == 'true'){
          clearInterval(this._interval);
          this.props.navigation.navigate('UserdetailScreen');
        }else{
          this.setState({errMsg:res.data.message});
          this.setState({ishowMOdal:true});
        }
      }).catch(error => {
        if(error.toJSON().message === 'Network Error'){
          this.setState({errMsg:AlertMessages.noInternetErr});
          this.setState({ishowMOdal:true});
         
          this.setState({loading:false}); 
        }else{
          this.setState({errMsg:error});
          this.setState({ishowMOdal:true});
          this.setState({loading:false});
        }
      });

 
 
}

sendAgain = async () => {
  let userSignupData = await AsyncStorage.getItem('userSignupData');
  let uParseData = JSON.parse(userSignupData);
  this.setState({loading:true});
  let data = JSON.stringify({
    phone_number: uParseData.phone_number,
    country_code: uParseData.country_code
  });
  let headers = {
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    }
  }
  axios.post(Api.apiUrl+'/resend-otp', data, headers)
  .then(res => {
    console.log('resend---',data); 
    this.onStart(0);
    this.setState({loading:false});
    this.setState({errMsg:res.data.message});
    this.setState({ishowMOdal:true});
    this.setState({errMsg:AlertMessages.otpResendMessage});
      this.setState({ishowMOdal:true});

      setTimeout(
          function() {
               this.setState({ishowMOdal:false});
          }
          .bind(this),
          3000
      );
  }).catch(error => {
    if(error.toJSON().message === 'Network Error'){
      this.setState({errMsg:AlertMessages.noInternetErr});
      this.setState({ishowMOdal:true});
     
      this.setState({loading:false}); 
    }else{
      this.setState({errMsg:error});
      this.setState({ishowMOdal:true});
      this.setState({loading:false});
    }
  });
}
backScreen(){
    this.props.navigation.navigate('LoginScreen');
  }
  handleCallback = (childData) =>{
      this.setState({ishowMOdal: childData})
  }
	
    render() {
const { oneFocus, twoFocus, threeFocus,fourFocus,errMsg,ishowMOdal,showSec,minute } = this.state;
      
        return <ScrollView contentContainerStyle={{
          flexGrow: 1,backgroundColor:'#fff'
        }}>{ishowMOdal && <UseAlertModal message={errMsg} parentCallback = {this.handleCallback} /> }
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : ""}
          style={styles.Maincontainer}>

<View style={styles.topheadSection}>
         <TouchableOpacity onPress={() =>
            this.backScreen()} activeOpacity={0.7}>
            
            <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={styles.backIconsCont}>

                <FontAwesome 
                  name={'angle-left'}
                  size={24} 
                  color={AppStyle.fontColor}
                  
                   
                />
               </LinearGradient>
            
         </TouchableOpacity>
         
      </View>
      
          <View style={styles.container}>
          
        <View style={styles.headSection}>
          <Text style={styles.timerHeadText}>{minute}:{showSec}</Text>
          <Text style={styles.timerText}>Enter the varification code sent on</Text>
          {/* <Text style={styles.timerText}> </Text> */}
          <Text  style={styles.timerText}>{this.state?.userDataPhone?.phone_number}</Text>
          </View>

          <View style={styles.inputcontainer}>
          
            <TextInput
              ref='one'
              autoFocus
              style={[styles.textInput, (oneFocus == true ? styles.seltedtextInput : null)]}
              autoCorrect={false}
              autoCapitalize='none'
              keyboardType='number-pad'
              caretHidden
              returnKeyType="done"
              onFocus={() => this.setState({ oneFocus: true })}
              onBlur={() => this.setState({ oneFocus: false })}
              maxLength={1}
              onChangeText={(text) => { this.handleChangeTextOne(text); }}
              value={this.state.one}
            />
            <TextInput
              ref='two'
              onKeyPress={({ nativeEvent }) => (
                nativeEvent.key === 'Backspace' ? this.backspace('two') : null
              )}
              style={[styles.textInput, (twoFocus == true ? styles.seltedtextInput : null)]}
              autoCorrect={false}
              autoCapitalize='none'
              maxLength={1}
              onFocus={() => this.setState({ twoFocus: true })}
              onBlur={() => this.setState({ twoFocus: false })}
              caretHidden
              keyboardType='number-pad'
              onChangeText={(text) => { this.handleChangeTextTwo(text); }}
              value={this.state.two}
            />
            <TextInput
              ref='three'
              onKeyPress={({ nativeEvent }) => (
                nativeEvent.key === 'Backspace' ? this.backspace('three') : null
              )}
              style={[styles.textInput, (threeFocus == true ? styles.seltedtextInput : null)]}
              autoCorrect={false}
              autoCapitalize='none'
              onFocus={() => this.setState({ threeFocus: true })}
              onBlur={() => this.setState({ threeFocus: false })}
              maxLength={1}
              returnKeyType="done"
              caretHidden
              keyboardType='number-pad'
              onChangeText={(text) => { this.handleChangeTextThree(text); }}
              value={this.state.three}
            />
             <TextInput
              ref='four'
              // onKeyPress={({ nativeEvent }) => (
              //   nativeEvent.key === 'Backspace' ? this.backspace('four') : null
              // )}
              style={[styles.textInput, (fourFocus == true ? styles.seltedtextInput : null)]}
              autoCorrect={false}
              autoCapitalize='none'
              onFocus={() => this.setState({ fourFocus: true })}
              onBlur={() => this.setState({ fourFocus: false })}
              maxLength={1}
              caretHidden
              returnKeyType="done"
              keyboardType='number-pad'
              onChangeText={(text) => { this.handleChangeTextFour(text); }}
              value={this.state.four}
            />
            
          </View>
           <TouchableOpacity
              
              activeOpacity={0.9}
              onPress={({ nativeEvent }) => (
                nativeEvent.key === 'Backspace' ? this.handleSendagainPress() : this.handleSendagainPress()
              )}
              >
              <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={styles.buttonStyle}>
              <Text style={styles.buttonTextStyle}>Proceed</Text>
              </LinearGradient>
            </TouchableOpacity>
           <View style={{
            flexDirection:'row',
            justifyContent:'space-between'
           }}>
           <TouchableOpacity
              style={styles.buttsendAgainContent}
              activeOpacity={0.8}
              onPress={({ nativeEvent }) => {
               console.log("clear the functionality")
               this.setState({
                one:'',
                two:'',
                three:'',
                four:""
               })
              }}
              >
              
              <Text style={styles.buttonTextStyleA}>Clear</Text>
              
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttsendAgainContent}
              activeOpacity={0.8}
              onPress={({ nativeEvent }) => (
                nativeEvent.key === 'Backspace' ? this.sendAgain() : this.sendAgain()
              )}
              >
              
              <Text style={styles.buttonTextStyleA}>Resend Code</Text>
              
            </TouchableOpacity>
           </View>
            </View></KeyboardAvoidingView></ScrollView>

      }
       
      
      onClose = () => {
        // maybe navigate to other screen here?
      }
};


export default Otpscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
    
  },
  topheadSection:{
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center',
  flexDirection:'row',
  marginBottom:15,
  marginTop:35,
  paddingLeft: AppStyle.appLeftPadding,
  },
  backIconsCont:{
  borderWidth:1,
  borderColor:'#E8E6EA',
  borderRadius:15,
  paddingTop:12,
  paddingBottom:12,
  paddingLeft:20,
  paddingRight:20
  },
  timerText:{
    fontSize:18,
    fontFamily: 'Abel',
    color: AppStyle.fontColor,
  },
  timerHeadText:{
    fontSize:34,
    fontFamily: 'Abel',
    color: AppStyle.fontColor,
  },
    buttonStyle: AppStyle.AppbuttonStyle,
  
  
  headSection:{
    paddingVertical:50,
    alignItems: 'center'
  },
  buttsendAgainContent:{
    justifyContent:'flex-end',
    paddingRight:10
  },
  buttonTextStyleA: {
    color: AppStyle.linkColor,
    fontSize: 18,
  fontFamily: 'GlorySemiBold',
  textAlign:'right',

  },
  buttonTextStyle: {
    color: AppStyle.fontButtonColor,
    fontSize: AppStyle.buttonFontsize,
  fontFamily: 'GlorySemiBold',
  },
  inputcontainer: {
    
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center',
    paddingBottom:15
  }, 
  textInput: {
    borderColor:  'rgba(253, 139, 48, 0.69)',
        borderWidth: 1,
        width:65,
        marginRight:5,
        height:65,
        color: AppStyle.fontColor,
        borderRadius:15,
        fontSize:34,
        textAlign:'center',
        fontFamily: 'Abel'
  },
  seltedtextInput: {
    backgroundColor:AppStyle.btnbackgroundColor
  }
});