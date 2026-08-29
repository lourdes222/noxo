import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { UserContext } from './UserContext';

export default function LoginScreen(){
    const { setUserAlias } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleIngresar = async () => {
        if (!email.includes('@')) {
            Alert.alert("Atención", "Por favor ingresá un correo electrónico válido.");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Atención", "La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        const aliasGenerado = `Noxo_${Math.floor(Math.random() * 9000) + 1000}`;

        try {
            const respuesta = await fetch('http://10.0.9.244:3000/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: email,  
                    password: password, 
                    alias: aliasGenerado 
                })
            });

            const datos = await respuesta.json();

            if (respuesta.ok) {
                setUserAlias(datos.alias);
                Alert.alert("¡Bienvenido a NOXO!", `Has ingresado como ${datos.alias} 🕵️‍♂️`);
            } else {
                Alert.alert("Error", datos.error || "No se pudo registrar el usuario.");
            }

        } catch (error) {
            console.log("Error de conexión:", error);
            Alert.alert("Error", "No se pudo conectar con el servidor local.");
        }
    };

    return(
        <View style={styles.container}>
            <View style={styles.tarjeta}>
                <Text style={styles.tituloTarjeta}>Acceso Anónimo</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Tu correo electrónico"
                    placeholderTextColor="#A0AAB2"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

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