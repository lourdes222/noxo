import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';

import HomeView from './src/vistas/HomeView';
import ConfigScreen from './src/vistas/ConfigScreen';

const Drawer = createDrawerNavigator();

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
          drawerActiveTintColor: '#2f95dc',
          drawerInactiveTintColor: 'gray',
        }}
      >
        <Drawer.Screen
          name="Home"
          component={HomeView}
          options={{ title: 'Inicio' }}
        />
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Perfil' }}
        />
        <Drawer.Screen
          name="Settings"
          component={ConfigScreen}
          options={{ title: 'Configuración' }}
        />
      </Drawer.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
});
