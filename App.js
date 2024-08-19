import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import Parse from 'parse/react-native.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';


import Home from './components/Home';
import ExibirCaminho from './components/ExibirCaminho';
import ListarRotas from './components/ListarRotas';

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize('mztd62TNdIWwMtKqgZX8XPAs8nVjNkKWAzEBPQN3', 'bjkBkYiEaKV8i3PKbGZhukYfF4HzPIzlIyqAj4P7');
Parse.serverURL = 'https://parseapi.back4app.com/';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1C1C1C',
          height: 50,
        },
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#00FF00',
        tabBarInactiveTintColor: '#CCCCCC',
        headerStyle: {
          backgroundColor: '#1C1C1C',
        },
        headerTintColor: '#FFFFFF',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ) 
        }} 
      />
      <Tab.Screen 
        name="ExibirCaminho" 
        component={ExibirCaminho} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="car" size={size} color={color} />
          ) 
        }} 
      />
      <Tab.Screen 
        name="ListarRotas" 
        component={ListarRotas} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="bars" size={size} color={color} />
          ) 
        }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Tabs"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Tabs" component={MyTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
