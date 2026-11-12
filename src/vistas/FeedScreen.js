import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Platform } from 'react-native';
import { UserContext } from './UserContext';

const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:3000' 
  : 'http://192.168.1.36:3000';

export default function FeedTematicoScreen() {
  const [categoriaActiva, setCategoriaActiva] = useState('social');
  const [pollsList, setPollsList] = useState([]);

  const categorias = [
    { id: 'todas', nombre: '✨ Todas' },
    { id: 'terror', nombre: '👻 Terror' },
    { id: 'series', nombre: '📺 Series' },
    { id: 'musica', nombre: '🎵 Música' },
    { id: 'gaming', nombre: '🎮 Gaming' },
    { id: 'anime', nombre: '⚔️ Anime' },
    { id: 'comida', nombre: '🍔 Comida' },
    { id: 'viajes', nombre: '✈️ Viajes' },
    { id: 'moda', nombre: '👗 Moda' },
    { id: 'social', nombre: '😂 Social' },
    { id: 'estudios', nombre: '📚 Estudios' },
  ];

  useEffect(() => {
    fetch(`${API_URL}/api/polls`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPollsList(data);
      })
      .catch(err => console.log('Error:', err));
  }, []);

  // Filtramos las encuestas según la categoría elegida arriba
  const encuestasFiltradas = categoriaActiva === 'todas'
    ? pollsList
    : pollsList.filter(item => (item.category || 'social') === categoriaActiva);

  return (
    <View style={styles.container}>
      <View style={styles.barraContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollBarra}>
          {categorias.map(cat => {
            const seleccionado = categoriaActiva === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, seleccionado && styles.chipSeleccionado]}
                onPress={() => setCategoriaActiva(cat.id)}
              >
                <Text style={[styles.chipText, seleccionado && styles.chipTextSeleccionado]}>
                  {cat.nombre}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={encuestasFiltradas}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.pregunta}>{item.question}</Text>
            <Text style={styles.categoriaCard}>Categoría: {item.category || 'social'}</Text>
            <Text style={styles.autor}>Creado por: {item.creator_alias}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.vacio}>No hay encuestas en esta categoría todavía. ¡Sé el primero en crear una!</Text>
        }
        contentContainerStyle={styles.listaContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E292E' },
  barraContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2E3F47',
    backgroundColor: '#161F23',
    width: '100%',
    zIndex: 10,
  },
  scrollBarra: { paddingHorizontal: 15 },
  chip: {
    backgroundColor: '#25333A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3a4f59',
  },
  chipSeleccionado: {
    backgroundColor: '#55E6C1',
    borderColor: '#55E6C1',
  },
  chipText: { color: '#A0AAB2', fontSize: 14, fontWeight: '600' },
  chipTextSeleccionado: { color: '#1E292E', fontWeight: 'bold' },
  listaContent: { padding: 20 },
  card: {
    backgroundColor: '#25333A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a4f59',
  },
  pregunta: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginBottom: 6 },
  categoriaCard: { color: '#55E6C1', fontSize: 12, marginBottom: 4, fontStyle: 'italic' },
  autor: { color: '#a0b2b8', fontSize: 12 },
  vacio: { color: '#A0AAB2', textAlign: 'center', marginTop: 40, fontStyle: 'italic' }
});