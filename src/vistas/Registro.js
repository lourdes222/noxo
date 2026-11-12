import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { UserContext } from './UserContext';

const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:3000' 
  : 'http://192.168.1.36:3000';

export default function RegistroScreen({ navigation }){
    const { setUserAlias, setProfileId } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegistrar = async () => {
        if(!email.includes('@')) {
            Alert.alert("Atención", "Por favor ingresá un correo electrónico válido");
            return;
        }
        if(password.length<6){
            Alert.alert("Atención", "La contraseña debe tener al menos seis caracteres.");
            return;
        }
        if (password !== confirmPassword){
            Alert.alert("Atención", "Las contraseñas no coinciden.");
            return;
        }
        const aliasGenerado = `Noxo_${Math.floor(Math.random()*9000) + 1000}`;

        try{
     const respuesta = await fetch(`${API_URL}/api/registro`, {
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
      setProfileId(datos.profileId);
      Alert.alert("¡Cuenta creada!", `Tu identidad anónima es ${datos.alias} 🕵️‍♂️`);
     } else {
     Alert.alert("Atención", datos.error || "No se pudo registrar el usuario.");
     }
        }catch (error) {
            console.log("Error de conexión", error);
            Alert.alert("Error", "No se pudo conectar con el servidor local.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.tarjeta}>
                <Text style={styles.tituloTarjeta}>Crear Cuenta</Text>
                
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
                    placeholder="Creá una contraseña (mín. 6)"
                    placeholderTextColor="#A0AAB2"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Repetí tu contraseña"
                    placeholderTextColor="#A0AAB2"
                    secureTextEntry={true}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                <TouchableOpacity style={styles.boton} onPress={handleRegistrar}>
                    <Text style={styles.textoBoton}>Registrarme</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
                    <Text style={styles.linkTexto}>¿Ya tenés cuenta? <Text style={styles.linkResaltado}>Iniciá sesión</Text></Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botonVolver}>
                    <Text style={styles.textoVolver}>← Volver</Text> 
                </TouchableOpacity>
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
        marginBottom: 15,
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
        marginTop: 5,
    },
    textoBoton: {
        color: '#1E292E',
        fontSize: 18,
        fontWeight: 'bold'
    },
    linkContainer: {
        marginTop: 18,
    },
    linkTexto: {
        color: '#A0AAB2',
        fontSize: 14,
    },
    linkResaltado: {
        color: '#55E6C1',
        fontWeight: 'bold',
    },
    botonVolver: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
    },
    textoVolver: {
    color: '#A0AAB2',
    fontSize: 15,
    fontWeight: '600',
    },
});