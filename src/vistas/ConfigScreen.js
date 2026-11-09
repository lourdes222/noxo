import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { UserContext } from './UserContext';

export default function ConfigScreen() {
  const { userAlias } = useContext(UserContext);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.tituloHeader}>Configuración</Text>

      <Text style={styles.tituloSeleccion}>Privacidad y Cuenta</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Usuario / Alias:</Text>
        <Text style={styles.valor}>{userAlias ? `@${userAlias}` : 'No ha iniciado sesión'}</Text>
        
        <Text style={styles.label}>Correo electrónico:</Text>
        <Text style={styles.valor}>usuario@noxo.com</Text>
        
        <Text style={styles.label}>Contraseña:</Text>
        <Text style={styles.valor}>********</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E292E',
  },
  content: {
    padding: 20,
  },
  tituloHeader: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  tituloSeleccion: {
    color: '#55E6C1',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#25333A',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2E3F47',
  },
  label: {
    color: '#A0AAB2',
    fontSize: 13,
    marginBottom: 4,
  },
  valor: {
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 12,
    fontWeight: '600',
  },
});