// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState,Component} from 'react';
import { NativeEventEmitter } from 'react-native';
import axios from 'axios';
import Api from '../../Constants/Api.js';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  Switch,
  Pressable,
  Keyboard,
  TextInput,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppStyle from '../../Constants/AppStyle.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Loader';
import { FontAwesome } from '@expo/vector-icons';
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';

class ForgetPasswordScreen extends Component {

 constructor(props) {
    super(props);
    this.state = {
      isSwitchOn:false,
      userPhone:'',
      userOtp:'',
      userPassword:'',
      userCpassword:'',
      loading:false,
      closeEye:true,
      openEye:false,
      scloseEye:true,
      sopenEye:false,
      isGetOtp:true,
      isOtpField:false,
      isUpdatepassword:false,
      btnTxtVal:'GET OTP',
      errMsg:'Error',
      ishowMOdal:false,
    };
  }
 
  
  goBack(){
    this.props.navigation.goBack();
  }

  setTextVal(val,type){
    if(type == 'phone'){
      this.setState({userPhone:val});
    }else if(type == 'otp'){
      this.setState({userOtp:val});
    }else if(type == 'password'){
      this.setState({userPassword:val});
    }else if(type == 'cpassword'){
      this.setState({userCpassword:val});
    }
  }
  iconEye(type,val) {
    if(type == 1 && val == 'close'){
      this.setState({closeEye : false});
      this.setState({openEye : true});
    }else if(type == 1 && val == 'open'){
      this.setState({closeEye : true});
      this.setState({openEye : false});
    }

    if(type == 2 && val == 'close'){
      this.setState({scloseEye : false});
      this.setState({sopenEye : true});
    }else if(type == 2 && val == 'open'){
      this.setState({scloseEye : true});
      this.setState({sopenEye : false});
    }
  }
  handleCallback = (childData) =>{
      this.setState({ishowMOdal: childData});
  }
  

  render (){
        const {isEnabled,userPhone,userOtp,userPassword,userCpassword,loading,closeEye,openEye,scloseEye,sopenEye ,isUpdatepassword,btnTxtVal,isOtpField,ishowMOdal,errMsg} = this.state;

        let ftrue = true;
        let strue = true;
        if(openEye == true){
          ftrue = false;
        }
        if(sopenEye == true){
          strue = false;
        }
        
        const showCalculation = () => {
            if (this.state.isSwitchOn) {
              // do something
            } else {
              // do something else
            }
          }
        const getOpthandel = async () => {
   
        if (!userPhone) {
           this.setState({errMsg:AlertMessages.phoneNumberErr});
              this.setState({ishowMOdal:true});
          return;
        }
        if (isOtpField && !userOtp) {
           this.setState({errMsg:AlertMessages.otpErr});
              this.setState({ishowMOdal:true});
          return;
        }
        if(!isOtpField){
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
          axios.post(Api.apiUrl+'/get-otp', data, headers)
          .then(res => {
            this.setState({isOtpField:true});
            this.setState({btnTxtVal:'CREATE PASSWORD'});
             this.setState({loading:false});
          })
          .catch(error => {
            
            if(error.toJSON().message === 'Network Error'){
              this.setState({errMsg:AlertMessages.noInternetErr});
              this.setState({ishowMOdal:true});
              this.setState({loading:false}); 
            }else{
              this.setState({errMsg:error.toJSON().message});
              this.setState({ishowMOdal:true}); 
              this.setState({loading:false});
            }
          });
        }else{
          this.setState({loading:true});
          let data = JSON.stringify({
          otp: userOtp
          });
          let headers = {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
          }
          axios.post(Api.apiUrl+'/verify-otp', data, headers)
          .then(res => {
            if(res.data.status == 'true'){
              this.setState({isUpdatepassword:true});
            }else{
              alert(res.data.message);
            }
            
           
             this.setState({loading:false});
          })
          .catch(error => {
            
            if(error.toJSON().message === 'Network Error'){
              this.setState({errMsg:AlertMessages.noInternetErr});
              this.setState({ishowMOdal:true});
              this.setState({loading:false}); 
            }else{
              this.setState({errMsg:error.toJSON().message});
              this.setState({ishowMOdal:true}); 
              this.setState({loading:false});
            }
          });
        }
        
      };

          
          const handleSubmitPress =() => {
            const strongRegex = new RegExp(/^[a-zA-Z0-9]{8,}$/);
            
            if(userPhone == ''){
              this.setState({errMsg:AlertMessages.phoneNumberErr});
              this.setState({ishowMOdal:true});
              
              return;
            }else if(userPassword == ''){
              this.setState({errMsg:AlertMessages.passwordErr});
              this.setState({ishowMOdal:true});
              return;
            }else if(!strongRegex.test(userPassword)){
             
              this.setState({errMsg:AlertMessages.passwordPetErr});
              this.setState({ishowMOdal:true});
              return;
            }else if(userCpassword == ''){
              
              this.setState({errMsg:AlertMessages.cnfPasswordErr});
              this.setState({ishowMOdal:true});
              return;
            }else if(userCpassword != userPassword){
             
              this.setState({errMsg:AlertMessages.valPasswordErr});
              this.setState({ishowMOdal:true});
              return;
            }
            

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
            axios.post(Api.apiUrl+'/forget-password', data, headers)
            .then(res => {
              console.log(res.data); 
              if(res.data.status == '1'){
               
                 this.setState({errMsg:AlertMessages.SucesPassword});
                  this.setState({ishowMOdal:true});
                this.setState({loading:false});
                this.props.navigation.navigate('UserLoginScreen');

              }else{
                this.setState({errMsg:AlertMessages.noRecordsErr});
              this.setState({ishowMOdal:true});
                this.setState({loading:false});
              }
            }).catch(error => {
             
      if(error.toJSON().message === 'Network Error'){
        this.setState({errMsg:AlertMessages.noInternetErr});
        this.setState({ishowMOdal:true});
        this.setState({loading:false}); 
      }else{
        this.setState({errMsg:error.toJSON().message});
        this.setState({ishowMOdal:true}); 
        this.setState({loading:false});
      }
            });
          }
        const toggleSwitch = () => setIsEnabled(previousState => !previousState);
     return <View style={styles.mainBody}>
      <Loader loading={loading} />
      {ishowMOdal && <UseAlertModal message={errMsg} parentCallback = {this.handleCallback} /> }
              <View style={styles.backSection}>
              <View style={styles.topheadSection}>
               <TouchableOpacity onPress={() =>
            this.goBack()} activeOpacity={0.7}>
            
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
                <Text style={styles.SectionHeadStyle}>Create New Password</Text>
               {/*} <Text style={styles.SectionsubHeadStyle}>(Sender’s View of Sent Cookies)</Text> */}
              </View>



                {!isOtpField && <View style={styles.mainStection}>
                  <Text style={styles.Lable}>Phone Number</Text>
                  <View style={styles.FieldSection}>
                    <TextInput
                      style={styles.inputStyle}
                      onChangeText={(Phone) =>
                        this.setTextVal(Phone,'phone')
                      }
                      onSubmitEditing={()=>Keyboard.dismiss()}
                      placeholder="Phone Number"
                      placeholderTextColor="#000"
                      autoCapitalize="none"
                      returnKeyType="next"
                      keyboardType='number-pad'
                       maxLength={12}
                      
                    />

                    
                  </View>
                </View> }

                {isOtpField && !isUpdatepassword && <View style={styles.mainStection}>
                  <Text style={styles.Lable}>OTP</Text>
                  <Text style={styles.otpLable}>Use : 1234</Text>
                  <View style={styles.FieldSection}>
                  
                    <TextInput
                      style={styles.inputStyle}
                      onChangeText={(Otp) =>
                        this.setTextVal(Otp,'otp')
                      }
                      onSubmitEditing={()=> Keyboard.dismiss()}
                      placeholder="Enter Otp"
                      placeholderTextColor="#000"
                      autoCapitalize="none"
                      returnKeyType="done"
                      keyboardType='number-pad'
                      
                      
                    />

                    
                  </View>
                </View> }

                {isUpdatepassword && <View style={styles.mainStection}>
                  <Text style={styles.Lable}>New Password</Text>
                  <View style={styles.FieldSection}>
                    <TextInput
                      style={styles.inputStyle}
                      placeholder="Password"
                      placeholderTextColor="#000"
                      autoCapitalize="none"
                      onChangeText={(Password) =>
                        this.setTextVal(Password,'password')
                      }
                      returnKeyType="next"
                      onSubmitEditing={()=>Keyboard.dismiss()}
                      
                      secureTextEntry={ftrue}
                    />
                    {closeEye && <TouchableOpacity style={styles.eyeIcon} onPress={() => this.iconEye('1','close')}>
                    <Image
                    source={require('../../../assets/images/icons/closeeye.png')}
                     style={[{
                     resizeMode: 'contain',
                      width:24
                      
                    },styles.imgIscon]}
                    />
                    </TouchableOpacity> }
                    {openEye && <TouchableOpacity style={styles.eyeIcon} onPress={() => this.iconEye('1','open')}>
                    <Image
                    source={require('../../../assets/images/icons/Icon_eye.png')}
                     style={[{
                     resizeMode: 'contain',
                      width:24
                     
                    },styles.imgsIcon]}
                    />
                    </TouchableOpacity>}
                  </View>
                </View> }

                {isUpdatepassword && <View style={styles.mainStection}>
                  <Text style={styles.Lable}>Confirm Password</Text>
                  <View style={styles.FieldSection}>
                    <TextInput
                    onChangeText={(ConfirmPassword) =>
                      this.setTextVal(ConfirmPassword,'cpassword')
                    }
                      style={styles.inputStyle}
                      placeholder="Confirm Password"
                      placeholderTextColor="#000"
                      autoCapitalize="none"
                       ref={(input)=>this.thirdTextInput = input}
                      returnKeyType="done"
                      onSubmitEditing={()=>Keyboard.dismiss()}
                      secureTextEntry={strue}
                    />

                   {scloseEye && <TouchableOpacity style={styles.eyeIcon} onPress={() => this.iconEye('2','close')}>
                    <Image
                    source={require('../../../assets/images/icons/closeeye.png')}
                     style={[{
                     resizeMode: 'contain',
                      width:24
                      
                    },styles.imgIscon]}
                    />
                    </TouchableOpacity> }
                    {sopenEye && <TouchableOpacity style={styles.eyeIcon} onPress={() => this.iconEye('2','open')}>
                    <Image
                    source={require('../../../assets/images/icons/Icon_eye.png')}
                     style={[{
                     resizeMode: 'contain',
                      width:24
                     
                    },styles.imgsIcon]}
                    />
                    </TouchableOpacity>}
                  </View>
                </View>}
                
              </View>
              {isUpdatepassword && <View style={styles.btnCont}>
                     <TouchableOpacity
                    
                    activeOpacity={0.9}
                    onPress={handleSubmitPress}>
                    <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={styles.buttonStyle}>
                    <Text style={styles.buttonTextStyle}>SAVE</Text>
                    </LinearGradient>
                  </TouchableOpacity>
              </View> }

              {!isUpdatepassword && !isUpdatepassword && <View style={styles.btnCont}>
                     <TouchableOpacity
                    
                    activeOpacity={0.9}
                    onPress={getOpthandel}>
                    <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={styles.buttonStyle}>
                    <Text style={styles.buttonTextStyle}>{btnTxtVal}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
              </View> }

              
     </View>
            
  }
};
export default ForgetPasswordScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex:1,
    backgroundColor: AppStyle.appColor,
    paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
    paddingBottom: 35,
    paddingTop: 60,
    height:'100%',
    
  },
  backSection:{
    textAlign:'left',
    justifyContent:'flex-start'
  },
  topheadSection:{
    display:'flex',
    justifyContent:'flex-start',
    alignItems:'center',
    flexDirection:'row',
    marginBottom:25
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
  SectionHeadStyle: {
    fontSize:27,
    fontFamily: 'GlorySemiBold',
    fontWeight:'400',
    color:AppStyle.fontColor,
    marginLeft:20
  },
  headingText:{
    color: '#FF9228',
    fontSize:25,
    fontWeight:'400',
    fontFamily: 'GlorySemiBold',
  },
  mainStection:{
    marginTop:20,
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
  btnCont:{
    marginTop:20
  },
  eyeIcon:{
    position:'absolute',
    right:14,
    zIndex:99
  },
  buttonStyle: {
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#dadae8',
    alignItems: 'center',
    borderRadius: 15,
    
    paddingTop:AppStyle.buttonTBPadding,
    paddingBottom:AppStyle.buttonTBPadding,
    
    
     width:'100%'

  },
  buttonTextStyle: {
    color: AppStyle.fontButtonColor,
    fontSize:16,
    fontSize: AppStyle.buttonFontsize,
    fontFamily: 'GlorySemiBold',
    textTransform:'capitalize'
  },
  Lable:{
    color: '#000',
    fontSize:12,
    fontSize: AppStyle.buttonFontsize,
    fontFamily: 'Abel',
    marginBottom:10
  },
  otpLable:{
    color: '#dadae8',
    flexDirection:'row',
    textAlign:'center',
    fontSize:12,
    fontSize: AppStyle.buttonFontsize,
    fontFamily: 'Abel',
    marginBottom:10
  },
  FieldSection:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  imgIcon:{
    position:'absolute',
    right:15
  }

});