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
import { Checkbox } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { log } from "react-native-reanimated";

class SendInvitaionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectedDValCont: "selectdVal",
      selectedCValCont: "",
      ishowMOdal: false,
      modalVisible: false,
      allUserChecked: false,
      errMsg: "",
      chkALl: "checkbox-blank-outline",
      itemsData: [],
      selectedProfestionValue: [],
      selectedItems: [],
      modalVisible: false,
      SselectedItems: [],
      CselectedItems: [],
      CityitemsData: [],
      StateitemsData: [],
      eventRecords: [],
      followerRecords: [],
      tempfollowerRecords: [],
      stateData: [],
      cityData: [],
      selectedGuru: [],
      guruIdselected: "",
      guruImageState: false,
      imodalVisible: false,
      isSearchTYpe: "1",
      chkText: "Select",
      luserData: [],
      statePlaceholderdata: "Your State...",
      cityPlaceholderdata: "Your City...",
      selectedState: "",
      selectCity: "",
      FullName: "",
      selectedItemsP: "",
      filterUserForInvitaion: false
    };
  }
  async getEventDetail() {
    const eventId = this.props.route.params.event_id;
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({ loading: true });
    let data = JSON.stringify({
      user_id: udata.id,
      event_id: eventId,
    });

    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios
      .post(Api.apiUrl + "/get-event-detail", data, headers)
      .then((res) => {
        this.setState({ loading: false });
        this.setState({ eventRecords: res.data.data });

        this.setState({ eventOrganizers: res.data.organizers_data });
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
  async getEventLocation() {
    let invstaeData = JSON.parse(await AsyncStorage.getItem("invpostState"));
    let invcitydData = JSON.parse(await AsyncStorage.getItem("invspostCity"));

    if (invstaeData == null) {
      let staeData = JSON.parse(await AsyncStorage.getItem("spostState"));
      let citydData = JSON.parse(await AsyncStorage.getItem("spostCity"));
      this.setState({ stateData: staeData });
      this.setState({ cityData: citydData });
    } else {
      this.setState({ stateData: invstaeData });
      this.setState({ cityData: invcitydData });
    }
  }

  async getGuruRecords(isType = null) {
    this.setState({ loading: true });
    let data = JSON.stringify({
      user_id: 1,
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
        this.setState({ loading: false });

        if (res.data.data.guru_data.image_path != "") {
          this.setState({ guruImageState: true });
        }

        this.setState({ selectedGuru: res.data.data.guru_data });
        this.setState({ guruIdselected: res.data.data.guru_id });
        this.searchFellowfollowers();

        AsyncStorage.setItem(
          "guruData",
          JSON.stringify(res.data.data.guru_data)
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
  handleCallback = (childData) => {
    this.setState({ ishowMOdal: childData });
  };

  closeModal() {
    this.setState({ modalDeVisible: false });
  }
  setModalVisible() {
    this.setState({ modalVisible: false });
  }

  backScreen(val) {
    this.props.navigation.goBack()
    // if (val == 0) {
    //   this.props.navigation.navigate("EventListScreen");
    // } else {
    //   this.props.navigation.navigate("EventListScreen");
    // }
  }

  closeBlockModal() {
    this.setState({ imodalVisible: false });
  }

  setModalVisible() {
    this.setState({ modalVisible: false });
  }

  async checkVal(val) {
    let isSerc = "1";
    this.setState({ checked: val });
    if (val == "d") {
      isSerc = "1";
      await this.setState({
        isSearchTYpe: "1",
      });
      this.setState({
        selectedDValCont: "selectdVal",
      });
      this.setState({
        selectedCValCont: "",
      });
      this.setState({ searchWise: "Distance" });
    } else if (val == "c") {
      isSerc = "2";
      await this.setState({
        isSearchTYpe: "2",
      });
      this.setState({
        selectedCValCont: "selectdVal",
      });
      this.setState({
        selectedDValCont: "",
      });
    }
    this.searchFellowfollowers();
  }

  getPrfessionalList = async () => {
    let data = JSON.stringify({
      category_id: 1,
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
        let df = [
          {
            name: "Any",
            id: "any",
          },
        ];

        let AllData = df.concat(res.data.data);
        this.setState({ itemsData: AllData });
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

  searchFellowfollowers = async (val = false) => {
    let seachType = this.state.isSearchTYpe;
    console.log(this.state.selectedItems)
    // if (this.state.selectedItems != undefined && val == "age") {
    //   ageGroup = this.state.selectedItems.toString();
    // }
    // if (this.state.selectedItems != undefined && val == "pro") {
    //   ProfessionalGroup = this.state.selectedItemsP.toString();
    // }
    let stateDataVla = this.state.stateData;
    let cityDataVla = this.state.cityData;
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    const eventId = this.props.route.params.event_id;
    console.log("this function", this.state.selectedItems[0])
    let data = JSON.stringify({
      name: this.state.FullName,
      guru_id: this.state.guruIdselected,
      user_id: udata.id,
      event_id: eventId,
      age_group: this.state.selectedItems[0] != "any" ? this.state.selectedItems.toString() : "",
      communities_id: this.state.selectedItemsP[0] != "any" ? this.state.selectedItemsP.toString() : "",
      search_type: seachType,
      state_id: stateDataVla.id,
      city_id: cityDataVla.id,
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
      .post(Api.apiUrl + "/search-invite-followers", data, headers)
      .then((res) => {
        this.setState({
          followerRecords: res.data.data,
          tempfollowerRecords: res.data.data,

        });
        this.setState({ loading: false, 
          filterUserForInvitaion:val?true:false
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
  };

  onSelectedItemsChange = async (selectedItems) => {
    await this.setState({ selectedItems: selectedItems });
    // this.searchFellowfollowers("age");
  };
  editLocation() { }

  checkAll() {
    let cehckALl = this.state.allUserChecked;
    if (cehckALl) {
      this.setState({ allUserChecked: false });
      //this.setState({chkALl:'checkbox-marked'});
      this.setState({ chkALl: "checkbox-blank-outline" });
    } else {
      this.setState({ allUserChecked: true });
      this.setState({ chkALl: "checkbox-marked" });
    }

    let sentRes = this.state.followerRecords;

    if (this.state.chkText == "Select") {
      this.setState({ chkText: "Unselect" });
      let temp = sentRes.map((product) => {
        return { ...product, isChecked: true };
      });
      this.setState({ followerRecords: temp });
    } else {
      this.setState({ chkText: "Select" });
      let temp = sentRes.map((product) => {
        return { ...product, isChecked: false };
      });
      this.setState({ followerRecords: temp });
    }
  }

  closeModal() {
    this.setState({ modalDeVisible: false });
  }
  setModalVisible() {
    this.setState({ modalVisible: false });
  }
  handleInput() {

    this.searchFellowfollowers("name");

    // let filterData = this.state.tempfollowerRecords.filter(
    //   (data) => data.first_name == fullname || data.last_name == fullname
    // );
    // this.setState({
    //   followerRecords:
    //     fullname == "" ? this.state.tempfollowerRecords : filterData,
    // });
  }
  onSelectedItemsChangeP = async (selectedItems, val) => {
    await this.setState({ selectedItemsP: selectedItems });

    // this.searchFellowfollowers("pro");
  };
  onSSelectedItemsChange = (selectedItems, val) => {
    this.setState({ SselectedItems: selectedItems });
    this.getCityList(selectedItems);
  };
  onCSelectedItemsChange = (selectedItems, val) => {
    this.setState({ CselectedItems: selectedItems });
  };

  getStateList = async () => {
    this.state.loading = true;
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    console.log(udata);
    let data = JSON.stringify({
      country_id: parseInt(udata.country_code.split("+")[1]),
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
        this.setState({
          StateitemsData: res.data.data,
          selectedState: res.data.data[0],
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
  };

  getCityList = async (state_id) => {
    this.state.loading = true;
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
        this.state.loading = false;
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
  async componentDidMount() {
    this.getfollowGuru();
    this.getGuruRecords();
    this.getEventDetail();
    this.getEventLocation();
    this.getPrfessionalList();
    this.getStateList();
    this.setState({
      selectedItems: ["any"],
      selectedItemsP: ["any"],
    });
    let uDetailData = JSON.parse(await AsyncStorage.getItem("userDetailsData"));
    if (uDetailData != null) {
      this.setState({ luserData: uDetailData });
    }
  }
  getuserDetail = (i, isSend) => {
    this.props.navigation.push("CookiesDetail", {
      user_id: i,
      isFrom: 1,
      isSend: isSend,
    });
  };

  render() {
    const {
      loading,
      ishowMOdal,
      errMsg,
      selectedDValCont,
      selectedCValCont,
      itemsData,
      selectedProfestionValue,
      selectedItems,
      allUserChecked,
      chkALl,
      modalVisible,
      StateitemsData,
      CityitemsData,
      SselectedItems,
      CselectedItems,
      stateData,
      cityData,
      selectedGuru,
      guruImageState,
      eventRecords,
      eventOrganizers,
      followerRecords,
      chkText,
      luserData,
      imodalVisible,
      filterUserForInvitaion
    } = this.state;
    const handleChange = (id) => {
      let temp = followerRecords.map((user) => {
        if (id === user.user_id) {
          return { ...user, isChecked: !user.isChecked };
        }
        return user;
      });
      this.setState({ followerRecords: temp });
    };

    const redirectEvents = () => {
      this.setState({ imodalVisible: false });
      this.props.navigation.goBack();
    };

    const saveLocation = async () => {
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
        state_id: SselectedItems,
        city_id: CselectedItems,
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
        .post(Api.apiUrl + "/get-locations-name", data, headers)
        .then((res) => {
          this.setState({ loading: false });
          this.setState({ cityData: res.data.city_data });
          this.setState({ stateData: res.data.state_data });
          AsyncStorage.setItem(
            "invpostState",
            JSON.stringify(res.data.state_data)
          );
          AsyncStorage.setItem(
            "invspostCity",
            JSON.stringify(res.data.city_data)
          );
          this.searchFellowfollowers();
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

    const sendInvitation = async () => {
      let dUserIds = [];

      let folowData = this.state.followerRecords;
      for (var i = 0; i < folowData.length; i++) {
        if (folowData[i].isChecked) {
          dUserIds.push(folowData[i].user_id);
        }
      }

      if (dUserIds.length == 0) {
        this.setState({ errMsg: "Select any record to send invite" });
        this.setState({ ishowMOdal: true });
        return;
      }
      this.setState({ loading: true });

      let udata = JSON.parse(await AsyncStorage.getItem("userData"));

      const eventId = this.props.route.params.event_id;
      let data = JSON.stringify({
        event_id: eventId,
        from_id: udata.id,
        to_id: dUserIds.toString(),
        // state:SselectedItems,
        // city:CselectedItems
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
        .post(Api.apiUrl + "/send-invite", data, headers)
        .then((res) => {
          console.log(res, "res707");
          this.setState({ loading: false });
          this.setState({ errMsg: "Invitation sent successfully" });
          this.setState({ imodalVisible: true });
        })
        .catch((error) => {
          this.setState({ loading: false });
          if (error.toJSON().message === "Network Error") {
            this.setState({ errMsg: AlertMessages.noInternetErr });
            this.setState({ ishowMOdal: true });
          } else {
            this.setState({ errMsg: error });
            this.setState({ ishowMOdal: true });
          }
        });
    };
    const openLocation = () => {
      this.getStateList();
      this.getCityList(14);

      this.setState({ modalVisible: true });
    };

    const Agegroupitems = [
      {
        name: "Any",
        id: "any",
      },
      {
        name: "18-25",
        id: "18-25",
      },
      {
        name: "25-30",
        id: "25-30",
      },
      {
        name: "30-35",
        id: "30-35",
      },
      {
        name: "35-40",
        id: "35-40",
      },
      {
        name: "40-45",
        id: "40-45",
      },
      {
        name: "45-50",
        id: "45-50",
      },
      {
        name: "50-55",
        id: "50-55",
      },
      {
        name: "55-60",
        id: "55-60",
      },
      {
        name: "60 & above",
        id: "60 & above",
      },
    ];

    const handleSubmitPress = async () => { };

    let ulistRecrds = [];
    if (followerRecords.length > 0) {
      for (var i = 0; i < followerRecords.length; i++) {
        let usID = followerRecords[i].user_id;
        let userRating = followerRecords[i].rating;
        let uRate =
          Math.round((parseFloat(userRating) + Number.EPSILON) * 100) / 100;

        uRate = uRate.toFixed(1);
        if (userRating == null) {
          uRate = "0.0";
        }

        let isSameguru = false;
        if (
          followerRecords[i].guru_id == luserData.guru_id &&
          followerRecords[i].guru_id != luserData.user_id
        ) {
          isSameguru = true;
        }

        ulistRecrds.push(
          <View
            key={i}
            style={[
              i == 0
                ? styles.outerEventContainerNob
                : styles.outerEventContainer,
            ]}
          >
            <View style={styles.leftEventContainer}>
              <View style={styles.outerImgSection}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={this.getuserDetail.bind(
                    this,
                    followerRecords[i].user_id,
                    0
                  )}
                >
                  <Image
                    source={{ uri: `${Api.imgaePath}/${followerRecords[i].user_profile_image}` }}
                    style={styles.imagetopCont}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.rightEventContainer}>
              <View style={styles.searchContentOtrt}>
                <View style={styles.searchContentInr}>
                  <Text style={[styles.searchContentTextBold]}>
                    {followerRecords[i].first_name}{" "}
                    {followerRecords[i].last_name},{" "}
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
              </View>

              <Text style={styles.searchContentText}>
                {followerRecords[i].gender}, {followerRecords[i].age_group},{" "}
                {followerRecords[i].city_data.name},{" "}
                {followerRecords[i].state_data.state_abbrivation != ""
                  ? followerRecords[i].state_data.state_abbrivation
                  : followerRecords[i].state_data.name}
              </Text>
              <Text style={styles.searchContentText}>
                {followerRecords[i].community_data.name}
              </Text>
            </View>
            <View style={{ width: "10%" }}>
              <Pressable onPress={() => handleChange(usID)}>
                <MaterialCommunityIcons
                  style={styles.searchMulCheck}
                  name={
                    followerRecords[i].isChecked
                      ? "checkbox-marked"
                      : "checkbox-blank-outline"
                  }
                  size={24}
                  color={AppStyle.appIconColor}
                />
              </Pressable>
            </View>
          </View>
        );
      }
    } else {
      ulistRecrds.push(
        <View
          key="nodf"
          style={[
            i == 0 ? styles.outerEventContainerNob : styles.outerEventContainer,
          ]}
        >
          <Text style={styles.searchContentText}>No Records</Text>
        </View>
      );
    }

    let guruImage = `${Api.imgaePath}/${selectedGuru.image_path}`;
    return (
      <View style={{ flex: 1, height: "100%", backgroundColor: "#fff" }}>
        <Loader loading={loading} />
        {ishowMOdal && (
          <UseAlertModal
            message={errMsg}
            parentCallback={this.handleCallback}
          />
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          <View style={styles.topheadSection}>
            <View>
              <Image
                source={{ uri: guruImage }}
                style={{
                  width: "100%",
                  height: 300,
                  resizeMode: "cover",
                }}
              />
            </View>
          </View>
          <View style={[styles.mainBodyWithPadding]}>
            <View style={styles.innerHeadSection}>
              <TouchableOpacity
                style={styles.innerSection}
                activeOpacity={0.5}
                onPress={this.backScreen.bind(this, 0)}
              >
                <FontAwesome5
                  name={"times"}
                  size={22}
                  color={
                    "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={styles.innermainlayutSection}>
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
            </View>
            <View style={styles.SectionHeadStyle}>
              <Text style={styles.SectionHedText}>Send Invitation</Text>
            </View>

            <View style={styles.mainSection}>
              <View style={styles.eventDetailSec}>
                <Text style={styles.evtHedText}>
                  {eventRecords.event_heading}
                </Text>
                <Text style={styles.eventCheckText}>
                  {eventRecords.event_description}
                </Text>
              </View>

              <View style={styles.eventDetailtimeSec}>
                <View style={styles.eventDetailinnertimeSec}>
                  <Feather
                    name={"calendar"}
                    size={22}
                    style={styles.eventiOCns}
                    color={
                      "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"
                    }
                  />
                  <Text style={styles.eventCheckText}>
                    {eventRecords.formatted_date}
                  </Text>
                </View>
                <View style={styles.eventDetailinnertimeSec}>
                  <Feather
                    name={"clock"}
                    style={styles.eventiOCns}
                    size={22}
                    color={
                      "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"
                    }
                  />
                  <Text style={styles.eventCheckText}>
                    From {eventRecords.start_time} - {eventRecords.end_time}
                  </Text>
                </View>
                <View style={styles.eventDetailinnertimeSec}>
                  <Feather
                    name={"map-pin"}
                    style={styles.eventiOCns}
                    size={22}
                    color={
                      "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"
                    }
                  />
                  <Text style={styles.eventCheckText}>
                    #{eventRecords.address}
                  </Text>
                </View>
                <View style={styles.eventDetailinnertimeSec}>
                  <FontAwesome5
                    name={"city"}
                    size={16}
                    color={
                      "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"
                    }
                  />
                  <Text style={styles.eventdCheckText}>
                    {eventRecords?.city_data?.name},{" "}
                    {eventRecords?.state_data?.state_abbrivation}
                  </Text>
                </View>
              </View>
              {!filterUserForInvitaion &&
                <View style={styles.mainStection}>
                  <View style={styles.selectionContStection}>
                    {selectedDValCont != "" && (
                      <TouchableOpacity onPress={() => this.checkVal("d")}>
                        <LinearGradient
                          // Button Linear Gradient
                          colors={[
                            AppStyle.gradientColorOne,
                            AppStyle.gradientColorTwo,
                          ]}
                          style={styles.selectionGContainer}
                        >
                          <Text
                            style={[
                              styles.searchText,
                              selectedDValCont != ""
                                ? { color: AppStyle.fontColor }
                                : {},
                            ]}
                          >
                            {" "}
                            Fellow Followers
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}

                    {selectedDValCont == "" && (
                      <TouchableOpacity
                        onPress={() => this.checkVal("d")}
                        style={styles.selectionContainer}
                      >
                        <Text
                          style={[
                            styles.searchText,
                            selectedDValCont != ""
                              ? { color: AppStyle.fontColor }
                              : {},
                          ]}
                        >
                          {" "}
                          Fellow Followers
                        </Text>
                      </TouchableOpacity>
                    )}

                    {selectedCValCont != "" && (
                      <TouchableOpacity onPress={() => this.checkVal("c")}>
                        <LinearGradient
                          // Button Linear Gradient
                          colors={[
                            AppStyle.gradientColorOne,
                            AppStyle.gradientColorTwo,
                          ]}
                          style={styles.selectionGRightContainer}
                        >
                          <Text
                            style={[
                              styles.searchText,
                              selectedCValCont != ""
                                ? { color: AppStyle.fontColor }
                                : {},
                            ]}
                          >
                            {" "}
                            Others
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}

                    {selectedCValCont == "" && (
                      <TouchableOpacity
                        onPress={() => this.checkVal("c")}
                        style={styles.selectionRightContainer}
                      >
                        <Text
                          style={[
                            styles.searchText,
                            selectedCValCont != "" ? { color: "#fff" } : {},
                          ]}
                        >
                          {" "}
                          Others
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <TouchableOpacity style={{
                    alignSelf: 'flex-end',
                    marginBottom:5
                  }} onPress={() => this.setState({
                    selectedItems: ["any"],
                    selectedItemsP: ["any"],
                    FullName: "any"
                  })}>
                    <Text style={styles.clearSection}>Clear</Text>
                  </TouchableOpacity>
                  <View style={styles.inputboxContainer}>
                    <TextInput
                      style={styles.inputStyle}
                      onChangeText={(LastName) =>
                        // this.handleInput(LastName, "Name")
                        this.setState({
                          FullName: LastName,
                        })
                      }
                      value={this.state.FullName}
                      // onSubmitEditing={() => this.handleInput()}
                      placeholder="Any"
                      placeholderTextColor={AppStyle.fontColor}
                      autoCapitalize="none"
                    />
                    <Text style={[styles.SectionLabel, { width: 55 }]}>
                      Name
                    </Text>
                  </View>
                  <View style={styles.selectboxContainer}>
                    <SectionedMultiSelect
                      items={itemsData}
                      IconRenderer={Icon}
                      uniqueKey="id"
                      subKey="children"
                      selectText="Select Group..."
                      showDropDowns={true}
                      single={true}
                      onSelectedItemsChange={this.onSelectedItemsChangeP}
                      selectedItems={this.state.selectedItemsP}
                      subItemFontFamily={{ fontFamily: "Abel" }}
                      itemFontFamily={{ fontFamily: "Abel" }}
                      searchTextFontFamily={{ fontFamily: "Abel" }}
                      confirmFontFamily={{ fontFamily: "Abel" }}
                      searchPlaceholderText="Search Professional Group"
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
                    <Text style={[styles.SectionLabel, { width: 123 }]}>
                      Professional Group
                    </Text>
                  </View>

                  <View style={styles.selectboxContainer}>
                    <SectionedMultiSelect
                      items={Agegroupitems}
                      IconRenderer={Icon}
                      uniqueKey="id"
                      subKey="children"
                      selectText="Age Group..."
                      showDropDowns={true}
                      single={true}
                      onSelectedItemsChange={this.onSelectedItemsChange}
                      selectedItems={this.state.selectedItems}
                      subItemFontFamily={{ fontFamily: "Abel" }}
                      itemFontFamily={{ fontFamily: "Abel" }}
                      selectTextFontFamily={{ fontFamily: "Abel" }}
                      searchTextFontFamily={{ fontFamily: "Abel" }}
                      confirmFontFamily={{ fontFamily: "Abel" }}
                      colors={{
                        primary:
                          "background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)",
                      }}
                      hideConfirm={true}
                      modalAnimationType={"fade"}
                      showCancelButton={true}
                      hideSearch={true}
                      styles={{
                        cancelButton: {
                          backgroundColor: "rgba(253, 139, 48, 0.69)",
                          width: "100%",
                          minWidth: "100%",
                        },
                        selectToggleText: {
                          fontFamily: "Abel",
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
                          height: 415,
                          paddingTop: 10,
                          overflow: "scroll",
                        },
                      }}
                    />
                    <Text style={[styles.SectionLabel, { width: 74 }]}>
                      Age Group
                    </Text>
                  </View>
                  <View style={{
                    marginTop:5
                  }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        this.searchFellowfollowers(true);
                      }}
                    >
                      <LinearGradient
                        // Button Linear Gradient
                        colors={[
                          AppStyle.gradientColorOne,
                          AppStyle.gradientColorTwo,
                        ]}
                        style={styles.buttonStyle}
                      >
                        <Text style={styles.buttonTextStyle}>
                          Search
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>}

              {filterUserForInvitaion &&
                <View style={styles.eventOwnerSec}>
                  <View style={styles.eventOwnerSecSelect}>
                    <Text style={styles.eventOwnerSecSelectTxt}>
                      {chkText} All
                    </Text>
                    <Checkbox.Android
                      color={AppStyle.appIconColor}
                      uncheckedColor={AppStyle.appIconColor}
                      status={allUserChecked ? "checked" : "unchecked"}
                      onPress={() => {
                        this.checkAll();
                      }}
                    />
                  </View>

                  <ScrollView
                    style={styles.UstyleOstyle}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                  >
                    {ulistRecrds}
                  </ScrollView>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent:'space-between'
                  }}>
                    <View style={[styles.buttonOutertyle, {
                      width:'48%'
                    }]}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          // sendInvitation();
                            this.setState({
                              filterUserForInvitaion: false
                            })
                        }}
                      >
                        <LinearGradient
                          // Button Linear Gradient
                          colors={[
                            AppStyle.gradientColorOne,
                            AppStyle.gradientColorTwo,
                          ]}
                          style={styles.buttonStyle}
                        >
                          <Text style={[styles.buttonTextStyle, {
                            fontSize:14
                          }]}>
                            Cancel
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.buttonOutertyle, {
                      width:'48%'
                    }]}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          sendInvitation();
                          setTimeout(() => {
                            this.setState({
                              filterUserForInvitaion: false
                            })
                          }, 500);
                        }}
                      >
                        <LinearGradient
                          // Button Linear Gradient
                          colors={[
                            AppStyle.gradientColorOne,
                            AppStyle.gradientColorTwo,
                          ]}
                          style={[styles.buttonStyle]}
                        >
                          <Text style={[styles.buttonTextStyle, {
                            fontSize:14
                          }]}>
                            Send Invitation
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>


                </View>
              }
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
            <View style={styles.changecitySection}>
              <Text style={styles.changeHeadtext}>Change Location</Text>
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
                <Text style={[styles.SectionLabel, { width: 57 }]}>State</Text>
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

          <Modal
            animationType={"fade"}
            transparent={true}
            visible={imodalVisible}
            onRequestClose={() => { }}
          >
            {/*All views of Modal*/}
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>
                Invitation sent successfully
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
                  onPress={redirectEvents}
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
        </ScrollView>
        <CookieNavigationScreen navigation={this.props.navigation} />
      </View>
    );
  }
}
export default SendInvitaionScreen;
const styles = StyleSheet.create({
  mainBodyWithPadding: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#ffffff",
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: -40,
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 30,
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
    marginTop: 6,
  },
  addbuttonsStylve: {
    marginLeft: 5,
    padding: 8,
  },
  innerHeadSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -40,
  },
  innerfavSection: {
    backgroundColor: "rgba(253, 139, 48, 0.69)",
    width: 99,
    height: 99,
  },
  innerSection: {
    height: 78,
    width: 78,
    backgroundColor: "#fff",
    borderColor: "#E8E6EA",
    borderWidth: 6,
    backgroundColor: "#fff",
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  postListSection: {
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
    fontSize: 14,
  },
  SectionHeadStyle: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",

    marginTop: -4,
  },
  formContainer: {
    marginTop: 20,
  },
  mainStection: {
    paddingTop: 10,
    width: "100%",
  },
  selectionContStection: {
    flexDirection: "row",
    width: "100%",
    textAlign: "center",
    paddingTop: 10,
    marginBottom: 10,
    flex: 1,
    flexDirection: "row",

    alignItems: "stretch",
  },
  selectboxContainer: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    fontFamily: "Abel",
    borderWidth: 1,
    borderColor: "#E8E6EA",
    borderRadius: 16,
    height: 55,
    marginBottom: 20,
  },
  selectionContainer: {
    borderColor: "#E8E6EA",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    marginBottom: 15,
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: AppStyle.buttonTBPadding,
    paddingBottom: AppStyle.buttonTBPadding,
    borderLeftWidth: 1,
    borderRightWidth: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: "row",
    minWidth: "50%",
    width: "50%",
    alignItems: "center",
    height: 55,
    justifyContent: "center",
  },
  selectionGContainer: {
    borderColor: "#E8E6EA",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    marginBottom: 15,
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: AppStyle.buttonTBPadding,
    paddingBottom: AppStyle.buttonTBPadding,
    borderLeftWidth: 1,
    borderRightWidth: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: "row",
    minWidth: "50%",
    width: "100%",
    alignItems: "center",
    height: 55,
    justifyContent: "center",
  },
  selectionRightContainer: {
    textAlign: "center",
    borderColor: "#E8E6EA",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: AppStyle.buttonTBPadding,
    paddingBottom: AppStyle.buttonTBPadding,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: "row",
    minWidth: "50%",
    width: "50%",
    alignItems: "center",
    height: 55,
    justifyContent: "center",
  },
  selectionGRightContainer: {
    textAlign: "center",
    borderColor: "#E8E6EA",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: AppStyle.buttonTBPadding,
    paddingBottom: AppStyle.buttonTBPadding,
    borderLeftWidth: 0,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: "row",
    minWidth: "50%",
    width: "100%",
    alignItems: "center",
    height: 55,
    justifyContent: "center",
  },
  searchText: {
    color: AppStyle.fontColor,
    fontFamily: "GlorySemiBold",
    fontSize: 14,
  },
  selectedDValCont: {
    backgroundColor:
      "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)",
  },
  selectedCValCont: {
    backgroundColor:
      "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)",
  },
  SectionHedRightView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  privateSection: {
    padding: 10,
    backgroundColor: AppStyle.appIconColor,
    borderRadius: 10,
    width: 80,
    marginRight: 10,
    justifyContent: "center",
    flexDirection: "row",
  },
  inviteSection: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#777777",
    borderRadius: 10,
    width: 80,
    justifyContent: "center",
  },
  SectionHedText: {
    fontSize: AppStyle.aapPageHeadingSize,
    fontFamily: "Abel",
    color: AppStyle.fontColor,
  },
  evtHedText: {
    fontSize: 18,
    fontFamily: "Abel",
    color: AppStyle.fontColor,
    marginBottom: 2,
  },
  invitebtnText: {
    fontSize: 18,
    fontFamily: "Abel",
    color: "#fff",
  },
  privatebtnText: {
    fontSize: 18,
    fontFamily: "Abel",
    color: AppStyle.fontColor,
  },
  mainSection: {
    marginTop: 10,
  },
  eventCheckSec: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventCheckSecLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventCheckSecRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: -6,
    marginRight: 20,
  },
  eventCheckHead: {
    fontSize: 18,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,
    lineHeight: 20,
  },
  eventdCheckText: {
    fontSize: 15,
    fontFamily: "Abel",
    fontWeight: "400",
    color: "#777777",
    flex: 1,
    flexWrap: "wrap",
    marginLeft: 13,
  },
  eventCheckText: {
    fontSize: 15,
    fontFamily: "Abel",
    fontWeight: "400",
    color: "#777777",
    flex: 1,
    flexWrap: "wrap",
  },
  eventCheckInfText: {
    fontSize: 16,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,
    flexWrap: "wrap",
  },
  eventCountaText: {
    fontSize: 14,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,
    flexWrap: "wrap",
  },
  eventCountText: {
    fontSize: 14,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.appIconColor,
    flexWrap: "wrap",
  },
  eventDetailtimeSec: {
    flexDirection: "column",
    marginTop: 10,
    backgroundColor: "#E9B74112",
    padding: 10,
  },
  eventDetailinnertimeSec: {
    flexDirection: "row",
    marginBottom: 10,
  },
  eventDetailOrganizeroct: {
    marginTop: 5,
  },
  eventDetailOrganizerInTxt: {
    fontSize: 14,
    fontFamily: "Abel",
    fontWeight: "400",
    color: "#777777",
    flex: 1,
    flexWrap: "wrap",
    marginTop: 5,
  },
  UstyleOstyle: {
    maxHeight: 350,
  },
  buttonOutertyle: {
    marginTop: 20,
  },
  buttonStyle: AppStyle.AppbuttonStyle,
  buttonTextStyle: {
    color: AppStyle.fontButtonColor,
    fontSize: AppStyle.buttonFontsize,
    fontFamily: "Abel",
  },
  eventiOCns: {
    marginRight: 10,
  },
  eventlistContainer: {
    backgroundColor: "#575C8A0F",
    borderRadius: 16,
    padding: 5,
  },
  eventOwnerSecSelect: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  eventOwnerSecSelectTxt: {
    fontSize: 14,
    fontFamily: "Abel",
    fontWeight: "400",
    color: "#777777",
  },
  outerEventContainer: {
    flexDirection: "row",
    borderRadius: 16,
    backgroundColor: "#fff",
    borderColor: "#E8E6EA",
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 10,
  },
  outerEventContainerNob: {
    flexDirection: "row",
    borderRadius: 16,
    backgroundColor: "#fff",

    marginTop: 8,
  },
  leftEventContainer: {
    width: "25%",
  },
  userImagesec: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: AppStyle.maplocationColor,
  },
  rightEventContainer: {
    width: "65%",
  },
  imageMlistCont: {
    height: 48,
    width: 48,
  },
  topevetHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  eventOwnerSec: {
    marginTop: 10,
  },
  searchContentOtrt: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchContentInr: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  searchMulCheck: {
    marginRight: 5,
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
    alignItems: "center",
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
    textTransform: "capitalize",
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
  buttonMStyle: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    borderRadius: 15,
    width: "85%",
    marginLeft: 10,
  },
  buttonCStyle: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    borderRadius: 15,
    width: "85%",
    marginLeft: 10,
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
  sameguruContOut: {
    flexDirection: "row",
  },
  sameguruCont: {
    resizeMode: "contain",
    width: AppStyle.sameGuruImgWidth,
    height: AppStyle.sameGuruImgHeight,
  },

  inputboxContainer: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 20,
    borderColor: "#E8E6EA",
    borderWidth: 1,
    borderRadius: 16,
    height: 55,
    marginBottom: 22,
  },
  inputStyle: {
    height: 58,
    color: AppStyle.fontColor,
    fontSize: 16,
    position: "relative",
    zIndex: 1, // works on io,
    fontFamily: "Abel",
    textTransform: "capitalize",
  },
  clearSection: {
    color: 'rgba(253, 139, 48, 0.69)',
    fontSize: 16,
    fontFamily: 'Abel',
  },
});
