import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { UserContext, UserProvider } from './UserContext';

export default function LoginScreen(){
    const {setUserAlias}=useContext(UserContext);
    const [alias, setAlias] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const aliasRandom = `Noxo_${Math.floor(Math.random() * 9000) + 1000}`;
        setAlias(aliasRandom);
    }, []);

    const handleIngresar = () => {
        if (password.length < 6) {
            Alert.alert("Atención", "La contraseña debe tener al menos 6 caracteres.");
            return;
        }
        setUserAlias(alias);
        Alert.alert("¡Bienvenido a NOXO!", `Has ingresado como ${alias} 🕵️‍♂️`);
    };

    return(
        <View style={styles.container}>
            <View style={styles.tarjeta}>
                <Text style={styles.tituloTarjeta}>Acceso Anónimo</Text>
                
                <Text style={styles.labelAlias}>Tu identidad asignada:</Text>
                <View style={styles.aliasContainer}>
                    <Text style={styles.aliasText}>{alias}</Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Elegí tu contraseña"
                    placeholderTextColor="#A0AAB2"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.boton} onPress={handleIngresar}>
                    <Text style={styles.textoBoton}>Ingresar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E292E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tarjeta: {
        backgroundColor: '#25333A',
        padding: 30,
        borderRadius: 25,
        width: '85%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2E3F47',
    },
    tituloTarjeta: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    labelAlias: {
        color: '#55E6C1',
        marginBottom: 5,
        fontSize: 14,
    },
    aliasContainer: {
        backgroundColor: '#1E292E',
        padding: 15,
        borderRadius: 15,
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#55E6C1',
        alignItems: 'center',
    },
    aliasText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    input: {
        width: '100%',
        backgroundColor: '#1E292E',
        color: '#FFFFFF',
        padding: 15,
        borderRadius: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#2E3F47',
        fontSize: 16,
    },
    boton: {
        backgroundColor: '#55E6C1',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
    },
    textoBoton: {
        color: '#1E292E',
        fontSize: 18,
        fontWeight: 'bold'
    }
});
