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
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AppStyle from "../../Constants/AppStyle.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountryPicker from "react-native-country-codes-picker";
import { useNavigation, NavigationContainer } from "@react-navigation/native";
import axios from "axios";
import Api from "../../Constants/Api.js";
import CookieNavigationScreen from "../Common/CookieNavigationScreen";
import Loader from "../../Components/Loader";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import AlertMessages from "../../Constants/AlertMessages.js";
import UseAlertModal from "../Common/UseAlertModal";

class CommunityPostScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DescriptionVal: "",
      postTitle: "",
      urlVal: "",
      loading: false,
      itemsData: [],
      selectedItems: [],
      selectedProfestionValue: [],
      userDetail: {},
      userData: {},
      stateData: {},
      cityData: {},
      communityData: {},
      Urating: 0,
      countryData: {},
      modalVisible: false,
      imgaeData: null,
      imgaeDataBase64: null,
      cityId: "",
      errMsg: "Error",
      ishowMOdal: false,
      prfgroupValState: "",
      prfSelctTxt: "Select a Topic...",
      selectedGroupText: "Select a Topic",
      grpHeading: "Social",
      prfsSelctTxt: "Search topic",
    };
  }

  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedProfestionValue: selectedItems });
  };

  pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [10, 10],
      quality: 1,
      //base64: true,
    });

    console.log(result.assets);

    if (!result.canceled) {
      this.setState({ imgaeDataBase64: result });
      this.setState({ imgaeData: result.assets[0].uri });
    }
  };

  UrlSec() {
    this.setState({ modalVisible: true });
  }

  async getUserData() {
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
      .post(Api.apiUrl + "/get-user-detail", data, headers)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data.status == "true") {
          //console.log(res.data.user_detail);
          this.setState({ userDetail: res.data.data.user_detail });
          this.setState({ userData: res.data.data.user_detail.user });
          this.setState({
            countryData: res.data.data.user_detail.country_data,
          });
          this.setState({ stateData: res.data.data.user_detail.state_data });
          this.setState({ cityData: res.data.data.user_detail.city_data });
          this.setState({ communityData: res.data.data.communities });
          this.setState({ Urating: res.data.data.rating });
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

  setSelectedValue(itmVal, type) {
    if (type == "community") {
      this.setState({ selectedCommunityValue: itmVal });
    } else if (type == "State") {
      this.setState({ selectedStateValue: itmVal });
    } else if (type == "city") {
      this.setState({ selectedCityValue: itmVal });
    }
  }

  async savePost() {
    // if (this.state.selectedProfestionValue.length == 0) {
    //   const cat_data = this.props.route.params.category_id;
    //   if (cat_data == "1") {
    //     this.setState({ errMsg: AlertMessages.professionalPostErr });
    //     this.setState({ ishowMOdal: true });
    //     return;
    //   } else {
    //     this.setState({ errMsg: AlertMessages.socialPostErr });
    //     this.setState({ ishowMOdal: true });
    //     return;
    //   }
    // } else if (this.state.DescriptionVal == "") {
    //   this.setState({ errMsg: AlertMessages.postDescErr });
    //   this.setState({ ishowMOdal: true });

    //   return;
    // }

    this.setState({ loading: true });
    let postCity = JSON.parse(await AsyncStorage.getItem("postCity"));
    const cat_data = this.props.route.params.category_id;

    let formData = new FormData();
    let preVvalue = this.state.userSignupDataObj;
    let imgpostData = this.state.imgaeDataBase64;
    if (imgpostData !== null) {
      let localUri = imgpostData.assets[0].uri;
      let filename = localUri.split("/").pop();
      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      // Assume "photo" is the name of the form field the server expects
      formData.append("photo", { uri: localUri, name: filename, type });
    }
    // formData.append("group_id", this.state.selectedProfestionValue.toString());
    formData.append("guru_id", this.state.userDetail.guru_id);
    formData.append("city_id", postCity.id);
    formData.append("user_id", this.state.userDetail.user_id);
    //formData.append('title',this.state.postTitle);
    formData.append("title", "");
    formData.append("description", this.state.DescriptionVal);
    formData.append("post_url", this.state.urlVal);
    formData.append("group_category_id", cat_data);

    const token = await AsyncStorage.getItem("fcmtoken");
    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        enctype: "multipart/form-data",
      },
    };
    axios
      .post(Api.apiUrl + "/save-community-post", formData, headers)
      .then((res) => {
        this.setState({ loading: false });
        this.props.navigation.navigate("CommunityBoardScreen", {
          category_id: cat_data,
          guru_id_from_back:this.state.userDetail.guru_id
        });
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

  setModalVisible() {
    this.setState({ modalVisible: false });
  }
  addUrl() {
    this.setState({ modalVisible: false });
  }

  addHashtag() {}

  backScreen() {
    this.props.navigation.navigate("CommunityBoardScreen", {
      category_id: this.props.route.params.category_id,
    });
  }

  getPrfessionalList = async () => {
    this.setState({ loading: true });
    const cat_data = this.props.route.params.category_id;
    let data = JSON.stringify({
      category_id: cat_data,
    });

    const token = await AsyncStorage.getItem("fcmtoken");
    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authentication: `Bearer ${token}`,
      },
    };
    axios
      .post(Api.apiUrl + "/get-community", data, headers)
      .then((res) => {
        this.setState({ loading: false });
        this.setState({ itemsData: res.data.data });
        let prVal = this.props.route.params.prf_groupVal;
        if (prVal != "N") {
          let resData = res.data.data;
          for (var i = 0; i < resData.length; i++) {
            this.setState({ selectedProfestionValue: prVal });
            if (resData[i]["id"] == prVal) {
              this.setState({ selectedGroupText: resData[i]["name"] });
            }
          }
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

  componentDidMount() {
    this.getPrfessionalList();
    this.getUserData();
    const cat_data = this.props.route.params.category_id;
    if (cat_data == "1") {
      this.setState({ grpHeading: "Professional" });
      this.setState({ selectedGroupText: "Select a professional group" });
      this.setState({ prfsSelctTxt: "Search professional group" });
    }

    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.getPrfessionalList();
      this.getUserData();
      //Put your Data loading function here instead of my this.loadData()
    });
  }

  handleCallback = (childData) => {
    this.setState({ ishowMOdal: childData });
  };

  render() {
    const {
      DescriptionVal,
      urlVal,
      loading,
      selectedProfestionValue,
      selectedItems,
      itemsData,
      userDetail,
      userData,
      countryData,
      stateData,
      cityData,
      modalVisible,
      imgaeData,
      postTitle,
      communityData,
      prfsSelctTxt,
      Urating,
      errMsg,
      ishowMOdal,
      selectedGroupText,
      grpHeading,
    } = this.state;

    const setTopic = (val) => {};

    let isSameguru = false;
    /* if(userDetail.guru_id != '0'){
       isSameguru = true;
    }

    let isSameguru = false;
    if(userDetail.guru_id != '0' && userDetail.guru_id != userDetail.user_id){
       isSameguru = true;
    }*/

    let userImg = [];
    if (userDetail.user_profile_image != null) {
      userImg.push(
        <View key="post_user_image" style={styles.outerImgSection}>
          <Image
            key="1"
            // source={{ uri: `${userDetail.user_profile_image}` }}
            source={{ uri: `${Api.imgaePath}/${userDetail.user_profile_image}` }}

            style={styles.imagetopCont}
          />
        </View>
      );
    } else {
      userImg.push(
        <View key="post_user_image" style={styles.outerImgSection}>
          <Image
            key="1"
            source={require("../../../assets/images/uphoto.png")}
            style={styles.imagetopCont}
          />
        </View>
      );
    }
    const setDescription = (val) => {
      this.setState({ DescriptionVal: val });
    };
    const setpostTitle = (val) => {
      this.setState({ postTitle: val });
    };
    const setUrl = (val) => {
      this.setState({ urlVal: val });
    };
    const handleSubmitPress = () => {
      this.props.navigation.navigate("CommunityPostScreen");
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
            <View style={styles.topHeadsection}>
              <View>
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
                    style={styles.wrappercCustom}
                  >
                    <FontAwesome
                      name={"angle-left"}
                      size={24}
                      color={AppStyle.fontColor}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.innerHeading}>Spiritual Discussions</Text>
              </View>
            </View>

            <View style={styles.mainContentsection}>
              <View style={styles.innserSecBio}>
                {userImg}
                {userData.first_name != null && (
                  <View style={styles.userSecBio}>
                    <View style={styles.sameguruContSect}>
                      <Text style={styles.userheadSecBio}>
                        {userData.first_name} {userData.last_name},{" "}
                        <Feather
                          name={"star"}
                          size={16}
                          color={AppStyle.appIconColor}
                        />{" "}
                        {Urating}
                        {isSameguru && (
                          <Text style={styles.userheadSecBio}>, </Text>
                        )}
                        {isSameguru && (
                          <Image
                            source={require("../../../assets/images/icons/gurubhai.jpg")}
                            style={styles.sameguruCont}
                          />
                        )}
                      </Text>
                    </View>
                    <Text style={styles.usercontSecBio}>
                      {userDetail.gender}, {userDetail.age_group},{" "}
                      {cityData.name},{" "}
                      {stateData.state_abbrivation != ""
                        ? stateData.state_abbrivation
                        : stateData.name}
                    </Text>
                    <Text style={styles.usercontSecBio}>
                      {communityData.name}
                    </Text>
                  </View>
                )}
              </View>
              

              {/*<View style={styles.innerFormSec}>
              <Text style={styles.userinnercontSecBio}>Title</Text>
                <TextInput
                style={styles.inputUrlStyle}
                onChangeText={(postTitle) =>
                  setpostTitle(postTitle)
                }
                
                placeholder="Write title here...." //dummy@abc.com
                placeholderTextColor="#ADAFBB"
                autoCapitalize="none"
                returnKeyType="done"
                
                blurOnSubmit={true}
              />


            </View>*/}
              <View style={styles.innerFormSec}>
                <TextInput
                  style={styles.inputDescStyle}
                  onChangeText={(Description) => setDescription(Description)}
                  multiline={true}
                  keyboardType="default"
                  value={DescriptionVal}
                  placeholder="What would you like to discuss..." //dummy@abc.com
                  placeholderTextColor="#ADAFBB"
                  autoCapitalize="none"
                  returnKeyType="done"
                  blurOnSubmit={true}
                />

                {/*<Text style={[styles.SectionLabel,{width:95}]}>Description</Text>*/}
              </View>

              {urlVal != "" && (
                <View style={styles.innerFormSec}>
                  <Text style={styles.userinnercontSecBio}>Url</Text>
                  <TextInput
                    style={styles.inputUrlStyle}
                    onChangeText={(urlVal) => setUrl(urlVal)}
                    multiline={true}
                    value={urlVal}
                    placeholder="Write or paste a url here...." //dummy@abc.com
                    placeholderTextColor="#ADAFBB"
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={() =>
                      passwordInputRef.current &&
                      passwordInputRef.current.focus()
                    }
                    blurOnSubmit={true}
                  />
                </View>
              )}

              {imgaeData && (
                <View style={styles.innerFormSec}>
                  <Text style={styles.userinnercontSecBio}>Image</Text>
                  <Image
                    source={{ uri: imgaeData }}
                    style={styles.imagePostCont}
                  />
                </View>
              )}

              <View style={styles.mediaSection}>
                <View style={styles.cmtBtn}>
                  <Pressable
                    onPress={() => {
                      this.UrlSec();
                    }}
                    style={({ pressed }) => [
                      {
                        color: pressed ? "rgb(210, 230, 255)" : "white",
                      },
                      styles.postAttachBtnsc,
                    ]}
                  >
                    <Image
                      source={require("../../../assets/images/icons/attch.png")}
                      style={[
                        {
                          resizeMode: "contain",
                          width: 24,
                        },
                        styles.imgIcon,
                      ]}
                    />
                    <Text style={styles.postBtnscinText}>Url</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      this.pickImage();
                    }}
                    style={({ pressed }) => [
                      {
                        color: pressed ? "rgb(210, 230, 255)" : "white",
                      },
                      styles.postAttachBtnsc,
                    ]}
                  >
                    <Image
                      source={require("../../../assets/images/icons/attchh_img.png")}
                      style={[
                        {
                          resizeMode: "contain",
                          width: 24,
                        },
                        styles.imgIcon,
                      ]}
                    />
                    <Text style={styles.postBtnscinText}>Image</Text>
                  </Pressable>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      this.savePost();
                    }}
                  >
                    <LinearGradient
                      // Button Linear Gradient
                      colors={[
                        AppStyle.gradientColorOne,
                        AppStyle.gradientColorTwo,
                      ]}
                      style={styles.postBtnsc}
                    >
                      <Text style={styles.topheadHeading}>Post</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
              <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                  this.setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.urlSection}>
                  <Text style={styles.headinnercontSecBio}>Add Url</Text>
                  <TextInput
                    style={styles.inputUrlStyle}
                    onChangeText={(urlVal) => setUrl(urlVal)}
                    placeholder="Write or paste a url here...." //dummy@abc.com
                    placeholderTextColor="#ADAFBB"
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={() =>
                      passwordInputRef.current &&
                      passwordInputRef.current.focus()
                    }
                    blurOnSubmit={true}
                  />
                  <View style={styles.urlbtnSection}>
                    <Pressable
                      onPress={() => {
                        this.addUrl();
                      }}
                      style={({ pressed }) => [
                        {
                          color: pressed ? "rgb(210, 230, 255)" : "white",
                        },
                        styles.wrapperCustom,
                      ]}
                    >
                      <Text style={styles.urladdButton}>Add</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        this.setModalVisible();
                      }}
                      style={({ pressed }) => [
                        {
                          color: pressed ? "rgb(210, 230, 255)" : "white",
                        },
                        styles.wrapperCustom,
                      ]}
                    >
                      <Text style={styles.urladdButton}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </ScrollView>
        <CookieNavigationScreen navigation={this.props.navigation} />
      </View>
    );
  }
}
export default CommunityPostScreen;

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
    display: "flex",

    alignItems: "center",
    flexDirection: "row",
  },
  wrappercCustom: {
    borderWidth: 1,
    borderColor: "#E8E6EA",
    borderRadius: 15,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
  },
  topheadHeading: {
    color: AppStyle.fontColor,
    fontSize: 17,

    fontFamily: "Abel",
  },
  mainContentsection: {
    marginTop: 15,
  },
  innerHeading: {
    color: AppStyle.fontColor,
    fontSize: AppStyle.aapPageHeadingSize,
    fontFamily: "GlorySemiBold",
    marginLeft: 20,
  },
  innerHdeading: {
    color: AppStyle.fontColor,
    fontSize: 20,
    fontFamily: "GlorySemiBold",
  },
  innserSecBio: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  userSecBio: {
    width: "85%",
  },
  userheadSecBio: {
    fontSize: 16,
    fontFamily: "GlorySemiBold",
    color: AppStyle.fontColor,
    flexShrink: 1,
  },
  usercontSecBio: {
    color: "#AAA6B9",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Abel",
  },
  userinnercontSecBio: {
    color: "#524B6B",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Abel",
    marginBottom: 10,
  },
  innerFormSec: {
    backgroundColor: "#fff",
    marginTop: 15,
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: "#E8E6EA",
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    width: "100%",
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 15,
    fontSize: AppStyle.inputFontsize,
    borderRadius: 15,
    fontFamily: "Abel",
  },
  inputDescStyle: {
    borderWidth: 1,
    borderColor: "#E8E6EA",
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 25,
    paddingTop: 15,
    width: "100%",
    height: 150,
    paddingRight: 15,
    fontSize: AppStyle.inputFontsize,
    borderRadius: 15,
    fontFamily: "Abel",
  },
  mediaSection: {
    flexDirection: "row",
    marginTop: 15,
  },
  hashTagsec: {
    color: "#FF9228",
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Abel",
  },
  leftMediaSection: {
    flexDirection: "row",
    width: "50%",
    justifyContent: "space-around",
  },
  rightMediaSection: {
    flexDirection: "row",
    width: "50%",
    justifyContent: "flex-end",
    paddingRight: 15,
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
    marginBottom: 5,
    textAlign: "center",
  },
  imagetopCont: {
    width: 54,
    height: 54,
    borderRadius: 108,
    marginTop: 0.8,
  },
  cmtBtn: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "space-between",
  },
  postAttachBtnsc: {
    borderWidth: 1,
    borderColor: "#FF9228",
    padding: 10,
    width: "30%",
    borderRadius: 10,
    borderRadius: 10,
    marginRight: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  postBtnsc: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  postSaveBtnsc: {
    borderWidth: 1,
    borderColor: "#FF9228",
    padding: 10,
    width: 90,
    borderRadius: 10,
    borderRadius: 10,
    marginRight: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  postBtnscinText: {
    color: "#FF9228",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Abel",
    marginLeft: 6,
  },
  selectboxContainer: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    fontFamily: "Abel",
    borderWidth: 1,
    borderColor: "#E8E6EA",
    borderRadius: 16,
    height: 55,
  },
  userOuterSecBio: {
    marginTop: 15,
    marginBottom: 15,
  },
  imagePostCont: {
    borderWidth: 2,
    borderColor: AppStyle.appIconColor,
    borderRadius: 10,
    padding: 3,
    marginRight: 10,
    height: 80,
    width: 80,
  },
  urlSection: {
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  urlbtnSection: {
    flexDirection: "row",
    marginTop: 15,
  },
  inputUrlStyle: {
    borderWidth: 1,
    borderColor: "#E8E6EA",
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    width: "100%",
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 15,
    fontSize: AppStyle.inputFontsize,
    borderRadius: 15,
    fontFamily: "Abel",
  },
  urladdButton: {
    color: "#FF9228",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Abel",
    padding: 15,
  },
  wrapperCustom: {
    borderWidth: 1,
    borderColor: "#E8E6EA",
    borderRadius: 16,
    marginLeft: 6,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  headinnercontSecBio: {
    color: "#524B6B",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Abel",
    marginBottom: 10,
  },
  SectionLabel: {
    position: "absolute",
    top: -10,
    left: 20,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    height: 25,
    fontFamily: "Abel",
    color: "rgba(0, 0, 0, 0.4)",
    fontSize: 17,
  },
  sameguruContSect: {
    flexDirection: "row",
  },
  sameguruCont: {
    width: AppStyle.sameGuruImgWidth,
    height: AppStyle.sameGuruImgHeight,
    resizeMode: "contain",
  },
});
