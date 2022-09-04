// import * as React from 'react';
import React, { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

// You can import from local files
import AssetCover from '../components/AssetCover';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

// Custom Context API
import { MyContext } from '../globalstates/MyModule';

function PrivateScreen( {route, navigation} ) {
  
  // get username variable from context i.e. global variable
  const { key_username } = useContext(MyContext);
  const [ globalUsername, setGlobalUsername ] = key_username;

  if (globalUsername == '') {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          Please login!!!
        </Text>
    </View>  
    );
  } 
  else {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          Change code in the editor and watch it change on your phone! Save to get a shareable url.
        </Text>
        <Card>
          <AssetCover />
        </Card>
      </View>
    );
  }  
}

export default PrivateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});