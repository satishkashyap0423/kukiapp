import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import Api from './Constants/Api';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

	console.log('Authorization status---:', authStatus);
  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}

const checkToken = async () => {
	const fcmToken = await messaging().getToken();
	if (fcmToken) {
	   console.log('token is '+fcmToken);
	   Api.fcmToken = fcmToken;
	   AsyncStorage.setItem('fcmtoken',fcmToken);
	} 
   }

const notificationListener = () => {
	// Assume a message-notification contains a "type" property in the data payload of the screen to open
	console.log("notification handling.....");
	messaging().onNotificationOpenedApp(remoteMessage => {
	  console.log(
		'Notification caused app to open from background state:',
		remoteMessage.notification,
	  );
	});
  
	// Check whether an initial notification is available
	messaging()
	  .getInitialNotification()
	  .then(remoteMessage => {
		if (remoteMessage) {
		  console.log(
			'Notification caused app to open from quit state:',
			remoteMessage.notification,
		  );
		}
	  })
	  .catch(error => console.log('failed', error));
  
	messaging().onMessage(async remoteMessage => {
		let data = JSON.stringify(remoteMessage);
		let notificationData = JSON.stringify(data);
		let notificationData1 = JSON.stringify(notificationData);
		  console.log(
			'Notification data:',
			remoteMessage.notification.title,
		  );
	  Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
	});
  };
  export {
	requestUserPermission,
	checkToken,
	notificationListener,
  };