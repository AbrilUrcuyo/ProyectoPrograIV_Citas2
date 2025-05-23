import React, { useState } from "react";
import userImg from '../images/user.png';
import "./History.css";

// Datos de ejemplo quemados
const citasEjemplo = [
    {
        id: 1,
        medico: {
            nombre: "Dr. Juan Pérez",
            especialidad: "Cardiología",
            localidad: "San José, Costa Rica",
            costoConsulta: "₡35,000"
        },
        fecha: "2025-05-10",
        hora: "09:00 AM",
        estado: "Pendiente"
    },
    {
        id: 2,
        medico: {
            nombre: "Dra. Ana Gómez",
            especialidad: "Dermatología",
            localidad: "Heredia, Costa Rica",
            costoConsulta: "₡30,000"
        },
        fecha: "2025-05-12",
        hora: "11:30 AM",
        estado: "Confirmada"
    },
    {
        id: 3,
        medico: {
            nombre: "Dr. Luis Ramírez",
            especialidad: "Pediatría",
            localidad: "Alajuela, Costa Rica",
            costoConsulta: "₡28,000"
        },
        fecha: "2025-05-14",
        hora: "02:00 PM",
        estado: "Completada"
    }
];

const estados = ["Todas", "Pendiente", "Confirmada", "Completada", "Cancelada"];

function History() {
    const [filterE, setFilterE] = useState("Todas");
    const [filterD, setFilterD] = useState("");
    const [citas] = useState(citasEjemplo);

    const pacienteNombre = "Juan Morales"; // Cambia por el nombre real si lo tienes

    // Filtrado simple
    const citasFiltradas = citas.filter(cita => {
        const matchEstado = filterE === "Todas" || cita.estado === filterE;
        const matchDoctor = cita.medico.nombre.toLowerCase().includes(filterD.toLowerCase());
        return matchEstado && matchDoctor;
    });

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
                onSubmit={e => e.preventDefault()}
            >
                <div className="search-group">
                    <label htmlFor="status" className="search-label">Estado</label>
                    <select
                        id="status"
                        name="estado"
                        className="search-select"
                        value={filterE}
                        onChange={e => setFilterE(e.target.value)}
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
                        value={filterD}
                        onChange={e => setFilterD(e.target.value)}
                        placeholder="Buscar por nombre"
                    />
                </div>
                <button type="submit" className="search-button">Search</button>
            </form>

            <div className="appointments">
                {citasFiltradas.length === 0 && (
                    <div className="appointment">
                        <p>No hay citas que coincidan con los filtros.</p>
                    </div>
                )}
                {citasFiltradas.map(cita => (
                    <div key={cita.id} className="appointment">
                        <img src={userImg} alt="Doctor" className="doctor-photo" />
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