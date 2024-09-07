// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/
// Import React and Component
import React, { useState, createRef, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import AppStyle from "../../Constants/AppStyle.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountryPicker from "react-native-country-codes-picker";
import CommanClass from "../Common/CommanClass";
import ProgressBar from "../Common/ProgressBar";
import Loader from "../Loader";
import * as Notifications from "expo-notifications";
//import saveTokenData from '../shared/APIKit';
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import Api from "../../Constants/Api.js";
import AlertMessages from "../../Constants/AlertMessages.js";
import UseAlertModal from "../Common/UseAlertModal";

const LoginScreen = ({ navigation }) => {
  const [userPhone, setUserPhone] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errMsg, SetErr] = useState("ErrorMsg");
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState("");
  const [show, setShow] = useState(false);
  const [ishowMOdal, ishowMOdalFuc] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const passwordInputRef = createRef();
  const [fontsLoaded] = useState("false");

  const loginUser = async () => {
    const fcmtoken = (await Notifications.getDevicePushTokenAsync()).data;
    console.log("fcm token is " + fcmtoken);
    navigation.navigate("UserLoginScreen");
  };

  const handleSubmitPress = async () => {
    /*navigation.navigate('UserdetailScreen');

    retrun;*/
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      //SetErr('Please allow permissions to get notifications!');
      //ishowMOdalFuc(true);
      await Notifications.requestPermissionsAsync();
      //return;
    }
    const fcmtoken = (await Notifications.getDevicePushTokenAsync()).data;
    //const fcmtoken = ('fdh');

    if (!userPhone) {
      SetErr(AlertMessages.phoneNumberErr);
      ishowMOdalFuc(true);
      return;
    }

    if (userPhone.length < 10) {
      SetErr(AlertMessages.phoneNumberLenErr);
      ishowMOdalFuc(true);
      return;
    }

    AsyncStorage.setItem("fcmtoken", fcmtoken);

    console.log("fcm token is " + fcmtoken);

    setLoading(true);
    let data = JSON.stringify({
      phone_number: userPhone,
      country_code: countryCode,
    });
    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    console.log("login screen---", data);
    //console.log(Api.apiUrl+'/check-phonenumber');
    axios
      .post(Api.apiUrl + "/check-phonenumber", data, headers)
      .then((res) => {
        console.log(res);
        setLoading(false);
        console.log("login screen test---", res.data);
        if (res.data.is_registered == 1) {
          SetErr(res.data.message);
          // ishowMOdalFuc(true);
          setTimeout(
            function () {
              navigation.replace("LoginNavigationStack");
            }.bind(this),
            2000
          );
        } else {
          AsyncStorage.clear();
          let userData = {
            device_token: fcmtoken,
            phone_number: userPhone,
            country_code: countryCode,
          };
          AsyncStorage.setItem("userSignupData", JSON.stringify(userData));
          setLoading(false);
          navigation.navigate("Otpscreen");
        }
      })
      .catch((error) => {
        if (error.toJSON().message === "Network Error") {
          SetErr(AlertMessages.noInternetErr);
          ishowMOdalFuc(true);
          setLoading(false);
        } else {
          SetErr(error);
          console.log(error);
          ishowMOdalFuc(true);
          setLoading(false);
        }
      });
  };

  const handleCallback = (childData) => {
    ishowMOdalFuc(childData);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ backgroundColor: "#fff" }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : ""}
          style={styles.container}
        >
          <ProgressBar step="1" />
          <View style={styles.mainBody}>
            <Loader loading={loading} />
            {ishowMOdal && (
              <UseAlertModal message={errMsg} parentCallback={handleCallback} />
            )}

            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image
                source={require("../../../assets/images/logo/logo_new.png")}
                style={{
                  maxWidth: 250,

                  resizeMode: "contain",
                  marginBottom: 20,
                }}
              />
            </View>
            <View style={styles.SectionStyle}>
              <Text style={styles.SectionHedText}>My Mobile</Text>
            </View>
            <View style={styles.SectionStyleContent}>
              <Text style={styles.SectionContText}>
                Please enter your valid phone number. We will send you a 4-digit
                code to verify your number.{" "}
              </Text>
            </View>
            <View style={styles.mainStection}>
              <View style={styles.Nubcontainer}>
                <TouchableOpacity
                  onPress={() => {
                    SetErr(AlertMessages.countryCodeError);
                    ishowMOdalFuc(true);
                  }}
                  style={styles.CountryBox}
                >
                  <Text style={styles.CountryText}>({countryCode})</Text>
                </TouchableOpacity>
                <CountryPicker
                  show={false}
                  style={styles.CountryBoxdrop}
                  // when picker button press you will get the country object with dial code
                  pickerButtonOnPress={(item) => {
                    setCountryCode(item.dial_code);
                    setShow(false);
                  }}
                />

                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(UserEmail) => setUserPhone(UserEmail)}
                  placeholder="Enter Phone number"
                  placeholderTextColor="#ADAFBB"
                  onSubmitEditing={Keyboard.dismiss}
                  maxLength={10}
                  returnKeyType="done"
                  keyboardType="number-pad"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={styles.loginbtn}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSubmitPress}
                style={styles.buttonOuter}
              >
                <LinearGradient
                  // Button Linear Gradient
                  colors={[
                    AppStyle.gradientColorOne,
                    AppStyle.gradientColorTwo,
                  ]}
                  //start={{ x: 0.5, y: 0.5 }}
                  //end={{ x: 0.5, y: 0.65 }}
                  style={styles.buttonStyle}
                >
                  <Text style={styles.buttonTextStyle}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
              <View style={styles.regection}>
                <TouchableOpacity
                  style={styles.backBtnSection}
                  activeOpacity={0.5}
                  onPress={loginUser}
                >
                  <Text style={styles.pswContectSec}>
                    Already a User?{" "}
                    <Text style={styles.pswRContectSec}>Login</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  mainContainer: {
    flex: 1,
    height: 700,
  },
  mainBody: {
    backgroundColor: AppStyle.appColor,
    paddingLeft: 35,
    paddingRight: 35,
    paddingTop: 45,
    paddingBottom: 45,
    paddingBottom: AppStyle.appBottomPadding,
    fontFamily: "Abel",
  },
  CountryBox: {
    width: "25%",
    height: 60,
    borderRightWidth: 1,

    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#999999",
    position: "relative",
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  SectionStyle: {
    flexDirection: "row",
  },

  SectionStyleContent: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 25,
  },
  mainStection: {},
  Nubcontainer: {
    flexDirection: "row",
  },
  CountryBoxdrop: {},
  SectionHedText: {
    fontSize: 27,
    fontFamily: "GlorySemiBold",
    color: AppStyle.fontColor,
  },
  SectionContText: {
    fontSize: AppStyle.contenyFontsize,
    fontFamily: "Abel",
    lineHeight: AppStyle.contentlineHeight,
    color: AppStyle.fontColor,
  },
  loginbtn: {
    marginTop: 20,
  },
  buttonStyle: AppStyle.AppbuttonStyle,
  buttonTextStyle: {
    color: AppStyle.fontButtonColor,

    fontFamily: "GlorySemiBold",
    fontSize: AppStyle.buttonFontsize,
  },
  CountryText: {
    color: AppStyle.inputBlackcolorText,
    fontSize: AppStyle.inputFontsize,
    paddingVertical: 9,
    fontFamily: "Abel",
  },
  pswContectSec: {
    color: AppStyle.fontColor,
    fontSize: 15,
    alignSelf: "center",
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: "GlorySemiBold",
  },
  pswRContectSec: {
    color: "rgba(253, 139, 48,0.9)",
    fontSize: 15,
    alignSelf: "center",
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: "GlorySemiBold",
  },
  inputStyle: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#999999",
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    width: "75%",
    paddingRight: 15,
    fontSize: AppStyle.inputFontsize,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    fontFamily: "Abel",
  },
  registerTextStyle: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  regection: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
});
