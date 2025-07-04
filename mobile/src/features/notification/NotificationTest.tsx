import { Text, View,Linking, ActivityIndicator  } from "react-native"; 
import { use, useEffect, useState } from "react";
import {PermissionsAndroid} from 'react-native'; 
import messaging from '@react-native-firebase/messaging'; 


const NotificationTest: React.FC = () => {
    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
      };
      const getToken = async() => {
        const token =await messaging().getToken();
        console.log("Token=",token);
      }
      useEffect(()=>{
        requestUserPermission();
        getToken();
      })

    return(
        <View>
            <Text>Hello</Text>
        </View>
    )
}

export default NotificationTest;