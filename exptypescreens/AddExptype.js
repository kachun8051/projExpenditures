import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, } from 'react-native';
// import { Alert } from 'react-native';
import Constants from 'expo-constants';
import { Parse } from 'parse/react-native';
// Custom Context API
import { MyContext } from '../globalstates/MyModule';
// Use global variable
import DataHandler from "../globalstates/DataHandler";

// create component 
function AddExpType( { route, navigation } ) {

    const [Exptype, setExptype] = useState({
      owner: '', name: '', description: '', price: -1,
    });
    const [ nameError, setNameError ] = useState(null);    
    const [loading, setLoading] = useState(false);
    // get username variable and expenditure type from context i.e. global variable
    const { key_username, key_exptype } = useContext(MyContext);
    const [ globalUsername, setGlobalUsername ] = key_username;

    const goBackHandler = () => {
      navigation.goBack(null);
    }

    useState(
      () => {
        console.log('useState');
        console.log('globalUsername: ' + globalUsername);
        // get the username from context
        setExptype({ ...Exptype, owner: globalUsername });
      }, []
    );

    const postAndClear = () => {
      setExptype({
        owner: '',
        name: '',
        description: '',
        price: -1
      });
      setNameError(null);
      setLoading(false);
    }

    const onChangeName = (value) => {
      setExptype({ ...Exptype, name: value });
    };

    const onChangeDescription = (value) => {
      setExptype({ ...Exptype, description: value });
    };

    const onChangePrice = (value) => {
      setExptype({ ...Exptype, price: value });
    };
    
    const validateIt = () => {
      if (Exptype.owner === undefined || Exptype.name === undefined || Exptype.description === undefined || Exptype.price === undefined ) {
        return false;
      }
      if (isNaN(Exptype.price)) {
        return false;
      }
      if (Exptype.owner.trim() === '') {
        return false;
      } 
      if (Exptype.name.trim() === '') {
        return false;
      }
      if (Exptype.description.trim() === ''){
        return false;
      }
      if (Exptype.price < 0){
        return false;
      }
      return true;
    }
    
    const saveData = () => {

      if ( validateIt() === false ) {
        setNameError(`Fill the fields correctly.`);
        return false;
      } 
      else {
        setLoading(true);
        const clsExpTypes = Parse.Object.extend("ExpTypes");
        const objExpTypes = new clsExpTypes();

        objExpTypes.set("owner", Exptype.owner);
        objExpTypes.set("name", Exptype.name);
        objExpTypes.set("description", Exptype.description);
        objExpTypes.set("price", parseFloat(Exptype.price));

        return objExpTypes.save()
          .then(
            (_exptype) => {
            // object id is unique and key for flatlist
            let objid = _exptype.id;
            // Success
            //alert('New object created with objectId: ' + objid);
            console.log('New object created with objectId: ' + objid);
            setLoading(false);            
            let objET = {
              operation: 'added',
              row: {
                objectId: objid,
                owner: Exptype.owner,
                name: Exptype.name,
                description: Exptype.description,
                price: parseFloat(Exptype.price)
              }
            };            
            DataHandler.setExpenditureType(objET);
            postAndClear();            
            return true;
            }, 
            (error) => {
            // Save fails
            //alert('Failed to create new object, with error code: ' + error.message);
            console.log('Failed to create new object, with error code: ' + error.message);
            return false;
          }).then( (res) => { if(res === true) { goBackHandler(); } } )
      }
    }
    
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
          <Text>Owner</Text>
          <TextInput
            placeholder={'Owner'}          
            style={styles.input}            
            value={ Exptype.owner }
            editable={false}
          />
          <Text>Expenditure Type Name</Text>
          <TextInput
            placeholder={'Name'}
            onChangeText={(value) => onChangeName(value)}
            style={styles.input}
          />
          <Text>Expenditure Type Description</Text>
          <TextInput
            placeholder={'Description'}
            onChangeText={(value) => onChangeDescription(value)}
            style={styles.input}
          />
          <Text>Expenditure Type Price</Text>
          <TextInput
            placeholder={'Price'}
            onChangeText={(value) => onChangePrice(value)}
            style={styles.input}
          />

          {!!nameError && (
            <View styles={styles.divError}>
              <Text style={styles.divErrorFont}>{nameError}</Text>
            </View>
          )}
  
          <TouchableOpacity onPress={ () => saveData() }>            
            <View style={{ backgroundColor: 'blue', padding: 10, margin: 10 }}>
              <Text style={{ color: 'white', textAlign: 'center' }}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={ () => goBackHandler() }>
            <View style={{ backgroundColor: 'orange', padding: 10, margin: 10 }}>
              <Text style={{ color: 'white', textAlign: 'center' }}>
                Go Back
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
}  

export default AddExpType;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    padding: 8,
    margin: 15,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
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
});