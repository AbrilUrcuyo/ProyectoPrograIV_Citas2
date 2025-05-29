import React, {useEffect, useState} from "react";
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
                         fechaAct = defaultFechaAct
                     }) {
    const [medicos, setMedicos] = useState([]);
    const [citasPorMedico, setCitasPorMedico] = useState({});
    const backend="http://localhost:8080";
    const [especialidad, setEspecialidad] = useState("");
    const [localidad, setLocalidad] = useState("");


    useEffect(()=>{
        if(medicos.length === 0)
            handleList();
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí deberías llamar a tu API o función de búsqueda
        // Ejemplo: buscarMedicos(especialidad, localidad)
    };

    function adaptarDatosBackend(medicosBackend) {
        const medicos = [];
        const citasPorMedico = {};

        medicosBackend.forEach(medico => {
            // Adaptar datos básicos
            medicos.push({
                id: medico.id,
                nombre: medico.nombre,
                especialidad: medico.especialidad,
                costoConsulta: `₡${medico.costoConsulta.toLocaleString()}`,
                localidad: medico.localidad
            });

            // Adaptar horarios disponibles (simulación: agrupa por día de la semana)
            // Aquí puedes adaptar según tu lógica real de fechas
            if (medico.horarios && medico.horarios.length > 0) {
                // Agrupa por día de la semana (ejemplo simple)
                const horariosPorDia = {};
                medico.horarios.forEach(horario => {
                    // Suponiendo que tienes una función para obtener la próxima fecha de ese día de la semana
                    const fecha = obtenerProximaFechaDeSemana(horario.diaSemana);
                    if (!horariosPorDia[fecha]) horariosPorDia[fecha] = [];
                    // Genera las horas disponibles (ejemplo: cada hora entre inicio y fin)
                    const horas = generarHorasDisponibles(horario.horaInicio, horario.horaFin);
                    horariosPorDia[fecha].push(...horas);
                });
                citasPorMedico[`${medico.id}H`] = Object.entries(horariosPorDia).map(([key, value]) => ({
                    key, value
                }));
            } else {
                citasPorMedico[`${medico.id}H`] = [];
            }

            // Adaptar citas ocupadas (simulación: vacío)
            citasPorMedico[`${medico.id}O`] = {}; // Llena según tus datos reales
        });

        return { medicos, citasPorMedico };
    }

    // Función auxiliar para obtener la próxima fecha de un día de la semana (1=Lunes, 7=Domingo)
    function obtenerProximaFechaDeSemana(diaSemana) {
        const hoy = new Date();
        const diaActual = hoy.getDay() === 0 ? 7 : hoy.getDay(); // JS: 0=Domingo
        const diff = (diaSemana - diaActual + 7) % 7;
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + diff);
        return fecha.toLocaleDateString('es-CR'); // "dd/mm/yyyy"
    }

    // Genera horas disponibles entre inicio y fin (formato "HH:mm:ss")
    function generarHorasDisponibles(horaInicio, horaFin) {
        const [hIni, mIni] = horaInicio.split(':').map(Number);
        const [hFin, mFin] = horaFin.split(':').map(Number);
        const horas = [];
        for (let h = hIni; h < hFin; h++) {
            horas.push(`${h.toString().padStart(2, '0')}:00`);
        }
        return horas;
    }

    // Modifica handleList para usar la adaptación:
    function handleList(){
        const request = new Request(backend+"/", {method: "GET",
            headers:{"Accept":"application/json","Content-Type":"application/json"}});
        (async ()=>{
            const response = await fetch(request);
            if(!response.ok){
                alert("Error: "+ response.statusText);
                return;
            }
            const medicosBackend = await response.json();
            const { medicos, citasPorMedico } = adaptarDatosBackend(medicosBackend);
            setMedicos(medicos);
            setCitasPorMedico(citasPorMedico);
        })();
    }

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
                                            <img src={`C:/AAA/images/${medico.id}.jpg`} alt="Doctor" className="doctor-photo" />
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