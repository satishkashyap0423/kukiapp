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
import DateTimePickerModal from "react-native-modal-datetime-picker";

class PostEventScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      publicChecked: false,
      privateChecked: true,
      errMsg: "",
      eventHeading: "",
      isDatetest: "2023-02-23",
      eventDescription: "",
      startSelectDate: "",
      endSelectDate: "",
      fromTimeSet: "",
      endTimeSet: "",
      eventDate: "",
      eventEDate: "",
      eventFTime: "",
      eventShFTime: "",
      eventShTTime: "",
      eventTTime: "",
      eventAddress: "",
      eventAddress: "",
      organizerOneName: "",
      organizerOneNumber: "",
      organizerTwoName: "",
      organizerTwoNumber: "",
      organizerThreeName: "",
      organizerThreeNumber: "",
      organizerFourName: "",
      organizerFourNumber: "",
      ishowMOdal: false,
      iShowDate: false,
      iShowEDate: false,
      iShowFromTime: false,
      iShowToTime: false,
      isOwnevent: false,
      modalVisible: false,
      currDate: new Date(),
      selectedGuru: [],
      orgDataArr: [],
      stateData: [],
      cityData: [],
      event_id: "",
      isDeleteId: "",
      statePlaceholderdata: "Your State...",
      cityPlaceholderdata: "Your City...",
      CountryitemsData: [],
      CityitemsData: [],
      StateitemsData:[],
      selectedState:[],
      selectedCity:[],
      modalStateCityVisible:false
    };
  }

  async getLocation() {
    let statedata = await JSON.parse(await AsyncStorage.getItem("spostState"));
    let cityata = await JSON.parse(await AsyncStorage.getItem("spostCity"));
    this.setState({ stateData: statedata });
    this.setState({ cityData: cityata });
  }

  handelEvent() {
    this.setState({ isDeleteId: this.state.event_id });
    this.setState({ modalVisible: true });
  }

  backScreen() {
    this.props.navigation.goBack();
  }

  handleInput(value, key) {
    //console.log(key);

    this.setState({ iShowDate: false });
    this.setState({ iShowEDate: false });
    this.setState({ [key]: value });
  }

  deleteEvent() {
    this.setState({ loading: true });
    let data = JSON.stringify({
      event_id: this.state.event_id,
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
        this.props.navigation.navigate("EventListScreen");
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

  openDatepicker(elm) {
    if (elm == 1) {
      this.setState({ iShowDate: true });
    } else {
      this.setState({ iShowEDate: true });
    }
  }

  openTimePicker(vl) {
    if (vl == 1) {
      this.setState({ iShowFromTime: true });
      this.setState({ iShowToTime: false });
    } else {
      this.setState({ iShowFromTime: false });
      this.setState({ iShowToTime: true });
    }
  }

  async getEventDetail(eventId) {
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({ loading: true });
    let data = JSON.stringify({
      user_id: udata.id,
      event_id: eventId,
    });

    //console.log(data);

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
        const logedUId = res.data.l_user_id;
        const eventUdId = res.data.data.user_id;
        if (logedUId == eventUdId) {
          this.setState({ isOwnevent: true });
        }
        this.setState({ eventHeading: res.data.data.event_heading });
        this.setState({ eventDescription: res.data.data.event_description });
        this.setState({ eventDate: res.data.data.formatted_date });
        this.setState({ eventEDate: res.data.data.formatted_end_date });
        this.setState({ eventFTime: res.data.data.start_time_use });
        this.setState({ eventTTime: res.data.data.end_time_use });
        this.setState({ eventShFTime: res.data.data.start_time });
        this.setState({ eventShTTime: res.data.data.end_time });
        this.setState({ eventAddress: res.data.data.address });
        this.setState({ orgDataArr: res.data.organizers_data });

        var stDate = new Date(res.data.data.simple_start_date);
        var sstDate = new Date(res.data.data.sstart_time);
        var etDate = new Date(res.data.data.simple_end_date);

        console.log(res.data.data.sstart_time);
        console.log(sstDate + " - " + etDate);

        this.setState({ startSelectDate: stDate });
        this.setState({ fromTimeSet: sstDate });
        this.setState({ endSelectDate: etDate });

        let orgData = res.data.organizers_data;

        if (res.data.data.is_event == "1") {
          this.setState({ privateChecked: true });
        } else {
          this.setState({ publicChecked: true });
        }
        if (orgData.length > 0) {
          for (var i = 0; i < orgData.length; i++) {
            console.log(orgData[i].name);
            if (i == 0) {
              this.setState({ organizerOneName: orgData[i].name });
              this.setState({ organizerOneNumber: orgData[i].phone_number });
            }
            if (i == 1) {
              this.setState({ organizerTwoName: orgData[i].name });
              this.setState({ organizerTwoNumber: orgData[i].phone_number });
            }
            if (i == 2) {
              this.setState({ organizerThreeName: orgData[i].name });
              this.setState({ organizerThreeNumber: orgData[i].phone_number });
            }
            if (i == 3) {
              this.setState({ organizerFourName: orgData[i].name });
              this.setState({ organizerFourNumber: orgData[i].phone_number });
            }
          }
        }

        /*this.setState({organizerOneName:res.data.data});
      this.setState({organizerOneNumber:res.data.data});
      this.setState({organizerTwoName:res.data.data});
      this.setState({organizerTwoNumber:res.data.data});
      this.setState({organizerThreeName:res.data.data});
      this.setState({organizerThreeNumber:res.data.data});
      this.setState({organizerFourName:res.data.organizers_data});
      this.setState({organizerFourNumber:res.data.organizers_data});*/
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
    }
    this.getLocation();
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.getLocation();
    });
    const event_idVal = this.props.route.params;
    //console.log(event_idVal);
    if (event_idVal != undefined) {
      const eventId = this.props.route.params.event_id;
      this.setState({ event_id: eventId });
      this.setState({ publicChecked: false });
      this.getEventDetail(eventId);
    }
  }
  handleCallback = (childData) => {
    this.setState({ ishowMOdal: childData });
  };

  getStateList = async(country_id) => {
    // console.log("country",country, country[0].id)
    this.state.loading = true;
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    console.log(udata)
    let data = JSON.stringify({
      country_id: parseInt(udata.country_code.split("+")[1])
      });
      console.log(data)
      const token = await AsyncStorage.getItem('fcmtoken');
      // console.log(token);
      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authentication': `Bearer ${token}`
        }
      }
      console.log(Api.apiUrl+'/get-states')
      axios.post(Api.apiUrl+'/get-states', data, headers)
      .then(res => {
        console.log("state", res)
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
  handleDatePicked = (dateVal) => {
    const mdate = dateVal.toString().split(" ");
    //console.log(mdate);
    this.setState({ eventDate: mdate[1] + " " + mdate[2] + ", " + mdate[3] });

    this.setState({ iShowDate: false });
    this.setState({ iShowEDate: false });
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
  render() {
    const {
      loading,
      ishowMOdal,
      errMsg,
      privateChecked,
      publicChecked,
      eventHeading,
      eventDescription,
      eventDate,
      eventEDate,
      eventFTime,
      eventTTime,
      eventAddress,
      organizerOneName,
      organizerOneNumber,
      organizerTowName,
      organizerTowNumber,
      organizerThreeName,
      organizerThreeNumber,
      organizerFourName,
      organizerFourNumber,
      iShowDate,
      iShowEDate,
      currDate,
      iShowFromTime,
      iShowToTime,
      eventShFTime,
      eventShTTime,
      selectedGuru,
      orgDataArr,
      stateData,
      cityData,
      isDatetest,
      isDate,
      modalVisible,
      isOwnevent,
    } = this.state;

    const hideDatePicker = () => {
      this.setState({ iShowDate: false });
      this.setState({ iShowEDate: false });
      this.setState({ iShowFromTime: false });
      this.setState({ iShowToTime: false });
    };

    let guruImage = `${Api.imgaePath}/${selectedGuru.image_path}`;

    const setDate = async (date) => {
      //

      this.setState({ startSelectDate: date });
      const mdate = date.toString().split(" ");
      let endSeDate = this.state.endSelectDate;
      if (endSeDate != "" && endSeDate.getTime() < date.getTime()) {
        //this.setState({errMsg:'The Event end Date must be Bigger or Equal to start date'});
        //this.setState({ishowMOdal:true});
        await this.setState({
          eventEDate: mdate[1] + " " + mdate[2] + ", " + mdate[3],
        });
        this.setState({ iShowDate: false });
      }

      this.setState({ endSelectDate: date });

      await this.setState({
        eventDate: mdate[1] + " " + mdate[2] + ", " + mdate[3],
      });
      if (eventEDate == "") {
        await this.setState({
          eventEDate: mdate[1] + " " + mdate[2] + ", " + mdate[3],
        });
      }

      this.setState({ iShowDate: false });
    };
    const setEDate = async (date) => {
      //
      const mdate = date.toString().split(" ");
      date.setHours(0, 0, 0, 0);

      let startSeDate = this.state.startSelectDate;
      startSeDate.setHours(0, 0, 0, 0);
      console.log(date + " - " + startSeDate);

      if (date.getTime() == startSeDate.getTime()) {
        this.setState({ eventTTime: "" });
        this.setState({ eventShTTime: "" });
      }
      if (date.getTime() < startSeDate.getTime()) {
        this.setState({
          errMsg: "The Event end Date must be Bigger or Equal to start date",
        });
        this.setState({ ishowMOdal: true });

        this.setState({ iShowEDate: false });
      } else {
        this.setState({ endSelectDate: date });
        await this.setState({
          eventEDate: mdate[1] + " " + mdate[2] + ", " + mdate[3],
        });
        this.setState({ iShowEDate: false });
      }
    };

    const formatAMPM = (date) => {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return strTime;
    };

    const setFromtime = (date) => {
      let endTimeSet = this.state.endTimeSet;
      if (endTimeSet != "" && endTimeSet.getTime() < date.getTime()) {
        //this.setState({errMsg:'The Event end Date must be Bigger or Equal to start date'});
        //this.setState({ishowMOdal:true});
        this.setState({ eventTTime: "" });
        this.setState({ eventShTTime: "" });
        this.setState({ iShowFromTime: false });
      }

      this.setState({ endTimeSet: date });
      const mdate = date.toString().split(" ");
      this.setState({ fromTimeSet: date });
      console.log(formatAMPM(date));
      this.setState({ iShowFromTime: false });
      this.setState({
        eventFTime: mdate[1] + " " + mdate[2] + "," + mdate[3] + " " + mdate[4],
      });
      this.setState({ eventShFTime: formatAMPM(date) });
    };

    const setTotime = (date) => {
      this.setState({ endTimeSet: date });
      let startSeTime = this.state.fromTimeSet;
      let startSeDate = this.state.startSelectDate;
      let endSeDate = this.state.endSelectDate;
      if (endSeDate.getTime() > startSeDate.getTime()) {
        const mdate = date.toString().split(" ");
        this.setState({ iShowToTime: false });
        this.setState({
          eventTTime:
            mdate[1] + " " + mdate[2] + "," + mdate[3] + " " + mdate[4],
        });
        this.setState({ eventShTTime: formatAMPM(date) });
      } else {
        date.setSeconds(0, 0);
        console.log(date + "- " + startSeTime);
        if (date.getTime() < startSeTime.getTime()) {
          this.setState({
            errMsg: "The Event end Time must be Bigger or Equal to start time",
          });
          this.setState({ ishowMOdal: true });

          this.setState({ iShowToTime: false });
          this.setState({ eventTTime: "" });
          this.setState({ eventShTTime: "" });
        } else {
          const mdate = date.toString().split(" ");
          this.setState({ iShowToTime: false });
          this.setState({
            eventTTime:
              mdate[1] + " " + mdate[2] + "," + mdate[3] + " " + mdate[4],
          });
          this.setState({ eventShTTime: formatAMPM(date) });
        }
      }
    };

    let organizerSection = [];
    let fiedlArr = {};

    fiedlArr["0"] = "One";
    fiedlArr["1"] = "Two";
    fiedlArr["2"] = "Three";
    fiedlArr["3"] = "Four";
    let dd = this.state.organizerOneName;
    let namF = "";
    let numF = "";
    for (var i = 0; i < 4; i++) {
      let vl = fiedlArr[i];
      if (orgDataArr.length > 0) {
        // namF = orgDataArr[i].name;
        numF = this.state["organizer" + fiedlArr[i] + "Number"]; //orgDataArr[i].phone_number;
      }
      //let namF = orgDataArr[i].name;
      //console.log(namF);
      organizerSection.push(
        <View key={i} style={styles.organizerContainer}>
          <View style={styles.orginputboxContainerlft}>
            {i == 3 && (
              <KeyboardAvoidingView
                style={styles.kacontainer}
                behavior="padding"
                keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 100}
              >
                <TextInput
                  style={styles.inputStyle}
                  autoCapitalize="sentences"
                  onChangeText={(nm) =>
                    this.handleInput(nm, "organizer" + vl + "Name")
                  }
                  placeholder="Name" //dummy@abc.com
                  placeholderTextColor="#ADAFBB"
                  onSubmitEditing={Keyboard.dismiss}
                  value={this.state["organizer" + fiedlArr[i] + "Name"]}
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </KeyboardAvoidingView>
            )}
            {i != 3 && (
              <TextInput
                style={styles.inputStyle}
                onChangeText={(nm) =>
                  this.handleInput(nm, "organizer" + vl + "Name")
                }
                autoCapitalize="sentences"
                placeholder="Name" //dummy@abc.com
                placeholderTextColor="#ADAFBB"
                onSubmitEditing={Keyboard.dismiss}
                value={this.state["organizer" + fiedlArr[i] + "Name"]}
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            )}
          </View>
          <View style={styles.orginputboxContainerrgt}>
            {i == 3 && (
              <KeyboardAvoidingView
                style={styles.kacontainer}
                behavior="padding"
              >
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(ph) =>
                    this.handleInput(ph, "organizer" + vl + "Number")
                  }
                  value={this.state["organizer" + fiedlArr[i] + "Number"]}
                  maxLength={10}
                  returnKeyType="done"
                  keyboardType="number-pad"
                  placeholder="Phone Number" //dummy@abc.com
                  placeholderTextColor="#ADAFBB"
                  onSubmitEditing={Keyboard.dismiss}
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </KeyboardAvoidingView>
            )}
            {i != 3 && (
              <TextInput
                style={styles.inputStyle}
                onChangeText={(ph) =>
                  this.handleInput(ph, "organizer" + vl + "Number")
                }
                value={this.state["organizer" + fiedlArr[i] + "Number"]}
                maxLength={10}
                returnKeyType="done"
                keyboardType="number-pad"
                placeholder="Phone Number" //dummy@abc.com
                placeholderTextColor="#ADAFBB"
                onSubmitEditing={Keyboard.dismiss}
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            )}
          </View>
        </View>
      );
    }

    const handleSubmitPress = async () => {
      let eventType = "";
      if (!this.state.publicChecked && !this.state.privateChecked) {
        this.setState({ errMsg: AlertMessages.isEventTypeErr });
        this.setState({ ishowMOdal: true });

        return;
      }

      if (this.state.publicChecked) {
        eventType = "Public";
      }

      if (this.state.privateChecked) {
        eventType = "Private";
      }

      if (this.state.eventHeading == "") {
        this.setState({ errMsg: AlertMessages.eventHeadingErr });
        this.setState({ ishowMOdal: true });
        return;
      }
      if (this.state.eventDescription == "") {
        this.setState({ errMsg: AlertMessages.eventDescErr });
        this.setState({ ishowMOdal: true });
        return;
      }
      if (this.state.eventDate == "") {
        this.setState({ errMsg: AlertMessages.isEventDateErr });
        this.setState({ ishowMOdal: true });
        return;
      }

      if (this.state.eventEDate == "") {
        this.setState({ errMsg: AlertMessages.isEventEndDateErr });
        this.setState({ ishowMOdal: true });
        return;
      }
      if (this.state.eventFTime == "") {
        this.setState({ errMsg: AlertMessages.eventFTimeErr });
        this.setState({ ishowMOdal: true });
        return;
      }
      if (this.state.eventTTime == "") {
        this.setState({ errMsg: AlertMessages.eventTTimeErr });
        this.setState({ ishowMOdal: true });
        return;
      }
      if (this.state.eventAddress == "") {
        this.setState({ errMsg: AlertMessages.eventAddressErr });
        this.setState({ ishowMOdal: true });
        return;
      }
      if (this.state.organizerOneName == "") {
        this.setState({ errMsg: AlertMessages.organizerOneNameErr });
        this.setState({ ishowMOdal: true });
        return;
      }
      if (this.state.organizerOneNumber == "") {
        this.setState({ errMsg: AlertMessages.organizerOneNumberErr });
        this.setState({ ishowMOdal: true });
        return;
      }
      /* if(this.state.organizerTwoName == ''){
                 this.setState({errMsg:AlertMessages.organizerTowNameErr});
                 this.setState({ishowMOdal:true});
                 return;
              }
        if(this.state.organizerTwoNumber == ''){
                 this.setState({errMsg:AlertMessages.organizerTwoNumberErr});
                 this.setState({ishowMOdal:true});
                 return;
              }
        if(this.state.organizerThreeName == ''){
                 this.setState({errMsg:AlertMessages.organizerThreeNameErr});
                 this.setState({ishowMOdal:true});
                 return;
              }
        if(this.state.organizerThreeNumber == ''){
                 this.setState({errMsg:AlertMessages.organizerThreeNumberErr});
                 this.setState({ishowMOdal:true});
                 return;
              }
        if(this.state.organizerFourName == ''){
                 this.setState({errMsg:AlertMessages.organizerFourNameErr});
                 this.setState({ishowMOdal:true});
                 return;
              }

              if(this.state.organizerFourNumber == ''){
                 this.setState({errMsg:AlertMessages.organizerFourNumberErr});
                 this.setState({ishowMOdal:true});
                 return;
              }*/

      let udata = JSON.parse(await AsyncStorage.getItem("userData"));
      let org_name = {};
      let org_phone_number = {};

      org_name[1] = this.state.organizerOneName;
      org_name[2] = this.state.organizerTwoName;
      org_name[3] = this.state.organizerThreeName;
      org_name[4] = this.state.organizerFourName;

      org_phone_number[1] = this.state.organizerOneNumber;
      org_phone_number[2] = this.state.organizerTwoNumber;
      org_phone_number[3] = this.state.organizerThreeNumber;
      org_phone_number[4] = this.state.organizerFourNumber;

      let data = JSON.stringify({
        event_id: this.state.event_id,
        is_event: eventType,
        guru_id: this.state.selectedGuru.id,
        event_heading: this.state.eventHeading,
        event_description: this.state.eventDescription,
        event_date: this.state.eventDate,
        event_e_date: this.state.eventEDate,
        event_start_time: this.state.eventFTime,
        event_end_time: this.state.eventTTime,
        address: this.state.eventAddress,
        event_country: this.state.eventHeading,
        event_state: this.state.stateData.id,
        event_city: this.state.cityData.id,
        event_country: "91",
        org_name: org_name,
        org_phone_number: org_phone_number,
        user_id: udata.id,
      });

      console.log(data);
      //return
      //this.state.loading = true;
      this.setState({ loading: true });
      const token = await AsyncStorage.getItem("fcmtoken");
      // console.log(token);
      let headers = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authentication: `Bearer ${token}`,
        },
      };
      axios
        .post(Api.apiUrl + "/save-event-records", data, headers)
        .then((res) => {
          this.setState({ loading: false });
          this.props.navigation.navigate("EventListScreen");
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
              {isOwnevent && (
                <TouchableOpacity
                  style={styles.innerSection}
                  activeOpacity={0.5}
                  onPress={this.handelEvent.bind(this)}
                >
                  <Feather
                    name={"trash"}
                    size={22}
                    color={
                      "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"
                    }
                  />
                </TouchableOpacity>
              )}
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
              <Text style={styles.SectionHedText}>Post an Event</Text>
            </View>

            <View style={styles.mainSection}>
              {/* <View style={styles.eventCheckSec}>
                <View style={styles.eventCheckSecRight}>
                  <Checkbox.Android
                    style={{ height: 10, width: 10 }}
                    color={AppStyle.appIconColor}
                    uncheckedColor={AppStyle.appIconColor}
                    status={publicChecked ? "checked" : "unchecked"}
                    onPress={() => {
                      this.setState({ publicChecked: !publicChecked });
                      this.setState({ privateChecked: false });
                    }}
                  />
                  <Text style={styles.eventCheckText}>Public</Text>
                </View>

                <View style={styles.eventCheckSecLeft}>
                  <Checkbox.Android
                    style={{ width: 10, height: 10 }}
                    color={AppStyle.appIconColor}
                    uncheckedColor={AppStyle.appIconColor}
                    status={privateChecked ? "checked" : "unchecked"}
                    onPress={() => {
                      this.setState({ privateChecked: !privateChecked });
                      this.setState({ publicChecked: false });
                    }}
                  />
                  <Text style={styles.eventCheckText}>Private</Text>
                </View>
              </View> */}
              <View style={styles.formContainer}></View>
              <View style={styles.inputboxContainer}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(eventHeading) =>
                    this.handleInput(eventHeading, "eventHeading")
                  }
                  multiline={true}
                  maxLength={100}
                  placeholder="Event heading" //dummy@abc.com
                  placeholderTextColor="#ADAFBB"
                  onSubmitEditing={Keyboard.dismiss}
                  value={this.state.eventHeading}
                  autoCapitalize="sentences"
                />
              </View>
              <View style={styles.inputboxContainer}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(eventDescription) =>
                    this.handleInput(eventDescription, "eventDescription")
                  }
                  multiline={true}
                  maxLength={500}
                  value={this.state.eventDescription}
                  placeholder="Event Description " //dummy@abc.com
                  placeholderTextColor="#ADAFBB"
                  onSubmitEditing={Keyboard.dismiss}
                  autoCapitalize="sentences"
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>

              <View style={styles.inputboxContainer}>
                <TouchableOpacity
                  style={styles.innerdateSection}
                  activeOpacity={0.5}
                  onPress={this.openDatepicker.bind(this, 1)}
                >
                  <TextInput
                    editable={false}
                    selectTextOnFocus={false}
                    style={styles.inputStyle}
                    onChangeText={(eventDate) =>
                      this.handleInput(eventDate, "eventDate")
                    }
                    value={this.state.eventDate}
                    placeholder="Event Start Date " //dummy@abc.com
                    placeholderTextColor="#ADAFBB"
                    onSubmitEditing={Keyboard.dismiss}
                    underlineColorAndroid="#f000"
                    blurOnSubmit={false}
                  />
                  <Feather
                    name={"calendar"}
                    size={22}
                    color={
                      "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"
                    }
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.inputboxContainer}>
                <TouchableOpacity
                  style={styles.innerdateSection}
                  activeOpacity={0.5}
                  onPress={this.openDatepicker.bind(this, 2)}
                >
                  <TextInput
                    editable={false}
                    selectTextOnFocus={false}
                    style={styles.inputStyle}
                    onChangeText={(eventEDate) =>
                      this.handleInput(eventEDate, "eventEDate")
                    }
                    value={this.state.eventEDate}
                    placeholder="Event End Date " //dummy@abc.com
                    placeholderTextColor="#ADAFBB"
                    onSubmitEditing={Keyboard.dismiss}
                    underlineColorAndroid="#f000"
                    blurOnSubmit={false}
                  />
                  <Feather
                    name={"calendar"}
                    size={22}
                    color={
                      "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"
                    }
                  />
                </TouchableOpacity>

                {iShowDate && (
                  <DateTimePickerModal
                    isVisible={iShowDate}
                    minimumDate={new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    onConfirm={setDate}
                    onCancel={hideDatePicker}
                  />
                )}
                {iShowEDate && (
                  <DateTimePickerModal
                    isVisible={iShowEDate}
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    minimumDate={new Date()}
                    mode="date"
                    onConfirm={setEDate}
                    onCancel={hideDatePicker}
                  />
                )}

                {iShowFromTime && (
                  <DateTimePickerModal
                    isVisible={iShowFromTime}
                    mode="time"
                    onConfirm={setFromtime}
                    onCancel={hideDatePicker}
                  />
                )}

                {iShowToTime && (
                  <DateTimePickerModal
                    isVisible={iShowToTime}
                    mode="time"
                    onConfirm={setTotime}
                    onCancel={hideDatePicker}
                  />
                )}
              </View>

              <View style={styles.timeContainer}>
                {/* <View style={styles.timeLeftContainer}>
                    <Text style={styles.timeText}>Time</Text>
                  </View> */}
                <View style={styles.timeRightContainer}>
                  <View style={styles.timeinputboxContainer}>
                    <TouchableOpacity
                      style={styles.innerdateSection}
                      activeOpacity={0.5}
                      onPress={this.openTimePicker.bind(this, 1)}
                    >
                      <TextInput
                        editable={false}
                        selectTextOnFocus={false}
                        style={styles.inputStyle}
                        value={this.state.eventShFTime}
                        placeholder="From Time" //dummy@abc.com
                        placeholderTextColor="#ADAFBB"
                        onSubmitEditing={Keyboard.dismiss}
                        underlineColorAndroid="#f000"
                        blurOnSubmit={false}
                      />
                      <Feather
                        name={"clock"}
                        size={22}
                        color={
                          "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"
                        }
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.timeinputboxContainer}>
                    <TouchableOpacity
                      style={styles.innerdateSection}
                      activeOpacity={0.5}
                      onPress={this.openTimePicker.bind(this, 2)}
                    >
                      <TextInput
                        editable={false}
                        selectTextOnFocus={false}
                        style={styles.inputStyle}
                        value={this.state.eventShTTime}
                        placeholder="To Time" //dummy@abc.com
                        placeholderTextColor="#ADAFBB"
                        onSubmitEditing={Keyboard.dismiss}
                        underlineColorAndroid="#f000"
                        blurOnSubmit={false}
                      />
                      <Feather
                        name={"clock"}
                        size={22}
                        color={
                          "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.inputboxContainer}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={(eventAddress) =>
                    this.handleInput(eventAddress, "eventAddress")
                  }
                  autoCapitalize="sentences"
                  multiline={true}
                  placeholder="Event Adress " //dummy@abc.com
                  placeholderTextColor="#ADAFBB"
                  onSubmitEditing={Keyboard.dismiss}
                  value={this.state.eventAddress}
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
                {/*} <Feather 
                    name={'map-pin'}
                    size={16} 
                    style={{marginRight:5}}
                    color={AppStyle.maplocationColor} 
                  />*/}
              </View>
              <View>
                <Text style={styles.timeText}>Organizers</Text>
              </View>

              {organizerSection}

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
                    <Text style={styles.buttonTextStyle}>Post Event</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
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
                    items={this.state.StateitemsData}
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
                    items={this.state.CityitemsData}
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
                      <Text style={styles.urladdSaveButton}>Save</Text>
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
export default PostEventScreen;

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
  },
  kacontainer: {
    flex: 1,
  },
  mainBody: {
    flex: 1,
    backgroundColor: AppStyle.appColor,
    alignContent: "center",
    paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
    paddingBottom: AppStyle.appInnerBottomPadding,
    paddingTop: AppStyle.appInnerTopPadding,
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
    marginTop: 10,
  },
  addbuttonsStylve: {
    marginLeft: 5,
    padding: 8,
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
    marginBottom: 15,
  },
  SectioninnrsubHeadStyle: {
    fontSize: AppStyle.buttonFontsize,
    fontFamily: "GlorySemiBold",
    color: AppStyle.fontColor,
  },
  mainSection: {},
  eventCheckSec: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 5,
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
    fontSize: 16,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,
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
  inputboxContainer: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 20,
    borderColor: "#E8E6EA",
    borderWidth: 1,
    borderRadius: 16,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  innerdateSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 10,
    width: "100%",
  },
  inputStyle: {
    color: AppStyle.fontColor,
    fontSize: 16,
    position: "relative",
    zIndex: 1, // works on io,
    fontFamily: "Abel",
    justifyContent: "center",
    width: "80%",
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeLeftContainer: {
    width: "15%",
  },
  timeRightContainer: {
    width: "100%",
    flexDirection: "row",
  },
  timeText: {
    fontSize: 18,
    fontFamily: "Abel",
    fontWeight: "400",
    color: AppStyle.fontColor,
  },
  timeinputboxContainer: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 10,
    borderColor: "#E8E6EA",
    borderWidth: 1,
    borderRadius: 16,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 22,
    marginRight: 10,
    width: "49%",
    alignItems: "center",
  },
  organizerContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  orginputboxContainerlft: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 20,
    borderColor: "#E8E6EA",
    borderWidth: 1,
    borderRadius: 16,
    paddingTop: 12,
    paddingBottom: 12,

    width: "42%",
    marginRight: 10,
  },
  orginputboxContainerrgt: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 20,
    borderColor: "#E8E6EA",
    borderWidth: 1,
    borderRadius: 16,
    paddingTop: 12,
    paddingBottom: 12,

    width: "58%",
  },
  btnCont: {
    paddingTop: 20,
    bottom: 10,
    left: 0,
    right: 0,
    flex: 1,
    width: "100%",
    top: 15,
  },
  buttonStyle: AppStyle.AppbuttonStyle,
  buttonTextStyle: {
    color: AppStyle.fontButtonColor,
    fontSize: AppStyle.buttonFontsize,
    fontFamily: "Abel",
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
    justifyContent: "space-between",
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
    color: AppStyle.fontColor,
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Abel",
    padding: 10,
    textAlign: "center",
    borderWidth: 1,
    borderColor: AppStyle.appIconColor,
    borderRadius: 15,
    minWidth: 125,
    marginLeft: 10,
  },
  urladdSaveButton: {
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
});
