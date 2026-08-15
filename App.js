import React, {useState, useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

import HomeView from './src/vistas/HomeView';
import ConfigScreen from './src/vistas/ConfigScreen';
import LoginScreen from './src/vistas/Inicioses';
import ProfileScreen from './src/vistas/ProfileScreen';
import { UserProvider, UserContext } from './src/vistas/UserContext';
import CrearEnc from './src/vistas/CrearEnc';
import ChatScreen from './src/vistas/ChatScreen';

const Drawer = createDrawerNavigator(); 
const Tab = createBottomTabNavigator();
function ProfileOrLogin(){
  const {userAlias} = useContext(UserContext);
  return userAlias ? <ProfileScreen /> : <LoginScreen />;
}
function MainTabs(){
  return(
    <Tab.Navigator
      screenOptions={({route})=>({
        headerShown: false,
        tabBarStyle: {backgroundColor: '#1E292E', height: 60},
        tabBarActiveTintColor: '#55E6C1',
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarIcon: ({focused, color, size})=>{
          let iconName = 'home-outline';
          if(route.name === 'Inicio'){
            iconName = focused ? 'home' : 'home-outline';
          } else if(route.name === 'Ingresar'){
            iconName = focused ? 'log-in' : 'log-in-outline';
          } else if (route.name === 'Crear') iconName = 'add-circle-outline';

          return (<Ionicons name={iconName} size={size} color={color} />);
        }
      })}>
      <Tab.Screen name="Inicio" component={HomeView} />
      <Tab.Screen name="Crear" component={CrearEnc}/>
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <UserProvider>
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
          options={{ title: 'Inicio'}}
        />
         <Drawer.Screen
          name="Login"
          component={ProfileOrLogin}
          options={{title: 'Mi Perfil'}}
        />
        <Drawer.Screen
          name="Settings"
          component={ConfigScreen}
          options={{ title: 'Configuración'}}
        />
        <Drawer.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            drawerItemStyle: {display: 'none'}
          }}/>
       
      </Drawer.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
    </UserProvider>
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
