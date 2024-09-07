// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, Component } from "react";

import {
  StyleSheet,
  TextInput,
  View,
  Share,
  Text,
  ScrollView,
  FlatList,
  SafeAreaView,
  Image,
  Keyboard,
  TouchableOpacity,
  Alert,
  Pressable,
  TouchableHighlight,
  KeyboardAvoidingView,
  Linking,
} from "react-native";

import AppStyle from "../../Constants/AppStyle.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../../Components/Loader";
import CookieNavigationScreen from "../Common/CookieNavigationScreen";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import AlertMessages from "../../Constants/AlertMessages.js";
import UseAlertModal from "../Common/UseAlertModal";
import axios from "axios";
import Api from "../../Constants/Api.js";

class InviteEarnScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: "male",
      inviteNumber: "",
      loading: false,
      ishowReffral: true,
      errMsg: "Error",
      ishowMOdal: false,
    };
    AsyncStorage.setItem("activeClass", "FactiveClass");
  }

  handleCallback = (childData) => {
    this.setState({ ishowMOdal: childData });
  };

  async checkKukiEarn() {
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));

    this.setState({ loading: true });
    let data = JSON.stringify({
      user_number: udata.phone,
    });
    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    console.log("data", data);
    axios
      .post(Api.apiUrl + "/check-referral-record", data, headers)
      .then((res) => {
        console.log("data", res);

        this.setState({ loading: false });
        if (res.data.status == "true") {
          this.setState({ ishowReffral: false });
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

  componentDidMount() {
    this.checkKukiEarn();
  }

  render() {
    const { checked, inviteNumber, loading, errMsg, ishowMOdal, ishowReffral } =
      this.state;

    const postOnNmber = async () => {
      if (!ishowReffral) {
        this.setState({ errMsg: AlertMessages.alereadyReffralMsg });
        this.setState({ ishowMOdal: true });
        return;
      }
      if (inviteNumber == "") {
        this.setState({ errMsg: AlertMessages.inviteNumErr });
        this.setState({ ishowMOdal: true });
        return;
      }

      if (inviteNumber.length < 10) {
        SetErr(AlertMessages.phoneNumberLenErr);
        // ishowMOdalFuc(true);
        return;
      }

      let udata = JSON.parse(await AsyncStorage.getItem("userData"));

      this.setState({ loading: true });
      let data = JSON.stringify({
        from_user_number: inviteNumber,
        user_number: udata.phone,

      });
      let headers = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      console.log(data);
      axios
        .post(Api.apiUrl + "/earn-referral-user", data, headers)
        .then((res) => {
          console.log(res)
          this.setState({ loading: false });
          if (res.data.status == "true") {
            this.setState({ inviteNumber: "" });
            this.setState({ errMsg: res.data.message });
            this.setState({ ishowMOdal: true });
            this.setState({ ishowReffral: false });
          } else {
            this.setState({ errMsg: res.data.message });
            this.setState({ ishowMOdal: true });
          }
        })
        .catch((error) => {
          console.log(error)
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

    const onShare = async () => {
      this.setState({ loading: true });
      try {
        let udata = JSON.parse(await AsyncStorage.getItem("userData"));
        let code =
          Math.floor(100000 + Math.random() * 900000) + "_" + udata.phone;

        let message =
          "Download and install the app from https://kukiapp.com/ and use my number to earn 10 free Kukies!";
        const result = await Share.share({
          message: message,
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
        if (error.toJSON().message === "Network Error") {
          this.setState({ errMsg: AlertMessages.noInternetErr });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        } else {
          this.setState({ errMsg: error.toJSON().message });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        }
      }
    };

    return (
      <View style={{ flex: 1, height: "100%" }}>
        <ScrollView>
          <Loader loading={loading} />
          {ishowMOdal && (
            <UseAlertModal
              message={errMsg}
              parentCallback={this.handleCallback}
            />
          )}

          <View style={styles.mainBody}>
            <KeyboardAvoidingView
              behavior="position"
              keyboardVerticalOffset={Platform.OS === "ios" ? -60 : -180}
            >
              <View style={styles.topheadSection}>
                <Text style={styles.SectionHeadStyle}>Invite and Earn</Text>
              </View>

              <View style={styles.outermainSection}>
                <View style={styles.mainStection}>
                  <View style={styles.bannerStection}>
                    <Image
                      source={require("../../../assets/images/Refer-Earn.png")}
                      style={[
                        {
                          resizeMode: "contain",
                          width: "90%",
                          height: 220,
                          marginTop: 10,
                        },
                        styles.imgIcon,
                      ]}
                    />
                    <Text style={styles.inviteCont}>
                      Invite your contact to downloand this app and you both
                      earn 10 kukies each for FREE. Simply share the download
                      link with you contacts
                    </Text>
                  </View>
                </View>

                <View style={styles.bannerStection}></View>

                <View style={styles.numbrsareSec}>
                  <View style={styles.SocialIcons}>
                    <TouchableOpacity onPress={onShare} activeOpacity={0.7}>
                      <LinearGradient
                        // Button Linear Gradient
                        colors={[
                          AppStyle.gradientColorOne,
                          AppStyle.gradientColorTwo,
                        ]}
                        style={styles.SocialIconBg}
                      >
                        <FontAwesome5
                          name={"whatsapp"}
                          size={20}
                          color={AppStyle.fontColor}
                        />
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onShare} activeOpacity={0.7}>
                      <LinearGradient
                        // Button Linear Gradient
                        colors={[
                          AppStyle.gradientColorOne,
                          AppStyle.gradientColorTwo,
                        ]}
                        style={styles.SocialIconBg}
                      >
                        <Feather
                          name={"facebook"}
                          size={20}
                          color={AppStyle.fontColor}
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onShare} activeOpacity={0.7}>
                      <LinearGradient
                        // Button Linear Gradient
                        colors={[
                          AppStyle.gradientColorOne,
                          AppStyle.gradientColorTwo,
                        ]}
                        style={styles.SocialIconBg}
                      >
                        <FontAwesome5
                          name={"instagram"}
                          size={20}
                          color={AppStyle.fontColor}
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onShare} activeOpacity={0.7}>
                      <LinearGradient
                        // Button Linear Gradient
                        colors={[
                          AppStyle.gradientColorOne,
                          AppStyle.gradientColorTwo,
                        ]}
                        style={styles.SocialIconBg}
                      >
                        <Feather
                          name={"twitter"}
                          size={20}
                          color={AppStyle.fontColor}
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.outermainSection}>
                <View style={styles.mainStection}>
                  <Text style={styles.sharenumbCont}>
                    Share the mobile number of your contact who referred this
                    app to you and both earn 10 kukies each for FREE
                  </Text>
                </View>
                <View style={styles.OuterStyle}>
                  <View style={styles.buttonnumberOuterStyle}>
                    <TextInput
                      style={[
                        styles.inputdStyle,
                        !ishowReffral ? styles.disableText : styles.textvalid,
                      ]}
                      onChangeText={(numberU) =>
                        this.setState({ inviteNumber: numberU })
                      }
                      editable={ishowReffral}
                      selectTextOnFocus={ishowReffral}
                      placeholder="Phone Number" //dummy@abc.com
                      value={inviteNumber} //dummy@abc.com
                      placeholderTextColor={AppStyle.fontButtonColor}
                      autoCapitalize="none"
                      maxLength={10}
                      returnKeyType="next"
                      keyboardType="number-pad"
                    />
                  </View>

                  <View>
                    <TouchableOpacity onPress={postOnNmber} activeOpacity={0.7}>
                      <LinearGradient
                        // Button Linear Gradient
                        colors={[
                          AppStyle.gradientColorOne,
                          AppStyle.gradientColorTwo,
                        ]}
                        style={[
                          styles.buttonEarnStyle,
                          !ishowReffral ? styles.disableText : styles.textvalid,
                        ]}
                      >
                        <Image
                          source={require("../../../assets/images/icons/graycookie.png")}
                          style={[
                            {
                              resizeMode: "contain",
                              width: 20,
                              height: 20,
                              marginRight: 10,
                            },
                          ]}
                        />
                        <Text style={styles.buttonTextStyle}>Earn</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
        <CookieNavigationScreen navigation={this.props.navigation} />
      </View>
    );
  }
}
export default InviteEarnScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: AppStyle.appColor,
    paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
    paddingBottom: AppStyle.appInnerBottomPadding,
    paddingTop: AppStyle.appInnerTopPadding,
    height: "100%",
  },
  outermainSection: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 25,
    paddingBottom: 25,
    borderWidth: 1,
    borderColor: AppStyle.appIconColor,
    width: "100%",
    borderRadius: 15,
    marginBottom: 20,
  },
  topheadSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  mainStection: {
    width: "100%",

    justifyContent: "center",
  },
  SectionHeadStyle: {
    fontSize: AppStyle.aapPageHeadingSize,
    fontFamily: "GlorySemiBold",
    color: AppStyle.fontColor,
  },
  bannerStection: {
    alignItems: "center",
    justifyContent: "center",
  },
  inviteCont: {
    fontSize: 15,
    fontFamily: "Abel",
    lineHeight: 22,
    color: AppStyle.fontColor,
    marginTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: "center",
  },
  inviteDownCont: {
    fontSize: 17,
    fontFamily: "GlorySemiBold",
    lineHeight: 22,
    color: AppStyle.fontColor,
    marginTop: 15,
    marginBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: "center",
  },
  numbrsareSec: {
    width: "100%",
  },
  OuterStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttonnumberOuterStyle: {
    paddingLeft: 25,
    paddingRight: 25,

    flexDirection: "row",
    borderRadius: 15,
    width: "62%",
    alignItems: "center",
    backgroundColor: AppStyle.btnbackgroundColor,
  },
  inputdStyle: {
    color: AppStyle.fontButtonColor,

    width: "100%",

    fontSize: AppStyle.inputFontsize,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    fontFamily: "Abel",
  },
  disableText: {
    opacity: 0.5,
  },

  sharenumbCont: {
    fontSize: 15,
    fontFamily: "Abel",
    lineHeight: 22,
    color: AppStyle.fontColor,
    marginTop: -17,
    paddingLeft: 12,
    paddingRight: 12,
    textAlign: "center",
  },
  buttonTextStyle: {
    color: AppStyle.inputBlackcolorText,
    fontSize: AppStyle.inputFontsize,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    fontFamily: "Abel",
  },
  buttonEarnStyle: {
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: AppStyle.buttonTBPadding,
    paddingBottom: AppStyle.buttonTBPadding,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-around",
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
});
