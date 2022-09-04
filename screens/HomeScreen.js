import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import { Parse } from "parse/react-native";
// Custom Context API
import { MyContext } from '../globalstates/MyModule';

function HomeScreen( {route, navigation} ){

  //const [currentUser, setCurrentUser] = useState(null);

  // get username variable from context i.e. global variable
  const { key_username } = useContext(MyContext);
  const [ globalUsername, setGlobalUsername ] = key_username;

  const navigateToPage = (whichpage) => {
    console.log("Navigate to page (LoginScreen) : " + whichpage);
    navigation.navigate(whichpage);
  }

  const UserLogOut = async() => {
    try {
      await Parse.User.logOut();
      // To verify that current user is now empty, currentAsync can be used
      const currentUser = Parse.User.current();
      if (currentUser === null) {
        alert('Success! No user is logged in anymore!');
      }
      // Update state variable holding current user
      getCurrentUser();
      setGlobalUsername('');
      navigateToPage('LogInStack');
      return true;
    } catch (error) {
      alert(`Error! ${error.message}`);
      return false;
    }
  };

  // Function that will return current user and also update current username
  const getCurrentUser = () => {
    const currentUser = Parse.User.current();
    // Update state variable holding current user
    // setCurrentUser(currentUser);
    return currentUser;
  };

  return (
    <View style={styles.container}>
      <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
              <Text>Home Screen</Text>
              <Text>Hello, {globalUsername}</Text>
              <Text>Home Screen 2B</Text>
              <Text>Home Screen 2B</Text>
              <Text>Home Screen 2B</Text>
              <Button
                title="Log Out"
                onPress={() => UserLogOut() }
              />
          </View>
      </ScrollView>    
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  }
});