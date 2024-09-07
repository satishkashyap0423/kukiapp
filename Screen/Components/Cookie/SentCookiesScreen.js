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
  TouchableOpacity,
  Alert,
  TouchableHighlight,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";

import AppStyle from "../../Constants/AppStyle.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CookieNavigationScreen from "../Common/CookieNavigationScreen";
import axios from "axios";
import Api from "../../Constants/Api.js";
import Loader from "../Loader";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import AlertMessages from "../../Constants/AlertMessages.js";
import UseAlertModal from "../Common/UseAlertModal";
import { Checkbox } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

class SentCookiesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      cookieData: [],
      luserDetail: [],
      errMsg: "Error",
      ishowMOdal: false,
      KukiChecked: false,
      isdeleBtn: false,
      chkText: "Check",
    };
    AsyncStorage.setItem("activeClass", "FactiveClass");
  }

  getuserDetail = (i, isSend) => {
    this.props.navigation.push("CookiesDetail", {
      user_id: i,
      isFrom: 1,
      isSend: isSend,
    });
  };

  async getCookieData() {
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
      .post(Api.apiUrl + "/sent-cookie-record", data, headers)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data.status == "true") {
          var df = res.data.data;
          this.setState({ cookieData: res.data.data });
          if (df.length > 0) {
            this.setState({ isdeleBtn: true });
          } else {
            this.setState({ isdeleBtn: false });
          }
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
          this.setState({ errMsg: error.toJSON().message });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        }
      });
  }

  checkAll() {
    let sentRes = this.state.cookieData;
    if (this.state.chkText == "Check") {
      this.setState({ chkText: "Uncheck" });
      let temp = sentRes.map((product) => {
        return { ...product, isChecked: true };
      });
      this.setState({ cookieData: temp });
    } else {
      this.setState({ chkText: "Check" });
      let temp = sentRes.map((product) => {
        return { ...product, isChecked: false };
      });
      this.setState({ cookieData: temp });
    }
  }

  handleCallback = (childData) => {
    this.setState({ ishowMOdal: childData });
  };

  async componentDidMount() {
    this.getCookieData();
    let udetail = JSON.parse(await AsyncStorage.getItem("userDetailsData"));
    this.setState({ luserDetail: udetail });
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.getCookieData();
      //Put your Data loading function here instead of my this.loadData()
    });
  }

  backScreen() {
    this.props.navigation.navigate("ListCookiesScreen");
  }

  sendCookie = async (val, fName, lName) => {
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

    axios
      .post(Api.apiUrl + "/send-cookie", data, headers)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data.status == "true") {
          this.setState({
            errMsg: AlertMessages.sendKukiMsg + " to \n" + fName + " " + lName,
          });
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

  deleteRecords = async () => {
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));

    let dUserIds = [];
    let dKukiIds = [];
    let dKukiData = this.state.cookieData;
    for (var i = 0; i < dKukiData.length; i++) {
      if (dKukiData[i].isChecked) {
        dUserIds.push(dKukiData[i].to_user_id);
        dKukiIds.push(dKukiData[i].send_kuki_id);
      }
    }

    if (dUserIds.length == 0) {
      this.setState({ errMsg: "Select any record to delete" });
      this.setState({ ishowMOdal: true });
      return;
    }
    this.setState({ loading: true });

    let data = JSON.stringify({
      from_user_id: udata.id,
      ckData: dUserIds.toString(),
      kukiIds: dKukiIds,
    });

    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    axios
      .post(Api.apiUrl + "/delete-kuki-records", data, headers)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data.status == "true") {
          this.getCookieData();
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

  alertBlockMessg = () => {
    this.setState({ errMsg: AlertMessages.isBlockuserMessage });
    this.setState({ ishowMOdal: true });
  };

  alertnotMessg = () => {
    this.setState({ errMsg: AlertMessages.waitKukiErr });
    this.setState({ ishowMOdal: true });
  };

  render() {
    const {
      checked,
      loading,
      cookieData,
      errMsg,
      ishowMOdal,
      KukiChecked,
      chkText,
      isdeleBtn,
      luserDetail,
    } = this.state;

    let sentContentData = [];

    if (cookieData.length > 0) {
      const handleChange = (id) => {
        let temp = cookieData.map((product) => {
          if (id === product.to_user_id) {
            return { ...product, isChecked: !product.isChecked };
          }
          return product;
        });
        this.setState({ cookieData: temp });
      };

      let search_data = cookieData;
      console.log(cookieData);

      for (let i = 0; i < search_data.length; i++) {
        let ratingData = [];
        let ratingNoData = [];
        if (search_data[i].rating != null) {
          let userRating = search_data[i].rating;

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
        } else {
          for (var k = 0; k < 5; k++) {
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
        }

        let userImg = [];
        if (search_data[i].user_detail.user_profile_image != null) {
          userImg.push(
            <TouchableOpacity
              style={styles.outerImgSection}
              key={search_data[i].to_user_id}
              activeOpacity={0.6}
              onPress={this.getuserDetail.bind(
                this,
                search_data[i].to_user_id,
                cStat
              )}
            >
              <Image
                // source={{
                //   uri: `${search_data[i].user_detail.user_profile_image}`,
                  
                // }}
                source={{ uri: `${Api.imgaePath}/${search_data[i].user_detail.user_profile_image}` }}

                style={styles.imagetopCont}
              />
            </TouchableOpacity>
          );
        } else {
          userImg.push(
            <TouchableOpacity
              style={styles.outerImgSection}
              key={search_data[i].to_user_id}
              activeOpacity={0.6}
              onPress={this.getuserDetail.bind(
                this,
                search_data[i].to_user_id,
                cStat
              )}
            >
              <Image
                source={require("../../../assets/images/uphoto.png")}
                style={styles.imagetopCont}
              />
            </TouchableOpacity>
          );
        }

        let cookieImg = [];
        let CookieEnabled = true;
        let cStat = 0;

        if (search_data[i].is_same_blocked == "1") {
          cookieImg.push(
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
        } else {
          if (search_data[i].cookie_status == 1) {
            cStat = 1;
            cookieImg.push(
              <TouchableOpacity
                key={search_data[i].user.id}
                onPress={this.sendCookie.bind(
                  this,
                  search_data[i].to_user_id,
                  search_data[i].user.first_name,
                  search_data[i].user.last_name
                )}
                style={styles.innerSection}
              >
                <Image
                  source={require("../../../assets/images/icons/yellowcookie.png")}
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: "contain",
                    marginBottom: 5,
                  }}
                />
              </TouchableOpacity>
            );
          } else {
            CookieEnabled = false;
            cookieImg.push(
              <TouchableOpacity
                key={search_data[i].user.id}
                onPress={this.alertnotMessg.bind(this)}
                style={styles.innerSection}
              >
                <Image
                  key={search_data[i].user.id}
                  source={require("../../../assets/images/yellokuki.jpeg")}
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
        }

        console.log(search_data[i].is_blocked + " - Hello");
        if (search_data[i].is_blocked == "1") {
          cookieImg = [];
          cookieImg.push(
            <TouchableOpacity
              key={search_data[i].user.id}
              onPress={this.alertBlockMessg.bind(this)}
              style={styles.innerSection}
            >
              <Image
                key={search_data[i].user.id}
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

        let chekBoxes = [];
        chekBoxes.push(
          <Pressable onPress={() => handleChange(search_data[i].to_user_id)}>
            <MaterialCommunityIcons
              name={
                search_data[i].isChecked
                  ? "checkbox-marked"
                  : "checkbox-blank-outline"
              }
              size={24}
              color={AppStyle.appIconColor}
            />
          </Pressable>
        );

        let isSameguru = false;
        if (
          luserDetail.guru_id == search_data[i].user_detail.guru_id &&
          luserDetail.guru_id != 0
        ) {
          isSameguru = true;
        }
        sentContentData.push(
          <View
            style={[
              i == 0 ? styles.mainInnersectionNob : styles.mainInnersection,
            ]}
          >
            {userImg}
            <View style={styles.searchMainContentsection}>
              <View style={styles.searchContentsection}>
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.6}
                  onPress={this.getuserDetail.bind(
                    this,
                    search_data[i].to_user_id,
                    cStat
                  )}
                >
                  <View style={styles.sameguruContSect}>
                    <Text style={styles.searchContentTextBold}>
                      {search_data[i].user.first_name}{" "}
                      {search_data[i].user.last_name},{" "}
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
                    {search_data[i].user_detail.gender},{" "}
                    {search_data[i].user_detail.age_group},{" "}
                    {search_data[i].city_data.name},{" "}
                    {search_data[i].state_data.state_abbrivation != ""
                      ? search_data[i].state_data.state_abbrivation
                      : search_data[i].state_data.name}
                  </Text>
                  <Text style={styles.searchContentText}>
                    {search_data[i].community_data.name}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.searchImgsection}>
                {cookieImg}
                {chekBoxes}
              </View>

              {/* CookieEnabled && <Text style={styles.cookieCount}>{search_data[i].total}</Text> */}
              {/*!CookieEnabled && <Text style={styles.cookiegCount}>{search_data[i].total}</Text>*/}
            </View>
          </View>
        );
      }
    } else {
      sentContentData.push(
        <Text style={styles.SectionNoRecordStyle} key="5">
          {AlertMessages.SentCookieErrmsg}
        </Text>
      );
    }

    return (
      <View style={{ flex: 1, height: "100%", backgroundColor: "#fff" }}>
        <Loader loading={loading} />
        {ishowMOdal && (
          <UseAlertModal
            message={errMsg}
            parentCallback={this.handleCallback}
          />
        )}
        <ScrollView>
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
              <Text style={styles.SectionHeadStyle}>Sent Kukies</Text>
              {/*} <Text style={styles.SectionsubHeadStyle}>(Sender’s View of Sent Cookies)</Text> */}
            </View>

            <View style={styles.SectionCheckStyle}>
              {isdeleBtn && (
                <TouchableOpacity
                  onPress={() => this.checkAll()}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    // Button Linear Gradient
                    colors={[
                      AppStyle.gradientColorOne,
                      AppStyle.gradientColorTwo,
                    ]}
                    style={styles.chkIconsCont}
                  >
                    <Text style={styles.delteTxtstyle}>{chkText} all</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {isdeleBtn && (
                <TouchableOpacity
                  onPress={() => this.deleteRecords()}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    // Button Linear Gradient
                    colors={[
                      AppStyle.gradientColorOne,
                      AppStyle.gradientColorTwo,
                    ]}
                    style={styles.chkIconsCont}
                  >
                    <Text style={styles.delteTxtstyle}>Delete</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
            {sentContentData}
          </View>
        </ScrollView>
        <CookieNavigationScreen navigation={this.props.navigation} />
      </View>
    );
  }
}
export default SentCookiesScreen;

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
  SectionCheckStyle: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  delteTxtstyle: {
    fontSize: 12,
    fontFamily: "Abel",
    fontWeight: "400",
    color: "#000",
  },
  chkIconsCont: {
    borderWidth: 1,
    borderColor: "#E8E6EA",
    borderRadius: 15,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    width: 90,
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
    width: "75%",
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
    color: AppStyle.fontColor,
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
  searchImgsection: {
    marginRight: 6,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  sameguruContSect: {
    flexDirection: "row",
  },
  sameguruCont: {
    width: AppStyle.sameGuruImgWidth,
    height: AppStyle.sameGuruImgHeight,
    borderRadius: 108,
    marginTop: 0.8,
  },
});
