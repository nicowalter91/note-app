import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  

import Dashboard from './pages/Home/Dashboard';
import Exercises from './pages/Exercises/Exercises';
import Events from './pages/Events/Events';
import Home from './pages/Notes/Notes';  
import Login from './pages/Login/Login';  
import Profil from './pages/Profil/Profil';
import SignUp from './pages/SignUp/SignUp';  
import Settings from './pages/Settings/Settings';
import TeamOverview from './pages/Team/TeamOverview.jsx';
import PlayerProfile from './pages/Team/PlayerProfile.jsx';
import AddEditPlayer from './pages/Team/AddEditPlayer.jsx';
import Tactic from './pages/Tactic/Tactic';
import Video from './pages/Video/Video';
import AddEditNotes from './pages/Notes/AddEditNotes';
import PlayerManagement from './pages/PlayerManagement/PlayerManagement';
import TeamCashBox from './pages/TeamCashBox/TeamCashBox';
import './App.css';

// Definiere die Routen der App
const routes = (
  <Router>  
    <Routes> 
      <Route path="/dashboard" exact element={<Dashboard />}/>  
      <Route path="/login" exact element={<Login />}/>  
      <Route path="/signup" exact element={<SignUp />}/>  
      <Route path="/tactic" exact element={<Tactic />}/>  
      <Route path="/notes" exact element={<Home />}/> 
      <Route path="/add-note" exact element={<AddEditNotes />}/> 
      <Route path="/edit-note/:id" exact element={<AddEditNotes />}/> 
      <Route path="/exercises" exact element={<Exercises />} />
      <Route path="/events" exact element={<Events />} />
      <Route path="/profil" exact element={<Profil />} />
      <Route path="/settings" exact element={<Settings />} />      <Route path="/team" exact element={<TeamOverview />} />
      <Route path="/team/add" element={<AddEditPlayer />} />
      <Route path="/team/edit/:playerId" element={<AddEditPlayer />} />
      <Route path="/team/player/:playerId" element={<PlayerProfile />} />
      <Route path="/teamcashbox" exact element={<TeamCashBox />} />
      <Route path="/video" exact element={<Video />} />
      <Route path="/player-management" exact element={<PlayerManagement />} />
      <Route exact path="/" element={<Navigate to="/login" />}/>
    </Routes>
  </Router>
);

const App = () => {
  return (
    <div>
      {routes}  
    </div>
  )
}

export default App;  // Exportiere die App-Komponente
