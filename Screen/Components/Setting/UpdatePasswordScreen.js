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
  TextInput,
  ScrollView
} from 'react-native';

import AppStyle from '../../Constants/AppStyle.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Loader';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';

class UpdatePasswordScreen extends Component {

 constructor(props) {
    super(props);
    this.state = {
      isSwitchOn:false,
      userPhone:'',
      userPassword:'',
      userCpassword:'',
      loading:false,
      closeEye:true,
      openEye:false,
      scloseEye:true,
      sopenEye:false,
      ocloseEye:true,
      oopenEye:false,
      userData:[],
      errMsg:'Error',
      ishowMOdal:false
    };
  }

  
  goBack(){
    this.props.navigation.goBack();
  }

  setTextVal(val,type){
    if(type == 'phone'){
      this.setState({userPhone:val});
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

    if(type == 3 && val == 'close'){
      this.setState({ocloseEye : false});
      this.setState({oopenEye : true});
    }else if(type == 3 && val == 'open'){
      this.setState({ocloseEye : true});
      this.setState({oopenEye : false});
    }
  }
  
  async getUserData(){
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    this.setState({loading:true});
      let data = JSON.stringify({
        user_id: udata.id
      });
      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      }
      axios.post(Api.apiUrl+'/get-user-detail', data, headers)
      .then(res => {
        
        this.setState({loading:false});
        if(res.data.status == 'true'){
          this.setState({userData:res.data.data.user_detail.user});
        }else{
          console.log(error); this.state.loading = false; 
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

  componentDidMount(){
    this.getUserData();
  }

  handleCallback = (childData) =>{
      this.setState({ishowMOdal: childData});
  }

  render (){
        const {isEnabled,userPhone,userPassword,userCpassword,loading,closeEye,openEye,scloseEye,sopenEye ,userData,ocloseEye,oopenEye,errMsg,ishowMOdal} = this.state;

        let ftrue = true;
        let strue = true;
        let otrue = true;
        if(openEye == true){
          ftrue = false;
        }
        if(sopenEye == true){
          strue = false;
        }
        if(oopenEye == true){
          otrue = false;
        }
        let isSet = '0';
        let uId = userData.id;
        let pwdHeading = 'Create New Password';
        console.log(userData);
        if(userData.isSetPwd != '0'){
          pwdHeading = 'Update Password';
          isSet = '1';
        }


      
        
        const showCalculation = () => {
            if (this.state.isSwitchOn) {
              // do something
            } else {
              // do something else
            }
          }
          const handleSubmitPress =() => {
            const strongRegex = new RegExp(/^[a-zA-Z0-9]{8,}$/);
            
            if(userPhone == '' && isSet == '1'){
              this.setState({errMsg:AlertMessages.oldPasswordErr});
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
              password: userPassword,
              user_id:uId,
              isFor:isSet
            });
            let headers = {
              headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
              }
            }
            axios.post(Api.apiUrl+'/create-password', data, headers)
            .then(res => {
              console.log(res.data); 
              if(res.data.status == '1'){
                this.setState({errMsg:AlertMessages.changePwdMsg});
                this.setState({ishowMOdal:true});
                this.setState({loading:false});
                AsyncStorage.clear();
                this.props.navigation.replace('LoginNavigationStack');
              }else{
                this.setState({errMsg:res.data.message});
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
     return <ScrollView style={{backgroundColor:'#fff'}}><View style={styles.mainBody}>
      <Loader loading={loading} />{ishowMOdal && <UseAlertModal message={errMsg} parentCallback = {this.handleCallback} /> }
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
                <Text style={styles.SectionHeadStyle}>{pwdHeading}</Text>
               {/*} <Text style={styles.SectionsubHeadStyle}>(Sender’s View of Sent Cookies)</Text> */}
              </View>

                


                {isSet == '1' && <View style={styles.mainStection}>
                  <Text style={styles.Lable}>Old Password</Text>
                  <View style={styles.FieldSection}>
                    <TextInput
                      style={styles.inputStyle}
                      onChangeText={(Phone) =>
                        this.setTextVal(Phone,'phone')
                      }
                      placeholder="Old Password"
                      placeholderTextColor="#000"
                      autoCapitalize="none"
                      returnKeyType="next"
                      onSubmitEditing={()=>this.secondTextInput.focus()}
                      secureTextEntry={otrue}
                    />
                    {ocloseEye && <TouchableOpacity style={styles.eyeIcon} onPress={() => this.iconEye('3','close')}>
                    <Image
                    source={require('../../../assets/images/icons/closeeye.png')}
                     style={[{
                     resizeMode: 'contain',
                      width:24
                      
                    },styles.imgIscon]}
                    />
                    </TouchableOpacity> }
                    {oopenEye && <TouchableOpacity style={styles.eyeIcon} onPress={() => this.iconEye('3','open')}>
                    <Image
                    source={require('../../../assets/images/icons/Icon_eye.png')}
                     style={[{
                     resizeMode: 'contain',
                      width:24
                     
                    },styles.imgsIcon]}
                    />
                    </TouchableOpacity>}
                  </View>
                </View>

                }


                <View style={styles.mainStection}>
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
                       onSubmitEditing={()=>this.thirdTextInput.focus()}
                      ref={(input)=>this.secondTextInput = input}
                      
                      returnKeyType="next"
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
                </View>

                <View style={styles.mainStection}>
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
                </View>
                
              </View>
              <View style={styles.btnCont}>
                     <TouchableOpacity
                    
                    activeOpacity={0.8}
                    onPress={handleSubmitPress}>
                     <LinearGradient
                // Button Linear Gradient
                colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
                style={styles.buttonStyle}>
                    <Text style={styles.buttonTextStyle}>UPDATE</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
              </View>
              
        
     </View></ScrollView>
            
  }
};
export default UpdatePasswordScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex:1,
    backgroundColor: AppStyle.appColor,
    paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
     paddingBottom: AppStyle.appInnerBottomPadding,
     paddingTop: AppStyle.appInnerTopPadding,
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
    marginLeft:15
  },
  headingText:{
    color: '#FF9228',
    fontSize:27,
   
    fontFamily: 'GlorySemiBold',
  },
  mainStection:{
    marginTop:20,
  },
  inputStyle:{
    padding:15,
    borderWidth:1,
    borderColor:'#E8E6EA',
    width:'100%',
    borderRadius:15,
    fontFamily: 'Abel',
    backgroundColor:'#fff'
  },
  btnCont:{
    marginTop:35
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
    fontSize:18,
    fontFamily: 'GlorySemiBold'
  },
  Lable:{
    color: AppStyle.fontColor,
    fontSize:16,
    fontFamily: 'GlorySemiBold',
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