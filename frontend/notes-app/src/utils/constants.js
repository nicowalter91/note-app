// Definiert die Basis-URL für die API-Anfragen.
// Diese URL wird als Grundlage für alle HTTP-Anfragen in der Anwendung verwendet.
// Im Entwicklungsmodus kann die Server-URL über eine Umgebungsvariable oder direkt im Code angepasst werden.

// Für den Zugriff von anderen Geräten im Netzwerk:
// Die tatsächliche IP-Adresse Ihres Computers
const LOCAL_IP = '192.168.1.7'; // Ihre tatsächliche IP-Adresse

// Die BASE_URL wird fest auf die lokale IP-Adresse gesetzt, 
// damit auch Geräte im Netzwerk das Backend erreichen können
export const BASE_URL = `http://${LOCAL_IP}:8000`;
