import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import "./ConfirmView.css";
import userImg from "../images/user.png";

function ViewCitaConfirmacion({ idM, fecha, hora, nombreMedico, localidad, onCerrar, pagina}) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleConfirmar = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('_token');
        if (!token) {
            alert("Debes iniciar sesión para confirmar una cita.");
            navigate("/login", { state: { pagAnterior: pagina } });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/pacientes/confirmarCita`, {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + token,
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
                navigate("/history");
                onCerrar();
            } else {
                alert("Error al confirmar la cita");
            }
        } catch (error) {
            alert("Error en la comunicación con el servidor");
        }
        setLoading(false);
    };

    // El modal se renderiza en el body usando React Portal
    return ReactDOM.createPortal(
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
        </div>,
        document.body
    );
}

export default ViewCitaConfirmacion;

