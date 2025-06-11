import React, { useState } from 'react';
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import bgImage from '../../assets/img/soccer_background.jpg'; // Hintergrundbild importieren

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
      });

      // Erfolgsfall: Wenn ein accessToken zurückgegeben wird, wird der Benutzer eingeloggt
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken); // Speichert das accessToken im LocalStorage
        navigate('/notes'); // Weiterleitung zur Notes-Seite
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
    <>
      <div className="flex min-h-screen bg-gray-100 items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Registrieren</h2>
          <p className="text-sm text-gray-600 mb-6">Erstellen Sie ein Konto, um loszulegen.</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
              className={`w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Konto wird erstellt...' : 'Konto erstellen'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Bereits registriert?{' '}
            <Link to="/login" className="text-primary hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
