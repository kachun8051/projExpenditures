import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, } from 'react-native';

import { Parse } from 'parse/react-native';

// Use global variable
import DataHandler from "../globalstates/DataHandler";

// create a component
const DeleteUpdateExptype = ({ route, navigation }) => {
    // get the row entry by received route
    console.log('route: ' + JSON.stringify(route.params) );
    console.log('objectId: '+ route.params.row.objectId);
    console.log('owner: '+ route.params.row.owner);
    console.log('name: '+ route.params.row.name);
    console.log('description: '+ route.params.row.description);
    console.log('price: '+ route.params.row.price);
    // console.log(route.params.row.price);
    if (typeof route.params.row === 'undefined' || route.params.row === null ) {
      console.log("route.params.item is undefined!");
    }

    const [Exptype2, setExptype2] = useState({
        objectId: route.params.row.objectId, 
        owner: route.params.row.owner, 
        name: route.params.row.name, 
        description: route.params.row.description, 
        price: parseFloat(route.params.row.price),
      });
    
    const [ nameError, setNameError ] = useState(null);
    
    const goBackHandler = () => {
        navigation.goBack(null);
    }

    const postAndClear = () => {
        setExptype2({
          objectId: '',
          owner: '',
          name: '',
          description: '',
          price: -1
        });
        setNameError(null);
    }

    const onChangeName = (value) => {
        setExptype2({ ...Exptype2, name: value });
    };
  
    const onChangeDescription = (value) => {
        setExptype2({ ...Exptype2, description: value });
    };
  
    const onChangePrice = (value) => {
        setExptype2({ ...Exptype2, price: value });
    };

    const validateIt = () => {
        // object id is key (i.e., unique) of row entry
        if (Exptype2.objectId === undefined || Exptype2.objectId === null) {
          return false;
        }
        if (Exptype2.owner === undefined || Exptype2.name === undefined || Exptype2.description === undefined || Exptype2.price === undefined ) {
          return false;
        }
        if (isNaN(Exptype2.price)) {
          return false;
        }
        if (Exptype2.owner.trim() === '') {
          return false;
        } 
        if (Exptype2.name.trim() === '') {
          return false;
        }
        if (Exptype2.description.trim() === ''){
          return false;
        }
        if (Exptype2.price < 0){
          return false;
        }
        return true;
    }

    const readObject = async() => {
      //Reading your First Data Object from Back4App
      const query = new Parse.Query("ExpTypes");  
      try {
        const expType_1 = await query.get("0RCzoCSh2e");
        const name = expType_1.get("name");
        const prc = expType_1.get("price");  
        alert(`Name: ${name} price: ${prc}`);
      } catch (error) {
        alert(`Failed to retrieve the object, with error code: ${error.message}`);
      }
    }      
    // https://www.back4app.com/docs/react-native/parse-sdk/data-objects/react-native-crud-tutorial
    const removeData = async() => {
      // objectId is a key (i.e., unique) of row entry
      let o_id = String(Exptype2.objectId);
      console.log('Object id (removeData): ' + o_id);
      const exp = new Parse.Object('ExpTypes');
      exp.set('objectId', o_id);
      try{
        await exp.destroy();
        // The object was deleted from the Parse Cloud.
        let objExpType = {
          operation: 'deleted',
          row: { objectId: Exptype2.objectId }
        };            
        DataHandler.setExpenditureType(objExpType);
        postAndClear();
        return true;
      } catch (error) {
        // error is a Parse.Error with an error code and message.
        console.log('Failed to delete object, with error code: ' + error.message);
        return false;
      }

      const clsExpTypes = Parse.Object.extend("ExpTypes");
      let obj = new Parse.Object("SoccerPlayer"); //new clsExpTypes();
      let obj2 = obj.get('GbY5YajUqe');
      let json = JSON.stringify(obj2);
      console.log("json: " + json);
      return;
      // Retrieve the object by id            
      obj.get(String(Exptype2.objectId)).then(  
        (_exptype) => {
          // The object was retrieved successfully and it is ready to update.
          _exptype.destroy()
          .then(
            (_exptype2) => {
              // The object was deleted from the Parse Cloud.
              let objExpType = {
                operation: 'deleted',
                row: { objectId: Exptype2.objectId }
              };            
              DataHandler.setExpenditureType(objExpType);
              postAndClear();
              return true;
            },
            (error2) => {
              // The delete failed.
              // error is a Parse.Error with an error code and message.
              console.log('Failed to delete object, with error code: ' + error2.message);
              return false;
            }
          )
        },
        (error) => {
          // The object was NOT retrieved successfully.
          console.log('Failed to delete object, with error code: ' + error.message);
              return false;
        }
      ).then( (res) => { if(res === true) { goBackHandler(); } } )
    }

    const updateData2 = () => {
      const SoccerPlayers = Parse.Object.extend("SoccerPlayers");
      const soccerPlayers = new SoccerPlayers();

      // Retrieve the object by id
      return soccerPlayers.get("GbY5YajUqe")
        .then((player) => {
          // The object was retrieved successfully and it is ready to update.
          player.set("yearOfBirth", 1998);
          player.set("emailContact", "a.wed@domain.io");
          player.save();
          return true;
        }, (error) => {
        // The object was not retrieved successfully.
          return false;
        });
    }

    const updateData = async() => {
        if ( validateIt() === false ) {
            setNameError(`Fill the fields correctly.`);
            return false;
        } 
        else {
            // objectId is a key (i.e., unique) of row entry
            let o_id = Exptype2.objectId.toString();
            console.log('Object id: ' + o_id);
            if (typeof Exptype2 === 'undefined') {
              console.log("Exptype2 is undefined");
              return false;
            }
            let obj = new Parse.Object("ExpTypes");
            //const obj = new clsExpTypes();
            obj.set('objectId', o_id);
            // clsExpTypes.set
            obj.set("name", Exptype2.name);
            obj.set("description", Exptype2.description);
            obj.set("price", parseFloat(Exptype2.price));
            
            try {
              await obj.save();
              let objEType = {
                operation: 'updated',
                row: {
                  objectId: Exptype2.objectId,
                  owner: Exptype2.owner,
                  name: Exptype2.name,
                  description: Exptype2.description,
                  price: parseFloat(Exptype2.price)
                }
              };            
            DataHandler.setExpenditureType(objEType);
            postAndClear();
              Alert.alert('Success!', 'ExpTypes updated!');

              // Refresh todos list to remove this one
              //readTodos();
              return true;
            } catch (error) {
              // Error can be caused by lack of Internet connection
              Alert.alert('Error!', error.message);

              return false;
            };

            const objExpTypes = new clsExpTypes();
            if (typeof objExpTypes === 'undefined') {
              console.log('objExpTypes is undefined!');
              return false;
            }
            // Retrieve the object by id            
            objExpTypes.get(o_id).then(
                ( _exptype ) => {
                    // The object was retrieved successfully and it is ready to update.
                    _exptype.set("name", Exptype2.name);
                    _exptype.set("description", Exptype2.description);
                    _exptype.set("price", parseFloat(Exptype2.price));
                    _exptype.save();

                    let objEType = {
                        operation: 'updated',
                        row: {
                          objectId: Exptype2.objectId,
                          owner: Exptype2.owner,
                          name: Exptype2.name,
                          description: Exptype2.description,
                          price: parseFloat(Exptype2.price)
                        }
                      };            
                    DataHandler.setExpenditureType(objEType);
                    postAndClear();
                    return true;
                },
                ( error ) => {
                    // The object was not retrieved successfully.
                    console.log('Failed to update object, with error code: ' + error.message);
                    return false;
                }
            ).then( (res) => { if(res === true) { goBackHandler(); } } )
        }
    }

        
      return (        
        <View style={styles.container}>
          <Text>Owner</Text>
          <TextInput
            placeholder={'Owner'}          
            style={styles.input}            
            value={ Exptype2.owner }
            editable={false}
          />
          <Text>Expenditure Type Name</Text>
          <TextInput
            placeholder={'Name'}
            onChangeText={(value) => onChangeName(value)}
            value = {Exptype2.name}
            style={styles.input}
          />
          <Text>Expenditure Type Description</Text>
          <TextInput
            placeholder={'Description'}
            onChangeText={(value) => onChangeDescription(value)}
            value = {Exptype2.description}
            style={styles.input}
          />
          <Text>Expenditure Type Price</Text>
          <TextInput
            placeholder={'Price'}
            onChangeText={(value) => onChangePrice(value)}
            value = {Exptype2.price.toString()}
            style={styles.input}
          />

          {!!nameError && (
            <View styles={styles.divError}>
              <Text style={styles.divErrorFont}>{nameError}</Text>
            </View>
          )}
  
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={ 
                async() => { 
                  let res2 = await updateData();
                  if (res2 == true) {
                    goBackHandler();
                  } 
                } 
              }>
              <View style={{ backgroundColor: 'blue', padding: 10, margin: 10 }}>
                <Text style={{ color: 'white', textAlign: 'center' }}>Update</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={ 
                async() => {
                  let res = await removeData();
                  if (res == true) {
                    goBackHandler();
                  }
                }                 
              }>
              <View style={{ backgroundColor: 'red', padding: 10, margin: 10 }}>
                <Text style={{ color: 'white', textAlign: 'center' }}>Delete</Text>
              </View>
            </TouchableOpacity>
          
            <TouchableOpacity onPress={ () => goBackHandler() }>
              <View style={{ backgroundColor: 'orange', padding: 10, margin: 10 }}>
                <Text style={{ color: 'white', textAlign: 'center' }}>
                  Go Back
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={ () => readObject() }>
              <View style={{ backgroundColor: 'yellow', padding: 10, margin: 10 }}>
                <Text style={{ color: 'white', textAlign: 'center' }}>
                  Read Object
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    
}

export default DeleteUpdateExptype;

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