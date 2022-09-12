import React, { useCallback, useEffect, useState } from 'react';
// import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import { Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import Entypo from '@expo/vector-icons/Entypo';

import { applicationId, javascriptKey, masterKey, serverURL } from './constants/Keys';
import Parse from "parse/react-native.js";

import AppNavigator from './navigation/AppNavigator';

import { MyContextProvider } from './globalstates/MyModule';
import { NavigationContainer } from '@react-navigation/native';

// import AddJobType from './jobtypescreens/AddJobtype';

// https://github.com/templates-back4app/react-native-todoapp

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(applicationId, javascriptKey);
Parse.masterKey = masterKey;
Parse.serverURL = serverURL;

export default function App() {
  
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
        try {
          // Keep the splash screen visible while we fetch resources
          await SplashScreen.preventAutoHideAsync();
          // Pre-load fonts, make any API calls you need to do here
          await Font.loadAsync(Entypo.font);
          // Artificially delay for two seconds to simulate a slow loading
          // experience. Please remove this if you copy and paste the code!
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
          console.warn(e);
        } finally {
          // Tell the application to render
          setAppIsReady(true);
        }
      }
      prepare();
    }, []);

    const onReadyRootView = useCallback(async () => {
      if (appIsReady) {
        // This tells the splash screen to hide immediately! If we call this after
        // `setAppIsReady`, then we may see a blank screen while the app is
        // loading its initial state and rendering its first pixels. So instead,
        // we hide the splash screen once we know the root view has already
        // performed layout.
        await SplashScreen.hideAsync();
      }
    }, [appIsReady]);

    const DummyView = () => {
      /*
      return(        
        <View style={styles.container} onLayout={onReadyRootView}>
          <Text>SplashScreen Demo! 👋</Text>
          <Entypo name="rocket" size={30} />
        </View>
      );  
      */
      return (
        <MyContextProvider>
          <View style={styles.container} onLayout={onReadyRootView}>
            <AddJobType />
          </View>
        </MyContextProvider>        
      );  
    }

    if (!appIsReady) {
      console.log("app is not ready!");
      return null;      
    }
    else {
      console.log("app is ready.");
      // return (<DummyView />);
      return (                  
            <NavigationContainer style={styles.container2}
              onReady={onReadyRootView}>                  
                  <MyContextProvider>
                    <AppNavigator />
                  </MyContextProvider>                                                  
            </NavigationContainer>
      );
    }  
}

//export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  }
});
