import React from "react";
import "./Horarios.css";

function HorarioExtendidoView(props) {
    return <HorarioExtendido {...props} />;
}

function HorarioExtendido({
                              id,
                              fechaInicio,
                              medico,
                              fechas,
                              citas,
                              ocupadas,
                              onPrev,
                              onNext,
                              onGoBack,
                          }) {
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
                                src={`/presentation/usuarios/photo/${medico.id}`}
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
                                {citas[fecha?.trim()] &&
                                    citas[fecha.trim()].map((cita) => (
                                        <li key={cita}>
                                            <button
                                                className="botones"
                                                disabled={
                                                    ocupadas[fecha.trim()] &&
                                                    ocupadas[fecha.trim()].includes(cita)
                                                }
                                                onClick={() =>
                                                    (window.location.href = `/presentation/pacientes/book/${medico.id}/${fecha.replace(
                                                        /\//g,
                                                        "-"
                                                    )}/${cita}`)
                                                }
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
        </div>
    );
}

export default HorarioExtendidoView;
