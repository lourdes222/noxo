import React, { useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from './UserContext';

const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:3000' 
  : 'http://192.168.1.36:3000';

export default function MisEncuestasScreen() {
  const { profileId, userAlias } = useContext(UserContext);
  const [misEncuestas, setMisEncuestas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarMisEncuestas = async () => {
    try {
      setCargando(true);
      const response = await fetch(`${API_URL}/api/polls`);
      const data = await response.json();
      
      if (response.ok && Array.isArray(data)) {
        const filtradas = data.filter(enc => 
          (profileId && enc.creator_profile_id === profileId) || 
          (userAlias && enc.creator_alias === userAlias)
        );
        setMisEncuestas(filtradas);
      }
    } catch (error) {
      console.log('Error al obtener mis encuestas:', error);
    } finally {
      setCargando(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      cargarMisEncuestas();
    }, [profileId, userAlias])
  );

  if (cargando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#55E6C1" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Encuestas Creadas</Text>
      
      {misEncuestas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Todavía no creaste ninguna encuesta.</Text>
        </View>
      ) : (
        <FlatList
          data={misEncuestas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.pregunta}>{item.question}</Text>
              <Text style={styles.fecha}>Creado por: {item.creator_alias || 'Anónimo'}</Text>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E292E',
    padding: 20,
  },
  center: {
    flex: 1,
    backgroundColor: '#1E292E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    color: '#55E6C1',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#25333A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2E3F47',
  },
  pregunta: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  fecha: {
    color: '#A0AAB2',
    fontSize: 12,
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#A0AAB2',
    fontSize: 15,
    fontStyle: 'italic',
  },
});