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
    container
})