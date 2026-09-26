import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { UserContext } from './UserContext';

export default function CrearEnc({ navigation }) {
    const [pregunta, setPregunta] = useState('');
    const [opcion1, setOpcion1] = useState('');
    const [opcion2, setOpcion2] = useState('');
    const [pollsList, setPollsList] = useState([]);
    const { userAlias, profileId } = useContext(UserContext);

    const cargarEncuestas = async () => {
        try {
            const response = await fetch('http://10.0.9.244:3000/api/polls');
            const data = await response.json();
            if (response.ok) {
                setPollsList(data);
            }
        } catch (error) {
                console.log('Error de conexión:', error);
            }
    };
    useEffect(() => {
        cargarEncuestas();
    }, []);

    const handleCrearEncuesta = async () => {
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

        try {
            const response = await fetch('http://10.0.9.244:3000/api/polls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    profileId,
                    question: pregunta,
                    options: [opcion1, opcion2] })
            });
            const data = await response.json();
            if (!response.ok) {
                Alert.alert("Éxito!", "¡Encuesta creada con éxito!");
                setPregunta('');
                setOpcion1('');
                setOpcion2('');
                cargarEncuestas();
            } else{
                Alert.alert("Error", data.error || "No se pudo crear la encuesta.");
            }
        } catch (error) {
            console.log('Error de conexión:', error);
            Alert.alert("Error", "No se pudo conectar con el servidor.");
        }
    };

    return(
        <View style={styles.container}>
            <FlatList
                data={pollsList}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <View style={styles.formContainer}>
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

                        <Text style={styles.subtituloFeed}>Encuestas de la Comunidad</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.pollCard}>
                        <Text style={styles.preguntaCard}>{item.question}</Text>
                        <Text style={styles.autorCard}>Creado por: {item.creator_alias}</Text>
                    </View>
                )}
                contentContainerStyle={styles.scrollContent}
            />
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
    scrollContent:{
        padding:20,
        paddingBottom: 20,
    },
    formContainer: {
        marginBottom: 10,
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
    subtituloFeed: {
        color: '#55E6C1',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    pollCard: {
        backgroundColor: '#2E3F47',
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#3a4f59',
    },
    preguntaCard: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
    },
    autorCard: {
        color: '#a0b2b8',
        fontSize: 12,
    },
});