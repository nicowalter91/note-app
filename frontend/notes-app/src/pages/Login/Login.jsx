import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from '../../components/Input/PasswordInput';
import axiosInstance from '../../utils/axiosInstance';
import bgImage from "../../assets/img/background.png";

// Erweiterte E-Mail-Validierung mit Regex
const isValidEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailPattern.test(email);
};

const Login = () => {
  const [email, setEmail] = useState(""); // Zustand für E-Mail
  const [password, setPassword] = useState(""); // Zustand für Passwort
  const [error, setError] = useState(null); // Zustand für Fehlernachricht

  const navigate = useNavigate(); // React Router Hook für Navigation

  // Login-Handler
  const handleLogin = async (e) => {
    e.preventDefault(); // Verhindert das Standardformularverhalten (Seiten-Reload)

    // Erweiterte E-Mail-Validierung
    if (!isValidEmail(email)) {
      setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    // Überprüfen, ob das Passwort eingegeben wurde
    if (!password) {
      setError("Bitte gib ein Passwort ein.");
      return;
    }

    setError(""); // Fehler zurücksetzen, wenn alle Validierungen bestanden sind

    // Login API Call
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      // Erfolgreiche Login-Antwort
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken); // Token im Local Storage speichern
        navigate("/dashboard"); // Benutzer zum Dashboard weiterleiten
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
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-100 items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Willkommen zurück</h2>
          <p className="text-sm text-gray-600 mb-6">Bitte melden Sie sich mit Ihrer E-Mail-Adresse und Ihrem Passwort an.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-Mail-Adresse</label>
              <input
                id="email"
                type="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Passwort</label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Noch kein Konto?{' '}
            <Link to="/signUp" className="text-primary hover:underline">Registrieren</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
