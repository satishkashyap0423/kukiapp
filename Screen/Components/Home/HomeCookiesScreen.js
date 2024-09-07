// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/
// Import React and Component
import React, { useState, Component } from "react";
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
  Pressable,
  Share,
  TouchableHighlight,
  KeyboardAvoidingView,
  Modal,
  Dimensions,
  PixelRatio
} from "react-native";
import AppStyle from "../../Constants/AppStyle.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CookieNavigationScreen from "../Common/CookieNavigationScreen";
import Headright from "../Common/Headright";
import axios from "axios";
import Api from "../../Constants/Api.js";
import Loader from "../Loader";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AlertMessages from "../../Constants/AlertMessages.js";
import UseAlertModal from "../Common/UseAlertModal";
import { FontAwesome } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
const { width: screenWidth } = Dimensions.get('window');
const scale = screenWidth / 375; // Assume 375 is the baseline screen width (e.g., iPhone 6/7/8)
const normalize = (size) => {
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};
class HomeCookiesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: {},
      userData: {},
      userBio: "",
      loading: false,
      cookieData: [],
      eventInviateData: [],
      gmCookie: "",
      modalVisible: false,
      errMsg: "Error",
      ishowMOdal: false,
      notiCount: 0,
      searchUserResults: [],
    };

    AsyncStorage.setItem("activeClass", "CactiveClass");
  }

  async getUserData() {
    const fcmtoken = Api.fcmToken;
    console.log("new token is ", fcmtoken);
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({ loading: true });
    let data = JSON.stringify({
      user_id: udata.id,
      device_token: fcmtoken,
    });
    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    console.log("get data---- " + data);
    axios
      .post(Api.apiUrl + "/get-user-detail", data, headers)
      .then((res) => {
        console.log("get data---- ", res.data);
        console.log("get data---- ", res.data.status);
        console.log("get data---- ", res.data.data);
        this.setState({ loading: false });
        if (res.data.status == "true") {
          this.setState({ userBio: res.data.data.user_detail.user_status });
          AsyncStorage.setItem(
            "storagereStatusdata",
            JSON.stringify(res.data.data.user_detail.user_status)
          );
          this.setState({ userDetail: res.data.data.user_detail });
          //AsyncStorage.setItem('userDetailsData',JSON.stringify(res.data.user_detail));
          this.setState({ userData: res.data.data.user_detail.user });
          this.setState({ gmCookie: res.data.data.gmCookie });
          this.setState({ notiCount: res.data.data.notiCount });
          let count = res.data.data.notiCount;
          AsyncStorage.setItem("notiCount", count.toString());
        } else {
          this.setState({ errMsg: AlertMessages.accountSuspendErr });
          this.setState({ ishowMOdal: true });

          this.state.loading = false;
          AsyncStorage.clear();

          setTimeout(
            function () {
              this.props.navigation.replace("LoginNavigationStack");
            }.bind(this),
            3000
          );
        }
      })
      .catch((error) => {
        if (error.toJSON().message === "Network Error") {
          this.setState({ errMsg: AlertMessages.noInternetErr });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        } else {
          console.log("get user data error--- ", error.toJSON().message);
          this.setState({ errMsg: error.toJSON().message });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        }
      });
  }

  async getgmCookieData() {
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({ loading: true });
    let data = JSON.stringify({
      user_id: udata.id,
    });
    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios
      .post(Api.apiUrl + "/get-gm-cookie", data, headers)
      .then((res) => {
        console.log("kuki data --- ", res.data);
        this.setState({ loading: false });
        if (res.data.status == "true") {
          this.setState({ gmCookie: res.data.gmCookie });
        }
      })
      .catch((error) => {
        if (error.toJSON().message === "Network Error") {
          this.setState({ errMsg: AlertMessages.noInternetErr });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        } else {
          console.log("kuki data error--- ", error.toJSON().message);
          this.setState({ errMsg: error.toJSON().message });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        }
      });
  }

  openCookie = async (val, fuser, isFor) => {
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({ loading: true });
    let data = JSON.stringify({
      cookie_id: val,
      tuser_id: fuser,
      fuser_id: udata.id,
      isFor: isFor,
    });
    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    axios
      .post(Api.apiUrl + "/open-cookie", data, headers)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data.status == "true") {
          this.props.navigation.push("CookiesDetail", {
            user_id: fuser,
            isFrom: 2,
          });
          // this.props.navigation.push('OpenCookiesScreen',{cookieRecords : JSON.stringify(res.data.data)});
        } else {
          console.log(error);
        }
      })
      .catch((error) => {
        if (error.toJSON().message === "Network Error") {
          this.setState({ errMsg: AlertMessages.noInternetErr });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        } else {
          console.log("open kuki data error--- ", error.toJSON().message);
          this.setState({ errMsg: error.toJSON().message });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        }
      });
  };

  async getCookieData() {
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({ loading: true });
    let data = JSON.stringify({
      user_id: udata.id,
      top_five: "1",
    });
    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios
      .post(Api.apiUrl + "/received-cookie-record", data, headers)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data.status == "true") {
          //console.log(res.data.fuser_detail);
          this.setState({ cookieData: res.data.data });
          AsyncStorage.setItem(
            "storagerecKukiData",
            JSON.stringify(res.data.data)
          );
        } else {
          console.log(error);
          this.state.loading = false;
        }
      })
      .catch((error) => {
        if (error.toJSON().message === "Network Error") {
          this.setState({ errMsg: AlertMessages.noInternetErr });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        } else {
          console.log("received kuki data error--- ", error.toJSON().message);
          this.setState({ errMsg: error.toJSON().message });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        }
      });
  }
  async getEventInvites() {
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({ loading: true });
    let data = JSON.stringify({
      user_id: udata.id,
    });
    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios
      .post(Api.apiUrl + "/get-event-invite", data, headers)
      .then((res) => {
        this.setState({ loading: false });

        if (res.data.status == "true") {
          this.setState({ eventInviateData: res.data.data });
          AsyncStorage.setItem(
            "storageeventInviateData",
            JSON.stringify(res.data.data)
          );
        }
      })
      .catch((error) => {
        if (error.toJSON().message === "Network Error") {
          this.setState({ errMsg: AlertMessages.noInternetErr });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        } else {
          console.log("get invites data error--- ", error.toJSON().message);
          this.setState({ errMsg: error.toJSON().message });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        }
      });
  }

  openEvent(eventId) {
    this.props.navigation.push("EventDetailScreen", {
      event_id: eventId,
      is_back: "1",
    });
  }

  getRandomUserList = async () => {
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    let data = JSON.stringify({
      name: "",
      gender: "",
      communities_id: "",
      city: "",
      state: "",
      search_type: 1,
      age_group: "",
      user_id: "",
      distance: "",
      user_id: udata.id,
    });

    console.log(data)
    const token = await AsyncStorage.getItem("fcmtoken");
    // console.log(data);
    //return;
    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authentication: `Bearer ${token}`,
      },
    };
    axios
      .post(Api.apiUrl + "/random_users", data, headers)
      .then((res) => {
        this.setState({ loading: false });
        console.log(res.data.data);
        this.setState({
          searchUserResults: res.data.data,
        });
        // this.props.navigation.push('SearchResultScreen',{searchRecords : JSON.stringify(res.data.data),searchData : JSON.stringify(data)});
      })
      .catch((error) => {
        if (error.toJSON().message === "Network Error") {
          this.setState({ errMsg: AlertMessages.noInternetErr });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        } else {
          this.setState({ errMsg: error.toJSON().message });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        }
      });
  };

  async componentDidMount() {
    this.getUserData();
    this.getCookieData();
    this.getEventInvites();
    // this.getgmCookieData();
    this.getRandomUserList();

    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.getCookieData();
      this.getUserData();
      this.getEventInvites();
      this.getRandomUserList();
      //Put your Data loading function here instead of my this.loadData()
    });
  }

  async UNSAFE_componentWillMount() {
    let storagereStatusdata = JSON.parse(
      await AsyncStorage.getItem("storagereStatusdata")
    );

    if (storagereStatusdata != null) {
      this.setState({ userBio: storagereStatusdata });
    }
    let storageInviteData = JSON.parse(
      await AsyncStorage.getItem("storageeventInviateData")
    );

    if (storageInviteData != null) {
      this.setState({ eventInviateData: storageInviteData });
    }

    let storageKukiData = JSON.parse(
      await AsyncStorage.getItem("storagerecKukiData")
    );

    if (storageKukiData != null) {
      this.setState({ cookieData: storageKukiData });
    }
  }
  getuserDetail() {
    this.props.navigation.push("EditUserDetailScreen");
  }

  getRecDetail = (i) => {
    this.props.navigation.push("CookiesDetail", { user_id: i, isFrom: 2 });
  };

  handleCallback = (childData) => {
    this.setState({ ishowMOdal: childData });
  };

  searchRecords = async (data) => {
    this.setState({ loading: true });
    let searchType = 1;

    const token = await AsyncStorage.getItem("fcmtoken");
    // console.log(data);
    //return;
    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authentication: `Bearer ${token}`,
      },
    };
    axios
      .post(Api.apiUrl + "/random_users", data, headers)
      .then((res) => {
        console.log(res.data.data);
        this.setState({ loading: false });
        this.setState({ searchUserResults: res.data.data });
      })
      .catch((error) => {
        if (error.toJSON().message === "Network Error") {
          this.setState({ errMsg: AlertMessages.noInternetErr });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        } else {
          this.setState({ errMsg: error.toJSON().message });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        }
      });

    //
  };

  sendCookie = async (val, isSe, i, isNewcookieStat, fName, lName) => {
    if (isSe == 0) {
      this.setState({ errMsg: AlertMessages.waitKukiErr });
      this.setState({ ishowMOdal: true });

      return;
    }
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({ loading: true });
    let data = JSON.stringify({
      from_user_id: udata.id,
      to_user_id: val,
      isFor: "kuki",
    });
    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    //this.setState({loading:false});
    //return;
    axios
      .post(Api.apiUrl + "/send-cookie", data, headers)
      .then((res) => {
        console.log(res);
        this.setState({ loading: false });
        if (res.data.status == "true") {
          this.setState({
            errMsg: AlertMessages.sendKukiMsg + " to \n" + fName + " " + lName,
          });
          this.setState({ ishowMOdal: true });
          /*let search_data = this.state.searchData;
          if(isNewcookieStat == 1){
             search_data[i].isCookieStat = 0;
          }*/
          // let sData = this.props.route.params.searchData;
          // let searchD_data = JSON.parse(sData);
          this.getRandomUserList();
          // this.searchRecords(this.state.searchUserResults);

          //this.setState({searchData:search_data});
          //this.props.navigation.push('SentCookiesScreen');
        } else if (res.data.status == "falses") {
          this.setState({ errMsg: res.data.message });
          this.setState({ ishowMOdal: true });
        } else {
          this.setState({ errMsg: AlertMessages.lessKukiMsg });
          this.setState({ ishowMOdal: true });
        }
      })
      .catch((error) => {
        if (error.toJSON().message === "Network Error") {
          this.setState({ errMsg: AlertMessages.noInternetErr });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        } else {
          this.setState({ errMsg: error.toJSON().message });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        }
      });
  };
  render() {
    const {
      userDetail,
      loading,
      userData,
      cookieData,
      gmCookie,
      userBio,
      modalVisible,
      errMsg,
      ishowMOdal,
      notiCount,
      eventInviateData,
    } = this.state;

    const onShare = async () => {
      this.setState({ loading: true });
      try {
        const result = await Share.share({
          message: gmCookie,
        });

        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
            this.setState({ loading: false });
          } else {
            this.setState({ loading: false });
          }
        } else if (result.action === Share.dismissedAction) {
          this.setState({ loading: false });
        }
      } catch (error) {
        this.setState({ errMsg: error.toJSON().message });
        this.setState({ ishowMOdal: true });
        this.setState({ loading: false });
      }
    };
    let userImg = [];
    if (userDetail.user_profile_image != null) {
      userImg.push(
        <View style={styles.outerImgHmSection} key={"user_img"}>
          <Image
            source={{ uri: `${userDetail.user_profile_image}` }}
            style={styles.imagetopCont}
          />
        </View>
      );
    } else {
      userImg.push(
        <View
          style={styles.outerImgHmSection}
          key={userDetail.user_id + "_imgf"}
        >
          <Image
            source={require("../../../assets/images/uphoto.png")}
            style={styles.imagetopCont}
          />
        </View>
      );
    }
    let inviteDataRecords = [];
    if (eventInviateData.length > 0) {
      for (let i = 0; i < eventInviateData.length; i++) {
        if (eventInviateData[i].event_data.event_month != undefined) {
          let evtHead = eventInviateData[i].event_data.event_heading;

          if (evtHead.length > 25) {
            evtHead =
              eventInviateData[i].event_data.event_heading.substring(0, 25) +
              "...";
          }

          let evtAddr = eventInviateData[i].event_data.address;

          if (evtAddr.length > 50) {
            evtAddr =
              eventInviateData[i].event_data.address.substring(0, 50) + "...";
          }

          let event_description =
            eventInviateData[i].event_data.event_description.substring(0, 55) +
            "...";
          inviteDataRecords.push(
            <View key={i} style={styles.eventInviteSec}>
              <TouchableOpacity
                key={i + "crb"}
                onPress={this.openEvent.bind(
                  this,
                  eventInviateData[i].event_id
                )}
                style={[
                  i == 0
                    ? styles.eventInviteinnerSecWB
                    : styles.eventInviteinnerSec,
                ]}
              >
                <View style={styles.eventLefouterImgHmSection}>
                  <View style={styles.eventInviteinnerSecLeft}>
                    <Text style={styles.eventDateText}>
                      {eventInviateData[i].event_data.event_month}
                    </Text>
                    <Text style={styles.eventDateText}>
                      {eventInviateData[i].event_data.event_day}
                    </Text>
                  </View>
                </View>

                <View style={styles.eventInviteinnerSecRight}>
                  <Text style={styles.eventTtileText}>{evtHead}</Text>
                  {/*<Text style={styles.eventDescText}>{event_description}</Text>*/}
                  {/*<View style={{flexDirection:'row',flexShrink:1}}><Text style={styles.eventAddText}>{evtAddr}</Text>*/}
                  <View style={styles.topevetHeadR}>
                    <Text style={styles.eventContentTxt}>
                      From {eventInviateData[i].start_time} To{" "}
                      {eventInviateData[i].end_time}
                    </Text>

                    <Text style={styles.eventContentTxt}>
                      {eventInviateData[i]?.event_city},{" "}
                      {eventInviateData[i]?.event_state}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        }
      }
    } else {
      inviteDataRecords.push(
        <View key="nor_eve" style={styles.eventRecs}>
          <Text style={styles.searchContentTextBold}>No invites found</Text>
        </View>
      );
    }

    let search_data = cookieData;
    let receiveContentData = [];

    if (search_data.length > 0) {
      for (let i = 0; i < search_data.length; i++) {
        let ratingData = [];
        let ratingNoData = [];
        if (search_data[i].rating != null) {
          let userRating = search_data[i].rating;

          for (var l = 0; l < userRating; l++) {
            ratingData.push(
              <Image
                key={l + "r"}
                source={require("../../../assets/images/icons/star.png")}
                style={{
                  width: 18,
                  resizeMode: "contain",
                }}
              />
            );
          }

          for (var k = 0; k < 5 - userRating; k++) {
            ratingNoData.push(
              <Image
                key={k + "rk"}
                source={require("../../../assets/images/icons/starn.png")}
                style={{
                  width: 18,
                  resizeMode: "contain",
                }}
              />
            );
          }
        } else {
          for (var k = 0; k < 5; k++) {
            ratingNoData.push(
              <Image
                key={k + "rrt"}
                source={require("../../../assets/images/icons/starn.png")}
                style={{
                  width: 18,
                  resizeMode: "contain",
                }}
              />
            );
          }
        }

        let ruserImg = [];
        if (search_data[i].fuser_detail.user_profile_image != null) {
          ruserImg.push(
            <View style={styles.outerImgSection} key={i + "dpfr"}>
              <Image
                source={{
                  uri: `${Api.imgaePath}${search_data[i].fuser_detail.user_profile_image}`,
                }}
                style={styles.imagetopCont}
              />
            </View>
          );
        } else {
          ruserImg.push(
            <View style={styles.outerImgSection} key={i + "pbr"}>
              <Image
                source={require("../../../assets/images/uphoto.png")}
                style={styles.imagetopCont}
              />
            </View>
          );
        }

        let cookieImg = [];
        let CookieEnabled = true;
        let letisffR = 0;
        if (
          search_data[i].cookie_status != 1 &&
          search_data[i].cookies_n_data != ""
        ) {
          let letisffR = 0;
          cookieImg.push(
            <TouchableOpacity
              key={i + "crb"}
              onPress={this.openCookie.bind(
                this,
                search_data[i].cookies_n_data,
                search_data[i].from_user_id,
                0
              )}
              style={styles.innerSection}
            >
              <Image
                source={require("../../../assets/images/cookie.png")}
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: "contain",
                  marginLeft: 15,
                }}
              />
            </TouchableOpacity>
          );
        } else {
          let letisffR = 1;
          cookieImg.push(
            <TouchableOpacity
              key={i + "crmr"}
              onPress={this.openCookie.bind(
                this,
                search_data[i].cookies_data,
                search_data[i].from_user_id,
                1
              )}
              style={styles.innerSection}
            >
              <Image
                key={search_data[i].fuser.id}
                source={require("../../../assets/images/gray_cookie.png")}
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: "contain",
                  marginLeft: 15,
                }}
              />
            </TouchableOpacity>
          );
          CookieEnabled = false;
        }

        let isSameguru = false;
        if (
          search_data[i].fuser_detail.guru_id == userDetail.guru_id &&
          userDetail.guru_id != 0
        ) {
          isSameguru = true;
        }

        receiveContentData.push(
          <TouchableOpacity
            style={[
              i == 0 ? styles.mainInnersectionNob : styles.mainInnersection,
            ]}
            key={i + "mlr"}
            activeOpacity={0.8}
            onPress={this.openCookie.bind(
              this,
              search_data[i].cookies_n_data,
              search_data[i].from_user_id,
              letisffR
            )}
          >
            {ruserImg}
            <View style={styles.searchMainContentsection}>
              <View style={styles.searchContentsection}>
                <View style={styles.sameguruContSect}>
                  <Text style={styles.searchContentTextBold}>
                    {search_data[i].fuser.first_name}{" "}
                    {search_data[i].fuser.last_name},{" "}
                    <Feather
                      name={"star"}
                      size={16}
                      color={AppStyle.appIconColor}
                    />{" "}
                    {search_data[i].user_rating}
                    {isSameguru && (
                      <Text style={styles.searchContentTextBold}>, </Text>
                    )}
                    {isSameguru && (
                      <Image
                        source={require("../../../assets/images/icons/gurubhai.jpg")}
                        style={styles.sameguruCont}
                      />
                    )}
                  </Text>
                </View>
                <Text style={styles.searchContentText}>
                  {search_data[i].fuser_detail.gender},{" "}
                  {search_data[i].fuser_detail.age_group},{" "}
                  {search_data[i].city_data?.name},{" "}
                  {search_data[i].state_data?.state_abbrivation != ""
                    ? search_data[i].state_data?.state_abbrivation
                    : search_data[i].state_data?.name}
                </Text>

                <Text style={styles.searchContentText}>
                  {search_data[i].community_data.name}
                </Text>

                {/*<View style={styles.ratingMainSection}><Text style={styles.searchContentTextBold}>Trust Rating....</Text>
                        <View style={styles.ratingSection}>
                           {ratingData}
                           {ratingNoData}
                        </View>
                        </View>*/}
              </View>
              {/*<View searchImgsection>{cookieImg}</View>
                      {CookieEnabled && <Text style={styles.cookieCount}>{search_data[i].total}</Text>}
                      {!CookieEnabled && <Text style={styles.cookiegCount}>{search_data[i].total}</Text>} */}
            </View>
          </TouchableOpacity>
        );
      }
    } else {
      receiveContentData.push(
        <Text style={styles.nosearchContentText} key="tefsb">
          {AlertMessages.receivedErrmsg}
        </Text>
      );
    }

    const openStatusModal = async () => {
      this.setState({ modalVisible: true });
    };
    const handleSubmitPress = async () => {
      let udata = JSON.parse(await AsyncStorage.getItem("userData"));
      this.setState({ loading: true });
      let data = JSON.stringify({
        user_id: udata.id,
        user_status: userBio,
      });
      let formData = new FormData();
      formData.append("user_id", udata.id);
      formData.append("user_status", userBio);
      let headers = {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          enctype: "multipart/form-data",
        },
      };
      axios
        .post(Api.apiUrl + "/update-user-status", formData, headers)
        .then((res) => {
          /*this.setState({errMsg:AlertMessages.statusMessage});
        this.setState({ishowMOdal:true});*/
          this.setState({ loading: false });
          this.setState({ modalVisible: false });
        })
        .catch((error) => {
          this.setState({ modalVisible: false });
          if (error.toJSON().message === "Network Error") {
            this.setState({ errMsg: AlertMessages.noInternetErr });
            this.setState({ ishowMOdal: true });
            this.setState({ loading: false });
          } else {
            this.setState({ errMsg: error.toJSON().message });
            this.setState({ ishowMOdal: true });
            this.setState({ loading: false });
          }
        });
    };

    let cls = "";
    if (Platform.OS === "ios") {
      cls = "iosModal";
    }
    let search_data_data = this.state.searchUserResults;
    let searchContentData = [];
    if (search_data_data?.length > 0) {
      for (let i = 0; i < search_data_data.length; i++) {
        let isSameguru = false;
        if (
          userDetail.guru_id == search_data_data[i].guru_id &&
          userDetail.guru_id != 0
        ) {
          isSameguru = true;
        }
        let userImg = [];
        if (search_data_data[i].user_profile_image != null) {
          userImg.push(
            <View
              style={[styles.outerImgSection, {
                marginRight:0
              }]}
              key={search_data_data[i].id + "_img"}
            >
              <Image
                source={{ uri: `${Api.imgaePath}/${search_data_data[i].user_profile_image}` }}
                // source={{ uri: `${search_data_data[i].user_profile_image}` }}
                style={styles.imagetopCont}
              />
            </View>
          );
        } else {
          userImg.push(
            <View style={styles.outerImgSection} key={"1_imgg"}>
              <Image
                source={require("../../../assets/images/uphoto.png")}
                style={styles.imagetopCont}
              />
            </View>
          );
        }

        let userRating = search_data_data[i].rating;
        let uRate =
          Math.round((parseFloat(userRating) + Number.EPSILON) * 100) / 100;

        uRate = uRate.toFixed(1);
        if (userRating == null) {
          uRate = "0.0";
        }

        let ratingData = [];
        //console.log(userRating);
        for (var l = 0; l < userRating; l++) {
          ratingData.push(
            <Image
              key={l}
              source={require("../../../assets/images/icons/star.png")}
              style={{
                width: 18,
                resizeMode: "contain",
              }}
            />
          );
        }
        let ratingNoData = [];
        for (var k = 0; k < 5 - userRating; k++) {
          ratingNoData.push(
            <Image
              key={k}
              source={require("../../../assets/images/icons/starn.png")}
              style={{
                width: 18,
                resizeMode: "contain",
              }}
            />
          );
        }
        let ckImg = [];
        if (search_data_data[i].isCookieStat == "1") {
          ckImg.push(
            <TouchableOpacity
              onPress={this.sendCookie.bind(
                this,
                search_data_data[i].user_id,
                1,
                i,
                search_data_data[i].isNewcookieStat,
                search_data_data[i].first_name,
                search_data_data[i].last_name
              )}
            >
              <Image
                source={require("../../../assets/images/icons/yellowcookie.png")}
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
          );
        } else {
          ckImg.push(
            <TouchableOpacity
              onPress={this.sendCookie.bind(
                this,
                search_data_data[i].user_id,
                0,
                i,
                search_data_data[i].isNewcookieStat,
                search_data_data[i].first_name,
                search_data_data[i].last_name
              )}
            >
              <Image
                source={require("../../../assets/images/yellokuki.jpeg")}
                style={{
                  width: 25,
                  height: 25,

                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>
          );
        }

        if (search_data_data[i].is_blocked == "1") {
          ckImg = [];
          ckImg.push(
            <TouchableOpacity
              key={search_data_data[i].user_id}
              onPress={this.alertBlockMessg.bind(this)}
            >
              <Image
                key={search_data_data[i].user_id}
                source={require("../../../assets/images/graykuki.jpeg")}
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: "contain",
                  marginBottom: 5,
                }}
              />
            </TouchableOpacity>
          );
        }
        if (
          search_data_data[i].is_same_blocked == "1" &&
          search_data_data[i].is_blocked == "0"
        ) {
          ckImg = [];
          ckImg.push(
            <TouchableOpacity key={search_data[i].user_id}>
              <Image
                key={search_data_data[i].user_id}
                source={require("../../../assets/images/graykuki.jpeg")}
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: "contain",
                  marginBottom: 5,
                }}
              />
            </TouchableOpacity>
          );
        }

        searchContentData.push(
          <TouchableOpacity
            activeOpacity={0.6}
            style={[
              i == 0 ? styles.mainInnersectionNob : styles.mainInnersection,
              styles.buttonStyle,
            ]}
            key={i}
            onPress={this.getuserDetail.bind(
              this,
              search_data_data[i].user_id,
              1
            )}
          >
            {userImg}
            <View style={styles.searchMainContentsection}>
              <View
                style={[
                  styles.searchContentsection,
                  {
                    paddingLeft: 10,
                  },
                ]}
              >
                <View style={styles.samegurusect}>
                  <Text style={styles.searchContentTextBold}>
                    {search_data_data[i].first_name}{" "}
                    {search_data_data[i].last_name},{" "}
                    <Feather
                      name={"star"}
                      size={16}
                      color={AppStyle.appIconColor}
                    />{" "}
                    {uRate}
                    {isSameguru && (
                      <Text style={styles.searchContentText}>, </Text>
                    )}
                    {isSameguru && (
                      <Image
                        source={require("../../../assets/images/icons/gurubhai.jpg")}
                        style={styles.sameguruCont}
                      />
                    )}
                  </Text>
                </View>
                <Text style={styles.searchContentText}>
                  {search_data_data[i].gender}, {search_data_data[i].age_group},{" "}
                  {search_data_data[i].city_data.name},{" "}
                  {search_data_data[i].state_data.state_abbrivation != ""
                    ? search_data_data[i].state_data.state_abbrivation
                    : search_data_data[i].state_data.name}
                </Text>
                <Text style={styles.searchContentText}>
                  {search_data_data[i].community_data.name}
                </Text>
              </View>

              {ckImg}
            </View>
          </TouchableOpacity>
        );
      }
    } else {
      searchContentData.push(
        <Text style={styles.SectionNoRecordStyle} key="5">
          {AlertMessages.searchErrmsg}
        </Text>
      );
    }
    return (
      <View style={{ flex: 1, height: "100%" }}>
        <Loader loading={loading} />
        {ishowMOdal && (
          <UseAlertModal
            message={errMsg}
            parentCallback={this.handleCallback}
          />
        )}
        <ScrollView
          style={{ backgroundColor: "#fff", height: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainBody}>
            <View style={styles.OuterMainQuote}>
              <View style={styles.statSection}>
                <Text style={[styles.StatusText, { width: 88 }]}>
                  Your Prayer
                </Text>
                <TouchableOpacity activeOpacity={0.9} onPress={openStatusModal}>
                  <Text style={[styles.inputStyle, {
                    padding: 10
                  }]}>{userBio}</Text>

                  <View style={styles.btnCont}>
                    <Feather
                      name={"edit"}
                      size={18}
                      color={AppStyle.appIconColor}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {/* <View
        style={styles.MainQuoteSec}>

                 <View style={[styles.innerRightpro,{width:114}]}>
                    <Text style={styles.ContentHeadStyle}>Today's Kuki</Text>
                 </View>
                
              
              
                 <Text style={styles.MqsTextSec}>
                    "{gmCookie}"
                 </Text>
                 
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
              </View> */}
            </View>
            <View style={styles.EventInviteCookie}>
              <Text style={[styles.receivedCookieText, { width: 100 }]}>
                Event Invites
              </Text>
              <View style={styles.EventInviteDeSec}>{inviteDataRecords}</View>
            </View>

            <View
              style={[
                styles.receivedCookie,
                {
                  marginBottom: 10,
                  paddingVertical:8,
                  paddingLeft:15,
                  paddingRight:15
                },
              ]}
            >
              <Text style={[styles.receivedCookieText, { width: 122,  fontSize: 14 }]}>
                Received Kukies
              </Text>
              {receiveContentData}
            </View>

            <View style={[styles.receivedCookie, {
              paddingLeft:5,
              paddingRight:5
            }]}>
              <Text style={[styles.receivedCookieText, {
                 width: 90, // Adjust width using normalize function
                 paddingLeft: 10, // Adjust paddingLeft using normalize function
                 paddingRight: 0, // Adjust paddingRight using normalize function
                 left: 15, // Adjust left position using normalize function
                 fontSize: 14, // Adjust font size using normalize function
              }]}>
                Send Kukies
              </Text>
              {searchContentData}
            </View>
          </View>
        </ScrollView>
        <CookieNavigationScreen navigation={this.props.navigation} />
        <View style={styles.Mdcontainer}>
          <Modal
            animationType={"fade"}
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              console.log("Modal has been closed.");
            }}
          >
            {/*All views of Modal*/}
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Update Your Prayer</Text>
              <TextInput
                style={styles.inputStyleBox}
                onChangeText={(text) => this.setState({ userBio: text })}
                placeholder="Status" //dummy@abc.com
                placeholderTextColor="#000"
                returnKeyType="done"
                maxLength={100}
                multiline={true}
                onSubmitEditing={Keyboard.dismiss}
                value={userBio}
              />
              <View style={styles.Btnmodal}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    this.setState({ modalVisible: false });
                  }}
                  style={styles.buttonOuter}
                >
                  <View style={styles.buttonCStyle}>
                    <Text style={styles.buttonTextStyle}>Close</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={handleSubmitPress}
                  style={styles.buttonOuter}
                >
                  <LinearGradient
                    // Button Linear Gradient
                    colors={[
                      AppStyle.gradientColorOne,
                      AppStyle.gradientColorTwo,
                    ]}
                    style={styles.buttonCStyle}
                  >
                    <Text style={styles.buttonTextStyle}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/*Button will change state to true and view will re-render*/}
        </View>
      </View>
    );
  }
}
export default HomeCookiesScreen;
const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: AppStyle.appColor,
    paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
    paddingBottom: AppStyle.appInnerBottomPadding,
    // paddingTop: AppStyle.appInnerTopPadding,
    height: "100%",
  },
  OuterMainQuote: {},
  ProfilePic: {
    flexDirection: "row",
    alignItems: "flex-end",
    zIndex: 2,
    paddingLeft: 15,
  },
  innerRightpro: {
    marginTop: -22,
    height: 40,
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    left: 0,
  },
  ContentHeadStyle: {
    fontSize: 20,
    fontFamily: "GlorySemiBold",
    fontWeight: "300",
    lineHeight: 45,
    color: AppStyle.fontColor,
    textAlign: "left",
  },
  ContentInnrtStyle: {
    color: AppStyle.fontColor,
    fontSize: 18,
    fontFamily: "GlorySemiBold",
  },
  ArrowTop: {
    width: 40,
    height: 20,
    borderColor: "#ffffff",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    marginLeft: 20,
    transform: [{ rotate: "25.9deg" }],
    zIndex: 2,
    backgroundColor: "#FF9228",
  },
  MainQuoteSec: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: AppStyle.appIconColor,
    paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
    paddingBottom: 20,
    marginTop: 15,
    marginBottom: 20,
  },
  MqsTextSec: {
    fontSize: 17,
    fontFamily: "Abel",
    fontWeight: "400",
    lineHeight: 26,
    color: AppStyle.fontColor,
    textAlign: "left",
    marginTop: 10,
    width: "100%",
  },
  SocialMediaSec: {
    textAlign: "center",
    width: "100%",
    justifyContent: "space-between",

    marginTop: 10,
  },
  TextHeading: {
    marginTop: -23,
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
    paddingLeft: 60,
    paddingRight: 60,
  },
  ShareText: {
    backgroundColor: "#ffffff",
    padding: 5,
    fontFamily: "GlorySemiBold",
    textAlign: "center",
    fontSize: 18,
    lineHeight: 32,
    color: AppStyle.fontColor,
  },
  EventInviteCookie: {
    marginBottom: 10,
    borderColor: AppStyle.appIconColor,
    borderWidth: 1,
    padding: 15,
    borderRadius: 15,
  },
  EventInviteDeSec: {
    paddingTop: 10,
  },
  receivedCookie: {
    marginTop: 10,
    borderColor: AppStyle.appIconColor,
    borderWidth: 1,
    padding: 15,
    borderRadius: 15,
  },
  cookeSecright: {
    flexDirection: "row",
  },
  cookieCount: {
    fontSize: 12,
    fontFamily: "Abel",
    fontWeight: "400",
    color: "rgba(253, 139, 48, 0.69)",
    marginTop: -7,
    marginRight: 5,
  },
  cookiegCount: {
    fontSize: 12,
    fontFamily: "Abel",
    fontWeight: "400",
    color: "#808080",
    marginTop: -8,
    marginLeft: 3,
  },
  receivedCookieText: {
    marginTop: -30,
    backgroundColor: "#fff",
    fontSize: 16,
    fontFamily: "GlorySemiBold",
    lineHeight: 32,
    color: AppStyle.fontColor,
    paddingLeft: 10,
    paddingRight: 10,
    left: 5,
  },
  topheadSection: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 25,
  },
  SmIcons: {
    paddingLeft: 50,
    paddingRight: 50,
    marginBottom: 15,
  },
  SocialIcons: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-evenly",
  },
  SocialIconBg: {
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",

    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 18,
    paddingBottom: 18,
  },
  IconImgSec: {
    borderRightWidth: 1,
    borderColor: "#FFD3A9",
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
    fontFamily: "Abel",
    fontWeight: "400",
    lineHeight: 26,
    color: AppStyle.fontColor,
  },
  cookieLogo: {
    position: "absolute",
    right: 15,
    bottom: 15,
  },
  mainInnersection: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    borderColor: "#E8E6EA",
    borderTopWidth: 1,

    paddingTop: 10,
  },
  mainInnersectionNob: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",

    paddingTop: 10,
  },
  searchMainContentsection: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchMainContentsectionNob: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
  },

  searchImgsection: {
    width: "20%",
  },
  searchContentsection: {
    paddingLeft: 0,
    width: "100%",
  },
  searchContentTextBold: {
    fontSize: 16,
    fontFamily: "GlorySemiBold",
    color: AppStyle.fontColor,
  },
  searchContentText: {
    color: "#AAA6B9",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Abel",
  },
  nosearchContentText: {
    fontSize: 16,
    fontFamily: "Abel",
    paddingLeft: 7,
    color: AppStyle.fontColor,
    paddingTop: 10,
    paddingBottom: 10,
  },
  searchlongContentText: {
    fontSize: 13,
    fontFamily: "Abel",
    lineHeight: 22,
    color: AppStyle.fontColor,
  },
  ratingMainSection: {
    flexDirection: "row",
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  statSection: {
    marginTop: 30,
  },
  inputStyle: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: AppStyle.appIconColor,
    width: "100%",
    borderRadius: 15,
    fontFamily: "Abel",
    marginBottom: 18,
    zIndex: 1,
    position: "relative",
    fontSize: 16,
    color: AppStyle.fontColor,
  },
  inputStyleBox: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: AppStyle.appIconColor,
    width: "100%",
    borderRadius: 15,
    fontFamily: "Abel",
    zIndex: 1,
    position: "relative",
    fontSize: 14,
  },
  buttonSecStyle: AppStyle.AppbuttonStyle,
  btnText: {
    fontFamily: "GlorySemiBold",
    fontSize: 18,
    color: "#fff",
  },
  StatusText: {
    fontFamily: "GlorySemiBold",
    fontSize: 16,
    color: AppStyle.fontColor,
    position: "absolute",
    top: -10,
    left: 20,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#fff",
    height: 25,
    zIndex: 2,
  },
  outerImgHmSection: {
    flexDirection: "row",
    width: 74,
    height: 75,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: AppStyle.appIconColor,
    padding: 3,
    marginRight: 10,
    textAlign: "center",
  },
  outerImgSection: {
    flexDirection: "row",
    width: 64,
    height: 65,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: AppStyle.appIconColor,
    padding: 3,
    marginRight: 10,
    textAlign: "center",
  },
  sameguruContSect: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  sameguruCont: {
    width: AppStyle.sameGuruImgWidth,
    height: AppStyle.sameGuruImgHeight,
    borderRadius: 108,
    marginTop: 0.8,
    resizeMode: "contain",
  },
  imagetopCont: {
    width: 54,
    height: 54,
    borderRadius: 108,
    marginTop: 0.8,
  },
  btnCont: {
    position: "absolute",
    bottom: 25,
    right: 7,
    zIndex: 2,
  },
  modal: {
    marginLeft: "10%",
    marginRight: "10%",
    backgroundColor: AppStyle.btnbackgroundColor,
    width: "80%",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#fff",
    position: "absolute",
    top: "27%",
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 25,
    paddingRight: 25,
    alignItems: "center",
  },
  buttonTextStyle: {
    color: AppStyle.fontButtonColor,
    fontFamily: "GlorySemiBold",
    fontSize: 15,
    textTransform: "capitalize",
  },
  modalTitle: {
    color: AppStyle.fontButtonColor,
    fontFamily: "GlorySemiBold",
    fontSize: 16,
    textTransform: "capitalize",
    marginBottom: 10,
  },
  eventDateText: {
    color: AppStyle.fontButtonColor,
    fontFamily: "GlorySemiBold",
    fontSize: 16,
    textTransform: "capitalize",
  },
  eventDateText: {
    color: AppStyle.fontButtonColor,
    fontFamily: "GlorySemiBold",
    fontSize: 16,
    textTransform: "capitalize",
  },
  Btnmodal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonOuter: {
    marginTop: 20,
  },
  buttonStyle: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 15,
    width: "85%",
    marginLeft: 10,
  },
  buttonCStyle: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    borderRadius: 15,
    width: "85%",
    marginLeft: 10,
    borderWidth: 1,
    borderColor: AppStyle.appIconColor,
  },
  notiSec: {
    display: "none",
  },
  eventInviteSec: {
    //paddingTop:10
  },
  eventInviteinnerSecWB: {
    flexShrink: 1,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  eventInviteinnerSec: {
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 8,
    borderRadius: 10,
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#E8E6EA",
    flexShrink: 1,
  },
  eventLefouterImgHmSection: {
    flexDirection: "row",
    width: 65,
    height: 64,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: AppStyle.appIconColor,
    padding: 3,

    textAlign: "center",
  },
  eventInviteinnerSecLeft: {
    width: 55,
    height: 54,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: AppStyle.appIconColor,
    padding: 3,
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: AppStyle.appIconColor,
    alignItems: "center",
  },
  eventInviteinnerSecRight: {
    width: "75%",
    flexDirection: "column",
    paddingLeft: 10,
    marginTop: 7,
    flexShrink: 1,
  },
  eventDateText: {
    color: AppStyle.fontColor,
    fontFamily: "GlorySemiBold",
    fontSize: 16,
    textTransform: "capitalize",
  },
  eventTtileText: {
    fontSize: 16,
    fontFamily: "GlorySemiBold",
    color: AppStyle.fontColor,
  },
  eventDescText: {
    color: "#AAA6B9",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Abel",
  },
  eventAddText: {
    color: AppStyle.fontColor,
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Abel",
  },
  topevetHeadR: {
    flexDirection: "column",

    width: "100%",
  },
  eventContentTxt: {
    color: "#AAA6B9",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Abel",
  },
  userMainBody: {
    flex: 1,
    backgroundColor: AppStyle.appColor,
  },
  SectionHeadStyle: {
    fontSize: AppStyle.headingFontsize,
    fontFamily: "GlorySemiBold",
    fontWeight: "400",
    color: AppStyle.fontColor,
    marginLeft: 20,
  },
  samegurusect: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  SectionNoRecordStyle: {
    lineHeight: 22,
    fontFamily: "Abel",
    paddingLeft:15,
    fontSize: 16,
    fontFamily: "Abel",
    color: AppStyle.fontColor,
  },
});
