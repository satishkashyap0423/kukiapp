// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState,Component,useCallback} from 'react';
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

import AsyncStorage from '@react-native-async-storage/async-storage';
//import LoginScreen from '../Auth/LoginScreen';
import MessagesScreen from '../Message/MessagesScreen';
import EditUserDetailScreen from '../Users/EditUserDetailScreen';
import EditUserScreen from '../Users/EditUserScreen';
import NotificationScreen from '../Users/NotificationScreen';
import SearchScreen from '../Search/SearchScreen';
import SearchResultScreen from '../Search/SearchResultScreen';
import SearchResultUserDetailScreen from '../Search/SearchResultUserDetailScreen';
import HomeCookiesScreen from '../Home/HomeCookiesScreen';
import ListCookiesScreen from '../Cookie/ListCookiesScreen';
import SentCookiesScreen from '../Cookie/SentCookiesScreen';
import ReceivedCookiesScreen from '../Cookie/ReceivedCookiesScreen';
import BlockedCookiesScreen from '../Cookie/BlockedCookiesScreen';
import AppinfoScreen from '../Setting/AppinfoScreen';
import ArchivedCookiesScreen from '../Cookie/ArchivedCookiesScreen';
import OpenCookiesScreen from '../Cookie/OpenCookiesScreen';
import CookeiUserDetailScreen from '../Cookie/CookeiUserDetailScreen';
import CookiesDetail from '../Cookie/CookiesDetail';
import CommunityBoardScreen from '../Community/CommunityBoardScreen';
import DiscussionDetailScreen from '../Community/DiscussionDetailScreen';
import GetSocialScreen from '../Community/GetSocialScreen';
import CommunityPostScreen from '../Community/CommunityPostScreen';
import CommunityPostsListScreen from '../Community/CommunityPostsListScreen';
import InviteEarnScreen from '../Invite/InviteEarnScreen';
import CookieZarScreen from '../Invite/CookieZarScreen';
import SingleChatScreen from '../Message/SingleChatScreen';
import SettingScreen from '../Setting/SettingScreen';
import GeolocationM from '../GeolocationM';
import UpdatePasswordScreen from '../Setting/UpdatePasswordScreen';
import CookieNavigationScreen from '../Common/CookieNavigationScreen';
import SpiritualScreen from '../Spiritual/SpiritualScreen';
import PostEventScreen from '../Spiritual/PostEventScreen';
import EventListScreen from '../Spiritual/EventListScreen';
import EventDetailScreen from '../Spiritual/EventDetailScreen';
import SendInvitaionScreen from '../Spiritual/SendInvitaionScreen';
import SpiritualSearchScreen from '../Spiritual/SpiritualSearchScreen';
import SpiritualSearchResultScreen from '../Spiritual/SpiritualSearchResultScreen';
import SpiritualShareScreen from '../Spiritual/SpiritualShareScreen';
import EventShareScreen from '../Spiritual/EventShareScreen';
import SpiritualInsightsScreen from '../Spiritual/SpiritualInsightsScreen';
import PostAudioScreen from '../Spiritual/PostAudioScreen';
import SpiritualinsightsDetailScreen from '../Spiritual/SpiritualinsightsDetailScreen';

import {createStackNavigator} from '@react-navigation/stack';
import SpiritualPostScreen from '../Community/SpiritualPostScreen';
const Stack = createStackNavigator();

class ProtectedNavigationStack extends Component {

 constructor(props) {
    super(props);
    this.state = {
      SelectedNav:'HomeCookiesScreen'
    };
  }
  render (){
    const {SelectedNav} = this.state;
    return  <Stack.Navigator initialRouteName={SelectedNav}>
              <Stack.Screen
              name="EditUserScreen"
              component={EditUserScreen}
              options={{headerShown: false}}
            />
             <Stack.Screen
              name="NotificationScreen"
              component={NotificationScreen}
              options={{headerShown: false}}
            />
        
          <Stack.Screen
            name="HomeCookiesScreen"
            component={HomeCookiesScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
              name="SearchScreen"
              component={SearchScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SearchResultScreen"
              component={SearchResultScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SearchResultUserDetailScreen"
              component={SearchResultUserDetailScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CookeiUserDetailScreen"
              component={CookeiUserDetailScreen}
              options={{headerShown: false}}
            /><Stack.Screen
              name="CookiesDetail"
              component={CookiesDetail}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DiscussionDetailScreen"
              component={DiscussionDetailScreen}
              options={{headerShown: false}}
            />
             <Stack.Screen
              name="SentCookiesScreen"
              component={SentCookiesScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ReceivedCookiesScreen"
              component={ReceivedCookiesScreen}
              options={{headerShown: false}}
            /> 
            <Stack.Screen
              name="BlockedCookiesScreen"
              component={BlockedCookiesScreen}
              options={{headerShown: false}}
            /> 
            <Stack.Screen
              name="AppinfoScreen"
              component={AppinfoScreen}
              options={{headerShown: false}}
            />
             <Stack.Screen
              name="ArchivedCookiesScreen"
              component={ArchivedCookiesScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="OpenCookiesScreen"
              component={OpenCookiesScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CookieNavigationScreen"
              component={CookieNavigationScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ListCookiesScreen"
              component={ListCookiesScreen}
              options={{headerShown: false}}
            /> 
            <Stack.Screen
              name="EditUserDetailScreen"
              component={EditUserDetailScreen}
              options={{headerShown: false}}
            />
             <Stack.Screen
              name="MessagesScreen"
              component={MessagesScreen}
              options={{headerShown: false}}
            />
             <Stack.Screen
              name="CommunityBoardScreen"
              component={CommunityBoardScreen}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="GetSocialScreen"
              component={GetSocialScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CommunityPostScreen"
              component={CommunityPostScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SpiritualPostScreen"
              component={SpiritualPostScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CommunityPostsListScreen"
              component={CommunityPostsListScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="InviteEarnScreen"
              component={InviteEarnScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CookieZarScreen"
              component={CookieZarScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SingleChatScreen"
              component={SingleChatScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SettingScreen"
              component={SettingScreen}
              options={{headerShown: false}}
            /> 
            <Stack.Screen
              name="UpdatePasswordScreen"
              component={UpdatePasswordScreen}
              options={{headerShown: false}}
            /> 
            <Stack.Screen
              name="SpiritualScreen"
              component={SpiritualScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="PostEventScreen"
              component={PostEventScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="EventListScreen"
              component={EventListScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="EventDetailScreen"
              component={EventDetailScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SendInvitaionScreen"
              component={SendInvitaionScreen}
              options={{headerShown: false}}
            /> 
            <Stack.Screen
              name="SpiritualSearchScreen"
              component={SpiritualSearchScreen}
              options={{headerShown: false}}
            /> 
            <Stack.Screen
              name="SpiritualSearchResultScreen"
              component={SpiritualSearchResultScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SpiritualShareScreen"
              component={SpiritualShareScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="EventShareScreen"
              component={EventShareScreen}
              options={{headerShown: false}}
            /> 
            <Stack.Screen
              name="SpiritualInsightsScreen"
              component={SpiritualInsightsScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="PostAudioScreen"
              component={PostAudioScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SpiritualinsightsDetailScreen"
              component={SpiritualinsightsDetailScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
  }
};
export default ProtectedNavigationStack;

const styles = StyleSheet.create({
  topheadSection:{
   
  }
});