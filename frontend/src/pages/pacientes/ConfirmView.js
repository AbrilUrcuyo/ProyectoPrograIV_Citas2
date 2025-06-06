import React, { useState } from "react";
import "./ConfirmView.css";
import userImg from "../images/user.png";

function ViewCitaConfirmacion({ idM, fecha, hora, nombreMedico, localidad, onCerrar }) {
    const [loading, setLoading] = useState(false);

    const handleConfirmar = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/pacientes/confirmarCita`, {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('_token'),
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    medicoId: idM,
                    fecha: fecha,
                    hora: hora
                }),
            });

            if (response.ok) {
                alert("Cita confirmada con éxito");
                onCerrar();
            } else {
                alert("Error al confirmar la cita");
            }
        } catch (error) {
            alert("Error en la comunicación con el servidor");
        }
        setLoading(false);
    };

    return (
        <div className="modal-overlay">
            <div className="confirmation-card modal">
                <button className="close-modal" onClick={onCerrar}>×</button>
                <img src={`http://localhost:8080/usuarios/photo/${idM}`} alt="Doctor" className="doctor-photo" />
                <div className="doctor-name">
                    <p>{nombreMedico}</p>
                </div>
                <div className="cita-location">
                    <p>{`${fecha} ${hora}`}</p>
                </div>
                <div className="cita-location">
                    <p>{localidad}</p>
                </div>
                <div className="action-buttons">
                    <button className="confirmar-btn" onClick={handleConfirmar} disabled={loading}>
                        {loading ? "Confirmando..." : "Confirmar"}
                    </button>
                    <button className="cancelar-btn" onClick={onCerrar} disabled={loading}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ViewCitaConfirmacion;

