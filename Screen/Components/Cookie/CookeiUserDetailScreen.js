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
  KeyboardAvoidingView
} from 'react-native';

import AppStyle from '../../Constants/AppStyle.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CookieNavigationScreen from '../Common/CookieNavigationScreen';
import axios from 'axios';
import Api from '../../Constants/Api.js';
import Loader from '../Loader';
import { FontAwesome5 } from '@expo/vector-icons';
class CookeiUserDetailScreen extends Component {

 constructor(props) {
    super(props);
    this.state = {
      userDetail:{},
      userRating:{},
      userData:{},
      userCommunity:{},
      userTraits:{},
      stateData:{},
      cityData:{},
      cookiesData:{},
      loading:false,
      isBlocked:false,
      isSwitchOn:false,
      isSendCookie:false,
       rateUser:5,
      ratedNumber:0
    };

    AsyncStorage.setItem('activeClass', 'FactiveClass');

  }

 createAlert = (FirstName) =>
  Alert.alert(
    "Required",
    FirstName,
    [
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]
  );
  blockUser(id,isFor){
    if(isFor == 1){
       Alert.alert(
      'Block User',
      'Do you want to block this user ? ', // <- this part is optional, you can pass an empty string
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Block', onPress: () => this.blockUserfunc(id,0)},
      ],
      {cancelable: false},
    );


    }else{
       Alert.alert(
      'Block User',
      'Do you want to unblock this user ? ', // <- this part is optional, you can pass an empty string
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Unblock', onPress: () => this.blockUserfunc(id,1)},
      ],
      {cancelable: false},
    );
    }
  }

  async rateUserRa(i){
   
   this.setState({ratedNumber:i});
   
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    this.setState({loading:true});
    let to_user = this.props.route.params.user_id;

      let data = JSON.stringify({
        user_id: udata.id,
        to_user_id: to_user,
        rating: i
      });
      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      }
      //console.log(data);
      axios.post(Api.apiUrl+'/rate-user', data, headers)
      .then(res => {
        this.setState({loading:false});
        this.getUserData();
      }).catch(error => {
        if(error.toJSON().message === 'Network Error'){
          alert('no internet connection');
          this.setState({loading:false}); 
        }else{
          alert(error); this.setState({loading:false});
        }
      });
  }

  async blockUserfunc(id,isFor){
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
      //console.log(data);
      axios.post(Api.apiUrl+'/block-user', data, headers)
      .then(res => {
        this.setState({loading:false});
        if(res.data.is_blocked == '1'){
          this.props.navigation.navigate('BlockedCookiesScreen');
        }else{
          console.log(error); this.state.loading = false; 
        }
      }).catch(error => {
        if(error.toJSON().message === 'Network Error'){
          alert('no internet connection');
          this.setState({loading:false}); 
        }else{
          alert(error); this.setState({loading:false});
        }
      });
  }

  backScreen(){
    this.props.navigation.goBack();
  }

  setFav(val){
    alert('fav set');
  }  

 

  readMore(val){

  }

  async getUserData(){
    
    let udata = this.props.route.params.user_id;
    let isFor = this.props.route.params.isFor;
    let isFrom = this.props.route.params.isFrom;
    let isSend = this.props.route.params.isSend;

    
    if(isFor != undefined && isFor == 'block'){
      this.setState({isSwitchOn:true});
    }
   if(isSend != undefined && isSend == '1'){
      this.setState({isSendCookie:true});
    }
   
    this.setState({loading:true});
      let data = JSON.stringify({
        user_id: udata,
        isFrom:isFrom
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
          //console.log(res.data.data.cookies); 
          this.setState({userDetail:res.data.data.user_detail});
          this.setState({userData:res.data.data.user_detail.user});
          this.setState({stateData:res.data.data.user_detail.state_data});
          this.setState({cityData:res.data.data.user_detail.city_data});
          this.setState({userRating:res.data.data.rating});
          //this.setState({ratedNumber:res.data.data.rating});
          this.setState({userCommunity:res.data.data.communities});
          this.setState({userTraits:res.data.data.personality_traits});
          this.setState({cookiesData:res.data.data.cookies});
        }else{
          console.log(error); this.state.loading = false; 
        }
      }).catch(error => {
        if(error.toJSON().message === 'Network Error'){
          alert('no internet connection');
          this.setState({loading:false}); 
        }else{
          alert(error); this.setState({loading:false});
        }
      });
  }

  async shareCookie(msg){
    let fdata = this.props.route.params.user_id;
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));

    this.setState({loading:true});
    let data = JSON.stringify({
      from_user_id: udata.id,
      to_user_id: fdata,
      message_content:'My Cookie Says : '+msg
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
      }else{
        alert(res.data.message); this.state.loading = false; 
      }
    }).catch(error => {
      if(error.toJSON().message === 'Network Error'){
        alert('no internet connection');
        this.setState({loading:false}); 
      }else{
        alert(error); this.setState({loading:false});
      }
    });
    
  }

  sendCookie = async (val) => {
    let isSendc = this.state.isSendCookie;
    if(isSendc){
        let udata = JSON.parse(await AsyncStorage.getItem('userData'));
        this.setState({loading:true});
        let data = JSON.stringify({
        from_user_id: udata.id,
        to_user_id: val
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
          alert(res.data.message);
          this.props.navigation.push('SentCookiesScreen');
        }else{
          console.log(error); 
        }
        }).catch(error => {console.log(error); this.state.loading = false; });
    }else{
      alert('Please wait for receiver end to open your kuki or wait for 24 hours');
    }
    
  }

  componentDidMount() {
    this.getUserData();
  }

  render (){

    const { userDetail,loading,userData,userCommunity,userTraits,stateData,cityData,userRating,isBlocked,cookiesData,isEnabled,rateUser,ratedNumber} = this.state;
     let cookiSectitle = '';
      let isFrom = this.props.route.params.isFrom;
    if(isFrom != undefined && isFrom == '1'){
      cookiSectitle = 'Auto-Returned Cookies Received';
    }else if(isFrom != undefined && isFrom == '2'){
      cookiSectitle = 'Cookies Received From Sender';
    }

    let ratingUserData = [];
    let ratedUserData = [];
    let str = ratedNumber+1;
    if(ratedNumber == 0){
      str =1;
    }
    if(isFrom != 1){
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
  }

    if(ratedNumber > 0){
      for (var l = 1; l <= ratedNumber; l++) {
        ratedUserData.push(<TouchableOpacity
        key={l}
                    onPress={this.rateUserRa.bind(this,l)} 
                  
                  style={styles.innersSection}><Image
              
                              source={require('../../../assets/images/icons/star.png')}
                              style={{
                                width: 18,
                                resizeMode: 'contain'
                              }}
                            /></TouchableOpacity>);
                          }
    }

   console.log(cookiesData);
    let cookieViewdata = [];
    if(cookiesData != null){
      for(var i = 0;i < cookiesData.length;i++){
        cookieViewdata.push(<View style={styles.CookieOuter} key={i}>
          {isFrom == '1' && <Text style={styles.cookieContent}>{cookiesData[i].cookies[0].cookie_message}</Text> }
          {isFrom != '1' && <Text style={styles.cookieFullContent}>{cookiesData[i].cookies[0].cookie_message}</Text> }
          {isFrom == '1' && <TouchableOpacity
                  style={styles.cookieShareBtn}
                  activeOpacity={0.5}
                  onPress={this.shareCookie.bind(this,cookiesData[i].cookies[0].cookie_message)}><FontAwesome5 
                name={'share'}
                size={11} 
                color={'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)'} 
              /><Text style={styles.cookieShare}>Share</Text></TouchableOpacity>}</View>);
      }
    }
    let traitsRecords = [];
    let remtraitsRecords = [];

    for (var i = 0; i < userTraits.length; i++) {
      if(i <= 2){
       
        traitsRecords.push(<View key={i} style={styles.commBox}><Text style={styles.commcontSection}>{userTraits[i].name}</Text></View>);
      }else{

         remtraitsRecords.push(<View key={i} style={styles.commBox}><Text style={styles.commcontSection}>{userTraits[i].name}</Text></View>);
      }
      
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

    return <View style={{ flex: 1 }}><ScrollView>
    <Loader loading={loading} />
          <View style={styles.topheadSection}>
                 <View>
                   <Image
                            source={{ uri: `${userDetail.user_profile_image}` }} 
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
              {isFrom == '1' &&
               <TouchableOpacity
                  style={styles.innerSection}
                  activeOpacity={0.5}
                  onPress={this.sendCookie.bind(this,userDetail.user_id)}>
                  
                 <FontAwesome5 name="paper-plane" size={22} 
                  color={"linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"}  /> 
                </TouchableOpacity>}

                {isFrom != '1' &&
               <TouchableOpacity
                  style={styles.innerdSection}
                  activeOpacity={0.5}
                  onPress={this.sendCookie.bind(this,userDetail.user_id)}>
                  
                 
                </TouchableOpacity>}

                
              </View>
              <View style={styles.blockUnblockSection}>
               <Text style={styles.blockUnblockSectionHead}>BLOCK/UNBLOCK THIS USER </Text>
                    <Switch 
                      onValueChange={this.blockUser.bind(this,userDetail.user_id)}
                      value={this.state.isSwitchOn} 
                       trackColor={{ false: "rgba(253, 139, 48, 0.69)", true: "#56CD54" }}
                      thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                    />
                  </View>


              <View style={styles.innermainlayutSection}>
                <View>
                    <Text style={styles.textHeading}>
                    {userData.name}, {userDetail.age_group}
                    </Text>
                    <Text style={styles.textSubheading}>
                    {userCommunity.name}
                    </Text>
                    <View style={styles.ratingSection}>
                     
                          {ratingData}
                          {ratingNoData}
                        {isFrom != 1 && <Text style={styles.rttextSubheading}>Rate User </Text> }
                          {ratedUserData}
                          {ratingUserData}
                    </View>   


                
                </View>
               
               
              </View>

               

              {cookiSectitle != '' && <View style={styles.cookiesRecords}>
              <Text style={styles.CookieText}>{cookiSectitle}</Text>
               {cookieViewdata}
              </View>
              }

              <View style={styles.innermainlayutSection}>
                <View>
                    <Text style={styles.textInnerHeading}>
                    Location
                    </Text>
                    <Text style={styles.textSubheading}>
                    {stateData.name}, {cityData.name}
                    </Text> 
                </View>
                
              </View>

              {/*  Cookie received start */}

              <View style={styles.receivedSection}>
              <Text style={styles.textInnerHeading}>About</Text>
              <Text style={styles.receivedContentSection}>{userDetail.user_status}</Text>
               <TouchableOpacity
                  style={styles.aboutReadmore}
                  activeOpacity={0.5}
                  onPress={this.readMore.bind(this,'x')}>
                {/* <Text style={styles.aboutreadMoreection}>Read More</Text> */ }
                </TouchableOpacity> 
              </View>

              {/* About section end */}

               {/*  Community section start */}

              <View style={styles.commSection}>
                <Text style={styles.textInnerHeading}>Personality Traits</Text>
                
                <View style={styles.commContent}>
                  {traitsRecords}
                </View>

                 <View style={styles.commSecContent}>
                  {remtraitsRecords}
                </View>
                
              </View>

              <View style={styles.commSection}>
                <Text style={styles.textInnerHeading}>Perfessional Group</Text>
                
              

                 <View style={styles.commSecContent}>
                  <View style={styles.commBox}><Text style={styles.commcontSection}>{userCommunity.name} </Text></View>
                  
                  
                  
                  
                </View>
                
              </View>

              {/* Community section end */}

            </View>
          </ScrollView> 
          <CookieNavigationScreen navigation={this.props.navigation}/>
            </View>
  }
};
export default CookeiUserDetailScreen;

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
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    backgroundColor:'#ffffff',
    paddingLeft:20,
    paddingRight:20,
    marginTop: -40,
    marginLeft: 10,
    marginRight: 10,
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
    alignItems:'center'
  },
  innermainlayutSection:{
    flexDirection:'row',
    width:'100%',
    justifyContent: 'space-between',
    marginTop: 20,
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
    color:AppStyle.fontColor,
    fontSize: 22,
    fontFamily: 'GlorySemiBold',
    marginBottom:5
  },textInnerHeading:{
    color:AppStyle.fontColor,
    fontSize: 18,
    fontFamily: 'GlorySemiBold',
    marginBottom:5
  },
  textSubheading:{
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 14,
    fontFamily: 'Abel',
  },
  rttextSubheading:{
    color: AppStyle.appIconColor,
    fontSize: 14,
    fontFamily: 'Abel',
    marginLeft:55,
    marginRight:5
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
    paddingTop:15
  },
  receivedHeadSection:{
    color:AppStyle.fontColor,
    fontSize: 16,
    fontFamily: 'Abel',
  },
  receivedContentSection:{
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 14,
    fontFamily: 'Abel',
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
    color:'rgba(253, 139, 48, 0.69)',
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
    marginTop:20
  },
  CookieText:{
    marginBottom:10,
    color:AppStyle.fontColor,
    fontSize: 20,
    fontFamily: 'GlorySemiBold',
    marginBottom:15,
    lineHeight:24
  },
  CookieOuter:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',
    backgroundColor:AppStyle.btnbackgroundColor,
    borderRadius:10,
    padding:10,
    marginBottom:10
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
    color:'rgba(253, 139, 48, 0.69)',
    fontSize: 14,
    fontFamily: 'Abel',
    textAlign:'right',
    marginLeft:3
  },
  cookieShareBtn:{
    paddingTop:10,
    paddingBottom:10,
    width:'20%',
    flexDirection:'row',
    alignItems:'center',
    marginLeft:10
  },
  blockUnblockSection:{
    flexDirection:'row',
    alignItems:'center',
    marginTop:15,
    justifyContent:'space-between'
  },
  blockUnblockSectionHead:{
    color:AppStyle.fontColor,
    fontSize: 16,
    fontWeight:'600',
    fontFamily: 'Abel',
    textAlign:'right',
    marginLeft:3
  }
});