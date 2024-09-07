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
  TouchableHighlight,
  KeyboardAvoidingView,
} from "react-native";

import AppStyle from "../../Constants/AppStyle.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CookieNavigationScreen from "../Common/CookieNavigationScreen";
import { LinearGradient } from "expo-linear-gradient";

const pesodata = [
  {
    key: "Artist",
    icon: require("../../../assets/images/icons/camera.png"),
    isSelect: false,
    selectedClass: "flatMainsection",
  },
  {
    key: "Creative",
    icon: require("../../../assets/images/icons/weixin-market.png"),
    isSelect: false,
    selectedClass: "flatMainsection",
  },
  {
    key: "Simple",
    icon: require("../../../assets/images/icons/voice.png"),
    isSelect: false,
    selectedClass: "flatMainsection",
  },
  {
    key: "Foodie",
    icon: require("../../../assets/images/icons/viencharts.png"),
    isSelect: false,
    selectedClass: "flatMainsection",
  },
  {
    key: "Cooking Freak",
    icon: require("../../../assets/images/icons/noodles.png"),
    selectedClass: "flatMainsection",
  },
  {
    key: "Day dreamer",
    icon: require("../../../assets/images/icons/tennis.png"),
    selectedClass: "flatMainsection",
  },
  {
    key: "Fitness Freak",
    icon: require("../../../assets/images/icons/sport.png"),
    selectedClass: "flatMainsection",
  },
  {
    key: "Swimming",
    icon: require("../../../assets/images/icons/ripple.png"),
    selectedClass: "flatMainsection",
  },
  {
    key: "Art",
    icon: require("../../../assets/images/icons/Art.png"),
    selectedClass: "flatMainsection",
  },
  {
    key: "Traveling",
    icon: require("../../../assets/images/icons/outdoor.png"),
    selectedClass: "flatMainsection",
  },
  {
    key: "Extreme",
    icon: require("../../../assets/images/icons/parachute.png"),
    selectedClass: "flatMainsection",
  },
  {
    key: "Music",
    icon: require("../../../assets/images/icons/music.png"),
    selectedClass: "flatMainsection",
  },
  {
    key: "Drink",
    icon: require("../../../assets/images/icons/goblet-full.png"),
    selectedClass: "flatMainsection",
  },
  {
    key: "Video games",
    icon: require("../../../assets/images/icons/game-handle.png"),
    selectedClass: "flatMainsection",
  },
];

class ListCookiesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: "male",
      selectedMValCont: "",
      selectedFValCont: "",
      selectedOValCont: "",
    };
    AsyncStorage.setItem("activeClass", "FactiveClass");
  }

  createAlert = (FirstName) =>
    Alert.alert("Required", FirstName, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);

  checkVal(val, stVal) {
    this.props.navigation.push(val);
  }

  render() {
    const { checked, selectedMValCont, selectedFValCont, selectedOValCont } =
      this.state;

    const handleSubmitPress = () => {
      if (!this.state.setChecked) {
        this.createAlert("Selected");

        return;
      }
      this.props.navigation.navigate("UserstatusScreen");
    };
    return (
      <View style={{ flex: 1, height: "100%" }}>
        <ScrollView
          style={{ backgroundColor: "#fff" }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <View style={styles.mainBody}>
            <View style={styles.mainStection}>
              <View style={styles.topheadStection}>
                <Text style={styles.SectionHeadStyle}>My Kukies</Text>
              </View>

              <View style={styles.topheadStectionjar}>
                <Image
                  source={require("../../../assets/images/kuki_jar_final.jpg")}
                  style={[
                    {
                      resizeMode: "contain",
                      width: "65%",
                      height: 190,
                    },
                  ]}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  this.checkVal("CookieZarScreen", "selectedMValCont")
                }
              >
                <LinearGradient
                  // Button Linear Gradient
                  colors={[
                    AppStyle.gradientColorOne,
                    AppStyle.gradientColorTwo,
                  ]}
                  style={styles.selectionContainer}
                >
                  <Text style={styles.cookexText}>Kuki Jar</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  this.checkVal("SentCookiesScreen", "selectedMValCont")
                }
              >
                <LinearGradient
                  // Button Linear Gradient
                  colors={[
                    AppStyle.gradientColorOne,
                    AppStyle.gradientColorTwo,
                  ]}
                  style={styles.selectionContainer}
                >
                  <Text style={styles.cookexText}>Sent Kukies</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  this.checkVal("ReceivedCookiesScreen", "selectedFValCont")
                }
              >
                <LinearGradient
                  // Button Linear Gradient
                  colors={[
                    AppStyle.gradientColorOne,
                    AppStyle.gradientColorTwo,
                  ]}
                  style={styles.selectionContainer}
                >
                  <Text style={styles.cookexText}>Received Kukies</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* <TouchableOpacity activeOpacity={0.9} onPress={() => this.checkVal('BlockedCookiesScreen','selectedOValCont')}><LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={styles.selectionContainer}>
              
                <Text style={styles.cookexText}>Blocked Kukies</Text>
                  
                              
              </LinearGradient></TouchableOpacity> */}

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  this.checkVal("ArchivedCookiesScreen", "selectedOValCont")
                }
              >
                <LinearGradient
                  // Button Linear Gradient
                  colors={[
                    AppStyle.gradientColorOne,
                    AppStyle.gradientColorTwo,
                  ]}
                  style={styles.selectionContainer}
                >
                  <Text style={styles.cookexText}>Archived Kukies</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <CookieNavigationScreen navigation={this.props.navigation} />
      </View>
    );
  }
}
export default ListCookiesScreen;

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
  topheadStectionjar: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
  },
  topheadStection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ContentHeadStyle: {
    marginBottom: 20,
  },
  mainStection: {
    width: "100%",
  },
  SectionHeadStyle: {
    fontSize: AppStyle.aapPageHeadingSize,
    fontFamily: "GlorySemiBold",
    marginBottom: 35,
    color: AppStyle.fontColor,
  },
  selectionContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    borderColor: "#E8E6EA",
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 15,
  },
  selectionSearchContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 25,
    paddingBottom: 25,
    borderColor: "#E8E6EA",
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 15,
    backgroundColor:
      "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)",
  },
  cookexText: {
    fontFamily: "GlorySemiBold",
    fontSize: AppStyle.buttonFontsize,
    color: AppStyle.fontColor,
  },
  selectedMValCont: {
    backgroundColor:
      "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)",
  },
  selectedFValCont: {
    backgroundColor:
      "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)",
  },
  selectedOValCont: {
    backgroundColor:
      "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)",
  },
  selectedCoValCont: {
    backgroundColor:
      "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)",
  },
  btnCont: {
    position: "absolute",
    paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
    bottom: 10,
    left: 0,
    right: 0,
  },
  buttonStyle: AppStyle.AppbuttonStyle,
  buttonTextStyle: {
    color: "#FFFFFF",
    fontSize: AppStyle.buttonFontsize,
    fontFamily: "Abel",
  },

  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
});
