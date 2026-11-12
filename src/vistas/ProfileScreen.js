import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { UserContext } from './UserContext';
import WelcomeScreen from './WelcomeScreen'; 

const API_URL = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.1.36:3000';

export default function ProfileScreen({ navigation }) {
    const { userAlias, setUserAlias, profileId } = useContext(UserContext);
    
    const [avatarUrl, setAvatarUrl] = useState(`https://robohash.org/${userAlias || 'NoxoUser'}.png?set=set4`);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!profileId) return;
            try {
                const response = await fetch(`${API_URL}/api/profile/${profileId}`);
                const data = await response.json();
                if (data && data.avatar_url) {
                    setAvatarUrl(data.avatar_url);
                }
            } catch (error) {
                console.error("Error al cargar perfil", error);
            }
        };
        fetchUserProfile();
    }, [profileId]);

    const handleLogout = () => {
        setUserAlias(null);
    };

    const sortearNuevoAvatar = () => {
        const randomSeed = 'Noxo_' + Math.floor(Math.random() * 100000);
        const nuevoLink = `https://robohash.org/${randomSeed}.png?set=set4`;
        setAvatarUrl(nuevoLink);
    };

    const guardarAvatarEnBD = async () => {
        try {
            const response = await fetch(`${API_URL}/api/update-avatar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileId, avatarUrl })
            });
            const data = await response.json();
            if (response.ok) {
                Alert.alert("¡Listo!", "¡Tu animalito favorito quedó guardado para siempre!");
            } else {
                Alert.alert("Error", data.message || "No se pudo guardar el avatar");
            }
        } catch (error) {
            console.error("Error al guardar avatar", error);
            Alert.alert("Error", "No se pudo conectar con el servidor");
        }
    };

    if (!userAlias) {
        return <WelcomeScreen navigation={navigation} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil Anónimo</Text>
            
            <View style={styles.tarjeta}>
                <View style={styles.avatarContainer}>
                    <Image 
                        source={{ uri: avatarUrl }} 
                        style={styles.avatarImage} 
                    />
                </View>

                <TouchableOpacity style={styles.botonCambiar} onPress={sortearNuevoAvatar}>
                    <Text style={styles.textoBotonCambiar}>🎲 Probar otro animalito</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botonGuardar} onPress={guardarAvatarEnBD}>
                    <Text style={styles.textoBotonGuardar}>💾 Guardar este perfil</Text>
                </TouchableOpacity>

                <Text style={styles.aliasText}>@{userAlias}</Text>
                <Text style={styles.subText}>Modo Anónimo</Text>
                
                <TouchableOpacity style={styles.botonLogout} onPress={handleLogout}>
                    <Text style={styles.textoBotonLogout}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1E292E', alignItems: 'center', justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#55E6C1', marginTop: 40, marginBottom: 20 },
    tarjeta: { backgroundColor: '#25333A', padding: 30, borderRadius: 25, width: '85%', alignItems: 'center', borderWidth: 1, borderColor: '#2E3F47' },
    avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1E292E', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#55E6C1', marginBottom: 10, overflow: 'hidden' },
    avatarImage: { width: '100%', height: '100%' },
    botonCambiar: { backgroundColor: '#1E292E', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#2E3F47' },
    textoBotonCambiar: { color: '#55E6C1', fontSize: 11, fontWeight: 'bold' },
    botonGuardar: { backgroundColor: '#55E6C1', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 15, marginBottom: 15 },
    textoBotonGuardar: { color: '#1E292E', fontSize: 12, fontWeight: 'bold' },
    aliasText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
    subText: { color: '#A0AAB2', fontSize: 14 },
    botonLogout: { marginTop: 20, paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20, borderWidth: 1, borderColor: '#FF5E5E' },
    textoBotonLogout: { color: '#FF5E5E', fontWeight: 'bold', fontSize: 14 }
});