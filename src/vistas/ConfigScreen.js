import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ConfigScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.tituloSeleccion}> Privacidad</Text>
      <View style={styles.card}>
        <Text style={styles.label}> Correo electrónico:</Text>
        <Text style={styles.valor}> tucorreo@gmail.com</Text>
        <Text style={styles.label}> Contraseña:</Text>
        <Text style={styles.valor}> ********</Text>
      </View>
      <Text style={styles.tituloSeleccion}> Encuestas hechas</Text>
      <View style={styles.card}>
        <Text style={styles.encuesta}> ¿Te gustó la aplicación?</Text>
        <Text style={styles.encuesta}> ¿Recomendarías la aplicación a otros?</Text>
        <Text style={styles.encuesta}> ¿Cómo calificarías la atención?</Text>
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
  tituloSeleccion: {
    color: '#55E6C1',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#25333A',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
},
  label: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 5,
},
valor: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  fontWeight: '600',
},
  encuesta: {
    color: '#FFFFFF',
    fontSize: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2E3F47',
  },

})