// import React in our code
import React, { useState, useContext, useEffect, useFocusEffect } from 'react';

// import all the components we are going to use
import { SafeAreaView, Text, View, StyleSheet, Dimensions, ScrollView, Button } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
//import React Native chart Kit for different kind of Chart
import { PieChart, } from 'react-native-chart-kit';

// Custom Context API
import { MyContext } from '../globalstates/MyModule';

import { Parse } from 'parse/react-native';
// Use custom functions 
import { getDate4Shown, } from "../globalstates/MyDateTime";

//expo install react-native-chart-kit
//expo install react-native-svg

const StatisticScreen = ( {navigation} ) => {
  
  // get username variable and expenditure type from context i.e. global variable
  const { key_username, key_exptype } = useContext(MyContext);
  const [ globalUsername, setGlobalUsername ] = key_username;
  const [ loading, setLoading ] = useState(true);

  const [ExpDate, setExpDate ] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const lstColor = [
    'rgba(82, 215, 38, 1)', 'rgba(255, 236, 0, 1)', 'rgba(255, 115, 0, 1)',
    'rgba(255, 0, 0, 1)', 'rgba(0, 126, 214, 1)', 'rgba(124, 221, 221, 1)'
  ];
  const [chartData, setChartData] = useState([]);

  // converter convert the queried result (i.e., list of object) to chartData for display
  function converter(queriedResult) {
    let len = queriedResult.length;
    let lstTmp = [];
    for(let i = 0; i<len; i++){
      let obj = {
        id: i,
        name: queriedResult[i].objectId.category,
        amount: queriedResult[i].subtotal,
        color: lstColor[i%lstColor.length],
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      }
      lstTmp.push(obj);
    }
    setChartData(lstTmp);
  }

  const QueryStat = async() => {
    // Create our Parse.Query instance so methods can be chained
    // Reading parse objects is done by using Parse.Query
    const parseQuery = new Parse.Query('Expenditure');

    // add a month
    //const dtTarget1 = new Date('2022/09/01');
    //const dtTarget2 = new Date('2022/09/01');
    //dtTarget2.setMonth(dtTarget2.getMonth()+1);

    // add a day
    let dtTarget_1 = new Date(ExpDate.getFullYear(), ExpDate.getMonth(), ExpDate.getDate(), 0, 0, 0); // new Date(ExpDate); // ExpDate is in format yyyy/MM/dd
    // make the Time as 00:00:00
    //dtTarget_1.setHours(0, 0, 0, 0);
    let dtTarget_2 = new Date(ExpDate.getFullYear(), ExpDate.getMonth(), ExpDate.getDate(), 0, 0, 0);
    // make the Time as 00:00:00
    //dtTarget_2.setHours(0, 0, 0, 0);
    dtTarget_2.setDate(dtTarget_2.getDate()+1);

    // console.log("parseQuery(1): " +  JSON.stringify(parseQuery));
    // pipeline is an aggregate function's parameter
    const pipeline = {
      match: {
        paymentdt: { $gte: dtTarget_1, $lt: dtTarget_2 },
        owner: globalUsername
      },
      group: {
        objectId: { "category" :"$category"},
        subtotal: { $sum: '$price' }, // 'subtotal' will be a created field to hold the sum of price field
      },
    };
    console.log("parseQuery(2): " +  JSON.stringify(parseQuery));
    // Notice that 'subtotal' is just arbitrary names, and could be anything you want

    try {
      // results[0] should contain 'subtotal' as attribute
      // You can access them like this: results[0].subtotal
      const results = await parseQuery.aggregate(pipeline);
      console.log(`Aggregated results: ${JSON.stringify(results)}`);
      converter(results);
      setLoading(false);
      return true;
    } catch (error) {
      console.log(`Error: ${error}`);
      setLoading(true);
      return false;
    }  
  }; 
    
  // useEffect detect the ExpDate is updated 
  useEffect(() => {
    console.log('updated ExpDate:', ExpDate)
    //QueryExp();
    QueryStat();
  }, [ExpDate])
  // trigger when screen got focus
  // reference: https://reactnavigation.org/docs/function-after-focusing-screen/
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Statistic Screen is focused');
      // The screen is focused
      // Call any action
      setExpDate(new Date());
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, []);

  const MyPieChart = () => {
    return (
      <>
        <Text style={styles.header}>Expenditure (Pie Chart)</Text>
        <Button style={styles.button} title='Date' color='green' onPress={() => { setShowDatePicker(true) }} />
                {
                  showDatePicker && (
                    <RNDateTimePicker
                      value={ExpDate}
                      mode='date'
                      onChange={(event, date) => {
                        setShowDatePicker(false);
                        //date.setHours(0,0,0,0);
                        setExpDate(date);
                        // trigger useEffect
                        //QueryStat();
                      }}
                    />)
                }
        <Text style={styles.textBox}>{getDate4Shown(ExpDate)}</Text>
        <PieChart
          data={chartData}
          width={Dimensions.get('window').width - 16}
          height={250}
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#efefef',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute //for the absolute number remove if you want percentage
        />
        <Button style={styles.button} title='Refresh' color='orange' onPress={() => { QueryStat() }} />
      </>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          Data is loading ...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View style={styles.container}>
          <View>              
            {/*Example of Pie Chart*/}
            <MyPieChart />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default StatisticScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 10,
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    padding: 16,
    marginTop: 16,
  },
});