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
import { Audio } from "expo-av";

class PlaylistItem {
  constructor(audioFile, id, isPlaying, filename) {
    this.audioFile = audioFile;
    this.id = id;
    this.isPlaying = isPlaying;
    this.filename = filename
  }
}

let PLAYLIST = [];
class SpiritualInsightsScreen extends Component {
  constructor(props) {
    super(props);
    this.index = 0;
    this.playbackInstance = null;
    this.state = {
      audioCount: 0,
      loading: false,
      postedChecked: false,
      randomChecked: false,
      ishowMOdal: false,
      modalVisible: false,
      audioRecords: [],
      errMsg: "",
      isDeleteId: "",
      takeVal: "100",
      isShowLoad: true,
      selectedGuru: [],
      stateData: [],
      cityData: [],
      durationMillis: 1,
      positionMillis: 0,
      isBuffering: false,
      isPlaying: false,
      shouldPlay: false,
      sound: null,
      loadedId: 0,
      USuperlike: "0",
      Ulike: "0",
      isStateDelete: false,
      isFitler: 1,
      SselectedItems: [],
      modalStateCityVisible:false,
      filterData: [
        {
          name: "Only Most Recently Posted",
          id: 1,
        },
        {
          name: "Only Most Liked",
          id: 2,
        },
        {
          name: "Only Most Super Liked",
          id: 3,
        },
        {
          name: "Only Most Commented",
          id: 4,
        },
        {
          name: "Only Posted From My Selected City",
          id: 5,
        },
        {
          name: "Only Posted By Me",
          id: 7,
        },
        //   {
        //   name: 'Random Play',
        //   id: 6
        // }
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
          this.setState({ userDetail: res.data.data.user_detail });
          this.setState({ userData: res.data.data.user_detail.user });
          this.setState({
            countryData: res.data.data.user_detail.country_data,
          });

          if (isType != null) {
            this.getGroupposts();
          }
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

  backScreen() {
    this._onBackPressed();
    this.props.navigation.navigate("SpiritualScreen", {
      isguruSelectedVal: "1",
    });
  }

  async _loadNewPlaybackInstance(playing) {
    if (this.playbackInstance != null) {
      await this.playbackInstance.unloadAsync();
      // this.playbackInstance.setOnPlaybackStatusUpdate(null);
      this.playbackInstance = null;
    }

    if (
      this.state.loadedId == PLAYLIST[this.index].id &&
      this.state.isPlaying
    ) {
      this.setState({ loadedId: 0 });
    } else {
      this.setState({ loadedId: PLAYLIST[this.index].id });
    }

    console.log(`${Api.apiAudioUrl}${PLAYLIST[this.index].filename}`)
    console.log(PLAYLIST[this.index])

    const source = { uri: `${Api.apiAudioUrl}${PLAYLIST[this.index].filename}` };

    const initialStatus = {
      shouldPlay: playing,
      isLooping: false,
    };
    const { sound, status } = await Audio.Sound.createAsync(
      source,
      initialStatus,
      this._onPlaybackStatusUpdate
    );
    this.playbackInstance = sound;
  }

  _onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      this.setState({
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
      });
      if (status.didJustFinish && !status.isLooping) {
        this._advanceIndex(true);
        if (this.index != -1 && this.index <= PLAYLIST.length - 1) {
          console.log("playlist kenght is inside if ", this.index);
          this._updatePlaybackInstanceForIndex(true);
        }
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _onError = (error) => {
    console.log(`ON ERROR : ${error}`);
  };

  _advanceIndex(forward) {
    if (this.index != -1 && this.index < PLAYLIST.length - 1) {
      this.index = this.index + 1;
      console.log("playlist kenght is inside else ", this.index);
    } else {
      this._onBackPressed();
      console.log("playlist kenght is inside else else", this.index);
    }
  }

  async _updatePlaybackInstanceForIndex(playing) {
    this._loadNewPlaybackInstance(playing);
  }

  _onPlayPausePressed(audioFile, aId, audioFileName) {
    let findIndex = this.state.audioRecords.findIndex(obj => obj.id === aId)
    if (PLAYLIST.length == 0) {
      this.index = 0;
      this.createAudioArray(audioFile, aId, findIndex, audioFileName);
      this._loadNewPlaybackInstance(true);
    }

    if (this.playbackInstance != null) {
      if (this.state.loadedId == aId && this.state.isPlaying) {
        this.setState({ loadedId: 0 });
        this.playbackInstance.pauseAsync();
      } else {
        this.setState({ loadedId: aId });
        this.playbackInstance.playAsync();
      }
    }
  }

  async _onBackPressed() {
    PLAYLIST = [];
    this.index = -1;
    this.setState({ loadedId: 0 });
    if (this.playbackInstance != null) {
      this.playbackInstance.stopAsync();
      await this.playbackInstance.unloadAsync();
      this.playbackInstance = null;
    }
  }

  async getAudio() {
    this._onBackPressed();

    let udata = JSON.parse(await AsyncStorage.getItem("userData"));

    this.setState({ loading: true });
    let data = JSON.stringify({
      guru_id: this.state.selectedGuru.id,
      city_id: this.state.cityData.id,
      user_id: udata.id,
      take: this.state.takeVal,
      is_private: this.state.postedChecked,
      is_random: this.state.randomChecked,
      is_filtered: this.state.isFitler,
    });

    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios
      .post(Api.apiUrl + "/get-audio", data, headers)
      .then((res) => {
        console.log("get audios---", res.data);
        console.log("get audios---", data);
        this.setState({ audioCount: res.data.user_audio_count });
        this.setState({ isStateDelete: true });
        this.setState({ audioRecords: res.data.data });
        this.setState({ takeVal: res.data.take });
        this.setState({ loading: false });
        if (res.data.data.length >= this.state.takeVal) {
          this.setState({ isShowLoad: true });
        } else {
          this.setState({ isShowLoad: false });
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

  async loadAudio(audioFile) {
    const { isPlaying } = this.state;

    try {
      const playbackInstance = new Audio.Sound();
      const source = {
        uri: audioFile,
        shouldPlay: true,
      };

      const status = {
        shouldPlay: isPlaying,
        isLooping: true,
      };

      playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
      await playbackInstance.loadAsync(source, status, false);
      this.setState({ playbackInstance });
    } catch (e) {
      console.log(e);
    }
    this.handlePlayPause();
  }

  createAudioArray(audioFile, aId, index, audioFileName) {
    PLAYLIST.push(new PlaylistItem(audioFile, aId, false, audioFileName));
    for (var i = index; i < this.state.audioRecords.length; i++) {
      if (aId != this.state.audioRecords[i].id) {
        PLAYLIST.push(
          new PlaylistItem(
            this.state.audioRecords[i].file_path,
            this.state.audioRecords[i].id,
            false,
            this.state.audioRecords[i].file_name,

          )
        );
        if(i == this.state.audioRecords.length-1){
          for (var j = 0; j < index; j++) {
            PLAYLIST.push(
              new PlaylistItem(
                this.state.audioRecords[j].file_path,
                this.state.audioRecords[j].id,
                false,
                this.state.audioRecords[i].file_name,

              )
            );
          }
        }
      }
    }
  }

  async playRandomSound(audioFile, aId) {
    const soundObject = new Audio.Sound();

    try {
      soundObject.setOnPlaybackStatusUpdate((status) => {
        if (!status.didJustFinish) return;
        this._advanceIndex(true);
        soundObject.unloadAsync();
      });
      const { isPlaying } = this.state;
      this.pouseSound();
      const source = {
        uri: audioFile,
        shouldPlay: true,
      };
      const { sound } = await Audio.Sound.createAsync(
        source,
        isPlaying,
        this.onPlaybackStatusUpdate,
        false
      );
      this.setState({ sound: sound });
      this.setState({ loadedId: aId });

      console.log("Playing Sound");

      await sound.playAsync();
    } catch (error) {
      console.log(error);
    }
  }

  async playSound(audioFile, aId) {
    const soundObject = new Audio.Sound();

    try {
      soundObject.setOnPlaybackStatusUpdate((status) => {
        if (!status.didJustFinish) return;
        soundObject.unloadAsync();
      });
      const { isPlaying } = this.state;
      this.pouseSound();
      const source = {
        uri: audioFile,
        shouldPlay: true,
      };
      const { sound } = await Audio.Sound.createAsync(
        source,
        isPlaying,
        this.onPlaybackStatusUpdate,
        false
      );
      this.setState({ sound: sound });
      this.setState({ loadedId: aId });

      console.log("Playing Sound");

      await sound.playAsync();
    } catch (error) {
      console.log(error);
    }
  }

  /* async playSound(audioFile,aId) {
    console.log('Loading Sound');
    const {isPlaying} = this.state;
    this.pouseSound();
    const source = {
        uri: audioFile
      }
    const { sound } = await Audio.Sound.createAsync(source, isPlaying, this.onPlaybackStatusUpdate, false);
    this.setState({sound:sound});
    this.setState({loadedId:aId});
    console.log('Playing Sound');
    this.setState({
      isPlaying: !isPlaying
    });
    await sound.playAsync();
  }*/

  async unloadSound() {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.unloadAsync(ClickSound);
    } catch (error) {}
  }

  async pouseSound() {
    console.log("Loading Sound");
    const { sound, isPlaying } = this.state;
    if (sound != null) {
      this.setState({ loadedId: 0 });
      if (sound != null) {
        await sound.pauseAsync();
      }
    }
  }

  async componentWillUnmount() {
    this._onBackPressed();
  }

  handlePlayPause = async () => {
    const { isPlaying, playbackInstance, positionMillis } = this.state;
    if (isPlaying) {
      await playbackInstance.pauseAsync();
    } else {
      await playbackInstance.playAsync();
    }
  };

  onPlaybackStatusUpdate = (status) => {
    const { isPlaying } = this.state;
    this.setState({
      isBuffering: status.isBuffering,
      durationMillis: status.durationMillis,
      positionMillis: status.positionMillis,
    });
    console.log(status.isPlaying);

    if (status.isPlaying == false) {
      this.setState({
        isPlaying: false,
      });
    } else {
      this.setState({
        isPlaying: true,
      });
    }
  };

  async LikePost(id, isFor) {
    if (isFor == "1") {
      this.setState({ Ulike: "1" });
    } else {
      this.setState({ Ulike: "0" });
    }

    let udata = JSON.parse(await AsyncStorage.getItem("userData"));

    this.setState({ loading: true });
    let data = JSON.stringify({
      post_id: id,
      user_id: udata.id,
      post_like: this.state.Ulike,
      isFor: "like",
      l_user_id: udata.id,
    });

    console.log(data);

    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios
      .post(Api.apiUrl + "/save-audio-likes", data, headers)
      .then((res) => {
        this.setState({ loading: false });
        this.getAudio();
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

  async SuperLikePost(id, isFor) {
    //console.log(isFor);
    if (isFor == "1") {
      this.setState({ USuperlike: "1" });
    } else {
      this.setState({ USuperlike: "0" });
    }

    let udata = JSON.parse(await AsyncStorage.getItem("userData"));

    this.setState({ loading: true });
    let data = JSON.stringify({
      post_id: id,
      user_id: udata.id,
      post_like: this.state.USuperlike,
      isFor: "superlike",
      l_user_id: udata.id,
    });

    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios
      .post(Api.apiUrl + "/save-audio-likes", data, headers)
      .then((res) => {
        this.setState({ loading: false });
        this.getAudio();
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

  handelEvent(id) {
    this.setState({ isDeleteId: id });
    this.setState({ modalVisible: true });
  }

  openEvent(val) {
    this.props.navigation.navigate("EventDetailScreen", {
      event_id: val,
    });
  }

  deleteAudio() {
    this.setState({ loading: true });
    let data = JSON.stringify({
      audio_id: this.state.isDeleteId,
    });

    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios
      .post(Api.apiUrl + "/delete-audio-post", data, headers)
      .then((res) => {
        this.setState({ modalVisible: false });
        this.setState({ loading: false });
        this.getAudio();
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
  handleCallback = (childData) => {
    this.setState({ ishowMOdal: childData });
  };
  openDeleModalVisible(id) {
    this.setState({ isDeleteId: id });
    this.pouseSound();
    this.setState({ modalVisible: true });
  }

  setModalVisible() {
    this.setState({ modalVisible: false });
  }
  addAudioData() {
    if (this.state.audioCount < 10) {
      this._onBackPressed();
      this.props.navigation.navigate("PostAudioScreen");
    } else {
      this.setState({
        errMsg:
          "You have already posted maximum limit of 10 audios, please delete an audio to post a new one",
      });
      this.setState({ ishowMOdal: true });
    }
  }

  spiritualDetail = (id, uid) => {
    this.props.navigation.navigate("SpiritualinsightsDetailScreen", {
      insight_id: id,
      user_id: uid,
    });
  };

  async getLocation() {
    let statedata = await JSON.parse(await AsyncStorage.getItem("spostState"));
    let cityata = await JSON.parse(await AsyncStorage.getItem("spostCity"));
    this.setState({ stateData: statedata });
    this.setState({ cityData: cityata });
  }

  onSSelectedItemsChange = (selectedItems, val) => {
    this.setState({ SselectedItems: selectedItems });
    this.setState({ isFitler: selectedItems.toString() });
    this.getAudio();
  };

  async componentDidMount() {
    let gData = JSON.parse(await AsyncStorage.getItem("guruData"));
    if (gData != null) {
      this.setState({ selectedGuru: gData });
    }

    let postCity = JSON.parse(await AsyncStorage.getItem("spostCity"));
    this.setState({ SselectedItems: [this.state.filterData[0].id] });

    if (postCity === null) {
      this.getUserData("1");
    } else {
      this.getUserData();
    }

    this.getLocation();
    this.getAudio();
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.getLocation();
      this.getAudio();
      this.setState({ SselectedItems: [this.state.filterData[0].id] });
      
      this.setState({ takeVal: "100" });
    });
    this.props.navigation.addListener("blur", () => {
      this.pouseSound();
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

  openLocation = async() => {
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    let statedata = await JSON.parse(await AsyncStorage.getItem("spostState"));
    console.log(statedata);
    let country_id =  parseInt(udata.country_code.split("+")[1])
    this.getStateList(country_id);
    this.getCityList(statedata.id);

    this.setState({ modalStateCityVisible: true });
  };

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
      audioCount,
      loading,
      ishowMOdal,
      errMsg,
      postedChecked,
      randomChecked,
      modalVisible,
      audioRecords,
      takeVal,
      isShowLoad,
      selectedGuru,
      stateData,
      cityData,
      userDetail,
      isStateDelete,
      filterData,
    } = this.state;

    let eventlistData = [];
    if (audioRecords?.length > 0) {
      for (var i = 0; i < audioRecords.length; i++) {
        let audioPath = audioRecords[i].file_path;
        let audioFileName = audioRecords[i].file_name;
        let audioId = audioRecords[i].id;
        let UserId = audioRecords[i].user_id;
        let LUserId = userDetail?.user_id;
        let Ulike = audioRecords[i]?.postLike;

        let USuperlike = audioRecords[i]?.postSuperLike;
        let isCandelete = false;
        if (audioRecords[i].user_id == userDetail?.user_id) {
          isCandelete = true;
        }

        let userImg = [];
        if (audioRecords[i]?.user_detail?.user_profile_image != null) {
          userImg.push(
            <View key={i} style={styles.outerImgSection}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={this.getuserDetail.bind(this, audioRecords[i].user_id)}
              >
                <Image
                  // source={{
                  //   uri: `${audioRecords[i]?.user_detail?.user_profile_image}`,
                    
                  // }}
                source={{ uri: `${Api.imgaePath}/${audioRecords[i]?.user_detail?.user_profile_image}` }}

                  style={styles.imagetopCont}
                />
              </TouchableOpacity>
            </View>
          );
        } else {
          userImg.push(
            <View key={i} style={styles.outerImgSection}>
              <Image
                source={require("../../../assets/images/uphoto.png")}
                style={styles.imagetopCont}
              />
            </View>
          );
        }

        let isSameguru = false;
        if (
          audioRecords[i]?.user_detail.guru_id == userDetail?.guru_id &&
          audioRecords[i]?.user_detail?.user_id != userDetail?.user_id &&
          userDetail?.guru_id != 0
        ) {
          isSameguru = true;
        }

        eventlistData.push(
          <View
            style={[
              i == 0
                ? styles.outerEventContainerWB
                : styles.outerEventContainer,
            ]}
            key={audioRecords[i].id}
          >
            <View style={styles.outContainer}>
              <View style={styles.leftEventContainer}>{userImg}</View>

              <View style={styles.searchdfContentsection}>
                <TouchableOpacity
                  style={styles.sameguruContSect}
                  onPress={() => {
                    if (this.playbackInstance != null) {
                      this.playbackInstance.stopAsync();
                      this.playbackInstance.unloadAsync();
                      this.playbackInstance = null;
                    }
                    this.spiritualDetail(audioId, UserId)
                  }

                  }
                >
                  <Text style={styles.titleContentText}>
                    {audioRecords[i]?.user_data?.first_name}{" "}
                    {audioRecords[i]?.user_data?.last_name},{" "}
                    <Feather
                      name={"star"}
                      size={16}
                      color={AppStyle.appIconColor}
                    />{" "}
                    {audioRecords[i]?.user_rating}
                    {isSameguru && (
                      <Text style={styles.timContentText}>, </Text>
                    )}
                    {isSameguru && (
                      <Image
                        source={require("../../../assets/images/icons/gurubhai.jpg")}
                        style={styles.sameguruCont}
                      />
                    )}
                  </Text>
                  <Text style={styles.timContentText}>
                    {audioRecords[i]?.user_detail.gender},{" "}
                    {audioRecords[i]?.user_detail.age_group},{" "}
                    {audioRecords[i].city_detail.name},{" "}
                    {audioRecords[i].state_detail?.state_abbrivation != ""
                      ? audioRecords[i].state_detail?.state_abbrivation
                      : audioRecords[i]?.state_detail.name}
                  </Text>
                  <Text style={styles.timContentText}>
                    {audioRecords[i]?.community_data?.name}
                  </Text>
                </TouchableOpacity>
                <View style={styles.audioControls}>
                  {/* {isCandelete && isStateDelete && (
                    <TouchableOpacity
                      style={styles.control}
                      onPress={() => this.openDeleModalVisible(audioId)}
                    >
                      <Feather
                        name={"trash"}
                        size={19}
                        color={
                          "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"
                        }
                      />
                      <Text style={styles.controlTxt}>/</Text>
                    </TouchableOpacity>
                  )} */}

                  {this.state.loadedId == audioId ? (
                    <TouchableOpacity
                      style={styles.control}
                      onPress={() =>
                        this._onPlayPausePressed(audioPath, audioId, audioFileName)
                      }
                    >
                      <Feather
                        name="pause-circle"
                        size={30}
                        color={AppStyle.appIconColor}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.control}
                      onPress={() =>
                        this._onPlayPausePressed(audioPath, audioId, audioFileName)
                      }
                    >
                      <Feather
                        name="play-circle"
                        size={32}
                        color={AppStyle.appIconColor}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.searchOuterContentsection}>
              <Text style={styles.searchContenttitleText}>
                {" "}
                Posted{" "}
                {audioRecords[i].post_time != "0m"
                  ? audioRecords[i].post_time + " ago"
                  : "Recently"}{" "}
                | {audioRecords[i].duration}
              </Text>
            </View>

            <View style={styles.postReviewsSec}>
              <View style={styles.postReviewsInnerSec}>
                <Text style={styles.icnlabl}>Comments</Text>
                <View style={styles.wrapperCustom}>
                  <Feather
                    name="message-square"
                    size={16}
                    color={AppStyle.appIconColor}
                  />
                </View>

                <Text style={styles.cmtCount}>
                  {audioRecords[i]?.comments_count}
                </Text>
              </View>
              <View style={styles.postReviewsInnerSec}>
                <Pressable
                  onPress={() => {
                    this.LikePost(audioId, Ulike);
                  }}
                  style={({ pressed }) => [
                    {
                      color: pressed ? "rgb(210, 230, 255)" : "white",
                    },
                    styles.wrapperCustom,
                  ]}
                >
                  <Text style={styles.icnlabl}>Likes</Text>
                  {Ulike == "1" && (
                    <FontAwesome
                      name="star"
                      size={16}
                      color={AppStyle.appIconColor}
                    />
                  )}

                  {Ulike == "0" && (
                    <FontAwesome5
                      name="star"
                      size={16}
                      color={AppStyle.appIconColor}
                    />
                  )}
                </Pressable>

                <Text style={styles.cmtCount}>
                  {audioRecords[i]?.likes_count}
                </Text>
              </View>

              <View style={styles.postReviewsInnerSec}>
                <Pressable
                  onPress={() => {
                    this.SuperLikePost(audioId, USuperlike);
                  }}
                  style={({ pressed }) => [
                    {
                      color: pressed ? "rgb(210, 230, 255)" : "white",
                    },
                    styles.wrapperCustom,
                  ]}
                >
                  <Text style={styles.icnlabl}>Super Likes </Text>
                  {USuperlike == "1" && (
                    <FontAwesome
                      name="heart"
                      size={16}
                      color={AppStyle.appIconColor}
                    />
                  )}

                  {USuperlike == "0" && (
                    <FontAwesome5
                      name="heart"
                      size={16}
                      color={AppStyle.appIconColor}
                    />
                  )}
                </Pressable>

                <Text style={styles.cmtCount}>
                  {audioRecords[i]?.super_likes_count}
                </Text>
              </View>
            </View>
          </View>
        );
      }
    } else {
      eventlistData.push(
        <View key="no_resc" style={styles.norouterEventContainder}>
          <Text style={styles.eventNameTxt}>No Audio Found !</Text>
        </View>
      );
    }

    const handleSubmitPress = async () => {
      let takeVal = this.state.takeVal + 100;
      this.setState({ takeVal: takeVal });
      this.getAudio();
    };
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

            <View style={styles.innermainlayutSection}>
              <Text style={styles.textSubheading}>
                {cityData?.name},{" "}
                {stateData?.state_abbrivation != ""
                  ? stateData?.state_abbrivation
                  : stateData?.name}
              </Text>
              <TouchableOpacity
                style={styles.addbuttonsStylve}
                activeOpacity={0.5}
                onPress={()=>this.openLocation()}
              >
                <Feather
                  name={"edit"}
                  size={18}
                  color={AppStyle.appIconColor}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.SectionHeadStyle}>
              <Text style={styles.SectionHedText}>Spiritual Insights</Text>
              <TouchableOpacity
                onPress={this.addAudioData.bind(this, i)}
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
              <View style={styles.eventCheckSec}>
                {/* <View style={styles.eventCheckSecRight}>
               
                  <Checkbox.Android
                  color={AppStyle.appIconColor} uncheckedColor={AppStyle.appIconColor}
                  status={postedChecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    this.setState({postedChecked:!postedChecked});
                     
                     this.getAudio();
                    
                  }}
                />
                <Text style={styles.textSubheading}>Show Only I Posted </Text>
               </View>
               <View style={styles.eventCheckSecRight}>
               
                  <Checkbox.Android
                  color={AppStyle.appIconColor} uncheckedColor={AppStyle.appIconColor}
                  status={randomChecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    this.setState({randomChecked:!randomChecked});
                     
                     this.getAudio();
                    
                  }}
                />
                <Text style={styles.textSubheading}>Random Play </Text>
               </View> */}

                <View style={styles.selectboxNwContainerM}>
                  <View style={styles.selectboxNwContainer}>
                    <SectionedMultiSelect
                      items={filterData}
                      IconRenderer={Icon}
                      uniqueKey="id"
                      subKey="children"
                      selectText="Only Most Recently Posted"
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
                          height: 380,
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
                </View>
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
                  Are you sure you want to delete the audio ?
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
                      styles.wrappersCustom,
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
                        this.deleteAudio();
                      }}
                      style={({ pressed }) => [
                        {
                          color: pressed ? "rgb(210, 230, 255)" : "white",
                        },
                        styles.wrappersCustom,
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
export default SpiritualInsightsScreen;

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
    alignItems:'center'
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
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: 0,
    width: "100%",
  },
  eventCheckSecLeft: {
    flexDirection: "row",
    alignItems: "center",
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
  eventCheckSecRight: {
    flexDirection: "row",
    alignItems: "center",
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
    paddingBottom: 10,
    paddingTop: 8,
    borderRadius: 10,

    borderTopWidth: 1,
    borderColor: "#E8E6EA",
  },
  outerEventContainerWB: {
    paddingBottom: 10,
    borderRadius: 10,
  },
  outContainer: {
    flexDirection: "row",
  },
  outerEventContainder: {
    flexDirection: "row",
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 15,
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
  },
  searchMainContentsection: {
    paddingBottom: 5,
  },
  searchContentsection: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  searchdfContentsection: {
    padding: 4,
    flexDirection: "row",
    width: "80%",
  },
  sameguruContSect: {
    width: "80%",
  },
  searchOuterContentsection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  titleContentText: {
    fontSize: 16,
    fontFamily: "GlorySemiBold",
    color: AppStyle.fontColor,
    lineHeight: 20,
  },
  searchContenttitleText: {
    fontSize: 12,
    fontFamily: "GlorySemiBold",
    fontWeight: "400",

    lineHeight: 22,
    color: AppStyle.fontColor,
    flexShrink: 1,
  },
  searchContentText: {
    fontSize: 13,
    color: AppStyle.fontColor,
    fontFamily: "Abel",
    textTransform: "capitalize",
    lineHeight: 24,
  },
  timContentText: {
    color: "#AAA6B9",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Abel",
  },
  ratingMainSection: {
    flexDirection: "row",
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
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
  audioControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "20%",
  },
  control: {
    flexDirection: "row",
  },
  controlTxt: {
    color: "#FF9228",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Abel",
    marginLeft: 2,
    marginRight: 2,
  },
  postReviewsSec: {
    flexDirection: "row",
    justifyContent: "space-around",

    marginTop: 5,
  },
  postReviewsInnerSec: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  wrapperCustom: {
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  wrappersCustom: {},
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

  sameguruCont: {
    width: AppStyle.sameGuruImgWidth,
    height: AppStyle.sameGuruImgHeight,
    resizeMode: "contain",
  },
  samedguruCont: {
    width: AppStyle.sameGuruImgWidth,
    height: AppStyle.sameGuruImgHeight,
    resizeMode: "contain",
    opacity: 1,
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
 urladdSaveButton: {
    color: AppStyle.fontButtonColor,
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "GlorySemiBold",
    padding: 15,
  },
  
});
