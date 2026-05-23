import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeView = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio</Text>
      <Text>Bienvenido a la pantalla principal.</Text>
    </View>
  );
};

export default HomeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
});