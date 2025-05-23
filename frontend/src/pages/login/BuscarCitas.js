import React, { useState } from "react";
import "./BuscarCitas.css";
// import userImg from '../images/user.png'; // Descomenta si tienes imágenes

// Datos de ejemplo por defecto
const defaultMedicos = [
    {
        id: 1,
        nombre: "Dra. Ana Pérez",
        especialidad: "Cardiología",
        localidad: "San José",
        costoConsulta: "₡35,000"
    },
    {
        id: 2,
        nombre: "Dr. Luis Gómez",
        especialidad: "Dermatología",
        localidad: "Heredia",
        costoConsulta: "₡30,000"
    }
];

const defaultCitasPorMedico = {
    "1H": [
        { key: "20/05/2025", value: ["08:00", "09:00", "10:00"] },
        { key: "21/05/2025", value: ["11:00", "12:00"] }
    ],
    "1O": {
        "20/05/2025": ["09:00"], // 09:00 está ocupada
        "21/05/2025": []
    },
    "2H": [
        { key: "20/05/2025", value: ["13:00", "14:00"] }
    ],
    "2O": {
        "20/05/2025": []
    }
};

const defaultFechaAct = "20-05-2025";

// Modifica la función para usar los datos por defecto si no recibe props
function BuscarCitas({
    medicos = defaultMedicos,
    citasPorMedico = defaultCitasPorMedico,
    fechaAct = defaultFechaAct
}) {
    const [especialidad, setEspecialidad] = useState("");
    const [localidad, setLocalidad] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí deberías llamar a tu API o función de búsqueda
        // Ejemplo: buscarMedicos(especialidad, localidad)
    };

    return (
        <div className="search-container">
            <div className="search-form">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="especialidad"
                        placeholder="Especialidad"
                        value={especialidad}
                        onChange={e => setEspecialidad(e.target.value)}
                    />
                    <input
                        type="text"
                        name="localidad"
                        placeholder="Ciudad o Provincia"
                        value={localidad}
                        onChange={e => setLocalidad(e.target.value)}
                    />
                    <button type="submit">Buscar</button>
                </form>
            </div>

            <div className="doctor-list">
                {medicos.length > 0 ? (
                    <ul>
                        {medicos.map(medico => (
                            <li key={medico.id}>
                                <div className="doctor-card">
                                    <div>
                                        <div className="doctor-info">
                                            <img src="#" alt="Doctor" className="doctor-photo" />
                                            <div className="doctor-details">
                                                <h3>
                                                    <span>{medico.nombre}</span>
                                                    <span className="doctor-code">{medico.costoConsulta}</span>
                                                </h3>
                                                <p>{medico.especialidad}</p>
                                            </div>
                                        </div>
                                        <div className="doctor-location">
                                            <span>Donde consulta</span>
                                            <span className="location-pin">@</span>
                                            <span>{medico.localidad}</span>
                                        </div>
                                    </div>

                                    {/* Horarios disponibles */}
                                    {(citasPorMedico[`${medico.id}H`] || []).map(listaH => (
                                        <div className="citas" key={listaH.key}>
                                            <div className="cita-day">
                                                <div className="cita-date">{listaH.key}</div>
                                                <div className="cita-times">
                                                    <ul className="lista-horas">
                                                        {listaH.value.map(hora => (
                                                            <li key={hora}>
                                                                <a href={`/presentation/pacientes/book/${medico.id}/${listaH.key.replace(/\//g, "-")}/${hora}`}>
                                                                    <button
                                                                        disabled={
                                                                            (citasPorMedico[`${medico.id}O`] &&
                                                                            citasPorMedico[`${medico.id}O`][listaH.key] &&
                                                                            citasPorMedico[`${medico.id}O`][listaH.key].includes(hora))
                                                                        }
                                                                        className="botones"
                                                                    >
                                                                        {hora}
                                                                    </button>
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button className="schedule-btn">
                                        <a href={`/presentation/horarios/show/${medico.id}/${fechaAct}`}>Schedule →</a>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay médicos para mostrar.</p>
                )}
            </div>
        </div>
    );
}

export default BuscarCitas;