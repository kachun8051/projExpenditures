// import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LogInScreen from '../screens/LogInScreen';
import RestorePasswordScreen from '../screens/RestorePasswordScreen';

import PrivateScreen from '../screens/PrivateScreen';

import ExptypesScreen from '../exptypescreens/ExptypesScreen';
import AddExptype from '../exptypescreens/AddExptype';
import DeleteUpdateExptype from '../exptypescreens/DeleteUpdateExptype';

import ExpScreen from '../expscreens/ExpScreen';
import AddExp from '../expscreens/AddExp';
import DeleteUpdateExp from '../expscreens/DeleteUpdateExp';

import StatisticDemoScreen from '../statscreens/StatisticDemoScreen';
import StatisticScreen from '../statscreens/StatisticScreen';

import 'react-native-gesture-handler';

const AuthStack = createStackNavigator();

const MyAuthStack = () => {
  return (
    <AuthStack.Navigator 
      initialRouteName={'LogInStack'}
      screenOptions={{
        headerShown: false
      }}>
      <AuthStack.Screen name="LogInStack" component={LogInScreen} />      
      <AuthStack.Screen name="HomeStack" component={HomeScreen} />  
      <AuthStack.Screen name="SignUpStack" component={SignUpScreen} />      
      <AuthStack.Screen name="RestorePasswordStack" component={RestorePasswordScreen} />
    </AuthStack.Navigator>
  );
}

AuthStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarVisible: false,
  tabBarOptions: { showLabel: false } 
};

const ExpStack = createStackNavigator();

const MyExpStack = () => {
  return (
    <ExpStack.Navigator    
      initialRouteName={'ExpStack'}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: 'blue',
        },
        headerTintColor: 'white',
      }}>
      <ExpStack.Screen 
        name="DeleteUpdateExpStack" 
        component={DeleteUpdateExp} 
        options={
            () => ({
              title: 'Delete/Update Expenditures',            
            })
        } 
      />
      <ExpStack.Screen 
        name="AddExpStack" 
        component={AddExp} 
        options={
          () => ({
            title: 'Add Expenditures',            
          })
        } 
      />    
      <ExpStack.Screen 
        name="ExpStack" 
        component={ExpScreen} 
        options={
          ( { navigation } ) => ({
            title: 'Expenditure',
            headerRight: () => (
              <Ionicons
                name={'ios-add-circle'}
                size={25}
                color={'white'}
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate('AddExpStack')}
              />
            )
          })
        } 
      />
    </ExpStack.Navigator>
  );  
}

ExpStack.navigationOptions = {
  tabBarLabel: 'Expenditure',
  tabBarVisible: true,
  tabBarOptions: { showLabel: true } 
};

const ExpTypeStack = createStackNavigator();

const MyExpTypeStack = () => {
  return (
    <ExpTypeStack.Navigator 
      initialRouteName={'ExpTypeStack'}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: 'blue',
        },
        headerTintColor: 'white',
      }}>
      <ExpTypeStack.Screen
        name="DeleteUpdateExpTypeStack" 
        component={DeleteUpdateExptype} 
        options={
          () => ({
            title: 'Delete/Update Expenditure Types',            
          })
        }
      />
      <ExpTypeStack.Screen 
        name="AddExpTypeStack" 
        component={AddExptype} 
        options={
          () => ({
            title: 'Add Expenditure Types',            
          })
        } 
      />
      <ExpTypeStack.Screen 
        name="ExpTypeStack" 
        component={ExptypesScreen} 
        options={
          ( { navigation } ) => ({
            title: 'Expenditure Types',
            headerRight: () => (
              <Ionicons
                name={'ios-add-circle'}
                size={25}
                color={'white'}
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate('AddExpTypeStack')}
              />
            )
          })
        } 
      />      
    </ExpTypeStack.Navigator>
  );
}

const PrivateStack = createStackNavigator();

const MyPrivateStack = () => {
  return (
    <PrivateStack.Navigator 
      initialRouteName={'PrivateStack'}
      screenOptions={{
        headerShown: false
      }}>
      <PrivateStack.Screen name="PrivateStack" component={PrivateScreen} />
    </PrivateStack.Navigator>
  );
}

PrivateStack.navigationOptions = {
  tabBarLabel: 'About',
  tabBarVisible: false,
  tabBarOptions: { showLabel: false }  
};

const StatisticStack = createStackNavigator();

const MyStatisticStack = () => {
  return (
    <StatisticStack.Navigator 
      initialRouteName={'StatisticStack'}
      screenOptions={{
      headerShown: false
    }}>      
      <StatisticStack.Screen name="StatisticScreen" component={StatisticScreen} />
    </StatisticStack.Navigator>
  );
}

const NewTab = createMaterialBottomTabNavigator();

const MyBottomNewTab = () => {
  return (
    <NewTab.Navigator>
      <NewTab.Screen 
        name="Auth" 
        component={MyAuthStack}        
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}           
      />      
      <NewTab.Screen 
          name="ExpTypeArea" 
          component={MyExpTypeStack}
          options={{
            tabBarLabel: 'Expenditure Type Area',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="view-dashboard-edit-outline" color={color} size={26} />
            ),
          }} 
      />
      <NewTab.Screen 
          name="ExpArea" 
          component={MyExpStack}
          options={{
            tabBarLabel: 'Expenditure Area',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="wallet" color={color} size={26} />
            ),
          }} 
      />
      <NewTab.Screen 
          name="StatisticArea" 
          component={MyStatisticStack}
          options={{
            tabBarLabel: 'Statistics Area',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="finance" color={color} size={26} />
            ),
          }} 
      />
    </NewTab.Navigator>
  );
}

export { MyBottomNewTab };

