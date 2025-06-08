import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import "./BuscarCitas.css";
import { AppContext } from '../../AppProvider';
import ViewCitaConfirmacion from "../pacientes/ConfirmView";


// Modifica la función para usar los datos por defecto si no recibe props
function BuscarCitas() {
    const {buscarCitas, setBuscarCitas} = useContext(AppContext);

    const [medicos, setMedicos] = useState([]);
    const [citasPorMedico, setCitasPorMedico] = useState({});
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [datosCitaSeleccionada, setDatosCitaSeleccionada] = useState(null);
    const backend="http://localhost:8080";
    const [especialidad, setEspecialidad] = useState("");
    const [localidad, setLocalidad] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem('_token');


    useEffect(() => {
        // Si no hay médicos filtrados, hacer búsqueda inicial
        if (!buscarCitas.medicosFiltrados) {
            handleSearch();
        } else {
            setMedicos(buscarCitas.medicosFiltrados);
        }
        handleList(); // Obtener información adicional
    }, []);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        const request = new Request(backend + '/buscar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                especialidad: buscarCitas.especialidad,
                localidad: buscarCitas.localidad,
            })
        });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) {
                alert("Error: " + response.status);
                return;
            }
            const medicos = await response.json();
            setMedicos(medicos || []);
            setBuscarCitas(prev=> ({...prev, medicosFiltrados: medicos}));
        })();
    }
    // Función auxiliar para obtener la próxima fecha de un día de la semana (1=Lunes, 7=Domingo)
    function obtenerProximaFechaDeSemana(diaSemana) {
        const hoy = new Date();
        const diaActual = hoy.getDay() === 0 ? 7 : hoy.getDay(); // JS: 0=Domingo
        const diff = (diaSemana - diaActual + 7) % 7;
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + diff);
        // Fuerza formato dd/mm/yyyy con ceros a la izquierda
        const day = String(fecha.getDate()).padStart(2, '0');
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const year = fecha.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Genera horas disponibles entre inicio y fin según la frecuencia (en minutos)
    function generarHorasDisponibles(horaInicio, horaFin, frecuenciaMin) {
    const [hIni, mIni] = horaInicio.split(':').map(Number);
    const [hFin, mFin] = horaFin.split(':').map(Number);
    const horas = [];
    let current = new Date(0, 0, 0, hIni, mIni, 0);
    const end = new Date(0, 0, 0, hFin, mFin, 0);

    while (current < end) {
        const hh = String(current.getHours()).padStart(2, '0');
        const mm = String(current.getMinutes()).padStart(2, '0');
        const horaStr = `${hh}:${mm}`; // Siempre "HH:mm"
        horas.push(horaStr);
        current.setMinutes(current.getMinutes() + frecuenciaMin);
    }
    return horas;
    }

// --- En adaptarDatosBackend ---
    function adaptarDatosBackend(medicosBackend) {
        const medicos = [];
        const citasPorMedico = {};

        medicosBackend.forEach(medico => {
            medicos.push({
                id: medico.id,
                nombre: medico.nombre,
                especialidad: medico.especialidad,
                costoConsulta: `₡${medico.costoConsulta.toLocaleString()}`,
                localidad: medico.localidad
            });

            // Adaptar horarios disponibles usando la frecuencia de cada médico
            if (medico.horarios && medico.horarios.length > 0) {
                const horariosPorDia = {};
                medico.horarios.forEach(horario => {
                    const fecha = obtenerProximaFechaDeSemana(horario.diaSemana);
                    if (!horariosPorDia[fecha]) horariosPorDia[fecha] = [];
                    const horas = generarHorasDisponibles(
                        horario.horaInicio,
                        horario.horaFin,
                        medico.frecCitas || 30 // Usa 30 como valor por defecto si no viene
                    );
                    horariosPorDia[fecha].push(...horas);
                });

                const fechasOrdenadas = Object.keys(horariosPorDia).sort((a, b) => {
                    const [da, ma, ya] = a.split('/').map(Number);
                    const [db, mb, yb] = b.split('/').map(Number);
                    return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
                });

                citasPorMedico[`${medico.id}H`] = fechasOrdenadas.map(key => ({
                    key,
                    value: horariosPorDia[key]
                }));
            } else {
                citasPorMedico[`${medico.id}H`] = [];
            }

            // Adaptar citas ocupadas
            citasPorMedico[`${medico.id}O`] = {};
            if (Array.isArray(medico.citasOcupadas)) {
                medico.citasOcupadas.forEach(cita => {
                    const [anio, mes, dia] = cita.fecha.split("-");
                    const fechaFormateada = `${dia.padStart(2, "0")}/${mes.padStart(2, "0")}/${anio}`;
                    if (!citasPorMedico[`${medico.id}O`][fechaFormateada]) {
                        citasPorMedico[`${medico.id}O`][fechaFormateada] = [];
                    }
                    // Asegura formato "HH:mm"
                    const [h, m] = cita.hora.split(':');
                    const horaSolo = `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
                    citasPorMedico[`${medico.id}O`][fechaFormateada].push(horaSolo);
                });
            }
        });

        return { medicos, citasPorMedico };
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

    function formatearFechaISO(fecha) {
        const [dia, mes, anio] = fecha.split("/");
        return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
    }

    function obtenerFechaActualMasUnaSemana() {
        const hoy = new Date();
        hoy.setDate(hoy.getDate() + 7);
        const year = hoy.getFullYear();
        const month = String(hoy.getMonth() + 1).padStart(2, '0'); // Obtiene los meses de 0 a 11, por eso se le suma 1, también se usa padStart para asegurar que tenga dos dígitos
        const day = String(hoy.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return (
        <div className="search-container">
            <div className="search-form">
                <form onSubmit={e=>e.preventDefault}>
                    <input
                        type="text"
                        name="especialidad"
                        placeholder="Especialidad"
                        value={buscarCitas.especialidad}
                        onChange={e => setBuscarCitas({...buscarCitas, especialidad: e.target.value})}
                    />
                    <input
                        type="text"
                        name="localidad"
                        placeholder="Ciudad o Provincia"
                        value={buscarCitas.localidad}
                        onChange={e => setBuscarCitas({...buscarCitas, localidad: e.target.value})}
                    />

                </form>
                <button type="submit" className="search-button" onClick={handleSearch}>Search</button>
            </div>

            <div className="doctor-list">
                {medicos.length > 0 ? (
                    <ul>
                        {buscarCitas.medicosFiltrados?.map((medico) => (
                            <li key={medico.id}>
                                <div className="doctor-card">
                                    <div>
                                        <div className="doctor-info">
                                            {/* Si usas imágenes locales, reemplaza por una ruta accesible o descomenta import userImg */}
                                            <img src={`http://localhost:8080/usuarios/photo/${medico.id}`} alt="Doctor"
                                                 className="doctor-photo"/>
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


                                    {(citasPorMedico[`${medico.id}H`] || []).map((listaH) => (
                                        <div className="citas" key={listaH.key}>
                                            <div className="cita-day">
                                                <div className="cita-date">{listaH.key}</div>
                                                <div className="cita-times">
                                                    <ul className="lista-horas">
                                                        {listaH.value.map((hora) => (
                                                            <li key={hora}>
                                                                <button
                                                                    disabled={
                                                                        Array.isArray(citasPorMedico[`${medico.id}O`]?.[listaH.key]) &&
                                                                        citasPorMedico[`${medico.id}O`][listaH.key].includes(hora)
                                                                    }
                                                                    className="botones"
                                                                    onClick={() => {
                                                                        setDatosCitaSeleccionada({
                                                                            idM: medico.id,
                                                                            fecha: formatearFechaISO(listaH.key),
                                                                            hora: hora,
                                                                            nombreMedico: medico.nombre,
                                                                            localidad: medico.localidad,
                                                                        });
                                                                        setMostrarConfirmacion(true);
                                                                    }}
                                                                >
                                                                    {hora}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        className="schedule-btn"
                                        onClick={() => navigate(`/HorarioExtend/${medico.id}/${obtenerFechaActualMasUnaSemana()}`)}
                                    >
                                        Schedule →
                                    </button>

                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay médicos para mostrar.</p>
                )}
            </div>

            {/*Renderizado condicional del componente de confirmación */}
            {mostrarConfirmacion && datosCitaSeleccionada && (
                <ViewCitaConfirmacion
                    {...datosCitaSeleccionada}
                    onCerrar={() => setMostrarConfirmacion(false)}
                    onCitaConfirmada={handleList}
                />
            )}
        </div>
    );
}

export default BuscarCitas;