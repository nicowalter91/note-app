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

    // Setze Standardheader für alle Anfragen
    headers: {
        'Content-Type': 'application/json'
    },

    // Aktiviere das Senden von Credentials (Cookies, Authorization Headers)
    withCredentials: true
});

// Interceptor für jede Anfrage, um das JWT-Token (falls vorhanden) hinzuzufügen.
axiosInstance.interceptors.request.use(
    // Dieser Funktionsblock wird ausgeführt, bevor die Anfrage tatsächlich abgeschickt wird.
    (config) => {
    // Hole das accessToken aus dem LocalStorage.
        const accessToken = localStorage.getItem("token");
        
        // Debug logging
        console.log('Request config:', {
            url: config.url,
            method: config.method,
            isFormData: config.data instanceof FormData,
            hasToken: !!accessToken
        });
        
        // Wenn ein Token existiert, füge es der Anfrage im Authorization Header hinzu
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`; // Fügt das Bearer Token in den Header ein.
            console.log('Added auth header:', config.headers.Authorization);
        }// Don't set Content-Type for FormData, let the browser handle it
        if (!(config.data instanceof FormData)) {
            if (!config.headers['Content-Type']) {
                config.headers['Content-Type'] = 'application/json';
            }
        } else {
            delete config.headers['Content-Type'];  // Remove Content-Type for FormData
        }

        // Gib die config zurück, um die Anfrage fortzusetzen.
        return config;
    },
    
    // Falls es bei der Anfrage ein Problem gibt, wird der Fehler hier abgefangen und zurückgegeben.
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error); // Fehler wird zurückgeworfen.
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Bei einem 401 Fehler (Unauthorized), lösche die LocalStorage und leite zur Login-Seite weiter.
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Exportiere die axios-Instanz, sodass sie in anderen Teilen der App verwendet werden kann.
export default axiosInstance;
