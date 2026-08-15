import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import {UserContext} from './UserContext';

export default function HomeView({navigation}) {
  const [votado, setVotado]= useState(false);
  const [opcionElegida, setOpcionElegida]=useState(null);

  const {userAlias} = useContext(UserContext);

  const bancoPreguntas=[
    {
      pregunta: "¿Qué preferís para un viernes a la noche?",
      opciones: ["Quedarse en casa viendo series", "Salir de joda con amigos", "Avanzar con estudios"]
    },
    {
      pregunta: "¿Cuál es tu mayor superpoder oculto?",
      opciones: ["Memoria de elefante", "Dormir en cualquier lado", "Resolver bugs mágicamente"]
    },
    {
      pregunta: "Si pudieras elegir una tecnología para siempre:",
      opciones: ["Java, toda la vida", "JavaScript/React Native siempre!", "Phyton sin dudarlo"]
    },
    {
      pregunta: "¿Cómo manejás los días de fiaca extrema?",
      opciones: ["Música a todo volumen", "Café y a viciar", "No existo por 24 horas"]
    }
  ];

  const [indicePregunta, setIndicePregunta]= useState(0);
  const preguntaActual= bancoPreguntas[indicePregunta];
  const [buscandoChat, setBuscandoChat]= useState(false);

  const handleVotar= (index)=>{
    if(!userAlias){
      Alert.alert(
        "Debe iniciar sesión", 
        "Inicia sesión para poder votar y unirte al chat anónimo.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Ingresar", onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    setVotado(true);
    setOpcionElegida(index);
    setBuscandoChat(true);
    setTimeout(()=>{
      setBuscandoChat(false);
      navigation.navigate('Chat');
    }, 2000);
  };
  const siguientePregunta=()=>{
    setVotado(false);
    setOpcionElegida(null);
    setIndicePregunta((prev)=> (prev+1)% bancoPreguntas.length);
    
    if(buscandoChat){
      return(
        <View style={styles.pantallaCarga}>
          <ActivityIndicator size="large" color="#55E6C1" />
          <Text style={styles.textoCarga}>Buscando chat anónimo...</Text>
          <Text style={styles.subTextoCarga}>Por favor, espera.</Text>
        </View>
      )
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBadge}>
        <Text style={styles.topBadgeText}>Debate Anónimo de la Comunidad</Text>
      </View>

      <Text style={styles.pregunta}>{preguntaActual.pregunta}</Text>
      <View style={styles.opcionesContainer}>
        {preguntaActual.opciones.map((opcion, index)=>{
          const esSeleccionada=opcionElegida===index;

          return(
            <TouchableOpacity 
            key={index}
            style={[
              styles.botonOpcion,
              esSeleccionada && styles.botonSeleccionado
            ]}
            onPress={()=> handleVotar(index)}
            disabled={votado}
            >
              <Text style={[
                styles.textoOpcion,
                esSeleccionada && styles.textoOpcionSeleccionada
              ]}>{opcion}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {votado &&(
        <View style={styles.resultadoContainer}>
          <Text style={styles.resultadoText}>¡Voto guardado!</Text>
          <TouchableOpacity style={styles.botonSiguiente} onPress={siguientePregunta}>
            <Text style={styles.textoBotonSiguiente}>Siguiente Debate</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles= StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#1E292E',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBadge:{
    backgroundColor: '#25333A',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom:30,
    borderWidth: 1,
    borderColor: '#55E6C1',
  },
  topBadgeText:{
    color: '#55E6C1',
    fontWeight: 'bold',
    fontSize:14,
  },
  pregunta:{
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  opcionesContainer:{
    width: '100%',
    gap: 15,
  },
  botonOpcion:{
    backgroundColor: '#25333A',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E3F47',
  },
  botonSeleccionado:{
    backgroundColor: '#55E6C1',
    borderColor: '#55E6C1',
  },
  textoOpcion:{
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  textoOpcionSeleccionada:{
    color: '#1E292E',
    fontWeight: 'bold',
  },
  resultadoContainer:{
    marginTop: 25,
    alignItems: 'center',
    width: '100%',
  },
  resultadoText:{
    color: '#55E6C1',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 15,
  },
  botonSiguiente:{
    backgroundColor: '#25333A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#55E6C1',
  },
  textoBotonSiguiente:{
    color: '#55E6C1',
    fontWeight: 'bold',
    fontSize: 15,
  },
  pantallaCarga:{
    flex: 1,
    backgroundColor: '#1E292E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textoCarga:{
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  subtextoCarga:{
    color: '#A0AAB2',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});