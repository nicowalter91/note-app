// Importiere axios, um HTTP-Anfragen zu erstellen.
import axios from 'axios';

// Importiere die BASE_URL, die die Basis-URL für alle API-Anfragen festlegt.
import { BASE_URL } from './constants';

// Erstelle eine Instanz von axios mit bestimmten Standardeinstellungen.
const axiosInstance = axios.create({
    // Basis-URL für alle Anfragen. Diese URL wird automatisch an jede Anfrage angehängt.
    baseURL: BASE_URL,
    
    // Timeout für jede Anfrage. Wenn die Antwort nicht innerhalb von 10 Sekunden zurückkommt, wird die Anfrage abgebrochen.
    timeout: 10000,

    // Setze Standardheader für alle Anfragen, in diesem Fall JSON-Daten.
    headers: {
        "Content-Type": "application/json", // Der Content-Type Header wird auf JSON gesetzt.
    },
});

// Interceptor für jede Anfrage, um das JWT-Token (falls vorhanden) hinzuzufügen.
axiosInstance.interceptors.request.use(
    // Dieser Funktionsblock wird ausgeführt, bevor die Anfrage tatsächlich abgeschickt wird.
    (config) => {
        // Hole das accessToken aus dem LocalStorage.
        const accessToken = localStorage.getItem("token");
        
        // Wenn ein Token existiert, füge es der Anfrage im Authorization Header hinzu.
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`; // Fügt das Bearer Token in den Header ein.
        }

        // Gib die config zurück, um die Anfrage fortzusetzen.
        return config;
    },
    
    // Falls es bei der Anfrage ein Problem gibt, wird der Fehler hier abgefangen und zurückgegeben.
    (error) => {
        return Promise.reject(error); // Fehler wird zurückgeworfen.
    }
);

// Exportiere die axios-Instanz, sodass sie in anderen Teilen der App verwendet werden kann.
export default axiosInstance;
