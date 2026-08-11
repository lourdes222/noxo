import React, { useState } from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function CrearEnc({}){
    const [pregunta, setPregunta]= useState('');
    const [opcion1, setOpcion1]= useState('');
    const [opcion2, setOpcion2]= useState('');

    const handleCrearEncuesta=()=>{
        if(!pregunta|| !opcion1 || !opcion2){
            alert('Por favor completa la pregunta y las dos opciones');
            return;
        }
        console.log('Encuesta creada:', {pregunta, opcion1, opcion2});
        setPregunta('');
        setOpcion1('');
        setOpcion2('');
        alert('¡Encuesta creada con éxito!');
    };
    return(
        <View style={styles.container}>
            <Text style={styles.label}>¿Qué querés preguntar?</Text>
            <TextInput 
            style={styles.input}
            placeholder="Escribí te pregunta"
            placeholderTextColor='#888'
            value={pregunta}
            onChangeText={setPregunta}
            ></TextInput>
            <Text style={styles.label}>Opción 1</Text>
            <TextInput 
            style={styles.input}
            placeholder="Ej: Sí"
            placeholderTextColor='#888'
            value={opcion1}
            onChangeText={setOpcion1}
            ></TextInput>

            <Text style={styles.label}>Opción 2</Text>
            <TextInput 
            style={styles.input}
            placeholder="Ej: No"
            placeholderTextColor='#888'
            value={opcion2}
            onChangeText={setOpcion2}
            ></TextInput>

            <TouchableOpacity style={styles.button} onPress={handleCrearEncuesta}>
                <Text style={styles.buttonText}>Crear Encuesta</Text>
            </TouchableOpacity>
        </View>   
    )
}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1E292E',
        justifyContent: 'center',
    },
    label:{
        color: '#fff',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input:{
        backgroundColor: '#2E3F47',
        color: '#fff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
    },
    button:{
        backgroundColor: '#55E6C1',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText:{
        color: '#1E292E',
        fontWeight: 'bold',
        fontSize: 16,
    },
})