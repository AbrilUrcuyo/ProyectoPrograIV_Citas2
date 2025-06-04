import {createContext, useState} from "react";

export const AppContext = createContext();

function AppProvider(props){
    const [buscarCitas, setBuscarCitas] = useState({
        localidad: "",
        especialidad: "",
    });
    return(
        <AppContext.Provider value={{
            buscarCitas: buscarCitas,
            setBuscarCitas: setBuscarCitas
        }}>
            {props.children}
        </AppContext.Provider>
    );
}
export default AppProvider;