import React, {useState, useEffect, useContext} from "react";
import './GestionCitas.css'
import {useNavigate} from "react-router-dom";
import AnotacionModal from "./EditarAnotacion";
import { AppContext } from '../../AppProvider';

const estados = ["Todas", "Pendiente", "Confirmada", "Completada", "Cancelada"];

function GestionCitas() {
    // Estados locales para filtros
    const [medico, setMedico]  = useState({});
    const [citas, setCitas]  = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [anotacion, setAnotacion] = useState("");
    const navigate = useNavigate();

    const backend = "http://localhost:8080";
    const token = localStorage.getItem('_token');

    const {gestionCitas, setGestionCitas} = useContext(AppContext);

    useEffect( ()=> {
        handleMedico();
        if (gestionCitas.citasFiltradas) {
            setCitas(gestionCitas.citasFiltradas);
        } else {
            handleSearch();
        }
    }, []);

    function handleMedico(){
        const request = new Request(backend + '/medicos/citas', {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        (async ()=>{
            const response = await fetch(request);
            if (!response.ok) {alert("Error: "+response.status);return;}
            const medicoD = await response.json();
            setMedico(medicoD);
            setCitas(medicoD.citas || []);
        })();
    }

    // Manejo de búsqueda
    const handleSearch = (e) => {
        if (e) e.preventDefault();
        const request = new Request(backend + '/medicos/citas/buscar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                estado: gestionCitas.filterE,
                paciente: gestionCitas.filterP
            })
        });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) {
                alert("Error: " + response.status);
                return;
            }
            const citasD = await response.json();
            setCitas(citasD || []);
            setGestionCitas(prev=> ({...prev, citasFiltradas: citasD}));
        })();
    }

    function handleConfirm(citaId) {
        const request = new Request(backend+'/citas/confirmar/'+citaId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) {
                alert("Error: " + response.status);
                return;
            }
            handleSearch();
        })();
    }

    function handleCancel(citaId) {
        const request = new Request(backend+'/citas/cancelar/'+citaId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) {
                alert("Error: " + response.status);
                return;
            }
            handleSearch();
        })();
    }

    function handleComplete(citaId) {
        const request = new Request(backend+'/citas/completar/'+citaId, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) {
                alert("Error: " + response.status);
                return;
            }
            handleSearch();
        })();
    }

    // Función para abrir el modal y cargar la anotación
    async function handleView(cita) {
        // Aquí podrías hacer un fetch para obtener la anotación si no viene en el objeto cita
        // Por simplicidad, asumimos que cita.anotaciones ya existe
        setCitaSeleccionada(cita);
        setAnotacion(cita.anotaciones || "");
        setShowModal(true);
    }

    // Función para guardar la anotación
    async function handleGuardarAnotacion(e) {
        e.preventDefault();
        // Aquí haces el fetch para guardar la anotación
        await fetch(`${backend}/citas/guardarAnotacion`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                citaId: citaSeleccionada.id,
                anotacion: anotacion
            })
        });
        setShowModal(false);
        handleSearch(); // refresca la lista
    }

    // Función para obtener la clase de estado
    const getEstadoClass = (estado) => {
        switch (estado) {
            case "Pendiente":
                return "status pending";
            case "Confirmada":
                return "status attended";
            case "Completada":
                return "status confirmed";
            case "Cancelada":
                return "status canceled";
            default:
                return "";
        }
    };

    return (
        <div className="main-content">
            <h2 className="page-title">
                Doctor - <span className="patient-name">{medico?.nombre}</span> - appointments
            </h2>
            {medico?.estadoAprob === "Pendiente" && (
                <div className="warning">Medico no aprobado aún</div>
            )}

            <form className="search-form" onSubmit={handleSearch}>
                <div className="search-group">
                    <label htmlFor="status" className="search-label">Estado</label>
                    <select
                        id="status"
                        name="estado"
                        className="search-select"
                        value={gestionCitas.filterE}
                        onChange={e => setGestionCitas({...gestionCitas, filterE: e.target.value})}
                    >
                        {estados.map(e => (
                            <option key={e} value={e}>{e}</option>
                        ))}
                    </select>
                </div>
                <div className="search-group">
                    <label htmlFor="doctor" className="search-label">Paciente</label>
                    <input
                        type="text"
                        id="doctor"
                        name="paciente"
                        className="search-input"
                        value={gestionCitas.filterP}
                        onChange={e => setGestionCitas({...gestionCitas, filterP: e.target.value})}
                    />
                </div>
                <button type="submit" className="search-button">Search</button>
            </form>

            <div className="appointments">
                {gestionCitas.citasFiltradas?.map((cita) => (
                    <div key={cita.id} className="appointment">
                        <div className="row">
                            <img src="/images/camara.png" alt="Patient" className="patient-photo" />
                            <div className="appointment-details">
                                <h3>
                                    <strong>{cita.nombrePaciente}</strong>
                                </h3>
                            </div>
                            <div className="appointment-details">
                                <span className="date">{cita.fecha}</span>
                                <span className="date">{cita.hora}</span>
                            </div>
                            <div className="appointment-details">
                                <span className={getEstadoClass(cita.estado)}>{cita.estado}</span>
                            </div>
                        </div>
                        <div className="appointment-actions row width30">
                            {cita.estado === "Pendiente" && (
                                <>
                                    <button className="attend-button" onClick={() => handleConfirm(cita.id)}>✔ Attend
                                    </button>
                                    <button className="cancel-button" onClick={() => handleCancel(cita.id)}>✖ Cancel</button>
                                </>
                            )}
                            {cita.estado === "Confirmada" && (
                                <button className="attend-button" onClick={() => handleComplete(cita.id)}>Completar</button>
                            )}
                            {cita.estado === "Completada" && (
                                <button
                                    className="view-button"
                                    onClick={() => handleView(cita)}
                                    type="button"
                                >🔍 View</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <AnotacionModal
                show={showModal}
                onClose={() => setShowModal(false)}
                cita={citaSeleccionada}
                anotacion={anotacion}
                setAnotacion={setAnotacion}
                onGuardar={handleGuardarAnotacion}
            />
        </div>
    );
}

export default GestionCitas;