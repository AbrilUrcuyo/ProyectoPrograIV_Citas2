import logo from './logo.svg';
import './App.css';
import {Link, BrowserRouter, Routes, Route, Router} from 'react-router-dom'


import LoginView from './pages/login/LoginView';
import RegisterView from './pages/login/RegisterView';
import HistoryView from './pages/pacientes/History';


import telefono from './pages/images/telefono.png';
import headerLogo from './pages/images/doctorHeader.jpg';
import instaImage from './pages/images/instagram.png';
import facebookImage from './pages/images/facebook.png';
import twitterImg from './pages/images/logotipo-de-twitter.png';
import React from "react";
import ConfirmView from "./pages/pacientes/ConfirmView";
import BuscarCitas from "./pages/login/BuscarCitas";
import AdminView from "./pages/admin/medicosPendientes";

function Header() {
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

          {/*<a href="/presentation/medicos/appointment">Appointments</a>*/}
          {/*<a href="/presentation/medicos/perfilMedico">Profile</a>*/}
          {/*<a href="/presentation/horarios/showIngresoH">Ingresar Horario</a>*/}

          {/*<a href="/presentation/pacientes/appointment">History</a>*/}
          {/*<a href="/presentation/pacientes/perfilP">Perfil</a>*/}
          {/*<a href="/presentation/usuarios/index/show">Search</a>*/}



          {/*<a href="/presentation/admin/medicos">Approve Doctors</a>*/}



          {/*<a href="/logout">Logout</a>*/}

          <p> <Link to="/admin">About</Link> </p>
          <p> <Link to="/history">Search</Link></p>
          <p> <Link to="/login">Login</Link></p>
        </div>
      </header>

  );
}

function App() {
  return (
      <div className="App">
        <BrowserRouter>
          <Header />
          <Main />
          <Footer />
        </BrowserRouter>
      </div>
  );
}

function Main() {

  return (
      <div className="App-main">
        <Routes>
          <Route exact path="/" element={<BuscarCitas />}/>
          <Route exact path="/login" element={<LoginView />}/>
          <Route exact path="/register" element={<RegisterView />}/>
          <Route exact path="/confirmView" element={<ConfirmView />}/>
          <Route exact path="/history" element={<HistoryView />}/>
          <Route exact path="/admin" element={<AdminView />}/>
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

export default App;

