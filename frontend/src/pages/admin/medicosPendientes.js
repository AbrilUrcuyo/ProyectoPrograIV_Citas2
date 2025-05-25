import {useEffect, useState} from 'react'
import "./administrador.css";

function MedicosPendientes(){
    const [medicos, setMedicos] = useState([])
    const backend="http://localhost:8080";

    useEffect(()=>{
        if(medicos.length === 0)
            handleList();
    }, [])

    function handleList(){
        const request = new Request(backend+"/admin", {method: "GET", headers:{"Accept":"application/json","Content-Type":"application/json"}});
        (async ()=>{
            const response = await fetch(request);
            if(!response.ok){
                alert("Error: "+ response.statusText);
                return;
            }
            const medicos = await response.json();
            setMedicos(medicos);
        })();
    }

    // ...existing code...

    function handleAceptar(id) {
        const request = new Request(`${backend}/admin/${id}/aprobar`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) {
                alert("Error: " + response.statusText + " No se pudo aceptar al medico");
                return;
            }
            handleList(); // Refresca la lista
        })();
    }

    function handleRechazar(id) {
        const request = new Request(`${backend}/admin/${id}/rechazar`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) {
                alert("Error: " + response.statusText + " No se pudo rechazar al medico");
                return;
            }
            handleList(); // Refresca la lista
        })();
    }


    return (
        <div className="container">
            <div className="LoginPage">
                <div className="LoginTitule">
                    <h2>Gestión de Médicos</h2>
                </div>

                <div>
                    <div>
                        <table border="1">
                            <thead>
                            <tr>
                                <th>Nombre</th>

                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {medicos.map(medico => (
                                <tr key={medico.id}>
                                    <td>{medico.id}</td>
                                    <td> <button className="botonAceptar" onClick={()=>handleAceptar(medico.id)}>Aprobar</button>
                                        <button className="botonRechazar" onClick={()=>handleRechazar(medico.id)}>Rechazar</button>
                                    </td>
                                </tr>

                            ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>


    );


}


export default MedicosPendientes;