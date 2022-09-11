import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, } from 'react-native';

import { Parse } from 'parse/react-native';

// Use global variable
import DataHandler from "../globalstates/DataHandler";

// create a component
const DeleteUpdateExp = ({ route, navigation }) => {
    return (        
        <View style={styles.container}>
          <Text>DeleteUpdateExp</Text>
        </View>
    );
}

export default DeleteUpdateExp;

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
  },
});