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
class EventDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      attendingChecked: false,
      offeringChecked: false,
      ishowMOdal: false,
      modalVisible: false,
      isevetType: false,
      isevetPType: false,
      isInvitee: false,
      isInviteep: false,
      errMsg: "",
      Eventattending: "0",
      selectedGuru: [],
      eventRecords: [],
      eventOrganizers: [],
      luserData: [],
      eventUserdetail: [],
      eventUser: [],
      eventstateData: [],
      eventcityData: [],
      eventuserCommunityData: [],
      eventUserRating: "0",
      isOwnevent: false,
    };
  }
  backScreen(val) {
    const checkisBack = this.props.route.params;
    //console.log(event_idVal);
    if (checkisBack != undefined) {
      const is_back = this.props.route.params.is_back;
      if (is_back == "1") {
        this.props.navigation.navigate("HomeCookiesScreen");
      } else {
        if (val == 0) {
          this.props.navigation.navigate("EventListScreen");
        } else {
          this.props.navigation.navigate("PostEventScreen");
        }
      }
    }
  }
  inviteScreen(val) {
    this.props.navigation.navigate("SendInvitaionScreen", {
      event_id: val,
    });
  }
  shareEvent(val) {
    this.props.navigation.navigate("EventShareScreen", {
      event_id: val,
    });
  }
  handelEvent() {
    this.setState({ modalVisible: true });
  }
  openEvent() {
    this.props.navigation.navigate("HomeCookiesScreen");
  }
  deleteEvent() {
    this.setState({ modalVisible: false });
  }
  setModalVisible() {
    this.setState({ modalVisible: false });
  }

  editEvent(id) {
    this.props.navigation.push("PostEventScreen", {
      event_id: id,
    });
  }

  async getUserData(user_id) {
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));

    this.setState({ loading: true });
    let data = JSON.stringify({
      user_id: user_id,
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
        this.setState({ eventUserdetail: res.data.data.user_detail });
        this.setState({ eventUser: res.data.data.user_detail.user });
        this.setState({ eventUserRating: res.data.data.rating });
        this.setState({ eventstateData: res.data.data.user_detail.state_data });
        this.setState({ eventcityData: res.data.data.user_detail.city_data });
        this.setState({ eventuserCommunityData: res.data.data.communities });
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
  getuserDetail = (i, isSend) => {
    this.props.navigation.push("CookiesDetail", {
      user_id: i,
      isFrom: 1,
      isSend: isSend,
    });
  };
  async getEventDetail() {
    const eventId = this.props.route.params.event_id;

    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({ loading: true });
    let data = JSON.stringify({
      user_id: udata.id,
      event_id: eventId,
    });

    console.log(data);

    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios
      .post(Api.apiUrl + "/get-event-detail", data, headers)
      .then((res) => {
        console.log(res.data.data);
        this.setState({ loading: false });
        this.setState({ eventRecords: res.data.data });
        this.setState({ eventOrganizers: res.data.organizers_data });
        const logedUId = res.data.l_user_id;
        const eventUdId = res.data.data.user_id;
        this.getUserData(eventUdId);
        if (logedUId == eventUdId) {
          this.setState({ isOwnevent: true });
        }
        if (res.data.data.is_event != "1") {
          this.setState({ isevetPType: true });
        } else {
          this.setState({ isevetType: true });
        }

        if (res.data.data.is_event == "1" && logedUId == eventUdId) {
          this.setState({ isevetType: true });
          this.setState({ isevetPType: true });
        }
        if (res.data.isAttend == "1") {
          this.setState({ attendingChecked: true });
        }
        this.setState({ Eventattending: res.data.attending });
        if (res.data.isOffering == "1") {
          this.setState({ offeringChecked: true });
        }

        const checkisBack = this.props.route.params;
        //console.log(event_idVal);
        if (checkisBack != undefined) {
          const is_back = this.props.route.params.is_back;
          console.log(is_back + " - Rest " + res.data.data.is_event);
          if (is_back == "1" && res.data.data.is_event == "1") {
            this.setState({ isInvitee: true });
          } else if (is_back == undefined && res.data.data.is_event == "1") {
            this.setState({ isInvitee: true });
          }

          if (is_back == "1") {
            this.setState({ isInviteep: true });
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
  }

  async isdoEvent(event_id, isFor) {
    const eventId = this.props.route.params.event_id;
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));

    if (isFor == "2") {
      this.offerSeva();
    } else {
      this.setState({ loading: true });
      let data = JSON.stringify({
        user_id: udata.id,
        event_id: eventId,
        isFor: isFor,
      });
      let headers = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      axios
        .post(Api.apiUrl + "/attending-event", data, headers)
        .then((res) => {
          this.setState({ loading: false });
          this.setState({ Eventattending: res.data.attending });
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
  }

  async offerSeva() {
    const eventId = this.props.route.params.event_id;
    const fdataRes = this.state.eventRecords;
    const fdata = fdataRes.user_id;
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));

    let mesgCont =
      udata.first_name +
      " " +
      udata.last_name +
      " has offered seva to the event :" +
      fdataRes.event_heading;
    this.setState({ loading: true });
    let data = JSON.stringify({
      from_user_id: udata.id,
      to_user_id: fdata,
      event_id: eventId,
      message_content: mesgCont,
    });
    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios
      .post(Api.apiUrl + "/offer-seva-event", data, headers)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data.status == "true") {
          this.props.navigation.push("SingleChatScreen", {
            from_user_id: fdata,
          });
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

  async componentDidMount() {
    this.getEventDetail();
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.getEventDetail();
    });
    let gData = JSON.parse(await AsyncStorage.getItem("guruData"));
    if (gData != null) {
      this.setState({ selectedGuru: gData });
    }

    let uDetailData = JSON.parse(await AsyncStorage.getItem("userDetailsData"));
    if (uDetailData != null) {
      this.setState({ luserData: uDetailData });
    }
  }
  render() {
    const {
      loading,
      ishowMOdal,
      errMsg,
      attendingChecked,
      offeringChecked,
      modalVisible,
      eventRecords,
      selectedGuru,
      isevetType,
      isevetPType,
      eventOrganizers,
      Eventattending,
      eventUserdetail,
      eventUser,
      eventUserRating,
      eventstateData,
      eventcityData,
      eventuserCommunityData,
      isOwnevent,
      luserData,
      isInvitee,
      isInviteep,
    } = this.state;

    const handleSubmitPress = async () => {};

    let isSameguru = false;
    if (
      eventUserdetail.guru_id == luserData.guru_id &&
      eventUserdetail.user_id != luserData.user_id
    ) {
      isSameguru = true;
    }
    let ulistRecrds = [];

    for (var i = 0; i < 1; i++) {
      ulistRecrds.push(
        <View
          key={i}
          style={[
            i == 0 ? styles.outerEventContainerNob : styles.outerEventContainer,
          ]}
        >
          <View style={styles.leftEventContainer}>
            <View style={styles.outerImgSection}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={this.getuserDetail.bind(this, eventRecords.user_id, 0)}
              >
                <Image
                  // source={{ uri: eventUserdetail.user_profile_image }}
                  source={{ uri: `${Api.imgaePath}/${eventUserdetail.user_profile_image}` }}

                  style={styles.imagetopCont}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.rightEventContainer}>
            <View style={styles.sameguruContSect}>
              <Text style={styles.searchContentTextBold}>
                {eventUser.first_name} {eventUser.last_name},{" "}
                <Feather
                  name={"star"}
                  size={16}
                  color={AppStyle.appIconColor}
                />{" "}
                {eventUserRating}
                {isSameguru && (
                  <Text style={styles.searchContentTextBold}>, </Text>
                )}
                {isSameguru && (
                  <Image
                    source={require("../../../assets/images/icons/gurubhai.jpg")}
                    style={styles.sameguruCont}
                  />
                )}
              </Text>
            </View>
            <Text style={styles.searchContentText}>
              {eventUserdetail.gender}, {eventUserdetail.age_group},{" "}
              {eventcityData.name},{" "}
              {eventstateData.state_abbrivation != ""
                ? eventstateData.state_abbrivation
                : eventstateData.name}
            </Text>
            <Text style={styles.searchContentText}>
              {eventuserCommunityData.name}
            </Text>
          </View>
        </View>
      );
    }

    let guruImage = selectedGuru.image_path;
    let iseventType = false;

    let organizerData = [];
    if (eventOrganizers.length > 0) {
      for (i = 0; i < eventOrganizers.length; i++) {
        if (eventOrganizers[i].name != "") {
          organizerData.push(
            <View
              key={i}
              style={[
                i == eventOrganizers.length - 1
                  ? styles.eventDetailOrganizeroctWB
                  : styles.eventDetailOrganizeroct,
              ]}
            >
              <Text style={styles.eventDetailOrganizerInTxt}>
                {eventOrganizers[i].name} : {eventOrganizers[i].phone_number}
              </Text>
            </View>
          );
        }
      }
    } else {
      organizerData.push(
        <View key="no_rec" style={styles.eventDetailOrganizeroctWB}>
          <Text style={styles.eventDetailOrganizerInTxt}>No Records</Text>
        </View>
      );
    }

    let isForma = true;

    if (
      eventRecords.formatted_date == eventRecords.formatted_end_date ||
      eventRecords.formatted_end_date == null
    ) {
      isForma = false;
    }

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
            <View>
              <Image
                // source={{ uri: eventRecords?.guru_record?.image_path }}
                source={{ uri: `${Api.imgaePath}/${eventRecords?.guru_record?.image_path}` }}

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
              {isOwnevent && (
                <TouchableOpacity
                  style={styles.innerSection}
                  activeOpacity={0.5}
                  onPress={this.editEvent.bind(this, eventRecords.id)}
                >
                  <FontAwesome5
                    name={"edit"}
                    size={22}
                    color={
                      "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"
                    }
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.SectionHeadStyle}>
              <Text style={styles.SectionHedText}>Event Detail</Text>
              <View style={styles.SectionHedRightView}>
                {isevetType && isevetPType && !isInviteep && (
                  <View style={styles.privateSection}>
                    <Text style={styles.privatebtnText}>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={this.shareEvent.bind(this, eventRecords.id)}
                      >
                        <Text style={styles.privatebtnText}>Share</Text>
                      </TouchableOpacity>
                    </Text>
                  </View>
                )}
                {isevetType && isevetPType && !isInviteep && (
                  <TouchableOpacity
                    style={styles.inviteSection}
                    activeOpacity={0.5}
                    onPress={this.inviteScreen.bind(this, eventRecords.id)}
                  >
                    <Text style={styles.invitebtnText}>Invite</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.mainSection}>
              <View style={styles.eventDetailSec}>
                <View style={styles.eventDetailSecHed}>
                  <Text style={styles.eventCheckHead}>
                    {eventRecords.event_heading}
                  </Text>
                </View>
                <Text style={styles.eventCheckTDext}>
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

                  {isForma && (
                    <Text style={styles.eventCheckText}>
                      {eventRecords.formatted_date} -{" "}
                      {eventRecords.formatted_end_date}
                    </Text>
                  )}
                  {!isForma && (
                    <Text style={styles.eventCheckText}>
                      {eventRecords.formatted_date}
                    </Text>
                  )}
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
              <View style={styles.eventDetailOrganizerSec}>
                <Text style={styles.eventDetailOrganizerTxt}>Organizers</Text>
                {organizerData}
              </View>
              {isOwnevent && isevetType && (
                <View style={styles.eventDetailStat}>
                  <View style={styles.eventCheckSec}>
                    <View style={styles.eventCheckSecDRight}>
                      <Text style={styles.eventCountText}>
                        {Eventattending}{" "}
                        <Text style={styles.eventCountaText}> Attending </Text>
                      </Text>
                    </View>
                    <View style={styles.eventCheckSecDRight}>
                      <Text style={styles.eventCountText}>
                        {Eventattending}{" "}
                        <Text style={styles.eventCountaText}>
                          {" "}
                          Offering Seva{" "}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              {isevetType && !isOwnevent && (
                <View style={styles.eventDetailStat}>
                  <View style={styles.eventCheckSec}>
                    <View style={styles.eventCheckSecRight}>
                      <Checkbox.Android
                        disabled={attendingChecked}
                        color={AppStyle.appIconColor}
                        uncheckedColor={AppStyle.appIconColor}
                        status={attendingChecked ? "checked" : "unchecked"}
                        onPress={() => {
                          this.setState({
                            attendingChecked: !attendingChecked,
                          });
                          this.isdoEvent(eventRecords.id, 1);
                        }}
                      />
                      <Text style={styles.eventCheckInfText}>
                        I am Attending
                      </Text>
                    </View>
                    {/* {isevetType && <View style={styles.eventCheckSecRight}>
                     
                     <Text style={styles.eventCountText}>{Eventattending} <Text style={styles.eventCountaText}> Attending </Text></Text>
                  </View> } */}
                  </View>
                  <View style={styles.eventCheckSec}>
                    <View style={styles.eventCheckSecRight}>
                      <Checkbox.Android
                        disabled={offeringChecked}
                        color={AppStyle.appIconColor}
                        uncheckedColor={AppStyle.appIconColor}
                        status={offeringChecked ? "checked" : "unchecked"}
                        onPress={() => {
                          this.setState({ offeringChecked: !offeringChecked });
                          this.isdoEvent(eventRecords.id, 2);
                        }}
                      />
                      <Text style={styles.eventCheckInfText}>
                        I am Offering Seva
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <View style={styles.eventOwnerSec}>
                <Text style={styles.eventDetailOrganizerTxt}>With Regards</Text>
                {ulistRecrds}
              </View>
            </View>
          </View>
        </ScrollView>
        <CookieNavigationScreen navigation={this.props.navigation} />
      </View>
    );
  }
}
export default EventDetailScreen;
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
  dtappDetail: {
    position: "absolute",
    top: -10,
    left: 20,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    height: 25,
    width: 97,
    flexDirection: "row",
  },
  searchConteshareTextntText: {
    fontFamily: "Abel",
    color: "rgba(0, 0, 0, 0.4)",
    fontSize: 17,
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
  SectionHeadStyle: {
    flexDirection: "row",
    paddingBottom: 6,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -12,
    marginTop: 20,
    marginBottom: 20,
  },
  formContainer: {
    marginTop: 20,
  },
  SectionHedRightView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  privateSection: {
    padding: 10,
    backgroundColor: AppStyle.appIconColor,
    borderRadius: 10,
    width: 90,
    height:40,
    marginRight: 10,
    justifyContent: "center",
    flexDirection: "row",
  },
  shareSection: {
    flexDirection: "row",
    padding: 8,
    borderWidth: 1,
    borderColor: "#E8E6EA",
    borderRadius: 108,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -5,
  },
  inviteSection: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#777777",
    borderRadius: 10,
    width: 90,
    height:40,
    justifyContent: "center",
  },
  SectionHedText: {
    fontSize: 27,
    fontFamily: "Abel",
    color: AppStyle.fontColor,
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
  textSubheading: {
    fontSize: 18,
    fontFamily: "Abel",
    color: AppStyle.fontColor,
  },
  mainSection: {},
  eventDetailSecHed: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mainShareSection: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    borderColor: AppStyle.appIconColor,
  },
  eventDetailStat: {
    marginTop: 10,
  },
  eventCheckSec: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
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
  eventCheckSecDRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: -6,
  },
  eventCheckHead: {
    fontSize: 18,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,
    marginBottom: 5,
    lineHeight: 20,
  },
  eventCheckTDext: {
    fontSize: 14,
    fontFamily: "Abel",
    fontWeight: "400",
    color: "#777777",
    flex: 1,
    flexWrap: "wrap",
  },
  eventCheckText: {
    fontSize: 15,
    fontFamily: "Abel",
    fontWeight: "400",
    color: "#777777",
    flex: 1,
    flexWrap: "wrap",
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
    marginTop: 15,
    backgroundColor: "#E9B74112",
    padding: 10,
    borderRadius: 10,
  },
  eventDetailinnertimeSec: {
    flexDirection: "row",
    marginBottom: 10,
  },
  eventDetailOrganizerSec: {
    marginTop: 20,
    borderColor: AppStyle.appIconColor,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  eventDetailOrganizerTxt: {
    fontSize: 18,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,
    flex: 1,
    flexWrap: "wrap",
  },
  eventDetailOrganizeroctWB: {
    marginTop: 5,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  eventDetailOrganizeroct: {
    marginTop: 5,
    borderBottomWidth: 1,
    borderColor: "#E8E6EA",
    paddingBottom: 10,
    paddingLeft: 10,
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
  eventiOCns: {
    marginRight: 10,
  },
  eventlistContainer: {
    backgroundColor: "#575C8A0F",
    borderRadius: 16,
    padding: 5,
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
    width: "75%",
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
  eventNameTxt: {
    fontSize: 18,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,
    flex: 1,
    flexWrap: "wrap",
  },
  eventDateTxt: {
    fontSize: 16,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.appIconColor,
  },
  eventTypeTxt: {
    fontSize: 14,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,
  },
  eventContentTxt: {
    fontSize: 14,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,
    flex: 1,
    flexWrap: "wrap",
  },
  eventOwnerSec: {
    marginTop: 15,
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
  sameguruContSect: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  sameguruCont: {
    resizeMode: "contain",
    width: AppStyle.sameGuruImgWidth,
    height: AppStyle.sameGuruImgHeight,
  },
});
