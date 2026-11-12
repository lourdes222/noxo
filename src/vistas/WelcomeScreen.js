import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function WelcomeScreen({ navigation }){
    return(
        <View style={styles.container}>
            <View style={styles.tarjeta}>
                <Text style={styles.titulo}>Unite a <Text style={styles.noxoText}>NOXO</Text></Text>

                <TouchableOpacity
                style={styles.botonPrincipal}
                onPress={()=> navigation.navigate('Registro')}
                >
                    <Text style={styles.textoBotonPrincipal}>Registrarme</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.botonSecundario}
                onPress={()=> navigation.navigate('Login')}
                >
                    <Text style={styles.textoBotonSecundario}>Inicio sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E292E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tarjeta: {
        backgroundColor: '#25333A',
        padding: 35,
        borderRadius: 25,
        width: '85%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2E3F47',
    },
    titulo: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 35,
        textAlign: 'center',
    },
    noxoText: {
        color: '#55E6C1',
    },
    botonPrincipal: {
        backgroundColor: '#55E6C1',
        paddingVertical: 14,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    textoBotonPrincipal: {
        color: '#1E292E',
        fontSize: 16,
        fontWeight: 'bold',
    },
    botonSecundario: {
        backgroundColor: 'transparent',
        paddingVertical: 14,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#55E6C1',
    },
    textoBotonSecundario: {
        color: '#55E6C1',
        fontSize: 16,
        fontWeight: 'bold',
    }
});