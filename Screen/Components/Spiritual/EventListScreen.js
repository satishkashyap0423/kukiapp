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

class EventListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      postedChecked: false,
      ishowMOdal: false,
      modalVisible: false,
      modalStateCityVisible: false,
      eventRecords: [],
      errMsg: "",
      isDeleteId: "",
      takeVal: "100",
      isShowLoad: true,
      selectedGuru: [],
      stateData: [],
      cityData: [],
      SselectedItems: [],
      CselectedItems: [],
      CityitemsData:[],
      StateitemsData:[],
      selectedState:[],
      selectedCity:[],

      filterData: [
        {
          name: "Only Events Most Recently Posted",
          id: 1,
        },
        {
          name: "Only Events Posted By Me",
          id: 2,
        },
        {
          name: "Only Events Posted From My Selected City",
          id: 3,
        },
        {
          name: "Only Events I am Invited To",
          id: 4,
        },
      ],
    };
  }

  getuserDetail = (i, isSend) => {
    this.props.navigation.push("CookiesDetail", {
      user_id: i,
      isFrom: 1,
      isSend: isSend,
    });
  };

  backScreen() {
    this.props.navigation.navigate("SpiritualScreen", {
      isguruSelectedVal: "1",
    });
  }

  async getEventList(dropdownVal) {
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    console.log(udata);
    let statedata = await JSON.parse(await AsyncStorage.getItem("spostState"));
    console.log(statedata);
    let cityata = await JSON.parse(await AsyncStorage.getItem("spostCity"));
    this.setState({ loading: true });
    console.log(dropdownVal)
    if (dropdownVal === 1 || dropdownVal === 2 || dropdownVal === 3) {
      let data = JSON.stringify({
        user_id: udata.id,
        guru_id: this.state.selectedGuru.id,
        state_id: dropdownVal==3 ? statedata.id :"", // dropdownval should be 3
        city_id: dropdownVal==3 ? cityata.id:"", // dropdownval should be 3 
        take: this.state.takeVal,
        is_private: dropdownVal === 2 ? true : false,
      });
      console.log("get event---", data);
      let headers = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      axios
        .post(Api.apiUrl + "/get-events-list", data, headers)
        .then((res) => {
          console.log("events list ", res.data.data);
          this.setState({ loading: false });
          this.setState({ takeVal: res.data.take });
          if (res.data.data.length >= this.state.takeVal) {
            this.setState({ isShowLoad: true });
          } else {
            this.setState({ isShowLoad: false });
          }
          this.setState({ eventRecords: res.data.data });
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
    } else if (dropdownVal == 4) {
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
        .post(Api.apiUrl + "/get-event-invite", data, headers)
        .then((res) => {
          console.log(res);
          this.setState({ loading: false });
          if (res.data.status == "true") {
            let eventRecords = [];
            res.data.data.map((item) => {
              item.event_data.city_data = cityata;
              item.event_data.state_data = statedata;
              item.event_data.start_time = item.start_time;
              item.event_data.end_time = item.end_time;
              console.log(item.event_data);
              eventRecords.push(item.event_data);
            });
            this.setState({ eventRecords: eventRecords });
            AsyncStorage.setItem(
              "storageeventInviateData",
              JSON.stringify(res.data.data)
            );
          }
        })
        .catch((error) => {
          if (error.toJSON().message === "Network Error") {
            this.setState({ errMsg: AlertMessages.noInternetErr });
            this.setState({ ishowMOdal: true });
            this.setState({ loading: false });
          } else {
            console.log("get invites data error--- ", error.toJSON().message);
            this.setState({ errMsg: error.toJSON().message });
            this.setState({ ishowMOdal: true });
            this.setState({ loading: false });
          }
        });
    }
  }

  handelEvent(id) {
    this.setState({ isDeleteId: id });
    this.setState({ modalVisible: true });
  }

  openEvent(val) {
    this.props.navigation.navigate("EventDetailScreen", {
      event_id: val,
    });
  }

  deleteEvent() {
    this.setState({ loading: true });
    let data = JSON.stringify({
      event_id: this.state.isDeleteId,
    });

    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios
      .post(Api.apiUrl + "/delete-event", data, headers)
      .then((res) => {
        this.setState({ modalVisible: false });
        this.setState({ loading: false });
        this.getEventList();
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

  setModalVisible() {
    this.setState({ modalVisible: false });
  }

  async getLocation() {
    let statedata = await JSON.parse(await AsyncStorage.getItem("spostState"));
    let cityata = await JSON.parse(await AsyncStorage.getItem("spostCity"));
    this.setState({ stateData: statedata });
    this.setState({ cityData: cityata });
  }

  async componentDidMount() {
    let gData = JSON.parse(await AsyncStorage.getItem("guruData"));
    if (gData != null) {
      this.setState({ selectedGuru: gData });
      //console.log(gData);
    }

    this.setState({ SselectedItems: [this.state.filterData[0].id] });
    this.getEventList(this.state.filterData[0].id);
    this.getLocation();
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.getEventList(this.state.filterData[0].id);
      this.setState({ SselectedItems: [this.state.filterData[0].id] });
      this.getLocation();
      this.setState({ takeVal: "100" });
    });
  }

  getStateList = async (country_id) => {
    this.state.loading = true;
    let data = JSON.stringify({
    country_id: country_id
    });
    const token = await AsyncStorage.getItem('fcmtoken');
    let headers = {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authentication': `Bearer ${token}`
      }
    }
    axios.post(Api.apiUrl+'/get-states', data, headers)
    .then(res => {
    this.state.loading = false;
    this.setState({StateitemsData:res.data.data}); 
    })
    .catch(error => {
      if(error.toJSON().message === 'Network Error'){
        this.setState({errMsg:AlertMessages.noInternetErr});
        this.setState({ishowMOdal:true});
        this.setState({loading:false}); 
      }else{
        this.setState({errMsg:error.toJSON().message});
        this.setState({ishowMOdal:true}); 
        this.setState({loading:false});
      }
    });
  }

  getCityList = async (state_id) => {
     this.setState({loading:true});
    let data = JSON.stringify({
    state_id: state_id
    });
    const token = await AsyncStorage.getItem('fcmtoken');
    
    let headers = {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authentication': `Bearer ${token}`
      }
    }
    axios.post(Api.apiUrl+'/get-cities', data, headers)
    .then(res => {
      console.log(res)
    this.setState({loading:false});
    this.setState({CityitemsData:res.data.data}); 
    })
    .catch(error => {
      if(error.toJSON().message === 'Network Error'){
        this.setState({errMsg:AlertMessages.noInternetErr});
        this.setState({ishowMOdal:true});
        this.setState({loading:false}); 
      }else{
        this.setState({errMsg:error.toJSON().message});
        this.setState({ishowMOdal:true}); 
        this.setState({loading:false});
      }
    });
  }

  onSSelectedStateItemsChange = (selectedItems, val ) => {
    console.log(selectedItems)
    this.setState({
      selectedState:selectedItems
    })
    this.getCityList(selectedItems[0])
  }
  onCSelectedCityItemsChange = (selectedItems, val ) => {
    console.log(selectedItems)
    this.setState({
      selectedCity:selectedItems
    })
  }
  onSSelectedItemsChange = (selectedItems, val) => {
    this.setState({ SselectedItems: selectedItems });
    if (selectedItems[0] === 1) {
      this.getEventList(1);
    } else if (selectedItems[0] === 2) {
      this.getEventList(2);
    } else if (selectedItems[0] == 3) {
      this.getEventList(3);
    } else if (selectedItems[0] === 4) {
      this.getEventList(4);
    }
  };

  openLocation = async() => {
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    let statedata = await JSON.parse(await AsyncStorage.getItem("spostState"));
    console.log(statedata);
    let country_id =  parseInt(udata.country_code.split("+")[1])
    this.getStateList(country_id);
    this.getCityList(statedata.id);

    this.setState({ modalStateCityVisible: true });
  };

  saveLocation = async () => {
    const {selectedState, selectedCity} = this.state;
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    if(selectedState == ''){
      this.setState({errMsg:AlertMessages.stateErr});
      this.setState({ishowMOdal:true});
      return;
    }

    if(selectedCity == ''){
      this.setState({errMsg:AlertMessages.cityErr});
      this.setState({ishowMOdal:true});
      return;
    }
     this.setState({modalStateCityVisible:false});
    this.state.loading = true;
    let data = JSON.stringify({
      country_id: '91',
      state_id: selectedState.toString(),
      city_id: selectedCity.toString(),
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
  }

  sendToPost = async()=>{
    this.props.navigation.navigate("PostEventScreen" );
  }
  render() {
    const {
      loading,
      ishowMOdal,
      errMsg,
      postedChecked,
      modalVisible,
      eventRecords,
      takeVal,
      isShowLoad,
      selectedGuru,
      stateData,
      cityData,
      StateitemsData,
      CityitemsData
    } = this.state;

    let eventlistData = [];
    if (eventRecords.length > 0) {
      for (var i = 0; i < eventRecords.length; i++) {
        let isPrivate = "";
        if (eventRecords[i].is_event == "1") {
          isPrivate = "Private";
        }
        /*let evtHead = eventRecords[i].event_heading.substring(0, 55)+'...';
      let evtAddr = eventRecords[i].address.substring(0, 55)+'...';
*/

        let evtHead = eventRecords[i].event_heading;

        if (evtHead.length > 28) {
          evtHead = eventRecords[i].event_heading.substring(0, 28) + "...";
        }

        let evtAddr = eventRecords[i].address;

        if (evtAddr.length > 50) {
          evtAddr = eventRecords[i].address.substring(0, 50) + "...";
        }

        eventlistData.push(
          <TouchableOpacity
            style={styles.outerEventContainer}
            key={eventRecords[i].id}
            activeOpacity={0.6}
            onPress={this.openEvent.bind(this, eventRecords[i].id)}
          >
            <View style={styles.leftEventContainer}>
              <View style={styles.userImagesec}>
                <Text style={styles.eventDateText}>
                  {eventRecords[i].event_month}
                </Text>
                <Text style={styles.eventDateText}>
                  {eventRecords[i].event_day}
                </Text>
              </View>
            </View>
            <View style={styles.rightEventContainer}>
              <View style={styles.topevetHead}>
                <Text style={styles.eventNameTxt}>{evtHead}</Text>
              </View>

              {/* <View style={styles.topevetHead}>
           <TouchableOpacity
              
              activeOpacity={0.8}
               onPress={this.openEvent.bind(this,eventRecords[i].id)}>
            <Text style={styles.eventDateTxt}>{eventRecords[i].formatted_date} • {eventRecords[i].start_time}</Text>
           
             </TouchableOpacity>
              <Text style={styles.eventTypeTxt}>{isPrivate}</Text>
          </View> */}

              <View style={styles.topevetHeadR}>
                <Text style={styles.eventContentTxt}>
                  From {eventRecords[i].start_time} To{" "}
                  {eventRecords[i].end_time}
                </Text>
                <View style={styles.topevdetHeadR}>
                  <Text style={styles.eventContentTxt}>
                    {eventRecords[i]?.city_data.name},{" "}
                    {eventRecords[i]?.state_data.state_abbrivation}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      }
    } else {
      eventlistData.push(
        <View key="no_resc" style={styles.norouterEventContainder}>
          <Text style={styles.eventNameTxt}>No Events Found !</Text>
        </View>
      );
    }

    const handleSubmitPress = async () => {
      let takeVal = this.state.takeVal + 5;
      this.setState({ takeVal: takeVal });
      this.getEventList();
    };
    let guruImage = `${Api.imgaePath}/${selectedGuru.image_path}`;;

    return (
      <View style={{ flex: 1, height: "100%", backgroundColor: "#fff" }}>
        <Loader loading={loading} />
        {ishowMOdal && (
          <UseAlertModal
            message={errMsg}
            parentCallback={this.handleCallback}
          />
        )}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.topheadSection}>
            <Image
              source={{ uri: guruImage }}
              style={{
                width: "100%",
                height: 300,
                resizeMode: "cover",
              }}
            />
          </View>

          <View style={[styles.mainBodyWithPadding]}>
            <View style={{
              flexDirection:'row',
              justifyContent:'space-between'
            }}>
            <View style={styles.innerHeadSection}>
              <TouchableOpacity
                style={styles.innerSection}
                activeOpacity={0.5}
                onPress={this.backScreen.bind(this)}
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
            {/* <View style={styles.innerHeadSection}>
              <TouchableOpacity
                style={styles.innerSection}
                activeOpacity={0.5}
                onPress={()=> this.sendToPost()}
              >
                <FontAwesome5
                  name={"plus"}
                  size={22}
                  color={
                    "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"
                  }
                />
              </TouchableOpacity>
            </View> */}
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
                onPress={this.openLocation}
              >
                <Feather
                  name={"edit"}
                  size={18}
                  color={AppStyle.appIconColor}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.SectionHeadStyle}>
              <Text style={styles.SectionHedText}>Spiritual Events</Text>
              <TouchableOpacity
                onPress={()=> this.sendToPost()}
                activeOpacity={0.7}
              >
                <LinearGradient
                  // Button Linear Gradient
                  colors={[
                    AppStyle.gradientColorOne,
                    AppStyle.gradientColorTwo,
                  ]}
                  style={styles.addbuttonStylve}
                >
                  <Feather name={"plus"} size={24} color={AppStyle.fontColor} />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.mainSection}>
              {/* <View style={styles.eventCheckSec}>
                <View style={styles.eventCheckSecRight}>
                  <Checkbox.Android
                    color={AppStyle.appIconColor}
                    uncheckedColor={AppStyle.appIconColor}
                    status={postedChecked ? "checked" : "unchecked"}
                    onPress={() => {
                      this.setState({ postedChecked: !postedChecked });
                      this.setState({ privateChecked: false });
                      this.getEventList();
                    }}
                  />
                  <Text style={styles.textSubheading}>
                    Show Only Events I Posted{" "}
                  </Text>
                </View>
              </View> */}
              <View style={[styles.selectboxNwContainer, {
                paddingHorizontal:10
              }]}>
                <SectionedMultiSelect
                  items={this.state.filterData}
                  IconRenderer={Icon}
                  uniqueKey="id"
                  subKey="children"
                  selectText="Most Recent"
                  showDropDowns={true}
                  single={true}
                  onSelectedItemsChange={this.onSSelectedItemsChange}
                  selectedItems={this.state.SselectedItems}
                  subItemFontFamily={{ fontFamily: "Abel" }}
                  itemFontFamily={{ fontFamily: "Abel" }}
                  searchTextFontFamily={{ fontFamily: "Abel" }}
                  confirmFontFamily={{ fontFamily: "Abel" }}
                  searchPlaceholderText="Search State"
                  showCancelButton={true}
                  hideSearch={true}
                  colors={{
                    primary:
                      "background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)",
                  }}
                  hideConfirm={true}
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
                      height: 280,
                      paddingTop: 10,
                      overflow: "scroll",
                      paddingBottom: 0,
                    },
                    selectToggle: {
                      width: "100%",
                    },
                  }}
                />
              </View>
              <View style={styles.eventlistContainer}>{eventlistData}</View>

              {isShowLoad && (
                <View style={styles.btnCont}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSubmitPress}
                  >
                    <LinearGradient
                      // Button Linear Gradient
                      colors={[
                        AppStyle.gradientColorOne,
                        AppStyle.gradientColorTwo,
                      ]}
                      style={styles.buttonStyle}
                    >
                      <Text style={styles.buttonTextStyle}>Load More</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalStateCityVisible}
              onRequestClose={() => {
                this.setState({
                  modalStateCityVisible:!this.state.modalStateCityVisible
                })
              }}
            >
              <View style={styles.changecitySection}>
                <Text style={styles.changeHeadtext}></Text>
                <View style={[styles.selectboxNwContainer, {
                   margin:10,
                   padding:15,
                }]}>
                  <SectionedMultiSelect
                    items={StateitemsData}
                    IconRenderer={Icon}
                    uniqueKey="id"
                    subKey="children"
                    selectText="Your State..."
                    showDropDowns={true}
                    single={true}
                    onSelectedItemsChange={this.onSSelectedStateItemsChange}
                    selectedItems={this.state.selectedState}
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
                      selectToggle: {
                        width: "100%",
                      },
                    }}
                  />
                  <Text style={[styles.SectionLabel, { width: 57 }]}>
                    State
                  </Text>
                </View>
                <View style={[styles.selectboxNwContainer, {
                  margin:10,
                  padding:15,
                }]}>
                  <SectionedMultiSelect
                    items={CityitemsData}
                    IconRenderer={Icon}
                    uniqueKey="id"
                    subKey="children"
                    selectText="Your City..."
                    showDropDowns={true}
                    single={true}
                    onSelectedItemsChange={this.onCSelectedCityItemsChange}
                    selectedItems={this.state.selectedCity}
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
                      selectToggle: {
                        width: "100%",
                      },
                    }}
                  />
                  <Text style={[styles.SectionLabel, { width: 47 }]}>City</Text>
                </View>

                <View style={styles.urlbtnSection}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        modalStateCityVisible:false
                      })
                    }}
                    activeOpacity={0.8}
                    style={styles.wrapperdOuterCustom}
                  >
                    <View style={styles.wrapperdDCustom}>
                      <Text style={styles.urlcloseButton}>Close</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={()=>this.saveLocation()}
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
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              this.setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modal}>
              <View style={styles.urlSection}>
                <Text style={styles.urlDeleteText}>
                  Are you sure you want to delete the event ?
                </Text>
                <View style={styles.urlbtnSection}>
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

                  <LinearGradient
                    // Button Linear Gradient
                    colors={[
                      AppStyle.gradientColorOne,
                      AppStyle.gradientColorTwo,
                    ]}
                    style={styles.urladdButtonCls}
                  >
                    <Pressable
                      onPress={() => {
                        this.deleteEvent();
                      }}
                      style={({ pressed }) => [
                        {
                          color: pressed ? "rgb(210, 230, 255)" : "white",
                        },
                        styles.wrapperCustom,
                      ]}
                    >
                      <Text style={styles.urladdButtonxtTCls}>Delete</Text>
                    </Pressable>
                  </LinearGradient>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
        <CookieNavigationScreen navigation={this.props.navigation} />
      </View>
    );
  }
}
export default EventListScreen;

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
  postListSection: {
    marginBottom: 10,
  },
  innermainlayutSection: {
    marginTop: 10,
    flexDirection:'row',
    alignItems:'center',
  
  },
  SectionHeadStyle: {
    flexDirection: "row",
    paddingBottom: 6,
    justifyContent: "space-between",
    alignItems: "center",
  },
  formContainer: {
    marginTop: 20,
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
  mainSection: {},
  eventCheckSec: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
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
  eventCheckText: {
    fontSize: 18,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,
  },
  eventlistContainer: {
    borderRadius: 16,
    padding: 5,
    marginTop: 10,
  },
  outerEventContainer: {
    flexDirection: "row",
    borderRadius: 15,
    backgroundColor: "#fff",
    padding: 8,
    marginBottom: 15,
    shadowColor: "#333",
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  outerEventContainder: {
    flexDirection: "row",
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 15,
  },
  addbuttonsStylve: {
    marginLeft: 5,
    padding: 8,
  },
  norouterEventContainder: {
    flexDirection: "row",
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 15,
    shadowColor: "#333",
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  leftEventContainer: {
    flexDirection: "row",
    width: 65,
    height: 64,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: AppStyle.appIconColor,
    padding: 3,
  },
  userImagesec: {
    width: 55,
    height: 54,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: AppStyle.appIconColor,
    padding: 3,
    alignItems: "center",
    backgroundColor: AppStyle.appIconColor,
  },
  eventDateText: {
    color: AppStyle.fontColor,
    fontFamily: "GlorySemiBold",
    fontSize: 16,
    textTransform: "capitalize",
    textAlign: "center",
  },
  rightEventContainer: {
    width: "75%",
    paddingLeft: 10,
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
  topevetHeadR: {
    flexDirection: "column",

    width: "100%",
  },
  topevdetHeadR: {
    flexDirection: "row",

    alignItems: "center",
  },
  eventNameTxt: {
    fontSize: 16,
    fontFamily: "GlorySemiBold",
    color: AppStyle.fontColor,
    flex: 1,
    flexWrap: "wrap",
  },
  eventDateTxt: {
    fontSize: 14,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.appIconColor,
  },
  eventTypeTxt: {
    fontSize: 12,
    fontFamily: "Abel",
    fontWeight: "400",
    marginRight: 15,
    color: AppStyle.fontColor,
  },
  eventContentTxt: {
    color: "#AAA6B9",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Abel",
  },
  eventContentfTxt: {
    color: AppStyle.fontColor,
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Abel",
    flex: 1,
    flexWrap: "wrap",
    marginLeft: 5,
  },
  btnCont: {
    paddingTop: 5,
    bottom: 10,
    left: 0,
    right: 0,
    flex: 1,
    width: "100%",
    top: 5,
  },
  buttonStyle: AppStyle.AppbuttonStyle,
  buttonTextStyle: {
    color: AppStyle.fontButtonColor,
    fontSize: AppStyle.buttonFontsize,
    fontFamily: "Abel",
  },
  urlSection: {},
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
    paddingLeft: 10,
    paddingRight: 20,
    alignItems: "center",
  },
  buttonTextMStyle: {
    color: AppStyle.fontButtonColor,
    fontFamily: "GlorySemiBold",
    fontSize: 15,
    textTransform: "capitalize",
  },
  urlDeleteText: {
    color: AppStyle.fontButtonColor,
    fontFamily: "GlorySemiBold",
    fontSize: 14,
    textTransform: "capitalize",
    marginBottom: 10,
    textAlign: "center",
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
    color: AppStyle.fontButtonColor,
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "GlorySemiBold",
    padding: 15,
  },
  urladdButtonCls: {
    padding: 10,
    justifyContent: "center",
    borderRadius: 15,
    minWidth: 125,
    marginLeft: 10,
  },
  urladdButtonxtTCls: {
    color: AppStyle.fontColor,
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Abel",
    textAlign: "center",
  },
  selectboxNwContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E8E6EA",
    borderRadius: 16,
    height: 55,
    paddingLeft: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  selectboxNwContainerM: {
    flexDirection: "row",
    justifyContent: "center",
  },
  changecitySection:{
    paddingLeft:20,
    paddingRight:20,
    justifyContent:'center',
    flex: 1,
    alignItems:'center'
  },
       changeHeadtext:{
    fontSize:26,
    fontFamily:'GlorySemiBold',
    color:AppStyle.fontColor,
    marginBottom:25
  },
  wrapperdDCustom:{
    backgroundColor:AppStyle.btnbackgroundColor,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10,
    borderWidth:0
  },
  urlcloseButton:{
    color:AppStyle.fontColor,
    fontSize:16,
    fontWeight:'400',
    fontFamily: 'GlorySemiBold',
    padding:15
  },
  wrapperdOuterCustom:{
    width:'48%',
    padding:10,
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
  wrapperCustom: {
    flexDirection: "row",
    padding: 5,
  },
  wrapperdCustom: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 0,
  },
  addbuttonStylve: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 12,
    borderColor: AppStyle.gradientColorOne,
    backgroundColor: AppStyle.gradientColorOne,
  },
});
