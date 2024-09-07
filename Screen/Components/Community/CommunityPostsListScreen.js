// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, Component } from "react";
import { Picker } from "@react-native-picker/picker";

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
  Pressable,
  Alert,
  KeyboardAvoidingView,
} from "react-native";

import AppStyle from "../../Constants/AppStyle.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountryPicker from "react-native-country-codes-picker";
import { useNavigation, NavigationContainer } from "@react-navigation/native";
import CookieNavigationScreen from "../Common/CookieNavigationScreen";

class CommunityPostsListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCommunityValue: "",
      selectedStateValue: "",
      selectedCityValue: "",
    };
    AsyncStorage.setItem("activeClass", "COactiveClass");
  }
  createAlert = (FirstName) =>
    Alert.alert("Required", FirstName, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);

  setSelectedValue(itmVal, type) {
    if (type == "community") {
      this.setState({ selectedCommunityValue: itmVal });
    } else if (type == "State") {
      this.setState({ selectedStateValue: itmVal });
    } else if (type == "city") {
      this.setState({ selectedCityValue: itmVal });
    }
  }

  savePost() {
    this.props.navigation.navigate("CommunityPostsListScreen");
  }

  addHashtag() {}

  backScreen() {
    this.props.navigation.navigate("CommunityBoardScreen");
  }

  render() {
    const { selectedCommunityValue, selectedStateValue, selectedCityValue } =
      this.state;

    const setTopic = (val) => {};

    const setDescription = (val) => {};
    const handleSubmitPress = () => {
      if (!this.state.selectedAgeValue) {
        this.createAlert("Please Select Your Age");

        return;
      } else if (!this.state.selectedStateValue) {
        this.createAlert("Please Select Your State");

        return;
      } else if (!this.state.selectedCityValue) {
        this.createAlert("Please Select Your City");

        return;
      }
      this.props.navigation.navigate("CommunityPostScreen");
    };

    const postsData = [];
    for (var i = 0; i < 3; i++) {
      postsData.push(
        <View style={styles.innerPostsSec} key={i}>
          <Text style={styles.postTitlesection}>
            What are the characteristics of a fake job call form?
          </Text>
          <Text style={styles.postContentsection}>
            Because I always find fake job calls so I'm confused which job to
            take can you share your knowledge here? thank you
          </Text>

          <View style={styles.postReviewsSec}>
            <View style={styles.postReviewsInnerSec}>
              <Pressable
                onPress={() => {
                  this.backScreen();
                }}
                style={({ pressed }) => [
                  {
                    color: pressed ? "rgb(210, 230, 255)" : "white",
                  },
                  styles.wrapperCustom,
                ]}
              >
                <Image
                  source={require("../../../assets/images/icons/love.png")}
                  style={[
                    {
                      resizeMode: "contain",
                      width: 18,
                    },
                    styles.imgIcon,
                  ]}
                />
              </Pressable>

              <Text style={styles.cmtCount}>21</Text>
            </View>

            <View style={styles.postReviewsInnerSec}>
              <Pressable
                onPress={() => {
                  this.backScreen();
                }}
                style={({ pressed }) => [
                  {
                    color: pressed ? "rgb(210, 230, 255)" : "white",
                  },
                  styles.wrapperCustom,
                ]}
              >
                <Image
                  source={require("../../../assets/images/icons/messages.png")}
                  style={[
                    {
                      resizeMode: "contain",
                      width: 18,
                    },
                    styles.imgIcon,
                  ]}
                />
              </Pressable>

              <Text style={styles.cmtCount}>21</Text>
            </View>

            <View style={styles.postReviewsInnerSec}>
              <Pressable
                onPress={() => {
                  this.backScreen();
                }}
                style={({ pressed }) => [
                  {
                    color: pressed ? "rgb(210, 230, 255)" : "white",
                  },
                  styles.wrapperCustom,
                ]}
              >
                <Image
                  source={require("../../../assets/images/icons/attachment.png")}
                  style={[
                    {
                      resizeMode: "contain",
                      width: 18,
                    },
                    styles.imgIcon,
                  ]}
                />
              </Pressable>
            </View>

            <View style={styles.postReviewsInnerSec}>
              <Pressable
                onPress={() => {
                  this.backScreen();
                }}
                style={({ pressed }) => [
                  {
                    color: pressed ? "rgb(210, 230, 255)" : "white",
                  },
                  styles.wrapperCustom,
                ]}
              >
                <Image
                  source={require("../../../assets/images/icons/forword.png")}
                  style={[
                    {
                      resizeMode: "contain",
                      width: 18,
                    },
                    styles.imgIcon,
                  ]}
                />
              </Pressable>

              <Text style={styles.cmtCount}>2</Text>
            </View>
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, height: "100%" }}>
        <ScrollView>
          <View style={styles.mainBody}>
            <View style={styles.topHeadsection}>
              <View>
                <Pressable
                  onPress={() => {
                    this.backScreen();
                  }}
                  style={({ pressed }) => [
                    {
                      color: pressed ? "rgb(210, 230, 255)" : "white",
                    },
                    styles.wrapperCustom,
                  ]}
                >
                  <Image
                    source={require("../../../assets/images/icons/Arrow-Left.png")}
                    style={[
                      {
                        resizeMode: "contain",
                        width: 18,
                      },
                      styles.imgIcon,
                    ]}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.mainContentsection}>
              <View style={styles.innserSecBio}>
                <Image
                  source={require("../../../assets/images/photodummy.png")}
                  style={[
                    {
                      resizeMode: "contain",
                      width: 58,
                    },
                    styles.imgIcon,
                  ]}
                />
                <View style={styles.userSecBio}>
                  <Text style={styles.userheadSecBio}>Arnold Leonardo</Text>
                  <Text style={styles.usercontSecBio}>21 minuts ago</Text>
                </View>
              </View>

              {postsData}
            </View>
          </View>
        </ScrollView>
        <CookieNavigationScreen navigation={this.props.navigation} />
      </View>
    );
  }
}
export default CommunityPostsListScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: AppStyle.appColor,
    paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
    paddingBottom: AppStyle.appInnerBottomPadding,
    paddingTop: AppStyle.appInnerTopPadding,
    backgroundColor: "#fff",
    height: "100%",
  },
  topHeadsection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topheadHeading: {
    color: "#FF9228",
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Abel",
  },
  mainContentsection: {
    marginTop: 15,
  },
  innserSecBio: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  userSecBio: {
    marginLeft: 10,
  },
  userheadSecBio: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Abel",
  },
  usercontSecBio: {
    color: "#AAA6B9",
    fontSize: 10,
    fontWeight: "400",
    fontFamily: "Abel",
  },
  postTitlesection: {
    color: "rgba(253, 139, 48, 0.69)",
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "Abel",
    marginBottom: 5,
  },
  postContentsection: {
    color: "#000",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Abel",
    marginBottom: 5,
  },
  innerPostsSec: {
    backgroundColor: "#fff",
    marginTop: 15,
  },
  innerPostsSec: {
    backgroundColor: "#fff",
    marginTop: 15,
  },
  postReviewsSec: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  postReviewsInnerSec: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  cmtCount: {
    color: "#FF9228",
    fontSize: 10,
    fontWeight: "400",
    fontFamily: "Abel",
    marginLeft: 6,
  },
});
