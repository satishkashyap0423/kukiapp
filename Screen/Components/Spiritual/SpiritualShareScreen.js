// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, Component } from 'react';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  Keyboard,
  TouchableOpacity,
  Alert,
  Modal,
  Share,
  Pressable,
  KeyboardAvoidingView
} from 'react-native';

import AppStyle from '../../Constants/AppStyle.js';
import Capture from '../Common/Capture.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import Api from '../../Constants/Api.js';
import CookieNavigationScreen from '../Common/CookieNavigationScreen';
import { useRoute } from '@react-navigation/native';
import Loader from '../../Components/Loader';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';
import { FontAwesome5 } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

class SpiritualShareScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectedGuru: '',
      selectedItems: [],
      isguruSelected: false,
      errMsg: '',
      ishowMOdal: false,
      eventUserdetail: [],
      eventUser: [],
      eventstateData: [],
      eventcityData: [],
      eventuserCommunityData: [],
      eventUserRating: '0',
    };
  }

  async getUserData() {

    let udata = JSON.parse(await AsyncStorage.getItem('userData'));

    this.setState({ loading: true });
    let data = JSON.stringify({
      user_id: udata.id
    });
    let headers = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    axios.post(Api.apiUrl + '/get-user-detail', data, headers)
      .then(res => {

        this.setState({ loading: false });
        //console.log(res.data.data.user_detail);
        this.setState({ eventUserdetail: res.data.data.user_detail });
        this.setState({ eventUser: res.data.data.user_detail.user });
        this.setState({ eventUserRating: res.data.data.rating });
        this.setState({ eventstateData: res.data.data.user_detail.state_data });
        this.setState({ eventcityData: res.data.data.user_detail.city_data });
        this.setState({ eventuserCommunityData: res.data.data.communities });

      }).catch(error => {

        if (error.toJSON().message === 'Network Error') {
          this.setState({ errMsg: AlertMessages.noInternetErr });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        } else {
          this.setState({ errMsg: error.toJSON().message });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        }
      });
  }

  async getGuruRecords() {


    let gData = JSON.parse(await AsyncStorage.getItem('guruData'));

    this.setState({ loading: true });
    let data = JSON.stringify({
      guru_id: gData.id
    });
    let headers = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    axios.post(Api.apiUrl + '/get-random-guruimage', data, headers)
      .then(res => {
        this.setState({ loading: false });
        console.log("sdg", res.data)
        this.setState({ selectedGuru: res.data.data });
        AsyncStorage.setItem('gururandomImg', res.data.data);
      }).catch(error => { console.log(error); this.state.loading = false; });
  }

  async getSavedGuruRecords() {
    let guruImg = await AsyncStorage.getItem('gururandomImg');
    this.setState({ selectedGuru: guruImg });
  }

  backScreen() {
    this.props.navigation.navigate('SpiritualScreen');
  }

  editLocation() {

  }

  checkVal(i) {

    if (i == 2) {

      this.props.navigation.navigate('PostEventScreen');
    }
  }

  followGuru() {

    if (this.state.selectedItems == '') {
      this.setState({ errMsg: AlertMessages.guruErrMsg });
      this.setState({ ishowMOdal: true });
      return;
    }
    this.setState({ isguruSelected: true });
  }
  handleCallback = (childData) => {
    this.setState({ ishowMOdal: childData });
  }

  onSelectedItemsChange = (selectedItems, val) => {
    this.setState({ selectedItems: selectedItems });
  };

  async componentDidMount() {

    this.getUserData();
    this.getGuruRecords();

    /*let isVal = await AsyncStorage.getItem('date');

    if(isVal == null){
      const date = new Date();
      const mdate = date.toString().split(" ");
      await AsyncStorage.setItem('date', mdate[2]);
      this.getGuruRecords();
    }else{
      let oldDate = await AsyncStorage.getItem('date');
      const date = new Date();
      const mdate = date.toString().split(" ");
      let todayDate = new Date();
      if(oldDate < mdate[2]){
        this.getGuruRecords();
        const date = new Date();
      const mdate = date.toString().split(" ");
      await AsyncStorage.setItem('date', mdate[2]);
      }else{
        this.getSavedGuruRecords();
        
      }
    }*/
  }

  async senimgadd(urlDf) {
    Sharing.shareAsync("file://" + urlDf);

    return;
    try {
      const result = await Share.share({
        message:
          urlDf
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType

        } else {

        }
      } else if (result.action === Share.dismissedAction) {

      }
    } catch (error) {

    }
  }

  render() {

    const { loading, ishowMOdal, itemsData, isguruSelected, errMsg, eventUserdetail, eventUser, eventUserRating, eventstateData, eventcityData, eventuserCommunityData, selectedGuru } = this.state;
    let user_profile_image = eventUserdetail.user_profile_image;
    let shareBadbaimg = selectedGuru;

    let shareBabaimg = [];
    shareBabaimg.push(<View key="eventshare" style={styles.outermainShareSection} collapsable={false}
      ref={view => {
        this._shareViewContainer = view;
      }}><View style={styles.outerContainer} >
        <View style={styles.guruImagesec}>

          {shareBadbaimg != '' && <Image
            source={{ uri: shareBadbaimg }}
            style={{
              width: '100%',
              height: 300,
              borderRadius: 10,
              borderWidth: 1,
              resizeMode: 'contain',
            }}
          />}

          {/* <View style={styles.outerEventContainer}>
                  <View style={styles.leftEventContainer}>
                     <View style={styles.outerImgSection}>
                        <Image
                        source={{ uri: user_profile_image }} 
                        style={styles.imagetopCont}
                        />  
                     </View>
                  </View>
                  {eventUser.first_name != null && <View
                     style={styles.rightEventContainer}
                     >
                     <Text style={styles.searchContentTextBold}>{eventUser.first_name} {eventUser.last_name}, <Feather 
                  name={'star'}
                  size={16} 
                  color={AppStyle.appIconColor}
                   
                /> {eventUserRating}</Text>
                    <Text style={styles.searchContentText}>{eventUserdetail.gender}, {eventUserdetail.age_group}, {eventcityData.name}, {(eventstateData.state_abbrivation != '' ? eventstateData.state_abbrivation:eventstateData.name)}</Text> 
                    <Text style={styles.searchContentText}>{eventuserCommunityData.name}</Text>
                  </View>}
                 
               </View> */}

        </View>
        <View style={styles.dtappDetail}>
          <Image
            source={require('../../../assets/images/icons/yellowcookie.png')}
            style={{
              width: 18,
              height: 18,
              marginRight: 5,

              resizeMode: 'contain',
            }}
          />
          <Text style={styles.searchConteshareTextntText}>kukiapp.com</Text>
        </View>
      </View></View>);



    let urlDf = '';
    const onShare = async () => {


      const resuklt = captureRef(this._shareViewContainer, {
        format: "jpg",
        quality: 1.0,
      }).then(
        (uri) => {
          urlDf = uri;
          this.senimgadd(uri);
          //console.log("Image saved to", uri)
        },
        (error) => console.error("Oops, snapshot failed", error)
      );

      //console.log("Image saved to", urlDf)


    };

    return <View style={{ flex: 1, height: '100%', backgroundColor: '#fff' }}><Loader loading={loading} />{ishowMOdal && <UseAlertModal message={errMsg} parentCallback={this.handleCallback} />}<ScrollView showsVerticalScrollIndicator={false}>

      <View style={styles.mainBody}>
        <View style={styles.SectionHeadStyle}>
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
          <Text style={styles.SectionHedText}>Share Blessings</Text>
        </View>
        {shareBabaimg}

        <View style={styles.SocialMediaSec}>

          <View style={styles.SocialIcons}>

            <TouchableOpacity onPress={onShare} activeOpacity={0.7}>
              <LinearGradient
                // Button Linear Gradient
                colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
                style={styles.SocialIconBg}>
                <FontAwesome5
                  name={'whatsapp'}
                  size={20}
                  color={AppStyle.fontColor}

                />
              </LinearGradient>
            </TouchableOpacity>


            <TouchableOpacity onPress={onShare} activeOpacity={0.7}>
              <LinearGradient
                // Button Linear Gradient
                colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
                style={styles.SocialIconBg}>
                <Feather
                  name={'facebook'}
                  size={20}
                  color={AppStyle.fontColor}

                />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={onShare} activeOpacity={0.7}>
              <LinearGradient
                // Button Linear Gradient
                colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
                style={styles.SocialIconBg}>
                <FontAwesome5
                  name={'instagram'}
                  size={20}
                  color={AppStyle.fontColor}

                />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={onShare} activeOpacity={0.7}>
              <LinearGradient
                // Button Linear Gradient
                colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
                style={styles.SocialIconBg}>
                <Feather
                  name={'twitter'}
                  size={20}
                  color={AppStyle.fontColor}

                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

      </View>


    </ScrollView>

      <CookieNavigationScreen navigation={this.props.navigation} />
    </View>

  }
};
export default SpiritualShareScreen;

const styles = StyleSheet.create({

  mainBody: {
    flex: 1,
    backgroundColor: AppStyle.appColor,
    alignContent: 'center',
    paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
    paddingBottom: AppStyle.appInnerBottomPadding,
    paddingTop: AppStyle.appInnerTopPadding,
    backgroundColor: '#fff',
    height: '100%'
  },
  SectionHeadStyle: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 25
  },
  backIconsCont: {
    borderWidth: 1,
    borderColor: '#E8E6EA',
    borderRadius: 15,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20
  },
  SectionHedText: {
    fontSize: AppStyle.aapPageHeadingSize,
    fontFamily: 'GlorySemiBold',
    fontWeight: '400',
    color: AppStyle.fontColor,
    marginLeft: 20
  },
  outermainShareSection: {
    padding: 10,
    backgroundColor: '#fff'
  },
  outerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: AppStyle.appIconColor,
    backgroundColor: '#fff',


  },
  guruImagesec: {

  },
  outerEventContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: '#fff',

    marginTop: 0,
    paddingTop: 10,
  },
  leftEventContainer: {
    width: '25%',

  },
  userImagesec: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: AppStyle.maplocationColor
  },
  rightEventContainer: {
    width: '74%',
    marginLeft: 10,

  },
  dtappDetail: {
    position: 'absolute', top: -10, left: 20, right: 0, bottom: 0,
    backgroundColor: '#fff',
    paddingLeft: 5,
    paddingRight: 5,
    height: 20,
    width: 100,
    flexDirection: 'row'
  },
  searchConteshareTextntText: {
    fontFamily: 'Abel',
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 14,
  },

  searchContentTextBold: {
    fontSize: 16,
    fontFamily: 'GlorySemiBold',
    color: AppStyle.fontColor
  },
  searchContentText: {
    color: '#36454F',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Abel'
  },
  imagetopCont: {
    width: 54,
    height: 54,
    borderRadius: 108,
    marginTop: 0.8,
  },
  outerImgSection: {

    flexDirection: 'row',
    width: 64,
    height: 65,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: AppStyle.appIconColor,
    padding: 3,
    marginRight: 10,
    textAlign: 'center'
  },
  SocialMediaSec: {
    textAlign: 'center',
    width: '100%',
    justifyContent: 'space-between',

    marginTop: 10

  },
  SocialIcons: {
    flexDirection: 'row',

    justifyContent: 'space-evenly'
  },
  SocialIconBg: {
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',

    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 18,
    paddingBottom: 18
  },
  IconImgSec: {
    borderRightWidth: 1,
    borderColor: '#FFD3A9',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  IconTxtSec: {
    padding: 10,
  },
  IcTxt: {
    fontSize: 16,
    fontFamily: 'Abel',
    fontWeight: '400',
    lineHeight: 26,
    color: AppStyle.fontColor,
  }

});