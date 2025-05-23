
import React from "react";
import "./ConfirmView.css";

import userImg from '../images/user.png';


// Esto tiene datos quemados

function ViewCitaConfirmacion() {
    // Datos quemados de ejemplo
    const medico = {
        id: 1,
        nombre: "Dr. Juan Pérez",
        localidad: "San José, Costa Rica",
    };
    const fecha = "2025-05-15";
    const hora = "10:30 AM";
    const idM = medico.id;

    return (

            <div className="container-confir-citas">
                <div className="confirmation-card">
                    <img
                        src={userImg}
                        alt="Doctor"
                        className="doctor-photo"
                    />

                    <div className="doctor-name">
                        <p>{medico.nombre}</p>
                    </div>

                    <div className="cita-location">
                        <p>{`${fecha} ${hora}`}</p>
                    </div>

                    <div className="cita-location">
                        <p>{medico.localidad}</p>
                    </div>

                    <div className="action-buttons">
                        <a href={`/presentation/pacientes/confirmarCita/${idM}/${fecha}/${hora}`}>
                            <button className="confirmar-btn">Confirmar</button>
                        </a>
                        <a href="/presentation/usuarios/index/show">
                            <button className="cancelar-btn">Cancelar</button>
                        </a>
                    </div>
                </div>
            </div>


    );
};

export default ViewCitaConfirmacion;