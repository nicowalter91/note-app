import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from '../../components/Input/PasswordInput';
import axiosInstance from '../../utils/axiosInstance';
import bgImage from "../../assets/img/background.png";
import Logo from "../../assets/img/Logo.png";

// Erweiterte E-Mail-Validierung mit Regex
const isValidEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailPattern.test(email);
};

const Login = () => {  const [email, setEmail] = useState(""); // Zustand für E-Mail
  const [password, setPassword] = useState(""); // Zustand für Passwort
  const [error, setError] = useState(null); // Zustand für Fehlernachricht
  const [loading, setLoading] = useState(false); // Ladezustand
  const [rememberMe, setRememberMe] = useState(false); // Remember me Option

  const navigate = useNavigate(); // React Router Hook für Navigation

  // Email aus localStorage beim Start laden, falls vorhanden
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Prüfe ob Benutzer bereits angemeldet ist
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Prüfe ob das Token noch gültig ist
          await axiosInstance.get('/get-user');
          // Token ist gültig, leite zum Dashboard weiter
          navigate('/dashboard');
        } catch (error) {
          // Token ist ungültig, entferne es
          localStorage.removeItem('token');
        }
      }
    };
    
    checkAuthStatus();
  }, [navigate]);

  // Login-Handler
  const handleLogin = async (e) => {
    e.preventDefault(); // Verhindert das Standardformularverhalten (Seiten-Reload)
    setLoading(true); // Ladezustand aktivieren

    // Erweiterte E-Mail-Validierung
    if (!isValidEmail(email)) {
      setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      setLoading(false);
      return;
    }

    // Überprüfen, ob das Passwort eingegeben wurde
    if (!password) {
      setError("Bitte gib ein Passwort ein.");
      setLoading(false);
      return;
    }

    setError(""); // Fehler zurücksetzen, wenn alle Validierungen bestanden sind

    // Remember Me Funktion
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    // Login API Call
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });      // Erfolgreiche Login-Antwort
      if (response.data && response.data.accessToken) {
        console.log("Login successful, saving token:", response.data.accessToken);
        localStorage.setItem("token", response.data.accessToken); // Token im Local Storage speichern
        console.log("Token saved, navigating to dashboard");
        navigate("/dashboard"); // Benutzer zum Dashboard weiterleiten
      } else {
        console.log("Login response missing token:", response.data);
        setError("Login erfolgreich, aber kein Token erhalten.");
      }
    } catch (error) {
      // Fehlerbehandlung
      if (error.response) {
        if (error.response.status === 401) {
          setError("Falsche E-Mail-Adresse oder Passwort.");
        } else if (error.response.data && error.response.data.message) {
          setError(error.response.data.message); // Serverfehlernachricht anzeigen
        } else {
          setError("Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später noch einmal.");
        }
      } else {
        // Fehler, wenn keine Antwort vom Server kommt (z.B. Netzwerkfehler)
        setError("Netzwerkfehler. Bitte überprüfe deine Internetverbindung.");
      }
    } finally {
      setLoading(false); // Ladezustand deaktivieren, unabhängig vom Ergebnis
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Linke Seite mit Hintergrundbild */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-indigo-900/40 flex flex-col justify-center items-center text-white p-12">
          <h2 className="text-4xl font-bold mb-6">Willkommen zurück</h2>
          <p className="text-xl max-w-md text-center mb-8">
            Verwalte deine Notizen, Aufgaben und mehr mit unserer intuitiven Plattform.
          </p>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 max-w-md">
            <p className="text-lg italic mb-4">
              "Diese App hat meine Produktivität komplett verändert. Alles ist an einem Ort und einfach zu verwalten."
            </p>
            <p className="font-medium">- Nico Walter (U17 Coach SG Quelle Fürth)</p>
          </div>
        </div>
      </div>

      {/* Rechte Seite mit Login-Formular */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo und Branding */}
          <div className="text-center mb-10">
            <img src={Logo} alt="Logo" className="h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800">Anmelden</h2>
            <p className="text-gray-600 mt-2">Melde dich an, um auf deine Daten zuzugreifen</p>
          </div>

          {/* Login-Formular */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email-Feld */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-Mail Adresse</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@beispiel.de"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Passwort-Feld */}
              <div>                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Passwort</label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Passwort vergessen?</a>
                </div>
                <div className="relative">
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Angemeldet bleiben
                </label>
              </div>

              {/* Fehleranzeige */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Login-Button */}
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Wird angemeldet...
                  </>
                ) : "Anmelden"}
              </button>

              {/* Registrierungslink */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Noch kein Konto?{" "}
                  <Link to="/signUp" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                    Jetzt registrieren
                  </Link>
                </p>
              </div>
            </form>
          </div>
          
          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-xs">
            <p>© {new Date().getFullYear()} mytacticlab. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
