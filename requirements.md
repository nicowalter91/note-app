# Arbeitsschritte für die Entwicklung der Anwendung

## 1. Login und Registrierung
- **Frontend**:
  - Erstellen einer Login-Seite mit Eingabefeldern für E-Mail und Passwort.
  - Erstellen einer Registrierungsseite mit Eingabefeldern für Name, E-Mail, Passwort und Rollen.
  - Design: Schlicht und modern.
- **Backend**:
  - API-Endpunkte für Login und Registrierung erstellen.
  - Validierung der Eingaben.
  - Speicherung der Daten in der Datenbank.
- **Tests**:
  - Überprüfen, ob Login und Registrierung korrekt funktionieren.
  - Sicherstellen, dass Fehler wie falsche Eingaben korrekt behandelt werden.

## 2. User-Management
- **Frontend**:
  - Seite für das Anlegen und Verwalten von Usern.
  - Möglichkeit, Rollen zu vergeben.
  - Einladung per E-Mail.
- **Backend**:
  - API-Endpunkte für das Erstellen, Bearbeiten und Löschen von Usern.
  - Integration einer E-Mail-Versandfunktion.
- **Tests**:
  - Überprüfen, ob User korrekt angelegt, bearbeitet und gelöscht werden können.
  - Sicherstellen, dass E-Mails korrekt versendet werden.

## 3. Navbar und Sidebar
- **Frontend**:
  - Navbar mit Notifications und Profil-Dropdown.
  - Sidebar mit Links zu den anderen Seiten.
  - Design: Schlicht und modern.
- **Tests**:
  - Überprüfen, ob alle Links korrekt funktionieren.
  - Sicherstellen, dass die Navbar und Sidebar responsiv sind.

## 4. Dashboard
- **Frontend**:
  - Erstellen einer Dashboard-Seite mit:
    - Begrüßung des Users mit Namen.
    - Übersicht über Spiele, Aufgaben und wichtige Informationen.
  - Design: Schlicht und modern.
- **Backend**:
  - API-Endpunkte für das Abrufen der Daten für das Dashboard.
- **Tests**:
  - Überprüfen, ob die Daten korrekt angezeigt werden.
  - Sicherstellen, dass die Begrüßung personalisiert ist.

## 5. Spieler-Management
- **Frontend**:
  - Seite für das Verwalten von Spielern im Team.
  - Möglichkeit, Spieler hinzuzufügen, zu bearbeiten und zu löschen.
- **Backend**:
  - API-Endpunkte für das Erstellen, Bearbeiten und Löschen von Spielern.
- **Tests**:
  - Überprüfen, ob Spieler korrekt verwaltet werden können.

## 6. Aufgaben und Termine
- **Frontend**:
  - Seite für das Erstellen und Verwalten von Aufgaben und Terminen.
  - Möglichkeit, Trainingseinheiten, Spiele und Events zu planen.
- **Backend**:
  - API-Endpunkte für das Erstellen, Bearbeiten und Löschen von Aufgaben und Terminen.
- **Tests**:
  - Überprüfen, ob Aufgaben und Termine korrekt verwaltet werden können.

## 7. Spiele und Events
- **Frontend**:
  - Seite für das Erstellen und Verwalten von Spielen und Events.
  - Möglichkeit, Details wie Datum, Uhrzeit und Ort hinzuzufügen.
- **Backend**:
  - API-Endpunkte für das Erstellen, Bearbeiten und Löschen von Spielen und Events.
- **Tests**:
  - Überprüfen, ob Spiele und Events korrekt verwaltet werden können.

## 8. Modularität und Tests
- **Modularität**:
  - Sicherstellen, dass die Anwendung modular aufgebaut ist.
  - Komponenten und Seiten klar trennen.
- **Tests**:
  - Jede Funktionalität einzeln testen.
  - Sicherstellen, dass die API korrekt funktioniert und Daten in die Datenbank geschrieben und gelesen werden können.
