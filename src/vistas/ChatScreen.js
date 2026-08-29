import React, {useState, useContext, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Alert} from 'react-native';
import {UserContext} from './UserContext';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';

export default function ChatScreen({route, navigation}) {
    const {userAlias, profileId} = useContext(UserContext);
    const { roomId } = route.params || {}; 
    const [tiempoRestante, setTiempoRestante]= useState(900);
    const [chatActivo, setChatActivo]= useState(true);
    const [textoInput, setTextoInput]= useState('');
    const flatListRef = useRef(null);

    const [mensajes, setMensajes]= useState([
        {id: '1', texto: '¡Sala abierta! Debate activado por voto anónimo.', remitente:'Sistema'},
    ]);

    useEffect(()=>{
        if(!chatActivo || tiempoRestante <= 0) return;
        const timer=setInterval(()=>{
            setTiempoRestante((prev)=>{
                if(prev<=1){
                    clearInterval(timer);
                    mostrarAlertaExtension();
                    return 0;
                }
                return prev-1;
            });
        }, 1000);
        return ()=> clearInterval(timer);
    }, [tiempoRestante, chatActivo]);

    useEffect(() => {
        if (!roomId) return;

        const interval = setInterval(async () => {
            try {
                const response = await fetch(`http://10.0.9.244:3000/api/mensajes/${roomId}`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setMensajes([
                        { id: '1', texto: '¡Sala abierta! Debate activado por voto anónimo.', remitente: 'Sistema' },
                        ...data.map(m => ({ 
                            id: m.id.toString(), 
                            texto: m.texto, 
                            remitente: m.remitente,
                            sender_profile_id: m.sender_profile_id 
                        }))
                    ]);
                }
            } catch (error) {
                console.log("Error al obtener mensajes:", error);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [roomId]);

    const mostrarAlertaExtension=()=>{
        Alert.alert("¡Tiempo agotado!", "Desea seguir la conversación?",
            [
                {
                    text:"No",
                    style:"cancel",
                    onPress:()=> salirDelChat()
                },
                {
                    text:"Sí (extender 10 min)",
                    onPress:()=>{
                        setTiempoRestante(600);
                        setChatActivo(true);
                    }
                }
            ],
            {cancelable:false}
        );
    };

    const formatearTiempo=(segundos)=>{
        const mins= Math.floor(segundos/60);
        const secs=segundos%60;
        return `${mins<10?'0':''}${mins}:${secs<10?'0':''}${secs}`;
    };

    const salirDelChat=()=>{
        setChatActivo(false);
        navigation.navigate('Main');
    };

   const enviarMensaje = async () => {
        if (!textoInput.trim() || !chatActivo) return;
        const salaActual = roomId || 1;
        const mensajeTexto = textoInput.trim();
        setTextoInput(''); 
        try {
            const response = await fetch('http://10.0.9.244:3000/api/mensajes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomId: salaActual,
                    senderId: profileId || 1,
                    message: mensajeTexto
                })
            });
            const resultado = await response.json();
            console.log("respuesta del servidor al enviar:", resultado);
        } catch (error) {
            console.log("error al enviar mensaje:", error);
        }
    };
    return(
        <View style={styles.container}>
            <View style={styles.headerChat}>
                <View style={styles.infoTimer}>
                    <Ionicons name="time-outline" size={20} color="#55E6C1" />
                    <Text style={styles.timerText}>
                        {formatearTiempo(tiempoRestante)}
                    </Text>
                </View>
                <TouchableOpacity style={styles.botonSalir} onPress={salirDelChat}>
                    <Text style={styles.textoBotonSalir}>Salir</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                ref={flatListRef}
                data={mensajes}
                keyExtractor={(item) => item.id}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                renderItem={({ item }) => {
                    const esSistema = item.remitente === 'Sistema';
                    const esMio = item.sender_profile_id === profileId;

                    if (esSistema) {
                        return (
                            <View style={styles.sistemaBubble}>
                                <Text style={styles.sistemaText}>{item.texto}</Text>
                            </View>
                        );
                    }

                    return (
                        <View style={[styles.bubble, esMio ? styles.mio : styles.otro]}>
                            {!esMio && <Text style={styles.remitente}>{item.remitente}</Text>}
                            <Text style={styles.textoMensaje}>{item.texto}</Text>
                        </View>
                    );
                }}
                contentContainerStyle={styles.listaMensajes}
            />
            {chatActivo ? (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Escribe un mensaje..."
                        placeholderTextColor="#888"
                        value={textoInput}
                        onChangeText={setTextoInput}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={enviarMensaje}>
                        <Ionicons name="send" size={18} color="#FFFFFF"/>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.chatCerradoContainer}>
                    <Text style={styles.chatCerradoText}>El chat ha finalizado.</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E292E'
    },
    headerChat: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#111827',
        borderBottomWidth: 1,
        borderBottomColor: '#1E292E'
    },
    infoTimer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    timerText: {
        marginLeft: 8,
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600'
    },
    botonSalir: {
        backgroundColor: '#FF6B6B',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    textoBotonSalir: {
        color: '#FFFFFF',
        fontWeight: '600'
    },
    listaMensajes: {
        padding: 16
    },
    sistemaBubble: {
        alignSelf: 'center',
        backgroundColor: '#111827',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginVertical: 8
    },
    sistemaText: {
        color: '#D1D5DB',
        fontSize: 12,
        textAlign: 'center'
    },
    bubble: {
        maxWidth: '80%',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginVertical: 6
    },
    mio: {
        alignSelf: 'flex-end',
        backgroundColor: '#55E6C1'
    },
    otro: {
        alignSelf: 'flex-start',
        backgroundColor: '#2E3F47'
    },
    remitente: {
        color: '#F3F4F6',
        fontWeight: '600',
        marginBottom: 4,
        fontSize: 12
    },
    textoMensaje: {
        color: '#FFFFFF'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#111827', 
        borderTopWidth: 1,
        borderTopColor: '#2E3F47',
    },
    input: {
        flex: 1,
        backgroundColor: '#2E3F47',
        color: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 14,
        maxHeight: 100,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#55E6C1', 
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    chatCerradoContainer: {
        padding: 15,
        backgroundColor: '#111827',
        alignItems: 'center'
    },
    chatCerradoText: {
        color: '#9CA3AF',
        fontStyle: 'italic'
    }
});