import React, {createContext, useState} from "react";

export const UserContext= createContext();

export const UserProvider=({children})=>{
    const[userAlias, setUserAlias]= useState(null);
    const [profileId, setProfileId]=useState(null);
    return(
        <UserContext.Provider value={{userAlias, setUserAlias, profileId, setProfileId}}>
            {children}
        </UserContext.Provider>
    );
};