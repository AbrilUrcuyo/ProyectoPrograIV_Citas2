import logo from './logo.svg';
import './App.css';
import {Link, BrowserRouter, Routes, Route, Router} from 'react-router-dom'


import LoginView from './pages/login/LoginView';
import RegisterView from './pages/login/RegisterView';
import HistoryView from './pages/pacientes/History';
import HorarioView from './pages/horarios/HorarioView';
import HorarioExtendidoView from "./pages/horarios/HorarioExtendidoView";

import telefono from './pages/images/telefono.png';
import headerLogo from './pages/images/doctorHeader.jpg';
import instaImage from './pages/images/instagram.png';
import facebookImage from './pages/images/facebook.png';
import twitterImg from './pages/images/logotipo-de-twitter.png';
import React, {Profiler, useState} from "react";
import ConfirmView from "./pages/pacientes/ConfirmView";
import BuscarCitas from "./pages/login/BuscarCitas";
import AdminView from "./pages/admin/medicosPendientes";
import PerfilMedicoView from "./pages/medicos/PerfilMedicoView";
import GestionCitas from "./pages/medicos/GestionCitas";

function Header({user, setUser}) {
    const[visible, setVisible] = useState(false);
    const backend="http://localhost:8080";

    function handleLogin(user){
        let url = backend+'/usuarios/login';
        const request = new Request(url,
            {method: "POST",headers:{'Content-Type': 'application/json'}, body: JSON.stringify(user)});
        (async ()=>{
            const response = await fetch(request);
            if(!response.ok){ alert("Error:"+response.status);return;}
            const token = await response.text();
            localStorage.setItem('_token', token);
            setUser(getUser(token));
            setVisible(true);
        })();
    }

    function getUser(token){
        try {
            const parts =token.split('.');
            if(parts.length !== 3){
                throw new Error('Invalid JNT format');
            }
            const payloadEnconded= parts[1];
            const payload= JSON.parse(atob(payloadEnconded));
            return {id:payload.id, rol:payload.scope[0], name: payload.name};

        }catch(error){
            console.error('Error decoding JNT: ',error);
            return null;
        }
    }

    function logout() {
        localStorage.removeItem('_token');
        setUser({ id: null, rol: '', name: '' });
    }

    let links;

    if (!user.id) {
        // Usuario no autenticado
        links = (
            <>
                <p><Link to="/">Search</Link></p>
                <p><Link to="/login">Login</Link></p>
            </>
        );
    } else if (user.rol === "Paciente") {
        links = (
            <>
                <p><Link to="/history">History</Link></p>
                <p><Link to="/">Search</Link></p>
                <p>{user.name}</p>
                <p><button onClick={logout}>Logout</button></p>
            </>
        );
    } else if (user.rol === "Medico") {
        links = (
            <>
                <p><Link to="/HorarioView">Appointments</Link></p>
                <p><Link to="/HorarioExtend">Profile</Link></p>
                <p><Link to="/HorarioExtend">Ingresar Horario</Link></p>
                <p>Dr. {user.name}</p>
                <p><button onClick={logout}>Logout</button></p>
            </>
        );
    } else if (user.rol === "Admin") {
        links = (
            <>
                <p><Link to="/admin">Aprove doctor</Link></p>
                <p>Admin: {user.name}</p>
                <p><button onClick={logout}>Logout</button></p>
            </>
        );
    }
    return (
        <header className="App-header">
            <div className="logo">
                <img src={headerLogo} alt="doctorIMG"/>
                <h1>Medical Appointments</h1>
            </div>

            <div className="phone">
                <img src={telefono} alt="phone"/>
                +506 5467 0937
            </div>

            <div className="nav-links">
                {links}
            </div>
        </header>

    );
}

function App() {
    const[user, setUser]= useState({id:null, rol:'', name:''});
    return (
        <div className="App">
            <BrowserRouter>
                <Header user={user} setUser={setUser}/>
                <Main user={user} setUser={setUser} />
                <Footer />
            </BrowserRouter>
        </div>
    );
}

function Main() {

  return (
      <div className="App-main">
        <Routes>
          <Route exact path="/" element={<GestionCitas />}/>
          <Route exact path="/login" element={<LoginView />}/>
          <Route exact path="/register" element={<RegisterView />}/>
          <Route exact path="/confirmView" element={<ConfirmView />}/>
          <Route exact path="/history" element={<HistoryView />}/>
          <Route exact path="/admin" element={<AdminView />}/>
          <Route exact path="/citasMedico" element={<GestionCitas />}/>
          <Route exact path="/HorarioView" element={<HorarioView/>}/>
          <Route exact path="/HorarioExtend" element={<HorarioExtendidoView/>}/>
        </Routes>
      </div>
  );
}
function Footer() {
    return (
        <footer className="App-footer">
            <div className="copyright">Total Soft Inc.</div>
            <div className="social-icons">

                <img src={twitterImg} height="16" width="16" alt="twitter"/>
                <img src={facebookImage} height="16" width="16" alt="facebook"/>
                <img src={instaImage} height="16" width="16" alt="instagram"/>
            </div>
            <div className="copyright">©2019 Tsf, Inc.</div>

        </footer>
    );
}
export function decodeToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }
        const payloadEncoded = parts[1];
        const payload = JSON.parse(atob(payloadEncoded));
        return {
            id: payload.id,
            rol: payload.scope[0],
            name: payload.name,
        };
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}
export default App;