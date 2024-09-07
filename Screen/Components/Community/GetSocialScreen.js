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
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Feather } from "@expo/vector-icons";

import AppStyle from "../../Constants/AppStyle.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CookieNavigationScreen from "../Common/CookieNavigationScreen";
import axios from "axios";
import Api from "../../Constants/Api.js";
class GetSocialScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: "",
      selectedMValCont: "",
      selectedFValCont: "",
      isguruSelected: "0",
    };
    AsyncStorage.setItem("activeClass", "COactiveClass");
  }
  createAlert = (FirstName) =>
    Alert.alert("Required", FirstName, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);

  async getUserData(isType = null) {
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    let postState = await AsyncStorage.getItem("postState");
    let postCity = await AsyncStorage.getItem("postCity");
    console.log("used " + udata.id);
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
      .post(Api.apiUrl + "/get-user-detail", data, headers)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data.status == "true") {
          console.log(res.data.data.user_detail);
          this.setState({ isguruSelected: res.data.data.user_detail.guru_id });
        } else {
          console.log(error);
          this.state.loading = false;
        }
      })
      .catch((error) => {
        console.log(error);
        this.state.loading = false;
      });
  }

  async deleteExpPosts() {
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
      .post(Api.apiUrl + "/delete-exp-post", data, headers)
      .then((res) => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
        this.state.loading = false;
      });
  }

  checkVal(val) {
    this.setState({ checked: val });
    if (val == "2") {
      this.setState({
        selectedMValCont: "selectdVal",
      });
      this.setState({
        selectedFValCont: "",
      });
    } else if (val == "1") {
      this.setState({
        selectedFValCont: "selectdVal",
      });
      this.setState({
        selectedMValCont: "",
      });
    }
    this.props.navigation.push("CommunityBoardScreen", {
      category_id: val,
    });
  }

  getSpiritual() {
    console.log(this.state.isguruSelected);
    return false;
    this.props.navigation.push("SpiritualScreen", {
      isguruSelectedVal: this.state.isguruSelected,
    });
  }

  componentDidMount() {
    this.getUserData();
    this.deleteExpPosts();
  }

  render() {
    const { checked, selectedMValCont, selectedFValCont } = this.state;

    const handleSubmitPress = () => {
      if (!this.state.checked) {
        this.createAlert("Select Group");

        return;
      }
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
              <Text style={styles.SectionHeadStyle}>Get Connected</Text>

              {/* <Text style={styles.SectionsubHeadStyle}>Select Social Discussions Group</Text> */}
              <View style={styles.topheadSection}>
                <Image
                  source={require("../../../assets/images/social_banner.jpg")}
                  style={{
                    marginBottom: 20,
                    resizeMode: "contain",
                    width: "90%",
                    height: 270,
                  }}
                />
              </View>
              <View style={styles.otterSocialSec}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this.checkVal.bind(this, "2")}
                >
                  <LinearGradient
                    // Button Linear Gradient
                    colors={[
                      AppStyle.gradientColorOne,
                      AppStyle.gradientColorTwo,
                    ]}
                    style={styles.selectionContainer}
                  >
                    <Text style={styles.SectioninnrsubHeadStyle}>
                      Social Connect
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* <Text style={styles.SectionsubSecHeadStyle}>Select Professional Discussions Group</Text> */}

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this.checkVal.bind(this, "1")}
                >
                  <LinearGradient
                    // Button Linear Gradient
                    colors={[
                      AppStyle.gradientColorOne,
                      AppStyle.gradientColorTwo,
                    ]}
                    style={styles.selectionContainer}
                  >
                    <Text style={styles.SectioninnrsubHeadStyle}>
                      Professional Connect
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this.getSpiritual.bind(this, "1")}
                >
                  <LinearGradient
                    // Button Linear Gradient
                    colors={[
                      AppStyle.gradientColorOne,
                      AppStyle.gradientColorTwo,
                    ]}
                    style={styles.selectionContainer}
                  >
                    <Text style={styles.SectioninnrsubHeadStyle}>
                      Spiritual Connect
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <CookieNavigationScreen navigation={this.props.navigation} />
      </View>
    );
  }
}
export default GetSocialScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,

    backgroundColor: AppStyle.appColor,

    paddingBottom: AppStyle.appInnerBottomPadding,
    paddingTop: AppStyle.appInnerTopPadding,
    height: "100%",
  },
  otterSocialSec: {
    paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
  },
  ContentHeadStyle: {
    marginBottom: 20,
  },
  skipSection: {
    color: "rgba(253, 139, 48, 0.69)",
    fontSize: 16,
  },
  topheadSection: {
    alignItems: "center",
  },
  backIconsCont: {
    borderWidth: 1,
    borderColor: "#E8E6EA",
    borderRadius: 15,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  innerSubsec: {
    marginTop: 15,
  },
  mainStection: {
    width: "100%",
  },
  SectionHeadStyle: {
    paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
    fontSize: 27,
    fontFamily: "GlorySemiBold",
    marginBottom: 25,

    color: AppStyle.fontColor,
  },
  SectionsubHeadStyle: {
    fontSize: 18,
    fontFamily: "Abel",
    marginBottom: 10,
    color: AppStyle.fontColor,
  },
  SectionsubSecHeadStyle: {
    fontSize: 18,
    fontFamily: "Abel",
    marginTop: 10,
    marginBottom: 10,
    color: AppStyle.fontColor,
  },
  SectioninnrsubHeadStyle: {
    fontSize: AppStyle.buttonFontsize,
    fontFamily: "GlorySemiBold",

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
  btnCont: {
    position: "absolute",
    paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
    bottom: 60,
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
