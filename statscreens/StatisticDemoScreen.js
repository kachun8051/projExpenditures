// import React in our code
import React, { useState, useContext, useEffect } from 'react';

// import all the components we are going to use
import { SafeAreaView, Text, View, StyleSheet, Dimensions, ScrollView, } from 'react-native';

//import React Native chart Kit for different kind of Chart
import { PieChart, } from 'react-native-chart-kit';

//expo install react-native-chart-kit
//expo install react-native-svg

  const StatisticDemoScreen = () => {

    const lstColor = [
        'rgba(82, 215, 38, 1)', 'rgba(255, 236, 0, 1)', 'rgba(255, 115, 0, 1)',
        'rgba(255, 0, 0, 1)', 'rgba(0, 126, 214, 1)', 'rgba(124, 221, 221, 1)'
    ];

    const [chartData, setChartData] = useState(
        [
            {
              id: 0,
              name: 'Seoul',
              population: 21500000,
              color: 'rgba(131, 167, 234, 1)',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              id: 1,
              name: 'Toronto',
              population: 2800000,
              color: '#F00',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              id: 2,
              name: 'New York',
              population: 8538000,
              color: '#ffffff',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              id: 3,
              name: 'Moscow',
              population: 11920000,
              color: 'rgb(0, 0, 255)',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
          ]
    );
    
    // update color to the lstColor
    const fillChartColor = () => {
        setChartData(
            (currEntry) => {
                const newState = currEntry.map(
                  obj => {
                    //obj.color = lstColor[(obj.id % 6)];
                    return {...obj, color: lstColor[(obj.id % 6)]};
                  }
                );  
                return newState;  
            }
        );
    }

    useEffect(() => {
        // Too many re-renders. React limits the number
        // of renders to prevent an infinite loop.
        // setCounter(counter + 1);
        fillChartColor();
    }, []);

    const MyPieChart = () => {
        return (
          <>
            <Text style={styles.header}>Pie Chart</Text>
            <PieChart
              data={chartData}
              width={Dimensions.get('window').width - 16}
              height={220}
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
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute //for the absolute number remove if you want percentage
            />
          </>
        );
      };
    
    //() => fillChartColor();

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
  };

  export default StatisticDemoScreen;

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