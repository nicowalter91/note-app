import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  

import Dashboard from './pages/Home/Dashboard';
import Exercises from './pages/Exercises/Exercises';
import Home from './pages/Notes/Notes';  
import Login from './pages/Login/Login';  
import Profil from './pages/Profil/Profil';
import SignUp from './pages/SignUp/SignUp';  
import Settings from './pages/Settings/Settings';
import Team from './pages/Team/team';
import Tactic from './pages/Tactic/Tactic';
import Video from './pages/Video/video';

// Definiere die Routen der App
const routes = (
  <Router>  
    <Routes> 
      <Route path="/dashboard" exact element={<Dashboard />}/>  
      <Route path="/login" exact element={<Login />}/>  
      <Route path="/signup" exact element={<SignUp />}/>  
      <Route path="/tactic" exact element={<Tactic />}/>  
      <Route path="/notes" exact element={<Home />}/> 
      <Route path="/exercises" exact element={<Exercises />} />
      <Route path="/profil" exact element={<Profil />} />
      <Route path="/settings" examt element={<Settings />} />
      <Route path="/team" examt element={<Team />} />
      <Route path="/video" examt element={<Video />} />
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
