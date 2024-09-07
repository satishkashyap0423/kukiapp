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
  KeyboardAvoidingView,
  Modal
} from 'react-native';

import AppStyle from '../../Constants/AppStyle.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MultiSelect from 'react-native-multiple-select';
import CookieNavigationScreen from '../Common/CookieNavigationScreen';
import Loader from '../../Components/Loader'; 
import axios from 'axios';
import Api from '../../Constants/Api.js'; 
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';

class NotificationScreen extends Component {

 constructor(props) {
    super(props);
    this.state = {
      notificationsData:[],
      loading:false,
      errMsg:'Error',
      ishowMOdal:false,
      modalVisible:false,
      cnId:'',
      isFord:''
    };

  
  }

  getNotifications = async () => {
     await AsyncStorage.setItem('notiCount','0');
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    let data = JSON.stringify({
    user_id: udata
    });
     this.setState({loading:true});
    const token = await AsyncStorage.getItem('fcmtoken');
    // console.log(token);
    let headers = {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authentication': `Bearer ${token}`
      }
    }
    axios.post(Api.apiUrl+'/get-notifications', data, headers)
    .then(res => {
    console.log(res.data);
    this.setState({notificationsData:res.data.data}); 
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

  backScreen(){
    this.props.navigation.goBack();
  }

  deleteNotification(){
   
    let isFr = this.state.isFord;
    this.deleteNoti(this.state.cnId,isFr);

  }

  async deleteNoti(id,isDel){
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    let data = JSON.stringify({
    user_id: udata,
    id:id,
    isDel:isDel
    });
     this.setState({loading:true});
    const token = await AsyncStorage.getItem('fcmtoken');
    // console.log(token);
    let headers = {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authentication': `Bearer ${token}`
      }
    }
    axios.post(Api.apiUrl+'/delete-notifications', data, headers)
    .then(res => {
      this.setState({cnId:''});
      this.setState({isFord:''});
      this.setState({errMsg:AlertMessages.notificationMsg});
      this.setState({ishowMOdal:true});
      this.setState({ modalVisible:false});
      this.getNotifications();
      this.setState({loading:false});
    })
    .catch(error => {
      this.setState({ modalVisible:false});
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

  clearNotifications(){
     Alert.alert(
      'Delete Notifications',
      'Do you want to delete all the notifications ? ', // <- this part is optional, you can pass an empty string
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Delete', onPress: () => this.deleteNoti(id,'all')},
      ],
      {cancelable: false},
    );

  }

  handleCallback = (childData) =>{
      this.setState({ishowMOdal: childData});
  }
  nextScreen(){
    this.props.navigation.navigate('UserstatusScreen');
  }

  

  goBack(){
    this.props.navigation.navigate('HomeCookiesScreen');
  }

  componentDidMount(){
    this.getNotifications();
    this.focusListener = this.props.navigation.addListener('focus', () => {
       this.getNotifications();
    });
  }

  getRecDetail = (i,ntype) => {
    if(ntype == 'kuki'){
      this.props.navigation.push('CookiesDetail',{user_id:i,isFrom:2});
    }else if(ntype == 'jar'){
      this.props.navigation.push('CookieZarScreen');
    }else if(ntype == 'post' || ntype == 'event'){
      this.props.navigation.push('HomeCookiesScreen');
    }
    
  }

  openStatusModal(id,isFor) { 
    this.setState({cnId:id});
    this.setState({isFord:isFor});
    this.setState({modalVisible:true});
  }

  render (){

    const { notificationsData,loading,errMsg,ishowMOdal,modalVisible } = this.state;

    const handleSubmitPress = () => {
    if(!this.state.setChecked){
      this.createAlert('Selected');
      return;
    }
    this.props.navigation.navigate('UserstatusScreen');
    }
   

    const notficationContent = [];
    if(notificationsData.length > 0){

      for (var i = 0; i < notificationsData.length; i++) {
        let notId = notificationsData[i].id;
        let fId = notificationsData[i].from_id;
        let ntype = notificationsData[i].notification_type;
         notficationContent.push(<View style={styles.subinnerContent} key={i}>
              <View style={styles.suninnerContent}>
                <TouchableOpacity
                  style={styles.texttStyle}
                  activeOpacity={0.5}
                   onPress={() => {
                  this.getRecDetail(fId,ntype);
                }}><Text style={styles.notificationTextStyle}>{notificationsData[i].notification_content}</Text><Text style={styles.notificationTimeStyle}>{notificationsData[i].notification_time} ago</Text></TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  activeOpacity={0.5}
                   onPress={() => {
                  this.openStatusModal(notId,'one');
                }}
                  >
                  <Text style={styles.buttonTextStyle}><Feather 
                  name={'x-circle'}
                  size={22} 
                  color={AppStyle.linkColor}
                  
                   
                /></Text>
                </TouchableOpacity>
              </View>
              
            </View>)
      }
    }else{
      notficationContent.push(<Text key="noti" style={styles.notificationTextStyle}>No Noifications Found!</Text>)
    }
    
    return <View style={{flex:1,height:'100%'}}><Loader loading={loading} />{ishowMOdal && <UseAlertModal message={errMsg} parentCallback = {this.handleCallback} /> }<View style={styles.mainBody}>
              <View style={styles.backSection}>
                <View style={styles.topheadSectionLeft}>
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
                  <Text style={styles.ContentHeadStyle}>Notifications</Text>
                </View>
                <View style={styles.topheadSection}>
                   <TouchableOpacity  onPress={() => {
                  this.openStatusModal('','all');
                }}>
                   <Text style={styles.headingText}>Clear All</Text>
                </TouchableOpacity>
                </View>
              </View>
           
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollViewsec}><View style={styles.innerContent}>
              {notficationContent}
            </View></ScrollView>
          </View>
          <CookieNavigationScreen navigation={this.props.navigation}/>
           <View style = {styles.Mdcontainer}>  
        <Modal            
          animationType = {"fade"}  
          transparent = {true}  
          visible = {modalVisible}  
          onRequestClose = {() =>{ console.log("Modal has been closed."); } }>  
          {/*All views of Modal*/}  
              <View style = {styles.modal}> 
              <Text style = {styles.modalTitle}>Are you sure want to delete all the notifications?</Text> 
             
              <View style = {styles.Btnmodal}>
               <TouchableOpacity
              
              activeOpacity={0.9}
              onPress= {() => {  
                  this.setState({ modalVisible:false}); }} style={styles.buttonOuter}>
               <View
        style={styles.buttonCStyle}>
              <Text style={styles.buttonTextMStyle}>Close</Text>
              </View>
            </TouchableOpacity> 

             <TouchableOpacity
              
              activeOpacity={0.9}
               onPress={() => {
                  this.deleteNotification();
                }}
               style={styles.buttonOuter}>
               <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={styles.buttonMStyle}>
              <Text style={styles.buttonTextMStyle}>Delete</Text>
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
export default NotificationScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex:1,
    backgroundColor: AppStyle.appColor,
    paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
   
    paddingTop: 35,
    height:'100%'
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
  backSection:{
    flexDirection:'row',
    marginBottom:15,
    alignItems:'center',
    justifyContent:'space-between'
  },
  ContentHeadStyle:{
    color:AppStyle.fontColor,
    fontFamily: 'GlorySemiBold',
    fontSize:AppStyle.aapPageHeadingSize,
    marginLeft:20
  },
  topheadSectionLeft:{
    flexDirection:'row',
    width:'80%',
    alignItems:"center"
  },
  topheadSection:{
    flexDirection:'row',
    width:'20%'
  },
  texttStyle:{
    width:'90%'
  },
  buttonStyle:{
    width:'20%'
  },
  suninnerContent:{
    flexDirection:'row',
    paddingTop:18,
    width:'100%'
    
  },
  headingText:{
    color: AppStyle.appIconColor,
    fontSize:16,
    fontFamily: 'Abel',
    marginLeft:14
  },
  subinnerContent:{
    borderBottomWidth:1,
    paddingBottom:10,
    borderColor:'#E8E6EA'
  },
  notificationTextStyle: {
    color: '#000',
    fontSize:16,
    fontFamily: 'Abel',
    marginLeft:5,
    width:'85%'
  },
  notificationTimeStyle: {
    color: '#573353',
    fontSize:14,
    fontFamily: 'Abel',
    marginLeft:5
  },
  buttonTextStyle: {
    color: AppStyle.appIconColor,
    fontSize:16,
    fontSize: AppStyle.buttonFontsize,
    fontFamily: 'Abel',
    marginLeft:10
  },
  scrollViewsec:{
    padding:1
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