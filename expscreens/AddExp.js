import React, { useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, Button, } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';
// Custom Context API
import { MyContext } from '../globalstates/MyModule';
import { Parse } from 'parse/react-native';
// Use global variable
import DataHandler from "../globalstates/DataHandler";
// Use custom functions 
import { getDate4Shown, getTime4Shown, getDateAndTimeToObject, getDateTimeToString } from "../globalstates/MyDateTime";

// create component 
function AddExp( { route, navigation } ) {

    // get username variable and expenditure type from context i.e. global variable
    const { key_username } = useContext(MyContext);
    const [ globalUsername, setGlobalUsername ] = key_username;
    const [ loading, setLoading ] = useState(true);
    // retrieved from Back4App's collection 
    const [ QueryTypes, setQueryTypes ] = useState(null);
    // used in "items" of dropdown picker (category)
    const [ lstQueryTypes, setLstQueryTypes ] = useState(null);
    // used in "value" of dropdown picker (category)
    const [ typeSelected, setTypeSelected ] = useState(null);
    // used in "open" of dropdown picker (category)
    const [ typeOpen, setTypeOpen ] = useState(false);

    // get the data source (i.e. json) 
    const lstPaymentMethod = require('../data/paymentmethod.json');
    // used in "items" of dropdown picker (paymentmethod) 
    const [paymentmethod, setPaymentMethod ] = useState(lstPaymentMethod);
    // used in "value" of dropdown picker (paymentmethod) 
    const [paymentSelected, setPaymentSelected ] = useState(null);
    // used in "open" of dropdown picker (paymentmethod)
    const [ paymentOpen, setPaymentOpen ] = useState(false);
    // the object of selected expenditure type
    const [ typeSelected2, setTypeSelected2 ] = useState(null);

    const [ExpDate, setExpDate ] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [ExpTime, setExpTime ] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    const postAndClear = () => {
      setLoading(true);
      setQueryTypes(null);
      setLstQueryTypes(null);
      setTypeSelected(null);
      setTypeOpen(false);
      setPaymentMethod([]);
      setPaymentOpen(false);
      setTypeSelected2(null);
      setShowDatePicker(false);
      setShowTimePicker(false);      
    }

    const onChangeDesc = (value) => {
      setTypeSelected2({ ...typeSelected2, description: value });
    };
    const onChangePrice = (value) => {
      setTypeSelected2({ ...typeSelected2, price: value });
    };

    const goBackHandler = () => {
      navigation.goBack(null);
    }
    
    const saveData = () => {
      const clsExp = Parse.Object.extend("Expenditure");
      const objExp = new clsExp();     
      // datetime_1 is Date object while datetime_2 is string
      let datetime_1 = getDateAndTimeToObject(ExpDate, ExpTime);
      let datetime_2 = getDate4Shown(datetime_1) + ' ' + getTime4Shown(datetime_1);
      console.log("datetime(1): " + datetime_1);
      console.log("datetime(2): " + datetime_2);
      objExp.set("owner", globalUsername);
      objExp.set("payment", paymentSelected);
      objExp.set("category", typeSelected);
      objExp.set("description", typeSelected2.description);
      objExp.set("price", parseFloat(typeSelected2.price));
      objExp.set("paymentdt", datetime_1);

      return objExp.save()
          .then(
            (_exp) => {
            // object id is unique and key for flatlist
            let objid = _exp.id;
            // Success
            //alert('New object created with objectId: ' + objid);
            console.log('New object (Expenditure) created with objectId: ' + objid);
            // setLoading(false);            
            let objE = {
              operation: 'added',
              row: {
                objectId: objid,
                owner: globalUsername,
                payment: paymentSelected,
                category: typeSelected,
                description: typeSelected2.description,
                price: parseFloat(typeSelected2.price),
                paymentdt: datetime_2
              }
            };            
            DataHandler.setExpenditure(objE);
            postAndClear();            
            return true;
            }, 
            (error) => {
            // Save fails
            //alert('Failed to create new object, with error code: ' + error.message);
            console.log('Failed to create new object(Expenditure), with error code: ' + error.message);
            return false;
          }).then( (res) => { if(res === true) { goBackHandler(); } } )
    }

    function findTypeByName(t_name) {
      let objfound = null;
      let len = QueryTypes.length;
      for (let i=0; i<len; i++){
        if (QueryTypes[i].name == t_name) {
          objfound = QueryTypes[i];
          break;
        }
      }
      return objfound;
    }

    // convert the data from back4app to list of expenditure type object
    function converter(queriedStr){
      console.log("converter...");
      if (queriedStr === undefined || queriedStr === null || queriedStr === '' ){
        console.log("input queried string: " + queriedStr);
        setLstQueryTypes([]);
        setQueryTypes([]);
      } 
      else {
        try {
          let lstQueried = JSON.parse(queriedStr);
          let len = lstQueried.length;
          console.log("length(1): " + len);
          let lstQuery = [];
          let lstQuery2 = [];
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
            let entry2 = {
              label: lstQueried[i].name, value: lstQueried[i].name
            }
            lstQuery2.push(entry2);
          }
          let json = JSON.stringify(lstQuery);
          console.log("json: " + json);
          setQueryTypes(lstQuery);
          setLstQueryTypes(lstQuery2);
          console.log("length(2): " + lstQueried.length)
        }
        catch(err) {
          console.log("error: " + err);
          setQueryTypes([]);
          setLstQueryTypes([]);  
        }
      }            
    }

    const QueryExpTypes = async() => {
      console.log("QueryExpTypes...");
      // Create our Parse.Query instance so methods can be chained
      // Reading parse objects is done by using Parse.Query
      const parseQuery = new Parse.Query('ExpTypes');
      // let json = await response.json();
      console.log("parseQuery: " +  JSON.stringify(parseQuery));        
      parseQuery._addCondition('owner', '$eq', globalUsername);
  
      try {
        let exptypes = await parseQuery.find();
        let jsonString = JSON.stringify(exptypes);
        console.log("exptypes: " + jsonString);
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
        console.log('AddExp.useState');
        await QueryExpTypes();
      }, []
    );

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
      if (loading === false) {
        return (          
          <View style={styles.container}>
              <Text style={styles.label}>Payment Method</Text>
              <>
                <DropDownPicker
                  style={{zIndex: 10}}
                  placeholder="Select payment method"
                  containerStyle={{height: 40}}
                  items={paymentmethod}                  
                  value={paymentSelected}                  
                  open={paymentOpen}
                  setOpen={setPaymentOpen}
                  setValue={setPaymentSelected}
                  onChangeItem={item => console.log(item.label, item.value)}
                />
              </>  
              <Text style={styles.label}>Category</Text>
              <>              
              <DropDownPicker
                  style={{zIndex: 9}}
                  placeholder="Select category"
                  containerStyle={{height: 40}}
                  items={lstQueryTypes}                  
                  value={typeSelected}                  
                  open={typeOpen}
                  setOpen={setTypeOpen}
                  setValue={setTypeSelected}
                  onSelectItem={(item) => {
                    console.log(item);
                    let obj_1 = findTypeByName(item.label);
                    if (typeof obj_1 != undefined) {
                      let objTmp = { description: obj_1.description, price: obj_1.price }
                      console.log(objTmp);
                      setTypeSelected2(objTmp);
                    } else {
                      setTypeSelected2(null);
                    }
                  }}                  
                />
              </>
              {
                typeSelected && 
                <View style={{marginTop: 15}}>
                  <TextInput 
                    placeholder={"description"}
                    style={styles.input}
                    value={typeSelected2.description}
                    onChangeText={ (value) => onChangeDesc(value) }
                  />
                  <TextInput
                    placeholder={"price"} 
                    style={styles.input} 
                    selectionColor={"#5188E3"}
                    value={ String(typeSelected2.price) }
                    onChangeText={ (value) => onChangePrice(value) } 
                  />
                </View>                                
              }
              <View>
                <Button style={styles.button} title='Date' color='green' onPress={() => { setShowDatePicker(true) }} />
                {
                  showDatePicker && (
                    <RNDateTimePicker
                      value={new Date()}
                      mode='date'
                      onChange={(event, date) => {
                        setShowDatePicker(false);
                        setExpDate(date);
                      }}
                    />)
                }
                <Text style={styles.textBox}>{getDate4Shown(ExpDate)}</Text>
                <Button style={styles.button} title='Time' color='green' onPress={() => { setShowTimePicker(true) }} />
                {
                  showTimePicker && (
                    <RNDateTimePicker
                      value={new Date()}
                      mode='time'
                      is24Hour={true}
                      onChange={(event, date) => {
                        setShowTimePicker(false);
                        setExpTime(date);
                      }}
                    />)
                }
                <Text style={styles.textBox}>{getTime4Shown(ExpTime)}</Text>
              </View>
              <TouchableOpacity onPress={ () => saveData() }>            
                <View style={{ backgroundColor: 'blue', padding: 10, margin: 10 }}>
                  <Text style={{ color: 'white', textAlign: 'center' }}>
                    Save
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
}

export default AddExp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    padding: 8,
    margin: 15,
    justifyContent: 'center'    
  },
  label: {
    marginBottom: 7,
    marginStart: 10,
    marginTop: 20
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
  },
  button: {
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