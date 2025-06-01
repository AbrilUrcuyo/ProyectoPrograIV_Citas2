import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

import "./BuscarCitas.css";
import ViewCitaConfirmacion  from "../pacientes/ConfirmView";
// import userImg from '../images/user.png'; // Descomenta si tienes imágenes


// Modifica la función para usar los datos por defecto si no recibe props
function BuscarCitas() {
    const [medicos, setMedicos] = useState([]);
    const [citasPorMedico, setCitasPorMedico] = useState({});
    const backend="http://localhost:8080";
    const [especialidad, setEspecialidad] = useState("");
    const [localidad, setLocalidad] = useState("");
    const navigate = useNavigate();
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [datosCitaSeleccionada, setDatosCitaSeleccionada] = useState(null);
    const medicosFiltrados = medicos.filter(medico => {
        const matchEspecialidad = especialidad === "" || medico.especialidad.toLowerCase().includes(especialidad.toLowerCase());
        const matchLocalidad = localidad === "" || medico.localidad.toLowerCase().includes(localidad.toLowerCase());
        return matchEspecialidad && matchLocalidad;
    });


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
            if (medico.horarios && medico.horarios.length > 0) {
                const horariosPorDia = {};
                medico.horarios.forEach(horario => {
                    const fecha = obtenerProximaFechaDeSemana(horario.diaSemana);
                    if (!horariosPorDia[fecha]) horariosPorDia[fecha] = [];
                    const horas = generarHorasDisponibles(horario.horaInicio, horario.horaFin);
                    horariosPorDia[fecha].push(...horas);
                });

                // Ordena las fechas cronológicamente antes de mapearlas
                const fechasOrdenadas = Object.keys(horariosPorDia).sort((a, b) => {
                    // Convierte "dd/mm/yyyy" a Date para comparar
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
                </form>
            </div>

            <div className="doctor-list">
                {medicos.length > 0 ? (
                    <ul>
                        {medicosFiltrados.map((medico) => (
                            <li key={medico.id}>
                                <div className="doctor-card">
                                    <div>
                                        <div className="doctor-info">
                                            {/* Si usas imágenes locales, reemplaza por una ruta accesible o descomenta import userImg */}
                                            <img src={/*userImg ||*/ `/ruta/por/defecto.jpg`} alt="Doctor"
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
                                                                        citasPorMedico[`${medico.id}O`] &&
                                                                        citasPorMedico[`${medico.id}O`][listaH.key] &&
                                                                        citasPorMedico[`${medico.id}O`][listaH.key].includes(hora)
                                                                    }
                                                                    className="botones"
                                                                    onClick={() => {
                                                                        navigate("/confirmView", {
                                                                            state: {
                                                                                idM: medico.id,
                                                                                fecha: formatearFechaISO(listaH.key),
                                                                                hora: hora,
                                                                                nombreMedico: medico.nombre,
                                                                                localidad: medico.localidad,
                                                                            }
                                                                        });
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
            {/*{mostrarConfirmacion && datosCitaSeleccionada && (*/}
            {/*    <ViewCitaConfirmacion*/}
            {/*        idM={datosCitaSeleccionada.idM}*/}
            {/*        fecha={datosCitaSeleccionada.fecha}*/}
            {/*        hora={datosCitaSeleccionada.hora}*/}
            {/*        nombreMedico={datosCitaSeleccionada.nombreMedico}*/}
            {/*        localidad={datosCitaSeleccionada.localidad}*/}
            {/*        onCerrar={() => setMostrarConfirmacion(false)}*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    );
}

export default BuscarCitas;