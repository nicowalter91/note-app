import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  // Importiere benötigte Komponenten von 'react-router-dom'
import Tasks from './pages/Notes/Tasks';  // Importiere die Tasks-Seite
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

// Importiere die Team-bezogenen Seiten
import Schedule from './pages/Team/Schedule/Schedule';
import Statistics from './pages/Team/Statistics/Statistics';
import Training from './pages/Team/Training/Training';
import Tactics from './pages/Team/Tactics/Tactics';
import Formation from './pages/Team/Formation/Formation';

// Importiere Rechtsseiten
import LegalNotice from './pages/Legal/LegalNotice';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsOfService from './pages/Legal/TermsOfService';

// Importiere Support-Seiten
import HelpCenter from './pages/Support/HelpCenter';
import Feedback from './pages/Support/Feedback';
import ContactSupport from './pages/Support/ContactSupport';

// Importiere Einstellungs- und Daten-Seiten
import NotificationSettings from './pages/Settings/NotificationSettings';
import LanguageSettings from './pages/Settings/LanguageSettings';
import ImportData from './pages/Data/ImportData';
import ExportData from './pages/Data/ExportData';

// Import Tools pages
import QuickActions from './pages/Tools/QuickActions';
import ImportTemplates from './pages/Tools/ImportTemplates';
import ExportTemplates from './pages/Tools/ExportTemplates';

// Definiere die Routen der App
const routes = (
  <Router>  {/* Der Router verwaltet die Navigation und die URL-Verarbeitung */}
    <Routes>  {/* Routes enthält alle Routen, die der Router verwalten soll */}
      <Route path="/dashboard" exact element={<Dashboard />} />  {/* Route für die Dashboard-Seite */}
      <Route path="/login" exact element={<Login />}/>  {/* Route für die Login-Seite */}
      <Route path="/signup" exact element={<SignUp />}/>  {/* Route für die SignUp-Seite */}      <Route path="/tactic" exact element={<Tactic />}/>  {/* Route für Taktik-Seite */}
      <Route path="/tasks" exact element={<Tasks />}/>  {/* Route für Aufgaben-Seite */}
      <Route path="/exercises" exact element={<Exercises />} />
      <Route path="/profil" exact element={<Profil />} />
      <Route path="/settings" exact element={<Settings />} />
      <Route path="/team" exact element={<Team />} />
      <Route path="/video" exact element={<Video />} />
      
      {/* Team Management Routes */}
      <Route path="/players" exact element={<Players />} />
      <Route path="/team/players" exact element={<Players />} />
      <Route path="/team/players/:id" exact element={<PlayerProfile />} />
      <Route path="/team/players/edit/:id" exact element={<PlayerEdit />} />      <Route path="/team/schedule" exact element={<Schedule />} />
      <Route path="/team/statistics" exact element={<Statistics />} />
      <Route path="/team/training" exact element={<Training />} />
      <Route path="/team/tactics" exact element={<Tactics />} />
      <Route path="/team/formation" exact element={<Formation />} />
      
      {/* Legal Routes */}
      <Route path="/legal" exact element={<LegalNotice />} />
      <Route path="/privacy" exact element={<PrivacyPolicy />} />
      <Route path="/terms" exact element={<TermsOfService />} />
      
      {/* Support Routes */}
      <Route path="/help" exact element={<HelpCenter />} />
      <Route path="/feedback" exact element={<Feedback />} />
      <Route path="/support" exact element={<ContactSupport />} />
      
      {/* Settings and Data Routes */}
      <Route path="/settings/notifications" exact element={<NotificationSettings />} />
      <Route path="/settings/language" exact element={<LanguageSettings />} />
      <Route path="/data/import" exact element={<ImportData />} />
      <Route path="/data/export" exact element={<ExportData />} />
      
      {/* Tools Routes */}
      <Route path="/tools/quick-actions" exact element={<QuickActions />} />
      <Route path="/tools/templates/import" exact element={<ImportTemplates />} />
      <Route path="/tools/templates/export" exact element={<ExportTemplates />} />
      
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
