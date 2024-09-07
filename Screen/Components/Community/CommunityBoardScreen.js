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
  Pressable,
  KeyboardAvoidingView
} from 'react-native';

import AppStyle from '../../Constants/AppStyle.js';
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

class CommunityBoardScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      itemsData: [],
      grouppostsData: {},
      userDetail: {},
      userData: {},
      stateData: {},
      cityData: {},
      countryData: {},
      selectedCommunityValue: '',
      selectedStateValue: '',
      selectedCityValue: '',
      grpHeading: 'Social',
      loading: false,
      selectedItems: [],
      selectedProfestionValue: [],
      cityId: '',
      modalVisible: false,
      SselectedItems: [],
      CselectedItems: [],
      CityitemsData: [],
      StateitemsData: [],
      errMsg: 'Error',
      ishowMOdal: false,
      Logedudata: 0,
      modalDeVisible: false,
      modalDelVisible: false,
      curDeletePost: '',
      prfSelctTxt: 'Select a Topic',
      prfsSelctTxt: 'Search a Topic',
      USuperlike: '0',
      Ulike: '0',
      selectedGuru: [],
      filterData: [
        {
          name: "Only Most Recently Posted ",
          id: 1,
        },
        {
          name: "Only Most Liked ",
          id: 2,
        },
        {
          name: "Only Most Super Liked ",
          id: 3,
        },
        {
          name: "Only Most Commented ",
          id: 4,
        },
        {
          name: "Only Posted From My Selected City ",
          id: 5,
        },
        {
          name: "Only Posted By Me ",
          id: 7,
        },
        //   {
        //   name: 'Random Play',
        //   id: 6
        // }
      ],
    };



  }
  setModalVisible() {
    this.setState({ modalVisible: false });
  }

  onSSelectedItemsChange = (selectedItems, val) => {
    this.setState({ SselectedItems: selectedItems });
    this.getCityList(selectedItems);
  };
  onCSelectedItemsChange = (selectedItems, val) => {
    this.setState({ CselectedItems: selectedItems });
  };

  getStateList = async (country_id) => {
    this.state.loading = true;
    let data = JSON.stringify({
      country_id: country_id
    });
    const token = await AsyncStorage.getItem('fcmtoken');

    let headers = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authentication': `Bearer ${token}`
      }
    }
    axios.post(Api.apiUrl + '/get-states', data, headers)
      .then(res => {
        this.state.loading = false;
        this.setState({ StateitemsData: res.data.data });
      })
      .catch(error => {
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

  getCityList = async (state_id) => {
    this.state.loading = true;
    let data = JSON.stringify({
      state_id: state_id
    });
    const token = await AsyncStorage.getItem('fcmtoken');

    let headers = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authentication': `Bearer ${token}`
      }
    }
    axios.post(Api.apiUrl + '/get-cities', data, headers)
      .then(res => {
        this.state.loading = false;
        this.setState({ CityitemsData: res.data.data });
      })
      .catch(error => { console.log(error); this.state.loading = false; });
  }

  async getUserData(isType = null) {

    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    let postState = await AsyncStorage.getItem('postState');
    let postCity = await AsyncStorage.getItem('postCity');
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

          this.setState({ userDetail: res.data.data.user_detail });
          this.setState({ userData: res.data.data.user_detail.user });
          this.setState({ countryData: res.data.data.user_detail.country_data });
          this.setState({ stateData: res.data.data.user_detail.state_data });
          this.setState({ cityData: res.data.data.user_detail.city_data });

          if (postState === null) {

            AsyncStorage.setItem('postCity', JSON.stringify(res.data.data.user_detail.city_data));

          } else {
            this.setState({ stateData: JSON.parse(postState) });
            this.setState({ cityData: JSON.parse(postCity) });
          }
          if (isType != null) {
            this.getGroupposts();
          }
        } else {
          console.log(error); this.state.loading = false;
        }
      }).catch(error => { console.log(error); this.state.loading = false; });
  }



  setSelectedValue(itmVal, type) {
    if (type == 'community') {
      this.setState({ selectedCommunityValue: itmVal });
    } else if (type == 'State') {
      this.setState({ selectedStateValue: itmVal });
    } else if (type == 'city') {
      this.setState({ selectedCityValue: itmVal });
    }
  }

  getPrfessionalList = async () => {
    this.setState({ loading: true });

    const cat_data = this.props.route.params.category_id;
    let data = JSON.stringify({
      category_id: cat_data
    });

    const token = await AsyncStorage.getItem('fcmtoken');
    let headers = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authentication': `Bearer ${token}`
      }
    }
    axios.post(Api.apiUrl + '/get-community', data, headers)
      .then(res => {
        this.setState({ loading: false });
        this.setState({ itemsData: res.data.data });
      })
      .catch(error => { console.log(error); this.setState({ loading: false }); });
  }

  getGroupposts = async (gid = null) => {

    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    let pervious_guru_id = this.props.route.params.guru_id_from_back;
    if (gid == null && this.state.selectedProfestionValue != '') {
      gid = this.state.selectedProfestionValue;
    }

    this.setState({ loading: true });
    const cat_data = this.props.route.params.category_id;

    let postCity = JSON.parse(await AsyncStorage.getItem('postCity'));

    let citytID = this.state.userDetail.city;

    if (postCity === null) {

    } else {
      citytID = postCity.id;
    }
    let data = JSON.stringify({
      // group_id: gid,
      guru_id: pervious_guru_id,
      city_id: citytID,
      group_category_id: 2,
      user_id: udata.id,
      is_filtered: gid !== null ? gid[0].toString() : ""
    });
    console.log(data, "data")
    const token = await AsyncStorage.getItem('fcmtoken');
    let headers = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authentication': `Bearer ${token}`
      }
    }

    axios.post(Api.apiUrl + '/get-group-posts', data, headers)
      .then(res => {
        this.setState({ loading: false });
        console.log("most likes ", res)
        this.setState({ grouppostsData: res.data.data });
        const cat_data = this.props.route.params.category_id;
        AsyncStorage.setItem('storagegrouppostsData' + cat_data, JSON.stringify(res.data.data));
      })
      .catch(error => {

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
  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedProfestionValue: selectedItems });
    console.log(selectedItems)
    this.getGroupposts(selectedItems.toString());
  };

  async componentDidMount() {

    let gData = JSON.parse(await AsyncStorage.getItem('guruData'));
    if (gData != null) {
      this.setState({ selectedGuru: gData });
    }

    this.setState({
      selectedProfestionValue: [this.state.filterData[0].id]
    })
    this.getPrfessionalList();

    let postCity = JSON.parse(await AsyncStorage.getItem('postCity'));

    if (postCity === null) {
      this.getUserData('1');
    } else {
      this.getUserData();
      this.getGroupposts([this.state.filterData[0].id]);
    }


    const cat_data = this.props.route.params.category_id;
    if (cat_data == '1') {
      this.setState({ grpHeading: 'Professional' });
      this.setState({ prfSelctTxt: 'Select a professional group' });
      this.setState({ prfsSelctTxt: 'Search professional group' });
    }

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.getGroupposts([this.state.filterData[0].id]);
      this.setState({
        selectedProfestionValue: [this.state.filterData[0].id]
      })
      //Put your Data loading function here instead of my this.loadData()
    });

    this.setState({ loading: false });

    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    this.setState({ Logedudata: udata.id })
  }

  getpostDetail = (id, uid, fid) => {
    const cat_data = this.props.route.params.category_id;
    this.props.navigation.navigate('DiscussionDetailScreen', {
      post_id: id, user_id: uid, category_id: cat_data
    });
  }
  addpostData = (i) => {
    const cat_data = this.props.route.params.category_id;
    this.props.navigation.navigate('CommunityPostScreen', {
      isReturnscreen: 'CommunityBoardScreen', category_id: cat_data, prf_groupVal: this.state.selectedProfestionValue
    });
  }

  getuserDetail = (i) => {
    //this.props.navigation.push('CookiesDetail',{user_id:i,isReturnscreen: 'CommunityBoardScreen'});
    this.props.navigation.push('CookiesDetail', { user_id: i, isReturnscreen: 'CommunityBoardScreen', isFrom: 2 });


  }
  async openpstUrl(urll) {
    var url = this.isValidHttpUrl(urll);

    this.setState({ loading: true });
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      this.setState({ errMsg: `There is something wrong in the URL.(use URL with http)` });
      this.setState({ ishowMOdal: true });

    }

    this.setState({ loading: false });
  }

  isValidHttpUrl(string) {
    let url;

    if (string.protocol == undefined) {
      if (!/^https?:\/\//i.test(string)) {
        url = 'http://' + string;
      }
    } else {
      url = string;
    }

    return url;

  }


  handleCallback = (childData) => {
    this.setState({ ishowMOdal: childData });
  }
  openUnlikeModal(id) {

    this.setState({ modalDeVisible: true });
    this.setState({ curDeletePost: id });
  }

  openDeleteModal(id) {

    this.setState({ modalDelVisible: true });
    this.setState({ curDeletePost: id });
  }
  delePostRequest() {
    let id = this.state.curDeletePost;
    this.setState({ loading: true });
    let data = JSON.stringify({
      post_id: id
    });
    let headers = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    axios.post(Api.apiUrl + '/delete-post', data, headers)
      .then(res => {
        this.setState({ modalDeVisible: false });
        this.setState({ modalDelVisible: false });
        this.setState({ loading: false });

        this.getGroupposts();


      }).catch(error => {
        this.setState({ modalDeVisible: false });

        this.setState({ modalDelVisible: false });
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

  async unlikePostRequest() {
    let id = this.state.curDeletePost;
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    this.setState({ loading: true });
    let data = JSON.stringify({
      post_id: id,
      user_id: udata.id,

    });
    let headers = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    axios.post(Api.apiUrl + '/thumbsdown-post', data, headers)
      .then(res => {
        this.setState({ modalDeVisible: false });
        this.setState({ loading: false });

        this.getGroupposts();


      }).catch(error => {
        this.setState({ modalDeVisible: false });
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

  closeModal() {
    this.setState({ modalDeVisible: false });
    this.setState({ modalDelVisible: false });
  }

  async LikePost(id, isFor) {

    let udata = JSON.parse(await AsyncStorage.getItem('userData'));



    this.setState({ loading: true });
    let data = JSON.stringify({
      post_id: id,
      user_id: udata.id,
      post_like: isFor,
      isFor: 'like'
    });
    let headers = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    axios.post(Api.apiUrl + '/save-post-likes', data, headers)
      .then(res => {
        this.setState({ loading: false });
        this.getGroupposts();
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

  async SuperLikePost(id, isFor) {
    // alert(isFor);

    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    if (isFor == '1') {
      this.setState({ USuperlike: '1' });
    } else {
      this.setState({ USuperlike: '0' });
    }

    this.setState({ loading: true });
    let data = JSON.stringify({
      post_id: id,
      user_id: udata.id,
      post_like: this.state.USuperlike,
      isFor: 'superlike'
    });

    console.log(data);
    let headers = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    axios.post(Api.apiUrl + '/save-post-likes', data, headers)
      .then(res => {
        this.setState({ loading: false });
        this.getGroupposts();
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
  truncateText = (text, limit) => {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };
  async UNSAFE_componentWillMount() {
    const cat_data = this.props.route.params.category_id;
    let storagegrouppostsData = JSON.parse(await AsyncStorage.getItem('storagegrouppostsData' + cat_data));


    if (storagegrouppostsData != null) {
      this.setState({ grouppostsData: storagegrouppostsData });
    }

  }

  backScreen() {
    this.props.navigation.goBack();

  }

  render() {

    const { itemsData, filterData, grpHeading, loading, grouppostsData, selectedItems, selectedGuru, selectedProfestionValue, stateData
      , cityData, modalVisible, StateitemsData, prfSelctTxt, prfsSelctTxt, CityitemsData, userDetail, SselectedItems, CselectedItems, errMsg, ishowMOdal, Logedudata, modalDeVisible, modalDelVisible } = this.state;

    let pickerItem = [];
    for (var i = 0; i < itemsData.length; i++) {
      pickerItem.push(<Picker.Item fontFamily="abel" label={itemsData[i].name} value={itemsData[i].id} key={i} />);
    }

    // let guruImage = selectedGuru.image_path;
    let guruImage = `${Api.imgaePath}/${selectedGuru.image_path}`;


    const saveLocation = async () => {


      if (SselectedItems == '') {
        this.setState({ errMsg: AlertMessages.stateErr });
        this.setState({ ishowMOdal: true });
        return;
      }

      if (CselectedItems == '') {
        this.setState({ errMsg: AlertMessages.cityErr });
        this.setState({ ishowMOdal: true });
        return;
      }
      this.setState({ modalVisible: false });
      this.state.loading = true;
      let data = JSON.stringify({
        state_id: SselectedItems,
        city_id: CselectedItems,
      });
      const token = await AsyncStorage.getItem('fcmtoken');

      let headers = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authentication': `Bearer ${token}`
        }
      }
      axios.post(Api.apiUrl + '/get-locations-name', data, headers)
        .then(res => {
          this.state.loading = false;
          this.setState({ cityData: res.data.city_data });
          this.setState({ stateData: res.data.state_data });
          AsyncStorage.setItem('postState', JSON.stringify(res.data.state_data));
          AsyncStorage.setItem('postCity', JSON.stringify(res.data.city_data));
          this.getGroupposts();
        })
        .catch(error => { console.log(error); this.state.loading = false; });
    }

    const openLocation = () => {
      console.log(userDetail.user.country_code.split("+")[1])
      this.getStateList(userDetail.user.country_code.split("+")[1]);
      this.getCityList(userDetail.city);

      this.setState({ modalVisible: true });
    }

    const postData = grouppostsData;
    let receiverContentData = [];
    if (postData != null && postData.length == 0) {
      receiverContentData.push(<Text key="norecords" style={styles.searchContentText}>{AlertMessages.postErrMesg}
      </Text>);
    } else {

      for (let i = 0; i < postData.length; i++) {
        let pstUrl = postData[i].post_urls;
        if (pstUrl == null) {
          pstUrl = '';
        }
        let userImg = [];
        if (postData[i].user_detail.user_profile_image != null) {
          userImg.push(<View key={i} style={styles.outerImgSection}><Image

            // source={{ uri: `${postData[i].user_detail.user_profile_image}` }}
            source={{ uri: `${Api.imgaePath}/${postData[i].user_detail.user_profile_image}` }}

            style={styles.imagetopCont}
          /></View>);

        } else {
          userImg.push(<View key={i} style={styles.outerImgSection}><Image

            source={require('../../../assets/images/uphoto.png')}
            style={styles.imagetopCont}
          /></View>);
        }



        let postImg = [];
        if (postData[i].post_image != null) {
          console.log(postData[i].post_image)
          postImg.push(<Image
            key={i}
            // source={{ uri: `${postData[i].post_image.file_name}` }}
            source={{ uri: `${Api.userPostGallery}/${postData[i].post_image.file_name}` }}

            style={styles.imagepostCont}
          />);

        }





        let timeData = postData[i].post_time;

        let Ulike = postData[i].postLike;
        let USuperlike = postData[i].postSuperLike;

        let isSameguru = false;
        if (postData[i].user_detail.guru_id == userDetail.guru_id && (postData[i].user_detail.user_id != userDetail.user_id && userDetail.guru_id != 0)) {
          isSameguru = true;
        }
        console.log("postData[i].post_expire", postData[i])
        let expireText = "";
        if (postData[i].post_expire < 0) {
          expireText = 'Closed ' + (postData[i].post_expire) * -1 + 'd ago';
        } else {
          expireText = 'Closes in ' + postData[i].post_expire + 'd';
        };
        receiverContentData.push(
          <View style={[i == 0 ? styles.textinvalid : styles.mainInnersectiond]} key={i}>

            <View style={styles.mainInnersection} >
              <TouchableOpacity

                activeOpacity={0.5}
                onPress={this.getuserDetail.bind(this, postData[i].user_id)} >
                {userImg}
              </TouchableOpacity>
              <View style={styles.searchMainContentsection} >
                <View style={styles.searchdfContentsection}>
                  <View style={styles.sameguruContSect}><Text style={styles.titleContentText}>{postData[i].user_data.first_name} {postData[i].user_data.last_name}, <Feather
                    name={'star'}
                    size={16}
                    color={AppStyle.appIconColor}

                  /> {postData[i].user_rating}{isSameguru && <Text style={styles.timContentText}>, </Text>}{isSameguru && <Image
                    source={require('../../../assets/images/icons/gurubhai.jpg')}
                    style={styles.sameguruCont}
                  />}</Text></View>
                  <Text style={styles.timContentText}>{postData[i].user_detail.gender}, {postData[i].user_detail.age_group}, {postData[i].city_detail?.name}, {(postData[i]?.state_detail?.state_abbrivation != '' ? postData[i].state_detail?.state_abbrivation : postData[i].state_detail?.name)}</Text>
                  <Text style={styles.timContentText}>{postData[i].user_community?.name}</Text>



                </View>
                {/* {postData[i].user_data.id != Logedudata && postData[i].is_user_unlike == '0' && <TouchableOpacity
                  style={{ marginTop: 5 }}
                  activeOpacity={0.5}
                  onPress={this.openUnlikeModal.bind(this, postData[i].id)} >

                  <Image
                    source={require('../../../assets/images/thumbsdown.jpeg')}
                    style={styles.sameguruCont}
                  />
                </TouchableOpacity>} */}

                {/* {postData[i].user_data.id != Logedudata && postData[i].is_user_unlike == '1' && <TouchableOpacity
                  style={{ marginTop: 5, opacity: 1 }}
                  activeOpacity={0.1}

                >

                  <Image
                    source={require('../../../assets/images/graythumbsdown.jpeg')}
                    style={styles.samedguruCont}
                  />
                </TouchableOpacity>} */}
                {/* {postData[i].user_data.id == Logedudata && <TouchableOpacity
                  style={{ marginTop: 5 }}
                  activeOpacity={0.5}
                  onPress={this.openDeleteModal.bind(this, postData[i].id)} >

                  <FontAwesome5
                    name={'trash'}
                    size={13}
                    color={'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)'}
                  />
                </TouchableOpacity>} */}
              </View>

            </View>
            <TouchableOpacity
              style={styles.buttonStylve}
              activeOpacity={0.5}
              onPress={this.getpostDetail.bind(this, postData[i].id, postData[i].user_id)} >
              <View >
                <View style={styles.searchContentsection}>
                  <View style={styles.searchOuterContentsection}><Text style={styles.searchContenttitleText}>{postData[i]?.group_data?.name}
                  </Text>
                    <Text style={styles.searchContenttitleText}> Posted {timeData} ago | {expireText}
                    </Text>
                  </View>
                  <Text style={styles.searchContentText}>{this.truncateText(postData[i].description, 100)}
                  </Text>

                  {pstUrl != '' && <Text style={styles.cmtCountLink} onPress={() => this.openpstUrl.bind(this, pstUrl)}>{pstUrl}</Text>}
                  <View style={styles.imgOuterSec}>{postImg}</View>
                </View>
              </View>
            </TouchableOpacity>


            <View style={styles.postReviewsSec}>
              <View style={styles.postReviewsInnerSec}>
                <Text style={styles.icnlabl}>Comments</Text>
                <View style={styles.wrapperCustom}>
                  <Feather name="message-square" size={16}
                    color={AppStyle.appIconColor} />
                </View>

                <Text style={styles.cmtCount}>{postData[i].comments_count}</Text>

              </View>
              <View style={styles.postReviewsInnerSec}>
                <Pressable
                  onPress={() => {
                    this.LikePost(postData[i].id, Ulike);
                  }}
                  style={({ pressed }) => [
                    {
                      color: pressed
                        ? 'rgb(210, 230, 255)'
                        : 'white'
                    },
                    styles.wrapperCustom
                  ]}><Text style={styles.icnlabl}>Likes</Text>
                  {Ulike == '1' &&
                    <FontAwesome name="star" size={16}
                      color={AppStyle.appIconColor} />
                  }

                  {Ulike == '0' &&
                    <FontAwesome5 name="star" size={16}
                      color={AppStyle.appIconColor} />

                  }
                </Pressable>

                <Text style={styles.cmtCount}>{postData[i].likes_count}</Text>
              </View>



              <View style={styles.postReviewsInnerSec}>
                <Pressable
                  onPress={() => {
                    this.SuperLikePost(postData[i].id, USuperlike);
                  }}
                  style={({ pressed }) => [
                    {
                      color: pressed
                        ? 'rgb(210, 230, 255)'
                        : 'white'
                    },
                    styles.wrapperCustom
                  ]}><Text style={styles.icnlabl}>Super Likes </Text>
                  {USuperlike == '1' &&
                    <FontAwesome name="heart" size={16}
                      color={AppStyle.appIconColor} />
                  }

                  {USuperlike == '0' &&
                    <FontAwesome5 name="heart" size={16}
                      color={AppStyle.appIconColor} />
                  }
                </Pressable>

                <Text style={styles.cmtCount}>{postData[i].super_likes_count}</Text>
              </View>


            </View>

          </View>);
      }
    }


    return <View style={{ flex: 1, height: '100%', backgroundColor: '#fff' }}><Loader loading={loading} />{ishowMOdal && <UseAlertModal message={errMsg} parentCallback={this.handleCallback} />}<ScrollView showsVerticalScrollIndicator={false}>
      {/* <View style={styles.mainBody}> */}
      <View style={styles.topheadSection}>
        <View>
          <Image
            source={{ uri: guruImage }}
            style={{
              width: '100%',
              height: 300,
              resizeMode: 'cover'
            }}
          />
        </View>



      </View>

      <View style={[styles.mainBodyWithPadding]}>

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

        </View>

        <View style={styles.innermainlayutSection}>


          <Text style={styles.textSubheading}>
            {cityData.name}, {(stateData.state_abbrivation != '' ? stateData.state_abbrivation : stateData.name)}
          </Text>


          <TouchableOpacity
            style={styles.addbuttonsStylve}
            activeOpacity={0.5}
            onPress={openLocation} ><Feather
              name={'edit'}
              size={18}
              color={AppStyle.appIconColor}

            /></TouchableOpacity>

        </View>
        <View style={styles.SectionHeadStyle}>
          <Text style={styles.SectionHedText}>Spiritual Discussions</Text>
          <TouchableOpacity onPress={this.addpostData.bind(this, i)} activeOpacity={0.7}>
            <LinearGradient
              // Button Linear Gradient
              colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
              style={styles.addbuttonStylve}>
              <Feather
                name={'plus'}
                size={24}
                color={AppStyle.fontColor}

              />
            </LinearGradient>
          </TouchableOpacity>


        </View>



        <View style={styles.mainStection}>


          <View style={styles.selectboxContainer}>
            <SectionedMultiSelect
              items={filterData}
              IconRenderer={Icon}
              uniqueKey="id"
              subKey="children"
              selectText={prfSelctTxt}
              showDropDowns={true}
              single={true}
              onSelectedItemsChange={this.onSelectedItemsChange}
              selectedItems={this.state.selectedProfestionValue}
              subItemFontFamily={{ fontFamily: 'Abel' }}
              itemFontFamily={{ fontFamily: 'Abel' }}
              searchTextFontFamily={{ fontFamily: 'Abel' }}
              confirmFontFamily={{ fontFamily: 'Abel' }}
              searchPlaceholderText=""
              colors={{ primary: 'background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)' }}
              showCancelButton={true}
              hideConfirm={true}
              styles={{

                cancelButton: {
                  backgroundColor: 'rgba(253, 139, 48, 0.69)',
                  width: '100%',
                  minWidth: '100%'

                },
                selectToggleText: {
                  fontFamily: 'Abel',
                  color: AppStyle.fontColor,
                  fontSize: 15
                },
                itemText: {
                  fontSize: 16,
                  marginLeft: 15
                },
                item: {
                  marginTop: 10,
                  textAlign: 'center',
                  marginBottom: 10,
                },
                selectToggle: {
                  marginTop: 15
                },
                container: {
                  flex: 0,
                  top: '10%',
                  width: 'auto',
                  height: 450,
                  paddingTop: 10,
                  overflow: 'scroll',
                  paddingBottom: 0,
                }
              }}

            />
            {/*<Text style={[styles.SectionLabel,{width:185}]}>Select Discussion Groups</Text>*/}
          </View>
          {/* <View style={styles.postListSection}>
            <Text style={styles.SectionOntgText}>Latest Discussions
            </Text>
          </View> */}
        </View>
        <View>
          {receiverContentData}

          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}

            onRequestClose={() => {

              this.setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.changecitySection}>
              <Text style={styles.changeHeadtext}>Change Location</Text>
              <View style={styles.selectboxNwContainer}>
                <SectionedMultiSelect
                  items={StateitemsData}
                  IconRenderer={Icon}
                  uniqueKey="id"
                  subKey="children"
                  selectText="Your State..."
                  showDropDowns={true}
                  single={true}
                  onSelectedItemsChange={this.onSSelectedItemsChange}
                  selectedItems={this.state.SselectedItems}
                  subItemFontFamily={{ fontFamily: 'Abel' }}
                  itemFontFamily={{ fontFamily: 'Abel' }}
                  searchTextFontFamily={{ fontFamily: 'Abel' }}
                  confirmFontFamily={{ fontFamily: 'Abel' }}
                  searchPlaceholderText='Search State'
                  colors={{ primary: 'background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)' }}
                  showCancelButton={true}
                  hideConfirm={true}
                  styles={{

                    cancelButton: {
                      backgroundColor: 'rgba(253, 139, 48, 0.69)',
                      width: '100%',
                      minWidth: '100%'

                    },
                    selectToggleText: {
                      fontFamily: 'Abel',
                      fontSize: 15,
                      color: AppStyle.fontColor
                    },
                    itemText: {
                      fontSize: 16,
                      marginLeft: 15
                    },
                    item: {
                      marginTop: 10,
                      textAlign: 'center',
                      marginBottom: 10,
                    },
                    selectToggle: {
                      marginTop: 15
                    },
                    container: {
                      flex: 0,
                      top: '10%',
                      width: 'auto',
                      height: 450,
                      paddingTop: 10,
                      overflow: 'scroll',
                      paddingBottom: 0,
                    }
                  }}
                />
                <Text style={[styles.SectionLabel, { width: 57 }]}>State</Text>
              </View>
              <View style={styles.selectboxNwContainer}>
                <SectionedMultiSelect
                  items={CityitemsData}
                  IconRenderer={Icon}
                  uniqueKey="id"
                  subKey="children"
                  selectText="Your City..."
                  showDropDowns={true}
                  single={true}
                  onSelectedItemsChange={this.onCSelectedItemsChange}
                  selectedItems={this.state.CselectedItems}
                  subItemFontFamily={{ fontFamily: 'Abel' }}
                  itemFontFamily={{ fontFamily: 'Abel' }}
                  searchTextFontFamily={{ fontFamily: 'Abel' }}
                  confirmFontFamily={{ fontFamily: 'Abel' }}
                  searchPlaceholderText='Search City'
                  colors={{ primary: 'background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)' }}
                  hideConfirm={true}
                  showCancelButton={true}
                  styles={{

                    cancelButton: {
                      backgroundColor: 'rgba(253, 139, 48, 0.69)',
                      width: '100%',
                      minWidth: '100%'

                    },
                    selectToggleText: {
                      fontFamily: 'Abel',
                      fontSize: 15,
                      color: AppStyle.fontColor
                    },
                    itemText: {
                      fontSize: 16,
                      marginLeft: 15
                    },
                    item: {
                      marginTop: 10,
                      textAlign: 'center',
                      marginBottom: 10,
                    },
                    selectToggle: {
                      marginTop: 15
                    },
                    container: {
                      flex: 0,
                      top: '10%',
                      width: 'auto',
                      height: 450,
                      paddingTop: 10,
                      overflow: 'scroll',
                      paddingBottom: 0,
                    }
                  }}

                />
                <Text style={[styles.SectionLabel, { width: 47 }]}>City</Text>

              </View>

              <View style={styles.urlbtnSection}>
                <TouchableOpacity
                  onPress={() => {
                    this.setModalVisible();
                  }}
                  activeOpacity={0.8}
                  style={styles.wrapperdOuterCustom}>
                  <View

                    style={styles.wrapperdDCustom}>
                    <Text style={styles.urlcloseButton}>Close</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={saveLocation}
                  activeOpacity={0.8}
                  style={styles.wrapperdOuterCustom}>
                  <LinearGradient
                    // Button Linear Gradient
                    colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
                    style={styles.wrapperdCustom}>
                    <Text style={styles.urladdButton}>Save</Text>
                  </LinearGradient>

                </TouchableOpacity>
              </View>





            </View>

          </Modal>

          <View style={styles.Mdcontainer}>
            <Modal
              animationType={"fade"}
              transparent={true}
              visible={modalDeVisible}
              onRequestClose={() => { }}>
              {/*All views of Modal*/}
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>If you find this content objectionable you can report it to Admin</Text>

                <View style={styles.Btnmodal}>
                  <TouchableOpacity

                    activeOpacity={0.9}
                    onPress={() => {
                      this.closeModal();
                    }} style={styles.buttonOuter}>
                    <View
                      style={styles.buttonCStyle}>
                      <Text style={styles.buttonTextMStyle}>Close</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity

                    activeOpacity={0.9}
                    onPress={() => {
                      this.unlikePostRequest();
                    }}
                    style={styles.buttonOuter}>
                    <LinearGradient
                      // Button Linear Gradient
                      colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
                      style={styles.buttonMStyle}>
                      <Text style={styles.buttonTextMStyle}>Report</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>


              </View>
            </Modal>

            <Modal
              animationType={"fade"}
              transparent={true}
              visible={modalDelVisible}
              onRequestClose={() => { }}>
              {/*All views of Modal*/}
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Are you sure you want to delete this post ?</Text>

                <View style={styles.Btnmodal}>
                  <TouchableOpacity

                    activeOpacity={0.9}
                    onPress={() => {
                      this.closeModal();
                    }} style={styles.buttonOuter}>
                    <View
                      style={styles.buttonCStyle}>
                      <Text style={styles.buttonTextMStyle}>Close</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity

                    activeOpacity={0.9}
                    onPress={() => {
                      this.delePostRequest();
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
      </View>
      {/* </View> */}
    </ScrollView>
      <CookieNavigationScreen navigation={this.props.navigation} />
    </View>

  }
};
export default CommunityBoardScreen;

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
  }, postListSection: {
    marginBottom: 10
  },
  SectionHeadStyle: {
    flexDirection: 'row',
    paddingBottom: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -12
  },
  inputboxContainer: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    borderColor: '#E8E6EA',
    borderWidth: 1,
    borderRadius: 16,
    height: 58,
  },
  selectboxContainer: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    fontFamily: 'Abel',
    borderWidth: 1,
    borderColor: '#E8E6EA',
    borderRadius: 16,
    height: 55,
    marginBottom: 22,
    marginTop: 10,
  },
  SectionLabel: {
    position: 'absolute', top: -10, left: 20, right: 0, bottom: 0,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    height: 25,
    fontFamily: 'Abel',
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 17
  },
  SectionSmallLabel: {
    position: 'absolute', top: -10, left: 20, right: 0, bottom: 0,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    width: 70,
    height: 25,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.4)',
    fontFamily: 'Abel'
  },
  SectionVSmallLabel: {
    position: 'absolute', top: -10, left: 20, right: 0, bottom: 0,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    width: 65,
    height: 25,
    textAlign: 'center',
    fontFamily: 'Abel',
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 18
  },
  SectionHedText: {
    fontSize: AppStyle.aapPageHeadingSize,
    fontFamily: 'GlorySemiBold',
    color: AppStyle.fontColor,
  },
  SectionOntgText: {
    fontSize: 20,
    position: 'relative',
    zIndex: 1, // works on io,
    fontFamily: 'GlorySemiBold',
    marginBottom: 14,
    lineHeight: 26,
    color: AppStyle.fontColor,
  },
  buttonStyle: AppStyle.AppbuttonStyle,
  buttoncloseStyle: {
    width: '40%',
    backgroundColor: "red"
  },
  buttonOuterStyle: {
    width: '40%'
  },
  outerButtonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonTextStyle: {
    color: AppStyle.fontButtonColor,
    fontSize: 18,
    fontSize: AppStyle.buttonFontsize,
    fontFamily: 'GlorySemiBold',
    textTransform: 'uppercase'
  },
  inputStyle: {
    height: 58,
    color: AppStyle.inputBlackcolorText,
    fontSize: 16,
    position: 'relative',
    zIndex: 1, // works on io,
    fontFamily: 'Abel'

  },
  selectStyle: {
    height: 58,
    width: 158,
    color: AppStyle.inputBlackcolorText,
    fontWeight: 'bold',
    fontSize: 14,
    width: '100%',
    fontFamily: 'Abel'
  },

  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  innermainlayutSection: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',

    alignItems: 'center'
  },
  locContetsec: {
    marginTop: 10
  },
  textHeading: {
    color: AppStyle.fontColor,
    fontSize: 25,
    fontFamily: 'GlorySemiBold',
    marginBottom: 10,
  },
  textSubheading: {
    fontFamily: 'Abel',
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 16
  },
  topLocsec: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addpostIcon: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#F9F1EB',
    padding: 10,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50

  },
  locationIcon: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#F9F1EB',
    padding: 10,
    borderRadius: 50,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50

  },
  locaitonDirectionText: {
    color: AppStyle.fontColor,
    fontSize: 14,
    fontFamily: 'Abel',
    marginLeft: 5

  }, mainInnersectiond: {
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 0.6,
    borderColor: AppStyle.gradientColorTwo,
    justifyContent: 'space-between'
  },
  mainInnersection: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',


  },
  searchMainContentsection: {
    flexDirection: 'row',
    flex: 1,

    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  searchContentsection: {
    padding: 4,
    width: '100%'
  },
  searchdfContentsection: {
    padding: 4,
    width: '95%'
  },
  searchOuterContentsection: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  titleContentText: {
    fontSize: 16,
    fontFamily: 'GlorySemiBold',
    color: AppStyle.fontColor,
    lineHeight: 20
  },
  searchContenttitleText: {
    fontSize: 12,
    fontFamily: 'GlorySemiBold',
    fontWeight: '400',

    lineHeight: 22,
    color: AppStyle.fontColor,
    flexShrink: 1
  },
  searchContentText: {
    fontSize: 15,
    color: AppStyle.fontColor,
    fontFamily: 'Abel',
    textTransform: 'capitalize',
    lineHeight: 24,
  },
  timContentText: {
    color: '#AAA6B9',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Abel'
  },
  ratingMainSection: {
    flexDirection: 'row'
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center'
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
    marginBottom: 5,
    textAlign: 'center',

  },
  imagetopCont: {
    width: 54,
    height: 54,
    borderRadius: 108,
    marginTop: 0.8,
  },
  imagepostCont: {
    resizeMode: 'contain',
    height: 150,
    width: '100%',
    borderWidth: 1,
    borderColor: AppStyle.appIconColor,
    borderRadius: 10,
  },
  imgOuterSec: {
    marginTop: 5
  },
  changecitySection: {
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center'
  },
  selectboxNwContainer: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    fontFamily: 'Abel',
    borderWidth: 1,
    borderColor: '#E8E6EA',
    borderRadius: 16,
    height: 55,
    marginBottom: 22,
    width: '100%'
  },
  changeHeadtext: {
    fontSize: 26,
    fontFamily: 'GlorySemiBold',
    color: AppStyle.fontColor,
    marginBottom: 25
  },
  addbuttonStylve: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 12,
    borderColor: AppStyle.gradientColorOne,
    backgroundColor: AppStyle.gradientColorOne
  },
  addbuttonsStylve: {
    marginLeft: 5,
    padding: 8,

  },
  cmtCountLink: {
    color: 'blue',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Abel'
  },
  urlbtnSection: {
    flexDirection: 'row',
    marginTop: 15
  },
  urlcloseButton: {
    color: AppStyle.fontColor,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'GlorySemiBold',
    padding: 15
  },
  urladdButton: {
    color: AppStyle.fontButtonColor,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'GlorySemiBold',
    padding: 15
  },
  wrapperdOuterCustom: {
    width: '48%',
    padding: 10,
  },
  wrapperdCustom: {

    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 0
  },
  wrapperdDCustom: {
    backgroundColor: AppStyle.btnbackgroundColor,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 0
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
    paddingRight: 25,
    alignItems: 'center'
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
    textTransform: 'capitalize',
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
    width: '85%',
    marginLeft: 10
  },
  buttonCStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 15,
    width: '85%',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: AppStyle.appIconColor
  },
  postReviewsSec: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 5

  },
  postReviewsInnerSec: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  wrapperCustom: {
    flexDirection: 'row',
    padding: 5,
  },
  cmtCount: {
    color: '#FF9228',
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Abel'
  },
  icnlabl: {
    color: AppStyle.fontColor,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Abel',
    marginRight: 5
  },
  sameguruContSect: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start'
  },
  sameguruCont: {
    width: AppStyle.sameGuruImgWidth,
    height: AppStyle.sameGuruImgHeight,
    resizeMode: 'contain',
  },
  samedguruCont: {
    width: AppStyle.sameGuruImgWidth,
    height: AppStyle.sameGuruImgHeight,
    resizeMode: 'contain',
    opacity: 1
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
  mainBodyWithPadding: {
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
});
