import React, { Component } from 'react';
import AppStyle from '../../Constants/AppStyle.js';
import {NavigationContainer,useNavigation, DrawerActions} from '@react-navigation/native';

import { Feather } from '@expo/vector-icons';
import {
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

const state = {};

class ListIcon extends Component {
  
   constructor(props: Object) {
    super(props);
}

searchFunction = (text) => {
  const updatedData = this.arrayholder.filter((item) => {
    const item_data = `${item.title.toUpperCase()})`;
    const text_data = text.toUpperCase();
    return item_data.indexOf(text_data) > -1;
  });
   
  this.setState({ data: updatedData, searchValue: text });
};


  render() {
    const { navigation } = this.props;
    return (
        

                        <TouchableOpacity
                        style={styles.iconsSec}
                        onPress={() =>  navigation.dispatch(DrawerActions.toggleDrawer())} activeOpacity={0.7}>
                        <Feather name={'menu'} size={25} color={AppStyle.appIconColor} />
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
  borderWidth:1,
  borderColor:'#E8E6EA',
  borderRadius:10,
  marginLeft:15,
  width:45,
  height:45,
  alignItems:'center',
  flexDirection:'row',
  justifyContent:'center',
  backgroundColor:'#fff',
   marginBottom:10

   
  },
  item: {
    backgroundColor: "#fff",
    
   
  },
  flatcontainer:{
    
  }
};
// Wrap and export
export default function(props) {
  const navigation = useNavigation();
  return <ListIcon {...props} navigation={navigation} />;
}
