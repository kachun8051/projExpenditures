// import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { createStackNavigator } from '@react-navigation/stack';
//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LogInScreen from '../screens/LogInScreen';
import RestorePasswordScreen from '../screens/RestorePasswordScreen';

import PrivateScreen from '../screens/PrivateScreen';

import ExptypesScreen from '../exptypescreens/ExptypesScreen';
import AddExptype from '../exptypescreens/AddExptype';

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
          ( { route, navigation } ) => ({
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
// export { MyHomeStack, MyLogInStack, MySignUpStack, MyRestorePasswordStack }

const Tab = createBottomTabNavigator();

const MyBottomTab = () => {
  return (
    <Tab.Navigator backBehavior="history">
      <Tab.Screen 
        name="Auth" 
        component={MyAuthStack}        
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}           
      />
      <Tab.Screen 
          name="PrivateArea" 
          component={MyPrivateStack}
          options={{
            tabBarLabel: 'Private Area',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }} 
        />
      <Tab.Screen 
          name="JobTypeArea" 
          component={MyExpTypeStack}
          options={{
            tabBarLabel: 'Job Type Area',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }} 
        />
    </Tab.Navigator>
  );
}

const NewTab = createMaterialBottomTabNavigator();

const MyBottomNewTab = () => {
  return (
    <NewTab.Navigator backBehavior="history">
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
          name="PrivateArea" 
          component={MyPrivateStack}
          options={{
            tabBarLabel: 'Private Area',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }} 
        />
      <NewTab.Screen 
          name="JobTypeArea" 
          component={MyExpTypeStack}
          options={{
            tabBarLabel: 'Job Type Area',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }} 
        />
    </NewTab.Navigator>
  );
}

export { MyBottomNewTab, MyBottomTab };

