import {createContext, useState} from "react";

export const AppContext = createContext();

function AppProvider(props){
    const [buscarCitas, setBuscarCitas] = useState({
        localidad: "",
        especialidad: "",
    });

    const [gestionCitas, setGestionCitas] = useState({
        filterE:"Todas",
        filterP:"",
        citasFiltradas: null,
    });
    return(
        <AppContext.Provider value={{
            buscarCitas: buscarCitas,
            setBuscarCitas: setBuscarCitas,

            gestionCitas: gestionCitas,
            setGestionCitas: setGestionCitas
        }}>
            {props.children}
        </AppContext.Provider>
    );
}
export default AppProvider;