import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Button } from 'react-native';
import { Parse } from 'parse/react-native';

// Custom Context API
import { MyContext } from '../globalstates/MyModule';

LogInScreen['navigationOptions'] = screenProps => ({
  header: null,
})

function LogInScreen( {route, navigation} ) {

  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ nameError, setNameError ] = useState(null);

  // get username variable from context i.e. global variable
  const { key_username } = useContext(MyContext);
  const [ globalUsername, setGlobalUsername ] = key_username;

  const clearFields = () => {
    setUsername('');
    setPassword('');
    setNameError(null);
  }

  const navigateToPage = (whichpage) => {
    console.log("Navigate to page (LoginScreen) : " + whichpage);
    navigation.navigate(whichpage);
  }

  const alertAnError = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        {text: 'OK', onPress: () => { navigateToPage('LogInStack') }},
      ]
    )
  }

  const onLogin = async() =>{
    let username2 = username.trim();
    let password2 = password.trim();
    
    console.log("username: " + username2);
    console.log("password: " + password2);

    if (username2 === "" || password2 === "" ) {
      setNameError('Fill the fields correctly.');
    } 
    else {
      try {
        await Parse.User.logIn(username2.toString(), password2.toString());
        setGlobalUsername(username2.toString());
        console.log("Login successfully.");
        clearFields();
        navigateToPage('HomeStack');    

      } catch (error) {                
        // this.setState(() => ({ nameError: error.message }));
        navigateToPage(error.message);
        return (error);
      }
    }
  }

  // Similiar to componentDidMount 和 componentDidUpdate:
  useEffect( () => {
    
    Parse.User.currentAsync().then(
      (user) => {
        if (user !== null) {
          let logineduser = user.get('username');
          setGlobalUsername(logineduser);
          clearFields();
          navigateToPage('HomeStack');
        }
      }
    );
  });
    
  return(
    <View style={styles.container}>
        <Text style={styles.titlePage}>Log In</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
            keyboardType="email-address"
            placeholder="Username"
            value={ username }
            onChangeText={ (value) => setUsername(value) }/>
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
            placeholder="Password"
            secureTextEntry={true}
            underlineColorAndroid='transparent'
            value={ password }
            onChangeText={ (value) => setPassword(value)} />
        </View>
        {!!nameError && (
          <View styles={styles.divError}>
              <Text style={styles.divErrorFont}>{ nameError }</Text>
          </View>
        )}
        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={ () => onLogin() }>
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>
        
        <View style={styles.containerLinksRow}>
          <TouchableHighlight style={styles.txtLink} onPress={ () => navigateToPage('RestorePasswordStack')}>
            <Text style={{fontWeight:'bold'}}>Forgot your password?</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.txtLink} onPress={ () => navigateToPage('SignUpStack')}>
            <Text style={{fontWeight:'bold'}}>Register</Text>
          </TouchableHighlight>
        </View>            
      </View>
  );
}

export default LogInScreen;

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
