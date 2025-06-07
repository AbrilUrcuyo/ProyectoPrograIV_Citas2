import {createContext, useState} from "react";

export const AppContext = createContext();

function AppProvider(props){
    const [buscarCitas, setBuscarCitas] = useState({
        localidad: "",
        especialidad: "",
        medicosFiltrados: null,
    });

    const [gestionCitas, setGestionCitas] = useState({
        filterE:"Todas",
        filterP:"",
        citasFiltradas: null,
    });

    const [historico, setHistorico] = useState({
        estado:"Todas",
        nombreM:"",
        citasFiltradas: null,
    });
    return(
        <AppContext.Provider value={{
            buscarCitas: buscarCitas,
            setBuscarCitas: setBuscarCitas,

            gestionCitas: gestionCitas,
            setGestionCitas: setGestionCitas,

            historicoCitas: historico,
            setHistorico: setHistorico,
        }}>
            {props.children}
        </AppContext.Provider>
    );
}
export default AppProvider;