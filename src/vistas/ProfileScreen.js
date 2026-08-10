import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from './UserContext';

export default function ProfileScreen() {
    const { userAlias, setUserAlias } = useContext(UserContext);

    const handleLogout = () => {
        setUserAlias(null);
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil Anónimo</Text>
            
            <View style={styles.tarjeta}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarEmoji}>👤</Text>
                </View>

                {userAlias ? (
                    <>
                        <Text style={styles.aliasText}>@{userAlias}</Text>
                        <Text style={styles.subText}>Modo Anónimo</Text>
                        
                        <TouchableOpacity style={styles.botonLogout} onPress={handleLogout}>
                            <Text style={styles.textoBotonLogout}>Cerrar Sesión</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <Text style={styles.aliasText}>No has iniciado sesión</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#1E292E', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 20 
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#55E6C1', 
        marginTop: 40, 
        marginBottom: 20 
    },
    tarjeta: { 
        backgroundColor: '#25333A', 
        padding: 30, 
        borderRadius: 25, 
        width: '85%', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#2E3F47' 
    },
    avatarContainer: { 
        width: 80, 
        height: 80, 
        borderRadius: 40, 
        backgroundColor: '#1E292E', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 2, 
        borderColor: '#55E6C1', 
        marginBottom: 15 
    },
    avatarEmoji: { 
        fontSize: 35 
    },
    aliasText: { 
        color: '#FFFFFF', 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 5 
    },
    subText: { 
        color: '#A0AAB2', 
        fontSize: 14 
    },
    botonLogout: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FF5E5E',
    },
    textoBotonLogout: {
        color: '#FF5E5E',
        fontWeight: 'bold',
        fontSize: 14
    }
});