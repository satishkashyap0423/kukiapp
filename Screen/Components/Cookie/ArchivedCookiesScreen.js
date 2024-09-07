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
  List, ListItem, Separator,
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
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';


class ArchivedCookiesScreen extends Component {

 constructor(props) {
    super(props);
    this.state = {
      loading:false,
      cookieData:[],
      errMsg:'Error',
       luserDetail:[],
      ishowMOdal:false
     
    };
    AsyncStorage.setItem('activeClass', 'FactiveClass');
  }

 

  backScreen(){
    this.props.navigation.navigate('ListCookiesScreen');
  }

  getuserDetail = (i) => {
    this.props.navigation.push('CookiesDetail',{user_id:i,isFrom:2,isFor:'archive'});
  }

 

  async getCookieData(){
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    this.setState({loading:true});
      let data = JSON.stringify({
        user_id: udata.id,
        top_five:'0'
      });
      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      }
      console.log(data);
      axios.post(Api.apiUrl+'/archived-cookie-record', data, headers)
      .then(res => {
        
        this.setState({loading:false});
        if(res.data.status == 'true'){
          //console.log(res.data.fuser_detail); 
          this.setState({cookieData:res.data.data});
        
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

  async componentDidMount() {
    this.getCookieData();
     let udetail = JSON.parse(await AsyncStorage.getItem('userDetailsData')); 
    this.setState({luserDetail:udetail});
     this.focusListener = this.props.navigation.addListener('focus', () => {
       this.getCookieData();
      //Put your Data loading function here instead of my this.loadData()
    });
  }

  handleCallback = (childData) =>{
      this.setState({ishowMOdal: childData});
  }



   openCookie = async (val,fuser,isFor) => {

    
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    this.setState({loading:true});
      let data = JSON.stringify({
        cookie_id: val,
        tuser_id: fuser,
        fuser_id: udata.id,
        isFor:isFor
      });
      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      }
      console.log(data);
      axios.post(Api.apiUrl+'/open-cookie', data, headers)
      .then(res => {
        this.setState({loading:false});
        if(res.data.status == 'true'){
        this.props.navigation.push('CookiesDetail',{user_id:fuser,isFrom:2,isFor:'archive'});
         // this.props.navigation.push('OpenCookiesScreen',{cookieRecords : JSON.stringify(res.data.data)});
        }else{
          console.log(error); 
        }
      }).catch(error => {console.log(error); this.state.loading = false; });
  }

  render (){

    const { checked,loading,cookieData,errMsg,ishowMOdal,luserDetail} = this.state;

  console.log(cookieData);
    
   let search_data = cookieData;
    let receiveContentData = [];
    

    if(search_data.length > 0){

    
  for(let i =0; i<search_data.length;i++){
    let ratingData = [];
    let ratingNoData = [];
    if( search_data[i].rating != null){
     
      let  userRating = search_data[i].rating;
    
    console.log(userRating);
    for (var l = 0; l < userRating; l++) {
      
        ratingData.push(<Image
            key={l}
                            source={require('../../../assets/images/icons/star.png')}
                            style={{
                              width: 18,
                              resizeMode: 'contain'
                            }}
                          />);
      
    }
    
    for (var k = 0; k < 5-userRating; k++) {
     
        ratingNoData.push(<Image
            key={k}
                            source={require('../../../assets/images/icons/starn.png')}
                            style={{
                              width: 18,
                              resizeMode: 'contain'
                            }}
                          />);
      
    }
    }else{
      for (var k = 0; k < 5; k++) {
     
        ratingNoData.push(<Image
            key={k}
                            source={require('../../../assets/images/icons/starn.png')}
                            style={{
                              width: 18,
                              resizeMode: 'contain'
                            }}
                          />);
      
    }
    }

    let userImg = [];
    if(search_data[i].fuser_detail.user_profile_image != null){

      userImg.push(<View style={styles.outerImgSection} key={search_data[i].id}><Image
      
                  // source={{ uri: `${search_data[i].fuser_detail.user_profile_image}` }} 
                source={{ uri: `${Api.imgaePath}/${search_data[i].fuser_detail.user_profile_image}` }}

                  style={styles.imagetopCont}
                /></View>);
    }else{
      userImg.push(<View style={styles.outerImgSection} key={search_data[i].id}><Image
      
                  source={require('../../../assets/images/uphoto.png')}
                  style={styles.imagetopCont}
                /></View>);
    }

    let cookieImg = [];
    let CookieEnabled = true;
    let letisffR = 0;
    if(search_data[i].cookie_status != 1 && search_data[i].cookies_n_data != ''){
      letisffR = 0;
      cookieImg.push(<Image
              key={search_data[i].fuser.id}
                  source={require('../../../assets/images/icons/yellowcookie.png')}
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'contain',
                    marginLeft:15
                  }}
                />
              
              );
    }else{
      letisffR = 1;
      cookieImg.push(<Image
      key={search_data[i].fuser.id}
                  source={require('../../../assets/images/icons/graycookie.png')}

                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'contain',
                    marginLeft:15
                  }}
                />
                );
                CookieEnabled = false;
    }

     let isSameguru = false;
    if(luserDetail.guru_id == search_data[i].fuser_detail.guru_id && luserDetail.guru_id != 0){
       isSameguru = true;
    }
   
    receiveContentData.push( <TouchableOpacity
              style={[i == 0 ? styles.mainInnersectionNob : styles.mainInnersection]} key={search_data[i].fuser.id}
              activeOpacity={0.7}
              onPress={this.openCookie.bind(this,search_data[i].cookies_data,search_data[i].from_user_id,letisffR)} >{userImg}
                <View style={styles.searchMainContentsection} >
                  <View style={styles.searchContentsection}>
                     <View style={styles.sameguruContSect}><Text style={styles.searchContentTextBold}>{search_data[i].fuser.first_name} {search_data[i].fuser.last_name}, <Feather 
                  name={'star'}
                  size={16} 
                  color={AppStyle.appIconColor}
                   
                /> {search_data[i].user_rating}{isSameguru && <Text style={styles.searchContentTextBold}>, </Text>}{isSameguru && <Image
                  source={require('../../../assets/images/icons/gurubhai.jpg')}
                  style={styles.sameguruCont}
                />}</Text></View>
                    <Text style={styles.searchContentText}>{search_data[i].fuser_detail.gender}, {search_data[i].fuser_detail.age_group}, {search_data[i].city_data.name}, {(search_data[i].state_data.state_abbrivation != '' ? search_data[i].state_data.state_abbrivation : search_data[i].state_data.name)}</Text>
                    <Text style={styles.searchContentText}>{search_data[i].community_data.name}</Text>
                    {/*<View style={styles.ratingMainSection}><Text style={styles.searchContentTextBold}>Trust Rating....</Text>
                    <View style={styles.ratingSection}>
                       {ratingData}
                       {ratingNoData}
                    </View>
                    </View>*/}
                  </View>
                  <View style={styles.searchImgsection}><Text style={styles.cookiegCount}>{search_data[i].cookie_unopend_count}</Text></View>
                </View> 
                
                </TouchableOpacity>);

  }
}else{
  receiveContentData.push(<Text style={styles.SectionNoRecordStyle} key='nk5'>{AlertMessages.archivedErrmsg}</Text>);
}
    return <View style={{flex:1,height:'100%',backgroundColor:'#fff'}}><Loader loading={loading} /><ScrollView>
            {ishowMOdal && <UseAlertModal message={errMsg} parentCallback = {this.handleCallback} /> }<View style={styles.mainBody}>
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
                <Text style={styles.SectionHeadStyle}>Archived Kukies</Text>
               {/* <Text style={styles.SectionsubHeadStyle}>(Receiver’s View of Received Cookies)</Text>*/}
              </View> 
              {receiveContentData}
            </View>
          </ScrollView>
           <CookieNavigationScreen navigation={this.props.navigation}/>
          </View>
  }
};
export default ArchivedCookiesScreen;

const styles = StyleSheet.create({
 
  mainBody: {
   flex:1,
    backgroundColor: AppStyle.appColor,
    paddingLeft: 15,
    paddingRight: 15,
     paddingBottom: AppStyle.appInnerBottomPadding,
     paddingTop: AppStyle.appInnerTopPadding,
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
  cookeSecright:{
    flexDirection:'row'
  },
  cookieCount:{
    fontSize:12,
    fontFamily: 'Abel',
    fontWeight:'400',
    color:'rgba(253, 139, 48, 0.69)',
    marginTop:-8,
    marginLeft:3
  },
  cookiegCount:{
    fontSize:12,
    fontFamily: 'Abel',
    fontWeight:'400',
    color:'#808080',
    
  },
  searchImgsection:{
    backgroundColor: AppStyle.appIconColor,
    borderRadius:120,
    height:28,
    width:28,
    justifyContent:'center',
    alignItems:'center',
  },
  SectionsubHeadStyle:{
    fontSize:16,
    fontFamily: 'Abel',
    fontWeight:'400',
    color:'rgba(253, 139, 48, 0.69)',
    marginTop:5
  },
  mainInnersection: {
    flexDirection:'row',
    flex:1,
    alignItems:'center',
    justifyContent: 'space-between',
    marginTop:8,
     borderColor:'#E8E6EA',
    borderTopWidth:1,
    paddingTop:10,
  },
  mainInnersectionNob: {
    flexDirection:'row',
    flex:1,
    alignItems:'center',
    justifyContent: 'space-between',
    paddingTop:10,
  },
  searchMainContentsection:{
    flexDirection:'row',
    flex:1,
    alignItems:'center',
    justifyContent: 'space-between'
  },
  searchContentsection:{
    paddingLeft:0,
    width:'80%'
  },
  searchContentTextBold:{
    fontSize:16,
    fontFamily:'GlorySemiBold',
    color:AppStyle.fontColor
  },
  searchContentText:{
     color: '#AAA6B9',
    fontSize:14,
    fontWeight:'400',
    fontFamily: 'Abel'
  },
  SectionNoRecordStyle:{
    fontSize:13,
    lineHeight:22,
    fontFamily:'Abel'
  },
  ratingMainSection:{
    flexDirection:'row'
  },
  ratingSection:{
    flexDirection:'row',
    alignItems:'center'
  },
  imagetopCont:{
    width:54,
    height:54,
    borderRadius:108,
    marginTop: 0.8,
  },
  outerImgSection:{
    flexDirection:'row',
    width:64,
    height:65,
    borderRadius:120,
    borderWidth:2,
    borderColor:AppStyle.appIconColor,
    padding:3,
    marginRight:10,
    textAlign:'center'
  },
  sameguruContSect:{
    flexDirection:'row',
    justifyContent:'space-between'
  },
  sameguruCont:{
    width:AppStyle.sameGuruImgWidth,
    height:AppStyle.sameGuruImgHeight,
    resizeMode: 'contain',
  }
});