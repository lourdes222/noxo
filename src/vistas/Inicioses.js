import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
const LoginScreen=()=>{
    return(
        <View style={styles.container}>
            <View style={styles.tarjeta}>
                <Text style={styles.tituloTarjeta}>Inicio de sesión</Text>
                <TouchableOpacity style={styles.boton}>
                    <Text style={styles.textoBoton}>Ingresar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles= StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#1E292E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tarjeta:{
        backgroundColor: '#3A5A63',
        padding: 40,
        borderRadius: 30,
        width: '85%',
        alignItems: 'center',
    },
    tituloTarjeta:{
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    boton:{
        backgroundColor: '#55E6C1',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
    },
    textoBoton:{
        color: '#1E292E',
        fontSize: 18,
        fontWeight: 'bold'
    }
});
export default LoginScreen;