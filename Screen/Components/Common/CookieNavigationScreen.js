// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, Component, useCallback } from 'react';

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
import axios from 'axios';
import AppStyle from '../../Constants/AppStyle.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Api from '../../Constants/Api.js';


class CookieNavigationScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeClass: 'nm',
      isguruSelected: "0",
    };

  }


  async getUserData() {
    let udata = JSON.parse(await AsyncStorage.getItem("userData"));
    console.log("used " + udata.id);
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
        console.log(res)
        if (res.data.status == "true") {
          console.log("my", res.data.data.user_detail);
          this.setState({ isguruSelected: res.data.data.user_detail.guru_id });
        } else {
          // console.log(error);
          // this.state.loading = false;
        }
      })
      .catch((error) => {
        console.log(error);
        // this.state.loading = false;
      });
  }
  async getData() {
    await AsyncStorage.getItem("activeClass").then((value) => {
      console.log(value)
      this.setState({ activeClass: value });

    })
      .then(res => {

      });
  }
  swithScreen(val, iStat) {
    this.props.navigation.push(val, {
      isReturnscreen: 'ListCookiesScreen'
    });
  }

  getSpiritual = async () => {
    console.log(this.state.isguruSelected);
    await AsyncStorage.setItem("activeClass", "COactiveClass");
    this.props.navigation.push("SpiritualScreen", {
      isguruSelectedVal: this.state.isguruSelected,
    });
  }
  componentDidMount() {
    console.log("getUserData")
    this.getData();
    this.getUserData()
  }

  render() {
    const { activeClass, CactiveClass, FactiveClass, MactiveClass, UactiveClass } = this.props;
    return <View style={styles.ftmenuSection}>

      <TouchableOpacity
        style={[(this.state.activeClass == 'CactiveClass' ? styles.CactiveClass : '')]}
        activeOpacity={0.5}
        onPress={this.swithScreen.bind(this, 'HomeCookiesScreen', 'CactiveClass')}
      >
        <Image

          source={require('../../../assets/images/homeNav.png')}
          style={{
            width: 40,
            height: 27,
            resizeMode: 'contain'
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[(this.state.activeClass == 'COactiveClass' ? styles.COactiveClass : '')]}
        activeOpacity={0.5}
        onPress={() => {
          this.setState({ activeClass: "COactiveClass" })
          this.getSpiritual(this, "1")
        }
        }
      >
        <Image

          source={require('../../../assets/images/usersNav.png')}
          style={{
            width: 37,
            height: 27,
            resizeMode: 'contain'
          }}
        />

      </TouchableOpacity>
      <TouchableOpacity
        style={[(this.state.activeClass == 'FactiveClass' ? styles.FactiveClass : '')]}
        activeOpacity={0.5}
        onPress={this.swithScreen.bind(this, 'ListCookiesScreen')}>
        <Image

          source={require('../../../assets/images/kuka_appa.png')}
          style={{
            width: 37,
            height: 27,
            resizeMode: 'contain'
          }}
        />

      </TouchableOpacity>
      <TouchableOpacity
        style={[(this.state.activeClass == 'MactiveClass' ? styles.MactiveClass : '')]}
        activeOpacity={0.5}
        onPress={this.swithScreen.bind(this, 'MessagesScreen')}>
        <Image

          source={require('../../../assets/images/messageNav.png')}
          style={{
            width: 37,
            height: 27,
            resizeMode: 'contain'
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[(this.state.activeClass == 'UactiveClass' ? styles.UactiveClass : '')]}
        activeOpacity={0.5}
        onPress={this.swithScreen.bind(this, 'SearchScreen')}>
        <Image

          source={require('../../../assets/images/SearchNav.png')}
          style={{
            width: 37,
            height: 27,
            resizeMode: 'contain'
          }}
        />

      </TouchableOpacity>
    </View>
  }
};
export default CookieNavigationScreen;

const styles = StyleSheet.create({
  topheadSection: {

  },
  ftmenuSection: {
    backgroundColor: AppStyle.appColor,
    paddingLeft: 35,
    paddingRight: 35,
    paddingBottom: 20,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  CactiveClass: {
    borderBottomWidth: 2,
    paddingBottom: 5,
    borderColor: AppStyle.gradientColorTwo
  },
  FactiveClass: {
    borderBottomWidth: 2,
    paddingBottom: 5,
    borderColor: AppStyle.gradientColorTwo
  },
  MactiveClass: {
    borderBottomWidth: 2,
    paddingBottom: 5,
    borderColor: AppStyle.gradientColorTwo
  },
  UactiveClass: {
    borderBottomWidth: 2,
    paddingBottom: 5,
    borderColor: AppStyle.gradientColorTwo
  },
  COactiveClass: {
    borderBottomWidth: 2,
    paddingBottom: 5,
    borderColor: AppStyle.gradientColorTwo
  }
});