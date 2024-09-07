
// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, Component } from 'react';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
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
  Button,
  KeyboardAvoidingView
} from 'react-native';

import AppStyle from '../../Constants/AppStyle.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import Api from '../../Constants/Api.js';
import CookieNavigationScreen from '../Common/CookieNavigationScreen';
import { useRoute } from '@react-navigation/native';
import Loader from '../../Components/Loader';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';
import { FontAwesome5 } from '@expo/vector-icons';
//import SeekBar  from './Seekbar.js';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';


let recording = [];

let timer = () => { };
class PostAudioScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      recordings: [],
      ishowMOdal: false,
      selectedGuru: [],
      isOwnaudio: false,
      stateData: [],
      cityData: [],
      isShowPlay: true,
      isPlaying: false,
      playbackInstance: null,
      currentIndex: 0,
      volume: 1.0,
      isBuffering: false,
      audioUri: '',
      errMsg: '',
      isPlaying: false,
      playbackObject: null,
      volume: 1.0,
      isBuffering: false,
      paused: true,
      currentIndex: 0,
      durationMillis: 1,
      positionMillis: 0,
      sliderValue: 0,
      isSeeking: false,
      isRecordingcomplete: false,
      timeLeft: 600,
      showtimeLeft: null,
      modalVisible: false,
      modaldelVisible: false,
      totalTime: 0,
      issave: true

    };
  }

  /*async startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      recording = new Audio.Recording();
      if(permission.status === 'granted'){
        this.setState({isShowPlay:false});
        this.CounterInterval();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        console.log('Starting recording..');
        await recording.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY
        );
        await recording.startAsync();
      
        console.log('Recording started');
      }else{
         this.setState({errMsg:'Please grant permission to app to access microphone'});
         this.setState({ishowMOdal:true});
      }
      
    } catch (err) {
      console.error('Failed to start recording', err);
      this.setState({errMsg:'Failed to start recording'+err});
      this.setState({ishowMOdal:true});
    }
  }*/

  handleCallback = (childData) => {
    this.setState({ ishowMOdal: childData });
  }


  async startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === 'granted') {
        recording = new Audio.Recording();

        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
          });

          await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY, RecordingOptions = {
            isMeteringEnabled: true,
            android: {
              extension: '.mp4',
              outputFormat: Audio.MPEG_4,

            },
            ios: {
              extension: '.mp4',
              outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC
            },
            web: {
              mimeType: 'audio/webm',
              bitsPerSecond: 128000,
            },
          })

          try {

            await recording.startAsync();
            console.log('Recording started')
            this.setState({ isShowPlay: false });
            this.CounterInterval();

          } catch (e) {
            console.log(e, 'e165')
            this.setState({ errMsg: 'Failed to start recording' });
            this.setState({ ishowMOdal: true });
          }

        } catch (e) {
          this.setState({ errMsg: 'Microphone not available' });
          this.setState({ ishowMOdal: true });
        }
      } else {
        this.setState({ errMsg: 'Please grant permission to app to access microphone' });
        this.setState({ ishowMOdal: true });
      }

    } catch (error) {
      console.error('check error recording', error);
      this.setState({ errMsg: 'Failed to start recording' + err.message });
      this.setState({ ishowMOdal: true });
    }
  }

  CounterInterval = () => {

    this.interval = setInterval(
      () =>
        this.getTimeleft(this.state.timeLeft - 1),
      1000
    );
  }



  async stopRecording() {

    console.log(recording._canRecord);
    //return;
    if (recording != null && recording._canRecord != null && recording._canRecord != undefined && recording._canRecord != false) {
      console.log('Stopping recording..');
      clearInterval(this.interval);
      const { durationMillis } = await recording.getStatusAsync();
      await recording.stopAndUnloadAsync();
      console.log(durationMillis);

      let durMile = this.getforDorationFormatted(durationMillis);
      this.setState({ totalTime: durMile });

      this.setState({ isShowPlay: true });
      await Audio.setAudioModeAsync(
        {
          allowsRecordingIOS: false,
        }
      );
      await recording._cleanupForUnloadedRecorder();
      this.setState({ audioUri: recording.getURI() });
      this.setState({ isRecordingcomplete: true });
      console.log(recording.getURI());

      this.loadAudio(0);
    }

  }

  backScreen() {
    this.stopAudio();
    this.stopRecording();
    this.props.navigation.navigate('SpiritualInsightsScreen');
  }

  async getLocation() {
    let statedata = await JSON.parse(await AsyncStorage.getItem('spostState'));
    let cityata = await JSON.parse(await AsyncStorage.getItem('spostCity'));
    this.setState({ stateData: statedata })
    this.setState({ cityData: cityata })
  }

  getDorationFormatted(idVal) {

    const minutes = idVal / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutesDisplay}:${secondsDisplay}`;
  }

  getforDorationFormatted(idVal) {

    const minutes = idVal / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutesDisplay + ' Min'}:${secondsDisplay + ' Sec'}`;
  }

  getTimeleft(val) {
    this.setState({
      timeLeft: val,
    }, () => {
      if (this.state.timeLeft === 0) {
        clearInterval(this.interval);
        this.stopRecording();
      }

    });

    const minutes = val / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    const fulltime = minutesDisplay;
    console.log(minutes);

    this.setState({ showtimeLeft: `${minutesDisplay}:${secondsDisplay}` });

  }



  async loadAudio(positioMil) {
    const { currentIndex, isPlaying, volume, audioUri, positionMillis } = this.state

    try {
      const playbackInstance = new Audio.Sound()
      const source = {
        uri: audioUri
      }

      const status = {
        shouldPlay: isPlaying,
        volume,
        isLooping: false,
        positionMillis: positioMil

      }

      playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
      await playbackInstance.loadAsync(source, status, false)
      this.setState({ playbackInstance })
    } catch (e) {
      console.log(e)
    }
  }

  async loadAgain(miles) {
    const { isPlaying, playbackInstance } = this.state
    playbackInstance.playFromPositionAsync(miles[0]);
    this.setState({ positionMillis: miles[0] });
  }

  async playAgain() {
    const { isPlaying, playbackInstance } = this.state
    playbackInstance.playFromPositionAsync(0);
    this.setState({ positionMillis: 0 });
    this.setState({
      isPlaying: true
    });
  }

  async stopAudio() {
    const { isPlaying, playbackInstance, positionMillis } = this.state;
    if (playbackInstance != null) {
      await playbackInstance.pauseAsync();
      playbackInstance.setPositionAsync(0);
      this.setState({ positionMillis: 0 });

    }

  }


  handlePlayPause = async (isStop = null) => {
    const { isPlaying, playbackInstance, positionMillis } = this.state;
    if (isStop != null) {
      await playbackInstance.pauseAsync();
      this.setState({
        isPlaying: false
      });
    } else {
      if (isPlaying) {
        await playbackInstance.pauseAsync()
      } else {
        await playbackInstance.playAsync()
      }
      /*this.setState({
        isPlaying: !isPlaying
      });*/
    }

  }


  onPlaybackStatusUpdate = status => {
    const { isPlaying } = this.state;
    this.setState({
      isBuffering: status.isBuffering,
      durationMillis: status.durationMillis,
      positionMillis: status.positionMillis,
    })
    if (status.isPlaying == false) {
      this.setState({
        isPlaying: false
      });
    } else {
      this.setState({
        isPlaying: true
      });
    }

  }


  openAddModal() {
    this.handlePlayPause('1');
    this.setState({ modalVisible: true });
  }

  opendeleteAudio() {
    this.handlePlayPause('1');
    this.setState({ timeLeft: 600 });
    this.setState({ showtimeLeft: null });
    this.setState({ modaldelVisible: true });

  }

  deleteAudio() {
    this.setState({ modaldelVisible: false });
    this.setState({ isRecordingcomplete: false });


  }

  setModalVisible() {
    this.setState({ modalVisible: false });
  }
  setdelModalVisible() {

    this.setState({ modaldelVisible: false });
  }

  async saveAudio() {
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    const { audioUri } = this.state;
    const uri = audioUri;
    const filetype = uri.split(".").pop();
    const filename = uri.split("/").pop();
    let formData = new FormData();
    formData.append("audio-record", {
      uri,
      type: `audio/${filetype}`,
      name: filename,
    });
    formData.append('user_id', udata.id);
    formData.append('guru_id', this.state.selectedGuru.id);
    formData.append('city_id', this.state.cityData.id);
    formData.append('duration', this.state.totalTime);
    this.setState({ loading: true });

    console.log(formData);

    if (this.state.issave) {
      this.setState({ issave: false });
      const token = await AsyncStorage.getItem('fcmtoken');
      let headers = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'enctype': 'multipart/form-data',
        }
      }
      let data = {};
      axios.post(Api.apiUrl + '/save-audio', formData, headers)
        .then(res => {

          this.setState({ loading: false });
          console.log('data is ---' + res.data.status);
          if (res.data.status === 'false') {
            this.setState({ errMsg: res.data.message });
            this.setState({ ishowMOdal: true });
          } else {
            this.props.navigation.navigate('SpiritualInsightsScreen');
          }
          this.setState({ issave: true });
        }).catch(error => {
          if (error.toJSON().message === 'Network Error') {
            this.setState({ errMsg: AlertMessages.noInternetErr });
            this.setState({ ishowMOdal: true });
            this.setState({ issave: true });
            this.setState({ loading: false });

          } else {
            this.setState({ issave: true });
            this.setState({ errMsg: error });
            this.setState({ ishowMOdal: true });
            this.setState({ loading: false });
          }
        });


    } else {
      this.setState({ errMsg: 'Audio Saving in process. Please wait' });
      this.setState({ ishowMOdal: true });
      this.setState({ loading: false });

    }


  }

  async componentDidMount() {
    const { isPlaying } = this.state;
    let gData = JSON.parse(await AsyncStorage.getItem('guruData'));
    if (gData != null) {
      this.setState({ selectedGuru: gData });
    }
    this.getLocation();
    this.props.navigation.addListener('blur', () => {
      this.stopRecording();
    })
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.setState({ timeLeft: 600 });
      this.setState({ showtimeLeft: null });
      this.setState({
        isPlaying: true
      });

    })
  }

  recordingLine = () => {

    return (
      <View style={styles.handelAudio}>
        <TouchableOpacity style={styles.control} onPress={() => this.handlePlayPause()}>
          {this.state.isPlaying ? (

            <Feather name='pause-circle' size={32} color={AppStyle.appIconColor} />
          ) : (
            <Feather name='play-circle' size={32} color={AppStyle.appIconColor} />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.control} onPress={() => this.playAgain()}>

          <Ionicons name="refresh-circle-outline" size={32} color={AppStyle.appIconColor} />

        </TouchableOpacity>
        <TouchableOpacity style={styles.control} onPress={() => this.handlePlayPause()}>

          <Feather name='stop-circle' size={32} color={AppStyle.appIconColor} />

        </TouchableOpacity>
      </View>
    )

  }

  render() {

    const { loading, recording, ishowMOdal, selectedGuru, isOwnaudio, cityData, stateData, isShowPlay, playbackInstance, currentIndex, errMsg, positionMillis, isBuffering, durationMillis, isRecordingcomplete, timeLeft, showtimeLeft, modalVisible, modaldelVisible } = this.state;
    let guruImage = `${Api.imgaePath}/${selectedGuru.image_path}`;

    return <View style={{ flex: 1, height: '100%', backgroundColor: '#fff' }}><Loader loading={loading} />{ishowMOdal && <UseAlertModal message={errMsg} parentCallback={this.handleCallback} />}<ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.topheadSection}>
        <View>
          <Image
            source={{ uri: guruImage }}
            style={{
              width: '100%',
              height: 300,
              resizeMode: 'cover'
            }}
          />
        </View>



      </View>

      <View style={[styles.mainBodyWithPadding]}>

        <View style={styles.innerHeadSection}>


          <TouchableOpacity
            style={styles.innerSection}
            activeOpacity={0.5}
            onPress={this.backScreen.bind(this)}>
            <FontAwesome5
              name={'times'}
              size={22}
              color={'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)'}
            />

          </TouchableOpacity>
          {isOwnaudio && <TouchableOpacity
            style={styles.innerSection}
            activeOpacity={0.5}
            onPress={this.handelEvent.bind(this)} >
            <Feather
              name={'trash'}
              size={22}
              color={'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)'}
            />
          </TouchableOpacity>}

        </View>

        <View style={styles.innermainlayutSection}>
          <Text style={styles.textSubheading}>
            {cityData.name}, {(stateData.state_abbrivation != '' ? stateData.state_abbrivation : stateData.name)}
          </Text>
        </View>
        <View style={styles.SectionHeadStyle}>
          <Text style={styles.SectionHedText}>Spiritual Insights</Text>
        </View>
        <View style={styles.mainSection}>
          {!isRecordingcomplete && <View style={styles.audioIcons}>
            {isShowPlay && <TouchableOpacity
              style={styles.innerSection}
              activeOpacity={0.5}
              onPress={this.startRecording.bind(this)} >
              <Feather
                name={'mic'}
                size={50}
                color={'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)'}
              />
            </TouchableOpacity>}

            {!isShowPlay && <TouchableOpacity
              style={styles.innerSection}
              activeOpacity={0.5}
              onPress={this.stopRecording.bind(this)} >
              <Feather
                name={'mic-off'}
                size={50}
                color={'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)'}
              />
            </TouchableOpacity>}

            <Text style={styles.audioText}>{showtimeLeft}</Text>


            <Text style={styles.audioText}>Spiritual Insight is a form of deep awakening or self-realization which occurs over an ongoing conscious or subconscious conversation between Guru and a follower. When you share an insight, please only share the truth as this will help fellow followers to relate and realize their own insights.
            </Text>

            <Text style={styles.audioText}>
              Note: Maximum of 10 audios per follower is allowed. Please do not use this spiritual medium to advertise a person, place, party, institution or business.</Text>

          </View>}

          {isRecordingcomplete && <View style={styles.container}>
            {this.recordingLine()}
            <View style={styles.controls}>
              <MultiSlider
                min={0}
                max={durationMillis}
                containerStyle={{ height: 30 }}
                trackStyle={{ borderRadius: 7, height: 3.5 }}
                selectedStyle={{ backgroundColor: 'rgba(253, 139, 48, 0.69)' }}
                unselectedStyle={{ backgroundColor: AppStyle.appIconColor }}
                sliderLength={this.state.sliderLengthVal}
                markerStyle={{ height: 34, width: 34, borderRadius: 15, backgroundColor: AppStyle.appIconColor, borderWidth: 0.5, borderColor: '#fff', borderWidth: 3, borderRadius: 17 }}
                pressedMarkerStyle={{ height: 25, width: 25, backgroundColor: AppStyle.appIconColor }}
                values={[positionMillis]}
                onValuesChange={values => this.loadAgain(values)}
                step={1}
              />

              <View style={styles.timerOpt}><Text style={styles.timerOptTxt}>{this.getDorationFormatted(positionMillis)} </Text><Text style={styles.timerOptTxt}>{this.getDorationFormatted(durationMillis)}</Text></View>

              <View style={styles.adoudioButton}>
                <Pressable
                  onPress={() => {
                    this.opendeleteAudio();
                  }}
                  style={({ pressed }) => [
                    {
                      color: pressed
                        ? 'rgb(210, 230, 255)'
                        : 'white'
                    },
                    styles.postAttachBtnsc
                  ]}>
                  <Text style={styles.postBtnscinText}>Delete</Text>
                </Pressable>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    this.openAddModal();
                  }}>
                  <LinearGradient
                    // Button Linear Gradient
                    colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
                    style={styles.postBtnsc}>

                    <Text style={styles.topheadHeading}>Post</Text>
                  </LinearGradient>
                </TouchableOpacity>

              </View>


            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}

              onRequestClose={() => {

                this.setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.urlSection}>
                <Text style={styles.headinnercontSecBio}>Declaration</Text>
                <Text style={styles.headinneeSecBio}>I declare the content I am posting is not intended to hurt sentiments of my fellow followers in any way.</Text>

                <View style={styles.urlbtnSection}>
                  <Pressable
                    onPress={() => {
                      this.setModalVisible();
                    }}
                    style={({ pressed }) => [
                      {
                        color: pressed
                          ? 'rgb(210, 230, 255)'
                          : 'white'
                      },
                      styles.wrappesrCustom
                    ]}>
                    <Text style={styles.urladdButton}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      this.setModalVisible();
                      this.saveAudio();
                    }}
                    style={({ pressed }) => [
                      {
                        color: pressed
                          ? 'rgb(210, 230, 255)'
                          : 'white'
                      },
                      styles.wrappesrCustom
                    ]}>
                    <Text style={styles.urladdButton}>I Declare</Text>
                  </Pressable>


                </View>
              </View>

            </Modal>


            <Modal
              animationType="slide"
              transparent={true}
              visible={modaldelVisible}

              onRequestClose={() => {

                this.setdelModalVisible(!modaldelVisible);
              }}
            >
              <View style={styles.urlSection}>
                <Text style={styles.headinnercontSecBio}>Are you sure want to delete?</Text>

                <View style={styles.urlbtnSection}>
                  <Pressable
                    onPress={() => {
                      this.deleteAudio();
                    }}
                    style={({ pressed }) => [
                      {
                        color: pressed
                          ? 'rgb(210, 230, 255)'
                          : 'white'
                      },
                      styles.wrapperCustom
                    ]}>
                    <Text style={styles.urladdButton}>Yes</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      this.setdelModalVisible();
                    }}
                    style={({ pressed }) => [
                      {
                        color: pressed
                          ? 'rgb(210, 230, 255)'
                          : 'white'
                      },
                      styles.wrapperCustom
                    ]}>
                    <Text style={styles.urladdButton}>Cancel</Text>
                  </Pressable>
                </View>
              </View>

            </Modal>


          </View>}


        </View>
      </View>


    </ScrollView>
      <CookieNavigationScreen navigation={this.props.navigation} />
    </View>

  }
};
export default PostAudioScreen;

const styles = StyleSheet.create({
  mainBodyWithPadding: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#ffffff',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: -40,
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 30
  },
  kacontainer: {
    flex: 1
  },
  mainBody: {
    flex: 1,
    backgroundColor: AppStyle.appColor,
    alignContent: 'center',
    paddingLeft: AppStyle.appLeftPadding,
    paddingRight: AppStyle.appRightPadding,
    paddingBottom: AppStyle.appInnerBottomPadding,
    paddingTop: AppStyle.appInnerTopPadding,
    backgroundColor: '#fff',
    height: '100%'
  },
  timerOpt: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  handelAudio: {
    flexDirection: 'row'
  },
  postListSection: {
    marginBottom: 10
  },
  SectionHeadStyle: {
    flexDirection: 'row',
    paddingBottom: 6,
    justifyContent: 'space-between',
    alignItems: 'center',

  }, formContainer: {
    marginTop: 20
  },
  SectionHedText: {
    fontSize: AppStyle.aapPageHeadingSize,
    fontFamily: 'Abel',
    color: AppStyle.fontColor,
  },
  textSubheading: {
    fontFamily: 'Abel',
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 16
  },
  textSubText: {
    fontSize: 16,
    fontFamily: 'Abel',
    color: AppStyle.fontColor,
  },
  innermainlayutSection: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10
  },
  addbuttonsStylve: {
    marginLeft: 5,
    padding: 8
  },
  selectboxNwContainer: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    fontFamily: 'Abel',
    borderWidth: 1,
    borderColor: '#E8E6EA',
    borderRadius: 16,
    height: 55,
    width: '100%',
    marginTop: 20
  },
  SectionLabel: {
    position: 'absolute', top: -10, left: 20, right: 0, bottom: 0,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    height: 25,
    fontFamily: 'Abel',
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 17
  },
  otterSocialSec: {
    marginTop: 20
  },
  selectionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    borderColor: '#E8E6EA',
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 15,

  },
  SectioninnrsubHeadStyle: {
    fontSize: AppStyle.buttonFontsize,
    fontFamily: 'GlorySemiBold',
    color: AppStyle.fontColor
  },
  mainSection: {

  },
  audioIcons: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginTop: 15
  },
  audioText: {
    fontSize: 15,
    fontFamily: 'GlorySemiBold',
    color: AppStyle.fontColor,
    marginTop: 10
  },

  eventCheckSec: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 5,

  },
  eventCheckSecLeft: {
    flexDirection: 'row',

    alignItems: 'center'
  },
  innerHeadSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -40,
  },
  innerfavSection: {
    backgroundColor: 'rgba(253, 139, 48, 0.69)',
    width: 99,
    height: 99,
  },
  innerSection: {
    height: 78,
    width: 78,
    backgroundColor: '#fff',
    borderColor: '#E8E6EA',
    borderWidth: 6,
    backgroundColor: '#fff',
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputboxContainer: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 20,
    borderColor: '#E8E6EA',
    borderWidth: 1,
    borderRadius: 16,
    height: 55,
    marginBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  innerdateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
    width: "100%"
  },
  inputStyle: {
    height: 55,
    color: AppStyle.fontColor,
    fontSize: 16,
    position: 'relative',
    zIndex: 1, // works on io,
    fontFamily: 'Abel',

  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  timeLeftContainer: {
    width: '15%'
  },
  timeRightContainer: {
    width: '100%',
    flexDirection: 'row'
  },
  timeText: {
    fontSize: 18,
    fontFamily: 'Abel',
    fontWeight: '400',
    color: AppStyle.fontColor,
  },
  timeinputboxContainer: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 10,
    borderColor: '#E8E6EA',
    borderWidth: 1,
    borderRadius: 16,
    height: 55,
    marginBottom: 22,
    marginRight: 10,
    width: '49%'
  },
  organizerContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  orginputboxContainerlft: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 20,
    borderColor: '#E8E6EA',
    borderWidth: 1,
    borderRadius: 16,
    height: 55,

    width: '34%',
    marginRight: 10
  },
  orginputboxContainerrgt: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 20,
    borderColor: '#E8E6EA',
    borderWidth: 1,
    borderRadius: 16,
    height: 55,

    width: '64%'
  },
  btnCont: {
    paddingTop: 20,
    bottom: 10,
    left: 0,
    right: 0,
    flex: 1,
    width: '100%',
    top: 15

  },
  buttonStyle: AppStyle.AppbuttonStyle,
  buttonTextStyle: {
    color: AppStyle.fontButtonColor,
    fontSize: AppStyle.buttonFontsize,
    fontFamily: 'Abel',

  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  albumCover: {
    width: 250,
    height: 250
  },
  controls: {
    flexDirection: 'column',

  },
  control: {
    margin: 20
  },
  modal: {
    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: AppStyle.btnbackgroundColor,
    width: '80%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#fff',
    position: 'absolute',
    top: '35%',
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 10,
    paddingRight: 20,
    alignItems: 'center'
  },
  urlSection: {

    marginLeft: '10%',
    marginRight: '10%',
    backgroundColor: AppStyle.btnbackgroundColor,
    width: '80%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#fff',
    position: 'absolute',
    top: '35%',
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 10,
    paddingRight: 20,
    alignItems: 'center'
  },
  urlbtnSection: {
    flexDirection: 'row',
    marginTop: 15
  },
  inputUrlStyle: {
    borderWidth: 1,
    borderColor: '#E8E6EA',
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    width: '100%',
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 15,
    fontSize: AppStyle.inputFontsize,
    borderRadius: 15,
    fontFamily: 'Abel'
  },
  urladdButton: {
    color: '#FF9228',
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Abel',
    padding: 15
  },
  wrappesrCustom: {
    borderWidth: 1,
    borderColor: '#E8E6EA',
    borderRadius: 16,
    marginLeft: 6,
    width: '46%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapperCustom: {
    borderWidth: 1,
    borderColor: '#E8E6EA',
    borderRadius: 16,
    marginLeft: 6,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headinnercontSecBio: {
    color: '#524B6B',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Abel',
    marginBottom: 10
  },
  headinneeSecBio: {
    color: '#524B6B',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Abel',
    marginBottom: 10
  },
  adoudioButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  postAttachBtnsc: {
    borderWidth: 1,
    borderColor: '#FF9228',
    backgroundColor: 'rgba(253, 139, 48, 0.1)',
    padding: 15,
    width: '30%',
    borderRadius: 10,
    marginRight: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  postBtnsc: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  postSaveBtnsc: {
    borderWidth: 1,
    borderColor: '#FF9228',
    padding: 10,
    width: 90,
    borderRadius: 10,
    borderRadius: 10,
    marginRight: 12,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  postBtnscinText: {
    color: AppStyle.fontColor,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Abel',
    marginLeft: 6
  },
  topheadHeading: {
    color: AppStyle.fontColor,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Abel',
    marginLeft: 6
  },
  timerOptTxt: {
    fontFamily: 'GlorySemiBold',
    color: AppStyle.fontColor,
  }

});