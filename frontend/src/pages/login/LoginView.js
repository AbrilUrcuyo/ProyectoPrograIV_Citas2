import { useNavigate } from 'react-router-dom';
import './LoginView.css';

import userImg from '../images/user.png';
import cuentaImg from '../images/cuenta.png';
import llaveImg from '../images/llave.png';
import {Link} from "react-router-dom";
import {decodeToken} from "../../App";
import {useState} from "react"; // corregido

function LoginView ({setUser}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // ...existing code...
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8080/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: username,
                    clave: password
                })
            });
            if (!response.ok) {
                setError('Usuario o contraseña incorrectos');
                return;
            }
            const data = await response.json();
            // Guarda el token en localStorage
            localStorage.setItem('_token', data.token);
            const userData = decodeToken(data.token);
            setUser(userData);
            navigate('/');
            // Aquí puedes redirigir según el rol si lo deseas
            // Por ejemplo: window.location.href = "/admin";
        } catch (err) {
            setError('Error de conexión con el servidor');
        }
        setUsername('');
        setPassword('');
    };

    return (
        <div className="container">
            <div className="LoginPage">
                <div className="LoginTitule">LOGIN</div>
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
                                    id="username"
                                    name="username"
                                    placeholder="User name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
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
                                    id="password"
                                    name="password"
                                    placeholder="User password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="Loginbutton">
                            <button type="submit">Log in</button>
                        </div>
                        {error && (
                            <div className="warning">
                                <div><span>{error}</span></div>
                            </div>
                        )}
                    </form>
                </div>
                <div className="LoginEnd">
                    <div>Don't have an account?</div>
                    <div>
                        <p> <Link to="/register">Register Here</Link> </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginView;