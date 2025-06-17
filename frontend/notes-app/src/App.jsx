import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  // Importiere benötigte Komponenten von 'react-router-dom'
import Tasks from './pages/Tasks/Tasks';  // Importiere die Tasks-Seite
import Login from './pages/Login/Login';  // Importiere die Login-Seite
import SignUp from './pages/SignUp/SignUp';  // Importiere die SignUp-Seite
// Removed empty/incomplete pages: Profil, Settings, Team, Tactic, Video
import Players from './pages/Team/Players/Players';
import Dashboard from './pages/Dashboard/Dashboard';
import PlayerProfile from './pages/Team/Players/Profile/PlayerProfile';
import PlayerEdit from './pages/Team/Players/Profile/PlayerEdit';
import Exercises from './pages/Exercises/Exercises';

// Importiere die Team-bezogenen Seiten
import Team from './pages/Team/Team';
import Schedule from './pages/Team/Schedule/Schedule';
import Statistics from './pages/Team/Statistics/Statistics';
import Training from './pages/Team/Training/Training';
import Tactics from './pages/Team/Tactics/Tactics';
import Formation from './pages/Team/Formation/Formation';
import TeamFinance from './pages/Team/Finance/TeamFinance';
import SeasonPlanning from './pages/Team/Planning/SeasonPlanning';
import EventDetail from './pages/Team/EventDetail/EventDetail';
import TrainingDetails from './pages/Team/Training/TrainingDetails';
import TrainingPlan from './pages/Team/Training/TrainingPlan';
import MatchDay from './pages/Team/MatchDay/MatchDay';
import MatchDayDetails from './pages/Team/MatchDay/MatchDayDetails';
import TeamInvitation from './pages/Team/Invitation/TeamInvitation';

// Importiere Rechtsseiten
import LegalNotice from './pages/Legal/LegalNotice';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsOfService from './pages/Legal/TermsOfService';

// Importiere Support-Seiten
import HelpCenter from './pages/Support/HelpCenter';
import Feedback from './pages/Support/Feedback';
import ContactSupport from './pages/Support/ContactSupport';

// Importiere Einstellungs- und Daten-Seiten
import Settings from './pages/Settings/Settings';
import NotificationSettings from './pages/Settings/NotificationSettings';
import LanguageSettings from './pages/Settings/LanguageSettings';
import ImportData from './pages/Data/ImportData';
import ExportData from './pages/Data/ExportData';

// Removed redundant tools pages: QuickActions, ImportTemplates, ExportTemplates, DrawingDemo
import DrawingToolPage from './pages/Tools/DrawingToolPage'; // Importiere die standalone Zeichenfunktion-Seite
import FootballExerciseToolPage from './pages/Tools/FootballExerciseToolPage'; // Importiere die Fußballübungs-Seite
import Contacts from './pages/Contacts/Contacts'; // Importiere die Kontakte-Seite
import SeasonOverview from './pages/Season/SeasonOverview';
import SeasonPhaseDetail from './pages/Season/PhaseDetail/SeasonPhaseDetail';
import WeeklyCoach from './pages/Season/WeeklyCoach';

// Definiere die Routen der App
const routes = (
  <Router>  {/* Der Router verwaltet die Navigation und die URL-Verarbeitung */}
    <Routes>  {/* Routes enthält alle Routen, die der Router verwalten soll */}      {/* Core App Routes - Streamlined */}
      <Route path="/dashboard" exact element={<Dashboard />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/signup" exact element={<SignUp />} />
      <Route path="/tasks" exact element={<Tasks />} />
      <Route path="/exercises" exact element={<Exercises />} />
      <Route path="/contacts" exact element={<Contacts />} />        {/* Team Management Routes */}
      <Route path="/team" exact element={<Team />} />
      <Route path="/players" exact element={<Players />} /><Route path="/team/players" exact element={<Players />} />
      <Route path="/team/players/:id" exact element={<PlayerProfile />} />
      <Route path="/team/players/edit/:id" exact element={<PlayerEdit />} />
      <Route path="/team/schedule" exact element={<Schedule />} />      <Route path="/team/event/:id" exact element={<EventDetail />} />
      <Route path="/team/training/:id" exact element={<TrainingDetails />} />      <Route path="/team/training" element={<Training />} />
      <Route path="/team/training/plan" element={<TrainingPlan />} />
      <Route path="/team/training/plan/:id" element={<TrainingPlan />} />
      <Route path="/team/statistics" exact element={<Statistics />} />
      <Route path="/team/tactics" exact element={<Tactics />} />
      <Route path="/team/formation" exact element={<Formation />} />
      <Route path="/team/finance" exact element={<TeamFinance />} />      <Route path="/team/planning" exact element={<SeasonPlanning />} />
      <Route path="/team/matchday" exact element={<MatchDay />} />
      <Route path="/team/matchday/:id" exact element={<MatchDayDetails />} />
      
      {/* Team Invitation Route */}
      <Route path="/invite/:token" exact element={<TeamInvitation />} />
      
      {/* Season Management Routes - Core Feature */}
      <Route path="/season" exact element={<SeasonOverview />} />
      <Route path="/season/:phaseId" exact element={<SeasonPhaseDetail />} />
      <Route path="/weekly-coach" exact element={<WeeklyCoach />} />
      
      {/* Essential Tools - Only Drawing Tools for Exercises */}
      <Route path="/tools/drawing-tool" exact element={<DrawingToolPage />} />
      <Route path="/tools/football-exercise" exact element={<FootballExerciseToolPage />} />
        {/* Settings and Data Routes - Essential Only */}
      <Route path="/settings" exact element={<Settings />} />
      <Route path="/data/import" exact element={<ImportData />} />
      <Route path="/data/export" exact element={<ExportData />} />
      {/* Support & Legal Routes - Moved to bottom */}
      <Route path="/legal" exact element={<LegalNotice />} />
      <Route path="/privacy" exact element={<PrivacyPolicy />} />
      <Route path="/terms" exact element={<TermsOfService />} />
      <Route path="/help" exact element={<HelpCenter />} />
      <Route path="/feedback" exact element={<Feedback />} />
      <Route path="/support" exact element={<ContactSupport />} />
      
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
