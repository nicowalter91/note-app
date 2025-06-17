import React, { useState } from 'react';
import { Card, Button, LoadingSpinner } from '../../components/UI/DesignSystem';
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import bgImage from '../../assets/img/soccer_background.jpg'; // Hintergrundbild importieren
import Logo from "../../assets/img/Logo.png";

const SignUp = () => {
  // State-Hooks für Formularwerte
  const [name, setName] = useState(""); // Name des Benutzers
  const [email, setEmail] = useState(""); // Email des Benutzers
  const [password, setPassword] = useState(""); // Passwort des Benutzers
  const [error, setError] = useState(null); // Fehlerzustand
  const [isSubmitting, setIsSubmitting] = useState(false); // Zustand für Formularabsendung (Verhindert mehrfaches Absenden)

  // useNavigate-Hook von react-router-dom zum Weiterleiten auf eine andere Seite
  const navigate = useNavigate();

  // Handler für die Anmeldung
  const handleSignUp = async (e) => {
    e.preventDefault(); // Verhindert das Standardverhalten (Seiten-Reload) bei Absenden des Formulars

    // Vorab Validierungen der Eingabefelder
    if (!name) {
      setError("Please enter your name"); // Setzt eine Fehlermeldung, wenn der Name nicht eingegeben wurde
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address."); // Setzt eine Fehlermeldung, wenn die Email ungültig ist
      return;
    }

    if (!password) {
      setError("Please enter the password"); // Setzt eine Fehlermeldung, wenn das Passwort leer ist
      return;
    }

    setError("");  // Fehler zurücksetzen, falls alle Eingaben valide sind
    setIsSubmitting(true);  // Formular befindet sich im Absende-Zustand (Laden)

    try {
      // API-Aufruf zur Registrierung des Benutzers
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });      // Erfolgsfall: Wenn ein accessToken zurückgegeben wird, wird der Benutzer eingeloggt
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken); // Speichert das accessToken im LocalStorage
        navigate('/dashboard'); // Weiterleitung zur Dashboard-Seite
      } else {
        // Wenn kein Token zurückgegeben wird, wird eine Fehlernachricht gesetzt
        setError(response.data.message || "An error occurred during registration.");
      }

    } catch (error) {
      // Fehlerbehandlung für unerwartete Fehler
      setError(error?.response?.data?.message || "An unexpected error occurred. Please try again");
    } finally {
      // Schaltet den Absende-Zustand zurück, unabhängig vom Erfolg oder Fehler
      setIsSubmitting(false);
    }
  }
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Linke Seite mit Hintergrundbild */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-indigo-900/40 flex flex-col justify-center items-center text-white p-12">
          <h2 className="text-4xl font-bold mb-6">Werde Teil unserer Community</h2>
          <p className="text-xl max-w-md text-center mb-8">
            Registriere dich jetzt, um deine Notizen, Aufgaben und mehr zu organisieren.
          </p>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 max-w-md">
            <p className="text-lg italic mb-4">
              "Mit dieser App habe ich endlich meine Projekte im Griff. Einfach zu bedienen und super organisiert."
            </p>
            <p className="font-medium">- Neuer Benutzer</p>
          </div>
        </div>
      </div>

      {/* Rechte Seite mit SignUp-Formular */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo und Branding */}
          <div className="text-center mb-10">
            <img src={Logo} alt="Logo" className="h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800">Konto erstellen</h2>
            <p className="text-gray-600 mt-2">Registriere dich für eine neue Erfahrung</p>
          </div>

          {/* SignUp-Formular */}
          <Card className="p-8">
            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Name-Feld */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Vollständiger Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    placeholder="Max Mustermann"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

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

              {/* Passwort-Feld */}              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
                <div className="relative">
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Passwort muss mindestens 8 Zeichen, einen Großbuchstaben und eine Zahl enthalten.
                </p>
              </div>

              {/* Datenschutz Checkbox */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="privacy"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="privacy" className="font-medium text-gray-700">
                    Ich akzeptiere die <Link to="/legal/terms-of-service" className="text-blue-600 hover:text-blue-800">Nutzungsbedingungen</Link> und <Link to="/legal/privacy-policy" className="text-blue-600 hover:text-blue-800">Datenschutzrichtlinien</Link>
                  </label>
                </div>
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
              )}              {/* SignUp-Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Konto wird erstellt...
                  </div>
                ) : "Konto erstellen"}
              </Button>              {/* Login-Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Bereits ein Konto?{" "}
                  <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                    Jetzt anmelden
                  </Link>
                </p>
              </div>
            </form>
          </Card>
          
          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-xs">
            <p>© {new Date().getFullYear()} mytacticlab. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
