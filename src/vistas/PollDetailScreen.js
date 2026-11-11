import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Platform } from 'react-native';

const API_URL = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.1.36:3000';

export default function PollDetailScreen({ route, navigation }) {
  const { poll, profileId } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/poll-details/${poll.id}`);
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error("Error al cargar comentarios", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await fetch(`${API_URL}/api/poll-comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId: poll.id, profileId, commentText: newComment })
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error("Error al enviar comentario", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón para volver */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Volver al feed</Text>
      </TouchableOpacity>

      {/* Tarjeta de la encuesta */}
      <View style={styles.pollCard}>
        <Text style={styles.preguntaCard}>{poll.question}</Text>
        <Text style={styles.categoriaCard}>Categoría: {poll.category || 'social'}</Text>
        <Text style={styles.autorCard}>Creado por: {poll.creator_alias}</Text>
      </View>

      <Text style={styles.title}>Comentarios</Text>

      {/* Caja para escribir comentario */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu respuesta..."
          placeholderTextColor="#888"
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista completa de comentarios */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.commentUser}>Usuario #{item.profile_id}:</Text>
            <Text style={styles.commentText}>{item.comment_text}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.textoVacio}>No hay comentarios todavía. ¡Sé el primero en opinar!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E292E', padding: 20 },
  backButton: { marginBottom: 15, alignSelf: 'flex-start' },
  backButtonText: { color: '#55E6C1', fontSize: 16, fontWeight: 'bold' },
  pollCard: { backgroundColor: 'rgba(46, 63, 71, 0.95)', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#3a4f59' },
  preguntaCard: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 6 },
  categoriaCard: { color: '#55E6C1', fontSize: 12, marginBottom: 4, fontStyle: 'italic' },
  autorCard: { color: '#a0b2b8', fontSize: 12 },
  title: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  inputContainer: { flexDirection: 'row', marginBottom: 15, alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#2E3F47', color: '#fff', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#3a4f59', fontSize: 14 },
  sendButton: { backgroundColor: '#55E6C1', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  sendText: { color: '#1E292E', fontWeight: 'bold' },
  commentItem: { backgroundColor: '#2E3F47', padding: 10, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#3a4f59' },
  commentUser: { color: '#55E6C1', fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  commentText: { color: '#fff', fontSize: 14 },
  textoVacio: { color: '#A0AAB2', fontStyle: 'italic', textAlign: 'center', marginTop: 20 }
});