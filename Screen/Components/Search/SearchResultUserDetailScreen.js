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
import CookieNavigationScreen from '../Common/CookieNavigationScreen';
import axios from 'axios';
import Api from '../../Constants/Api.js';
import Loader from '../Loader';

class SearchResultUserDetailScreen extends Component {

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
      loading:false
    };

    AsyncStorage.setItem('activeClass', 'UactiveClass');
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
    this.props.navigation.goBack();
  }

  setFav(val){
    alert('fav set');
  }  

  sendCookie(val){
    alert('Cookie sent');
    //this.props.navigation.push('EditUserScreen');
  }

  readMore(val){

  }

  async getUserData(){
    
    let udata = this.props.route.params.user_id;
    this.setState({loading:true});
      let data = JSON.stringify({
        user_id: udata
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
          //console.log(res.data.user_detail); 
          this.setState({userDetail:res.data.data.user_detail});
          this.setState({userData:res.data.data.user_detail.user});
          this.setState({stateData:res.data.data.user_detail.state_data});
          this.setState({cityData:res.data.data.user_detail.city_data});
          this.setState({userRating:res.data.data.rating});
          this.setState({userCommunity:res.data.data.communities});
          this.setState({userTraits:res.data.data.personality_traits});
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

  componentDidMount() {
    this.getUserData();
  }

  render (){

    const { userDetail,loading,userData,userCommunity,userTraits,stateData,cityData,userRating} = this.state;
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
    console.log(userRating);
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
                  onPress={this.backScreen.bind(this,'x')}>
                <Image
                        source={require('../../../assets/images/icons/cancel.png')}
                        style={{
                          width: 15,
                          resizeMode: 'contain',

                        }}
                      />
                </TouchableOpacity>  
                 
                <TouchableOpacity
                  style={styles.innerSection}
                  activeOpacity={0.5}
                  onPress={this.sendCookie.bind(this,'x')}>
                <Image
                        source={require('../../../assets/images/cookie.png')}
                        style={{
                          width: 30,
                          resizeMode: 'contain',

                        }}
                      />
                </TouchableOpacity> 
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
                    </View>      
                
                </View>

                
              </View>

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
export default SearchResultUserDetailScreen;

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
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 14,
    fontFamily: 'Abel',
    marginLeft:20,
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
    backgroundColor:'#f2f2f2',
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
    fontSize: 18,
    fontWeight:'600',
    fontFamily: 'Abel',
    textAlign:'right',
    marginLeft:3
  }
});