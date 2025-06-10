import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import './LoginView.css';

import userImg from '../images/user.png';
import cuentaImg from '../images/cuenta.png';
import llaveImg from '../images/llave.png';
import credeImg from '../images/credenciales.png';
import camaraImg from '../images/camara.png';



function RegisterView() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [name, setName] = useState('');
    const [userType, setUserType] = useState('Paciente');
    const [photo, setPhoto] = useState(null);
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordConfirm) {
            alert("Las contraseñas no coinciden");
            return;
        }

        const formData = new FormData();
        formData.append("user", username); // <-- antes decía username
        formData.append("password", password);
        formData.append("confirm", passwordConfirm); // <-- antes no se incluía
        formData.append("name", name);
        formData.append("userType", userType);
        formData.append("photo", photo);


        try {
            const response = await fetch("http://localhost:8080/usuarios/Register", { // <-- ahora con R mayúscula
                method: "POST",
                body: formData
            });

            const contentType = response.headers.get("content-type");
            if (response.ok) {
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    alert(data.message || "Usuario registrado correctamente");
                    console.log("Respuesta:", data);
                    navigate("/login");
                } else {
                    const text = await response.text();
                    alert(text);
                    console.log("Respuesta:", text);
                    navigate("/login");
                }
            } else {
                const errorText = await response.text();
                console.error("Error del servidor:", errorText);
                alert(errorText || "Error al registrar usuario");
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);
            alert("Error de red aaaaa: " + err.message);
        }
    };


    return (
        <View
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            passwordConfirm={passwordConfirm}
            setPasswordConfirm={setPasswordConfirm}
            name={name}
            setName={setName}
            userType={userType}
            setUserType={setUserType}
            photo={photo}
            setPhoto={setPhoto}
            handleSubmit={handleSubmit}
        />
    );
};


function View({
                  username, setUsername,
                  password, setPassword,
                  passwordConfirm, setPasswordConfirm,
                  name, setName,
                  userType, setUserType,
                  photo, setPhoto,
                  handleSubmit
              }){
    return (
        <div className="container">
            <div className="LoginPage">
                <div className="LoginTitule">Register</div>
                <div className="loginBlock">
                    <div className="userImg">
                        <img src={userImg} alt="userIMG" width="20%" />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="LogininputText">
                                <div className="icon">
                                    <img src={cuentaImg} alt="iconUimg" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="User name"
                                    required
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="LogininputText">
                                <div className="icon">
                                    <img src={llaveImg} alt="iconUimg" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="User password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="LogininputText">
                                <div className="icon">
                                    <img src={llaveImg} alt="iconUimg" />
                                </div>
                                <input
                                    type="password"
                                    name="passwordConfirm"
                                    placeholder="Confirm password"
                                    required
                                    value={passwordConfirm}
                                    onChange={e => setPasswordConfirm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="LogininputText">
                                <div className="icon">
                                    <img src={credeImg} alt="iconUimg" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="LogininputText">
                                <div className="icon">
                                    <img src={credeImg} alt="iconUimg" />
                                </div>
                                <select
                                    name="userType"
                                    value={userType}
                                    onChange={e => setUserType(e.target.value)}
                                >
                                    <option value="Paciente">Paciente</option>
                                    <option value="Medico">Medico</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="LogininputText">
                                <div className="icon">
                                    <img src={camaraImg} alt="camara.png" />
                                </div>
                                <input
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    required
                                    onChange={e => setPhoto(e.target.files[0])}
                                />
                            </div>
                        </div>

                        <div className="Register">
                            <button type="submit">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );


}

export default RegisterView;