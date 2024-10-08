import 'react-native-get-random-values';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import Parse from 'parse/react-native.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from './components/Home';
import CadastrarCaminho from './components/CadastrarCaminho';
import ListarRotas from './components/ListarRotas';
import MapaRota from './components/MapaRota';

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
        name="CadastrarCaminho" 
        component={CadastrarCaminho} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <Feather name="map-pin" size={size} color={color} />
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
      <Tab.Screen 
        name="MapaRota" 
        component={MapaRota} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <Entypo name="map" size={size} color={color} />
          ),
          // Esconde a aba MapaRota
          tabBarButton: () => null,
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
