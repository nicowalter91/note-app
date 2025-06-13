import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  // Importiere benötigte Komponenten von 'react-router-dom'
import Home from './pages/Notes/Notes';  // Importiere die Home-Seite
import Login from './pages/Login/Login';  // Importiere die Login-Seite
import SignUp from './pages/SignUp/SignUp';  // Importiere die SignUp-Seite
import Exercises from './pages/Exercises/Exercises';
import Profil from './pages/Profil/Profil';
import Settings from './pages/Settings/Settings';
import Team from './pages/Team/team';
import Tactic from './pages/Tactic/Tactic';
import Video from './pages/Video/video';
import Players from './pages/Team/Players/Players';
import Dashboard from './pages/Dashboard/Dashboard';
import PlayerProfile from './pages/Team/Players/Profile/PlayerProfile';
import PlayerEdit from './pages/Team/Players/Profile/PlayerEdit';

// Definiere die Routen der App
const routes = (
  <Router>  {/* Der Router verwaltet die Navigation und die URL-Verarbeitung */}
    <Routes>  {/* Routes enthält alle Routen, die der Router verwalten soll */}
      <Route path="/dashboard" exact element={<Dashboard />} />  {/* Route für die Dashboard-Seite */}
      <Route path="/login" exact element={<Login />}/>  {/* Route für die Login-Seite */}
      <Route path="/signup" exact element={<SignUp />}/>  {/* Route für die SignUp-Seite */}
      <Route path="/tactic" exact element={<Tactic />}/>  {/* Route für Taktik-Seite */}
      <Route path="/notes" exact element={<Home />}/> 
      <Route path="/exercises" exact element={<Exercises />} />
      <Route path="/profil" exact element={<Profil />} />
      <Route path="/settings" examt element={<Settings />} />
      <Route path="/team" examt element={<Team />} />
      <Route path="/video" examt element={<Video />} />
      <Route path="/team/players" exact element={<Players />} />
      <Route path="/players" exact element={<Players />} />
      <Route path="/team/players/:id" exact element={<PlayerProfile />} />
      <Route path="/team/players/edit/:id" exact element={<PlayerEdit />} />
      <Route exact path="/" element={<Navigate to="/login" />}/>
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
