import React, { useState } from "react";
import "./Horarios.css";


import {Link} from "react-router-dom";

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

    const [horarios, setHorarios] = useState([
        { diaSemana: 1, horaInicio: "08:00", horaFin: "12:00" },
        { diaSemana: 3, horaInicio: "14:00", horaFin: "18:00" },
    ]);
    const [nuevoHorario, setNuevoHorario] = useState({
        dia: 1,
        horaInicio: "",
        horaFin: "",
    });

    const handleChange = (e) => {
        setNuevoHorario({ ...nuevoHorario, [e.target.name]: e.target.value });
    };

    const handleAgregar = (e) => {
        e.preventDefault();
        setHorarios([
            ...horarios,
            {
                diaSemana: parseInt(nuevoHorario.dia),
                horaInicio: nuevoHorario.horaInicio,
                horaFin: nuevoHorario.horaFin,
            },
        ]);
        setNuevoHorario({ dia: 1, horaInicio: "", horaFin: "" });
    };

    const handleFinalizar = () => {
        // Aquí puedes redirigir o realizar otra acción
        alert("Finalizar");
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
                                <td>{diasSemana[horario.diaSemana]}</td>
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