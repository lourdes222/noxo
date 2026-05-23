import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ConfigScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      <Text>Acá se encuentra el centro de configuración.</Text>
    </View>
  );
};

export default ConfigScreen;

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