import React, { useState, useEffect } from "react";
import "./Horarios.css";


import {Link, useNavigate} from "react-router-dom";

const diasSemana = [
    "", // Para que el índice 1 sea Lunes
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
];

function HorarioView() {
    const [horarios, setHorarios] = useState([]);
    const [nuevoHorario, setNuevoHorario] = useState({
        dia: 1,
        horaInicio: "",
        horaFin: "",
    });

    const navigate = useNavigate();


    const backend = "http://localhost:8080";
    const token = localStorage.getItem('_token');

    const handleChange = (e) => {
        setNuevoHorario({ ...nuevoHorario, [e.target.name]: e.target.value });
    };

    function handleHorarios(){
        const request = new Request(backend + '/horarios/showIngresoH', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        (async ()=>{
            const response = await fetch(request);
            if (!response.ok) {alert("Error: "+response.status);return;}
            const horarios = await response.json();
            setHorarios(horarios);
        })();
    }

    useEffect(() => {
        handleHorarios();
    }, []);

    const handleAgregar = async (e) => {
        e.preventDefault();

        const request = new Request(backend + '/horarios/ingresarH', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dia: nuevoHorario.dia,
                horaInicio: nuevoHorario.horaInicio,
                horaFin: nuevoHorario.horaFin
            })
        });

        const response = await fetch(request);
        if (!response.ok) {
            alert("Error: " + response.status);
            return;
        }
        setNuevoHorario({ dia: 1, horaInicio: "", horaFin: "" });
        handleHorarios();
    };

    const handleFinalizar = () => {
        navigate("/citasMedico")
    };

    return (

        <div className="editPage">
            <div className="LoginTitule">Horarios</div>
            <div className="loginBlock">
                <div>
                    <table>
                        <thead>
                        <tr>
                            <th>Día de la semana</th>
                            <th>Horario</th>
                        </tr>
                        </thead>
                        <tbody>
                        {horarios.map((horario, idx) => (
                            <tr key={idx}>
                                <td>{horario.diaSemana}</td>
                                <td>
                                    {horario.horaInicio} - {horario.horaFin}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <form onSubmit={handleAgregar}>
                    <p>Nuevo horario</p>
                    <div className="row">
                        <select
                            name="dia"
                            value={nuevoHorario.dia}
                            onChange={handleChange}
                        >
                            {diasSemana.slice(1).map((dia, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {dia}
                                </option>
                            ))}
                        </select>
                        <input
                            type="time"
                            name="horaInicio"
                            value={nuevoHorario.horaInicio}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="time"
                            name="horaFin"
                            value={nuevoHorario.horaFin}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="Loginbutton">
                        <button type="submit">Agregar horario</button>
                    </div>
                </form>

                <div className="Loginbutton">
                    <button type="button" onClick={handleFinalizar}>
                        Volver
                    </button>
                </div>
            </div>
        </div>



    );

};

export default HorarioView;