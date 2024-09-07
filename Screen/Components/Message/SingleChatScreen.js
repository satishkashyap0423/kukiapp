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
  Modal,
  TouchableHighlight,
  KeyboardAvoidingView,
  Pressable
} from 'react-native';

import AppStyle from '../../Constants/AppStyle.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';
import CookieNavigationScreen from '../Common/CookieNavigationScreen';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import Api from '../../Constants/Api.js';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';
import { LinearGradient } from 'expo-linear-gradient';



class SingleChatScreen extends Component {

 constructor(props) {
    super(props);
    this.state = {
      userMessage:'',
      modalVisible:false,
      loading:false,
      messagesData:[],
      userData:[],
      stateData:{},
      cityData:{},
      userDetail:{},
      communityData:{},
      rating:0,
      skip:0,
      take:50,
      scrollState:0,
      isScrollBottom:0,
      loggedUser:'',
      errMsg:'Error',
      ishowMOdal:false,
      luserDetail:[],
      isBlocked:false
    };
    AsyncStorage.setItem('activeClass', 'MactiveClass');
  }


  backScreen(){
    this.props.navigation.goBack();
  }
  handelChat(id){
    this.setState({
        modalVisible: true
    })
  }
  setModalVisible(){
    this.setState({modalVisible:false});
  }
  async sendMedssage(id){
    console.log('Not allowed');
  }
  async sendMessage(id){
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    let fdata =  this.props.route.params.from_user_id;
    
    if(this.state.userMessage == ''){
      return;
    }
      let data = JSON.stringify({
        from_user_id: udata.id,
        to_user_id: fdata,
        message_content:this.state.userMessage
      });
      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      }
      console.log('message--- ',data);
      axios.post(Api.apiUrl+'/save-chat', data, headers)
      .then(res => {
        
        this.setState({loading:false});
        if(res.data.status == 'true'){
          
            this.getMessages(0);          
            this.setState({userMessage:''}); 
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

  deleteChat(i){
    this.delectCahtCall(i);
  	/* Alert.alert(
      'Block User',
      'Do you want to delete the chat with this user ? ', // <- this part is optional, you can pass an empty string
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Delete', onPress: () => this.delectCahtCall()},
      ],
      {cancelable: false},
    );*/
  }
  async delectCahtCall(i){
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    let fdata =  this.props.route.params.from_user_id;
    
    
      let data = JSON.stringify({
        from_user_id: udata.id,
        to_user_id: fdata,
        is_for:i
       
      });
      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      }
      axios.post(Api.apiUrl+'/delete-chat', data, headers)
      .then(res => {
        
        this.setState({loading:false});
        if(res.data.status == 'true'){
          if(i == 1){
            this.props.navigation.push('MessagesScreen');
              this.setState({
                modalVisible: false
            });
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

  _onPress =() => {
  	console.log('Hello');
  }

  async getMessages(val){
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    let fdata =  this.props.route.params.from_user_id;
    if(val == 0){
      this.setState({loading:true});
    }
    
      let data = JSON.stringify({
        from_user_id: fdata,
        to_user_id: udata.id,
        take:this.state.take
      });

      //console.log(data);
      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      }
      console.log('chat param ',data);
      axios.post(Api.apiUrl+'/get-chat', data, headers)
      .then(res => {
        
        this.setState({loading:false});
        if(res.data.status == 'true'){
          console.log('chat param ',res.data.data);
            this.setState({messagesData:res.data.data});          
            this.setState({userData:res.data.userData});          
            this.setState({userDetail:res.data.user_detail});          
            this.setState({cityData:res.data.city_detail});          
            this.setState({stateData:res.data.state_detail});          
            this.setState({rating:res.data.rating});          
            this.setState({communityData:res.data.user_community}); 
            AsyncStorage.setItem('singleuserMessageData',JSON.stringify(res.data.data));
            AsyncStorage.setItem('singleuserData',JSON.stringify(res.data.userData));
            AsyncStorage.setItem('singleuserDetail',JSON.stringify(res.data.user_detail));
            AsyncStorage.setItem('singlecityData',JSON.stringify(res.data.city_detail));
            AsyncStorage.setItem('singlestateData',JSON.stringify(res.data.state_detail));
            AsyncStorage.setItem('singleratingData',JSON.stringify(res.data.rating));
            AsyncStorage.setItem('singlecommunityData',JSON.stringify(res.data.user_community));

            if(res.data.is_blocked == '1'){
              this.setState({isBlocked:true});
            }
            if(res.data.isblocked == '1'){
              this.setState({isBlocked:true});
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
  async componentDidMount(){
    this.getMessages(0);
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    this.setState({loggedUser:udata.id});

    let udetail = JSON.parse(await AsyncStorage.getItem('userDetailsData')); 
    this.setState({luserDetail:udetail});
    let intId = setInterval(async() => await this.getMessages(1), 5000)
    this.props.navigation.addListener('blur', () => {
        clearInterval(intId);
        
    })
  }

 /* async UNSAFE_componentWillMount() {
    let storageIsMData = JSON.parse(await AsyncStorage.getItem('singleuserMessageData'));

   
    if(storageIsMData != null){
       this.setState({messagesData:storageIsMData});
    }
    
         
let singleuserData = JSON.parse(await AsyncStorage.getItem('singleuserData'));

   
    if(singleuserData != null){
       this.setState({userData:singleuserData});
    }


let singleuserDetail = JSON.parse(await AsyncStorage.getItem('singleuserDetail'));

   
    if(singleuserDetail != null){
       this.setState({userDetail:singleuserDetail});
    }


let singlecityData = JSON.parse(await AsyncStorage.getItem('singlecityData'));

   
    if(singlecityData != null){
       this.setState({cityData:singlecityData});
    }
let singlestateData = JSON.parse(await AsyncStorage.getItem('singlestateData'));

   
    if(singlestateData != null){
       this.setState({stateData:singlestateData});
    }

    let singleratingData = JSON.parse(await AsyncStorage.getItem('singleratingData'));

   
    if(singleratingData != null){
       this.setState({rating:singleratingData});
    }

    let singlecommunityData = JSON.parse(await AsyncStorage.getItem('singlecommunityData'));

   
    if(singlecommunityData != null){
       this.setState({communityData:singlecommunityData});
    }

   
  }*/

   handleCallback = (childData) =>{
      this.setState({ishowMOdal: childData});
  }


 _onLongPress = () => {

    /*this.setState({
        modalVisible: true
    })*/
}
_onPressOut = () => {
    
}
handleScroll = (event: Object) => {
  let scollTop = event.nativeEvent.contentOffset.y;
  let prevState = this.state.scrollState;

  if(prevState != null && scollTop == 0){
    let takeState = this.state.take;
    this.setState({
        take: takeState+50
    });
     this.setState({
        isScrollBottom: 1
    });
   
    this.getMessages(0);
  }
  this.setState({
        scrollState: event.nativeEvent.contentOffset.y
    });
   console.log(event.nativeEvent.contentOffset.y);
  }
  

  render (){

    const { modalVisible,loading,messagesData,isScrollBottom,scrollState,take,userData,loggedUser,userDetail,cityData,stateData,rating,communityData,errMsg,ishowMOdal,luserDetail,isBlocked } = this.state;
    let fdata =  this.props.route.params.from_user_id;
    //console.log(userData.user_detail);
    //return;
    let imgaeData = null;
    if(userData.user_detail != undefined){

     imgaeData =`${Api.imgaePath}/${userData.user_detail.user_profile_image}`;
    }
    const messagesListArr = [];
    let dataLength = 50*70;
    
    if(messagesData.length > 0){


    const userList = 10;
    
    
    if(messagesData.length == this.state.take){
      dataLength = 50*70;
    }else{
      dataLength = messagesData.length - 50;
      dataLength = dataLength*70;
    }
    
   console.log(dataLength+' - '+messagesData.length+' - '+this.state.take);

   if(messagesData.length > 0){
    for (var i = 0; i < messagesData.length; i++) {

      const messageData = messagesData[i].message_content.split(":");
      console.log(messageData.length);
      let strt = '';
      let strtSec = '';
      if(messageData.length > 1){
        strt = messageData[0]+" : ";
        strtSec = messageData[1];
      }else{
        strt = messageData[0];
      }


      
      let isDe = JSON.parse("[" + messagesData[i].is_deleted + "]");
     
if(isDe.indexOf(loggedUser) < 0 ){

      
      messagesListArr.push(<View style={styles.msgListsec} key={i}>
            {messagesData[i].from_user_id == fdata && <TouchableOpacity
    onPress={this._onPress}
    onLongPress={this._onLongPress}
    onPressOut={this._onPressOut}
><View style={styles.MessageLeft} >
          <Text style={styles.innerMessageextLeft}>{messagesData[i].message_content}</Text> 
          {/* <Text style={styles.innerMessageextLeft}>{strtSec}</Text>  */}
          
        </View><View style={{flexDirection:'row',justifyContent:'flex-start'}}><Text style={styles.innerRightMessageTime}>{messagesData[i].message_date} </Text><Text style={styles.innerRightMessageTime}>{messagesData[i].message_time}</Text></View></TouchableOpacity> }
        {messagesData[i].from_user_id != fdata && <TouchableOpacity
    onPress={this._onPress}
    onLongPress={this._onLongPress}
    onPressOut={this._onPressOut}
><View style={styles.MessageRight}>
          <Text style={styles.innerMessageextRight}>{messagesData[i].message_content}</Text> 
          {/* <Text style={styles.innerMessageextRight}>{strtSec}</Text>  */}
          
        </View><View style={{flexDirection:'row',justifyContent:'flex-end'}}><Text style={styles.innerRightMessageTime}>{messagesData[i].message_date} </Text><Text style={styles.innerRightMessageTime}>{messagesData[i].message_time}</Text></View></TouchableOpacity>}</View>
        );
    }else{
      if(i == 0){
        {/*messagesListArr.push(<Text key='norec' style={styles.noMessagRec}>{AlertMessages.messageErrmsg}</Text>)*/}
      }
    
  }
      
    }
  }else{
    messagesListArr.push(<Text key='norecd' style={styles.innerRightMessageTime}>{AlertMessages.messageErrmsg}</Text>)
  }

  }
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

  let isSameguru = false;
      if(luserDetail.guru_id == userDetail.guru_id && luserDetail.guru_id != 0){
         isSameguru = true;
      }


    return <View style={{ flex: 1,backgroundColor:'#fff' }}><Loader loading={loading} />{ishowMOdal && <UseAlertModal message={errMsg} parentCallback = {this.handleCallback} /> }<View style={styles.mainBody}>
            <View style={styles.messagefImgSec}>
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
         <Text style={styles.SectionHeadStyle}>Messages</Text>
             </View>
			<View style={styles.messageImgSec}>

			<View style={styles.messageInnerLeftSec}>
     
      {userData.first_name != null && <View style={styles.messageImgSecInd}>

      {imgaeData != null && <Image source={{ uri: imgaeData }}  style={styles.imagetopCont} />}
                {imgaeData == null && <Image
               
                  source={require('../../../assets/images/uphoto.png')}
                  style={styles.imagetopCont}
                />}
      </View> }
			
			{userData.first_name != null && <View style={styles.innerMessagesSec}>
      <View style={{flexDirection:'row',alignItems:'flex-end'}}>
      <Text style={styles.innerContentTitile}>{userData.first_name} {userData.last_name}, <Feather 
                  name={'star'}
                  size={16} 
                  color={AppStyle.appIconColor}
                   
                /> {rating}{isSameguru && <Text style={styles.timContentText}>, </Text>}{isSameguru && <Image
                  source={require('../../../assets/images/icons/gurubhai.jpg')}
                  style={styles.sameguruCont}
                />}</Text></View>
                    <Text style={styles.usercontSecBio}>{userDetail.gender}, {userDetail.age_group}, {cityData.name}, {(stateData.state_abbrivation != '' ? stateData.state_abbrivation : stateData.name)}</Text>
                    <Text style={styles.usercontSecBio}>{communityData.name}</Text>


		            
			</View>}
			</View>
			{userData.first_name != null && <View style={styles.rightListICon}>
      
				<TouchableOpacity
              
              activeOpacity={0.5}
              onPress={this.handelChat.bind(this,1)} ><Image
            key='user_img'
          source={require('../../../assets/images/icons/mlist.png')}
          style={styles.imageMlistCont}
        /></TouchableOpacity>
			</View>}
			</View>
      { isScrollBottom == 0 &&
			<ScrollView onScroll={this.handleScroll} ref={ref => {this.scrollView = ref}}
    onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true}) } style={styles.MessageList}>

    
				{messagesListArr}
			</ScrollView>

      }

      { isScrollBottom == 1 &&
      <ScrollView onScroll={this.handleScroll} ref={ref => {this.scrollView = ref}}
    onContentSizeChange={() => this.scrollView.scrollTo({y: dataLength-80}) } style={styles.MessageList}>

    
        {messagesListArr}
      </ScrollView>

      }

              
          </View>
          <KeyboardAvoidingView
           behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 0}
          >
          <View style={styles.SendMessageSec}>
          
          	 <TextInput
               
                style={[styles.inputStyle, !isBlocked ? styles.disableText : '']}
                onChangeText={(userMessage) =>
               
                   this.setState({userMessage: userMessage })
                }
                placeholder="Your message" //dummy@abc.com
                placeholderTextColor="#ADAFBB"
                autoCapitalize="none"
                editable={!isBlocked} 
                value={this.state.userMessage}
                returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
              
              {isBlocked && <Pressable
                onPress={this.sendMedssage.bind(this,1)}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? '#F3F3F3'
                      : '#F3F3F3'
                  },
                  styles.imageSend
                ]}>
              

              <FontAwesome5 name="paper-plane" size={22} 
                  color={"linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"}  />
              </Pressable>}{!isBlocked && <Pressable
                onPress={this.sendMessage.bind(this,1)}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? 'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)'
                      : 'white'
                  },
                  styles.imageSend
                ]}>
              

              <FontAwesome5 name="paper-plane" size={22} 
                  color={"linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"}  />
              </Pressable>}

          
          </View>
          </KeyboardAvoidingView>
          
          <CookieNavigationScreen navigation={this.props.navigation}/>

          <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
           
          onRequestClose={() => {
           
            this.setModalVisible(!modalVisible);
          }}
        >
         <View style = {styles.modal}> 
                 <View style={styles.urlSection}>
                <Text style={styles.urlDeleteText}>Are you sure you want to clear/delete the chat ?</Text>
                    <View style={styles.urlbtnSection}>
                  <Pressable
                onPress={() => {
                  this.deleteChat(0);
                }}
                style={({ pressed }) => [
                  {
                    color: pressed
                      ? 'rgb(210, 230, 255)'
                      : 'white'
                  },
                  styles.wrapperCustom
                ]}>
            <Text style={styles.urladdButton}>Clear</Text>
          </Pressable>

          <Pressable
                onPress={() => {
                  this.deleteChat(1);
                }}
                style={({ pressed }) => [
                  {
                    color: pressed
                      ? 'rgb(210, 230, 255)'
                      : 'white'
                  },
                  styles.wrapperCustom
                ]}>
            <Text style={styles.urladdButton}>Delete</Text>
          </Pressable>

          
                  </View>
                  <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={styles.urladdButtonCls}>
              
              <Pressable
                onPress={() => {
                  this.setModalVisible();
                }}
                style={({ pressed }) => [
                  {
                    color: pressed
                      ? 'rgb(210, 230, 255)'
                      : 'white'
                  },
                  styles.wrapperCustom
                ]}>
            <Text style={styles.urladdButtonxtTCls}>Close</Text>
          </Pressable>
              </LinearGradient>


                  
                  </View>
                  </View>

                  </Modal>
          
          </View>
           
        
      
  }
};
export default SingleChatScreen;

const styles = StyleSheet.create({
  mainBody: {
	flex:1,
	backgroundColor: AppStyle.appColor,
	paddingLeft: 20,
	paddingRight: 30,
	 paddingBottom: AppStyle.appInnerBottomPadding,
     paddingTop: AppStyle.appInnerTopPadding,
	height:'100%'
  },
  MessageList:{
    marginTop:10,
    width:'100%'
  },
  topheadSection:{
    display:'flex',
    justifyContent:'flex-start',
    alignItems:'center',
    flexDirection:'row',
    marginBottom:20
  },
  MessageLeft:{
  	width:'88%',
    alignItems:'flex-start',
    backgroundColor:'rgba(253, 139, 48, 0.1)',
    padding: 15,
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    flexShrink:1
  },
  MessageRight:{
  	width:'86%',
    display:'flex',
    marginLeft: '14%',
    alignItems:'flex-start',
    backgroundColor:'#F3F3F3',
    padding:10,
    borderRadius: 15,
    flexDirection:'column',
    borderBottomRightRadius: 0,
  },
  innerMessageextLeft:{
  	color:AppStyle.fontColor,
    fontSize:16,
    fontWeight:'400',
    fontFamily: 'Abel'
  },
  innerMessageextRight:{
  	color:AppStyle.fontColor,
    fontSize:16,
    fontWeight:'400',
    fontFamily: 'Abel',
    flexShrink:1,
  },
  innerMessageTime:{
  	color: '#AAA6B9',
    fontSize:12,
    fontWeight:'400',
    fontFamily: 'Abel',
    marginTop:2,
    marginBottom:20
  },
  innerRightMessageTime:{
    color: '#AAA6B9',
    fontSize:12,
    fontWeight:'400',
    fontFamily: 'Abel',
    marginTop:2,
    textAlign:'right'
  },
  noMessagRec:{
    color: '#AAA6B9',
    fontSize:12,
    fontWeight:'400',
    fontFamily: 'Abel',
    marginTop:8
  },
  SectionHeadStyle: {
    fontSize:AppStyle.aapPageHeadingSize,
    fontFamily: 'GlorySemiBold',
    marginLeft:15,
    color:AppStyle.fontColor
  },
  timContentText:{
     color: '#AAA6B9',
    fontSize:14,
    fontWeight:'400',
    fontFamily: 'Abel'
  },
  innerContentTitile:{
   fontSize:16,
    fontFamily:'GlorySemiBold',
    color:AppStyle.fontColor
  },
  usercontSecBio:{
     color: '#AAA6B9',
    fontSize:14,
    fontWeight:'400',
    fontFamily: 'Abel',
    
    
  },
  innerMessageext:{
    color: '#AAA6B9',
    fontSize:14,
    fontWeight:'400',
    fontFamily: 'Abel'
  },
  messageCountSec:{
    alignItems:'center',
  },
  innerMessagesSec:{
    flexShrink: 1,
    marginLeft:10,
    marginTop:5
  },
  messagefImgSec:{
    flexDirection:'row',
   
    alignItems:'center',
      
  },
  messageImgSec:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:10
  },
  messageInnerLeftSec:{
    flexDirection:'row',
    alignItems:'center',
    width:'90%',

  },
  rightListICon:{
    width:'10%',
    marginRight:100
  },
  imageMlistCont:{
  	height:48,
    width:48
  },
  imageSend:{
  	padding:15,
  	 borderWidth:1,
    borderColor:'#E8E6EA',
    borderRadius:15,
    marginLeft:10
  },
  backIconsCont:{
  borderWidth:1,
  borderColor:'#E8E6EA',
  borderRadius:15,
  paddingTop:15,
  paddingBottom:15,
  paddingLeft:20,
  paddingRight:20
  },
  imageBackIcon:{
    marginLeft:10,
    marginBottom:10
  },
  SendMessageSec:{
  	flexDirection:'row',
  	paddingLeft: AppStyle.appLeftPadding,
	paddingRight: AppStyle.appRightPadding,
	backgroundColor:'#fff'
  },
  disableText: {
    opacity:0.5,
  },
  inputStyle: {
    borderWidth:1,
    borderColor:'#E8E6EA',
    color: AppStyle.inputBlackcolorText,
    padding: 15,
    width:'80%',
    fontSize:14,
    borderRadius:15,
    fontFamily: 'Abel'
  },
  msgListsec:{
  	marginTop:10
  },
  urlSection:{
    
    justifyContent:'center',
    flex: 1,
    alignItems:'center'
  },
  urlbtnSection:{
    flexDirection:'row',
    marginTop:15,
    justifyContent:'space-between'
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
  urladdButton:{
    color: AppStyle.fontColor,
    fontSize:16,
    fontWeight:'400',
    fontFamily: 'Abel',
    padding:10,
    textAlign:'center',
    borderWidth:1,
    borderColor:AppStyle.appIconColor,
    borderRadius:15,
    minWidth:125,
    marginLeft:10

    
  },
  urladdButtonCls:{
    
    padding:10,
    justifyContent:'center',
    
    borderRadius:15,
    minWidth:125,
    marginLeft:10,
    
    marginTop:10

    
  },
  urladdButtonxtTCls:{
    color: AppStyle.fontColor,
    fontSize:16,
    fontWeight:'400',
    fontFamily: 'Abel',
    textAlign:'center'
    
  },
  imagetopCont:{
    borderRadius:108,
    height:54,
    width:54,
    marginTop:1,
    marginLeft:.5,
  },

  messageImgSecInd:{
    width: 65,
     height:65,
         borderRadius:120,
     borderWidth:2,
    borderColor:AppStyle.appIconColor,
    padding:3,
    
        textAlign:'center'
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
    paddingLeft:10,
    paddingRight:20,
    alignItems:'center'
   },  
   buttonTextMStyle: {  
    color: AppStyle.fontButtonColor,
    fontFamily: 'GlorySemiBold',
    fontSize: 15,
    textTransform:'capitalize'  
   },  
   urlDeleteText: {  
    color: AppStyle.fontButtonColor,
    fontFamily: 'GlorySemiBold',
    fontSize: 14,
    textTransform:'capitalize',
    marginBottom:10 
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
   },
  sameguruCont:{
     width:AppStyle.sameGuruImgWidth,
    height:AppStyle.sameGuruImgHeight,
    resizeMode: 'contain',
  }
});