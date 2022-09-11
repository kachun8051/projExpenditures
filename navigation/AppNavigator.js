import React from 'react';
import { View, Text } from 'react-native';
//import { NavigationContainer } from '@react-navigation/native';
// Auth and Unauth Navigators
import { MyBottomNewTab, MyBottomTab } from './MainTabNavigator'; 



const AppNav = () => {
  return (    
      <Text>AppNav Demo!</Text>
  );
}

const AppNavigator = () => {

  
  /*
  return (      
    <Text>AppNavigator Demo!</Text>      
  );
  */

  /*
  const DummyView = () => {    
    return(      
      <Text>AppNavigator DummyView Demo!</Text>            
    );        
  }

  const DummyView2 = () => {
    if (username == '') {
      return(
        <Text>AppNavigator Demo for everyone !</Text>
      );
    } else {
      return(
        <Text>AppNavigator Demo for { username } !</Text>
      );
    }        
  }

  return ( <DummyView2 /> );
  */

  return ( <MyBottomNewTab /> )
        
}

export default AppNavigator;