import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, ScrollView, Platform, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { UserContext } from './UserContext';

const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:3000' 
  : 'http://192.168.1.36:3000';
const fondosCategorias = {
  terror: { uri: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1000&auto=format&fit=crop' },
  series: { uri: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000&auto=format&fit=crop' },
  musica: { uri: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop' },
  gaming: { uri: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1000&auto=format&fit=crop' },
  anime: { uri: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop' },
  comida: { uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop' },
  viajes: { uri: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop' },
  moda: { uri: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop' },
  social: { uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format&fit=crop' },
  estudios: { uri: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000&auto=format&fit=crop' },
};

export default function CrearEnc({ navigation }) {
    const [pregunta, setPregunta] = useState('');
    const [opcion1, setOpcion1] = useState('');
    const [opcion2, setOpcion2] = useState('');
    const [categoria, setCategoria] = useState('social');
    const [pollsList, setPollsList] = useState([]);
    const [filtroActual, setFiltroActual] = useState('todas');

    const { userAlias, profileId } = useContext(UserContext);

    const categoriasDisponibles = [
        {id: 'terror', nombre: '👻 Terror y Paranormal'},
        {id: 'series', nombre: '📺 Series y Películas'},
        {id: 'musica', nombre: '🎵 Música y Gustos'},
        {id: 'gaming', nombre: '🎮 Gaming y Setup'},
        {id: 'anime', nombre: '⚔️ Anime y Manga'},
        {id: 'comida', nombre: '🍔 Comida y Bebidas'},
        {id: 'viajes', nombre: '✈️ Viajes y Aventuras'},
        {id: 'moda', nombre: '👗 Moda y Estilo'},
        {id: 'social', nombre: '😂 Social y Comunidad'},
        {id: 'estudios', nombre: '📚 Estudios y Facultad'},
    ];
    const cargarEncuestas = async () => {
        try {
            const response = await fetch(`${API_URL}/api/polls`);
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
            const response = await fetch(`${API_URL}/api/polls`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ 
                   profileId,
                   question: pregunta,
                   options: [opcion1, opcion2],
                   category: categoria,
               })
            });
            const data = await response.json();
            
            if (response.ok) {
                Alert.alert("¡Éxito!", "¡Encuesta creada con éxito!");
                setPregunta('');
                setOpcion1('');
                setOpcion2('');
                setCategoria('social');
                setFiltroActual('todas');
                cargarEncuestas();
            } else {
                Alert.alert("Error", data.error || "No se pudo crear la encuesta.");
            }
        } catch (error) {
            console.log('Error de conexión:', error);
            Alert.alert("Error", "No se pudo conectar con el servidor.");
        }
    };

    const encuestasFiltradas = filtroActual === 'todas' 
        ? pollsList 
        : pollsList.filter(item => item.category === filtroActual);
    const fondoActual = filtroActual === 'todas' ? null : fondosCategorias[filtroActual];
    return(
        <ImageBackground 
            source={fondoActual} 
            style={styles.container} 
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <FlatList
                    data={encuestasFiltradas}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={
                        <View style={styles.formContainer}>
                            
                            <SeccionCategorias 
                                categoriaSeleccionada={filtroActual} 
                                setCategoriaSeleccionada={setFiltroActual} 
                            />

                            {filtroActual === 'todas' && (
                                <View style={styles.bloqueFormulario}>
                                    <Text style={styles.label}>¿Qué querés preguntar?</Text>
                                    <TextInput 
                                        style={styles.input}
                                        placeholder="Escribí tu pregunta"
                                        placeholderTextColor='#888'
                                        value={pregunta}
                                        onChangeText={setPregunta}
                                    />

                                    <Text style={styles.label}>Categoría de la encuesta</Text>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={categoria}
                                            onValueChange={(itemValue) => setCategoria(itemValue)}
                                            dropdownIconColor="#55E6C1"
                                            style={styles.picker}
                                        >
                                            {categoriasDisponibles.map((cat) => (
                                                <Picker.Item key={cat.id} label={cat.nombre} value={cat.id} />
                                            ))}
                                        </Picker>
                                    </View>

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
                            )}

                            <Text style={styles.subtituloFeed}>
                                {filtroActual === 'todas' ? 'Encuestas de la Comunidad' : `Encuestas de ${filtroActual.toUpperCase()}`}
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.pollCard}>
                            <Text style={styles.preguntaCard}>{item.question}</Text>
                            <Text style={styles.categoriaCard}>Categoría: {item.category || 'social'}</Text>
                            <Text style={styles.autorCard}>Creado por: {item.creator_alias}</Text>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.textoVacio}>No hay encuestas publicadas en esta categoría todavía.</Text>
                    }
                    contentContainerStyle={styles.scrollContent}
                />
            </View>
        </ImageBackground>   
    );
}
function SeccionCategorias({ categoriaSeleccionada, setCategoriaSeleccionada }) {
  const categoriasFiltro = [
    { id: 'todas', nombre: '✨ Todas' },
    { id: 'terror', nombre: '👻 Terror' },
    { id: 'series', nombre: '📺 Series' },
    { id: 'musica', nombre: '🎵 Música' },
    { id: 'gaming', nombre: '🎮 Gaming' },
    { id: 'anime', nombre: '⚔️ Anime' },
    { id: 'comida', nombre: '🍔 Comida' },
    { id: 'viajes', nombre: '✈️ Viajes' },
    { id: 'moda', nombre: '👗 Moda' },
    { id: 'social', nombre: '😂 Social' },
    { id: 'estudios', nombre: '📚 Estudios' },
  ];

  return (
    <View style={styles.containerFiltros}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categoriasFiltro.map((cat) => {
          const estaActivo = categoriaSeleccionada === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, estaActivo && styles.chipActivo]}
              onPress={() => setCategoriaSeleccionada(cat.id)}
            >
              <Text style={[styles.chipText, estaActivo && styles.chipTextActivo]}>
                {cat.nombre}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E292E',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(30, 41, 46, 0.85)',
    },
    scrollContent:{
        padding: 20,
        paddingBottom: 20,
    },
    formContainer: {
        marginBottom: 10,
    },
    bloqueFormulario: {
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: 'rgba(37, 51, 58, 0.95)',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#3a4f59',
    },
    label: {
        color: '#fff',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#1E292E',
        color: '#fff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
    },
    pickerContainer: {
        backgroundColor: '#1E292E',
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#3a4f59',
        overflow: 'hidden',
    },
    picker: {
        color: '#fff',
        backgroundColor: '#1E292E',
        height: 50,
    },
    button: {
        backgroundColor: '#55E6C1',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
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
        marginTop: 10,
    },
    containerFiltros: {
        marginVertical: 5,
    },
    chip: {
        backgroundColor: '#2E3F47',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#3a4f59',
    },
    chipActivo: {
        backgroundColor: '#55E6C1',
        borderColor: '#55E6C1',
    },
    chipText: {
        color: '#A0AAB2',
        fontSize: 14,
        fontWeight: '600',
    },
    chipTextActivo: {
        color: '#1E292E',
        fontWeight: 'bold',
    },
    pollCard: {
        backgroundColor: 'rgba(46, 63, 71, 0.95)',
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
    categoriaCard: {
        color: '#55E6C1',
        fontSize: 12,
        marginBottom: 4,
        fontStyle: 'italic',
    },
    autorCard: {
        color: '#a0b2b8',
        fontSize: 12,
    },
    textoVacio: {
        color: '#A0AAB2',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 20,
    }
});