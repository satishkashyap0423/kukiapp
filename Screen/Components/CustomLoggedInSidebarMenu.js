// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState,Component,useEffect} from 'react';
import {View, Text, Alert, StyleSheet,Image,SafeAreaView,Modal,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppStyle from '../Constants/AppStyle.js';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

const CustomLoggedInSidebarMenu = (props) => {
  const [modalVisible, setmodalVisible] = useState(false);
  const openStatusModal = () =>{
    
    this.setState({modalVisible:true});
  }
  return (
    <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        ><View style={stylesSidebar.sideMenuContainer}>
      
      <View style={stylesSidebar.profileHeader}>
        <View style={stylesSidebar.profileHeaderPicCircle}>
          <Image
                    source={require('../../assets/icon.png')}
                     style={[{
                     resizeMode: 'stretch',
                      width:60,
                       borderRadius: 60,
                      height:60
                    }]}
                    />
        </View>
        <Text style={stylesSidebar.profileHeaderText}>
          Kukiapp
        </Text>
        </View>
      
      
        <DrawerContentScrollView style={stylesSidebar.pDF} {...props}>
        
        <DrawerItem
          label={({color}) => 
            <View style={stylesSidebar.menuOuterSecc}>
            <Feather 
                  name={'home'}
                  size={25} 
                  color={AppStyle.appIconColor} 
                   
                />
              <Text style={{color:AppStyle.fontColor,width:'100%',fontFamily:'Abel',marginLeft:10,fontSize:17}}>
              Home
            </Text>
            </View>
            
          }
          onPress={() => {
            props.navigation.navigate('HomeCookiesScreen');
           
          }}
        />
        <DrawerItem
          label={({color}) => 
            <View style={stylesSidebar.menuOuterSecc}>
            <Feather 
                  name={'user'}
                  size={25} 
                  color={AppStyle.appIconColor} 
                   
                />
              <Text style={{color:AppStyle.fontColor,width:'100%',fontFamily:'Abel',marginLeft:10,fontSize:17}}>
              Profile
            </Text>
            </View>
          }
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.push('EditUserDetailScreen');
           
          }}
        />
        <DrawerItem
          label={({color}) => 
            
            <View style={stylesSidebar.menuOuterSecc}>
             <Feather 
                  name={'settings'}
                  size={25} 
                  color={AppStyle.appIconColor} 
                   
                /> 
              <Text style={{color:AppStyle.fontColor,width:'100%',fontFamily:'Abel',marginLeft:10,fontSize:17}}>
              Settings
            </Text>
            </View>
          }
          onPress={() => {
            props.navigation.navigate('SettingScreen');
           
          }}
        />
        <DrawerItem
          label={({color}) => 
            
            <View style={stylesSidebar.menuOuterSecc}>
             <Feather 
                  name={'dollar-sign'}
                  size={25} 
                  color={AppStyle.appIconColor} 
                   
                /> 
              <Text style={{color:AppStyle.fontColor,width:'100%',fontFamily:'Abel',marginLeft:10,fontSize:17}}>
              Invite & Earn
            </Text>
            </View>
          }
          onPress={() => {
            props.navigation.navigate('InviteEarnScreen');
           
          }}
        />

         <DrawerItem
          label={({color}) => 
            
            <View style={stylesSidebar.menuOuterSecc}>
             <Feather 
                  name={'user-x'}
                  size={25} 
                  color={AppStyle.appIconColor} 
                   
                /> 
              <Text style={{color:AppStyle.fontColor,width:'100%',fontFamily:'Abel',marginLeft:10,fontSize:17}}>
              Blocked Users
            </Text>
            </View>
          }
          onPress={() => {
            props.navigation.navigate('BlockedCookiesScreen');
           
          }}
        />


         <DrawerItem
          label={({color}) => 
            
            <View style={stylesSidebar.menuOuterSecc}>
             <Feather 
                  name={'info'}
                  size={25} 
                  color={AppStyle.appIconColor} 
                   
                /> 
              <Text style={{color:AppStyle.fontColor,width:'100%',fontFamily:'Abel',marginLeft:10,fontSize:17}}>
              App Info
            </Text>
            </View>
          }
          onPress={() => {
            props.navigation.navigate('AppinfoScreen');
           
          }}
        />


        {/*} <DrawerItem
          label={({color}) => 
            
            <View style={stylesSidebar.menuOuterSecc}>
             <Feather 
                  name={'database'}
                  size={25} 
                  color={AppStyle.appIconColor} 
                   
                /> 
              <Text style={{color:AppStyle.fontColor,width:'100%',fontFamily:'Abel',marginLeft:10,fontSize:17}}>
              Kuki Jar
            </Text>
            </View>
          }
          onPress={() => {
            props.navigation.navigate('CookieZarScreen');
           
          }}
        />
         <DrawerItem
          label={({color}) => 
            
            <View style={stylesSidebar.menuOuterSecc}>
             <Feather 
                  name={'key'}
                  size={25} 
                  color={AppStyle.appIconColor} 
                   
                /> 
              <Text style={{color:AppStyle.fontColor,width:'100%',fontFamily:'Abel',marginLeft:10,fontSize:17}}>
              Change Password
            </Text>
            </View>
          }
          onPress={() => {
            props.navigation.navigate('UpdatePasswordScreen');
           
          }}
        />*/}
        <DrawerItem
          label={({color}) => 
            <View style={stylesSidebar.menuOuterSecc}>
            <Feather 
                  name={'log-out'}
                  size={25} 
                  color={AppStyle.appIconColor} 
                   
                />
              <Text style={{color:AppStyle.fontColor,width:'100%',fontFamily:'Abel',marginLeft:10,fontSize:17}}>
              Logout
            </Text>
            </View>
          }
          onPress={() => {
            props.navigation.toggleDrawer();
            setmodalVisible(true)
          }}
        />
      </DrawerContentScrollView>
      <View style = {stylesSidebar.Mdcontainer}>  
        <Modal            
          animationType = {"fade"}  
          transparent = {true}  
          visible = {modalVisible}  
          onRequestClose = {() =>{ console.log("Modal has been closed."); } }>  
          {/*All views of Modal*/}  
              <View style = {stylesSidebar.modal}> 
              <Text style = {stylesSidebar.modalTitle}>Are you sure you want to Logout?</Text> 
             
              <View style = {stylesSidebar.Btnmodal}>
               <TouchableOpacity
              
              activeOpacity={0.9}
              onPress= {() => {  
                  setmodalVisible(false) }} style={stylesSidebar.buttonOuter}>
               <View
        style={stylesSidebar.buttonCStyle}>
              <Text style={stylesSidebar.buttonTextMStyle}>Cancel</Text>
              </View>
            </TouchableOpacity> 

             <TouchableOpacity
              
              activeOpacity={0.9}
               onPress={() => {
                   AsyncStorage.clear();
                   props.navigation.replace('LoginNavigationStack');
                }}
               style={stylesSidebar.buttonOuter}>
               <LinearGradient
        // Button Linear Gradient
        colors={[AppStyle.gradientColorOne, AppStyle.gradientColorTwo]}
        style={stylesSidebar.buttonMStyle}>
              <Text style={stylesSidebar.buttonTextMStyle}>Logout</Text>
              </LinearGradient>
            </TouchableOpacity> 
            </View>

              
          </View>  
        </Modal>  
        {/*Button will change state to true and view will re-render*/}  
        
      </View>
    </View></LinearGradient>
  );
};

export default CustomLoggedInSidebarMenu;

const stylesSidebar = StyleSheet.create({
  menuOuterSecc:{
   flexDirection:'row',
   alignItems:'center'
  },
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    
    paddingTop: 0,
    color: 'white',
    marginTop:30,

  },
pDF:{
  backgroundColor:'#fff'
},
  profileHeader: {
    flexDirection: 'row',
    padding: 15,
    textAlign: 'center',
  },
  profileHeaderPicCircle: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    color: 'white',
    backgroundColor: '#ffffff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderText: {
    color: AppStyle.fontColor,
    alignSelf: 'center',
    paddingHorizontal: 10,
    fontFamily: 'GlorySemiBold',
    fontSize:20
  },
  profileHeaderLine: {
    height: 1,
    marginHorizontal: 20,
    

  },
  modal: { 
    marginLeft:'10%',
    marginRight:'10%',  
    backgroundColor : AppStyle.btnbackgroundColor,
    width: '80%',  
    borderRadius:15,  
    borderWidth: 1,  
    borderColor: '#fff',
    position:'absolute',
    top:'35%',
    paddingTop:30,
    paddingBottom:30,
    paddingLeft:25,
    paddingRight:25,
    alignItems:'center'
   },  
   buttonTextMStyle: {  
    color: AppStyle.fontButtonColor,
    fontFamily: 'GlorySemiBold',
    fontSize: 15,
    textTransform:'capitalize'  
   },  
   modalTitle: {  
    color: AppStyle.fontButtonColor,
    fontFamily: 'GlorySemiBold',
    fontSize: 16,
    textTransform:'capitalize',
    marginBottom:10 
   },
   Btnmodal:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
   buttonOuter:{
   
   marginTop:20
   },
   buttonMStyle:{
    flexDirection:'row',
    justifyContent:'center',
    padding:10,
    borderRadius:15,
     width:'85%',
     marginLeft:10
   } ,
   buttonCStyle:{
    flexDirection:'row',
    justifyContent:'center',
    padding:10,
    borderRadius:15,
     width:'85%',
     marginLeft:10,
     borderWidth:1,
     borderColor:AppStyle.appIconColor
   }
});