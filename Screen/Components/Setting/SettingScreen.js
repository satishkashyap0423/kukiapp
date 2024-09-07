// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState,Component} from 'react';
import { NativeEventEmitter } from 'react-native';

import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  Switch,
  Pressable,
  ScrollView
} from 'react-native';

import AppStyle from '../../Constants/AppStyle.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../../Constants/Api.js';
import Loader from '../../Components/Loader';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';
import * as Notifications from 'expo-notifications';

class SettingScreen extends Component {

 constructor(props) {
    super(props);
    this.state = {
      isSwitchOn:false,
      isSwitchLOn:false,
      loading:false
    };
  }

  goBack(){
    this.props.navigation.goBack();
  }

  goPassword(){
    this.props.navigation.navigate('UpdatePasswordScreen');
  }

  logout(){
    this.props.navigation.navigate('SettingScreen');
  }

  async getUserNotificationSetting(){
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
      axios.post(Api.apiUrl+'/get-user-nfsetting', data, headers)
      .then(res => {
        
        this.setState({loading:false});
        if(res.data.status == 'true'){
          
          if(res.data.isNoty == '1'){
            this.setState({isSwitchOn:true});
          }

          if(res.data.is_app_lock == '1'){
            this.setState({isSwitchLOn:true});
          }
          
        }else{
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


  handleCallback = (childData) =>{
      this.setState({ishowMOdal: childData});
  }

  componentDidMount(){
    this.getUserNotificationSetting();

  }
  async handleSubmitPress (){

            let udata = JSON.parse(await AsyncStorage.getItem('userData'));
           
            
            if(!this.state.isSwitchOn){
              this.setState({isSwitchOn:true});
            } else{
              this.setState({isSwitchOn:false});
            }
            let noti = this.state.isSwitchOn;
            if(noti){
              const { status: existingStatus } = await Notifications.getPermissionsAsync();
              let finalStatus = existingStatus;
              if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
              }
              if (finalStatus !== 'granted') {
              
                await Notifications.requestPermissionsAsync();
                
              }
            }
            //let appLock = this.state.isSwitchLOn;
            let appLock = false;
            //return
             this.setState({loading:true});
            let data = JSON.stringify({
              user_id: udata.id,
              status: noti,
              appLock: appLock,
            });
            let headers = {
              headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
              }
            }
            console.log(data);
            axios.post(Api.apiUrl+'/set-notification', data, headers)
            .then(res => {
              /*this.setState({errMsg:AlertMessages.updateNotiMsg});
              this.setState({ishowMOdal:true});
              
              let apLock = 'U';
              if(this.state.isSwitchLOn){
                apLock = 'L';
              }
              AsyncStorage.setItem('isAppLock',apLock);*/
              this.setState({loading:false});
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

  render (){
        const {isEnabled,loading,errMsg,ishowMOdal } = this.state;
        const showCalculation = () => {
            if (this.state.isSwitchOn) {
              // do something
            } else {
              // do something else
            }
          }
          
        const toggleSwitch = () => setIsEnabled(previousState => !previousState);

      
        
     return <ScrollView style={{backgroundColor:AppStyle.btnbackgroundColor}}><Loader loading={loading} />{ishowMOdal && <UseAlertModal message={errMsg} parentCallback = {this.handleCallback} /> }<View style={styles.mainBody}>
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
                <Text style={styles.SectionHeadStyle}>Settings</Text>
               {/*} <Text style={styles.SectionsubHeadStyle}>(Sender’s View of Sent Cookies)</Text> */}
              </View>

                <Pressable onPress={() => this.goBack()} style={styles.mainStection}>
                  <View style={styles.leftNotiSection}>
                     <Feather 
                  name={'bell'}
                  size={25} 
                  color={AppStyle.appIconColor}
                   
                />

                    <Text style={styles.sutextSec}>Notification</Text>
                  </View>
                  <View style={styles.rightNotiSection}>
                    <Switch 
                      onValueChange={this.handleSubmitPress.bind(this)}
                      value={this.state.isSwitchOn} 
                       trackColor={{ false: "#D3D3D3", true: "rgba(253, 139, 48, 0.69)" }}
                      thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                      ios_backgroundColor="rgba(253, 139, 48, 0.69)"
                    />
                  </View>
                </Pressable>


                 {/*<Pressable onPress={() => this.goBack()} style={styles.mainStection}>
                  <View style={styles.leftNotiSection}>
                     <Feather 
                  name={'lock'}
                  size={25} 
                  color={AppStyle.appIconColor}
                   
                />

                    <Text style={styles.sutextSec}>App Lock</Text>
                  </View>
                  <View style={styles.rightNotiSection}>
                    <Switch 
                      onValueChange={isSwitchLOn => this.setState({isSwitchLOn})}
                      value={this.state.isSwitchLOn} 
                       trackColor={{ false: "rgba(253, 139, 48, 0.69)", true: "#56CD54" }}
                      thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                      ios_backgroundColor="rgba(253, 139, 48, 0.69)"
                    />
                  </View>
                </Pressable>

                <Pressable onPress={() => this.goPassword()} style={styles.mainSubStection}>
                  <View style={styles.leftNotiSection}>
                      <Feather 
                  name={'key'}
                  size={25} 
                  color={AppStyle.appIconColor}
                   
                />

                    <Text style={styles.sutextSec}>Change Password</Text>



                    
                  </View>
                  <View style={styles.rightNotiSection}>
                    
                     <Feather 
                  name={'chevron-right'}
                  size={25} 
                  color={AppStyle.appIconColor}
                   
                />
                  </View>
                </Pressable>*/}

                
                
                
                
              </View>
              
              {/*<View style={styles.btnCont}>
                     <TouchableOpacity
                    
                    activeOpacity={0.8}
                    onPress={handleSubmitPress}>
                    <LinearGradient
                // Button Linear Gradient
                colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
                style={styles.buttonStyle}>
                    <Text style={styles.buttonTextStyle}>Save</Text>
                    </LinearGradient>
                  </TouchableOpacity>
              </View>*/}
     </View>
     </ScrollView>
            
  }
};
export default SettingScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex:1,
    backgroundColor: AppStyle.appColor,
    paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
     paddingBottom: AppStyle.appInnerBottomPadding,
     paddingTop: AppStyle.appInnerTopPadding,
    height:'100%',
    backgroundColor:AppStyle.btnbackgroundColor
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
    fontSize:AppStyle.aapPageHeadingSize,
    fontFamily: 'GlorySemiBold',
    fontWeight:'400',
    color:AppStyle.fontColor,
    marginLeft:20
  },
  headingText:{
    color: '#FF9228',
    fontSize:27,
     fontFamily:'GlorySemiBold'
  },
  mainStection:{
    flexDirection:'row',
    paddingLeft:15,
    paddingRight:15,
    height:60,
    borderWidth:1,
    borderRadius:10,
    borderColor:'#fff',
    marginTop:20,
    backgroundColor:'#fff'
  },
  mainSubStection:{
    flexDirection:'row',
    paddingLeft:15,
    paddingRight:15,
    
    borderWidth:1,
    borderRadius:10,
    borderColor:'#fff',
    marginTop:20,
    backgroundColor:'#fff',
    height:60,
  },
  leftNotiSection:{
    flexDirection:'row',
    
    width:'35%',
    alignItems:'center'
  },
  rightNotiSection:{
    flexDirection:'row',
    justifyContent:'flex-end',
    width:'65%',
    alignItems:'center'
  },
  btnCont:{
    
    marginTop:40,
    width:'100%',

   
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
  cancelbuttonStyle:{
  backgroundColor: ' rgba(253, 139, 48, 0.31)',
    borderWidth: 0,
    color: AppStyle.fontColor,
    borderColor: '#dadae8',
    alignItems: 'center',
    borderRadius: 15,
    
    paddingTop:22,
    paddingBottom:22,
    
    
     width:'100%'

  },
  sutextSec: {
    color: AppStyle.fontColor,
    fontSize:16,
    fontFamily: 'GlorySemiBold',
    marginLeft:10,
    width:200
  },
  buttonTextStyle: {
    color: AppStyle.fontButtonColor,
    fontSize:16,
    fontSize: AppStyle.buttonFontsize,
    fontFamily: 'GlorySemiBold'
  },
  logoutOptionMain:{
    alignItems:'center',
    marginTop:10
  },
  logoutOptionText:{
    color: AppStyle.fontColor,
    fontSize:16,
    fontWeight:'700',
    fontFamily: 'Abel',
    marginTop:40
  },
  logoutOptionTextCont:{
    color: 'rgba(253, 139, 48, 0.69)',
    fontSize:12,
    fontWeight:'400',
    fontFamily: 'Abel',
    marginTop:10
  }

});