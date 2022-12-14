import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Button } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Alert } from 'react-native';
import Constants from 'expo-constants';
import { useContext } from 'react';
import { Parse } from 'parse/react-native';
// import custom datetime object
import { getDateTimeToString, getDate4Shown, getNowAtZero } from '../globalstates/MyDateTime';

// Custom Context API
import { MyContext } from '../globalstates/MyModule';
// Use global variable
import DataHandler from "../globalstates/DataHandler";

const ExpScreen = ( { navigation } ) => {

  // get username variable and expenditure type from context i.e. global variable
  const { key_username, key_exptype } = useContext(MyContext);
  const [ globalUsername, setGlobalUsername ] = key_username;
  const [ loading, setLoading ] = useState(true);
  // State variable
  const [ queryResults, setQueryResults ] = useState(null);
  
  const [ExpDate, setExpDate ] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  console.log("ExpScreen loading ...");

  
  // add expenditure 
  const addExp = (newExp) => {    
    //newComment.key = Math.random().toString();
    setQueryResults( (currExp) => {
      return [ newExp, ...currExp ];
    } );
  }
  // remove an expenditure from the array
  const removeExpType = (_id) => {
    setQueryResults(current =>
      current.filter(obj => {
        // remove object that has id equal to 2
        return obj.objectId !== _id;
      }),
    );
  };
  // update an expenditure type from the array
  const updateExp = (newExp) => {
    setQueryResults(
      (currExp) => {
        const newState = currExp.map(
          obj => {
            // find by objectId
            if (obj.objectId === newExp.objectId) {
              return newExp;
            }
            // otherwise
            return obj;    
          }
        );  
        return newState;  
      }
    );
  }

  function converter(queriedStr){
    if (queriedStr === undefined || queriedStr === null || queriedStr === '' ){
      console.log("input queried string: " + queriedStr);
      setQueryResults([]);
    } 
    else {
      console.log("queried string: \n" + queriedStr);
      try {
        let lstQueried = JSON.parse(queriedStr);
        let len = lstQueried.length;
        console.log("length(1): " + len);
        let lstQuery = [];
        for (let i=0; i<len; i++){
          let dt_1 = getDateTimeToString(lstQueried[i].paymentdt);
          console.log(i + ": " + lstQueried[i].objectId); 
          console.log(i + ": " + dt_1); 
          let entry = {
            'objectId': lstQueried[i].objectId,
            'owner': lstQueried[i].owner,
            'payment': lstQueried[i].payment,
            'category': lstQueried[i].category,
            'description': lstQueried[i].description,
            'price': lstQueried[i].price,
            'paymentdt': dt_1
          } 
          lstQuery.push(entry);
        }
        let json = JSON.stringify(lstQuery);
        console.log("json: \n" + json);
        setQueryResults(lstQuery);
        console.log("length(2): " + lstQueried.length)
      }
      catch(err) {
        console.log("error: " + err);
        setQueryResults([]);  
      }
    }            
  }

  const QueryExp = async() => {
  // Create our Parse.Query instance so methods can be chained
  // Reading parse objects is done by using Parse.Query
  const parseQuery = new Parse.Query('Expenditure');
    // let json = await response.json();
    // ExpDate's data type is Date object
    console.log("parseQuery...");
    console.log("ExpDate.getDate(): " + ExpDate.getDate());
    let dtTarget1 = new Date(ExpDate.getFullYear(), ExpDate.getMonth(), ExpDate.getDate(), 0, 0, 0);    
    let dtTarget2 = new Date(ExpDate.getFullYear(), ExpDate.getMonth(), ExpDate.getDate(), 0, 0, 0);
    // add a day
    dtTarget2.setDate(dtTarget2.getDate()+1);
    console.log("dtTarget1: " + dtTarget1);
    console.log("dtTarget2: " + dtTarget2);
    console.log("parseQuery: " +  JSON.stringify(parseQuery));        
    parseQuery._addCondition('owner', '$eq', globalUsername);
    parseQuery._addCondition('paymentdt', '$gte', dtTarget1);
    parseQuery._addCondition('paymentdt', '$lt', dtTarget2);
    //parseQuery._addCondition('category', '$eq', 'Breakfast');
    try {
      let exp = await parseQuery.find();
      let jsonString = JSON.stringify(exp);
      console.log("exp: " + jsonString);
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
      console.log('expScreen.useState');
      await QueryExp();
    }, []
  );
  // useEffect detect the ExpDate is updated 
  useEffect(() => {
    console.log('updated ExpDate:', ExpDate)
    QueryExp();
  }, [ExpDate])

  // useEffect detect the navigation is updated i.e., when page is loaded
  useEffect(
    () => {
      const unsubscribe = navigation.addListener('focus', 
        () => {
          console.log('Refreshed (ExpScreen)!');
          let objExp = DataHandler.getExpenditure();
              if (typeof objExp !== 'undefined' && objExp !== null ){
                let Method_1 = objExp.operation;
                let ObjId_1 = objExp.row.objectId;
                console.log("Method: " + Method_1);
                console.log("ObjectId: " + ObjId_1);
                switch (objExp.operation) {
                  case 'added':
                    console.log("added - paymentdt: \n" + objExp.row.paymentdt);
                    let objCloned = {
                      objectId: ObjId_1,
                      owner: objExp.row.owner,
                      payment: objExp.row.payment,
                      category: objExp.row.category,
                      description: objExp.row.description,
                      price: objExp.row.price,
                      paymentdt: objExp.row.paymentdt
                    };
                    console.log("added with objectId: " + ObjId_1);
                    addExp(objCloned);
                    // reset the global variable
                    DataHandler.setExpenditure(null);
                    break;
                  case 'updated':
                    let objCloned2 = {
                      objectId: ObjId_1,
                      owner: objExp.row.owner,
                      payment: objExp.row.payment,
                      category: objExp.row.category,
                      description: objExp.row.description,
                      price: objExp.row.price,
                      paymentdt: objExp.row.paymentdt
                    };
                    console.log("updating objectId: " + ObjId_1);
                    updateExp(objCloned2);
                    // reset the global variable
                    DataHandler.setExpenditure(null);
                    break;
                  case 'deleted':
                    console.log("deleting objectId: " + ObjId_1);
                    removeExpType(objExp.row.objectId);
                    // reset the global variable
                    DataHandler.setExpenditure(null);
                    break;
                  default:
                    console.log('ExpScreen - Error');
                }
              }
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
            <Text style={{ fontWeight: 'bold' }}>Undefined</Text>
            <Text>Expenditure</Text>
          </View>
        </TouchableOpacity>  
      );
    } 
    else {
      return (
        <TouchableOpacity onPress={          
          () =>
            navigation.navigate('ExpArea', {
              screen: 'DeleteUpdateExpStack',
              params: { row: item },
            })              
        }>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
              padding: 5,
            }}>
            <Text style={{ fontWeight: 'bold' }}>Category: {item['category']}</Text>
            <Text>Payment Method: { item['payment'] }</Text>
            <Text>Payment At: { item['paymentdt'] }</Text>
            <Text>Description: { item['description'] }</Text>
            <Text>Amount: HK${ item['price'] }</Text>
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
      //console.log("Length of data: " + queryResults.length);
      return (
        <View style={styles.container}>
          <Text style={styles.header}>Expenditure</Text>
          <Button style={styles.button} title='Date' color='green' onPress={() => { setShowDatePicker(true) }} />
            {
              showDatePicker && (
                <RNDateTimePicker
                  value={ExpDate}
                  mode='date'
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    date.setHours(0, 0, 0, 0);
                    console.log("onChange: " + date);
                    setExpDate(date);
                    // trigger useEffect
                    //QueryExp();
                  }} />)
            }
          <Text style={styles.textBox}>Query Expenditures at: { getDate4Shown(ExpDate) }</Text>
          {loading ? <ActivityIndicator /> : null}            
          <FlatList
            data={queryResults}
            renderItem={renderItem}
            keyExtractor={(item) => item.objectId}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={QueryExp} />
            } />
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

export default ExpScreen;

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
  header: {
    textAlign: 'center',
    fontSize: 18,
    padding: 16
  },
});