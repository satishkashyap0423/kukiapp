// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/
// Import React and Component
import React, {Component} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import AppStyle from '../../Constants/AppStyle.js';
import AlertMessages from '../../Constants/AlertMessages.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Loader';
import * as Notifications from 'expo-notifications';
//import saveTokenData from '../shared/APIKit';
import axios from 'axios';
import Api from '../../Constants/Api.js';
import { LinearGradient } from 'expo-linear-gradient';
import UseAlertModal from '../Common/UseAlertModal';
import { checkToken } from '../../pushnotification_helper.js';

class UserLoginScreen extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      isPhoneErr:false,
      isPwdErr:false,
      isOtp:true,
      btnText:'Login',
      isGetOtp:false,
      userPhone:'',
      userPassword:'',
      userOtp:'',
      getOtp:false,
      errMsg:'Error',
      ishowMOdal:false
    };
  }
  otpOpt(){
    this.setState({isOtp:false});
    this.setState({btnText:'Get OTP'});
  }
  usePwd(){
    this.setState({isOtp:true});
    this.setState({isGetOtp:false});
    this.setState({btnText:'Login'});
    this.setState({userPhone:''});
  }
  forgotPassword(){
    this.props.navigation.navigate('ForgetPasswordScreen');
  }
  registerUser(){
    this.props.navigation.replace('PublicNavigationStack',{'isfor':'register'});
  }
  setTextVal(val,type){
    if(type == 'phone'){
      this.setState({userPhone:val});
    }else if(type == 'password'){
      this.setState({userPassword:val});
    }else if(type == 'otp'){
      this.setState({userOtp:val});
    }
  }
  resendOtp(){
    this.setState({errMsg:'OTP Sent'});
    this.setState({ishowMOdal:true});
  }
  componentDidMount() {
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
      this.otpOpt();
  }
  sendAgain = async () => {
    if (this.state.userPhone == '') {
      this.setState({errMsg:AlertMessages.phoneNumberErr});
      this.setState({ishowMOdal:true});
      return;
    }


    this.setState({loading:true});
      let data = JSON.stringify({
        phone_number: this.state.userPhone
      });
        console.log('login otp send---',data);
        //return;
      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      }
    axios.post(Api.apiUrl+'/send-login-otp', data, headers)
    .then(res => {
      console.log(res.data); 
      
      this.setState({loading:false});
      this.setState({errMsg:AlertMessages.otpResendMessage});
      this.setState({ishowMOdal:true});

      setTimeout(
          function() {
               this.setState({ishowMOdal:false});
          }
          .bind(this),
          3000
      );

     
      return;


      /*this.setState({errMsg:res.data.message});
      this.setState({ishowMOdal:true});*/
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

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  keyboardDidHide = () => {
      Keyboard.dismiss();
  };
  handleCallback = (childData) =>{
      this.setState({ishowMOdal: childData})
  }
  render (){
    const {loading,isPhoneErr,isPwdErr,isOtp,btnText,isGetOtp,userPassword,userOtp,userPhone,errMsg,ishowMOdal} = this.state;
    const handleSubmitPress = async () => {

   if(!isGetOtp){
    if (userPhone == '') {
      this.setState({errMsg:AlertMessages.phoneNumberErr});
      this.setState({ishowMOdal:true});
      return;
    }
    if(isOtp){
      if (userPassword == '') {
        this.setState({errMsg:AlertMessages.passwordErr});
       this.setState({ishowMOdal:true});
        return;
      }
    }
    
    if(!isOtp){

      this.setState({loading:true});
      let data = JSON.stringify({
        phone_number: userPhone
      });
      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      }
      console.log('login data is '+data); 
      axios.post(Api.apiUrl+'/send-login-otp', data, headers)
      .then(res => {
       console.log('login return data is ---'+res.data.isstat); 
       console.log('login return data is ---'+res.data.message); 
      
        this.setState({loading:false});
        if(res.data.isstat == 1){
           this.setState({btnText:'Login'});
           this.setState({isGetOtp:true});
        }else if(res.data.isstat == 2){
          this.setState({errMsg:res.data.message});
          this.setState({ishowMOdal:true});
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

     

      return;
    }
   }

   if (isGetOtp && userOtp == '') {
       this.setState({errMsg:AlertMessages.otpErr});
       this.setState({ishowMOdal:true});
      return;
    }else{
      if (!isGetOtp){
      this.setState({loading:true});
      let data = JSON.stringify({
        phone_number: userPhone,
        password: userPassword
      });
      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      }
      axios.post(Api.apiUrl+'/login-user', data, headers)
      .then(res => {
        console.log('login-user---',data); 
        console.log('login-user---- ',res.data); 
        this.setState({loading:false});
        if(res.data.is_logged_in == 1){
          let apLck = 'U';
          if(res.data.user.is_app_lock == '1'){
             apLck = 'L';
          }
          void checkToken();
          AsyncStorage.setItem('userDetailsData',JSON.stringify(res.data.user_details));
          AsyncStorage.setItem('userData',JSON.stringify(res.data.user));
          AsyncStorage.setItem('isAppLock',apLck);
          AsyncStorage.setItem('UserAccessToken',JSON.stringify(res.data.access_token));
          this.props.navigation.replace('DrawerNavigationRoutes');
        }else if(res.data.is_logged_in == 2){
          this.setState({isPhoneErr:true});
          this.setState({isPwdErr:false});
        }else{
          this.setState({isPhoneErr:false});
          this.setState({isPwdErr:true});
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
      }else{
        this.setState({loading:true});
      let data = JSON.stringify({
        phone_number: userPhone,
        otp: userOtp
      });
      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      }
      //console.log(data);
      axios.post(Api.apiUrl+'/login-user', data, headers)
      .then(res => {
        
        console.log(res.data); 

        
        if(res.data.is_logged_in == 1){
          let apLck = 'U';
          if(res.data.user.is_app_lock == '1'){
             apLck = 'L';
          }
          void checkToken();
          AsyncStorage.setItem('userDetailsData',JSON.stringify(res.data.user_details));
          AsyncStorage.setItem('userData',JSON.stringify(res.data.user));
          AsyncStorage.setItem('isAppLock',apLck);
          AsyncStorage.setItem('UserAccessToken',JSON.stringify(res.data.access_token));

          if(res.data.user_details.guru_id != '0'){
            AsyncStorage.setItem('guruData',JSON.stringify(res.data.guru_data));
          }
          this.props.navigation.replace('DrawerNavigationRoutes');
          this.setState({loading:false});
        }else{
          this.setState({loading:false});
          this.setState({errMsg:res.data.message});
          this.setState({ishowMOdal:true});
          
        }
      }).catch(error => {
        this.setState({loading:false}); 
        
        if(error.toJSON().message === 'Network Error'){
          this.setState({errMsg:AlertMessages.noInternetErr});
          this.setState({ishowMOdal:true});
          
        }else{
         
           this.setState({errMsg:error});
          this.setState({ishowMOdal:true});
        }
      });
        
      }
    }
    
    
  };

  /*export const useTextInputModal = createUseModal<string>(({confirm, cancel}) => {
  const [value, setValue] = useState('');

  const handlePressConfirm = () => confirm(value);

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={setValue}
      />
      <View >
        <Button onPress={handlePressConfirm}>Confirm</Button>
        <Button onPress={cancel}>Cancel</Button>
      </View>
    </View>
  );
});*/


  return <ScrollView style={{backgroundColor:'#fff'}} contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
  
        }}><View style={styles.mainBody}>
      <Loader loading={loading} />
       {ishowMOdal && <UseAlertModal message={errMsg} parentCallback = {this.handleCallback} /> }
            <View style={{alignItems: 'center',justifyContent:'center'}}>
              <Image
                source={require('../../../assets/images/logo/logo_new.png')}
                style={{
                  width: 250,
                  resizeMode: 'contain',
                  marginTop: 20,
                  marginBottom: 10,
                }}
              />
            </View>
            <View style={styles.SectionStyle}>
              <Text style={styles.SectionHedText}>Login</Text>
            </View>
            <View style={styles.SectionStyleContent}>
             
            <Text style={styles.SectionContText}>Please enter your valid phone number. We will send you a 4-digit code to login. </Text>  
            </View>
            <View style={styles.mainStection}>
             
            <View style={styles.Nubcontainer}>
           
              <TextInput
                style={styles.inputStyle}
                onChangeText={(userPhonenum) =>
                  this.setTextVal(userPhonenum,'phone')
                }
                placeholder="Phone Number" //dummy@abc.com
                placeholderTextColor="#ADAFBB"
                
                maxLength={10}
                returnKeyType="done"
                keyboardType='number-pad'
               onSubmitEditing={()=> Keyboard.dismiss()}
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
              {isPhoneErr ? <Text style={styles.errorTextStyle}>Phone number is Invalid</Text>:null }

               {/*!isGetOtp && !isOtp ?<TouchableOpacity
                    style={styles.pwduseSec}
                    activeOpacity={0.5}
                    onPress={this.usePwd.bind(this,'x')}>
                      <Text style={styles.pwdContectSec}>Use Password</Text>
                    </TouchableOpacity> 
                :null */}
              </View>
              
              {isGetOtp ?
              <View style={styles.NubSeccontainer}>
            
              <TextInput
                style={styles.inputStyle}
                onChangeText={(userROtp) =>
                  this.setTextVal(userROtp,'otp')
                }
                placeholder="Enter OTP" //dummy@abc.com
                placeholderTextColor="#ADAFBB"
               ref={(input)=>this.secondTextInput = input}
                
              returnKeyType="done"
                maxLength={4}
                onSubmitEditing={()=> Keyboard.dismiss()}
                keyboardType='number-pad'

                
              />
              {isPhoneErr ? <Text style={styles.errorTextStyle}>Phone number is Invalid</Text>:null }

               
              </View>
              :null }

              {isOtp ?
              <View style={styles.NubSeccontainer}>
           
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserPassword) =>
                  this.setTextVal(UserPassword,'password')
                }
                placeholder="Password" //dummy@abc.com
                placeholderTextColor="#ADAFBB"
                autoCapitalize="none"
                ref={(input)=>this.secondTextInput = input}
                returnKeyType="done"
                onSubmitEditing={()=> Keyboard.dismiss()}
                secureTextEntry={true}
              />
              {isPwdErr ? <Text style={styles.errorTextStyle}>Password is Invalid</Text>:null }
              </View>
              :null}
              {isOtp ?
              <View style={styles.frgpasssection}>
                <TouchableOpacity
                    style={styles.pwduseSec}
                    activeOpacity={0.5}
                    onPress={this.otpOpt.bind(this,'x')}>
                      <Text style={styles.pswContectSec}>Use OTP</Text>
                    </TouchableOpacity> 
                <TouchableOpacity
                    style={styles.pwduseSec}
                    activeOpacity={0.5}
                    onPress={this.forgotPassword.bind(this,'x')}>
                      <Text style={styles.pswContectSec}>Forget Password!</Text>
                    </TouchableOpacity>   
              </View>
              :null}
              </View>
              <View style={styles.loginbtn}>
            <TouchableOpacity
              
              activeOpacity={0.9}
              onPress={handleSubmitPress} style={styles.buttonOuter}>
               <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={styles.buttonStyle}>
        {!isOtp && <Text style={styles.buttonTextdStyle}>{btnText}</Text>}
        {isOtp && <Text style={styles.buttonTextStyle}>{btnText}</Text>}
              
              </LinearGradient>
            </TouchableOpacity>
             <View style={styles.regection}>
             <View>
              {isGetOtp && <TouchableOpacity
              style={styles.buttsendAgainContent}
              activeOpacity={0.8}
              onPress={({ nativeEvent }) => (
                nativeEvent.key === 'Backspace' ? this.sendAgain() : this.sendAgain()
              )}
              >
              
              <Text style={styles.buttonTextStyleA}>Resend Code</Text>
              
            </TouchableOpacity>  }</View>
                <TouchableOpacity
                    style={styles.backBtnSection}
                    activeOpacity={0.5}
                    onPress={this.registerUser.bind(this,'x')}>
                      <Text style={styles.pswContectSec}>New User? <Text style={styles.pswRContectSec}>Register</Text></Text>
                    </TouchableOpacity> 


              </View>



        </View>

    </View></ScrollView>
}
}
export default UserLoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: AppStyle.appColor,
    alignContent: 'center',
    paddingLeft:35,
    paddingRight:35,
    paddingBottom: AppStyle.appBottomPadding,
     fontFamily: 'Abel',
  },
  CountryBox:{
  width: '30%',
  height: 60,
 borderTopWidth:1,
    borderLeftWidth:1,
    borderBottomWidth:1,
    borderColor:'#999999',
    position:'relative',
  padding: 10,
  borderTopLeftRadius:10,
  borderBottomLeftRadius:10
                          
  },
  pswRContectSec: {
    color: 'rgba(253, 139, 48,0.9)',
    fontSize: 15,
    alignSelf: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily:'GlorySemiBold',
  },

  SectionStyle: {
    flexDirection: 'row',
   
  },

  SectionStyleContent: {
    flexDirection: 'row',
   marginTop:10,
    marginBottom: 25,
    
  },
  mainStection:{
    
  },
  Nubcontainer:{
   
  },
  NubSeccontainer:{
    marginTop:15
  },
  CountryBoxdrop:{

  },
  SectionHedText:{
     fontSize:27,
     fontFamily: 'GlorySemiBold',
     color: AppStyle.fontColor,
  },
  SectionContText:{
  	fontSize:AppStyle.contenyFontsize,
    fontFamily: 'Abel',
    lineHeight:AppStyle.contentlineHeight,
    color: AppStyle.fontColor,
  },
  loginbtn:{
    marginTop:20
  },
  buttonStyle: AppStyle.AppbuttonStyle,
  buttonTextStyle: {
    color: AppStyle.fontButtonColor,
    fontFamily: 'GlorySemiBold',
    fontSize: AppStyle.buttonFontsize,
    textTransform:'capitalize'

  },
  buttonTextdStyle: {
    color: AppStyle.fontButtonColor,
    fontFamily: 'GlorySemiBold',
    fontSize: AppStyle.buttonFontsize,
   

  },
  CountryText:{
      color: AppStyle.inputBlackcolorText,
      fontSize: AppStyle.inputFontsize,
      paddingVertical:9,
      fontFamily: 'Abel'
  },
  inputStyle: {
    borderWidth:1,
    borderColor:'#999999',
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    width:'100%',
    paddingRight: 15,
    fontSize:AppStyle.inputFontsize,
    borderRadius:10,
    fontFamily: 'Abel',
     height: 55,
  },
  pwduseSec:{
    flexDirection:'row',
    marginTop:10
  },
  pswContectSec: {
    color: AppStyle.fontColor,
    fontSize: 15,
    alignSelf: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily:'GlorySemiBold',
  },
  pwdContectSec: {
    color: AppStyle.fontColor,
    fontSize: 14,
    alignSelf: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily:'GlorySemiBold',
    textAlign:'left'
  },
  frgpasssection: {
    flexDirection:'row',
    justifyContent:'flex-end'
  },
  regection: {
    flexDirection:'row',
    justifyContent:'space-between'
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 12,
    fontFamily:'Abel',
    marginTop:10
  },
  buttsendAgainContent:{
    justifyContent:'flex-end',
    paddingRight:10
  },
  buttonTextStyleA: {
  color: 'rgba(253, 139, 48,0.9)',
  fontSize: 15,
  fontFamily: 'GlorySemiBold',
  textAlign:'right',

  }
});