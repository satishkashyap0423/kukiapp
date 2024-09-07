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
  Switch,
  TouchableHighlight,
  KeyboardAvoidingView,
  Modal
} from 'react-native';

import AppStyle from '../../Constants/AppStyle.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieNavigationScreen from '../Common/CookieNavigationScreen';
import axios from 'axios';
import Api from '../../Constants/Api.js';
import Loader from '../Loader';
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';

class CookiesDetail extends Component {

 constructor(props) {
    super(props);
    this.state = {
      userDetail:{},
      userRating:{},
      userData:{},
      userCommunity:{},
      userLanguages:{},
      userTraits:{},
      stateData:{},
      cityData:{},
      cookiesData:{},
      loading:false,
      isBlocked:'0',
      isSameBlocked:'0',
      isArchive:false,
      isSwitchOn:false,
       rateUser:5,
      rateddNumber:0,
      Userrating:0,
      expanded: false,
      cookiStat:0,
      isLoggedUserView:false,
      errMsg:'Error',
      ishowMOdal:false,
      modalVisible:false,
      blockTitle:'unblock',
      blockBtnText:'Unblock',
      curUid:'',
    };

    AsyncStorage.setItem('activeClass', 'FactiveClass');

  }

 
 

  editPrfile(val){
    this.props.navigation.push('EditUserScreen');
  }

  async rateUserRa(i){
  
   //this.setState({ratedNumber:i});

   
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    this.setState({loading:true});
    let to_user = this.props.route.params.user_id;

      let data = JSON.stringify({
        user_id: udata.id,
        to_user_id: to_user,
        rating: parseInt(i)
      });

      
      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      }
      
      axios.post(Api.apiUrl+'/rate-user', data, headers)
      .then(res => {
        this.setState({loading:false});
        this.getUserData();
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

  async blockUserfunc(){

  	let id 	  = this.state.curUid;
  	let isFor = 1
  	if(this.state.blockBtnText == 'Block'){
  		isFor = 0;
  	}

    this.setState({isSwitchOn:isFor})
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    this.setState({loading:true});


      let data = JSON.stringify({
        to_user_id: id,
        user_id: udata.id,
        isFor:isFor
      });
      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      }
      
      axios.post(Api.apiUrl+'/block-user', data, headers)
      .then(res => {
        this.setState({loading:false});
        this.setState({modalVisible:false}); 
        if(res.data.is_blocked == '1'){
          this.props.navigation.goBack();
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
  
  backScreen(){
    this.props.navigation.goBack();
  }

  openUserProfile(i){
    this.props.navigation.push('CookeiUserDetailScreen',{user_id:i,isFrom:2});
  }

  setFav(val){
    alert('fav set');
  }  


  alertBlockMessg = () => {
    this.setState({errMsg:AlertMessages.isBlockuserMessage});
          this.setState({ishowMOdal:true});
  } 

 sendThankErrMessg = () => {
    this.setState({errMsg:AlertMessages.sendThankErr});
          this.setState({ishowMOdal:true});
  }

   sendCookie = async (val,isSend,fName,lName) => {

    if(isSend == 1){
        let udata = JSON.parse(await AsyncStorage.getItem('userData'));
        this.setState({loading:true});
        let data = JSON.stringify({
        from_user_id: udata.id,
        to_user_id: val,
        isFor:'kuki'
        });
        let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
        }

        axios.post(Api.apiUrl+'/send-cookie', data, headers)
        .then(res => {
        this.setState({loading:false});
        if(res.data.status == 'true'){
          this.setState({errMsg:AlertMessages.sendKukiMsg+' to \n'+fName+' '+lName});
          this.setState({ishowMOdal:true});
          this.setState({cookiStat:res.data.cookiStat});
         // this.props.navigation.push('SentCookiesScreen');
        }else if(res.data.status == 'falses'){
          this.setState({errMsg:res.data.message});
          this.setState({ishowMOdal:true});
        }else{
          this.setState({errMsg:AlertMessages.lessKukiMsg});
          this.setState({ishowMOdal:true});
        }
        }).catch(error => {console.log(error); this.state.loading = false; });
    }else{
      this.setState({errMsg:AlertMessages.waitKukiErr});
          this.setState({ishowMOdal:true});
     
    }
    
  }

  readMore(val){

  }

  async getUserData(){
    
    let udata = this.props.route.params.user_id;
    let isFor = this.props.route.params.isFor;
    let isFrom = this.props.route.params.isFrom;
    let Ludata = JSON.parse(await AsyncStorage.getItem('userData'));


    //console.log(isFor);
    if(udata == Ludata.id){
      this.setState({isLoggedUserView:true});
    }
    
    if(isFor != undefined && isFor == 'block'){
      this.setState({isSwitchOn:true});
    }
    let isArchive = 0;
    if(isFor != undefined && isFor == 'archive'){
      isArchive = 1;
      this.setState({isArchive:true});
    }
   
    this.setState({loading:true});
      let data = JSON.stringify({
        user_id: udata,
        l_user_id: Ludata.id,
        isFrom:isFrom,
        isArchive:isArchive
      });

      //console.log('isFrom '+ data);
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
         // console.log('Stat - '+res.data.data.cookies); 
          this.setState({userDetail:res.data.data.user_detail});
          this.setState({Userrating:res.data.data.rating});
          this.setState({userData:res.data.data.user_detail.user});
          this.setState({stateData:res.data.data.user_detail.state_data});
          this.setState({cityData:res.data.data.user_detail.city_data});
          this.setState({userRating:res.data.data.rating});
          this.setState({rateddNumber:res.data.data.rated});
          this.setState({userCommunity:res.data.data.communities});
          this.setState({userTraits:res.data.data.personality_traits});
          this.setState({cookiesData:res.data.data.cookies});
           this.setState({userLanguages:res.data.data.languages});
           this.setState({cookiStat:res.data.data.cookiStat});
           this.setState({isBlocked:res.data.data.is_blocked});
           this.setState({isSameBlocked:res.data.data.is_same_blocked});
           if(res.data.data.is_blocked == '1'){
              this.setState({isSwitchOn:true});
            }
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

  async openKuki(isExp,isFrom,user_id,cookie_id){
    
       
       if(this.state.isArchive){
        return;
       }
       this.setState({loading:true});
       let udata = JSON.parse(await AsyncStorage.getItem('userData'));
      let data = JSON.stringify({
        cookie_id: cookie_id,
        user_id: user_id,
        isFrom: isFrom,
        l_user_id:udata.id,
      });
      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      }
      //console.log(data);
      //return;
      axios.post(Api.apiUrl+'/open-single-cookie', data, headers)
      .then(res => {
        this.setState({loading:false});
        //console.log(res.data.data);
        if(res.data.status == 'true'){
          this.setState({cookiesData:res.data.data});
        }else{
          console.log(error); 
        }
      }).catch(error => {console.log(error); this.state.loading = false; });
    }

  async archiveCookie(user_id,ccId,isFrom){
   
    this.setState({loading:true});
     let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    let data = JSON.stringify({
      user_id: user_id,
      cookie_id: ccId,
      isFrom:isFrom,
      l_user_id:udata.id
    });
    let headers = {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      }
    }
    axios.post(Api.apiUrl+'/archive-cookie', data, headers)
    .then(res => {
      this.setState({loading:false});
      if(res.data.status == 'true'){
        this.setState({cookiesData:res.data.data});
      }else{
       
        this.setState({errMsg:AlertMessages.noRecordsErr});
        this.setState({ishowMOdal:true});
        this.state.loading = false; 
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

  async deleteCookie(user_id,ccId,isFrom){
   
    this.setState({loading:true});
     let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    let data = JSON.stringify({
      user_id: user_id,
      cookie_id: ccId,
      isFrom:isFrom,
      l_user_id:udata.id
    });
    let headers = {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      }
    }
    axios.post(Api.apiUrl+'/delete-cookie', data, headers)
    .then(res => {
      this.setState({loading:false});
      if(res.data.status == 'true'){
        this.setState({cookiesData:res.data.data});
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

  async restoreCookie(user_id,ccId,isFrom){
   
    this.setState({loading:true});
     let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    let data = JSON.stringify({
      user_id: user_id,
      cookie_id: ccId,
      isFrom:isFrom,
      l_user_id:udata.id
    });
    //console.log(data);
    let headers = {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      }
    }
    axios.post(Api.apiUrl+'/restore-cookie', data, headers)
    .then(res => {
      this.setState({loading:false});
      if(res.data.status == 'true'){
        
        this.setState({errMsg:AlertMessages.restoreKukiMsg});
        this.setState({ishowMOdal:true});
       
        this.setState({cookiesData:res.data.data});
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

  async sharedookie(isval){
     if(this.state.isSwitchOn){
      this.setState({errMsg:AlertMessages.sendThankErr});
          this.setState({ishowMOdal:true});
          return;
    }
  }

  async shareCookie(msg,ccId,isFrom){

    if(this.state.isSwitchOn){
      this.setState({errMsg:AlertMessages.sendThankErr});
          this.setState({ishowMOdal:true});
          return;
    }
    let fdata = this.props.route.params.user_id;
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    /*let mesgCont = 'My Cookie Says : '+msg;
    if(isFrom != '1'){
      mesgCont = 'Thank you for your kuki, your kuki says: '+msg;
    }*/
    let mesgCont = 'Thank you for your kuki, your kuki says:'+msg;
    this.setState({loading:true});
    let data = JSON.stringify({
      from_user_id: udata.id,
      to_user_id: fdata,
      cookie_id: ccId,
      message_content:mesgCont
    });
    let headers = {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      }
    }
    axios.post(Api.apiUrl+'/share-cookie', data, headers)
    .then(res => {
      this.setState({loading:false});
      if(res.data.status == 'true'){
        //console.log(res.data.data.cookies); 
        this.props.navigation.push('SingleChatScreen', {
            from_user_id: fdata
          });
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

 



  componentDidMount() {
    this.getUserData();
  }

  openStatusModal(id) { 
    
    
    this.setState({curUid:id});
    this.setState({isSwitchOn:false});
    if(!this.state.isSwitchOn){
    	this.setState({isSwitchOn:true});
    	this.setState({blockTitle:'block'});
    	this.setState({blockBtnText:'Block'});
    } 
    
    this.setState({modalVisible:true});
  }

  closeBlockModal(){
  	if(!this.state.isSwitchOn){
  		this.setState({isSwitchOn:true});
  	}else{
  		this.setState({isSwitchOn:false});
  	}
  	this.setState({ modalVisible:false}); 	
  }

  

  render (){

    const { userDetail,loading,userData,userCommunity,userTraits,stateData,cityData,userRating,isBlocked,isSameBlocked,cookiesData,isEnabled,rateUser,rateddNumber,Userrating,userLanguages,cookiStat,isLoggedUserView,isArchive,errMsg,ishowMOdal,modalVisible} = this.state;
     let cookiSectitle = '';
      let isFrom = this.props.route.params.isFrom;
    if(isFrom != undefined && isFrom == '1'){
      cookiSectitle = 'Kukies Received From This User';
    }else if(isFrom != undefined && isFrom == '2'){
      cookiSectitle = 'Kukies Received From '+userData.first_name+' '+userData.last_name;
    }

    if(isArchive){
      cookiSectitle = 'Archived Kukies From '+userData.first_name+' '+userData.last_name;
    }

    let ratingUserData = [];
    let ratedUserData = [];
    let ratedNumber = rateddNumber;
    if(ratedNumber == null){
      ratedNumber = 0;
    }
    let str = parseInt(ratedNumber)+1;

    if(ratedNumber == 0){
      str =1;
    }

    let userImg = [];
    if(userDetail.user_profile_image != null){

      userImg.push(<View style={styles.outerImgSection} key={userDetail.id}><Image
      
                  // source={{ uri: `${userDetail.user_profile_image}` }} 
                source={{ uri: `${Api.imgaePath}/${userDetail.user_profile_image}` }}

                  style={styles.imagetopCont}
                /></View>);
    }else{
      userImg.push(<View style={styles.outerImgSection} key={userDetail.id}><Image
      
                  source={require('../../../assets/images/uphoto.png')}
                  style={styles.imagetopCont}
                /></View>);
    }

    let languagesRecords = [];
    let remlanguagesRecords = [];

   
    for (var i = 0; i < userLanguages.length; i++) {
      let extComma = ',';
        if(i == userLanguages.length-1){
          extComma = '';
        }
         languagesRecords.push(<Text key={i} style={styles.commcontSection}>{userLanguages[i].name}{extComma} </Text>);
      
    }


    
    for (var l = str; l <= 5; l++) {
      
        ratingUserData.push(<TouchableOpacity
      key={l}
                  onPress={this.rateUserRa.bind(this,l)} 
                
                style={styles.innerSsection}><Image
            
                            source={require('../../../assets/images/icons/starn.png')}
                            style={{
                              width: 18,
                              resizeMode: 'contain'
                            }}
                          /></TouchableOpacity>);
      
    }
  

    if(ratedNumber > 0){
      for (var l = 1; l <= ratedNumber; l++) {
        ratedUserData.push(<TouchableOpacity
        key={l}
                    onPress={this.rateUserRa.bind(this,l)} 
                  
                  style={styles.innerSsection}><Image
              
                              source={require('../../../assets/images/icons/star.png')}
                              style={{
                                width: 18,
                                resizeMode: 'contain'
                              }}
                            /></TouchableOpacity>);
                          }
    }



   //console.log(cookiesData);
    let cookieViewdata = [];

    if(cookiesData.length > 0){
   
      for(var i = 0;i < cookiesData.length;i++){
         let cookieImg = [];
    let CookieEnabled = true;
    let cStat = 0;
    //alert(cookiesData[i].status);


    if(cookiesData[i].status != 1 && !isArchive){
      cStat = 1;
      cookieImg.push(<Image
                  source={require('../../../assets/images/icons/yellowcookie.png')}
                  key={cookiesData[i].id}
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'contain',
                    marginLeft:20
                  }}
                />
              );
    }else{
      CookieEnabled = false;
      cookieImg.push(<Image
      key={cookiesData[i].id}
                  source={require('../../../assets/images/icons/readKuki.png')}
                  style={{
                    width: 41,
                    height: 36,
                    resizeMode: 'contain',
                    marginLeft:10
                  }}
                />);
    }
    let shareText = 'Send Thanks';
    let kukiLabel =  [];
   


    if(cookiesData[i].status == 1 || cookiesData[i].status == 3){
       
       kukiLabel.push(<Text style={styles.CookieOuterTimeText}>Opened {cookiesData[i].formatted_date}</Text>);
    }else{
       kukiLabel.push(<Text style={styles.CookieOuterTimeText}>{cookiesData[i].formatted_date}, Expires in {cookiesData[i].is_expire} Hrs</Text>);
    
    }
    let ccId = cookiesData[i].cId;

        cookieViewdata.push(<Collapse style={styles.CookieOuterMain} key={i} isExpanded={false} 
          onToggle={(isExpanded) =>
            this.openKuki(isExpanded,isFrom,userDetail.user_id,ccId)}>
      <CollapseHeader>
        <View style={styles.CookieOuterHead} >
        <Text style={styles.CookieOuterHeadNMText}>{i+1}.</Text>
        {cookieImg}
        {kukiLabel}
        {/*<Text style={styles.CookieOuterTimeText}>{cookiesData[i].formatted_date}</Text>*/}
          
        </View>
          
      </CollapseHeader>
      <CollapseBody>
        
          <View style={styles.CookieOuter} key={i}>
          {isFrom == '1' && <Text style={styles.cookieContent}>{cookiesData[i].cookies[0].cookie_message}</Text> }
          {isFrom != '1' && <Text style={styles.cookieFullContent}>{cookiesData[i].cookies[0].cookie_message}</Text> }
          {!isArchive && <View style={styles.ShareButtons}>

          <TouchableOpacity onPress={this.archiveCookie.bind(this,userDetail.user_id,ccId,isFrom)} activeOpacity={0.7} style={styles.ShareInnerButtons}>
            
            <View
        style={styles.cookieShareDltBtn}
        >

               <Text style={styles.cookieShare}>Archive</Text>
               </View>
            
         </TouchableOpacity>
         {isSameBlocked == '1' && <TouchableOpacity onPress={this.sharedookie.bind(this,this.state.isSwitchOn)} activeOpacity={0.7} style={styles.ShareInnerButtons}>
            
            <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={[this.state.isSwitchOn ||  isSameBlocked == '1' ? styles.lgcookieShareBtn : styles.cookieShareBtn]}
        >

               <Text style={styles.cookieShare}>{shareText}</Text>
               </LinearGradient>
            
         </TouchableOpacity> }
           {isSameBlocked != '1' && (this.state.isSwitchOn || !this.state.isSwitchOn)  && <TouchableOpacity onPress={this.shareCookie.bind(this,cookiesData[i].cookies[0].cookie_message,ccId,isFrom)} activeOpacity={0.7} style={styles.ShareInnerButtons}>
            
            <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={[this.state.isSwitchOn ? styles.lgcookieShareBtn : styles.cookieShareBtn]}
        >

               <Text style={styles.cookieShare}>{shareText}</Text>
               </LinearGradient>
            
         </TouchableOpacity> }
         
          </View> }


        {/* Archived  */}

          {isArchive && <View style={styles.ShareButtons}>

          <TouchableOpacity onPress={this.deleteCookie.bind(this,userDetail.user_id,ccId,isFrom)} activeOpacity={0.7} style={styles.ShareInnerButtons}>
            
            <View
        style={styles.cookieShareDltBtn}
        >

               <Text style={styles.cookieShare}>Delete</Text>
               </View>
            
         </TouchableOpacity>
           <TouchableOpacity onPress={this.restoreCookie.bind(this,userDetail.user_id,ccId,isFrom)} activeOpacity={0.7} style={styles.ShareInnerButtons}>
            
            <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={styles.cookieShareBtn}
        >

               <Text style={styles.cookieShare}>Restore</Text>
               </LinearGradient>
            
         </TouchableOpacity>
          </View> }
          

         </View>
        
      </CollapseBody>
    </Collapse>

    );
      }

      
    }else{
        cookieViewdata.push(<Text style={styles.cookieNoRecords}>No Kukies found!</Text>);
      }

   
    let traitsRecords = [];
    let remtraitsRecords = [];

    for (var i = 0; i < userTraits.length; i++) {
    
        let extComma = ',';
        if(i == userTraits.length-1){
          extComma = '';
        }
         traitsRecords.push(<Text style={styles.commcontSection}>{userTraits[i].name}{extComma} </Text>);
     
    }
    let ratingData = [];
    //console.log(userRating);
    for (var i = 0; i < userRating; i++) {
        ratingData.push(<Image
            key={i}
                            source={require('../../../assets/images/icons/star.png')}
                            style={{
                              width: 18,
                              resizeMode: 'contain'
                            }}
                          />);
      
    }
    let ratingNoData = [];
    for (var i = 0; i < 5-userRating; i++) {
     
        ratingNoData.push(<Image
            key={i}
                            source={require('../../../assets/images/icons/starn.png')}
                            style={{
                              width: 18,
                              resizeMode: 'contain'
                            }}
                          />);
      
    }
    let proExte = false;
    if(isLoggedUserView || cookiesData.length <= 0){
      proExte = true;
    }

    return <View style={{ flex: 1 }}><ScrollView>
    <Loader loading={loading} />{ishowMOdal && <UseAlertModal message={errMsg} parentCallback = {this.handleCallback} /> }
          <View style={styles.topheadSection}>
                 <View>
                   <Image
                            // source={{ uri: `${userDetail.user_profile_image}` }}
                source={{ uri: `${Api.imgaePath}/${userDetail.user_profile_image}` }}

                            style={{
                              width: '100%',
                              height:272,
                              resizeMode: 'cover'
                            }}
                          />  
                 </View> 
                 
                 
                       
              </View>
            <View style={styles.innerBody}>
              <View style={styles.innerHeadSection}>
             
                
                 <TouchableOpacity
                  style={styles.innerSection}
                  activeOpacity={0.5}
                  onPress={this.backScreen.bind(this)}>
                  <FontAwesome5 
                name={'times'}
                size={22} 
                color={'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)'} 
              />
                
                </TouchableOpacity>
                {!isLoggedUserView && <View>

                    {cookiStat == 1 && isBlocked == '0' && isSameBlocked == '0' && <TouchableOpacity
                  style={styles.innerSection}
                  activeOpacity={0.5}
                  onPress={this.sendCookie.bind(this,userDetail.user_id,1,userData.first_name,userData.last_name)}>
                  
                <Image
                  source={require('../../../assets/images/icons/yellowcookie.png')}
                  key={cookiesData.id}
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'contain'
                  }}
                /> 
                </TouchableOpacity>}

                {cookiStat == 0 && isBlocked == '0' && isSameBlocked == '0' && <TouchableOpacity
                  style={styles.innerSection}
                  activeOpacity={0.5}
                  onPress={this.sendCookie.bind(this,userDetail.user_id,0,userData.first_name,userData.last_name)}>
                  
                <Image
                  source={require('../../../assets/images/yellokuki.jpeg')}
                  key={cookiesData.id}
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'contain'
                  }}
                /> 
                </TouchableOpacity>}
                {isSameBlocked == '1' && isBlocked == '0' && <TouchableOpacity
                  style={styles.innerSection}
                  activeOpacity={0.5}
                  >
                  
                <Image
                  source={require('../../../assets/images/graykuki.jpeg')}
                  key={cookiesData.id}
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'contain'
                  }}
                /> 
                </TouchableOpacity>}
                {isBlocked == '1' && <TouchableOpacity
                  style={styles.innerSection}
                  activeOpacity={0.5}
                  onPress={this.alertBlockMessg.bind(this)}>
                  
                <Image
                  source={require('../../../assets/images/graykuki.jpeg')}
                  key={cookiesData.id}
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'contain'
                  }}
                /> 
                </TouchableOpacity>}

                
                </View>}


                {isLoggedUserView && <View>

                    <TouchableOpacity
                  style={styles.innerSection}
                  activeOpacity={0.5}
                  onPress={this.editPrfile.bind(this,'x')}>
                <Feather 
                name={'edit'}
                size={22} 
                color={'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)'} 
              />
                </TouchableOpacity>
                </View>}

                 

                  
              </View>
              {!isLoggedUserView && <View style={styles.blockUnblockSection}>
              <View style={styles.blockUnblockSectionInnerFirst}>
              <Text style={styles.rttextSubheading}>Unblock/Block</Text>
                    <Switch
                    style={{ transform: [{ scaleX: 1 }, { scaleY: .9 }],marginLeft:8 }} 
                      onValueChange={this.openStatusModal.bind(this,userDetail.user_id)}
                      value={this.state.isSwitchOn} 
                       trackColor={{ false: "#D3D3D3", true: "rgba(253, 139, 48, 0.69)"  }}
                      thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                    />
              </View>
              <View style={styles.blockUnblockSectionInnerSec}>
                <View style={styles.rateSection}><Text style={styles.rttextSubheading}>Rating </Text> 
                          {ratedUserData}
                          {ratingUserData}
                          </View>
                          
              </View>
               
                  </View> }
              


              <Collapse style={styles.UserDetailOuterMain}  isExpanded={proExte} 
              onToggle={(isExpanded) =>
              isExpanded}>
              <CollapseHeader>
              {userData.first_name != null && <View style={styles.UserddeOuterHead} >
              
              <View style={styles.innermainlayutSection}>

                <View style={styles.innermainlayutFirstSection}>
                  {userImg}
                  <View style={styles.innermainlayutSecSection}>
                    <Text style={styles.textHeading}>
                    {userData.first_name+' '+userData.last_name}, <Feather 
                  name={'star'}
                  size={16} 
                  color={AppStyle.appIconColor}
                   
                /> {Userrating}
                    </Text>
                     
                    <Text style={styles.textSubheading}>{userDetail.gender}, {userDetail.age_group}, {cityData.name}, {(stateData.state_abbrivation != '' ? stateData.state_abbrivation : stateData.name)}</Text>
                    <Text style={styles.textSubheading}>
                    {userCommunity.name}
                    </Text>
                     


                
                
               
               
              </View>
                   </View> 
                  
              </View>
              <Feather 
                  name={'more-vertical'}
                  size={30} 
                  color={AppStyle.appIconColor}
                   
                />
              </View> }

              </CollapseHeader>
              <CollapseBody>

             
              <View style={styles.receivedSection}>
              <Text style={[styles.textInnerHeadingSM,{width:63}]}>Status</Text>
              <Text style={styles.receivedContentSection}>{userDetail.user_status}</Text>
                
              </View>

                 <View style={styles.receivedSection}>
              <Text style={[styles.textInnerHeadingSM,{width:87}]}>Languages</Text>
              <View style={styles.receivedInnerSection}>
              <Text style={styles.receivedContentSection}>{languagesRecords}</Text>
              
              </View>
              
                
              </View>

               <View style={styles.receivedSection}>
              <Text style={[styles.textInnerHeadingSM,{width:57}]}>Traits</Text>
              <View style={styles.receivedInnerSection}>
              <Text style={styles.receivedContentSection}>{traitsRecords}</Text>
             
              </View>
              
                
              </View>
              <View style={styles.receivedSection}>
              <Text style={[styles.textInnerHeadingSM,{width:70}]}>Religion</Text>
              <Text style={styles.receivedContentSection}>{userDetail.religion}</Text>
                
              </View>
              </CollapseBody>
              </Collapse>



              





               

              {!isLoggedUserView && cookiSectitle != '' && <View style={styles.cookiesRecords}>
              <Text style={styles.CookieText}>{cookiSectitle}</Text>
              {cookieViewdata}
              </View>
              }

              

              

            </View>
          </ScrollView> 
          <CookieNavigationScreen navigation={this.props.navigation}/>
          <View style = {styles.Mdcontainer}>  
        <Modal            
          animationType = {"fade"}  
          transparent = {true}  
          visible = {modalVisible}  
          onRequestClose = {() =>{ } }>  
          {/*All views of Modal*/}  
              <View style = {styles.modal}> 
              <Text style = {styles.modalTitle}>Are you sure you want to {this.state.blockTitle} this user ?</Text> 
             
              <View style = {styles.Btnmodal}>
               <TouchableOpacity
              
              activeOpacity={0.9}
              onPress= {() => {  
              	this.closeBlockModal();
                  }} style={styles.buttonOuter}>
               <View
        style={styles.buttonCStyle}>
              <Text style={styles.buttonTextMStyle}>Close</Text>
              </View>
            </TouchableOpacity> 

             <TouchableOpacity
              
              activeOpacity={0.9}
               onPress={() => {
                  this.blockUserfunc();
                }}
               style={styles.buttonOuter}>
               <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={styles.buttonMStyle}>
              <Text style={styles.buttonTextMStyle}>{this.state.blockBtnText}</Text>
              </LinearGradient>
            </TouchableOpacity> 
            </View>

              
          </View>  
        </Modal>  
        {/*Button will change state to true and view will re-render*/}  
        
      </View>
            </View>
  }
};
export default CookiesDetail;

const styles = StyleSheet.create({
  topheadSection:{
   
  },
  backBtnSection:{
    position:'absolute',
    top:80,
    left:15,
    borderWidth:1,
    borderColor:'#E8E6EA',
    borderRadius:15,
    paddingTop:15,
    paddingBottom:15,
    paddingLeft:20,
    paddingRight:20
  },
  innerBody: {
    borderRadius:20,
    backgroundColor:'#ffffff',
    paddingLeft:20,
    paddingRight:20,
    marginTop: -40,
    marginBottom: 25,
    marginLeft: 10,
    marginRight: 10,
    paddingBottom:30
  },
  innerHeadSection:{
    flexDirection:'row',
    justifyContent: 'space-between',
    marginTop: -40,
  },
  innerfavSection:{
    backgroundColor:'rgba(253, 139, 48, 0.69)',
    width:99,
    height:99,
  },
  innerSection:{
    height:78,
    width:78,
    backgroundColor:'#fff',
    borderColor:'#E8E6EA',
    borderWidth:6,
    backgroundColor:'#fff',
    borderRadius:100,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  ratingSection:{
    flexDirection:'row',
    marginTop:10,
    marginBottom:20,
    justifyContent:'space-between',
    alignItems:'center'
    
  },
  ratedSection:{
    flexDirection:'row',
    width:'30%'
  },
  rateSection:{
    flexDirection:'row',
    
    width:'50%'
  },
  innermainlayutSection:{
    flexDirection:'column',
    width:'80%'
  },
  innermainlayutFirstSection:{
    flexDirection:'row',
     alignItems:'center'
   
  },
  innermainlayutSecSection:{
    flexDirection:'column',
    width:'100%'
  },
  directionIcon:{
    height:52,
    width:52,
    backgroundColor:'#fff',
    borderRadius:15,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    borderWidth: 1,
    borderColor: '#E8E6EA',
  },
  textHeading:{
    fontSize:16,
    fontFamily:'GlorySemiBold',
    color:AppStyle.fontColor
  },
  textInnerHeading:{
    color:AppStyle.fontColor,
    fontSize: 16,
    fontFamily: 'GlorySemiBold',
    position:'absolute',
    top:-10,
    left:25,
    paddingLeft:5,
    paddingRight:3,
    backgroundColor:'#fff',
    width:90,
    height:23,
    zIndex:2,
  },
  textInnerHeadingSM:{
    color:AppStyle.fontColor,
    fontSize: 16,
    fontFamily: 'GlorySemiBold',
    position:'absolute',
    top:-10,
    left:20,
    paddingLeft:10,
    paddingRight:10,
    backgroundColor:'#fff',
    height:23,
    zIndex:2,
  },
  textInnerHeadingRM:{
    color:AppStyle.fontColor,
    fontSize: 16,
    fontFamily: 'GlorySemiBold',
    position:'absolute',
    top:-10,
    left:25,
    paddingLeft:5,
    paddingRight:3,
    backgroundColor:'#fff',
    width:68,
    height:23,
    zIndex:2,
  },
  textSubheading:{
     color: '#AAA6B9',
    fontSize:14,
    fontWeight:'400',
    fontFamily: 'Abel'
  },
  rttextSubheading:{
    color: AppStyle.fontColor,
    fontSize: 15,
    fontFamily: 'GlorySemiBold',
    
  },
  locationIcon:{
    flexDirection:'row',
  },
  locaitonDirectionText:{
    color:'rgba(253, 139, 48, 0.69)',
    fontSize: 12,
    fontFamily: 'Abel',
    marginLeft:5
  },
  receivedSection:{
    
    flexDirection:"row",
    alignItems:'center',
    justifyContent:'flex-start',
    borderWidth:1,
    borderRadius:15,
    borderColor: AppStyle.appIconColor,
    paddingLeft:5,
    paddingTop:20,
    paddingBottom:20,
    marginTop:20
  },
  receivedInnerSection:{
   
    flexDirection:"column",
    justifyContent:'flex-start'
  },
  receivedHeadSection:{
    color:AppStyle.fontColor,
    fontSize: 16,
    fontFamily: 'Abel',
  },
  cookieNoRecords:{
    color: AppStyle.fontColor,
    fontSize: 14,
    fontFamily: 'Abel',
    
  },
  receivedContentSection:{
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 14,
    fontFamily: 'Abel',
    marginLeft:10
  },
  aboutreadMoreection:{
    color:'rgba(253, 139, 48, 0.69)',
    fontSize: 14,
    fontFamily: 'Abel'
  },
  commSection:{
    paddingTop:15,
    paddingBottom:15
  },
  comHeadSection:{
    color:AppStyle.fontColor,
    fontSize: 16,
    fontFamily: 'Abel',
  },
  commContent:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingTop:15,
    maxWidth:'50%' 
  },
  commSecContent:{
    flexDirection:'row',
    justifyContent:'flex-start',
    paddingTop:15,     
  },
  commBox:{
    paddingTop:10,
    paddingLeft:12,
    paddingBottom:10,
    paddingRight:12,
    borderWidth:1,
    borderColor:'rgba(253, 139, 48, 0.69)',
    borderRadius:5,
    marginRight:15
  },
  commcontSection:{
    color:AppStyle.fontColor,
    fontSize: 14,
    fontFamily: 'Abel'
  },
  galleryContentSection:{
    marginTop:15,
    marginBottom:25
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
  galleryHeadSection:{
    color:AppStyle.fontColor,
    fontSize: 16,
    fontFamily: 'Abel',
    marginBottom:15
  },
  galleryTopHeadSection:{
    flexDirection:'row',
    justifyContent:'space-between'
  },
  galleryseeSection:{
    color:'rgba(253, 139, 48, 0.69)',
    fontSize: 14,
    fontFamily: 'Abel'
  },
  cookiesRecords:{
    marginTop:30,
    marginBottom:30
  },
  CookieText:{
    marginBottom:10,
    color:AppStyle.fontColor,
    fontSize: 15,
    fontFamily: 'GlorySemiBold',
    marginBottom:15,
    lineHeight:24
  },
  CookieOuterHead:{
     flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    maxHeight:28,
    minHeight:28
    
  },CookieOuterHeadNMText:{
    color:AppStyle.fontColor,
    fontFamily:'Abel',
    fontSize:12
  },
  CookieOuterHeadTextO:{
    color:AppStyle.fontColor,
    fontFamily:'Abel',
    fontSize:15,
    marginLeft:15
  },
  CookieOuterHeadText:{
    color:AppStyle.fontColor,
    fontFamily:'Abel',
    fontSize:15,
    marginLeft:10
  },
  CookieOuterTimeText:{
    color:AppStyle.fontColor,
    fontFamily:'Abel',
    fontSize:12,
    textAlign:'right',
    justifyContent:'flex-end',
    marginLeft:4,
    flexShrink:1,
  },
  UserOuterHeadText:{
    color:AppStyle.fontColor,
    fontFamily:'Abel',
    fontSize:18,

  },
  CookieOuterMain:{
    borderWidth:1,
    borderRadius:15,
    borderColor: AppStyle.appIconColor,
     backgroundColor:AppStyle.btnbackgroundColor,
      padding:15,
      marginBottom:10
  },
  UserDetailOuterMain:{
   
    marginTop:20,
  },
  UserddeOuterHead:{
     flexDirection:'row',
    justifyContent:'space-between',
   
    alignItems:'center'
    
  },
  UserdeOuterHead:{
     flexDirection:'row',
    justifyContent:'center',
    borderColor: AppStyle.appIconColor,
    borderWidth:1,
    borderRadius:15,
    padding:10,
     textAlign:'center',
  
    
  },
  CookieOuter:{
    flexDirection:'column',
    justifyContent:'flex-end',
    width:'100%',
   
  },outerImgSection:{
   
    flexDirection:'row',
    width:64,
    height:65,
    borderRadius:120,
    borderWidth:2,
    borderColor:AppStyle.appIconColor,
    padding:3,
    marginRight:10,
    textAlign:'center',
  
  },
  imagetopCont:{
    width:54,
    height:54,
    borderRadius:108,
    marginTop: 0.8,
  },
  cookieContent:{
    color:AppStyle.fontColor,
    fontSize: 14,
    fontFamily: 'Abel',
    paddingTop:10,
    paddingBottom:10,
    width:'80%',
    lineHeight:24
  },
  cookieFullContent:{
    color:AppStyle.fontColor,
    fontSize: 14,
    fontFamily: 'Abel',
    paddingTop:10,
    paddingBottom:10,
    width:'100%',
    lineHeight:24
  },
  cookieShare:{
    color:AppStyle.fontColor,
    fontSize: 14,
    fontFamily: 'Abel',
    textAlign:'right',
    marginLeft:3
  },ShareButtons:{
    flexDirection:'row',
    justifyContent:'space-between'
  },ShareInnerButtons:{
    width:'48%',
  },cookieShareDltBtn:{
    paddingTop:13,
    flexDirection:'row',
    paddingBottom:13,
    justifyContent:'center',
    borderRadius:15,
    backgroundColor:AppStyle.btnbackgroundColor,
    borderColor:AppStyle.appIconColor,
    borderWidth:1
  },
  cookieShareBtn:{
    paddingTop:15,
    flexDirection:'row',
    paddingBottom:15,
    justifyContent:'center',
    borderRadius:15
  },
  lgcookieShareBtn:{
    paddingTop:15,
    flexDirection:'row',
    paddingBottom:15,
    justifyContent:'center',
    borderRadius:15,
   
    opacity:0.5,
  },
  blockUnblockSection:{
    flexDirection:'row',
    alignItems:'center',
    marginTop:15,
   
    width:'100%'
  },
  blockUnblockSectionInnerFirst:{
    flexDirection:'row',
    justifyContent:'flex-start',
    width:'45%',
    alignItems:'center'
  },
  blockUnblockSectionInnerSec:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width:'56%'
  },
  blockUnblockSectionHead:{
    color:AppStyle.fontColor,
    fontSize: 16,
    fontWeight:'600',
    fontFamily: 'Abel',
    
  },
  innerSsection:{
    marginTop:4
  },
  modal: { 
    marginLeft:'10%',
    marginRight:'10%',  
    backgroundColor : AppStyle.btnbackgroundColor,
    width: '80%',  
    borderRadius:15,  
    borderWidth: 1,  
    borderColor: '#fff',
    position:'absolute',
    top:'35%',
    paddingTop:30,
    paddingBottom:30,
    paddingLeft:25,
    paddingRight:25,
    alignItems:'center'
   },  
   buttonTextMStyle: {  
    color: AppStyle.fontButtonColor,
    fontFamily: 'GlorySemiBold',
    fontSize: 15,
    textTransform:'capitalize'  
   },  
   modalTitle: {  
    color: AppStyle.fontButtonColor,
    fontFamily: 'GlorySemiBold',
    fontSize: 16,
    textTransform:'capitalize',
    marginBottom:10 
   },
   Btnmodal:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
   buttonOuter:{
   
   marginTop:20
   },
   buttonMStyle:{
    flexDirection:'row',
    justifyContent:'center',
    padding:10,
    borderRadius:15,
     width:'85%',
     marginLeft:10
   } ,
   buttonCStyle:{
    flexDirection:'row',
    justifyContent:'center',
    padding:10,
    borderRadius:15,
     width:'85%',
     marginLeft:10,
     borderWidth:1,
     borderColor:AppStyle.appIconColor
   } 
});