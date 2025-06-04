import React, {useEffect, useState} from "react";
import "./PerfilMedico.css";

function PerfilMedicoView({user}) {
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        id: "",
        email: "",
        especialidad: "",
        costoConsulta: 0,
        localidad: "",
        descripcion: "",
        frecuencia: "20",
    });

    const backend = "http://localhost:8080";


    useEffect(() => {
        if (user?.id) {
            traerMedico();
        }
    }, [user]);


    async function traerMedico() {
        const request = new Request(`${backend}/medicos/perfil`, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('_token'),
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        const response = await fetch(request);
        if (!response.ok) {
            alert("Error: " + response.statusText);
            return;
        }

        const medico = await response.json();
        setForm({
            id: medico.id,
            email: medico.email || "",
            especialidad: medico.especialidad || "",
            costoConsulta: medico.costoConsulta || 0,
            localidad: medico.localidad || "",
            descripcion: medico.descripcion || "",
            frecuencia: medico.frecuencia || "20"
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Limpiar errores previos

        console.log(form);
        const request = new Request(`${backend}/medicos/actualizarMedico`, {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('_token'),
                "Accept": "application/json",
                "Content-Type": "application/json",

            },
            body: JSON.stringify(form),
        });

        try {
            const response = await fetch(request);

            if (!response.ok) {
                const errorText = await response.text();
                setError(`Error al guardar: ${errorText}`);
            } else {
                alert("Perfil actualizado exitosamente.");
            }
        } catch (err) {
            console.error(err);
            setError("Error de red o del servidor.");
        }
    };


    return (
        <div className="container">
            <div className="editPage">
                <div className="LoginTitule">Perfil Medico</div>
                <div className="loginBlock">
                    <div className="userImg">
                        <img
                            src={`http://localhost:8080/usuarios/photo/${form.id}`}
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
                                    name="frecuencia"
                                    value={form.frecuencia}
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