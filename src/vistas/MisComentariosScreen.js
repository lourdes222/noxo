import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Platform } from 'react-native';
import { UserContext } from './UserContext';
import PollInteraction from './PollInteraction';

const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:3000' 
  : 'http://192.168.1.36:3000';

export default function MisComentariosScreen() {
    const [commentedPolls, setCommentedPolls] = useState([]);
    const { profileId } = useContext(UserContext);

    const cargarMisComentarios = async () => {
        if (!profileId) return;
        try {
            const response = await fetch(`${API_URL}/api/user-comments-polls/${profileId}`);
            const data = await response.json();
            if (response.ok) {
                setCommentedPolls(data);
            }
        } catch (error) {
            console.log('Error cargando encuestas comentadas:', error);
        }
    };

    useEffect(() => {
        cargarMisComentarios();
    }, [profileId]);

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>💬 Encuestas donde comenté</Text>
            <FlatList
                data={commentedPolls}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.pollCard}>
                        <Text style={styles.preguntaCard}>{item.question}</Text>
                        <Text style={styles.categoriaCard}>Categoría: {item.category || 'social'}</Text>
                        <Text style={styles.autorCard}>Creado por: {item.creator_alias}</Text>

                        <PollInteraction 
                            pollId={item.id} 
                            profileId={profileId} 
                        />
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.textoVacio}>Aún no comentaste en ninguna encuesta.</Text>
                }
                contentContainerStyle={styles.scrollContent}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1E292E', padding: 20 },
    titulo: { color: '#55E6C1', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    scrollContent: { paddingBottom: 20 },
    pollCard: { backgroundColor: 'rgba(46, 63, 71, 0.95)', padding: 15, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#3a4f59' },
    preguntaCard: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 6 },
    categoriaCard: { color: '#55E6C1', fontSize: 12, marginBottom: 4, fontStyle: 'italic' },
    autorCard: { color: '#a0b2b8', fontSize: 12 },
    textoVacio: { color: '#A0AAB2', fontStyle: 'italic', textAlign: 'center', marginTop: 30 }
});