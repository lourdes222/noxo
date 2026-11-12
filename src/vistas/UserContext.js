import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext= createContext();

export const UserProvider=({children})=>{
    const[userAlias, setUserAlias]= useState(null);
    const [profileId, setProfileId]=useState(null);

    useEffect(() =>{
        const cargarSesion = async ()=>{
            try{
                const aliasGuardado = await AsyncStorage.getItem('@noxo_user_alias');
                const idGuardado = await AsyncStorage.getItem('@noxo_profile_id');
                if(aliasGuardado){
                    setUserAlias(aliasGuardado);
                    setProfileId(idGuardado);
                }
            }catch (e){
                console.log("Error cargando sesión", e);
            }
        };
        cargarSesion();
    }, []);
    const actualizarUsuario = async (alias, id) => {
        setUserAlias(alias);
        setProfileId(id);
        try{
            if(alias){
                await AsyncStorage.setItem('@noxo_user_alias', alias);
                if(id) await AsyncStorage.setItem('@noxo_profile_id', String(id));
            } else{
                await AsyncStorage.removeItem('@noxo_user_alias');
                await AsyncStorage.removeItem('@noxo_profile_id');
            }
        } catch(e){
            console.log("Error guardando sesión", e);
        }
    };
    return(
        <UserContext.Provider value={{userAlias, setUserAlias, profileId, setProfileId}}>
            {children}
        </UserContext.Provider>
    );
};