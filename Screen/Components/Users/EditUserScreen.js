// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, Component } from 'react';
import { Picker } from '@react-native-picker/picker';

import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  FlatList,
  SafeAreaView,
  Image,
  Keyboard,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  TouchableHighlight,
  KeyboardAvoidingView
} from 'react-native';

import AppStyle from '../../Constants/AppStyle.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MultiSelect from 'react-native-multiple-select';
import axios from 'axios';
import Loader from '../../Components/Loader';
import Api from '../../Constants/Api.js';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';


class EditUserScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedStateValue: '',
      userDetail: {},
      CountryitemsData: [],
      StateitemsData: [],
      CityitemsData: [],
      loading: false,
      modalVisible: false,
      selectedStateValue: '',
      selectedCityValue: '',
      selectedItems: [101],
      imgaeData: null,
      imgaeDataBase64: null,
      SselectedItems: [],
      CselectedItems: [],
      AselectedItems: [],
      countryPlaceholderdata: 'Your Country...',
      statePlaceholderdata: 'Your State...',
      cityPlaceholderdata: 'Your City...',
      userBio: '',
      FirstName: '',
      LastName: '',
      itemsData: [],
      selectedPGItems: [],
      selectedPGValue: [],
      errMsg: 'Error',
      ishowMOdal: false
    };

  }


  handleInput(value, key) {
    // /^(?:[A-Za-z]+|\d+)$/.test(this.state.myValue);
    this.setState({ [key]: value.replace(/[^A-Za-z]/g, '') });
  }

  getCountryList = async () => {
    this.state.loading = true;
    let data = JSON.stringify({
      category_id: 1
    });
    const token = await AsyncStorage.getItem('fcmtoken');
    // console.log(token);
    let headers = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authentication': `Bearer ${token}`
      }
    }
    axios.post(Api.apiUrl + '/get-countries', data, headers)
      .then(res => {
        this.state.loading = false;
        console.log(res.data, "countries");
        this.setState({ CountryitemsData: res.data.data });

      })
      .catch(error => {
        if (error.toJSON().message === 'Network Error') {
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

  pickImage = async () => {
    this.setState({ modalVisible: true });

    return;

  };

  backScreen() {
    this.props.navigation.goBack();
  }

  setModalVisible() {
    this.setState({ modalVisible: false });
  }

  async chooseImage() {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      //base64: true,
    });



    if (!result.canceled) {

      this.setState({ imgaeDataBase64: result });
      this.setState({ imgaeData: result.assets[0].uri });
    }
    this.setState({ modalVisible: false });
  }

  async openCamera() {
    // permissions request is necessary for launching the camera
    const rdesult = await ImagePicker.requestCameraPermissionsAsync();
    //alert(rdesult)

    if (rdesult.granted === false) {
      alert("You've refused to allow this app to access your photos!");

    } else {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        //base64: true,
      });

      console.log(result);

      if (!result.canceled) {

        this.setState({ imgaeDataBase64: result });
        this.setState({ imgaeData: result.assets[0].uri });
      }
      this.setState({ modalVisible: false });
    }

  }

  getStateList = async (country_id) => {
    console.log("country_id", country_id.toString())
    this.state.loading = true;
    let data = JSON.stringify({
      country_id: country_id
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
    axios.post(Api.apiUrl + '/get-states', data, headers)
      .then(res => {
        this.state.loading = false;
        console.log("res", res);
        this.setState({ StateitemsData: res.data.data });
      })
      .catch(error => {
        if (error.toJSON().message === 'Network Error') {
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

  async getCityList(state_id) {
    this.setState({ loading: true });

    const data = JSON.stringify({ state_id });
    const token = await AsyncStorage.getItem('fcmtoken');

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authentication: `Bearer ${token}`,
    };

    try {
      const response = await axios.post(Api.apiUrl + '/get-cities', data, { headers });
      this.setState({ CityitemsData: response.data.data, loading: false, cityPlaceholderdata: response?.data?.data[0]?.name });
    } catch (error) {
      if (error.message === 'Network Error') {
        this.setState({ errMsg: AlertMessages.noInternetErr, ishowMOdal: true });
      } else {
        this.setState({ errMsg: error.message, ishowMOdal: true });
      }
      this.setState({ loading: false });
    }
  }

  setSelectedValue(itmVal, type) {
    if (type == 'FirstName') {

      this.setState({ FirstName: itmVal });

    } else if (type == 'LastName') {

      this.setState({ LastName: itmVal });

    } else if (type == 'gender') {
      this.setState({ selectedGenderValue: itmVal });
    } if (type == 'age') {
      this.setState({ selectedAgeValue: itmVal });
    } else if (type == 'religion') {
      this.setState({ selectedReligionValue: itmVal });
    } else if (type == 'State') {
      this.setState({ selectedStateValue: itmVal });
    } else if (type == 'city') {
      this.setState({ selectedCityValue: itmVal });
    }
  }

  onSelectedItemsChange = (selectedItems) => {
    //this.setState({ selectedItems });
    console.log("selectedItems", selectedItems)
    this.getPrfessionalList();
    this.getStateList(selectedItems[0]);

  };
  onSelectedPGItemsChange = (selectedItems) => {

    this.setState({ selectedPGValue: selectedItems });

  };
  onSSelectedItemsChange = (selectedItems) => {
    this.setState({ SselectedItems: selectedItems });
    this.getCityList(selectedItems);
  };
  onCSelectedItemsChange = (selectedItems) => {
    console.log(selectedItems, "selectedItems")
    this.setState({ CselectedItems: selectedItems });
  };
  onASelectedItemsChange = (selectedItems) => {
    this.setState({ AselectedItems: selectedItems });
  };

  async getUserData() {
    let udata = JSON.parse(await AsyncStorage.getItem('userData'));
    this.setState({ loading: true });
    let data = JSON.stringify({
      user_id: udata.id
    });
    let headers = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    axios.post(Api.apiUrl + '/get-user-detail', data, headers)
      .then(res => {
        this.setState({ loading: false });
        if (res.data.status == 'true') {
          console.log(res.data.data.user_detail, res.data.data.user_detail.city)
          this.setState({ userDetail: res.data.data.user_detail });
          this.onSelectedItemsChange([parseInt(res.data.data.user_detail.user.country_code.split("+")[1])]);
          this.onSSelectedItemsChange([parseInt(res.data.data.user_detail.state)]);
          this.onCSelectedItemsChange([parseInt(res.data.data.user_detail.city)]);
          this.onSelectedPGItemsChange([parseInt(res.data.data.user_detail.communities_id)]);
          this.onASelectedItemsChange([res.data.data.user_detail.age_group]);
          this.setState({ 'FirstName': res.data.data.user_detail.user.first_name });
          this.setState({ 'LastName': res.data.data.user_detail.user.last_name });
          this.setState({ 'countryPlaceholderdata': res.data.data.user_detail.country_data.name });
          this.setState({ 'statePlaceholderdata': res.data.data.user_detail.state_data.name });
          this.setState({ 'cityPlaceholderdata': res.data.data.user_detail.city_data.name });
          this.setState({ 'userBio': res.data.data.user_detail.user_status });
          this.setState({ imgaeData: `${Api.imgaePath}/${res.data.data.user_detail.user_profile_image}` });
        } else {
          console.log(error); this.state.loading = false;
        }
      }).catch(error => {
        if (error.toJSON().message === 'Network Error') {
          this.setState({ errMsg: AlertMessages.noInternetErr });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        } else {
          this.setState({ errMsg: error.toJSON().message });
          this.setState({ ishowMOdal: true });
          this.setState({ loading: false });
        }
        this.setState({ loading: false });
      });
  }
  setUserbio(val) {
    this.setState({ userBio: val });
  }

  getPrfessionalList = async () => {
    let data = JSON.stringify({
      category_id: 1
    });
    const token = await AsyncStorage.getItem('fcmtoken');
    // console.log(token);
    let headers = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authentication': `Bearer ${token}`
      }
    }
    axios.post(Api.apiUrl + '/get-community', data, headers)
      .then(res => {
        // console.log(res.data);
        this.setState({ itemsData: res.data.data });
      })
      .catch(error => {
        if (error.toJSON().message === 'Network Error') {
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

  componentDidMount() {
    this.getUserData();
    this.getCountryList();
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }

  handleCallback = (childData) => {
    this.setState({ ishowMOdal: childData });
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  keyboardDidHide = () => {
    Keyboard.dismiss();
  };

  render() {
    const { selectedStateValue, selectedCityValue, userDetail, loading, CountryitemsData, StateitemsData, CityitemsData, countryPlaceholderdata, statePlaceholderdata, cityPlaceholderdata, imgaeData, userBio, imgaeDataBase64, selectedPGItems, itemsData, modalVisible, errMsg, ishowMOdal } = this.state;


    const Agegroupitems = [
      {
        name: '18-25',
        id: '18-25'
      },
      {
        name: '25-30',
        id: '25-30'
      },
      {
        name: '30-35',
        id: '30-35'
      },
      {
        name: '35-40',
        id: '35-40'
      },
      {
        name: '40-45',
        id: '40-45'
      },
      {
        name: '45-50',
        id: '45-50'
      },
      {
        name: '50-55',
        id: '50-55'
      },
      {
        name: '55-60',
        id: '55-60'
      },
      {
        name: '60 & above',
        id: '60 & above'
      }
    ];
    const handleSubmitPress = async () => {
      let udata = JSON.parse(await AsyncStorage.getItem('userData'));
      this.setState({ loading: true });
      let data = JSON.stringify({
        user_id: udata.id,
        user_status: userBio,
        country: this.state.selectedItems.toString(),
        state: this.state.SselectedItems.toString(),
        city: this.state.CselectedItems.toString(),
      });
      let formData = new FormData();
      if (imgaeDataBase64 !== null) {
        let localUri = imgaeDataBase64.assets[0].uri;
        let filename = localUri.split('/').pop();
        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        // Assume "photo" is the name of the form field the server expects
        formData.append('photo', { uri: localUri, name: filename, type });
      }
      formData.append('user_id', udata.id);
      formData.append('first_name', this.state.FirstName);
      formData.append('last_name', this.state.LastName);
      formData.append('user_id', udata.id);
      formData.append('user_status', userBio);
      formData.append('age_group', this.state.AselectedItems.toString());
      //formData.append('communities_id', this.state.selectedPGValue.toString());
      formData.append('state', this.state.SselectedItems.toString());
      formData.append('city', this.state.CselectedItems.toString());


      //console.log(formData);
      let headers = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'enctype': 'multipart/form-data',
        }
      }
      axios.post(Api.apiUrl + '/update-profile', formData, headers)
        .then(res => {
          this.setState({ loading: false });
          if (res.data.status == 'true') {
            AsyncStorage.setItem('userDetailsData', JSON.stringify(res.data.user_details));
            AsyncStorage.setItem('userData', JSON.stringify(res.data.user));
            this.props.navigation.push('EditUserDetailScreen');
          } else {
            this.setState({ errMsg: AlertMessages.noRecordsErr });
            this.setState({ ishowMOdal: true });
          }
        }).catch(error => {
          if (error.toJSON().message === 'Network Error') {
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
    return <ScrollView><View style={styles.mainBody}>
      <Loader loading={this.state.loading} />
      {ishowMOdal && <UseAlertModal message={errMsg} parentCallback={this.handleCallback} />}
      <View style={styles.topheadSection}>
        <TouchableOpacity onPress={() =>
          this.backScreen()} activeOpacity={0.7}>

          <LinearGradient
            // Button Linear Gradient
            colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
            style={styles.backIconsCont}>

            <FontAwesome
              name={'angle-left'}
              size={24}
              color={AppStyle.fontColor}


            />
          </LinearGradient>

        </TouchableOpacity>
        <Text style={styles.SectionHeadStyle}>Edit / Update Profile</Text>

      </View>


      {/* <View style={styles.statSection}>
            <TextInput
                style={styles.inputStyle}
                onChangeText={(text) =>
                  this.setUserbio(text)
                }
                placeholder="Status" //dummy@abc.com
                placeholderTextColor="#000"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                value={userBio}
              />
              <View style={styles.btnCont}>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  activeOpacity={0.8}
                  onPress={handleSubmitPress}>
                  <Text style={styles.buttonTextStyle}>Update</Text>
                </TouchableOpacity>
              </View>
            </View> */}
      <View style={styles.innerseSection}>



        <View style={styles.conttentRight}>
          <TouchableOpacity onPress={() =>
            this.pickImage()} style={styles.outerImgSection}>

            {imgaeData != null && <Image source={{ uri: imgaeData }} style={styles.imagetopCont} />}
            {imgaeData == null && <Image

              source={require('../../../assets/images/uphoto.png')}
              style={styles.imagetopCont}
            />}
            <View style={styles.outerCameraSec}><FontAwesome5 name="camera" size={28} color={AppStyle.appIconColor} /></View>
          </TouchableOpacity>
          <Text style={styles.ContnetSection}>Take a Picture or upload From File</Text>

        </View>
      </View>
      <View style={styles.inputboxContainer}>
        <TextInput
          style={styles.inputinnerStyle}
          onChangeText={(FirstName) =>
            this.handleInput(FirstName, 'FirstName')
          }
          value={this.state.FirstName}
          placeholder="Enter Your First Name"
          placeholderTextColor={AppStyle.fontColor}
          autoCapitalize="none"
        />
        <Text style={[styles.SectionLabel, { width: 93 }]}>First Name</Text>
      </View>
      <View style={styles.inputboxContainer}>
        <TextInput
          style={styles.inputinnerStyle}
          onChangeText={(LastName) =>
            this.handleInput(LastName, 'LastName')
          }
          value={this.state.LastName}
          placeholder="Enter Your Last Name"
          placeholderTextColor={AppStyle.fontColor}
          autoCapitalize="none"
          returnKeyType="next"
        />
        <Text style={[styles.SectionLabel, { width: 91 }]}>Last Name</Text>
      </View>
      <View style={styles.selectboxNwContainer}>
        <SectionedMultiSelect
          items={Agegroupitems}
          IconRenderer={Icon}
          uniqueKey="id"
          subKey="children"
          selectText="Select Your Age Group..."
          showDropDowns={true}
          single={true}
          onSelectedItemsChange={this.onASelectedItemsChange}
          selectedItems={this.state.AselectedItems}
          subItemFontFamily={{ fontFamily: 'Abel' }}
          itemFontFamily={{ fontFamily: 'Abel' }}
          selectTextFontFamily={{ fontFamily: 'Abel' }}
          searchTextFontFamily={{ fontFamily: 'Abel' }}
          confirmFontFamily={{ fontFamily: 'Abel' }}
          colors={{ primary: 'background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)' }}
          hideConfirm={true}
          modalAnimationType={'fade'}
          hideSearch={true}
          showCancelButton={true}
          styles={{

            cancelButton: {
              backgroundColor: 'rgba(253, 139, 48, 0.69)',
              width: '100%',
              minWidth: '100%'

            },
            selectToggleText: {
              fontFamily: 'Abel',
              fontSize: 15,
              color: AppStyle.fontColor,
            },
            itemText: {
              fontSize: 16,
              marginLeft: 15
            },
            item: {
              marginTop: 10,
              textAlign: 'center',
              marginBottom: 10,
            },
            selectToggle: {
              marginTop: 15
            },
            container: {
              flex: 0,
              top: '10%',
              width: 'auto',
              height: 415,
              paddingTop: 10,
              overflow: 'scroll',
            }
          }}
        />
        <Text style={[styles.SectionLabel, { width: 85 }]}>Age Group</Text>
      </View>
      {/* <View style={styles.selectboxNwContainer}>

               <SectionedMultiSelect
            items={itemsData}
            IconRenderer={Icon}
            uniqueKey="id"
            subKey="children"
            selectText="Select Your Group..."
            showDropDowns={true}
            single={true}
            onSelectedItemsChange={this.onSelectedPGItemsChange}
            selectedItems={this.state.selectedPGValue}
            subItemFontFamily={{fontFamily:'Abel'}}
            itemFontFamily={{fontFamily:'Abel'}}
            searchTextFontFamily={{fontFamily:'Abel'}}
            confirmFontFamily={{fontFamily:'Abel'}}
            searchPlaceholderText='Search Professional Group'
            colors={{primary:'background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)'}}
            hideConfirm={true}
            showCancelButton={true}
             styles={{
                
                cancelButton:{
                  backgroundColor:'rgba(253, 139, 48, 0.69)',
                  width:'100%',
                  minWidth:'100%'

                } ,
                selectToggleText: {
                 fontFamily:'Abel',
                 fontSize:15,
                 color:AppStyle.fontColor,
                 },
                 itemText: {
                 fontSize:16,
                 marginLeft:15
                 },
                item: {
                 marginTop:10,
                 textAlign:'center',
                 marginBottom:10,
                },
                selectToggle:{
                  marginTop:15
                },
                container:{
                  flex:0,
                  top:'10%',
                  width:'auto',
                  height:415,
                  paddingTop:10,
                  overflow:'scroll',
                } 
              }}
            
          />
          <Text style={styles.SectionELlLabel}>Professional Group</Text>
            </View> */}
      <View style={styles.selectboxNwContainer}>
        <SectionedMultiSelect
          items={StateitemsData}
          IconRenderer={Icon}
          uniqueKey="id"
          subKey="children"
          selectText={statePlaceholderdata}
          showDropDowns={true}
          single={true}
          onSelectedItemsChange={this.onSSelectedItemsChange}
          selectedItems={this.state.SselectedItems}
          subItemFontFamily={{ fontFamily: 'Abel' }}
          itemFontFamily={{ fontFamily: 'Abel' }}
          searchTextFontFamily={{ fontFamily: 'Abel' }}
          confirmFontFamily={{ fontFamily: 'Abel' }}
          searchPlaceholderText='Search State'
          colors={{ primary: 'background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)' }}
          showCancelButton={true}
          hideConfirm={true}
          styles={{

            cancelButton: {
              backgroundColor: 'rgba(253, 139, 48, 0.69)',
              width: '100%',
              minWidth: '100%'

            },
            selectToggleText: {
              fontFamily: 'Abel',
              fontSize: 15,
              color: AppStyle.fontColor,
            },
            itemText: {
              fontSize: 16,
              marginLeft: 15
            },
            item: {
              marginTop: 10,
              textAlign: 'center',
              marginBottom: 10,
            },
            selectToggle: {
              marginTop: 15
            },
            container: {
              flex: 0,
              top: '10%',
              width: 'auto',
              height: 415,
              paddingTop: 10,
              overflow: 'scroll',
            }
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
          selectText={cityPlaceholderdata}
          showDropDowns={true}
          single={true}
          onSelectedItemsChange={this.onCSelectedItemsChange}
          selectedItems={this.state.CselectedItems}
          subItemFontFamily={{ fontFamily: 'Abel' }}
          itemFontFamily={{ fontFamily: 'Abel' }}
          searchTextFontFamily={{ fontFamily: 'Abel' }}
          confirmFontFamily={{ fontFamily: 'Abel' }}
          searchPlaceholderText='Search City'
          colors={{ primary: 'background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)' }}
          hideConfirm={true}
          showCancelButton={true}
          styles={{

            cancelButton: {
              backgroundColor: 'rgba(253, 139, 48, 0.69)',
              width: '100%',
              minWidth: '100%'

            },
            selectToggleText: {
              fontFamily: 'Abel',
              fontSize: 15,
              color: AppStyle.fontColor,
            },
            itemText: {
              fontSize: 16,
              marginLeft: 15
            },
            item: {
              marginTop: 10,
              textAlign: 'center',
              marginBottom: 10,
            },
            selectToggle: {
              marginTop: 15
            },
            container: {
              flex: 0,
              top: '10%',
              width: 'auto',
              height: 415,
              paddingTop: 10,
              overflow: 'scroll',
            }
          }}

        />
        <Text style={[styles.SectionLabel, { width: 47 }]}>City</Text>


      </View>
      <View style={styles.bottomContentSection}>

        <View style={styles.btnCont}>
          <TouchableOpacity

            activeOpacity={0.8}
            onPress={handleSubmitPress}>
            <LinearGradient
              // Button Linear Gradient
              colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
              style={styles.buttonStyle}>

              <Text style={styles.buttonTextStyle}>Update</Text>
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
          <Text style={styles.topheadSectionImg}>Take a Picture or upload From File</Text>

          <View style={styles.urlbtnSection}>
            <Pressable
              onPress={() => {
                this.openCamera();
              }}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? 'rgb(210, 230, 255)'
                    : 'white'
                },
                styles.outerChoosesection
              ]}>
              <FontAwesome5 name="camera" size={22} color={AppStyle.appIconColor} />
              <Text style={styles.urladdButton}>Camera</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                this.chooseImage();
              }}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? 'rgb(210, 230, 255)'
                    : 'white'
                },
                styles.outerChoosesection
              ]}>
              <FontAwesome5 name="wallet" size={22} color={AppStyle.appIconColor} />
              <Text style={styles.urladdButton}> Choose</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                this.setModalVisible();
              }}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? 'rgb(210, 230, 255)'
                    : 'white'
                },
                styles.outerChoosesection
              ]}>
              <FontAwesome5 name="times" size={22} color={AppStyle.appIconColor} />
              <Text style={styles.urladdButton}>Close</Text>
            </Pressable>
          </View>
        </View>

      </Modal>
    </View></ScrollView>
  }
};
export default EditUserScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: AppStyle.appColor,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 35,
    paddingTop: 35,
  },
  topheadSection: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 25
  },
  backIconsCont: {
    borderWidth: 1,
    borderColor: '#E8E6EA',
    borderRadius: 15,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20
  },
  SectionHeadStyle: {
    fontSize: AppStyle.aapPageHeadingSize,
    fontFamily: 'GlorySemiBold',
    fontWeight: '400',
    color: AppStyle.fontColor,
    marginLeft: 20
  },
  topheadSectionImg: {
    fontSize: 20,
    color: AppStyle.fontColor,
    lineHeight: 30,
    textAlign: 'center',
    fontFamily: 'Abel',
    marginBottom: 20
  },
  innerseSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 30
  },
  ContnetSection: {
    fontSize: 16,
    color: AppStyle.fontColor,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'Abel'
  },
  imagetopCont: {
    borderWidth: 2,
    borderColor: AppStyle.appIconColor,
    borderRadius: 100,
    padding: 3
  },
  conttentRight: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  SectionSmallLabel: {
    position: 'absolute', top: -10, left: 20, right: 0, bottom: 0,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    width: 70,
    height: 25,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.4)',
    fontFamily: 'Abel'
  },

  outerImgSection: {

    flexDirection: 'row',
    width: 105,
    height: 105,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: '#b1b1b1',
    padding: 3,
    marginRight: 10,
    textAlign: 'center',

  },
  imagetopCont: {
    width: 94,
    height: 94,
    borderRadius: 108,
    marginTop: 0.8,
  },
  buttonSection: {
    textAlign: 'center',

    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 15,
    paddingRight: 15,
    width: 96,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 10,
    marginTop: 10,
    color: '#fff',
    fontFamily: 'Abel',
    fontSize: 16
  },
  buttonSectionText: {
    textAlign: 'center',

    color: AppStyle.fontButtonColor,
    fontFamily: 'GlorySemiBold',
    fontSize: 16
  },
  mainContentSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 25,
    paddingLeft: 10,
    paddingRight: 10,
  },
  contentLeft: {
    fontSize: 16,
    fontFamily: 'Abel',
  },
  contentRight: {
    fontSize: 14,
    color: 'rgba(253, 139, 48, 0.69)',
    fontFamily: 'Abel',
  },
  galleryContentSection: {
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10
  },
  galleryTopgallrysec: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gallerybottomgallrysec: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  bottomContentSection: {
    marginTop: 8

  },
  inputStyle: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#E8E6EA',
    width: '100%',
    borderRadius: 15,
    fontFamily: 'Abel',
    color: AppStyle.fontColor
  },
  inputinnerStyle: {
    paddingTop: 15,
    color: AppStyle.fontColor,
    width: '100%',
    borderRadius: 15,
    fontFamily: 'Abel'
  },
  Label: {
    position: 'absolute',
    fontSize: 12,
    left: 30,
    top: -7,
    paddingRight: 5,
    paddingLeft: 5,
    fontFamily: 'Abel',
    backgroundColor: '#fff'
  },
  btnCont: {

  },
  buttonStyle: AppStyle.AppbuttonStyle,
  buttonTextStyle: {
    color: AppStyle.fontButtonColor,
    fontFamily: 'GlorySemiBold',
    fontSize: 16
  },
  selectboxNwContainer: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    fontFamily: 'Abel',
    borderWidth: 1,
    borderColor: '#E8E6EA',
    borderRadius: 16,
    height: 55,
    marginBottom: 15
  },
  SectionELlLabel: {
    position: 'absolute', top: -10, left: 20, right: 0, bottom: 0,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    width: 148,
    height: 25,
    textAlign: 'center',
    fontFamily: 'Abel',
    color: 'rgba(0, 0, 0, 0.4)',
  },
  SectionVSmallLabel: {
    position: 'absolute', top: -10, left: 20, right: 0, bottom: 0,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    width: 55,
    height: 25,
    textAlign: 'center',
    fontFamily: 'Abel',
    color: 'rgba(0, 0, 0, 0.4)',
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
  inputboxContainer: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    borderColor: '#E8E6EA',
    borderWidth: 1,
    borderRadius: 16,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 22,
    alignItems: 'center'
  },
  urlSection: {
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column'
  },
  outerCameraSec: {
    position: 'absolute',
    right: -10,
    bottom: 10
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
  outerChoosesection: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E8E6EA',
    marginLeft: 8,
    width: 85,
    height: 85,
  },
  urladdButton: {
    color: '#FF9228',
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Abel',
    display: 'flex'
  }
});


