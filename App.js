import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

import HomeView from './src/vistas/HomeView';
import ConfigScreen from './src/vistas/ConfigScreen';
import LoginScreen from './src/vistas/Inicioses';

const Drawer = createDrawerNavigator(); 
const Tab = createBottomTabNavigator();

function MainTabs(){
  return(
    <Tab.Navigator
    screenOptions={({route})=>({
      tabBarIcon: ({focused, color, size})=>{
        let iconName;
        if (route.name==='Home'){
          iconName= focused? 'home':'home-outline';
        }
        else if(route.name==='LoginTab'){
          iconName=focused? 'log-in': 'log-in-outline';
        }
        else if(route.name==='ProfileTab'){
          iconName=focused?'person': 'person-outline'
        }
        return <Ionicons name={iconName} size={size} color={color}/>;
      },
      tabBarActiveTintColor:'#55E6C1',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle:{
        backgroundColor: '#1E292E',
        borderTopColor: '#3A5A63',
        heigth: 60,
        paddingBottom: 8,
      },
      headerShown: false,
    })}>
      <Tab.Screen name="Home" component={HomeView} options={{title: 'Inicio'}}/>
      <Tab.SCreen name="LoginTab" component={LoginScreen} options={{title: 'Login'}}/>
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{title: 'Perfil'}}/>
    </Tab.Navigator>
  );
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
          name="Setttings"
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
    color: '#FFFFF'
  }
});
