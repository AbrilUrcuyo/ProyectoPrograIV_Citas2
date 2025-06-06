import React, {useState, useEffect, useContext} from "react";
import userImg from '../images/user.png';
import "./History.css";
import {AppContext} from "../../AppProvider";

const estados = ["Todas", "Pendiente", "Confirmada", "Completada", "Cancelada"];

function History() {
    const [filterE, setFilterE] = useState("Todas");
    const [filterD, setFilterD] = useState("");
    const [citas, setCitas] = useState([]);
    const [pacienteNombre, setPacienteNombre] = useState("");
    const backend = "http://localhost:8080";
    const token = localStorage.getItem('_token');

    const { historicoCitas, setHistorico} = useContext(AppContext);

    useEffect(() => {
        handleList();
        if(historicoCitas.citasFiltradas) {
            setCitas(historicoCitas.citasFiltradas);
        }else{
            handleSearch();
        }
    }, []);

    function handleList(){
        const request = new Request(`${backend}/pacientes/citas`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('_token'),
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) {
                alert("Error: " + response.status);
                return;
            }
            const citasD = await response.json();
            setPacienteNombre(citasD.pacienteNombre || "Paciente");
            setCitas(citasD.citas || []);
        })();
    }

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        const request = new Request(backend + '/pacientes/buscar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                estado:historicoCitas.estado,
                nombreM: historicoCitas.nombreM,
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
            setHistorico(prev=> ({...prev, citasFiltradas: citasD}));
        })();
    }


    // Para clases de estado
    const estadoClass = (estado) => {
        switch (estado) {
            case "Pendiente": return "status pending";
            case "Confirmada": return "status attended";
            case "Completada": return "status confirmed";
            case "Cancelada": return "status canceled";
            default: return "status";
        }
    };

    return (
        <div className="main-content">
            <h2 className="page-title">
                Patient - <span className="patient-name">{pacienteNombre}</span> - appointment history
            </h2>

            <form
                className="search-form"
                onSubmit={handleSearch}
            >
                <div className="search-group">
                    <label htmlFor="status" className="search-label">Estado</label>
                    <select
                        id="status"
                        name="estado"
                        className="search-select"
                        value={historicoCitas.estado}
                        onChange={e=>setHistorico({...historicoCitas, estado: e.target.value})}
                    >
                        {estados.map(estado => (
                            <option key={estado} value={estado}>{estado}</option>
                        ))}
                    </select>
                </div>
                <div className="search-group">
                    <label htmlFor="doctor" className="search-label">Doctor</label>
                    <input
                        type="text"
                        id="doctor"
                        name="doctor"
                        className="search-input"
                        value={historicoCitas.nombreM}
                        onChange={e => setHistorico({...historicoCitas, nombreM: e.target.value})}
                        placeholder="Buscar por nombre"
                    />
                </div>
                <button type="submit" className="search-button" onClick={handleSearch}>Search</button>
            </form>

            <div className="appointments">
                {historicoCitas.citasFiltradas?.length === 0 && (
                    <div className="appointment">
                        <p>No hay citas que coincidan con los filtros.</p>
                    </div>
                )}
                {historicoCitas.citasFiltradas?.map(cita => (
                    <div key={cita.id} className="appointment">
                        <img src={`http://localhost:8080/usuarios/photo/${cita.medico.id}`} alt="Doctor" className="doctor-photo" />
                        <div className="appointment-details">
                            <h3>
                                <span>{cita.medico.nombre}</span>
                                <span className="doctor-code">{cita.medico.costoConsulta}</span>
                            </h3>
                            <h3>{cita.medico.especialidad}</h3>
                            <p className="location">{cita.medico.localidad}</p>
                        </div>
                        <div className="appointment-details">
                            <span className="date">{cita.fecha}</span>
                            <span className="date">{cita.hora}</span>
                        </div>
                        <div>
                            <span className={estadoClass(cita.estado)}>
                                {cita.estado}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default History;