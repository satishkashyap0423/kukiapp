// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, Component } from "react";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";
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
  Alert,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";

import AppStyle from "../../Constants/AppStyle.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationContainer } from "@react-navigation/native";
import axios from "axios";
import Api from "../../Constants/Api.js";
import CookieNavigationScreen from "../Common/CookieNavigationScreen";
import { useRoute } from "@react-navigation/native";
import Loader from "../../Components/Loader";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import AlertMessages from "../../Constants/AlertMessages.js";
import UseAlertModal from "../Common/UseAlertModal";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

class SpiritualScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      itemsData: [],
      selectedItems: [],
      isguruSelected: true,
      selectedProfestionText: "",
      errMsg: "",
      ishowMOdal: false,
      modalVisible: false,
      cmodalVisible: false,
      SselectedItems: [],
      CselectedItems: [],
      CityitemsData: [],
      StateitemsData: [],
      stateData: { name: "Chandigarh" },
      ustateData: [],
      cityData: { name: "Chandigarh" },
      ucityData: [],
      selectedGuru: [],
      guruImageState: false,
    };
  }

  async getUserData(isType = null) {
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
          if (res.data.data.user_detail.guru_id != "0") {
            this.setState({ isguruSelected: true });
          }
          this.setState({ ustateData: res.data.data.user_detail.state_data });
          this.setState({ ucityData: res.data.data.user_detail.city_data });
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

  async getEventLocation() {
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
      .post(Api.apiUrl + "/get-event-location", data, headers)
      .then((res) => {
        console.log(res)
        this.setState({ loading: false });

        if (res.data.status == "true") {
          AsyncStorage.setItem(
            "spostState",
            JSON.stringify(res.data.data.state_data)
          );
          AsyncStorage.setItem(
            "spostCity",
            JSON.stringify(res.data.data.city_data)
          );

          this.setState({ stateData: res.data.data.state_data });
          this.setState({ cityData: res.data.data.city_data });
        } else {
          AsyncStorage.setItem(
            "spostState",
            JSON.stringify(this.state.ustateData)
          );
          AsyncStorage.setItem(
            "spostCity",
            JSON.stringify(this.state.ucityData)
          );

          this.setState({ stateData: this.state.ustateData });
          this.setState({ cityData: this.state.ucityData });
        }
      })
      .catch((error) => {
        if (error.toJSON().message === "Network Error") {
          this.setState({ errMsg: AlertMessages.noInternetErr });
          this.setState({ ishowMOdal: true });

          this.setState({ loading: false });
        } else {
          this.setState({ errMsg: error });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        }
      });
  }

  async getGuruRecords(isType = null) {
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
      .post(Api.apiUrl + "/get-guru", data, headers)
      .then((res) => {
        console.log(res);
        this.setState({ loading: false });
        if (res.data.status == "true") {
          this.setState({ itemsData: res.data.data });
        }
      })
      .catch((error) => {
        if (error.toJSON().message === "Network Error") {
          this.setState({ errMsg: AlertMessages.noInternetErr });
          this.setState({ ishowMOdal: true });

          this.setState({ loading: false });
        } else {
          this.setState({ errMsg: error });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        }
      });
  }

  onSSelectedItemsChange = (selectedItems, val) => {
    this.setState({ SselectedItems: selectedItems });
    this.getCityList(selectedItems);
  };
  onCSelectedItemsChange = (selectedItems, val) => {
    this.setState({ CselectedItems: selectedItems });
  };

  getStateList = async (country_id) => {
    this.state.loading = true;
    let data = JSON.stringify({
      country_id: country_id,
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
      .post(Api.apiUrl + "/get-states", data, headers)
      .then((res) => {
        this.state.loading = false;
        this.setState({ StateitemsData: res.data.data });
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

  getCityList = async (state_id) => {
    this.setState({ loading: true });
    let data = JSON.stringify({
      state_id: state_id,
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
      .post(Api.apiUrl + "/get-cities", data, headers)
      .then((res) => {
        console.log(res);
        this.setState({ loading: false });
        this.setState({ CityitemsData: res.data.data });
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

  getfollowGuru = async () => {
    let gData = JSON.parse(await AsyncStorage.getItem("guruData"));

    if (gData != null) {
      this.setState({ selectedGuru: gData });
      //alert(gData.image_path);
      if (gData.image_path != "") {
        this.setState({ guruImageState: true });
      }
    } else {
      let udata = JSON.parse(await AsyncStorage.getItem("userData"));
      this.setState({ loading: true });
      let data = JSON.stringify({
        user_id: udata.id,
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
        .post(Api.apiUrl + "/get-follow-guru", data, headers)
        .then((res) => {
          console.log(res)
          this.setState({ loading: false });
          if (res.data.status == "true" && res.data.data.guru_id != "0") {
            if (res.data.data.guru_data.image_path != "") {
              this.setState({ guruImageState: true });
            }

            this.setState({ selectedGuru: res.data.data.guru_data });
            AsyncStorage.setItem(
              "guruData",
              JSON.stringify(res.data.data.guru_data)
            );
          }
        })
        .catch((error) => {

          if (error.toJSON().message === "Network Error") {
            this.setState({ errMsg: AlertMessages.noInternetErr });
            this.setState({ ishowMOdal: true });

            this.setState({ loading: false });
          } else {
            this.setState({ errMsg: error });
            this.setState({ ishowMOdal: true });
            this.setState({ loading: false });
          }
        });
    }
  };

  checkVal(i) {
    if (i == 1) {
      this.props.navigation.push("EventListScreen");
    }

    if (i == 2) {
      this.props.navigation.navigate("PostEventScreen");
    }
    if (i == 3) {
      this.props.navigation.navigate("SpiritualSearchScreen");
    }
    if (i == 4) {
      this.props.navigation.navigate("SpiritualShareScreen");
    }

    if (i == 5) {
      this.props.navigation.navigate("SpiritualInsightsScreen");
    }
    if (i == 6) {
      this.props.navigation.push("CommunityBoardScreen", {
        category_id: 2,
        guru_id_from_back: this.state.selectedGuru.id
      });
    }
  }

  async followGuru() {
    if (this.state.selectedItems == "") {
      this.setState({ errMsg: AlertMessages.guruErrMsg });
      this.setState({ ishowMOdal: true });
      return;
    }

    this.setState({ cmodalVisible: true });
  }
  handleCallback = (childData) => {
    console.log(childData);
    this.setState({ ishowMOdal: childData });
  };

  onSelectedItemsChange = (selectedItems, val) => {
    this.setState({ selectedItems: selectedItems.id });
    let allpGrup = this.state.itemsData;
    for (var i = 0; i < allpGrup.length; i++) {
      if (allpGrup[i]["id"] == selectedItems.id) {
        this.setState({ selectedProfestionText: allpGrup[i]["name"] });
      }
    }
  };

  async componentDidMount() {
    /*  await AsyncStorage.removeItem('guruData');

        return;*/
    this.setState({ isguruSelected: true });
    const gId = this.props.route.params.isguruSelectedVal;
    if (gId != "0") {
      this.setState({ isguruSelected: true });
    }
    else {
      this.setState({ isguruSelected: false });

    }
    this.getfollowGuru();
    this.getGuruRecords();
    this.getUserData();
    this.getEventLocation();
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.getUserData();
      this.getEventLocation();
    });
  }
  closeModal() {
    this.setState({ modalDeVisible: false });
  }
  setModalVisible() {
    this.setState({ modalVisible: false });
  }

  closeBlockModal() {
    this.setState({ cmodalVisible: false });
  }

  render() {
    const {
      loading,
      ishowMOdal,
      itemsData,
      isguruSelected,
      errMsg,
      modalVisible,
      cmodalVisible,
      StateitemsData,
      CityitemsData,
      SselectedItems,
      CselectedItems,
      stateData,
      cityData,
      selectedGuru,
      guruImageState,
    } = this.state;

    const saveLocation = async () => {
      let udata = JSON.parse(await AsyncStorage.getItem("userData"));
      if (SselectedItems == "") {
        this.setState({ errMsg: AlertMessages.stateErr });
        this.setState({ ishowMOdal: true });
        return;
      }

      if (CselectedItems == "") {
        this.setState({ errMsg: AlertMessages.cityErr });
        this.setState({ ishowMOdal: true });
        return;
      }
      this.setState({ modalVisible: false });
      this.state.loading = true;
      let data = JSON.stringify({
        country_id: "91",
        state_id: SselectedItems.toString(),
        city_id: CselectedItems.toString(),
        user_id: udata.id,
      });

      this.setState({ loading: true });
      const token = await AsyncStorage.getItem("fcmtoken");

      let headers = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authentication: `Bearer ${token}`,
        },
      };
      axios
        .post(Api.apiUrl + "/save-event-location", data, headers)
        .then((res) => {
          this.setState({ loading: false });

          this.setState({ cityData: res.data.data.city_data });
          this.setState({ stateData: res.data.data.state_data });
          AsyncStorage.setItem(
            "spostState",
            JSON.stringify(res.data.data.state_data)
          );
          AsyncStorage.setItem(
            "spostCity",
            JSON.stringify(res.data.data.city_data)
          );
        })
        .catch((error) => {
          if (error.toJSON().message === "Network Error") {
            this.setState({ errMsg: AlertMessages.noInternetErr });
            this.setState({ ishowMOdal: true });

            this.setState({ loading: false });
          } else {
            this.setState({ errMsg: error });
            this.setState({ ishowMOdal: true });
            this.setState({ loading: false });
          }
        });
    };

    const openLocation = () => {
      this.getStateList(91);
      this.getCityList(14);

      this.setState({ modalVisible: true });
    };

    const handleSubmitPress = async () => {
      let udata = JSON.parse(await AsyncStorage.getItem("userData"));
      console.log("satish", udata, this.state.selectedItems);

      this.setState({ loading: true });
      let data = JSON.stringify({
        user_id: udata.id,
        guru_id: JSON.stringify(this.state.selectedItems),
      });

      console.log(data);
      const token = await AsyncStorage.getItem("fcmtoken");

      let headers = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authentication: `Bearer ${token}`,
        },
      };
      axios
        .post(Api.apiUrl + "/follow-guru", data, headers)
        .then((res) => {
          this.setState({ loading: false });

          if (res.data.status == "true") {
            this.setState({ cmodalVisible: false });
            this.setState({ selectedGuru: res.data.data.guru_data });

            AsyncStorage.setItem("userDetailsData", " ");
            AsyncStorage.setItem(
              "userDetailsData",
              JSON.stringify(res.data.user_details)
            );
            console.log(res.data);
            AsyncStorage.setItem(
              "guruData",
              JSON.stringify(res.data.data.guru_data)
            );
            if (res.data.data.guru_data.image_path != "") {
              this.setState({ guruImageState: true });
              this.setState({ isguruSelected: true });
            }
          }
        })
        .catch((error) => {
          if (error.toJSON().message === "Network Error") {
            this.setState({ errMsg: AlertMessages.noInternetErr });
            this.setState({ ishowMOdal: true });

            this.setState({ loading: false });
          } else {
            this.setState({ errMsg: error });
            this.setState({ ishowMOdal: true });
            this.setState({ loading: false });
          }
        });
    };

    return (
      <View
        key="spscreen"
        style={{ flex: 1, height: "100%", backgroundColor: "#fff" }}
      >
        <Loader loading={loading} />
        {ishowMOdal && (
          <UseAlertModal
            message={errMsg}
            parentCallback={this.handleCallback}
          />
        )}
        <ScrollView showsVerticalScrollIndicator={false}>
          {isguruSelected && (
            <View style={styles.topheadSection}>
              <View>
                {guruImageState && (
                  <Image
                    source={{ uri: `${Api.imgaePath}${selectedGuru.image_path}` }}
                    style={{
                      width: "100%",
                      height: 300,
                      resizeMode: "cover",
                    }}
                  />
                )}

                {!guruImageState && (
                  <Image
                    source={require("../../../assets/images/uphoto.png")}
                    style={{
                      width: "100%",
                      height: 272,
                      resizeMode: "cover",
                    }}
                  />
                )}
              </View>
            </View>
          )}
          <View
            style={[
              styles.mainBody,
              isguruSelected ? styles.mainBodyWithPadding : styles.mainBody,
            ]}
          >
            {/* <View style={[styles.innermainlayutSection, {
              marginVertical:2
            }]}>
              <Text style={styles.textSubheading}>
                {cityData.name},{" "}
                {stateData.state_abbrivation != ""
                  ? stateData.state_abbrivation
                  : stateData.name}
              </Text>
              <TouchableOpacity
                style={styles.addbuttonsStylve}
                activeOpacity={0.5}
                onPress={openLocation}
              >
                <Feather
                  name={"edit"}
                  size={18}
                  color={AppStyle.appIconColor}
                />
              </TouchableOpacity>
            </View> */}
            <View style={[styles.SectionHeadStyle, {
              flexDirection: 'row',
              justifyContent: 'space-between'
            }]}>
              <Text style={styles.SectionHedText}>Spiritual Connect</Text>
              {!isguruSelected && (
                <TouchableOpacity
                  style={{
                    width: '40%',
                  }}
                  activeOpacity={0.8}
                  onPress={this.followGuru.bind(this)}
                >
                  <LinearGradient
                    // Button Linear Gradient
                    colors={[
                      AppStyle.gradientColorOne,
                      AppStyle.gradientColorTwo,
                    ]}
                    style={[styles.selectionContainer, {
                      marginBottom: 15,
                      marginTop: 15,
                      paddingTop: 10,
                      paddingLeft: 0,
                      paddingRight: 0,
                      paddingBottom: 10,
                    }]}
                  >
                    <Text style={[styles.SectioninnrsubHeadStyle, {
                      fontSize: 15,

                    }]}>Follow</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.mainStection}>
              {!isguruSelected && (
                <View>
                  {/* <Text style={styles.textSubText}>
                    Select a Spiritual Guru or Organization you follow{" "}
                  </Text> */}
                  {/* <SectionedMultiSelect
                      items={itemsData}
                      IconRenderer={Icon}
                      uniqueKey="id"
                      subKey="children"
                      selectText="Select your Spiritual Guru or Organization"
                      showDropDowns={true}
                      single={true}
                      onSelectedItemsChange={this.onSelectedItemsChange}
                      selectedItems={this.state.selectedItems}
                      subItemFontFamily={{ fontFamily: "Abel" }}
                      itemFontFamily={{ fontFamily: "Abel" }}
                      searchTextFontFamily={{ fontFamily: "Abel" }}
                      confirmFontFamily={{ fontFamily: "Abel" }}
                      searchPlaceholderText="Search Guru"
                      colors={{
                        primary:
                          "background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)",
                      }}
                      hideConfirm={true}
                      showCancelButton={true}
                      styles={{
                        cancelButton: {
                          backgroundColor: "rgba(253, 139, 48, 0.69)",
                          width: "100%",
                          minWidth: "100%",
                        },
                        selectToggleText: {
                          fontFamily: "Abel",
                          fontSize: 15,
                          color: AppStyle.fontColor,
                        },
                        itemText: {
                          fontSize: 16,
                          marginLeft: 15,
                        },
                        item: {
                          marginTop: 10,
                          textAlign: "center",
                          marginBottom: 10,
                        },
                        selectToggle: {
                          marginTop: 15,
                        },
                        container: {
                          flex: 0,
                          top: "10%",
                          width: "auto",
                          minHeight: 300,
                          paddingTop: 10,
                          overflow: "scroll",
                          paddingBottom: 0,
                        },
                      }}
                    /> */}
                  <Text style={[styles.receivedCookieText, { width: '95%' }]}>
                    Select a Spiritual Guru or Organization you follow
                  </Text>

                  <View style={[styles.receivedCookie]}>

                    <FlatList
                      data={itemsData}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            width: "90%",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottomWidth: 1,
                            paddingBottom: 5,
                            paddingTop: 5,
                            borderColor: "transparent",
                          }}
                          onPress={() => this.onSelectedItemsChange(item)}
                        >
                          {/* Show Flatlist over here of every guru */}

                          <View
                            style={styles.outerImgSection}
                            key={item?.id}
                            activeOpacity={0.6}
                          >
                            <Image
                              source={{ uri: `${Api.imgaePath}${item?.image_path}` }}
                              style={styles.imagetopCont}
                            />
                          </View>
                          <View style={styles.searchContentsection}>
                            <View key={item?.id} activeOpacity={0.6}>
                              <View style={styles.sameguruContSect}>
                                <Text style={styles.searchContentTextBold}>
                                  {item?.name}
                                </Text>
                              </View>
                              <Text style={styles.searchContentText}>
                                {item?.guru_slogan}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.searchImgsection}>
                            <View>
                              <MaterialCommunityIcons
                                name={
                                  item?.id == this.state.selectedItems
                                    ? "checkbox-marked"
                                    : "checkbox-blank-outline"
                                }
                                size={24}
                                color={AppStyle.appIconColor}
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item) => item?.id}
                      extraData={itemsData}
                    />
                  </View>
                </View>
              )}



              {isguruSelected && (
                <View style={styles.otterSocialSec}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.checkVal.bind(this, 1)}
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
                        Spiritual Events
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* <Text style={styles.SectionsubSecHeadStyle}>Select Professional Discussions Group</Text> */}

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.checkVal.bind(this, 2)}
                  >
                    {/* <LinearGradient
                      // Button Linear Gradient
                      colors={[
                        AppStyle.gradientColorOne,
                        AppStyle.gradientColorTwo,
                      ]}
                      style={styles.selectionContainer}
                    >
                      <Text style={styles.SectioninnrsubHeadStyle}>
                        Post A Spiritual Event
                      </Text>
                    </LinearGradient> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.checkVal.bind(this, 6)}
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
                        Spiritual Discussions
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.checkVal.bind(this, 5)}
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
                        Spiritual Insights
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.checkVal.bind(this, 3)}
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
                        SEARCH FELLOW FOLLOWERS
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.checkVal.bind(this, 4)}
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
                        SHARE BLESSINGS
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <Modal
              animationType="slide"
              transparent={false}
              visible={modalVisible}
              onRequestClose={() => {
                this.setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.changecitySection}>
                <Text style={styles.changeHeadtext}></Text>
                <View style={styles.selectboxNwContainer}>
                  <SectionedMultiSelect
                    items={StateitemsData}
                    IconRenderer={Icon}
                    uniqueKey="id"
                    subKey="children"
                    selectText="Your State..."
                    showDropDowns={true}
                    single={true}
                    onSelectedItemsChange={this.onSSelectedItemsChange}
                    selectedItems={this.state.SselectedItems}
                    subItemFontFamily={{ fontFamily: "Abel" }}
                    itemFontFamily={{ fontFamily: "Abel" }}
                    searchTextFontFamily={{ fontFamily: "Abel" }}
                    confirmFontFamily={{ fontFamily: "Abel" }}
                    searchPlaceholderText="Search State"
                    colors={{
                      primary:
                        "background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)",
                    }}
                    showCancelButton={true}
                    hideConfirm={true}
                    styles={{
                      cancelButton: {
                        backgroundColor: "rgba(253, 139, 48, 0.69)",
                        width: "100%",
                        minWidth: "100%",
                      },
                      selectToggleText: {
                        fontFamily: "Abel",
                        fontSize: 15,
                        color: AppStyle.fontColor,
                      },
                      itemText: {
                        fontSize: 16,
                        marginLeft: 15,
                      },
                      item: {
                        marginTop: 10,
                        textAlign: "center",
                        marginBottom: 10,
                      },
                      selectToggle: {
                        marginTop: 15,
                      },
                      container: {
                        flex: 0,
                        top: "10%",
                        width: "auto",
                        height: 450,
                        paddingTop: 10,
                        overflow: "scroll",
                        paddingBottom: 0,
                      },
                    }}
                  />
                  <Text style={[styles.SectionLabel, { width: 57 }]}>
                    State
                  </Text>
                </View>
                <View style={styles.selectboxNwContainer}>
                  <SectionedMultiSelect
                    items={CityitemsData}
                    IconRenderer={Icon}
                    uniqueKey="id"
                    subKey="children"
                    selectText="Your City..."
                    showDropDowns={true}
                    single={true}
                    onSelectedItemsChange={this.onCSelectedItemsChange}
                    selectedItems={this.state.CselectedItems}
                    subItemFontFamily={{ fontFamily: "Abel" }}
                    itemFontFamily={{ fontFamily: "Abel" }}
                    searchTextFontFamily={{ fontFamily: "Abel" }}
                    confirmFontFamily={{ fontFamily: "Abel" }}
                    searchPlaceholderText="Search City"
                    colors={{
                      primary:
                        "background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)",
                    }}
                    hideConfirm={true}
                    showCancelButton={true}
                    styles={{
                      cancelButton: {
                        backgroundColor: "rgba(253, 139, 48, 0.69)",
                        width: "100%",
                        minWidth: "100%",
                      },
                      selectToggleText: {
                        fontFamily: "Abel",
                        fontSize: 15,
                        color: AppStyle.fontColor,
                      },
                      itemText: {
                        fontSize: 16,
                        marginLeft: 15,
                      },
                      item: {
                        marginTop: 10,
                        textAlign: "center",
                        marginBottom: 10,
                      },
                      selectToggle: {
                        marginTop: 15,
                      },
                      container: {
                        flex: 0,
                        top: "10%",
                        width: "auto",
                        height: 450,
                        paddingTop: 10,
                        overflow: "scroll",
                        paddingBottom: 0,
                      },
                    }}
                  />
                  <Text style={[styles.SectionLabel, { width: 47 }]}>City</Text>
                </View>

                <View style={styles.urlbtnSection}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setModalVisible();
                    }}
                    activeOpacity={0.8}
                    style={styles.wrapperdOuterCustom}
                  >
                    <View style={styles.wrapperdDCustom}>
                      <Text style={styles.urlcloseButton}>Close</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={saveLocation}
                    activeOpacity={0.8}
                    style={styles.wrapperdOuterCustom}
                  >
                    <LinearGradient
                      // Button Linear Gradient
                      colors={[
                        AppStyle.gradientColorOne,
                        AppStyle.gradientColorTwo,
                      ]}
                      style={styles.wrapperdCustom}
                    >
                      <Text style={styles.urladdButton}>Save</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          <View style={styles.Mdcontainer}>
            <Modal
              animationType={"fade"}
              transparent={true}
              visible={cmodalVisible}
              onRequestClose={() => { }}
            >
              {/*All views of Modal*/}
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>
                  Spiritual Guru or Organization cannot be changed later. You
                  selected:
                </Text>
                <Text style={styles.modalTitle}>
                  {this.state.selectedProfestionText}
                </Text>

                <Text style={styles.modalTitle}>
                  Click <Text style={styles.modalCTitle}>Cancel</Text> to
                  change.
                </Text>

                <Text style={styles.modalTitle}>
                  Click <Text style={styles.modalCTitle}>Ok</Text> to continue.
                </Text>
                <View style={styles.Btnmodal}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      this.closeBlockModal();
                    }}
                    style={styles.buttonOuter}
                  >
                    <View style={styles.buttonCStyle}>
                      <Text style={styles.buttonTextMStyle}>Cancel</Text>
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
                      style={styles.buttonMStyle}
                    >
                      <Text style={styles.buttonTextMStyle}>Ok</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {/*Button will change state to true and view will re-render*/}
          </View>
        </ScrollView>
        <CookieNavigationScreen navigation={this.props.navigation} />
      </View>
    );
  }
}
export default SpiritualScreen;

const styles = StyleSheet.create({
  mainBodyWithPadding: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#ffffff",
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: -40,
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 30,
    paddingTop: AppStyle.appInnerTopPadding,
  },
  mainBody: {
    flex: 1,
    backgroundColor: AppStyle.appColor,
    alignContent: "center",
    paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
    paddingBottom: AppStyle.appInnerBottomPadding,

    backgroundColor: "#fff",
    height: "100%",
  },
  postListSection: {
    marginBottom: 10,
  },
  SectionHeadStyle: {
    flexDirection: "row",
    paddingBottom: 6,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -4,
  },
  inputboxContainer: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    borderColor: "#E8E6EA",
    borderWidth: 1,
    borderRadius: 16,
    height: 58,
  },
  SectionHedText: {
    fontSize: AppStyle.aapPageHeadingSize,
    fontFamily: "Abel",
    color: AppStyle.fontColor,
  },
  textSubheading: {
    fontFamily: "Abel",
    color: "rgba(0, 0, 0, 0.4)",
    fontSize: 16,
  },
  textSubText: {
    fontSize: 16,
    fontFamily: "Abel",
    color: AppStyle.fontColor,
  },
  innermainlayutSection: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  addbuttonsStylve: {
    marginLeft: 5,
    padding: 8,
  },
  receivedCookie: {
    borderColor: AppStyle.appIconColor,
    borderWidth: 1,
    paddingBottom: 5,
    paddingTop: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 15,
  },
  selectboxNwContainer: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    fontFamily: "Abel",
    borderWidth: 1,
    borderColor: "#E8E6EA",
    borderRadius: 16,
    height: 55,
    width: "100%",
    marginTop: 20,
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
  imagetopCont: {
    width: 54,
    height: 54,
    borderRadius: 108,
    marginTop: 0.8,
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
  otterSocialSec: {
    marginTop: 20,
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
    // marginTop:15,
    marginBottom: 10,
  },
  SectioninnrsubHeadStyle: {
    fontSize: AppStyle.buttonFontsize,
    fontFamily: "GlorySemiBold",
    color: AppStyle.fontColor,
    textTransform: "capitalize",
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
    top: "35%",
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 25,
    paddingRight: 25,
  },
  buttonTextMStyle: {
    color: AppStyle.fontButtonColor,
    fontFamily: "GlorySemiBold",
    fontSize: 15,
    textTransform: "capitalize",
  },
  modalTitle: {
    color: AppStyle.fontButtonColor,
    fontFamily: "GlorySemiBold",
    fontSize: 16,

    marginBottom: 10,
  },
  modalCTitle: {
    color: "rgba(253, 139, 48,0.8)",
    fontFamily: "GlorySemiBold",
    fontSize: 18,
    textAlign: "left",
    marginBottom: 10,
  },
  Btnmodal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonOuter: {
    marginTop: 20,
  },
  receivedCookieText: {
    backgroundColor: "#fff",
    fontSize: 16,
    fontFamily: "GlorySemiBold",
    lineHeight: 32,
    color: AppStyle.fontColor,
    paddingLeft: 10,
    paddingRight: 10,
    left: 5,
  },
  buttonMStyle: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    borderRadius: 15,
    width: 110,
    marginLeft: 10,
  },
  buttonCStyle: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    borderRadius: 15,
    width: 110,
    borderWidth: 1,
    borderColor: AppStyle.appIconColor,
  },
  postReviewsSec: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 5,
  },
  postReviewsInnerSec: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  wrapperCustom: {
    flexDirection: "row",
    padding: 5,
  },
  cmtCount: {
    color: "#FF9228",
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Abel",
  },
  icnlabl: {
    color: AppStyle.fontColor,
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Abel",
    marginRight: 5,
  },
  changecitySection: {
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  changeHeadtext: {
    fontSize: 26,
    fontFamily: "GlorySemiBold",
    color: AppStyle.fontColor,
    marginBottom: 25,
  },
  addbuttonStylve: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 12,
    borderColor: AppStyle.gradientColorOne,
    backgroundColor: AppStyle.gradientColorOne,
  },
  addbuttonsStylve: {
    marginLeft: 5,
    padding: 8,
  },
  cmtCountLink: {
    color: "blue",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Abel",
  },
  urlbtnSection: {
    flexDirection: "row",
    marginTop: 15,
  },
  urlcloseButton: {
    color: AppStyle.fontColor,
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "GlorySemiBold",
    padding: 15,
  },
  urladdButton: {
    color: AppStyle.fontButtonColor,
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "GlorySemiBold",
    padding: 15,
  },
  wrapperdOuterCustom: {
    width: "48%",
    padding: 10,
  },
  wrapperdCustom: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 0,
  },
  wrapperdDCustom: {
    backgroundColor: AppStyle.btnbackgroundColor,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 0,
  },
  searchContentsection: {
    paddingLeft: 0,
    width: "75%",
  },
  sameguruContSect: {
    flexDirection: "row",
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
  searchImgsection: {
    marginRight: 6,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
