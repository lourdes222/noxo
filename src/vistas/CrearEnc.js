import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { UserContext } from './UserContext';

export default function CrearEnc({ navigation }) {
    const [pregunta, setPregunta] = useState('');
    const [opcion1, setOpcion1] = useState('');
    const [opcion2, setOpcion2] = useState('');

    const { userAlias } = useContext(UserContext);

    const handleCrearEncuesta = () => {
        if (!userAlias) {
            Alert.alert(
                "Debes iniciar sesión",
                "Necesitas una cuenta anónima para crear una encuesta.",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Ingresar", onPress: () => navigation.navigate('Login') }
                ]
            );
            return;
        }

        if (!pregunta || !opcion1 || !opcion2) {
            Alert.alert("Atención", "Por favor completa la pregunta y las dos opciones");
            return;
        }

        console.log('Encuesta creada:', { pregunta, opcion1, opcion2 });
        
        setPregunta('');
        setOpcion1('');
        setOpcion2('');
        
        Alert.alert("¡Éxito!", "¡Encuesta creada con éxito!");
    };

    return(
        <View style={styles.container}>
            <Text style={styles.label}>¿Qué querés preguntar?</Text>
            <TextInput 
                style={styles.input}
                placeholder="Escribí tu pregunta"
                placeholderTextColor='#888'
                value={pregunta}
                onChangeText={setPregunta}
            />

            <Text style={styles.label}>Opción 1</Text>
            <TextInput 
                style={styles.input}
                placeholder="Ej: Sí"
                placeholderTextColor='#888'
                value={opcion1}
                onChangeText={setOpcion1}
            />

            <Text style={styles.label}>Opción 2</Text>
            <TextInput 
                style={styles.input}
                placeholder="Ej: No"
                placeholderTextColor='#888'
                value={opcion2}
                onChangeText={setOpcion2}
            />

            <TouchableOpacity style={styles.button} onPress={handleCrearEncuesta}>
                <Text style={styles.buttonText}>Crear Encuesta</Text>
            </TouchableOpacity>
        </View>   
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1E292E',
        justifyContent: 'center',
    },
    label: {
        color: '#fff',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#2E3F47',
        color: '#fff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#55E6C1',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#1E292E',
        fontWeight: 'bold',
        fontSize: 16,
    },
});