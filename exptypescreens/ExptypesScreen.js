import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, } from 'react-native';
import { Alert } from 'react-native';
import { useContext } from 'react';
import { Parse } from 'parse/react-native';
import {MaterialIcons} from '@expo/vector-icons';

// Custom Context API
import { MyContext } from '../globalstates/MyModule';
// Use global variable
import DataHandler from "../globalstates/DataHandler";

const ExptypesScreen = ( { route, navigation } ) => {

    // State variable
    const [ queryResults, setQueryResults ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    // get username variable and expenditure type from context i.e. global variable
    const { key_username, key_exptype } = useContext(MyContext);
    const [ globalUsername, setGlobalUsername ] = key_username;
    // const [ globalExptype, setGlobalExptype ] = key_exptype;
    
    const addExpType = (newExpType) => {    
      //newComment.key = Math.random().toString();
      setQueryResults( (currExpType) => {
        return [ newExpType, ...currExpType ];
      } );
      //setModalOpen(false);
    }

    // convert the data from back4app to list of expenditure type object
    function converter(queriedStr){
      if (queriedStr === undefined || queriedStr === null || queriedStr === '' ){
        console.log("input queried string: " + queriedStr);
        setQueryResults([]);
      } 
      else {
        try {
          let lstQueried = JSON.parse(queriedStr);
          let len = lstQueried.length;
          console.log("length(1): " + len);
          let lstQuery = [];
          for (let i=0; i<len; i++){
            console.log(i + ": " + lstQueried[i].objectId); 
            let entry = {
              'objectId': lstQueried[i].objectId,
              'owner': lstQueried[i].owner,
              'name': lstQueried[i].name,
              'description': lstQueried[i].description,
              'price': lstQueried[i].price
            } 
            lstQuery.push(entry);
          }
          let json = JSON.stringify(lstQuery);
          //let lstRectified = json.json();
          console.log("json: " + json);
          setQueryResults(lstQuery);
          console.log("length(2): " + lstQueried.length)
        }
        catch(err) {
          console.log("error: " + err);
          setQueryResults([]);  
        }
      }            
    }

    const QueryJobTypes = async() => {
        // Create our Parse.Query instance so methods can be chained
        // Reading parse objects is done by using Parse.Query
        const parseQuery = new Parse.Query('JobTypes');
        // let json = await response.json();
        console.log("parseQuery: " +  JSON.stringify(parseQuery));        
        parseQuery._addCondition('owner', '$eq', globalUsername);
    
        try {
          let jobtypes = await parseQuery.find();
          let jsonString = JSON.stringify(jobtypes);
          console.log("jobtypes: " + jsonString);
          converter(jsonString);  
          setLoading(false);        
          return true;
        } catch (error) {
          // Error can be caused by lack of Internet connection
          Alert.alert('Error!', error.message);
          console.log('Error!' + error.message);
          setLoading(true);
          return false;
        }
    };
    // Similiar to componentDidMount
    useState(
      async() => {
        console.log('JobtypesScreen.useState');
        await QueryJobTypes();
      }, []
    );
    
    useEffect(
      () => {
        const unsubscribe = navigation.addListener('focus', 
          () => {
            console.log('Refreshed (ExptypesScreen)!');
            let objExpType = DataHandler.getExpenditureType();
            if (objExpType !== undefined && objExpType !== null ){
              console.log("Method: " + objExpType.operation);
              switch (objExpType.operation) {
                case 'added':
                  let objCloned = {
                    objectId: objExpType.row.objectId,
                    owner: objExpType.row.owner,
                    name: objExpType.row.name,
                    description: objExpType.row.description,
                    price: objExpType.row.price
                  };
                  addExpType(objCloned);
                  // reset the global variable
                  DataHandler.setExpenditureType(null);
              }
            } 
            /*
            if (globalExptype !== undefined && globalExptype !== null) {
              let method = globalExptype.operation;
              switch (method) {
                case 'added':
                  console.log('method: ' + method);
                  break;
                case 'deleted':
                  console.log('method: ' + method);
                  break;
                case 'updated':
                  console.log('method: ' + method);
                  break;
                default:
                  console.log('method: ' + method);
                  break;
              }
            }
            */
          }
        );
        return unsubscribe;
      }, 
      [navigation]
    );
    
    const renderItem = ({ item, index }) => {
        // console.log('item: ' + item);
        if (item === undefined || item === null) {
          return (
            <TouchableOpacity>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#ccc',
                  padding: 5,
                }}>
                <Text style={{ fontWeight: 'bold' }}>ABC</Text>
                <Text>DEF</Text>
              </View>
            </TouchableOpacity>  
          );
        } 
        else {
          return (
            <TouchableOpacity onPress={()=>navigation.navigate('Detail', {
              item: item
            })}>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#ccc',
                  padding: 5,
                }}>
                <Text style={{ fontWeight: 'bold' }}>{item['name']}</Text>
                <Text>{item['description']}</Text>
              </View>
            </TouchableOpacity>
          );
        }        
    };
    
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
      console.log("loading: " + loading);
      if (loading === false) {
        console.log("Length of data: " + queryResults.length);
        return (
          <View style={styles.container}>
            <MaterialIcons 
              name="add" size={24} style={styles.modalToggle} 
              onPress={ () => navigation.navigate('AddJobTypeStack') } />
            <FlatList
              data={queryResults}
              renderItem={renderItem}
              keyExtractor={(item) => item.objectId}
            />
          </View>
        );
      } 
      else {
        return (
          <View style={styles.container}>
            <Text style={styles.paragraph}>
              Data is loading ...
            </Text>
        </View>  
        );
      }      
    }
}

export default ExptypesScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
  });