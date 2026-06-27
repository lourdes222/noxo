import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
//import { Ionicons } from '@expo/vector-icons'; 

import HomeView from './src/vistas/HomeView';
import ConfigScreen from './src/vistas/ConfigScreen';
import LoginScreen from './src/vistas/Inicioses';

const Drawer = createDrawerNavigator(); 
const Tab = createBottomTabNavigator();

function MainTabs(){
  return(
    <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {backgroundColor: '#1E292E', height: 60},
      tabBarActiveTintColor: '#55E6C1',
      tabBarInactiveColor: '#A0A0A0',

      tabBarIcon: ({color, size})=>{
        let icon="home"
      }
      }}>
      <Tab.Screen name= "Inicio" component={HomeView}/>
      <Tab.Screen name="Ingresar" component={LoginScreen}/>
      <Tab.Screen name="Perfil" component={ProfileScreen}/>
    </Tab.Navigator>
  )
}

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text>Esta es la pantalla de perfil.</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerActiveTintColor: '#55E6C1',
          drawerInactiveTintColor: 'gray',
          drawerStyle:{
            backgroundColor: '#1E292E',
          },
          headerStyle:{
            backgroundColor: '#1E292E',
          },
          headerTintColor: '#55E6C1'
        }}>
        <Drawer.Screen
          name="Main"
          component={MainTabs}
          options={{ title: 'Inicio(Tabs)'}}
        />
        <Drawer.Screen
          name="Settings"
          component={ConfigScreen}
          options={{ title: 'Configuración'}}
        />
      </Drawer.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1E292E',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  texto:{
    color: '#FFFFFF'
  }
});
