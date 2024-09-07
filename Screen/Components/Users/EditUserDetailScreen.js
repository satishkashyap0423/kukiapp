// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, Component, useCallback } from 'react';
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

class UserDetailScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userDetailData: {},
      loading: false,
      errMsg: 'Error',
      ishowMOdal: false,
      modalVisible: false,

    };

    AsyncStorage.setItem('activeClass', 'FactiveClass');

  }


  editPrfile(val) {
    this.props.navigation.push('EditUserScreen');
  }

  deleteProfile(val) {

    this.setState({ modalVisible: true });
  }

  closeBlockModal() {

    this.setState({ modalVisible: false });
  }


  async proceeddeletePrfile() {
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
    axios.post(Api.apiUrl + '/delete-user-profile', data, headers)
      .then(res => {

        this.setState({ loading: false });
        if (res.data.status == 'true') {
          AsyncStorage.clear();
          this.props.navigation.replace('LoginNavigationStack');
        } else {
          console.log(error); this.state.loading = false;
        }
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





  backScreen() {
    this.props.navigation.navigate('HomeCookiesScreen');
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
        if (res.data.status == 'true') {

          this.setState({ userDetailData: res.data.data });

          AsyncStorage.setItem('userRecordsstorage', JSON.stringify(res.data.data));




        } else {
          console.log(error); this.state.loading = false;
        }
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

  handleCallback = (childData) => {
    this.setState({ ishowMOdal: childData });
  }



  componentDidMount() {
    this.getUserData();
  }

  async UNSAFE_componentWillMount() {

    let userRecordsstorage = JSON.parse(await AsyncStorage.getItem('userRecordsstorage'));


    if (userRecordsstorage != null) {
      this.setState({ userDetailData: userRecordsstorage });
    }

  }

  render() {

    const { userDetailData, loading, Userrating, errMsg, ishowMOdal, modalVisible } = this.state;


    let ratingUserData = [];
    let ratedUserData = [];

    let userImg = [];
    if (userDetailData?.user_detail?.user_profile_image != null) {

      userImg.push(<View style={styles.outerImgSection} key={userDetailData?.user_detail?.id}><Image

        source={{ uri: `${Api.imgaePath}/${userDetailData?.user_detail?.user_profile_image}` }}
        style={styles.imagetopCont}
      /></View>);
    } else {
      userImg.push(<View style={styles.outerImgSection} key={userDetailData?.user_detail?.id}><Image

        source={require('../../../assets/images/uphoto.png')}
        style={styles.imagetopCont}
      /></View>);
    }

    let languagesRecords = [];
    let remlanguagesRecords = [];


    for (var i = 0; i < userDetailData?.languages?.length; i++) {
      let extComma = ',';
      if (i == userDetailData?.languages?.length - 1) {
        extComma = '';
      }
      languagesRecords.push(<Text key={i} style={styles.commcontSection}>{userDetailData?.languages?.[i].name}{extComma} </Text>);

    }

    let traitsRecords = [];
    let remtraitsRecords = [];

    for (var i = 0; i < userDetailData?.personality_traits?.length; i++) {

      let extComma = ',';
      if (i == userDetailData?.personality_traits.length - 1) {
        extComma = '';
      }
      traitsRecords.push(<Text style={styles.commcontSection}>{userDetailData?.personality_traits[i].name}{extComma} </Text>);

    }
    let ratingData = [];

    for (var i = 0; i < userDetailData?.rating; i++) {
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
    for (var i = 0; i < 5 - userDetailData?.rating; i++) {

      ratingNoData.push(<Image
        key={i}
        source={require('../../../assets/images/icons/starn.png')}
        style={{
          width: 18,
          resizeMode: 'contain'
        }}
      />);

    }

    let proExte = true;


    return <View style={{ flex: 1 }}><ScrollView>
      <Loader loading={loading} />
      {ishowMOdal && <UseAlertModal message={errMsg} parentCallback={this.handleCallback} />}
      <View style={styles.topheadSection}>
        <View>
          <Image
            source={{ uri: `${Api.imgaePath}/${userDetailData?.user_detail?.user_profile_image}` }}
            style={{
              width: '100%',
              height: 272,
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
          <TouchableOpacity
            style={styles.innerSection}
            activeOpacity={0.5}
            onPress={this.deleteProfile.bind(this, 'x')}>
            <Feather
              name={'trash'}
              size={22}
              color={'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.innerSection}
            activeOpacity={0.5}
            onPress={this.editPrfile.bind(this, 'x')}>
            <Feather
              name={'edit'}
              size={22}
              color={'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)'}
            />
          </TouchableOpacity>




        </View>


        <View style={styles.UserddeOuterHead} >

          <View style={styles.innermainlayutSection}>

            <View style={styles.innermainlayutFirstSection}>
              {userImg}

              {userDetailData?.user_detail?.user?.first_name != '' && <View style={styles.innermainlayutSecSection}>
                <Text style={styles.textHeading}>
                  {userDetailData?.user_detail?.user?.first_name + ' ' + userDetailData?.user_detail?.user?.last_name}, <Feather
                    name={'star'}
                    size={16}
                    color={AppStyle.appIconColor}

                  /> {userDetailData?.rating}
                </Text>

                <Text style={styles.textSubheading}>{userDetailData?.user_detail?.gender}, {userDetailData?.user_detail?.age_group}, {userDetailData?.user_detail?.city_data?.name}, {(userDetailData?.user_detail?.state_data?.state_abbrivation != '' ? userDetailData?.user_detail?.state_data?.state_abbrivation : userDetailData?.user_detail?.state_data?.name)}</Text>
                <Text style={styles.textSubheading}>
                  {userDetailData?.communities?.name}
                </Text>







              </View>}
            </View>

          </View>

        </View>

        <View style={styles.receivedSection}>
          <Text style={[styles.textInnerHeadingSM, { width: 63 }]}>Status</Text>
          <Text style={styles.receivedContentSection}>{userDetailData?.user_detail?.user_status}</Text>

        </View>

        <View style={styles.receivedSection}>
          <Text style={[styles.textInnerHeadingSM, { width: 87 }]}>Languages</Text>
          <View style={styles.receivedInnerSection}>
            <Text style={styles.receivedContentSection}>{languagesRecords}</Text>

          </View>


        </View>

        <View style={styles.receivedSection}>
          <Text style={[styles.textInnerHeadingSM, { width: 57 }]}>Traits</Text>
          <View style={styles.receivedInnerSection}>
            <Text style={styles.receivedContentSection}>{traitsRecords}</Text>

          </View>


        </View>
        <View style={styles.receivedSection}>
          <Text style={[styles.textInnerHeadingSM, { width: 70 }]}>Religion</Text>
          <Text style={styles.receivedContentSection}>{userDetailData?.user_detail?.religion}</Text>

        </View>





        <View style={styles.Mdcontainer}>
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => { }}>
            {/*All views of Modal*/}
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>{AlertMessages.deleteProfileErr}</Text>

              <View style={styles.Btnmodal}>
                <TouchableOpacity

                  activeOpacity={0.9}
                  onPress={() => {
                    this.closeBlockModal();
                  }} style={styles.buttonOuter}>
                  <View
                    style={styles.buttonCStyle}>
                    <Text style={styles.buttonTextMStyle}>Cancel</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity

                  activeOpacity={0.9}
                  onPress={() => {
                    this.proceeddeletePrfile();
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
    </ScrollView>
      <CookieNavigationScreen navigation={this.props.navigation} />
    </View>
  }
};
export default UserDetailScreen;

const styles = StyleSheet.create({
  topheadSection: {

  },
  backBtnSection: {
    position: 'absolute',
    top: 80,
    left: 15,
    borderWidth: 1,
    borderColor: '#E8E6EA',
    borderRadius: 15,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20
  },
  innerBody: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#ffffff',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: -40,
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 30
  },
  innerHeadSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -40,
  },
  innerfavSection: {
    backgroundColor: 'rgba(253, 139, 48, 0.69)',
    width: 99,
    height: 99,
  },
  innerSection: {
    height: 78,
    width: 78,
    backgroundColor: '#fff',
    borderColor: '#E8E6EA',
    borderWidth: 6,
    backgroundColor: '#fff',
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ratingSection: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center'

  },
  ratedSection: {
    flexDirection: 'row',
    width: '30%'
  },
  rateSection: {
    flexDirection: 'row',

    width: '50%'
  },
  innermainlayutSection: {
    flexDirection: 'column',
    width: '80%'
  },
  innermainlayutFirstSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  innermainlayutSecSection: {
    flexDirection: 'column',
    width: '100%'
  },
  directionIcon: {
    height: 52,
    width: 52,
    backgroundColor: '#fff',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E6EA',
  },
  textHeading: {
    fontSize: 16,
    fontFamily: 'GlorySemiBold',
    color: AppStyle.fontColor
  },
  textInnerHeading: {
    color: AppStyle.fontColor,
    fontSize: 16,
    fontFamily: 'GlorySemiBold',
    position: 'absolute',
    top: -10,
    left: 25,
    paddingLeft: 5,
    paddingRight: 3,
    backgroundColor: '#fff',
    width: 90,
    height: 23,
    zIndex: 2,
  },
  textInnerHeadingSM: {
    color: AppStyle.fontColor,
    fontSize: 16,
    fontFamily: 'GlorySemiBold',
    position: 'absolute',
    top: -10,
    left: 20,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    height: 23,
    zIndex: 2,
  },
  textInnerHeadingRM: {
    color: AppStyle.fontColor,
    fontSize: 16,
    fontFamily: 'GlorySemiBold',
    position: 'absolute',
    top: -10,
    left: 25,
    paddingLeft: 5,
    paddingRight: 3,
    backgroundColor: '#fff',
    width: 68,
    height: 23,
    zIndex: 2,
  },
  textSubheading: {
    color: '#AAA6B9',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Abel'
  },
  rttextSubheading: {
    color: AppStyle.fontColor,
    fontSize: 15,
    fontFamily: 'GlorySemiBold',

  },
  locationIcon: {
    flexDirection: 'row',
  },
  locaitonDirectionText: {
    color: 'rgba(253, 139, 48, 0.69)',
    fontSize: 12,
    fontFamily: 'Abel',
    marginLeft: 5
  },
  receivedSection: {

    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: AppStyle.appIconColor,
    paddingLeft: 5,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 20
  },
  receivedInnerSection: {

    flexDirection: "column",
    justifyContent: 'flex-start'
  },
  receivedHeadSection: {
    color: AppStyle.fontColor,
    fontSize: 16,
    fontFamily: 'Abel',
  },
  cookieNoRecords: {
    color: AppStyle.fontColor,
    fontSize: 16,
    fontFamily: 'Abel',

  },
  receivedContentSection: {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: 14,
    fontFamily: 'Abel',
    marginLeft: 10
  },
  aboutreadMoreection: {
    color: 'rgba(253, 139, 48, 0.69)',
    fontSize: 14,
    fontFamily: 'Abel'
  },
  commSection: {
    paddingTop: 15,
    paddingBottom: 15
  },
  comHeadSection: {
    color: AppStyle.fontColor,
    fontSize: 16,
    fontFamily: 'Abel',
  },
  commContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    maxWidth: '50%'
  },
  commSecContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 15,
  },
  commBox: {
    paddingTop: 10,
    paddingLeft: 12,
    paddingBottom: 10,
    paddingRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(253, 139, 48, 0.69)',
    borderRadius: 5,
    marginRight: 15
  },
  commcontSection: {
    color: AppStyle.fontColor,
    fontSize: 14,
    fontFamily: 'Abel'
  },
  galleryContentSection: {
    marginTop: 15,
    marginBottom: 25
  },
  galleryTopgallrysec: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gallerybottomgallrysec: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  galleryHeadSection: {
    color: AppStyle.fontColor,
    fontSize: 16,
    fontFamily: 'Abel',
    marginBottom: 15
  },
  galleryTopHeadSection: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  galleryseeSection: {
    color: 'rgba(253, 139, 48, 0.69)',
    fontSize: 14,
    fontFamily: 'Abel'
  },
  cookiesRecords: {
    marginTop: 30,
    marginBottom: 30
  },
  CookieText: {
    marginBottom: 10,
    color: AppStyle.fontColor,
    fontSize: 15,
    fontFamily: 'GlorySemiBold',
    marginBottom: 15,
    lineHeight: 24
  }, CookieOuterHead: {
    flexDirection: 'row',
    justifyContent: 'flex-start',


  }, CookieOuterHeadNMText: {
    color: AppStyle.fontColor,
    fontFamily: 'Abel',
    fontSize: 15
  },
  CookieOuterHeadText: {
    color: AppStyle.fontColor,
    fontFamily: 'Abel',
    fontSize: 15,
    marginLeft: 10
  },
  UserOuterHeadText: {
    color: AppStyle.fontColor,
    fontFamily: 'Abel',
    fontSize: 18,

  },
  CookieOuterMain: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: AppStyle.appIconColor,
    backgroundColor: AppStyle.btnbackgroundColor,
    padding: 15,
    marginBottom: 10
  },
  UserDetailOuterMain: {

    marginTop: 20,
  },
  UserddeOuterHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center'

  },
  UserdeOuterHead: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: AppStyle.appIconColor,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    textAlign: 'center',


  },
  CookieOuter: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: '100%',

  }, outerImgSection: {

    flexDirection: 'row',
    width: 64,
    height: 64,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: AppStyle.appIconColor,
    padding: 3,
    marginRight: 10,
    textAlign: 'center',

  },
  imagetopCont: {
    width: 54,
    height: 54,
    borderRadius: 108,
    marginTop: 0.8,
  },
  cookieContent: {
    color: AppStyle.fontColor,
    fontSize: 14,
    fontFamily: 'Abel',
    paddingTop: 10,
    paddingBottom: 10,
    width: '80%',
    lineHeight: 24
  },
  cookieFullContent: {
    color: AppStyle.fontColor,
    fontSize: 14,
    fontFamily: 'Abel',
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
    lineHeight: 24
  },
  cookieShare: {
    color: AppStyle.fontColor,
    fontSize: 14,
    fontFamily: 'Abel',
    textAlign: 'right',
    marginLeft: 3
  }, ShareButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }, ShareInnerButtons: {
    width: '48%',
  }, cookieShareDltBtn: {
    paddingTop: 13,
    flexDirection: 'row',
    paddingBottom: 13,
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: AppStyle.btnbackgroundColor,
    borderColor: AppStyle.appIconColor,
    borderWidth: 1
  },
  cookieShareBtn: {
    paddingTop: 15,
    flexDirection: 'row',
    paddingBottom: 15,
    justifyContent: 'center',
    borderRadius: 15
  },
  blockUnblockSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,

    width: '100%'
  },
  blockUnblockSectionInnerFirst: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '45%',
    alignItems: 'center'
  },
  blockUnblockSectionInnerSec: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '56%'
  },
  blockUnblockSectionHead: {
    color: AppStyle.fontColor,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Abel',

  },
  innerSsection: {
    marginTop: 4
  },
  modal: {
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: AppStyle.btnbackgroundColor,
    width: '80%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#fff',
    position: 'absolute',
    top: '35%',
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 25,
    paddingRight: 25
  },
  buttonTextMStyle: {
    color: AppStyle.fontButtonColor,
    fontFamily: 'GlorySemiBold',
    fontSize: 15,
    textTransform: 'capitalize'
  },
  modalTitle: {
    color: AppStyle.fontButtonColor,
    fontFamily: 'GlorySemiBold',
    fontSize: 16,

    marginBottom: 10
  },
  modalCTitle: {
    color: 'rgba(253, 139, 48,0.8)',
    fontFamily: 'GlorySemiBold',
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 10
  },
  Btnmodal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonOuter: {

    marginTop: 20
  },
  buttonMStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 15,
    width: 110,
    marginLeft: 10
  },
  buttonCStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 15,
    width: 110,
    borderWidth: 1,
    borderColor: AppStyle.appIconColor
  }
});