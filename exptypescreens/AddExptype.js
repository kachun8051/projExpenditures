import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, } from 'react-native';
import { Alert } from 'react-native';
//import { NavigationActions } from 'react-navigation';
import Constants from 'expo-constants';
import { Parse } from 'parse/react-native';

// Custom Context API
import { MyContext } from '../globalstates/MyModule';
// Use global variable
import DataHandler from "../globalstates/DataHandler";

function AddExpType( { route, navigation } ) {

    const [Jobtype, setJobtype] = useState({
      owner: '', name: '', description: '', price: -1,
    });
    const [ nameError, setNameError ] = useState(null);    
    const [loading, setLoading] = useState(false);
    // get username variable and expenditure type from context i.e. global variable
    const { key_username, key_exptype } = useContext(MyContext);
    const [ globalUsername, setGlobalUsername ] = key_username;
    //const [ globalExptype, setGlobalExptype ] = key_exptype;

    const goBackHandler = () => {
      navigation.goBack(null);
    }

    useState(
      () => {
        console.log('useState');
        console.log('globalUsername: ' + globalUsername);
        setJobtype({ ...Jobtype, owner: globalUsername });
      }, []
    );

    const postAndClear = () => {
      setJobtype({
        owner: '',
        name: '',
        description: '',
        price: -1
      });
      setNameError(null);
      setLoading(false);
    }

    const onChangeName = (value) => {
      setJobtype({ ...Jobtype, name: value });
    };

    const onChangeDescription = (value) => {
      setJobtype({ ...Jobtype, description: value });
    };

    const onChangePrice = (value) => {
      setJobtype({ ...Jobtype, price: value });
    };
    
    const validateIt = () => {
      if (Jobtype.owner === undefined || Jobtype.name === undefined || Jobtype.description === undefined || Jobtype.price === undefined ) {
        return false;
      }
      if (isNaN(Jobtype.price)) {
        return false;
      }
      if (Jobtype.owner.trim() === '') {
        return false;
      } 
      if (Jobtype.name.trim() === '') {
        return false;
      }
      if (Jobtype.description.trim() === ''){
        return false;
      }
      if (Jobtype.price < 0){
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
        const clsJobTypes = Parse.Object.extend("JobTypes");
        const objJobTypes = new clsJobTypes();

        objJobTypes.set("owner", Jobtype.owner);
        objJobTypes.set("name", Jobtype.name);
        objJobTypes.set("description", Jobtype.description);
        objJobTypes.set("price", Jobtype.price);

        return objJobTypes.save()
          .then((_jobtype) => {
            // object id is unique and key for flatlist
            let objid = _jobtype.id;

            setLoading(false);
            
            let objExpType = {
              operation: 'added',
              row: {
                objectId: objid,
                owner: Jobtype.owner,
                name: Jobtype.name,
                description: Jobtype.description,
                price: parseFloat(Jobtype.price)
              }
            };            
            DataHandler.setExpenditureType(objExpType);
            postAndClear();
            // Success
            //alert('New object created with objectId: ' + _jobtype.id);
            console.log('New object created with objectId: ' + _jobtype.id);
            //navigation.navigate('JobTypeStack');
            //navigation.goBack(null);
            //goBackHandler();
            return true;
          }, (error) => {
            // Save fails
            //alert('Failed to create new object, with error code: ' + error.message);
            console.log('Failed to create new object, with error code: ' + error.message);
            return false;
          }).then( (res) => { if(res === true) { goBackHandler(); } } )
      }
    }
    //return (<View><Text>ABC</Text></View>);
    //setGlobalUsername('Wong Ka Chun');
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
            value={ Jobtype.owner }
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