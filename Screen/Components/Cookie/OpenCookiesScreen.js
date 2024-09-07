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

class OpenCookiesScreen extends Component {

 constructor(props) {
    super(props);
    this.state = {
      loading:false,
      cookieData:[]
    };
  }

 createAlert = (FirstName) =>
  Alert.alert(
    "Required",
    FirstName,
    [
     
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]
  );
  
  

  render (){

    const { checked,loading,cookieData} = this.state;

  
    
   let sData = this.props.route.params.cookieRecords;
   let cookie_data = JSON.parse(sData);
   console.log(cookie_data);
    let sentContentData = [];
  for (var i = cookie_data.length - 1; i >= 0; i--) {
   
    sentContentData.push(
              <View style={styles.mainInnersection} key={i}>
              <Text style={styles.cookieRecordText}>{cookie_data[i].cookie_message}</Text>

                </View>);

 }
    return <View style={{flex:1,height:'100%',backgroundColor:'#fff'}}><Loader loading={loading} /><ScrollView>
            <View style={styles.mainBody}>
              <View style={styles.topheadSection}>
                <Text style={styles.SectionHeadStyle}>Cookies Data</Text>
                <Text style={styles.SectionsubHeadStyle}>(Cookies Message View of Received Cookies)</Text>
              </View>
              {sentContentData}
            </View>
          </ScrollView>
           <CookieNavigationScreen navigation={this.props.navigation}/>
          </View>
  }
};
export default OpenCookiesScreen;

const styles = StyleSheet.create({
  mainBody: {
   flex:1,
    backgroundColor: AppStyle.appColor,
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 35,
    paddingTop: 50
  },
  topheadSection:{
    marginTop:10,
    marginBottom:35
  },
  SectionHeadStyle: {
    fontSize:AppStyle.aapPageHeadingSize,
    fontFamily: 'Abel',
    fontWeight:'400',
    color:'rgba(253, 139, 48, 0.69)'
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
  SectionsubHeadStyle:{
    fontSize:16,
    fontFamily: 'Abel',
    fontWeight:'400',
    color:'#000'
  },
  mainInnersection: {
    flexDirection:'row',
    flex:1,
    alignItems:'center',
    justifyContent: 'space-between',
    marginBottom:10,
    paddingBottom:15,
    paddingTop:15
  },
  searchMainContentsection:{
    flexDirection:'row',
    flex:1,
    alignItems:'center',
    justifyContent: 'space-between',
    borderColor:'#E8E6EA',
    borderBottomWidth:1,
    paddingBottom:10,
  },
  searchContentsection:{
    paddingLeft:0,
  },
  cookieRecordText:{
    fontSize:13,
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
    borderWidth:2,
    borderColor:AppStyle.appIconColor,
    borderRadius:100,
    padding:3,
    marginRight:10,
    height:58,
    width:58
  }
});