import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Parse } from "parse/react-native";
// Custom Context API
import { MyContext } from '../globalstates/MyModule';

SignUpScreen['navigationOptions'] = screenProps => ({
  header: null,
})

function SignUpScreen( {route, navigation} ) {

  const [ username, setUsername ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ nameError, setNameError ] = useState(null);

   // get username variable from context i.e. global variable
   const { key_username } = useContext(MyContext);
   const [ globalUsername, setGlobalUsername ] = key_username;

  const submitAndClear = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setNameError(null);
  }

  const navigateToPage = (whichpage) => {
    console.log("Navigate to page (SignUpScreen): " + whichpage);
    navigation.navigate(whichpage);
  }
  /*
  const alertAnError = (title,message) => {
    Alert.alert(
      title,
      message,
      [
        {text: 'OK', onPress: () => { navigateToPage('LogInStack') }},
      ]
    )
  }
  */
  const validateIt = () => {
    if (username === undefined || email === undefined || password === undefined) {
      return false;
    }
    if (username.trim() === '' || email.trim() === '' || password.trim() === '') {
      return false;
    }
    return true;
  }

  const onSignUp = async() => {

    if ( validateIt() === false ) {
      setNameError(`Fill the fields correctly.`);
    } 
    else {
      try {
        Parse.User.logOut();
        let user = new Parse.User();
        user.set("username", username);
        user.set("email", email);
        user.set("password", password);
        const result = await user.signUp();        
        AsyncStorage.setItem('sessionToken', result.getSessionToken());
        AsyncStorage.setItem('username', result.getUsername());
        setGlobalUsername(username.toString());
        submitAndClear();
        navigateToPage('HomeStack');            
      } catch (error) {
        console.log(error)
        setNameError(error.message);          
      }
    }
  }

  return (
    <View style={styles.container}>
        <Text style={styles.titlePage}>Sign Up</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
            keyboardType="default"
            placeholder="Username"
            value={username}
            onChangeText={ (value) => setUsername(value) }/>
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
            keyboardType="email-address"
            placeholder="Email"
            value={email}
            onChangeText={ (value) => setEmail(value) }/>
        </View>
                
        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
            placeholder="Password"
            value={password}
            secureTextEntry={true}
            underlineColorAndroid='transparent'
            onChangeText={ (value) => setPassword(value) }/>
        </View>

        {!!nameError && (
          <View styles={styles.divError}>
            <Text style={styles.divErrorFont}>{nameError}</Text>
          </View>
        )}

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={ () => onSignUp() }>
          <Text style={styles.loginText}>Sign Up</Text>
        </TouchableHighlight>

        <View style={styles.containerLinksRow}>
          <TouchableHighlight style={styles.txtLink} onPress={onSignUp}>
            <Text style={{fontWeight:'bold'}}>Already have an account?  
              <Text style={{color: 'blue', paddingLeft: 5}}
                onPress={ () => navigateToPage('LogInStack') }>
                  Log In now
              </Text>
            </Text>
          </TouchableHighlight>
        </View>            
      </View>
    );
}

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#00b5ec",
    padding: 30
  },
  row: {
    flexDirection: "row"
  },
  titlePage:{
    marginBottom: 30,
    fontSize: 25,
    fontWeight: 'bold'
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    height: 50,
    marginBottom: 15,
    flexDirection: 'row'
  },
  divErrorFont:{
    textAlign: 'center',
    color: '#721c24',
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 2,
  },
  inputs:{
    height: 50,
    marginLeft:16,
    flex:1,
  },
  fontAwesomeIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width: 250,
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerLinksRow:{
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  txtLink:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15
  },  
  loginText: {
    color: '#fff',
  }
});