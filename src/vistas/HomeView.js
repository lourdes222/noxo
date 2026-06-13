import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeView = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>N O X O</Text>
      <Text style={styles.subtitle}>Bienvenido a NOXO.</Text>
    </View>
  );
};

export default HomeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E292E',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#55E6C1',
    marginBottom: 15,
    letterSpacing:2,
  },
  subtitle:{
    fontSize:16,
    color:'#FFFFF'
  }
});