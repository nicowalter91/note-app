import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Importiere benötigte Komponenten von 'react-router-dom'
import Home from './pages/Home/Home';  // Importiere die Home-Seite
import Login from './pages/Login/Login';  // Importiere die Login-Seite
import SignUp from './pages/SignUp/SignUp';  // Importiere die SignUp-Seite

// Definiere die Routen der App
const routes = (
  <Router>  {/* Der Router verwaltet die Navigation und die URL-Verarbeitung */}
    <Routes>  {/* Routes enthält alle Routen, die der Router verwalten soll */}
      <Route path="/dashboard" exact element={<Home />}/>  {/* Route für die Dashboard-Seite */}
      <Route path="/login" exact element={<Login />}/>  {/* Route für die Login-Seite */}
      <Route path="/signup" exact element={<SignUp />}/>  {/* Route für die SignUp-Seite */}
    </Routes>
  </Router>
);

const App = () => {
  return (
    <div>
      {routes}  {/* Gibt die definierten Routen zurück, die die Navigation und die zugehörigen Komponenten anzeigen */}
    </div>
  )
}

export default App;  // Exportiere die App-Komponente
