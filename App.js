import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import HomeView from './src/vistas/HomeView';
import ConfigScreen from './src/vistas/ConfigScreen';
import LoginScreen from './src/vistas/Inicioses';
import RegistroScreen from './src/vistas/Registro';
import ProfileScreen from './src/vistas/ProfileScreen';
import MisEncuestasScreen from './src/vistas/MisEncuestasScreen';
import { UserProvider, UserContext } from './src/vistas/UserContext';
import CrearEnc from './src/vistas/CrearEnc';
import MisLikesScreen from './src/vistas/MisLikesScreen';
import MisComentariosScreen from './src/vistas/MisComentariosScreen';
import AyudaScreen from './src/vistas/AyudaScreen';
import ChatScreen from './src/vistas/ChatScreen';
import WelcomeScreen from './src/vistas/WelcomeScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function PerfilStack() {
  const { userAlias } = useContext(UserContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userAlias ? (
        <Stack.Screen name="Profile" component={ProfileScreen} />
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registro" component={RegistroScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1E292E', height: 60 },
        tabBarActiveTintColor: '#55E6C1',
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home-outline';
          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Crear') {
            iconName = 'add-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Inicio" component={HomeView} />
      <Tab.Screen name="Crear" component={CrearEnc} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            drawerActiveTintColor: '#55E6C1',
            drawerInactiveTintColor: 'gray',
            drawerStyle: { backgroundColor: '#1E292E' },
            headerStyle: { backgroundColor: '#1E292E' },
            headerTintColor: '#55E6C1',
          }}>
          <Drawer.Screen
            name="Main"
            component={MainTabs}
            options={{ title: 'Inicio' }}
          />
          <Drawer.Screen
            name="MiPerfil"
            component={PerfilStack}
            options={{ title: 'Mi Perfil' }}
          />
          <Drawer.Screen
            name="MisEncuestas"
            component={MisEncuestasScreen}
            options={{ title: 'Mis Encuestas' }}
          />
          <Drawer.Screen
            name="MisLikes"
            component={MisLikesScreen}
            options={{ title: 'Mis Me gusta' }}
          />
          <Drawer.Screen
            name="MisComentarios"
            component={MisComentariosScreen}
            options={{ title: 'Mis Comentarios' }}
          />
          <Drawer.Screen
            name="Settings"
            component={ConfigScreen}
            options={{ title: 'Configuración' }}
          />
          <Drawer.Screen
            name="Ayuda"
            component={AyudaScreen}
            options={{ title: 'Información sobre NOXO' }}
          />
          <Drawer.Screen
            name="Chat"
            component={ChatScreen}
            options={{ drawerItemStyle: { display: 'none' } }}
          />
        </Drawer.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </UserProvider>
  );
}