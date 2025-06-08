import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import "./Horarios.css";
import ViewCitaConfirmacion from "../pacientes/ConfirmView"; // Añade esta importación

function HorarioExtendidoView() {
    const { idMedico, fecha } = useParams();
    return <HorarioExtendido idMedico={idMedico} fechaI={fecha} />;
}

function HorarioExtendido({idMedico, fechaI}) {
    const [fecha, setFecha] = useState(fechaI);
    const [medico, setMedico] = useState({});
    const [fechas, setFechas] = useState([]);
    const [citas, setCitas] = useState({});
    const [ocupadas, setOcupadas] = useState({});
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [datosCitaSeleccionada, setDatosCitaSeleccionada] = useState(null);
    const navigate = useNavigate();


    const backend = "http://localhost:8080";
    const token = localStorage.getItem('_token');

    function onPrev() {
        // Fecha actual del estado
        const fechaActual = new Date(fecha);

        // Fecha de hoy (sin horas/minutos/segundos)
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Nueva fecha retrocediendo una semana
        const nuevaFecha = new Date(fechaActual);
        nuevaFecha.setDate(nuevaFecha.getDate() - 7);

        // Solo retrocede si la nueva fecha no es menor a hoy
        if (nuevaFecha >= hoy) {
            const year = nuevaFecha.getFullYear();
            const month = String(nuevaFecha.getMonth() + 1).padStart(2, '0');
            const day = String(nuevaFecha.getDate()).padStart(2, '0');
            setFecha(`${year}-${month}-${day}`);
        }
    }

    function onNext(){
        const fechaObj = new Date(fecha);
        fechaObj.setDate(fechaObj.getDate() + 7);
        const year = fechaObj.getFullYear();
        const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
        const day = String(fechaObj.getDate()).padStart(2, '0');
        setFecha(`${year}-${month}-${day}`);
    }
    function onGoBack(){
        navigate("/");
    }

    useEffect(() => {
        if (idMedico && fecha) {
            handleHorario();
        }
    }, [fecha, idMedico]);

    // Agrégala junto a las otras funciones auxiliares
    function formatearFechaISO(fecha) {
        const [dia, mes, anio] = fecha.split(/[-\/]/);
        return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }

    // Agrega esta función dentro del componente HorarioExtendido
    function handleHorario() {
        const request = new Request(backend + '/horarios/show/' + idMedico + '/' + fecha, {
            method: 'GET'
        });
        (async () => {
            const response = await fetch(request);
            if (!response.ok) {
                alert("Error: " + response.status);
                return;
            }
            const datos = await response.json();
            setMedico({
                ...datos.medico,
                nombre: datos.medico.nombre || '',
                localidad: datos.medico.localidad || ''
            });
            setFechas(datos.fechas);
            setCitas(datos.citas);
            setOcupadas(datos.ocupadas);
        })();
    }

    return (
        <div className="container">
            <div className="editPage">
                <div className="container-Fer row space-evenly">
                    <div>
                        <button className="botones" onClick={onPrev}>
                            <img src="/images/flecha-izquierda.png" alt="Prev" />
                            Prev
                        </button>
                    </div>

                    <div>
                        <div className="userImg">
                            <img
                                src={`http://localhost:8080/usuarios/photo/${medico.id}`}
                                alt="Medico"
                            />
                            <div>
                                <b>
                                    <span>{medico.nombre}</span>{" "}
                                    <span className="costo-consulta">
                    {medico.costoConsulta}
                  </span>
                                </b>
                                <p>{medico.especialidad}</p>
                            </div>
                        </div>
                        <div>
                            <p>{medico.localidad}</p>
                        </div>
                    </div>

                    {fechas.map((fecha) => (
                        <div key={fecha}>
                            <p className="cita-date">{fecha}</p>
                            <ul className="lista-horas">
                                {citas[fecha.trim()] && citas[fecha.trim()].map((cita) => (
                                    <li key={cita}>
                                        <button
                                            className="botones"
                                            disabled={ocupadas[fecha.trim()] && ocupadas[fecha.trim()].includes(cita)}
                                            onClick={() => {
                                                setDatosCitaSeleccionada({
                                                    idM: idMedico,
                                                    fecha: formatearFechaISO(fecha),
                                                    hora: cita,
                                                    nombreMedico: medico.nombre,
                                                    localidad: medico.localidad,
                                                });
                                                setMostrarConfirmacion(true);
                                            }}
                                        >
                                            {cita}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div>
                        <button className="botones" onClick={onNext}>
                            <img src="/images/flecha-derecha.png" alt="Next" />
                            Next
                        </button>
                    </div>
                </div>

                <div className="center">
                    <button className="anclado" onClick={onGoBack}>
                        Go Back
                    </button>
                </div>
            </div>

            {mostrarConfirmacion && datosCitaSeleccionada && (
                <ViewCitaConfirmacion
                    {...datosCitaSeleccionada}
                    onCerrar={() => setMostrarConfirmacion(false)}
                    onCitaConfirmada={handleHorario} // Esto actualizará los datos después de confirmar
                />
            )}
        </div>


    );
}

export default HorarioExtendidoView;