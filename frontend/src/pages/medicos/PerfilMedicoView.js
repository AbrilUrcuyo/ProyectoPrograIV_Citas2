import React, { useState } from "react";
import "./PerfilMedico.css";

function PerfilMedicoView({ medico, error, onSubmit }) {
    const [form, setForm] = useState({
        id: medico.id || "",
        email: medico.email || "",
        especialidad: medico.especialidad || "",
        costoConsulta: medico.costoConsulta || "",
        localidad: medico.localidad || "",
        descripcion: medico.descripcion || "",
        frecCitas: medico.frecCitas || "20",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(form);
    };

    return (
        <div className="container">
            <div className="editPage">
                <div className="LoginTitule">Perfil Medico</div>
                <div className="loginBlock">
                    <div className="userImg">
                        <img
                            src={`/presentation/usuarios/photo/${form.id}`}
                            alt="Foto del médico"
                            style={{ width: "20%" }}
                        />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <input type="hidden" name="id" value={form.id} />
                        {error && error !== "" && (
                            <div className="warning">
                                <div>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}
                        <div className="row">
                            <div className="LogininputText">
                                <div className="editText">Email:</div>
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Correo"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="LogininputText">
                                <div className="editText">Especialidad:</div>
                                <input
                                    type="text"
                                    name="especialidad"
                                    placeholder="Especialidad"
                                    required
                                    value={form.especialidad}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="LogininputText">
                                <div className="editText">Costo:</div>
                                <input
                                    type="number"
                                    name="costoConsulta"
                                    placeholder="Monto"
                                    required
                                    value={form.costoConsulta}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="LogininputText">
                                <div className="editText">Localidad:</div>
                                <input
                                    type="text"
                                    name="localidad"
                                    placeholder="Localidad"
                                    required
                                    value={form.localidad}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="LogininputText">
                                <div className="editText">Descripcion:</div>
                                <input
                                    type="text"
                                    name="descripcion"
                                    placeholder="Descripcion"
                                    required
                                    value={form.descripcion}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="LogininputText">
                                <div className="editText">Frecuencias citas:</div>
                                <select
                                    name="frecCitas"
                                    value={form.frecCitas}
                                    onChange={handleChange}
                                >
                                    <option value="20">20 min</option>
                                    <option value="30">30 min</option>
                                    <option value="60">1 Hora</option>
                                </select>
                            </div>
                        </div>
                        <div className="Loginbutton">
                            <button type="submit">Guardar Cambios</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PerfilMedicoView;