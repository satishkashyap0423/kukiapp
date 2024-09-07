// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState,Component} from 'react';


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
import Loader from '../../Components/Loader';
import CookieNavigationScreen from '../Common/CookieNavigationScreen';
import axios from 'axios';
import Api from '../../Constants/Api.js';
import { Feather } from '@expo/vector-icons';
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';


class MessagesScreen extends Component {

 constructor(props) {
    super(props);
    this.state = {
      loading:false,
      messagesList:[],
      userDetail:[],
      loggediuser:'',
      errMsg:'Error',
      ishowMOdal:false
    };
    AsyncStorage.setItem('activeClass', 'MactiveClass');
  }

 


  backScreen(){
    this.props.navigation.navigate('UserstatusScreen');
  }
  getChat(id){
    this.props.navigation.push('SingleChatScreen', {
            from_user_id: id
          });
  }

  async getMessages(val){
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    if(val == 0){
    	this.setState({loading:true});
    }
    
      let data = JSON.stringify({
        user_id: udata.id
      });


      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      }
      axios.post(Api.apiUrl+'/get-chat-list', data, headers)
      .then(res => {
        
        this.setState({loading:false});
         this.setState({messagesList:res.data.data});  
        AsyncStorage.setItem('userMessageData',JSON.stringify(res.data.data));
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
  async componentDidMount(){
    this.getMessages(0);
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    this.setState({loggediuser:udata.id});
    let intId = setInterval(async() => await this.getMessages(1), 5000)
    this.props.navigation.addListener('blur', () => {
        clearInterval(intId);
    });
    let udetail = JSON.parse(await AsyncStorage.getItem('userDetailsData')); 
    this.setState({userDetail:udetail});

    this.focusListener = this.props.navigation.addListener('focus', () => {
       this.getMessages(0);
    });
  }

   async UNSAFE_componentWillMount() {
    let storageInviteData = JSON.parse(await AsyncStorage.getItem('userMessageData'));

   
    if(storageInviteData != null){
       this.setState({messagesList:storageInviteData});
    }

   
  }

  handleCallback = (childData) =>{
      this.setState({ishowMOdal: childData});
  }

  

  render (){

    const { loading,messagesList,userDetail,loggediuser,errMsg,ishowMOdal } = this.state;
    const userListArr = [];

    let msgData = this.state.messagesList;
    //alert(messagesList.length);
   
    if(messagesList?.length > 0 ){
    for (var i = 0; i < messagesList.length; i++) {
      let imgaeData = `${Api.imgaePath}/${messagesList[i].user_profile_image}`;
      let message_content = '';
      let message_time = '';
      let msgContent = messagesList[i].messageData;
      //console.log(msgContent.message_content);
      
      message_time = messagesList[i].messageData.message_time;
      if(msgContent.message_content != undefined ){
      	message_content = messagesList[i].messageData.message_content;
      	message_time = messagesList[i].messageData.message_time;
      }

       let isSameguru = false;
      if(userDetail.guru_id == messagesList[i].user_detail.guru_id &&  userDetail.guru_id != 0){
         isSameguru = true;
      }
       

      userListArr.push(
        <TouchableOpacity
        key={i}
              style={[i == 0 ? styles.MessageListNob : styles.MessageList]}
              activeOpacity={0.5}
              onPress={this.getChat.bind(this,messagesList[i].userId)} >
                <View style={styles.messageImgSec}>
                  {imgaeData != null && <Image source={{ uri: imgaeData }}  style={styles.imagetopCont} />}
                  {imgaeData == null && <Image

                  source={require('../../../assets/images/uphoto.png')}
                  style={styles.imagetopCont}
                />}
                </View>

                <View style={styles.innerMainMessagesSec}>
                  <View style={styles.innerMessagesSec}>
                     <View style={{width:'75%'}}><View style={{flexDirection:'row',alignItems:'flex-end'}}><Text style={styles.titleContentText}>{messagesList[i].first_name} {messagesList[i].last_name}, <Feather 
                  name={'star'}
                  size={16} 
                  color={AppStyle.appIconColor}
                   
                /> {messagesList[i].user_rating}{isSameguru && <Text style={styles.timContentText}>, </Text>}{isSameguru && <Image
                  source={require('../../../assets/images/icons/gurubhai.jpg')}
                  style={styles.sameguruCont}
                />}</Text></View>
                    <Text style={styles.timContentText}>{messagesList[i].user_detail.gender}, {messagesList[i].user_detail.age_group}, {messagesList[i].city_detail.name}, {(messagesList[i].state_detail.state_abbrivation != '' ? messagesList[i].state_detail.state_abbrivation : messagesList[i].state_detail.name)}</Text>
                    <Text style={styles.timContentText}>{messagesList[i].user_community.name}</Text></View>


                    <View style={styles.messageCountdTextView}><View style={styles.messageCountTextView}><Text style={styles.messageCountText}>{messagesList[i].count_messages_count}</Text></View>
                  </View></View>
                 
                </View>
                
                
                
                </TouchableOpacity>);
    }
}else{
  userListArr.push(<Text key="no_records" style={styles.emptyContentText}>{AlertMessages.messageErrmsg}</Text>);
}

    return <View style={{ flex: 1 }}><Loader loading={loading} />{ishowMOdal && <UseAlertModal message={errMsg} parentCallback = {this.handleCallback} /> }<View style={styles.mainBody}>
            <View style={styles.topheadSection}>
              <Text style={styles.SectionHeadStyle}>Messages</Text>
              </View>
               {userListArr}
          </View>
          <CookieNavigationScreen navigation={this.props.navigation}/>
          </View>
           
        
      
  }
};
export default MessagesScreen;

const styles = StyleSheet.create({
  mainBody: {
   flex:1,
    
    backgroundColor: AppStyle.appColor,
     paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
      paddingBottom: AppStyle.appInnerBottomPadding,
     paddingTop: AppStyle.appInnerTopPadding,
     height:'100%'
  
  },
  titleContentText:{
    fontSize:15,
    fontFamily:'GlorySemiBold',
    color:AppStyle.fontColor
  },
  topheadSection:{
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row',
    marginBottom:5
  },
  MessageList:{
    flexDirection:'row',
    alignItems:'center', 
    justifyContent:'center',
    marginTop:8,
     borderColor:'#E8E6EA',
    borderTopWidth:1,
     padding:10,
     
  },
  MessageListNob:{
    flexDirection:'row',
     justifyContent:'center',
    alignItems:'center', 
    marginTop:8,
     padding:10,
    
  },
  SectionHeadStyle: {
    fontSize:AppStyle.aapPageHeadingSize,
    fontFamily: 'GlorySemiBold',
    marginBottom:15,
    color:AppStyle.fontColor

  },
  timContentText:{
     color: '#AAA6B9',
    fontSize:14,
    fontWeight:'400',
    fontFamily: 'Abel'
  },
  emptyContentText:{
     color: '#AAA6B9',
    fontSize:18,
    fontWeight:'400',
    fontFamily: 'Abel'
  },
  innerContentTitile:{
     color: '#000000',
    fontSize:14,
    fontWeight:'700',
    fontFamily: 'Abel'
  },
  innerHeadMessageext:{
    color:AppStyle.fontColor,
    fontSize:16,
    fontWeight:'400',
    fontFamily: 'GlorySemiBold'
  },
  innerMessageext:{
     color: '#AAA6B9',
    fontSize:14,
    fontWeight:'400',
    fontFamily: 'Abel',
    marginTop:10
  },
  messageCountSec:{
    alignItems:'center',
    marginTop:30
  },
  innerMainMessagesSec:{
    width:'85%',
    justifyContent:'space-between'
  },
  innerMessagesSec:{
   flexShrink:1,
    marginTop:0
    
  },
  messageCountdTextView:{
    position:'absolute',
    right:10,
    top:5,
     justifyContent:'center',
    alignItems:'center',
  },
  messageCountTextView:{
    backgroundColor: AppStyle.appIconColor,
    
    borderRadius:120,
    height:28,
    width:28,
    justifyContent:'center',
    alignItems:'center',
    

  },
  messageCountText:{
   
    fontSize:14,
    fontWeight:'400',
    fontFamily: 'Abel',
    color:AppStyle.fontColor,
   
    
  },
  messageImgSec:{
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
    marginTop: 1,
  },
  sameguruCont:{
     width:AppStyle.sameGuruImgWidth,
    height:AppStyle.sameGuruImgHeight,
    resizeMode: 'contain',
   
  }
});