import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigation from './Screen/Components/Common/AppNavigation';
import Entypo from '@expo/vector-icons/Entypo';
import {
  getFcmToken,
  getFcmTokenFromLocalStorage,
  requestUserPermission,
  notificationListener,
  checkToken,
} from './Screen/pushnotification_helper';


/* Load app fount */
let appFonts = {
 Aclonica: require('./assets/fonts/Aclonica-Regular.ttf'),
 GloryBold: require('./assets/fonts/Gilroy-Bold.ttf'),
 //GlorySemiBold: require('./assets/fonts/Gilroy-SemiBold.ttf'),
 GlorySemiBold: require('./assets/fonts/Abel-Regular.ttf'),
 GloryLight: require('./assets/fonts/Gilroy-Light.ttf'),
 GloryMedium: require('./assets/fonts/Gilroy-Medium.ttf'),
 //Abel: require('./assets/fonts/Gilroy-Regular.ttf'),
 Abel: require('./assets/fonts/Abel-Regular.ttf'),
 GloryThin: require('./assets/fonts/Gilroy-Thin.ttf'),

};



// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady,fontsLoaded] = useState(false);
 
  useEffect(() => {
    void requestUserPermission();
    void checkToken();
    void notificationListener();
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(appFonts);
       // await SplashScreen.hideAsync();
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
    
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {

      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {

    return null;
  }

  return (
    <AppNavigation />
    
  );
}

