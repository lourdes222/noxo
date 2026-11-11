import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function AyudaScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.titulo}>¿Cómo utilizar nuestra aplicación?</Text>
            <Text style={styles.subtitulo}>Todo lo que necesitás saber sobre Noxo</Text>

            <View style={styles.card}>
                <Text style={styles.pregunta}>👤 ¿Cómo funciona el perfil anónimo?</Text>
                <Text style={styles.respuesta}>
                    En Noxo no necesitás correos ni contraseñas reales. Ingresás con un alias personalizado que se guarda en tu dispositivo para que puedas interactuar con total libertad.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.pregunta}>📊 ¿Cómo crear una encuesta?</Text>
                <Text style={styles.respuesta}>
                    Dirigite a la pestaña <Text style={styles.resaltado}>Crear</Text> en la barra inferior, escribí tu pregunta, elegí una categoría temática (Gaming, Música, Anime, etc.) y definí las dos opciones de respuesta. ¡Listo! Ya aparecerá en el feed de la comunidad.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.pregunta}>💬 ¿Cómo funcionan los comentarios y likes?</Text>
                <Text style={styles.respuesta}>
                    En cada encuesta podés dejar tu "Me gusta" o desplegar los comentarios haciendo clic en "Comentarios" para opinar y leer lo que dice el resto de la comunidad en tiempo real.
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.pregunta}>📂 ¿Dónde veo mis interacciones?</Text>
                <Text style={styles.respuesta}>
                    Desde el menú lateral (Drawer) podés acceder directamente a <Text style={styles.resaltado}>Mis Me gusta</Text> y <Text style={styles.resaltado}>Mis Comentarios</Text> para hacer un seguimiento de todas las encuestas en las que participaste.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#1E292E', 
    },
    scrollContent: { 
        padding: 20, 
        paddingBottom: 30 
    },
    titulo: { 
        color: '#55E6C1', 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginBottom: 5 
    },
    subtitulo: { 
        color: '#A0AAB2', 
        fontSize: 14, 
        marginBottom: 20,
        fontStyle: 'italic',
    },
    card: { 
        backgroundColor: 'rgba(46, 63, 71, 0.95)', 
        padding: 16, 
        borderRadius: 12, 
        marginBottom: 15, 
        borderWidth: 1, 
        borderColor: '#3a4f59' 
    },
    pregunta: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '600', 
        marginBottom: 8 
    },
    respuesta: { 
        color: '#d1d8dc', 
        fontSize: 14, 
        lineHeight: 20 
    },
    resaltado: {
        color: '#55E6C1',
        fontWeight: 'bold'
    }
});