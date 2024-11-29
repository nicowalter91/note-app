import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Importiere benötigte Komponenten von 'react-router-dom'
import Home from './pages/Home/Home';  // Importiere die Home-Seite
import Login from './pages/Login/Login';  // Importiere die Login-Seite
import SignUp from './pages/SignUp/SignUp';  // Importiere die SignUp-Seite
import Exercises from './pages/Exercises/Exercises';
import Profil from './pages/Profil/Profil';
import Settings from './pages/Settings/Settings';
import Team from './pages/Team/team';
import Tactic from './pages/Tactic/tactic';
import Video from './pages/Video/video';


// Definiere die Routen der App
const routes = (
  <Router>  {/* Der Router verwaltet die Navigation und die URL-Verarbeitung */}
    <Routes>  {/* Routes enthält alle Routen, die der Router verwalten soll */}
      <Route path="/notes" exact element={<Home />}/> 
      <Route path="/login" exact element={<Login />}/> 
      <Route path="/signup" exact element={<SignUp />}/>  
      <Route path="/exercises" exact element={<Exercises />} />
      <Route path="/profil" exact element={<Profil />} />
      <Route path="/settings" examt element={<Settings />} />
      <Route path="/team" examt element={<Team />} />
      <Route path="/tactic" examt element={<Tactic />} />
      <Route path="/video" examt element={<Video />} />
      
      
      
      
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
