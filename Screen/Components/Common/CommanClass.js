import React, { Component } from 'react';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import Api from '../../Constants/Api.js';
import AsyncStorage from '@react-native-async-storage/async-storage';


class CommanClass extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    };
	}
	GetFCMToken = async () => {
		let secure_deviceid = await SecureStore.getItemAsync('secure_deviceid');
	    let data = JSON.stringify({
	    	device_token: secure_deviceid
	    });
	    let headers = {
	      headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	      }
	    }
	    axios.post(Api.apiUrl+'/check-device', data, headers)
	    .then(res => {
	    	console.log(res.data); 
	    	if(res.data.is_registered == '1'){
	    		alert(secure_deviceid);
	    	}
	    }).catch(error => {console.log(error); this.state.loading = false; });
	}

	 /*try{
	   
	    const fcmtoken = (await Notifications.getDevicePushTokenAsync()).data;

	    if(fcmtoken){
	     
	      console.log(fcmtoken);
	      this.props.navigation.navigate('PersonalityTraits');
	     
	    }else{

	    }
	  } catch (error){
	    console.log(error,'error in fcm token');
	  }*/

}

export default CommanClass