import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

export default function PollInteraction({ pollId, profileId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [totalLikes, setTotalLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  
  const [mostrarComentarios, setMostrarComentarios] = useState(false);

  const fetchDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/poll-details/${pollId}`);
      const data = await response.json();
      setComments(data.comments);
      setTotalLikes(data.totalLikes);
    } catch (error) {
      console.error("Error cargando interacciones", error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [pollId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await fetch('http://localhost:3000/api/poll-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId, profileId, commentText: newComment })
      });
      setNewComment('');
      fetchDetails();
    } catch (error) {
      console.error("Error al comentar", error);
    }
  };

  const handleToggleLike = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/poll-like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId, profileId })
      });
      const data = await response.json();
      setHasLiked(data.liked);
      fetchDetails();
    } catch (error) {
      console.error("Error al dar like", error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.likeButton} onPress={handleToggleLike}>
          <Text style={styles.likeText}>❤️ {totalLikes} Me gusta</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.commentLink} 
          onPress={() => setMostrarComentarios(!mostrarComentarios)}
        >
          <Text style={styles.commentLinkText}>
            {mostrarComentarios ? '▲ Ocultar comentarios' : `💬 Comentarios (${comments.length})`}
          </Text>
        </TouchableOpacity>
      </View>

      {mostrarComentarios && (
        <View style={styles.desplegableContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un comentario..."
              placeholderTextColor="#888"
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
              <Text style={styles.sendText}>Enviar</Text>
            </TouchableOpacity>
          </View>

          {comments.length === 0 ? (
            <Text style={styles.textoVacio}>No hay comentarios todavía. ¡Sé el primero!</Text>
          ) : (
            comments.map((item) => (
              <View key={item.id.toString()} style={styles.commentItem}>
                <Text style={styles.commentUser}>Usuario #{item.profile_id}:</Text>
                <Text style={styles.commentText}>{item.comment_text}</Text>
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginTop: 10, 
    paddingTop: 8, 
    borderTopWidth: 1, 
    borderTopColor: '#3a4f59' 
  },
  actionRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  likeButton: { 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    backgroundColor: '#1E292E', 
    borderRadius: 15, 
    borderWidth: 1, 
    borderColor: '#3a4f59' 
  },
  likeText: { 
    color: '#ff5c5c', 
    fontWeight: 'bold', 
    fontSize: 13 
  },
  commentLink: { 
    paddingVertical: 6, 
    paddingHorizontal: 10 
  },
  commentLinkText: { 
    color: '#55E6C1', 
    fontSize: 13, 
    fontWeight: '600' 
  },
  desplegableContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(30, 41, 46, 0.6)',
    padding: 10,
    borderRadius: 8,
  },
  inputContainer: { 
    flexDirection: 'row', 
    marginBottom: 10, 
    alignItems: 'center' 
  },
  input: { 
    flex: 1, 
    backgroundColor: '#1E292E', 
    color: '#fff', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 20, 
    marginRight: 6, 
    fontSize: 13, 
    borderWidth: 1, 
    borderColor: '#3a4f59' 
  },
  sendButton: { 
    backgroundColor: '#55E6C1', 
    justifyContent: 'center', 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 20 
  },
  sendText: { 
    color: '#1E292E', 
    fontWeight: 'bold', 
    fontSize: 13 
  },
  commentItem: { 
    backgroundColor: '#1E292E', 
    padding: 8, 
    borderRadius: 8, 
    marginBottom: 6, 
    borderWidth: 1, 
    borderColor: '#2E3F47' 
  },
  commentUser: { 
    color: '#55E6C1', 
    fontSize: 11, 
    fontWeight: 'bold', 
    marginBottom: 2 
  },
  commentText: { 
    color: '#fff', 
    fontSize: 13 
  },
  textoVacio: { 
    color: '#A0AAB2', 
    fontSize: 12, 
    fontStyle: 'italic', 
    textAlign: 'center', 
    marginVertical: 5 
  }
});