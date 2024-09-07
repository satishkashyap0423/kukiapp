// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/
// Import React and Component
import React, {useState,Component} from 'react';
import {Picker} from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
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
  KeyboardAvoidingView,
  Pressable,
  Switch,
  Modal
} from 'react-native';
import AppStyle from '../../Constants/AppStyle.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Api from '../../Constants/Api.js';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';
import ProgressBar from '../Common/ProgressBar';
import { checkToken } from '../../pushnotification_helper.js';


class UserstatusScreen extends Component {
  constructor(props) {
  super(props);
  this.state = {
    userSignupData:{},
    imgaeData:null,
    imgaeDataBase64:null,
    userBio:'',
    loading:false,
    isEnabled:false,
    isSwitchOn:false,
    modalVisible:false,
    errMsg:'Error',
    ishowMOdal:false
  };
  }
  nextScreen(){

  }
  pickImage = async () => {
    this.setState({modalVisible:true});
  };
  setModalVisible(){
    this.setState({modalVisible:false});
  }

  async chooseImage(){
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      //base64: true,
    });

    console.log(result);

    if (!result.canceled) {

      this.setState({imgaeDataBase64:result});
      this.setState({imgaeData:result.assets[0].uri});
    }
     this.setState({modalVisible:false});
  }
   backScreen(){
    this.props.navigation.navigate('PersonalityTraits');
  }

   async openCamera(){
    // permissions request is necessary for launching the image library
       const perresult = await ImagePicker.requestCameraPermissionsAsync();
           
             if (perresult.granted === false) {
              
                 this.setState({errMsg:"You've refused to allow this app to access your photos!"});
                 this.setState({ishowMOdal:true});
             } else{
                 let result = await ImagePicker.launchCameraAsync({
             mediaTypes: ImagePicker.MediaTypeOptions.Images,
             allowsEditing: true,
             aspect: [4, 3],
             quality: 1,
                 //base64: true,
             });
                 
                 console.log(result);
                 
                 if (!result.cancelled) {
                     
                     this.setState({imgaeDataBase64:result});
                     this.setState({imgaeData:result.assets[0].uri});
                 }
                 this.setState({modalVisible:false});
             }
  }
  async componentDidMount(){
    let userSignupData = await AsyncStorage.getItem('userSignupData');
    this.setState({userSignupDataObj:JSON.parse(userSignupData)});
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

  }
  createAlert = (FirstName) =>
  Alert.alert(
    "Required",
    FirstName,
    [
    { text: "OK", onPress: () => console.log("OK Pressed") }
    ]
  );
  setUserbio(val){
     this.setState({userBio:val});
  }
  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  keyboardDidHide = () => {
      Keyboard.dismiss();
  };

  appLock(isFor){
    if(isFor == 1){
       Alert.alert(
      'App Lock',
      'If you will enable this feature, you need to login everytime while you will trying to access the app ?', // <- this part is optional, you can pass an empty string
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Enable', onPress: () => this.setState({isSwitchOn:isFor})},
      ],
      {cancelable: false},
    );


    }else{
       Alert.alert(
      'Block User',
      'If you will disable this feature, you do not need to login everytime while you will trying to access the app  ? ', // <- this part is optional, you can pass an empty string
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Disable', onPress: () => this.setState({isSwitchOn:isFor})},
      ],
      {cancelable: false},
    );
    }
  }
  handleCallback = (childData) =>{
      this.setState({ishowMOdal: childData});
  }



  
render (){

  const {imgaeData,imgaeDataBase64,loading,userBio,isEnabled,modalVisible,errMsg,ishowMOdal} = this.state;
  const handleSubmitPress = () => {
    if (imgaeDataBase64 == null) {
      this.setState({errMsg:AlertMessages.userImageErr});
      this.setState({ishowMOdal:true});
      return;
    }
    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    let preVvalue = this.state.userSignupDataObj;
    if(imgaeDataBase64 !== null){
      let localUri = imgaeDataBase64.assets[0].uri;
      let filename = localUri.split('/').pop();
      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      // Assume "photo" is the name of the form field the server expects
      formData.append('photo', { uri: localUri, name: filename, type });
    }

    let contryVla = preVvalue.selectedCountryValue.toString().split("+");

    formData.append('FirstName', preVvalue.FirstName);
    formData.append('LastName', preVvalue.LastName);
    formData.append('community_id', preVvalue.community_id.toString());
    formData.append('selectedReligionValue', preVvalue.selectedReligionValue.toString());
    formData.append('selectedAgeValue', preVvalue.selectedAgeValue.toString());
    formData.append('selectedCountryValue', preVvalue.country_code.replace('+', ''));
    formData.append('selectedCityValue', preVvalue.selectedCityValue.toString());
    formData.append('selectedGenderValue', preVvalue.selectedGenderValue.toString());
    formData.append('selectedStateValue', preVvalue.selectedStateValue.toString());
    formData.append('language_ids', preVvalue.languages);
    formData.append('traits_ids', preVvalue.traits_ids);
    formData.append('userBio', 'What would be your prayer for today?');
    formData.append('phone_number', preVvalue.phone_number);
    formData.append('country_code', preVvalue.country_code);
    formData.append('device_token', preVvalue.device_token);
    formData.append('ethnicity', preVvalue.EthnicityVal);
    if(this.state.isSwitchOn){
    	formData.append('app_lock', 1);
    }else{
    	formData.append('app_lock', 0);
    }
  

    preVvalue.imageData = formData;
    //preVvalue.userBio = this.state.userBio;
    preVvalue.userBio = ''

    if(preVvalue.userLocation != null){
      formData.append('latitude', preVvalue.userLocation.coords.latitude);
      formData.append('longitude', preVvalue.userLocation.coords.longitude);
    }else{
      formData.append('latitude', '');
      formData.append('longitude', '');
    }
    console.log('send user data---',formData);
    // return;
    
    const token = '3|8kdMzsHYkQGynpZphqOWnfZoCE2pbhYckD135Wd9';
    let headers = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
      'enctype': 'multipart/form-data',
      }
    }
    console.log(formData);
     this.setState({loading:true});
   // return;
    axios.post(Api.apiUrl+'/save-user-detail', formData, headers)
    .then(res => {
      let apLck = 'U';
      if(res.data.user.is_app_lock == '1'){
         apLck = 'L';
      }
      void checkToken();
      AsyncStorage.setItem('userDetailsData',JSON.stringify(res.data.user_details));
      AsyncStorage.setItem('userData',JSON.stringify(res.data.user));
      AsyncStorage.setItem('isAppLock',apLck);
      AsyncStorage.setItem('UserAccessToken',JSON.stringify(res.data.access_token));
       this.setState({loading:false});
      this.props.navigation.replace('DrawerNavigationRoutes');
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
    
  };

  return <ScrollView style={{backgroundColor:'#fff'}} contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
  
        }}>{ishowMOdal && <UseAlertModal message={errMsg} parentCallback = {this.handleCallback} /> }<View style={styles.mainBody}>
  <Loader loading={loading} />
  <View style={styles.topheadAsSection}>
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
      <ProgressBar step='6' />
  <View style={styles.outerContainerSection}>
   <TouchableOpacity activeOpacity={0.9} onPress={() =>
              this.pickImage()}><View style={styles.outerImgSection}>
           {!imgaeData && <Image
              source={require('../../../assets/images/uphoto.png')}
              style={styles.imagetopCont}
              />
              }
              {imgaeData && <Image source={{ uri: imgaeData }}  style={styles.imagetopCont} />}
           <View style={styles.outerCameraSec}><FontAwesome5 name="camera" size={28} color={AppStyle.appIconColor} /></View></View></TouchableOpacity>

           </View>

     <View style={styles.topheadSection}>
        
          
            
     
        <View style={styles.conttentRight}>
           <Text style={styles.ContnetSection}>Take a picture or upload From File</Text>
           {/*<TouchableOpacity activeOpacity={0.9} onPress={() =>
              this.pickImage()}>
              <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={styles.buttonSection}>
              <Text style={styles.buttonSectionTxt}>UPLOAD</Text>
               </LinearGradient>
           </TouchableOpacity>*/}
        </View>
     </View>
     <View style={styles.bottomContentSection}>
        {/*<TextInput
        style={styles.inputStyle}
        placeholder="e. g. off to mumbai to 3 days" //dummy@abc.com
        placeholderTextColor="#000"
        onChangeText={(UserBio) =>
                  this.setUserbio(UserBio)
                }
       
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
        blurOnSubmit={false}
        />
        <Text style={styles.Label}>What are you up to</Text>
       <Pressable onPress={() => this.goBack()} style={styles.mainStection}>
                  <View style={styles.leftNotiSection}>
                    
                    <Text style={styles.apLabel}>App Lock</Text>
                  </View>
                  <View style={styles.rightNotiSection}>
                    <Switch 
                      onValueChange={this.appLock.bind(this)}
                      value={this.state.isSwitchOn} 
                       trackColor={{ false: "rgba(253, 139, 48, 0.69)", true: "#56CD54" }}
                      thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                    />
                  </View>
                </Pressable>*/}
        <View style={styles.btnCont}>
         
           <TouchableOpacity

              activeOpacity={0.9}
              onPress={handleSubmitPress}>
              <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}

        style={styles.buttonStyle}>
              <Text style={styles.buttonTextStyle}>Finish</Text>
              </LinearGradient>
           </TouchableOpacity>
           
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            //Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >
                 <View style={styles.urlSection}>
                 <Text style={styles.topheadImg}>Take a Picture or upload From File</Text>
                  
                    <View style={styles.urlbtnSection}>
                  <Pressable
                onPress={() => {
                  this.openCamera();
                }}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? 'rgb(210, 230, 255)'
                      : 'white'
                  },
                  styles.outerChoosesection
                ]}>
                <FontAwesome5 name="camera" size={22} color={AppStyle.gradientColorTwo} />
            <Text style={styles.urladdButton}>Camera</Text>
          </Pressable>

          <Pressable
                onPress={() => {
                  this.chooseImage();
                }}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? 'rgb(210, 230, 255)'
                      : 'white'
                  },
                  styles.outerChoosesection
                ]}>
                <FontAwesome5 name="wallet" size={22} color={AppStyle.gradientColorTwo} />
            <Text style={styles.urladdButton}> Choose</Text>
          </Pressable>
          <Pressable
                onPress={() => {
                  this.setModalVisible();
                }}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? 'rgb(210, 230, 255)'
                      : 'white'
                  },
                  styles.outerChoosesection
                ]}>
                <FontAwesome5 name="times" size={22} color={AppStyle.gradientColorTwo} />
            <Text style={styles.urladdButton}>Close</Text>
          </Pressable>
                  </View>
                  </View>

                  </Modal>
     </View>
  </View></ScrollView>
  }
};

export default UserstatusScreen;
const styles = StyleSheet.create({
  mainBody: {
  flex:1,
  backgroundColor: AppStyle.appColor,
  paddingLeft: 15,
  paddingRight:15,
  paddingBottom: 35,
  paddingTop: 35,
 
  },
  topheadAsSection:{
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center',
  flexDirection:'row',
  marginBottom:15,
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
  topheadSection:{
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center',
  flexDirection:'row',
  marginBottom:15
  },
  ContnetSection:{
  fontSize: 18,
  color:'#000000',
  lineHeight:24,
  textAlign:'center',
  fontFamily: 'Abel',
  marginBottom:10,
  color: AppStyle.fontColor,
  },
  outerContainerSection:{
    justifyContent:'center',
    flexDirection:'row',
    marginBottom:20,
    alignItems:'center'
  },
  outerCameraSec:{
    position:'absolute',
    right:-10,
    bottom:10
  },
  outerImgSection:{
   
    flexDirection:'row',
    width:114,
    height:115,
    borderRadius:120,
    borderWidth:2,
    borderColor:'#b1b1b1',
    padding:3,
    marginRight:10,
    textAlign:'center',
  
  },
  imagetopCont:{
    width:104,
    height:104,
    borderRadius:108,
    marginTop: 0.8,
  },
  conttentRight:{
  flex:1,
  paddingLeft:10,
  paddingRight:10,
  width:'100%',
  },
  buttonSectionTxt:{
    color:'#fff',
  fontFamily: 'GlorySemiBold',
  fontSize:17,
   textAlign:'center',
  },
  buttonSection:{
 
  paddingTop:15,
  paddingBottom:16,
  paddingLeft:15,
  paddingRight:15,
  marginLeft:'auto',
  marginRight:'auto',
  borderRadius:10,
  marginTop:10,
  width:'40%',
  
  },
  mainContentSection:{
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center',
  flexDirection:'row',
  marginTop:25,
  paddingLeft:10,
  paddingRight:10,
  },
  contentLeft:{
  fontSize:16,
  fontFamily: 'Abel',
  },
  contentRight:{
  fontSize:14,
  color:'rgba(253, 139, 48, 0.69)',
  fontFamily: 'Abel',
  },
  galleryContentSection:{
  paddingLeft:10,
  paddingRight:10,
  marginTop:10
  },
  galleryTopgallrysec:{
  flexDirection:'row',
  justifyContent:'space-between',
  },
  gallerybottomgallrysec:{
  flexDirection:'row',
  justifyContent:'space-between',
  marginTop:20
  },
  bottomContentSection:{
  marginTop:15,
  paddingLeft:10,
  paddingRight:10
  },
  inputStyle:{
  padding:15,
  borderWidth:1,
  borderColor:'#E8E6EA',
  width:'100%',
  borderRadius:15,
  fontFamily: 'Abel',
  fontSize:15,
  textTransform:'capitalize'
  },
  Label:{
  position:'absolute',
  fontSize:16,
  left:30,
  top:-7,
  paddingRight:5,
  paddingLeft:5,
  fontFamily: 'Abel',
  backgroundColor:'#fff'
  },
  apLabel:{
  fontSize:16,
  fontFamily: 'Abel',
  backgroundColor:'#fff',
  fontFamily: 'GlorySemiBold',
  color: AppStyle.fontColor,
  },
  btnCont:{
  marginTop:1,

   },
  buttonStyle: AppStyle.AppbuttonStyle,
  buttonTextStyle:{
  color:AppStyle.fontButtonColor,
   fontSize: AppStyle.buttonFontsize,
  fontFamily: 'GlorySemiBold',
   },
  rightNotiSection:{
    flexDirection:'row',
    justifyContent:'flex-end',
    width:'65%',
    alignItems:'center'
  },
  mainStection:{
    flexDirection:'row',
    paddingLeft:15,
    paddingRight:15,
    paddingTop:10,
    paddingBottom:10,
    borderWidth:1,
    borderRadius:10,
    borderColor:'#E8E6EA',
    marginTop:20,
    backgroundColor:'#fff',
    borderRadius:10,
    borderWidth:1
  },
  leftNotiSection:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'35%',
    alignItems:'center'
  },
  rightNotiSection:{
    flexDirection:'row',
    justifyContent:'flex-end',
    width:'65%',
    alignItems:'center'
  },
  urlSection:{
    paddingLeft:20,
    paddingRight:20,
    justifyContent:'center',
    flex: 1,
    alignItems:'center',
    flexDirection:'column'
  },
  urlbtnSection:{
    flexDirection:'row',
    marginTop:15
  },
  inputUrlStyle:{
    borderWidth:1,
    borderColor:'#E8E6EA',
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    width:'100%',
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 15,
    fontSize:AppStyle.inputFontsize,
    borderRadius:15,
    fontFamily: 'Abel'
  },
  outerChoosesection:{
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    padding:10,
    borderRadius:100,
    borderWidth:1,
    borderColor:'#E8E6EA',
    marginLeft:8,
    width:85,
    height:85,
  },
  urladdButton:{
    color: AppStyle.gradientColorTwo,
    fontSize:16,
    fontWeight:'400',
    fontFamily: 'Abel',
    display:'flex'
  },
  topheadImg:{
    fontSize: 20,
    color:'#000000',
    lineHeight:30,
    textAlign:'center',
    fontFamily: 'Abel',
    marginBottom:20
  }
});
