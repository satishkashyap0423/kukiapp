// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, Component, useCallback } from 'react';
import { Picker } from '@react-native-picker/picker';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
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
  TouchableHighlight,
  KeyboardAvoidingView
} from 'react-native';

import AppStyle from '../../Constants/AppStyle.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Loader from '../../Components/Loader';
import CookieNavigationScreen from '../Common/CookieNavigationScreen';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Api from '../../Constants/Api.js';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';


class SpiritualSearchScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedDValCont: 'selectdVal',
      selectedCValCont: '',
      selectedGenderValue: '',
      selectedCommValue: '',
      agestartRange: '18-28',
      distanceRange: 50,
      selectedStateValue: '',
      selectedCityValue: '',
      searchWise: 'Distance',
      ageStartVal: 18,
      ageEndVal: 28,
      SselectedItems: [],
      CselectedItems: [],
      GselectedItems: [],
      itemsData: [],
      StateitemsData: [],
      CityitemsData: [{
        name: 'Any',
        id: 'any'
      }],
      selectedItems: [],
      selectedProfestionValue: [],
      selectedGuru: [],
      AselectedItems: [],
      loading: false,
      sliderLengthVal: 0,
      Name: 'any',
      errMsg: 'Error',
      ishowMOdal: false
    };

    AsyncStorage.setItem('activeClass', 'UactiveClass');

  }


  backScreen() {

    this.props.navigation.navigate('SpiritualScreen');
  }
  nextScreen() {

    this.props.navigation.navigate('UserstatusScreen');
  }

  setSelectedValue(itmVal, type) {
    if (type == 'gender') {

      this.setState({ selectedGenderValue: itmVal });
    } if (type == 'comm') {
      this.setState({ selectedCommValue: itmVal });
    } else if (type == 'State') {
      this.setState({ selectedStateValue: itmVal });
    } else if (type == 'city') {
      this.setState({ selectedCityValue: itmVal });
    }
  }

  onSSelectedItemsChange = (selectedItems, val) => {
    this.setState({ SselectedItems: selectedItems });
    this.getCityList(selectedItems);
  };
  onCSelectedItemsChange = (selectedItems, val) => {
    this.setState({ CselectedItems: selectedItems });
  };
  onGSelectedItemsChange = (selectedItems) => {
    this.setState({ GselectedItems: selectedItems });
  };
  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedProfestionValue: selectedItems });
  };
  onASelectedItemsChange = (selectedItems) => {
    this.setState({ AselectedItems: selectedItems });
  };

  handleInput(value, key) {
    // /^(?:[A-Za-z]+|\d+)$/.test(this.state.myValue);
    this.setState({ [key]: value });
  }

  checkVal(val) {

    this.setState({ checked: val });
    if (val == 'd') {
      this.setState({
        selectedDValCont: 'selectdVal'
      });
      this.setState({
        selectedCValCont: ''
      });
      this.setState({ searchWise: 'Distance' });
    } else if (val == 'c') {
      this.setState({
        selectedCValCont: 'selectdVal'
      });
      this.setState({
        selectedDValCont: ''
      });
      this.setState({ searchWise: 'City' });
    }


  }

  async componentDidMount() {
    let uDetailData = JSON.parse(await AsyncStorage.getItem('userDetailsData'));

    console.log('Country Data - ' + uDetailData.country);
    this.getStateList(uDetailData.country);
    this.getPrfessionalList();

    this.setState({ GselectedItems: ['any'] });
    this.setState({ selectedProfestionValue: ['any'] });
    this.setState({ AselectedItems: ['any'] });
    this.setState({ SselectedItems: ['any'] });
    this.setState({ CselectedItems: ['any'] });
    let gData = JSON.parse(await AsyncStorage.getItem('guruData'));
    if (gData != null) {
      this.setState({ selectedGuru: gData });
    }
  }

  handleCallback = (childData) => {
    this.setState({ ishowMOdal: childData });
  }



  clearRecords() {


    this.setState({ selectedDValCont: 'selectdVal' });
    this.setState({ selectedCValCont: '' });
    this.setState({ selectedGenderValue: '' });
    this.setState({ selectedCommValue: '' });
    this.setState({ agestartRange: '18-28' });
    this.setState({ distanceRange: 10 });
    this.setState({ selectedStateValue: '' });
    this.setState({ selectedCityValue: '' });
    this.setState({ searchWise: 'Distance' });
    this.setState({ ageStartVal: 18 });
    this.setState({ ageEndVal: 28 });
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
        console.log('Hello - ' + this.state.itemsData);
        let df = [{
          name: 'Any',
          id: 'any'
        }];

        let AllData = df.concat(res.data.data);
        this.setState({ itemsData: AllData });

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

  getStateList = async (country_id) => {
    console.log(country_id)
    let uDetailData = JSON.parse(await AsyncStorage.getItem('userDetailsData'));
    console.log("uDetailData", uDetailData)
    this.state.loading = true;
    let data = JSON.stringify({
      country_id:91
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
    axios.post(Api.apiUrl + '/get-states', data, headers)
      .then(res => {
        this.state.loading = false;
        let df = [{
          name: 'Any',
          id: 'any'
        }];

        let AllData = df.concat(res.data.data);
        console.log(AllData, "AllData")
        this.setState({ StateitemsData: AllData });

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

  getCityList = async (state_id) => {
    this.state.loading = true;
    let data = JSON.stringify({
      state_id: state_id
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
    axios.post(Api.apiUrl + '/get-cities', data, headers)
      .then(res => {
        this.state.loading = false;
        let df = [{
          name: 'Any',
          id: 'any'
        }];

        let AllData = df.concat(res.data.data);
        this.setState({ CityitemsData: AllData });
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



  render() {

    const { checked, selectedDValCont, selectedCValCont, selectedGenderValue, selectedCommValue, agestartRange, distanceRange, selectedStateValue, selectedCityValue, searchWise, ageStartVal, ageEndVal, StateitemsData, CityitemsData, GselectedItems, selectedProfestionValue, itemsData, selectedItems, AselectedItems, CselectedItems, SselectedItems, loading, errMsg, ishowMOdal, selectedGuru } = this.state;



    const Genderitems = [
      {
        name: 'Any',
        id: 'any'
      }, {
        name: 'Male',
        id: 'Male'
      },
      {
        name: 'Female',
        id: 'Female'
      },
      {
        name: 'Other',
        id: 'Other'
      }
    ];
    const Agegroupitems = [
      {
        name: 'Any',
        id: 'any'
      },
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

      this.setState({ loading: true });
      let searchType = 1;
      if (selectedDValCont != '') {
        searchType = 2;
      }
      let guruData = this.state.selectedGuru;
      let udata = JSON.parse(await AsyncStorage.getItem('userData'));
      let data = JSON.stringify({
        guru_id: guruData.id,
        name: this.state.Name,
        gender: GselectedItems.toString(),
        communities_id: selectedProfestionValue.toString(),
        city: CselectedItems.toString(),
        state: SselectedItems.toString(),
        search_type: searchType,
        age_group: AselectedItems.toString(),
        user_id: udata.id,
        distance: distanceRange,
      });

      const token = await AsyncStorage.getItem('fcmtoken');
      //return;
      let headers = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authentication': `Bearer ${token}`
        }
      }
      axios.post(Api.apiUrl + '/search-spiritual-followers', data, headers)
        .then(res => {
          this.setState({ loading: false });
          //AsyncStorage.setItem('searchResultRecords',JSON.stringify(res.data.data));

          this.props.navigation.push('SpiritualSearchResultScreen', { searchRecords: JSON.stringify(res.data.data), searchFellowData: JSON.stringify(data) });
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

      //
    };



    const setAgestartrange = (val) => {
      this.setState({ agestartRange: val.join('-') });
    };

    const setDistancerange = (val) => {
      this.setState({ distanceRange: val });
    };

    const getSizeSeekBar = (event) => {
      this.setState({ sliderLengthVal: event.nativeEvent.layout.width })

      //console.log('size', event.nativeEvent.layout.width)
    }

    let distanceSlider;
    if (selectedDValCont != '') {

      distanceSlider = <View style={styles.distancesectionContainer}><View style={styles.lowerheadSection}>
        <Text style={styles.SectionInnerHeadStyle}>Distance </Text>
        <Text style={styles.SectionInnerHeadStyle}>{distanceRange}km</Text>
      </View>
        <View onLayout={getSizeSeekBar} style={{ flex: 1 }}>
          <MultiSlider
            min={0}
            max={105}
            containerStyle={{ height: 30 }}
            trackStyle={{ borderRadius: 7, height: 3.5 }}
            selectedStyle={{ backgroundColor: 'rgba(253, 139, 48, 0.69)' }}
            unselectedStyle={{ backgroundColor: AppStyle.appIconColor }}
            sliderLength={this.state.sliderLengthVal}
            markerStyle={{ height: 34, width: 34, borderRadius: 15, backgroundColor: AppStyle.appIconColor, borderWidth: 0.5, borderColor: '#fff', borderWidth: 3, borderRadius: 17 }}
            pressedMarkerStyle={{ height: 25, width: 25, backgroundColor: AppStyle.appIconColor }}
            values={[50]}
            onValuesChange={values => setDistancerange(values)}

            step={5}
          />
        </View>
      </View>


    }
    let citySection;
    if (selectedCValCont != '') {

      citySection = <View style={styles.citysectionContainer}>
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
            subItemFontFamily={{ fontFamily: 'Abel' }}
            itemFontFamily={{ fontFamily: 'Abel' }}
            searchTextFontFamily={{ fontFamily: 'Abel' }}
            confirmFontFamily={{ fontFamily: 'Abel' }}
            searchPlaceholderText='Search State'
            showCancelButton={true}
            colors={{ primary: 'background: linear-gradient(90deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 114.92%)' }}

            hideConfirm={true}
            styles={{

              cancelButton: {
                backgroundColor: 'rgba(253, 139, 48, 0.69)',
                width: '100%',
                minWidth: '100%'

              },
              selectToggleText: {
                fontFamily: 'Abel'
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
                height: 450,
                paddingTop: 10,
                overflow: 'scroll',
                paddingBottom: 0,
              }
            }}
          />
          <Text style={[styles.SectionLabel, { width: 55 }]}>State</Text>
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
                fontFamily: 'Abel'
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
                height: 450,
                paddingTop: 10,
                overflow: 'scroll',
                paddingBottom: 0,
              }
            }}

          />
          <Text style={[styles.SectionLabel, { width: 45 }]}>City</Text>


        </View>

      </View>
    }

    let guruImage = `${Api.imgaePath}/${selectedGuru.image_path}`;


    return <View style={{ flex: 1, height: '100%' }}><ScrollView>
      <Loader loading={loading} />{ishowMOdal && <UseAlertModal message={errMsg} parentCallback={this.handleCallback} />}
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
      <View style={styles.mainBodyWithPadding}>
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




        </View>

        <View style={styles.SectionHeadStyle}>

          <Text style={styles.SectionHeadStyle}>Search Fellow Followers</Text>

        </View>

        <View style={styles.mainStection}>
          {/*<Text style={styles.SectionInnerHeadStyle}>{searchWise}-Wise</Text>*/}
          <View style={styles.selectionContStection}>
            {selectedDValCont != '' &&
              <TouchableOpacity onPress={() => this.checkVal('d')} >
                <LinearGradient
                  // Button Linear Gradient
                  colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
                  style={styles.selectionGContainer}>
                  <Text style={[styles.searchText, selectedDValCont != '' ? { color: AppStyle.fontColor } : {}]}> Distance-Wise</Text>
                </LinearGradient>
              </TouchableOpacity>
            }

            {selectedDValCont == '' &&

              <TouchableOpacity onPress={() => this.checkVal('d')} style={styles.selectionContainer}>


                <Text style={[styles.searchText, selectedDValCont != '' ? { color: AppStyle.fontColor } : {}]}> Distance-Wise</Text>


              </TouchableOpacity>}

            {selectedCValCont != '' &&
              <TouchableOpacity onPress={() => this.checkVal('c')} >
                <LinearGradient
                  // Button Linear Gradient
                  colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
                  style={styles.selectionGRightContainer}>
                  <Text style={[styles.searchText, selectedCValCont != '' ? { color: AppStyle.fontColor } : {}]}> City-Wise</Text>

                </LinearGradient>
              </TouchableOpacity>
            }


            {selectedCValCont == '' &&
              <TouchableOpacity onPress={() => this.checkVal('c')} style={styles.selectionRightContainer}>



                <Text style={[styles.searchText, selectedCValCont != '' ? { color: '#fff' } : {}]}> City-Wise</Text>



              </TouchableOpacity>
            }


          </View>
          <TouchableOpacity
            onPress={()=>{
              this.setState({ GselectedItems: ['any'] });
              this.setState({ selectedProfestionValue: ['any'] });
              this.setState({ AselectedItems: ['any'] });
              this.setState({ SselectedItems: ['any'] });
              this.setState({ CselectedItems: ['any'] });
              this.setState({ Name: 'any' });
            }}
            style={{
              alignSelf: 'flex-end',
              marginVertical: 10
            }}>
            <Text style={styles.clearSection}>Clear</Text>
          </TouchableOpacity>
          <View style={styles.selectboxContainer}>


            <TextInput
              style={styles.inputStyle}
              onChangeText={(Name) =>
                this.handleInput(Name, 'Name')
              }
              value={this.state.Name}

              placeholder="Search by name"
              placeholderTextColor="#000"

            />
            <Text style={[styles.SectionLabel, { width: 58 }]}>Name</Text>
          </View>

          <View style={styles.selectboxContainer}>


            <SectionedMultiSelect
              items={Genderitems}
              IconRenderer={Icon}
              uniqueKey="id"
              subKey="children"
              selectText="Gender..."
              showDropDowns={true}
              single={true}
              onSelectedItemsChange={this.onGSelectedItemsChange}
              selectedItems={this.state.GselectedItems}
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


                selectToggleText: {
                  fontFamily: 'Abel'
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
                cancelButton: {
                  backgroundColor: 'rgba(253, 139, 48, 0.69)',
                  width: '100%',
                  minWidth: '100%',
                  marginTop: -35
                },
                container: {
                  flex: 0,
                  top: '20%',
                  width: 'auto',
                  height: 270,
                  paddingTop: 10,
                }
              }}

            />
            <Text style={[styles.SectionLabel, { width: 65 }]}>Gender</Text>
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
              onSelectedItemsChange={this.onSelectedItemsChange}
              selectedItems={this.state.selectedProfestionValue}
              subItemFontFamily={{ fontFamily: 'Abel' }}
              itemFontFamily={{ fontFamily: 'Abel' }}
              searchTextFontFamily={{ fontFamily: 'Abel' }}
              confirmFontFamily={{ fontFamily: 'Abel' }}
              searchPlaceholderText='Search Professional Group'
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
                  fontFamily: 'Abel'
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
                  height: 450,
                  paddingTop: 10,
                  overflow: 'scroll',
                  paddingBottom: 0,
                }
              }}

            />
            <Text style={[styles.SectionLabel, { width: 145 }]}>Professional Group</Text>
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
              showCancelButton={true}
              hideSearch={true}
              styles={{

                cancelButton: {
                  backgroundColor: 'rgba(253, 139, 48, 0.69)',
                  width: '100%',
                  minWidth: '100%'

                },
                selectToggleText: {
                  fontFamily: 'Abel'
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
            <Text style={[styles.SectionLabel, { width: 90 }]}>Age Group</Text>
          </View>


          {distanceSlider}
          {citySection}

        </View>
        <View style={styles.btnCont}>
          <TouchableOpacity

            activeOpacity={0.8}
            onPress={handleSubmitPress}>
            <LinearGradient
              // Button Linear Gradient
              colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
              style={styles.buttonStyle}>

              <Text style={styles.buttonTextStyle}>Search</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View></ScrollView>
      <CookieNavigationScreen navigation={this.props.navigation} />
    </View>


  }
};
export default SpiritualSearchScreen;

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
  skipSection: {

    textAlign: 'right',
    position: 'absolute',
    right: 0,
    bottom: 8
  },
  clearSection: {
    color: 'rgba(253, 139, 48, 0.69)',
    fontSize: 16,
    fontFamily: 'Abel',
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
  topheadSection: {
    position: 'relative',
  },
  lowerheadSection: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom: 15,
  },
  innerHeadSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -40,
  },
  SectionHeadStyle: {
    fontSize: AppStyle.aapPageHeadingSize,
    marginTop: 10,
    fontFamily: 'GlorySemiBold',
    color: AppStyle.fontColor
  },
  SectionsubHeadStyle: {
    fontSize: 16,
    fontFamily: 'GlorySemiBold',
    color: '#777777',
    marginBottom: 20

  },
  SectionInnerHeadStyle: {
    fontSize: 18,
    fontFamily: 'Abel',

  },
  mainStection: {
    paddingTop: 10,
    width: '100%',

  },

  SectionLabel: {
    position: 'absolute', top: -10, left: 20, right: 0, bottom: 0,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    height: 25,
    textAlign: 'center',
    fontFamily: 'Abel',
    color: 'rgba(0, 0, 0, 0.4)',
  },
  selectionContStection: {
    flexDirection: 'row',
    width: '100%',
    textAlign: 'center',
    paddingTop: 10,
    marginBottom: 10,
    flex: 1,
    flexDirection: 'row',

    alignItems: 'stretch',

  },
  selectionContainer: {
    borderColor: '#E8E6EA',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    marginBottom: 15,
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: AppStyle.buttonTBPadding,
    paddingBottom: AppStyle.buttonTBPadding,
    borderLeftWidth: 1,
    borderRightWidth: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    minWidth: '50%',
    width: '50%',
    alignItems: 'center',
    height: 55,
    justifyContent: 'center',
  },
  selectionGContainer: {
    borderColor: '#E8E6EA',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    marginBottom: 15,
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: AppStyle.buttonTBPadding,
    paddingBottom: AppStyle.buttonTBPadding,
    borderLeftWidth: 1,
    borderRightWidth: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    minWidth: '50%',
    width: '100%',
    alignItems: 'center',
    height: 55,
    justifyContent: 'center',
  },
  selectionRightContainer: {
    textAlign: 'center',
    borderColor: '#E8E6EA',
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
    flexDirection: 'row',
    minWidth: '50%',
    width: '50%',
    alignItems: 'center',
    height: 55,
    justifyContent: 'center',
  },
  selectionGRightContainer: {
    textAlign: 'center',
    borderColor: '#E8E6EA',
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
    flexDirection: 'row',
    minWidth: '50%',
    width: '100%',
    alignItems: 'center',
    height: 55,
    justifyContent: 'center',
  },
  searchText: {
    color: AppStyle.fontColor,
    fontFamily: 'GlorySemiBold',
    fontSize: 14
  },
  selectedDValCont: {
    backgroundColor: 'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)'
  },
  selectedCValCont: {
    backgroundColor: 'linear-gradient(180deg, rgba(253, 139, 48, 0.69) 0%, rgba(253, 139, 48, 0.69) 100%)'
  },
  inputStyle: {
    height: 58,
    color: AppStyle.inputBlackcolorText,
    fontSize: 16,
    position: 'relative',
    zIndex: 1, // works on io,
    fontFamily: 'Abel',
    textTransform: 'capitalize'
  },
  selectboxContainer: {
    color: AppStyle.inputBlackcolorText,
    paddingLeft: 15,
    fontFamily: 'Abel',
    borderWidth: 1,
    borderColor: '#E8E6EA',
    borderRadius: 16,
    height: 55,
    marginBottom: 20
  },
  btnCont: {
    paddingTop: 20,

    bottom: 10,
    left: 0,
    right: 0,
    flex: 1,
    width: '100%',

  },
  buttonStyle: AppStyle.AppbuttonStyle,
  buttonTextStyle: {
    color: AppStyle.fontButtonColor,
    fontSize: AppStyle.buttonFontsize,
    fontFamily: 'Abel',

  },

  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  citysectionContainer: {
    paddingTop: 5
  },
  distancesectionContainer: {

    flex: 1,
    marginBottom: 5
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
  SectionVSmallLabel: {
    position: 'absolute', top: -10, left: 20, right: 0, bottom: 0,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingLeft: 0,
    paddingRight: 0,
    width: 50,
    height: 25,
    textAlign: 'center',
    fontFamily: 'Abel',
    color: 'rgba(0, 0, 0, 0.4)',
  }
});