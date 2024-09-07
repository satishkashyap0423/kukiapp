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

import AppStyle from "../../Constants/AppStyle.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation, NavigationContainer } from "@react-navigation/native";
import CookieNavigationScreen from "../Common/CookieNavigationScreen";
import Api from "../../Constants/Api.js";
import Loader from "../../Components/Loader";
import * as ImagePicker from "expo-image-picker";
import { Linking } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import AlertMessages from "../../Constants/AlertMessages.js";
import UseAlertModal from "../Common/UseAlertModal";
import { Audio } from "expo-av";

class SpiritualinsightsDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: {},
      luserDetail: {},
      userData: {},
      loading: false,
      singlepostData: [],
      postCommentData: [],
      groupData: [],
      USuperlike: "0",
      Ulike: "0",
      modalVisible: false,
      imgaeData: null,
      imgaeDataBase64: null,
      urlVal: "",
      postCommentdata: "",
      curDeletePost: "",
      Logedudata: 0,
      rating: 0,
      cityData: {},
      stateData: {},
      communityData: {},
      errMsg: "Error",
      ishowMOdal: false,
      modalDeVisible: false,
      modalDelVisible: false,
      selectedGuru: [],
      isPlaying: false,
      deleteAudioPostModal: false,
    };
    AsyncStorage.setItem("activeClass", "COactiveClass");
  }

  async savePostComment() {
    if (this.state.postCommentdata == "") {
      this.setState({ errMsg: AlertMessages.commentErr });
      this.setState({ ishowMOdal: true });

      return;
    }

    /*this.setState({errMsg:'Ongoing'});
          this.setState({ishowMOdal:true});

          return*/

    this.setState({ loading: true });
    let postCity = JSON.parse(await AsyncStorage.getItem("postCity"));
    const post_id = this.props.route.params.insight_id;
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    let formData = new FormData();
    let imgpostData = this.state.imgaeDataBase64;
    if (imgpostData !== null) {
      let localUri = imgpostData.uri;
      let filename = localUri.split("/").pop();
      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      // Assume "photo" is the name of the form field the server expects
      formData.append("photo", { uri: localUri, name: filename, type });
    }
    formData.append("user_id", udata.id);
    formData.append("comments", this.state.postCommentdata);
    formData.append("comment_url", this.state.urlVal);
    formData.append("post_id", post_id);
    const token = await AsyncStorage.getItem("fcmtoken");
    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        enctype: "multipart/form-data",
      },
    };
    axios
      .post(Api.apiUrl + "/save-audio-comment", formData, headers)
      .then((res) => {
        this.setState({ loading: false });
        this.getPostCommentsData();
        this.getPostData();
        this.setState({ imgaeData: null });
        this.setState({ postCommentdata: "" });
        this.setState({ urlVal: "" });
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

  deleteComment(id) {
    this.deleCommentRequest(id);
    /* Alert.alert(
      'Delete Comment',
      'Do you want to delete this comment ? ', // <- this part is optional, you can pass an empty string
      [
        {text: 'Cancel', onPress: () => //console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Delete', onPress: () => this.deleCommentRequest(id)},
      ],
      {cancelable: false},
    );*/
  }

  deleCommentRequest(id) {
    this.setState({ loading: true });
    let data = JSON.stringify({
      comment_id: id,
    });
    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    axios
      .post(Api.apiUrl + "/delete-audio-comment", data, headers)
      .then((res) => {
        this.setState({ loading: false });
        this.getPostCommentsData();
        this.getPostData();
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

  UrlSec() {
    this.setState({ modalVisible: true });
  }

  async openpstUrl(url) {
    this.setState({ loading: true });
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      this.setState({
        errMsg: `There is something wrong in the URL.(use URL with http)`,
      });
      this.setState({ ishowMOdal: true });
    }

    this.setState({ loading: false });
  }

  pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [10, 10],
      quality: 0.5,
      //base64: true,
    });
    if (!result.cancelled) {
      this.setState({ imgaeDataBase64: result });
      this.setState({ imgaeData: result.uri });
    }
  };

  setModalVisible() {
    this.setState({ modalVisible: false });
  }
  addUrl() {
    if (this.state.urlVal == "") {
      alert("Please add URL!");
      return;
    }
    this.setState({ modalVisible: false });
  }

  async LikePost(id, isFor) {
    if (isFor == "1") {
      this.setState({ Ulike: "0" });
    } else {
      this.setState({ Ulike: "1" });
    }

    //alert(this.state.Ulike);
    /*alert(this.state.Ulike);

    return;*/

    const post_id = this.props.route.params.insight_id;
    //const user_id  =  this.props.route.params.user_id;

    let udata = JSON.parse(await AsyncStorage.getItem("userData"));

    this.setState({ loading: true });
    let data = JSON.stringify({
      post_id: post_id,
      user_id: udata.id,
      post_like: isFor,
      isFor: "like",
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
        this.setState({ singlepostData: res.data.data });
        this.setState({ USuperlike: res.data.superlike });
        this.setState({ Ulike: res.data.like });
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
    //return;
    ////console.log(isFor);
    if (isFor == "1") {
      this.setState({ USuperlike: "1" });
    } else {
      this.setState({ USuperlike: "0" });
    }
    const post_id = this.props.route.params.insight_id;
    const user_id = this.props.route.params.user_id;

    let udata = JSON.parse(await AsyncStorage.getItem("userData"));

    this.setState({ loading: true });
    let data = JSON.stringify({
      post_id: post_id,
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
        this.setState({ singlepostData: res.data.data });
        this.setState({ USuperlike: res.data.superlike });
        this.setState({ Ulike: res.data.like });
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

  backScreen() {
    this.pouseSound();
    this.props.navigation.navigate("SpiritualInsightsScreen");
  }

  setCommentData(postComment) {
    this.setState({ postCommentdata: postComment });
  }

  getuserDetail = (i) => {
    this.props.navigation.push("CookiesDetail", {
      user_id: i,
      isReturnscreen: "CommunityBoardScreen",
      isFrom: 2,
    });
  };
  async getUserData() {
    const user_id = this.props.route.params.user_id;

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
        if (res.data.status == "true") {
          this.setState({ userDetail: res.data.data.user_detail });

          this.setState({ communityData: res.data.data.communities });
          this.setState({ rating: res.data.data.rating });
          this.setState({ userData: res.data.data.user_detail.user });
        } else {
          this.setState({ errMsg: AlertMessages.noRecordsErr });
          this.setState({ ishowMOdal: true });
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

  async getPostData() {
    const insight_id = this.props.route.params.insight_id;
    const user_id = this.props.route.params.user_id;
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({ loading: true });
    let data = JSON.stringify({
      post_id: insight_id,
      user_id: user_id,
      l_user_id: udata.id,
    });

    //console.log(data);
    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios
      .post(Api.apiUrl + "/get-audio-post", data, headers)
      .then((res) => {
        this.setState({ loading: false });
        this.setState({ singlepostData: res.data.data });
        this.setState({ groupData: res.data.data.group_data });
        this.setState({ USuperlike: res.data.superlike });
        this.setState({ Ulike: res.data.like });
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

  async getPostCommentsData() {
    const post_id = this.props.route.params.insight_id;
    const user_id = this.props.route.params.user_id;

    this.setState({ loading: true });
    let data = JSON.stringify({
      post_id: post_id,
      user_id: user_id,
    });
    let headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios
      .post(Api.apiUrl + "/get-audio-comments", data, headers)
      .then((res) => {
        this.setState({ loading: false });
        this.setState({ postCommentData: res.data.data });
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

  handleCallback = (childData) => {
    this.setState({ ishowMOdal: childData });
  };

  async getLocation() {
    let statedata = await JSON.parse(await AsyncStorage.getItem("spostState"));
    let cityata = await JSON.parse(await AsyncStorage.getItem("spostCity"));

    this.setState({ stateData: statedata });
    this.setState({ cityData: cityata });
  }

  async playSound(audioFile) {
    //console.log('Loading Sound');
    const { isPlaying } = this.state;
    console.log(`${Api.apiAudioUrl}/${audioFile}`)
    const source = {
      uri: `${Api.apiAudioUrl}/${audioFile}`,
      shouldPlay: true,
    };
    //console.log(audioFile)
    // const { sound } = await Audio.Sound.createAsync(source, isPlaying, this.onPlaybackStatusUpdate, false);

    try {
      const { sound, soundObject, status } = await Audio.Sound.createAsync(
        source,
        isPlaying,
        this.onPlaybackStatusUpdate,
        false
      );
      this.setState({ sound: sound });
      console.log("Playing Sound");
      this.setState({
        isPlaying: !isPlaying,
      });
      await sound.playAsync();
    } catch (error) {
      console.log(error);
    }
  }
  onPlaybackStatusUpdate = (status) => {
    console.log(status.isBuffering);
    if (status.didJustFinish) {
      console.log('Playback finished');
      this.setState({
        isPlaying:false
      })
      // Handle the end of playback here
    }
  };
  async pouseSound() {
    const { sound, isPlaying } = this.state;
    if (sound != null) {
      await sound.pauseAsync();
      this.setState({
        isPlaying: !isPlaying,
      });
    }
  }

  async componentDidMount() {
    let gData = JSON.parse(await AsyncStorage.getItem("guruData"));
    if (gData != null) {
      this.setState({ selectedGuru: gData });
    }

    this.getUserData();
    this.getPostData();
    this.getLocation();
    this.getPostCommentsData();
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    this.setState({ Logedudata: udata.id });

    let udetail = JSON.parse(await AsyncStorage.getItem("userDetailsData"));
    this.setState({ luserDetail: udetail });
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.getUserData();
      this.getPostData();
      this.getLocation();
      this.getPostCommentsData();

      //Put your Data loading function here instead of my this.loadData()
    });
    this.props.navigation.addListener("blur", () => {
      this.pouseSound();
    });
  }

  async componentWillUnmount() {
    this.pouseSound();
  }

  openDeleteModal(id) {
    this.pouseSound();
    this.setState({ modalDelVisible: true });
    this.setState({ curDeletePost: id });
  }
  openUnlikeModal(id) {
    this.setState({ modalDeVisible: true });
    this.setState({ curDeletePost: id });
  }

  delePostRequest() {
    let id = this.state.curDeletePost;
    this.setState({ loading: true });
    let data = JSON.stringify({
      audio_id: id,
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
        this.setState({ modalDeVisible: false });
        this.setState({ loading: false });
        this.props.navigation.goBack();
      })
      .catch((error) => {
        this.setState({ modalDeVisible: false });
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

  closeModal() {
    this.setState({ modalDeVisible: false });
    this.setState({ modalDelVisible: false });
  }

  deleteAudioPost = () => {
    this.setState({
      deleteAudioPostModal: true,
    });
  };
  deleteAudio = () => {
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
  };
  render() {
    const {
      loading,
      userDetail,
      userData,
      singlepostData,
      USuperlike,
      Ulike,
      postCommentData,
      modalVisible,
      modalDeVisible,
      modalDelVisible,
      urlVal,
      imgaeData,
      postCommentdata,
      Logedudata,
      cityData,
      stateData,
      communityData,
      rating,
      errMsg,
      ishowMOdal,
      groupData,
      luserDetail,
      selectedGuru,
    } = this.state;

    const setDescription = (val) => { };

    const setUrl = (val) => {
      this.setState({ urlVal: val });
    };

    let userImg = [];
    if (userDetail.user_profile_image != null) {
      userImg.push(
        <View key="post_user_image" style={styles.outerImgSection}>
          <Image
            source={{ uri: `${Api.imgaePath}/${userDetail.user_profile_image}` }}
            style={styles.imagetopCont}
          />
        </View>
      );
    } else {
      userImg.push(
        <View key="post_user_image" style={styles.outerImgSection}>
          <Image
            source={require("../../../assets/images/uphoto.png")}
            style={styles.imagetopCont}
          />
        </View>
      );
    }
    const postsData = [];
    let i = "test";

    postsData.push(
      <View style={styles.innerPostsSec} key="post_sec">
        {/*<Text style={styles.postTitlesection}>{singlepostData.title}</Text>*/}
        <View style={styles.postDesOuter}>
          <View style={styles.searchOuterContentsection}>
            <Text style={styles.searchContenttitleText}>
              Posted{" "}
              {singlepostData?.post_time == "0m"
                ? "recently"
                : singlepostData?.post_time + " ago"}{" "}
              | {singlepostData?.duration}
            </Text>
          </View>
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
              {singlepostData?.comments_count}
            </Text>
          </View>
          <View style={styles.postReviewsInnerSec}>
            <Pressable
              onPress={() => {
                this.LikePost(singlepostData?.id, Ulike);
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

            <Text style={styles.cmtCount}>{singlepostData?.likes_count}</Text>
          </View>

          <View style={styles.postReviewsInnerSec}>
            <Pressable
              onPress={() => {
                this.SuperLikePost(singlepostData?.id, USuperlike);
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
              {singlepostData?.super_likes_count}
            </Text>
          </View>
        </View>
      </View>
    );

    const postCommentDataDetail = [];
    if (postCommentData.length > 0) {
      for (var k = 0; k < postCommentData.length; k++) {
        let userCImg = [];
        if (postCommentData[k].user_detail.user_profile_image != null) {
          userCImg.push(
            <View
              style={styles.imagetopOuterCommentCont}
              key={k + "post_user_image"}
            >
              <Image
                source={{
                  uri: `${Api.imgaePath}/${postCommentData[k].user_detail.user_profile_image}`,
                }}
                style={styles.imagetopCommentCont}
              />
            </View>
          );
        } else {
          userCImg.push(
            <View
              style={styles.imagetopOuterCommentCont}
              key={k + "post_user_image"}
            >
              <Image
                source={require("../../../assets/images/uphoto.png")}
                style={styles.imagetopCommentCont}
              />
            </View>
          );
        }

        let postCImg = [];
        if (postCommentData[k].image_file != null) {
          postCImg.push(
            <Image
              key={k + "post_cimgl"}
              source={{ uri: `${postCommentData[k].image_file}` }}
              style={styles.imagepostContImage}
            />
          );
        }

        let pstUrl = postCommentData[k].comment_url;

        postCommentDataDetail.push(
          <View
            key={k}
            style={[k == 220 ? styles.textinvalid : styles.mainInnersectiond]}
          >
            <View style={styles.postInnerCommentsec}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={this.getuserDetail.bind(
                  this,
                  postCommentData[k].user_data.id
                )}
              >
                {userCImg}
              </TouchableOpacity>
              <View style={styles.userCmtSecBio}>
                {postCommentData.length > 0 && (
                  <View style={styles.userInnerSecBio}>
                    <Text style={styles.userheadCmtSecBio}>
                      {postCommentData[k].user_data.first_name}{" "}
                      {postCommentData[k].user_data.last_name}
                    </Text>

                    <Text style={styles.usercontCmtSecBio}>
                      <Feather
                        name={"clock"}
                        size={12}
                        color="rgba(0, 0, 0, 0.4)"
                      />{" "}
                      Posted{" "}
                      {postCommentData[k].comment_time == "0m"
                        ? "Recently "
                        : postCommentData[k].comment_time + " ago"}{" "}
                    </Text>
                  </View>
                )}

                {postCommentData[k].user_data.id == Logedudata && (
                  <TouchableOpacity
                    style={styles.userInnerSecDelBio}
                    activeOpacity={0.5}
                    onPress={this.deleteComment.bind(
                      this,
                      postCommentData[k].id
                    )}
                  >
                    <FontAwesome5
                      name={"trash"}
                      size={13}
                      color={
                        "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"
                      }
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <Text style={styles.usercontSefff}>
              {postCommentData[k].comments}
            </Text>
            {/*<Text style={styles.cmtCountLink} onPress={() => this.openpstUrl(pstUrl)}>{postCommentData[k].comment_url}</Text>
                       {postCImg} */}
          </View>
        );
      }
    } else {
      postCommentDataDetail.push(
        <Text key="no_comment" style={styles.usernoCmment}>
          {AlertMessages.commentErrMesg}
        </Text>
      );
    }

    let isSameguru = false;
    if (
      userDetail.user_id != Logedudata &&
      luserDetail.guru_id == userDetail.guru_id &&
      luserDetail.guru_id != 0
    ) {
      isSameguru = true;
    }
    let guruImage = `${Api.imgaePath}/${selectedGuru.image_path}`;
    return (
      <View style={{ flex: 1, height: "100%", backgroundColor: "#fff" }}>
        <ScrollView>
          <Loader loading={loading} />
          {ishowMOdal && (
            <UseAlertModal
              message={errMsg}
              parentCallback={this.handleCallback}
            />
          )}
          <View style={styles.mainBody}>
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
                {console.log(Logedudata, userData, singlepostData, "")}
                {singlepostData.user_id === Logedudata &&
                  <TouchableOpacity
                    style={styles.innerSection}
                    activeOpacity={0.5}
                    onPress={this.openDeleteModal.bind(this, singlepostData.id)}
                  >
                    <FontAwesome5
                      name={"trash"}
                      size={20}
                      color={
                        "linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)"
                      }
                    />
                  </TouchableOpacity>
                }
              </View>
              <View style={styles.innermainlayutSection}>
                <Text style={styles.textSubheading}>
                  {cityData.name},{" "}
                  {stateData.state_abbrivation != ""
                    ? stateData.state_abbrivation
                    : stateData.name}
                </Text>
              </View>
              <View style={styles.topheadSection}>
                <Text style={styles.SectionHeadStyle}>Insights Details</Text>
                {/*} <Text style={styles.SectionsubHeadStyle}>(Sender’s View of Sent Cookies)</Text> */}
              </View>

              <View style={styles.mainContentsection}>
                <View style={styles.innserSecBio}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={this.getuserDetail.bind(this, userData.id)}
                  >
                    {userImg}
                  </TouchableOpacity>
                  <View style={styles.searchdfContentsection}>
                    {userData.first_name != null && (
                      <View style={styles.sameguruContSect}>
                        <Text style={styles.userheadSecBio}>
                          {userData.first_name} {userData.last_name},{" "}
                          <Feather
                            name={"star"}
                            size={16}
                            color={AppStyle.appIconColor}
                          />{" "}
                          {rating}
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
                        <Text style={styles.usercontSecBio}>
                          {userDetail.gender}, {userDetail.age_group},{" "}
                          {userDetail?.city_data?.name},{" "}
                          {userDetail?.state_data?.state_abbrivation != ""
                            ? userDetail?.state_data?.state_abbrivation
                            : userDetail?.state_data?.name}
                        </Text>
                        <Text style={styles.usercontSecBio}>
                          {communityData.name}
                        </Text>
                      </View>
                    )}

                    {userData.first_name != null && (
                      <View style={styles.audioControls}>
                        {/* {userData.id == Logedudata && (
                          <TouchableOpacity
                            style={styles.control}
                            activeOpacity={0.5}
                            onPress={this.openDeleteModal.bind(
                              this,
                              singlepostData.id
                            )}
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

                        {this.state.isPlaying ? (
                          <TouchableOpacity
                            style={styles.control}
                            onPress={() => this.pouseSound()}
                          >
                            <Feather
                              name="pause-circle"
                              size={32}
                              color={AppStyle.appIconColor}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={styles.control}
                            onPress={() =>
                              this.playSound(singlepostData?.file_path)
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
                    )}
                  </View>
                </View>
                {userData.first_name != null && <View>{postsData}</View>}
                <View style={styles.postCommentsec}>
                  <View style={styles.outerCommentArea}>
                    {postCommentDataDetail}
                  </View>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 320 : 0}
                  >
                    <View style={styles.commentsentarea}>
                      <TextInput
                        style={styles.inputStyle}
                        onChangeText={(postComment) =>
                          this.setCommentData(postComment)
                        }
                        value={postCommentdata}
                        placeholder="Add a Comment"
                        placeholderTextColor="#ADAFBB"
                      />
                    </View>
                  </KeyboardAvoidingView>
                  {urlVal != "" && (
                    <View style={styles.innerFormSec}>
                      <Text style={styles.userinnercontSecBio}>Url</Text>
                      <TextInput
                        style={styles.inputUrlStyle}
                        onChangeText={(urlVal) => setUrl(urlVal)}
                        value={urlVal}
                        placeholder="Write or paste a url here...." //dummy@abc.com
                        placeholderTextColor="#ADAFBB"
                        autoCapitalize="none"
                        returnKeyType="next"
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

                  <View style={styles.cmtBtn}>
                    {/*<Pressable
                      onPress={() => {
                        this.UrlSec();
                      }}
                      style={({ pressed }) => [
                        {
                          color: pressed
                            ? 'rgb(210, 230, 255)'
                            : 'white'
                        },
                        styles.postAttachBtnsc
                      ]}><Image
                        source={require('../../../assets/images/icons/attch.png')}
                         style={[{
                         resizeMode: 'contain',
                          width:24
                         
                        },styles.imgIcon]}
                        />
                      <Text style={styles.postBtnscinText}>Url</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        this.pickImage();
                      }}
                      style={({ pressed }) => [
                        {
                          color: pressed
                            ? 'rgb(210, 230, 255)'
                            : 'white'
                        },
                        styles.postAttachBtnsc
                      ]}><Image
                        source={require('../../../assets/images/icons/attchh_img.png')}
                         style={[{
                         resizeMode: 'contain',
                          width:24
                         
                        },styles.imgIcon]}
                        />
                      <Text style={styles.postBtnscinText}>Image</Text>
                    </Pressable> */}
                    <TouchableOpacity
                      style={styles.postOuterBtnsc}
                      activeOpacity={0.8}
                      onPress={this.savePostComment.bind(this)}
                    >
                      <LinearGradient
                        // Button Linear Gradient
                        colors={[
                          AppStyle.gradientColorOne,
                          AppStyle.gradientColorTwo,
                        ]}
                        style={styles.postBtnsc}
                      >
                        <Text style={styles.postBtnSubText}>Post</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.deleteAudioPostModal}
              onRequestClose={() => {
                this.setState({
                  deleteAudioPostModal: !deleteAudioPostModal,
                });
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
                        this.setState({
                          deleteAudioPostModal: false,
                        });
                      }}
                      style={({ pressed }) => [
                        {
                          color: pressed ? "rgb(210, 230, 255)" : "white",
                        },
                      ]}
                    >
                      <Text style={styles.delteUrlButton}>Close</Text>
                    </Pressable>

                    <LinearGradient
                      // Button Linear Gradient
                      colors={[
                        AppStyle.gradientColorOne,
                        AppStyle.gradientColorTwo,
                      ]}
                      style={styles.delteUrlButton}
                    >
                      <Pressable
                        onPress={() => {
                          this.deleteAudio();
                        }}
                        style={({ pressed }) => [
                          {
                            color: pressed ? "rgb(210, 230, 255)" : "white",
                          },
                        ]}
                      >
                        <Text style={styles.urladdButtonxtTCls}>Delete</Text>
                      </Pressable>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </Modal>
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
                  returnKeyType="next"
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
                      styles.wrapperdCustom,
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
                      styles.wrapperdCustom,
                    ]}
                  >
                    <Text style={styles.urladdButton}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            <View style={styles.Mdcontainer}>
              <Modal
                animationType={"fade"}
                transparent={true}
                visible={modalDeVisible}
                onRequestClose={() => { }}
              >
                {/*All views of Modal*/}
                <View style={styles.modal}>
                  <Text style={styles.modalTitle}>
                    If you find this content objectionable you can report it to
                    Admin
                  </Text>

                  <View style={styles.Btnmodal}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        this.closeModal();
                      }}
                      style={styles.buttonOuter}
                    >
                      <View style={styles.buttonCStyle}>
                        <Text style={styles.buttonTextMStyle}>Close</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        this.unlikePostRequest();
                      }}
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
                        <Text style={styles.buttonTextMStyle}>Report</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              <Modal
                animationType={"fade"}
                transparent={true}
                visible={modalDelVisible}
                onRequestClose={() => { }}
              >
                {/*All views of Modal*/}
                <View style={styles.modal}>
                  <Text style={styles.modalTitle}>
                    Are you sure you want to delete this post ?
                  </Text>

                  <View style={styles.Btnmodal}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        this.closeModal();
                      }}
                      style={styles.buttonOuter}
                    >
                      <View style={styles.buttonCStyle}>
                        <Text style={styles.buttonTextMStyle}>Close</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        this.delePostRequest();
                      }}
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
                        <Text style={styles.buttonTextMStyle}>Delete</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              {/*Button will change state to true and view will re-render*/}
            </View>
          </View>
        </ScrollView>
        <CookieNavigationScreen navigation={this.props.navigation} />
      </View>
    );
  }
}
export default SpiritualinsightsDetailScreen;

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
  control: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  controlTxt: {
    color: "#FF9228",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Abel",
    marginLeft: 2,
    marginRight: 2,
  },
  innermainlayutSection: {
    marginTop: 10,
  },
  searchdfContentsection: {
    padding: 4,
    flexDirection: "row",
    width: "80%",
  },
  textSubheading: {
    fontFamily: "Abel",
    color: "rgba(0, 0, 0, 0.4)",
    fontSize: 16,
  },
  audioControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "20%",
  },
  backIconsCont: {
    borderWidth: 0.6,
    borderColor: AppStyle.gradientColorTwo,
    borderRadius: 15,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
  },
  SectionHeadStyle: {
    fontSize: AppStyle.aapPageHeadingSize,
    fontFamily: "Abel",
    color: AppStyle.fontColor,
  },
  topheadHeading: {
    fontSize: 22,
    paddingBottom: 15,
    color: AppStyle.fontColor,
    fontFamily: "GlorySemiBold",
  },
  mainContentsection: {
    marginTop: 10,
  },
  innserSecBio: {
    flexDirection: "row",
    alignItems: "center",
  },
  postInnerCommentsec: {
    flexDirection: "row",
    alignItems: "center",
  },
  outerCommentArea: {},
  postCommentsec: {
    height: "100%",
  },
  userInnerSecBio: {
    flexDirection: "column",
    width: "76%",
  },
  userInnerSecDelBio: {
    width: "15%",
  },
  userCmtSecBio: {
    flexDirection: "row",
    width: "100%",
  },
  userSecBio: {
    flex: 1,
  },
  userheadCmtSecBio: {
    color: AppStyle.fontColor,
    fontSize: 14,
    lineHeight: 23,
    fontFamily: "GlorySemiBold",
    marginBottom: 0,
  },
  userheadSecBio: {
    fontSize: 16,
    fontFamily: "GlorySemiBold",
    color: AppStyle.fontColor,
    lineHeight: 20,
  },
  deletCommentText: {
    color: "red",
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Abel",
  },
  usercontCmtSecBio: {
    color: "#AAA6B9",
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Abel",
  },
  usercontSecBio: {
    color: "#AAA6B9",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Abel",
  },
  usercontSefff: {
    color: AppStyle.fontColor,
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "Abel",
    lineHeight: 24,
    marginTop: 6,
  },
  usernoCmment: {
    color: AppStyle.fontColor,
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "Abel",
    lineHeight: 24,
    marginTop: 5,
    marginBottom: 10,
  },
  usercomment: {
    color: "#AAA6B9",
    fontSize: 10,
    fontWeight: "400",
    fontFamily: "Abel",
  },
  postTitlesection: {
    color: "rgba(253, 139, 48, 0.69)",
    fontSize: 17,
    lineHeight: 23,
    fontFamily: "GlorySemiBold",
    marginBottom: 5,
    textTransform: "capitalize",
  },
  postDesOuter: {
    flex: 1,
    flexDirection: "column",
  },
  searchContenttitleText: {
    fontSize: 12,
    fontFamily: "GlorySemiBold",
    fontWeight: "400",

    lineHeight: 22,
    color: AppStyle.fontColor,
  },
  searchOuterContentsection: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  postContentsection: {
    color: AppStyle.fontColor,
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "Abel",
    width: "90%",
    lineHeight: 25,
    textTransform: "capitalize",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  innerPostsSec: {
    backgroundColor: "#fff",
  },
  innerPostsSec: {
    backgroundColor: "#fff",
  },
  postReviewsSec: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 0.6,
    marginBottom: 15,
    borderColor: AppStyle.gradientColorTwo,
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
  postOuterBtnsc: {
    flexDirection: "row",

    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  postBtnsc: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  postAttachBtnsc: {
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
  postBtnscText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Abel",
    textAlign: "center",
  },
  postBtnscinText: {
    color: "#FF9228",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "GlorySemiBold",
    marginLeft: 6,
    justifyContent: "center",
  },
  postBtnSubText: {
    color: AppStyle.fontButtonColor,
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "GlorySemiBold",
    justifyContent: "center",
  },
  cmtCountLink: {
    color: "blue",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Abel",
    marginBottom: 10,
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
  cmtBtn: {
    flexDirection: "row",
    marginTop: 15,
    width: "100%",
  },
  commentsentarea: {
    flexDirection: "row",
    width: "100%",
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: "#E8E6EA",
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    width: "100%",
    paddingRight: 15,
    fontSize: AppStyle.inputFontsize,
    borderRadius: 10,
    fontFamily: "Abel",
    height: 90,
  },
  imagetopOuterCommentCont: {
    flexDirection: "row",
    width: 48,
    height: 49,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: AppStyle.appIconColor,
    padding: 3,
    marginRight: 10,
    marginBottom: 5,
    textAlign: "center",
  },
  imagetopCommentCont: {
    width: 38,
    height: 38,
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
    marginBottom: 5,
    textAlign: "center",
  },
  imagetopCont: {
    width: 54,
    height: 54,
    borderRadius: 108,
    marginTop: 0.8,
  },
  imagepostCont: {
    borderWidth: 1,
    borderColor: AppStyle.appIconColor,
    borderRadius: 10,
    padding: 3,
    marginRight: 10,
    height: 200,
    width: "100%",
    marginBottom: 0,
    resizeMode: "contain",
  },
  imagepostContImage: {
    borderWidth: 1,
    borderColor: AppStyle.appIconColor,
    borderRadius: 10,
    marginRight: 10,
    height: 150,
    width: "100%",
    marginBottom: 15,
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
  mainInnersectiond: {
    backgroundColor: AppStyle.btnbackgroundColor,
    padding: 10,
    borderRadius: 15,
    marginBottom: 8,
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
  delteUrlButton: {
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
  urladdButtonxtTCls: {
    color: AppStyle.fontColor,
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Abel",
    textAlign: "center",
  },
  wrapperdCustom: {
    borderWidth: 1,
    borderColor: "#E8E6EA",
    borderRadius: 16,
    marginLeft: 6,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  userinnercontSecBio: {
    color: "#524B6B",
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "Abel",
    marginBottom: 10,
  },
  headinnercontSecBio: {
    color: "#524B6B",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Abel",
    marginBottom: 10,
  },
  innerFormSec: {
    marginTop: 10,
  },
  imagePostCont: {
    borderWidth: 2,
    borderColor: AppStyle.appIconColor,
    borderRadius: 10,
    padding: 3,
    marginRight: 10,
    height: 150,
    width: "100%",
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
  sameguruContSect: {
    width: "80%",
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
  },
});
