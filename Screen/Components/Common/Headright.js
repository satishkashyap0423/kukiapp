import React, { Component } from 'react';
import AppStyle from '../../Constants/AppStyle.js';
import {NavigationContainer,useNavigation, DrawerActions} from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Loader from '../../Components/Loader'; 
import axios from 'axios';
import Api from '../../Constants/Api.js'; 
import AlertMessages from '../../Constants/AlertMessages.js';
import UseAlertModal from '../Common/UseAlertModal';

import {
  View,
  Image,
  TouchableOpacity,
  Text
} from 'react-native';



class Headright extends Component {
  
   constructor(props) {
    super(props);
    this.state = {
      notiCount:false
    };

  
  }

async getNotificationCount(){
  let udata = JSON.parse(await AsyncStorage.getItem('userData'));
  this.setState({loading:true});
      let data = JSON.stringify({
        user_id: udata.id
      });
      let headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
      }
      axios.post(Api.apiUrl+'/get-notifications-count', data, headers)
      .then(res => {
        //console.log(res.data); 
        this.setState({loading:false});
        this.setState({notiCount:res.data.data});
        if(res.data.data != 0){
          this.setState({notiCount:true});
        }
      }).catch(error => {
        if(error.toJSON().message === 'Network Error'){
          this.setState({errMsg:AlertMessages.noInternetErr});
          this.setState({ishowMOdal:true});
          this.setState({loading:false}); 
        }else{
          this.setState({errMsg:error});
          this.setState({ishowMOdal:true});
          this.setState({loading:false});
        }
      });
}

componentDidMount(){
	this.getNotificationCount();
}

notificatonComp(){
  
  this.setState({notiCount:false});
  this.props.navigation.navigate('NotificationScreen') 
}




  render() {
    const { navigation } = this.props;
    const { notiCount } = this.state;
   
    
    let notiIcon = [];
    if(notiCount){
    	notiIcon.push(<Text style={styles.iconsSecsty}>.</Text>);
    }
    return (<TouchableOpacity
                        style={styles.iconsSec}
                        onPress={() =>  this.notificatonComp(this) } activeOpacity={0.7}>
                        <Feather name={'bell'} size={25} color={AppStyle.appIconColor} />
        				{notiIcon}
                      </TouchableOpacity>
        );
  }
}


const styles = {  
  container: {
    marginTop: 0,
    padding: 2,
  },
  iconsSec: {
  borderWidth:1.5,
  borderColor:'#E8E6EA',
  borderRadius:10,
  marginRight:15,
  width:45,
  height:45,
  alignItems:'center',
  flexDirection:'row',
  justifyContent:'center',
  backgroundColor:'#fff',
  marginBottom:10
   
  },
  iconsSecsty:{
  	color:'red',
  	fontSize:50,
  	fontWeight:'bold',
  	position:'absolute',
  	bottom:15,
  	right:3
  }
};
// Wrap and export
export default function(props) {
  const navigation = useNavigation();
  return <Headright {...props} navigation={navigation} />;
}
