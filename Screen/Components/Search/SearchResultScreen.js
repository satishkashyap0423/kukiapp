// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, Component, useCallback } from "react";
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
  Pressable,
  TouchableOpacity,
  Alert,
  TouchableHighlight,
  KeyboardAvoidingView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppStyle from "../../Constants/AppStyle.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CookieNavigationScreen from "../Common/CookieNavigationScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import axios from "axios";
import Api from "../../Constants/Api.js";
import Loader from "../Loader";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import AlertMessages from "../../Constants/AlertMessages.js";
import UseAlertModal from "../Common/UseAlertModal";
import { Checkbox } from "react-native-paper";
class SearchResultScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchData: [],
      errMsg: "Error",
      userDetail: [],
      ishowMOdal: false,
      checked: false,
    };
  }

  getuserDetail = (i, isSend) => {
    this.props.navigation.push("CookiesDetail", {
      user_id: i,
      isFrom: 1,
      isSend: isSend,
    });
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
          let sData = this.props.route.params.searchData;
          let searchD_data = JSON.parse(sData);
          console.log(searchD_data)
          this.searchRecords(searchD_data);

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

  backScreen() {
    this.props.navigation.goBack();
  }

  swithScreen(val) {
    this.props.navigation.navigate(val);
  }

  alertBlockMessg = () => {
    this.setState({ errMsg: AlertMessages.isBlockuserMessage });
    this.setState({ ishowMOdal: true });
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
      .post(Api.apiUrl + "/search-mates", data, headers)
      .then((res) => {
        console.log(res.data.data);
        this.setState({ loading: false });
        //AsyncStorage.setItem('searchResultRecords',JSON.stringify(res.data.data));
        //console.log(res.data.data);
        this.setState({ searchData: res.data.data });
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

  async componentDidMount() {
    let sData = this.props.route.params.searchData;
    let searchD_data = JSON.parse(sData);
    this.searchRecords(searchD_data);

    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.searchRecords(searchD_data);
    });

    let udetail = JSON.parse(await AsyncStorage.getItem("userDetailsData"));

    console.log(udetail);
    this.setState({ userDetail: udetail });
  }
  handleCallback = (childData) => {
    this.setState({ ishowMOdal: childData });
  };

  render() {
    const { checked, loading, errMsg, ishowMOdal, userDetail } = this.state;
    const { navigation } = this.props;

    let search_data = this.state.searchData;

    console.log(search_data);

    let searchContentData = [];
    if (search_data?.length > 0) {
      for (let i = 0; i < search_data.length; i++) {
        let isSameguru = false;
        if (
          userDetail.guru_id == search_data[i].guru_id &&
          userDetail.guru_id != 0
        ) {
          isSameguru = true;
        }
        let userImg = [];
        if (search_data[i].user_profile_image != null) {
          userImg.push(
            <View
              style={styles.outerImgSection}
              key={search_data[i].id + "_img"}
            >
              <Image
                source={{ uri: `${Api.imgaePath}${search_data[i].user_profile_image}` }}
                // source={{ uri: `${search_data[i].user_profile_image}` }}
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

        let userRating = search_data[i].rating;
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
        if (search_data[i].isCookieStat == "1") {
          ckImg.push(
            <TouchableOpacity
              onPress={this.sendCookie.bind(
                this,
                search_data[i].user_id,
                1,
                i,
                search_data[i].isNewcookieStat,
                search_data[i].first_name,
                search_data[i].last_name
              )}
              style={styles.innerSection}
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
                search_data[i].user_id,
                0,
                i,
                search_data[i].isNewcookieStat,
                search_data[i].first_name,
                search_data[i].last_name
              )}
              style={styles.innerSection}
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

        if (search_data[i].is_blocked == "1") {
          ckImg = [];
          ckImg.push(
            <TouchableOpacity
              key={search_data[i].user_id}
              onPress={this.alertBlockMessg.bind(this)}
              style={styles.innerSection}
            >
              <Image
                key={search_data[i].user_id}
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
          search_data[i].is_same_blocked == "1" &&
          search_data[i].is_blocked == "0"
        ) {
          ckImg = [];
          ckImg.push(
            <TouchableOpacity
              key={search_data[i].user_id}
              style={styles.innerSection}
            >
              <Image
                key={search_data[i].user_id}
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
            onPress={this.getuserDetail.bind(this, search_data[i].user_id, 1)}
          >
            {userImg}
            <View style={styles.searchMainContentsection}>
              <View style={styles.searchContentsection}>
                <View style={styles.samegurusect}>
                  <Text style={styles.searchContentTextBold}>
                    {search_data[i].first_name} {search_data[i].last_name},{" "}
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
                {!this.state.checked && (
                  <>
                    <Text style={styles.searchContentText}>
                      {search_data[i].gender}, {search_data[i].age_group},{" "}
                      {search_data[i].city_data.name},{" "}
                      {search_data[i].state_data.state_abbrivation != ""
                        ? search_data[i].state_data.state_abbrivation
                        : search_data[i].state_data.name}
                    </Text>
                    <Text style={styles.searchContentText}>
                      {search_data[i].community_data.name}
                    </Text>
                  </>
                )}
                {this.state.checked && (
                  <Text style={styles.searchContentText}>
                    {search_data[i].user_status}
                  </Text>
                )}
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
      <View style={{ flex: 1 }}>
        <Loader loading={loading} />
        <ScrollView style={{ backgroundColor: "#fff" }}>
          {ishowMOdal && (
            <UseAlertModal
              message={errMsg}
              parentCallback={this.handleCallback}
            />
          )}
          <View style={styles.mainBody}>
            <View style={styles.topheadSection}>
              <TouchableOpacity
                onPress={() => this.backScreen()}
                activeOpacity={0.7}
              >
                <LinearGradient
                  // Button Linear Gradient
                  colors={[
                    AppStyle.gradientColorOne,
                    AppStyle.gradientColorTwo,
                  ]}
                  style={styles.backIconsCont}
                >
                  <FontAwesome
                    name={"angle-left"}
                    size={24}
                    color={AppStyle.fontColor}
                  />
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.SectionHeadStyle}>Search Results</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Text style={{
                  color: AppStyle.fontColor,
                  fontSize: 18,
                fontFamily: 'GlorySemiBold',
                textAlign:'right',
                paddingRight:5
              
              }}>Show Prayers</Text>
              {/* <Checkbox
                color="rgb(253, 139, 48)"
                status={checked ? "checked" : "unchecked"}
                onPress={() => {
                  this.setState({
                    checked: !checked,
                  });
                }}
              /> */}
              <MaterialCommunityIcons
               onPress={() => {
                this.setState({
                  checked: !checked,
                });
              }}
                name={
                  checked
                    ? "checkbox-marked"
                    : "checkbox-blank-outline"
                }
                size={24}
                color={AppStyle.appIconColor}
              />
            </View>
            {searchContentData}
          </View>
        </ScrollView>
        <CookieNavigationScreen navigation={this.props.navigation} />
      </View>
    );
  }
}
export default SearchResultScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: AppStyle.appColor,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: AppStyle.appInnerBottomPadding,
    paddingTop: AppStyle.appInnerTopPadding,
  },
  topheadSection: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 25,
  },
  backIconsCont: {
    borderWidth: 1,
    borderColor: "#E8E6EA",
    borderRadius: 15,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
  },
  SectionHeadStyle: {
    fontSize: AppStyle.aapPageHeadingSize,
    fontFamily: "GlorySemiBold",
    fontWeight: "400",
    color: AppStyle.fontColor,
    marginLeft: 20,
  },
  cookeSecright: {
    flexDirection: "row",
  },
  cookieCount: {
    fontSize: 12,
    fontFamily: "Abel",
    fontWeight: "400",
    color: "rgba(253, 139, 48, 0.69)",
    marginTop: -8,
    marginLeft: 3,
  },
  cookiegCount: {
    fontSize: 12,
    fontFamily: "Abel",
    fontWeight: "400",
    color: "#808080",
    marginTop: -8,
    marginLeft: 3,
  },
  SectionsubHeadStyle: {
    fontSize: 16,
    fontFamily: "Abel",
    fontWeight: "400",
    color: "rgba(253, 139, 48, 0.69)",
    marginTop: 5,
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
  searchContentsection: {
    paddingLeft: 0,
    width: "85%",
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
  SectionNoRecordStyle: {
    fontSize: 13,
    lineHeight: 22,
    fontFamily: "Abel",
  },
  ratingMainSection: {
    flexDirection: "row",
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  imagetopCont: {
    width: 54,
    height: 54,
    borderRadius: 108,
    marginTop: 0.8,
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
  samegurusect: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  sameguruCont: {
    width: AppStyle.sameGuruImgWidth,
    height: AppStyle.sameGuruImgHeight,
    resizeMode: "contain",
  },
});
