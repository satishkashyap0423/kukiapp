// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, Component } from "react";
import { Checkbox } from "react-native-paper";

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
  TouchableHighlight,
  KeyboardAvoidingView,
} from "react-native";

import AppStyle from "../../Constants/AppStyle.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../../Components/Loader";
import CookieNavigationScreen from "../Common/CookieNavigationScreen";
import axios from "axios";
import Api from "../../Constants/Api.js";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import AlertMessages from "../../Constants/AlertMessages.js";
import UseAlertModal from "../Common/UseAlertModal";

class CookieZarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      RedeemedCokie: "0",
      exRate: "0",
      DonateCokie: "0",
      loading: false,
      paymentChecked: false,
      paymentPChecked: false,
      paymentGChecked: false,
      DonateNumber: "",
      errMsg: "Error",
      ishowMOdal: false,
      RedeemNumber:""
    };
    AsyncStorage.setItem("activeClass", "FactiveClass");
  }

  async getKukiData() {
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
      .post(Api.apiUrl + "/get-user-cookie", data, headers)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data.status == "true") {
          this.setState({ userKukiData: res.data });

          const exchangeRateArr = res.data?.exchange_rate.split("-");
          let a = [];
          let flostVal = [];
          for (var i = 1; i <= 6; i++) {
            var vall = i * 15;
            flostVal.push(vall);
          }
          console.log(flostVal);
          if (exchangeRateArr?.length > 0) {
            for (var i = exchangeRateArr[0]; i <= exchangeRateArr[1]; i++) {
              a.push(i);
            }
            const randomFloat = Math.floor(Math.random() * flostVal?.length);
            const exchangeFloatRate = flostVal[randomFloat];

            const random = Math.floor(Math.random() * a?.length);
            const exchangeRate = a[random];

            this.setState({ exRate: exchangeRate + "." + exchangeFloatRate });
          }

          AsyncStorage.setItem("userKukistorage", JSON.stringify(res.data));
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

  backScreen() {
    this.props.navigation.navigate("ListCookiesScreen");
  }

  componentDidMount() {
    this.getKukiData();

    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.getKukiData();
    });
  }

  async UNSAFE_componentWillMount() {
    let userKukistorage = JSON.parse(
      await AsyncStorage.getItem("userKukistorage")
    );

    if (userKukistorage != null) {
      this.setState({ userKukiData: userKukistorage });
    }
  }

  setpaymentChecked(val) {
    this.setState({ paymentChecked: val });
  }

  handleCallback = (childData) => {
    this.setState({ ishowMOdal: childData });
  };

  render() {
    const {
      userKukiData,
      checked,
      DonateCokie,
      RedeemedCokie,
      loading,
      DonateNumber,
      paymentChecked,
      paymentGChecked,
      paymentPChecked,
      errMsg,
      ishowMOdal,
      exRate,
    } = this.state;

    let cookitQuant = "";
    let redeemMessage = [];
    if (userKukiData?.cookies > 0) {
      cookitQuant = userKukiData?.cookies;

      if (userKukiData?.redeemed_quanity != 0) {
        console.log("Redeemed  - " + userKukiData?.redeemed_quanity);
        redeemMessage.push(
          <View style={styles.RedeemMessageSec}>
            <Text style={styles.jarMainSectionContAS}>
              Kuki awaiting redeem : {userKukiData?.redeemed_quanity}
            </Text>
          </View>
        );
      }
    }

    const redeedRequest = async () => {
      // if (
      //   this.state.paymentChecked == false &&
      //   this.state.paymentGChecked == false &&
      //   this.state.paymentPChecked == false
      // ) {
      //   this.setState({ errMsg: AlertMessages.paymentMthErr });
      //   this.setState({ ishowMOdal: true });
      //   return;
      // }
      if(this.state.RedeemNumber ==""){
        this.setState({ errMsg: "Please enter valid phone number" });
        this.setState({ ishowMOdal: true });
        return;
      }
      let redKuki = 100;
      let redminKuki = 10;
      console.log(RedeemedCokie)
      if (
        RedeemedCokie == "0" ||
        RedeemedCokie == "" ||
        RedeemedCokie > cookitQuant
      ) {
        this.setState({
          errMsg:
            AlertMessages.validQtyErr +
            " You have only " +
            cookitQuant +
            " kuki in your account",
        });
        this.setState({ ishowMOdal: true });
        return;
      } else if (cookitQuant < redKuki) {
        this.setState({ errMsg: AlertMessages.validRedQtyErr });
        this.setState({ ishowMOdal: true });
        return;
      } else if (RedeemedCokie < redKuki) {
        this.setState({ errMsg: AlertMessages.validRedQtyErr });
        this.setState({ ishowMOdal: true });
        return;
      }
      let rmdQty = RedeemedCokie;
      let cookiQty = cookitQuant - RedeemedCokie;
      if (cookiQty <= redminKuki) {
        rmdQty = cookitQuant - redminKuki;
      }

      if (rmdQty < redKuki) {
        this.setState({ errMsg: AlertMessages.validCRedQtMyErr });
        this.setState({ ishowMOdal: true });
        return;
      }

      // let payMethod = "";
      // if (this.state.paymentChecked) {
      //   payMethod = "GPay";
      // }
      // if (this.state.paymentGChecked) {
      //   payMethod = "Paytm";
      // }
      // if (this.state.paymentPChecked == true) {
      //   payMethod = "PhonePe";
      // }
      
      let udata = JSON.parse(await AsyncStorage.getItem("userData"));
      this.setState({ loading: true });
      let data = JSON.stringify({
        user_id: udata.id,
        quantity: rmdQty,
        payMethod: "UPI",
        redeem_rate: exRate,
        redeem_phone: this.state.RedeemNumber,
      });
      console.log(data)
      let headers = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      axios
        .post(Api.apiUrl + "/redeem-cookie-request", data, headers)
        .then((res) => {
          console.log(res)
          this.setState({ loading: false });
          if (res.data.status == "true") {
            this.setState({ errMsg: res.data.message });
            this.setState({ ishowMOdal: true });

            this.setState({ RedeemedCokie: "0" });
            this.setState({ paymentChecked: false });
            this.setState({ paymentGChecked: false });
            this.getKukiData();
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
    };
    const donateRequest = async () => {
      if (DonateNumber == "") {
        this.setState({ errMsg: AlertMessages.phoneNumberErr });
        this.setState({ ishowMOdal: true });
        return;
      }

      if (DonateCokie == "0" || DonateCokie > cookitQuant) {
        this.setState({
          errMsg:
            AlertMessages.validQtyErr +
            " You have only " +
            cookitQuant +
            " kuki in your account",
        });
        this.setState({ ishowMOdal: true });
        return;
      } else if (cookitQuant <= 10) {
        this.setState({ errMsg: AlertMessages.validGRedQtyErr });
        this.setState({ ishowMOdal: true });
        return;
      } else if (DonateCokie < 10) {
        this.setState({ errMsg: AlertMessages.validGCRedQtyErr });
        this.setState({ ishowMOdal: true });
        return;
      }
      let rmdQty = DonateCokie;
      let cookiQty = cookitQuant - DonateCokie;
      if (cookiQty <= 10) {
        rmdQty = cookitQuant - 10;
      }

      if (rmdQty < 10) {
        this.setState({ errMsg: AlertMessages.validGCRedQtyErr });
        this.setState({ ishowMOdal: true });
        return;
      }

      let udata = JSON.parse(await AsyncStorage.getItem("userData"));
      this.setState({ loading: true });
      let data = JSON.stringify({
        user_id: udata.id,
        quantity: rmdQty,
        phone_number: DonateNumber,
      });
      console.log(data);
      let headers = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      axios
        .post(Api.apiUrl + "/donate-cookie-request", data, headers)
        .then((res) => {
          this.setState({ loading: false });
          if (res.data.status == "true") {
            this.getKukiData();
            this.setState({ errMsg: AlertMessages.donateKMsg });
            this.setState({ ishowMOdal: true });
            this.setState({ errMsg: res.data.message });
            this.setState({ ishowMOdal: true });
            this.getKukiData();
            this.setState({ DonateCokie: "0" });
            this.setState({ DonateNumber: "" });
          } else {
            this.setState({ errMsg: res.data.message });
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
    const handleSubmitPress = () => {};

    return (
      <View style={{ flex: 1, height: "100%", backgroundColor: "#fff" }}>
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
              keyboardVerticalOffset={Platform.OS === "ios" ? 150 : -180}
            >
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
                <Text style={styles.SectionHeadStyle}>Kuki Jar</Text>
              </View>

              <View style={styles.mainStection}>
                <View style={styles.jarMainSection}>
                  <View style={styles.jarStection}>
                    {cookitQuant == "" && (
                      <Image
                        source={require("../../../assets/images/eptzar.jpg")}
                        style={[
                          {
                            resizeMode: "contain",
                            width: 87,
                            height: 103,
                          },
                          styles.imgIcon,
                        ]}
                      />
                    )}
                    {cookitQuant != "" && (
                      <Image
                        source={require("../../../assets/images/kuki_jar_final.jpg")}
                        style={[
                          {
                            resizeMode: "contain",
                            width: 87,
                            height: 103,
                          },
                          styles.imgIcon,
                        ]}
                      />
                    )}
                  </View>
                  {cookitQuant == "" && (
                    <View style={styles.jarContentStection}>
                      <Text style={[styles.jarMainSectionCont]}>
                        <Text style={styles.jarMainSectionCont}>Kuki</Text> in
                        your Kuki Jar : 0{" "}
                      </Text>
                    </View>
                  )}
                  {cookitQuant != "" && (
                    <View style={styles.jarContentStection}>
                      <Text style={[styles.jarMainSectionCont]}>
                        <Text style={styles.jarMainSectionCont}>Kuki</Text> in
                        your Kuki Jar : {cookitQuant}
                      </Text>

                      {redeemMessage}
                    </View>
                  )}
                </View>

                <View style={styles.OuterBoxSec}>
                  <Text style={[styles.receivedCookieText, { width: 170 }]}>
                    Redeem Kukies for Cash
                  </Text>
                  <View style={styles.bannerStection}>
                    {/*<Text style={styles.inviteCont}>Redeem cash against your cookies</Text>*/}
                    <Text style={styles.inviteCont}>
                      Kuki Redeem Rate is INR {exRate}
                    </Text>
                  </View>
                  <View style={styles.numbrsareSec}>
                    {/*<Text style={styles.donteContent}>Gift Kukies to a Loved one</Text>*/}

                    <View style={styles.BottonSection}>
                      <View style={styles.buttonEarnStyleOuterSec}>
                        <Image
                          source={require("../../../assets/images/icons/graycookie.png")}
                          style={[
                            {
                              resizeMode: "contain",
                              width: 20,
                              height: 18,
                            },
                          ]}
                        />
                        <TextInput
                          style={styles.inputStyle}
                          onChangeText={(Kuki) =>
                            this.setState({RedeemedCokie:Kuki})
                          }
                          value={RedeemedCokie} //dummy@abc.com
                          placeholderTextColor={AppStyle.fontColor}
                          autoCapitalize="none"
                          maxLength={3}
                          returnKeyType="next"
                          keyboardType="number-pad"
                        />
                      </View>

                      <View style={styles.buttonnumberOuterStyle}>
                        <TextInput
                          style={styles.inputdStyle}
                          onChangeText={(number) =>
                            this.setState({ RedeemNumber: number })
                          }
                          placeholder="UPI Phone Number" //dummy@abc.com
                          value={this.state.RedeemNumber} //dummy@abc.com
                          placeholderTextColor={AppStyle.fontColor}
                          autoCapitalize="none"
                          maxLength={10}
                          returnKeyType="next"
                          keyboardType="number-pad"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.donatebtn}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={redeedRequest}
                    >
                       <LinearGradient
                          // Button Linear Gradient
                          colors={[
                            AppStyle.gradientColorOne,
                            AppStyle.gradientColorTwo,
                          ]}
                          style={styles.buttonnumberStyle}
                        >
                          <Text style={styles.buttonTextStyle}>Redeem </Text>
                          <FontAwesome
                            name={"angle-right"}
                            size={20}
                            color={AppStyle.fontColor}
                          />
                        </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.OuterBoxSec}>
                  <Text style={[styles.receivedCookieText, { width: 88 }]}>
                    Gift kukies
                  </Text>

                  <View style={styles.numbrsareSec}>
                    {/*<Text style={styles.donteContent}>Gift Kukies to a Loved one</Text>*/}

                    <View style={styles.BottonSection}>
                      <View style={styles.buttonEarnStyleOuterSec}>
                        <Image
                          source={require("../../../assets/images/icons/graycookie.png")}
                          style={[
                            {
                              resizeMode: "contain",
                              width: 20,
                              height: 18,
                            },
                          ]}
                        />
                        <TextInput
                          style={styles.inputStyle}
                          onChangeText={(Kuki) =>
                            this.setState({ DonateCokie: Kuki })
                          }
                          value={DonateCokie} //dummy@abc.com
                          placeholderTextColor={AppStyle.fontColor}
                          autoCapitalize="none"
                          maxLength={3}
                          returnKeyType="next"
                          keyboardType="number-pad"
                        />
                      </View>

                      <View style={styles.buttonnumberOuterStyle}>
                        <TextInput
                          style={styles.inputdStyle}
                          onChangeText={(Kuki) =>
                            this.setState({ DonateNumber: Kuki })
                          }
                          placeholder="Gift Phone Number" //dummy@abc.com
                          value={DonateNumber} //dummy@abc.com
                          placeholderTextColor={AppStyle.fontColor}
                          autoCapitalize="none"
                          maxLength={10}
                          returnKeyType="next"
                          keyboardType="number-pad"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.donatebtn}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={donateRequest}
                    >
                      <LinearGradient
                        // Button Linear Gradient
                        colors={[
                          AppStyle.gradientColorOne,
                          AppStyle.gradientColorTwo,
                        ]}
                        style={styles.buttonStyle}
                      >
                        <Text style={styles.buttonTextStyleSec}>Gift</Text>
                        <View style={styles.buttonGiftStyleSec}>
                          <Image
                            source={require("../../../assets/images/gift.png")}
                            style={[
                              {
                                resizeMode: "contain",
                                width: 23,
                                height: 23,
                              },
                              styles.imgIcon,
                            ]}
                          />
                        </View>
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
export default CookieZarScreen;

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
  topheadSection: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 15,
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
  mainStection: {
    width: "100%",
    marginTop: 5,
    justifyContent: "center",
  },
  SectionHeadStyle: {
    fontSize: AppStyle.aapPageHeadingSize,
    fontFamily: "GlorySemiBold",
    fontWeight: "400",
    color: AppStyle.fontColor,
    marginLeft: 20,
  },
  bannerStection: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  OuterBoxSec: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: AppStyle.appIconColor,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 20,
  },
  jarStection: {
    width: "20%",
  },
  jarMainSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  RedeemMessageText: {
    fontSize: 16,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,
    paddingLeft: 30,
    lineHeight: 24,
  },
  jarMainSectionCont: {
    fontSize: 18,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,
    paddingLeft: 30,
    lineHeight: 24,
  },
  jarMainSectionContAS: {
    fontSize: 18,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,
    paddingLeft: 30,
    lineHeight: 24,
  },
  jarMainColorSectionCont: {
    fontSize: 19,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.appIconColor,
  },
  jarContentStection: {
    width: "80%",
    justifyContent: "flex-start",
  },
  inviteCont: {
    fontSize: 14,
    fontFamily: "Abel",
    fontWeight: "400",

    color: AppStyle.fontColor,
    width: "90%",

    textAlign: "center",
    lineHeight: 23,
  },
  inviteContd: {
    fontSize: 14,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,

    width: "90%",
    marginTop: 5,
    textAlign: "center",
    lineHeight: 23,
  },
  inviteDownCont: {
    fontSize: 15,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,
    marginTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: "center",
  },
  numbrsareSec: {
    flex: 1,
    width: "100%",
  },
  sharenumbCont: {
    fontSize: 15,
    fontFamily: "Abel",
    fontWeight: "400",
    color: "rgba(253, 139, 48, 0.69)",
    marginTop: 15,
    paddingLeft: 12,
    paddingRight: 12,
    textAlign: "center",
  },
  BottonSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  buttonEarnStyleOuter: {
    backgroundColor: "#F3F3F3",
    paddingLeft: 25,
    paddingRight: 25,

    flexDirection: "row",
    borderRadius: 15,
    width: "48%",
    alignItems: "center",
  },
  buttonnumberStyle: {
    paddingTop: AppStyle.buttonTBPadding,
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: AppStyle.buttonTBPadding,
    flexDirection: "row",
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonnumberOuterStyleFirst: {
    flexDirection: "row",
    borderRadius: 15,
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  buttonnumberOuterStyle: {
    paddingTop: 12,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 12,
    flexDirection: "row",
    borderRadius: 15,
    width: "60%",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
  },
  buttonEarnStyleOuterSec: {
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "row",
    borderRadius: 15,
    width: "38%",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    justifyContent: "center",
  },
  buttonEarnStyle: {
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 15,
    flexDirection: "row",
    width: "48%",

    justifyContent: "space-around",
  },
  inputStyle: {
    color: AppStyle.fontColor,
    paddingLeft: 15,
    width: "70%",
    paddingRight: 15,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    fontFamily: "Abel",
    fontSize: 15,
  },
  inputdStyle: {
    width: "100%",
    fontSize: 15,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    fontFamily: "Abel",
    color: AppStyle.fontColor,
  },
  buttonTextStyle: {
    fontSize: 18,
    fontFamily: "GlorySemiBold",
    fontWeight: "400",
    color: AppStyle.fontColor,
    marginRight: 8,
  },
  buttonGiftStyleSec: {
    marginTop: -5,
  },
  buttonTextStyleSec: {
    fontSize: 18,
    fontFamily: "GlorySemiBold",
    fontWeight: "400",
    color: AppStyle.fontColor,
    marginRight: 8,
  },
  donteContent: {
    fontSize: 16,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,
    textAlign: "center",
  },
  donatebtn: {
    marginTop: 15,
  },
  buttonStyle: {
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#dadae8",
    alignItems: "center",
    borderRadius: 15,
    flexDirection: "row",
    paddingTop: AppStyle.buttonTBPadding,
    paddingBottom: AppStyle.buttonTBPadding,
    textAlign: "center",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  pyamentCheckSec: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
  },
  pyamentCheckSecLeft: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pyamentCheckSecRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pyamentCheckText: {
    fontSize: 18,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,
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
});
