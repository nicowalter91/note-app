import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calculatePlayerScore, getScoreRating } from './playerScoreUtils.jsx';

// Schriftart für ein professionelleres Aussehen importieren
// Dies sind Standard-Web-Schriftarten, die jsPDF standardmäßig unterstützt
// Für benutzerdefinierte Schriftarten müssten wir Schriftdateien einbinden
const FONTS = {
    normal: 'helvetica',
    bold: 'helvetica',  // jsPDF doesn't support 'helvetica-bold' directly
    italic: 'helvetica',
    boldItalic: 'helvetica'
};

// Schriftstil-Hilfsfunktionen für den korrekten Einsatz
const setFontNormal = (doc) => {
    doc.setFont(FONTS.normal, 'normal');
};

const setFontBold = (doc) => {
    doc.setFont(FONTS.bold, 'bold');
};

const setFontItalic = (doc) => {
    doc.setFont(FONTS.italic, 'italic');
};

const setFontBoldItalic = (doc) => {
    doc.setFont(FONTS.boldItalic, 'bolditalic');
};

/**
 * Sichere Funktion zum Erstellen von Tabellen im PDF, die finalY Fehler abfängt
 */
const safeAutoTable = (doc, options) => {
    try {
        // Standardwerte für tableWidth, wenn nicht gesetzt
        if (options.tableWidth === undefined && options.columnStyles) {
            // Berechne Tabellenbreite aus cellWidth, falls vorhanden
            const totalWidth = Object.values(options.columnStyles)
                .reduce((sum, style) => sum + (style.cellWidth || 0), 0);
            
            if (totalWidth > 0) {
                options.tableWidth = totalWidth;
            }
        }
        
        // Führe autoTable aus und fange das Ergebnis ab
        const result = autoTable(doc, options);
        
        // Stelle sicher, dass finalY einen Wert hat (Fallback, falls undefined)
        if (!result || result.finalY === undefined) {
            console.warn('autoTable result or finalY is undefined, using fallback value');
            // Berechne eine vernünftige Fallback-Position basierend auf der Anzahl der Zeilen
            const rowCount = (options.body?.length || 0) + 1; // +1 für Header
            const estimatedHeight = rowCount * 8; // Ungefähre Höhe pro Zeile in mm
            return {
                finalY: options.startY + estimatedHeight
            };
        }
        
        return result;
    } catch (error) {
        console.error('Fehler in autoTable:', error);
        // Rückgabe eines sicheren Standardwerts
        return {
            finalY: options.startY + 20
        };
    }
};

/**
 * Hilfsfunktion für das Zeichnen von Radardiagrammen (für Fähigkeiten und Attribute)
 */
const drawRadarChart = (doc, data, labels, x, y, size, title, colors) => {
    // Canvas erstellen
    const canvas = document.createElement('canvas');
    canvas.width = size * 4; // Hohe Auflösung für schärfere Grafiken
    canvas.height = size * 4;
    const ctx = canvas.getContext('2d');
    
    // Skalierungsfaktor für bessere Auflösung
    const scale = 4;
    ctx.scale(scale, scale);
    
    // Weißer Hintergrund
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Radar-Chart zeichnen
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;
    
    // Anzahl der Datenpunkte
    const numPoints = data.length;
    if (numPoints <= 0) return 0;
    
    // Konzentrische Kreise für die Skala (5 Kreise für 0%, 20%, 40%, 60%, 80%, 100%)
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * i / 5, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Achsenlinien
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle)
        );
        ctx.stroke();
    }
    
    // Labels
    ctx.fillStyle = colors.textLight;
    ctx.font = '7px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
        const labelX = centerX + (radius + 10) * Math.cos(angle);
        const labelY = centerY + (radius + 10) * Math.sin(angle);
        
        // Text entlang der Achse ausrichten
        ctx.save();
        ctx.translate(labelX, labelY);
        
        // Korrektur für bessere Lesbarkeit je nach Position
        if (angle > Math.PI / 2 && angle < Math.PI * 3 / 2) {
            ctx.rotate(angle + Math.PI);
        } else {
            ctx.rotate(angle);
        }
        
        ctx.fillText(labels[i], 0, 0);
        ctx.restore();
    }
    
    // Datenpunkte zeichnen
    const dataPoints = [];
    for (let i = 0; i < numPoints; i++) {
        const value = data[i] / 100; // Normalisieren (0-1)
        const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
        dataPoints.push({
            x: centerX + radius * value * Math.cos(angle),
            y: centerY + radius * value * Math.sin(angle)
        });
    }
    
    // Gefülltes Polygon für Daten
    ctx.beginPath();
    ctx.moveTo(dataPoints[0].x, dataPoints[0].y);
    for (let i = 1; i < dataPoints.length; i++) {
        ctx.lineTo(dataPoints[i].x, dataPoints[i].y);
    }
    ctx.closePath();
    
    // Füllung mit Transparenz
    ctx.fillStyle = `${colors.primary}40`; // 40 = 25% Transparenz
    ctx.fill();
    
    // Rand
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Datenpunkte als Kreise
    ctx.fillStyle = colors.primary;
    dataPoints.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Werte anzeigen
    ctx.fillStyle = colors.primary;
    ctx.font = 'bold 7px Arial';
    
    for (let i = 0; i < numPoints; i++) {
        const value = data[i];
        const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
        const valueX = centerX + (radius * (data[i] / 100) * Math.cos(angle));
        const valueY = centerY + (radius * (data[i] / 100) * Math.sin(angle));
        
        // Werte etwas versetzt, um nicht genau auf den Punkten zu liegen
        const offset = 7;
        const textX = centerX + ((radius * (data[i] / 100)) + offset) * Math.cos(angle);
        const textY = centerY + ((radius * (data[i] / 100)) + offset) * Math.sin(angle);
        
        ctx.fillText(value, textX, textY);
    }
    
    // Titel oben
    if (title) {
        ctx.fillStyle = colors.text;
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(title, centerX, 10);
    }
    
    // Als Bild ins PDF einfügen
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', x, y, size / 4, size / 4); // Zurück zur normalen Größe
    
    return size / 4 + 5; // Höhe plus etwas Abstand
};

/**
 * Hilfsfunktion für Balkendiagramme (für Statistiken)
 */
const drawBarChart = (doc, data, labels, x, y, width, height, title, colors) => {
    // Canvas erstellen
    const canvas = document.createElement('canvas');
    const scale = 4; // Für bessere Auflösung
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    
    // Skalieren für bessere Qualität
    ctx.scale(scale, scale);
    
    // Weißer Hintergrund
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Titel
    if (title) {
        ctx.fillStyle = colors.text;
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 15);
    }
    
    // Berechnung der Werte für das Diagramm
    const barWidth = (width - 40) / data.length;
    const maxValue = Math.max(...data) || 100;
    const barHeight = (height - 50); // Platz für Labels und Titel
    
    // Y-Achse und Hilfslinien
    const numLines = 5;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    ctx.fillStyle = colors.textLight;
    ctx.font = '8px Arial';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= numLines; i++) {
        const lineY = height - 25 - (i * barHeight / numLines);
        const value = Math.round(i * maxValue / numLines);
        
        // Horizontale Linie
        ctx.beginPath();
        ctx.moveTo(30, lineY);
        ctx.lineTo(width - 10, lineY);
        ctx.stroke();
        
        // Wert auf der Y-Achse
        ctx.fillText(value, 25, lineY + 3);
    }
    
    // Balken zeichnen
    for (let i = 0; i < data.length; i++) {
        const barX = 35 + i * barWidth;
        const barValue = data[i];
        const barHeightScaled = (barValue / maxValue) * barHeight;
        
        // Balken
        ctx.fillStyle = colors.chart[i % colors.chart.length];
        ctx.fillRect(
            barX, 
            height - 25 - barHeightScaled, 
            barWidth - 5, 
            barHeightScaled
        );
        
        // Label unter dem Balken
        ctx.fillStyle = colors.text;
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            labels[i], 
            barX + (barWidth - 5) / 2, 
            height - 10
        );
        
        // Wert über dem Balken
        ctx.fillStyle = colors.text;
        ctx.font = 'bold 8px Arial';
        ctx.fillText(
            barValue, 
            barX + (barWidth - 5) / 2, 
            height - 28 - barHeightScaled
        );
    }
    
    // Als Bild ins PDF einfügen
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', x, y, width / 4, height / 4); // Zurück zur normalen Größe
    
    return height / 4 + 5; // Höhe plus etwas Abstand
};

/**
 * Fügt einen professionellen Footer auf allen Seiten hinzu
 */
const addProfessionalFooter = (doc, player, colors) => {
    const totalPages = doc.internal.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Auf jeder Seite einen Footer hinzufügen
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        // Footer-Hintergrund
        doc.setFillColor(colors.grayLight);
        doc.rect(0, 285, pageWidth, 12, 'F');
        
        // Feine Linie über dem Footer
        doc.setDrawColor(colors.gray);
        doc.setLineWidth(0.1);
        doc.line(15, 285, pageWidth - 15, 285);
        
        // Seitenzahl
        setFontNormal(doc);
        doc.setFontSize(8);
        doc.setTextColor(colors.secondary);
        doc.text(`Seite ${i} von ${totalPages}`, 105, 290, { align: 'center' });
        
        // Datum und Zeit
        const today = new Date().toLocaleDateString('de-DE');
        doc.text(`Erstellt am: ${today}`, 190, 290, { align: 'right' });
          // Branding/Copyright
        setFontBold(doc);
        doc.text('Spieleranalyse', 20, 290);
          // Spielername als Wasserzeichen auf allen Seiten
        setFontBold(doc);
        doc.setFontSize(60);
        doc.setTextColor(colors.grayLight);
        doc.setGState(new doc.GState({opacity: 0.05})); // Sehr transparent
        doc.text(player.name || 'Spielerprofil', pageWidth / 2, 150, { 
            align: 'center',
            angle: 45
        });
        doc.setGState(new doc.GState({opacity: 1.0})); // Zurücksetzen
    }
};

/**
 * Funktion zum Erstellen und Anzeigen einer Erfolgs- oder Fehlermeldung
 */
const showNotification = (message, isSuccess = true) => {
    // Entferne vorhandene Benachrichtigungen
    const existingMsg = document.body.querySelector('div[data-pdf-message]');
    if (existingMsg) existingMsg.remove();
    
    // Neue Benachrichtigung erstellen
    const notificationElement = document.createElement('div');
    notificationElement.style.position = 'fixed';
    notificationElement.style.top = '20px';
    notificationElement.style.left = '50%';
    notificationElement.style.transform = 'translateX(-50%)';
    notificationElement.style.backgroundColor = isSuccess ? 'rgba(34, 197, 94, 0.9)' : 'rgba(220, 38, 38, 0.9)';
    notificationElement.style.color = 'white';
    notificationElement.style.padding = '10px 20px';
    notificationElement.style.borderRadius = '5px';
    notificationElement.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
    notificationElement.style.zIndex = '9999';
    notificationElement.style.opacity = '0';
    notificationElement.style.transition = 'opacity 0.3s ease-in';
    notificationElement.textContent = message;
    notificationElement.setAttribute('data-pdf-message', 'true');
    document.body.appendChild(notificationElement);
    
    // Animation starten
    setTimeout(() => {
        notificationElement.style.opacity = '1';
    }, 10);
    
    // Nach 3 Sekunden ausblenden
    setTimeout(() => {
        notificationElement.style.opacity = '0';
        notificationElement.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => notificationElement.remove(), 500);
    }, 3000);
    
    return notificationElement;
};

/**
 * Erstellt ein professionelles Titelblatt
 */
const createCoverPage = (doc, player, colors) => {
    // Hintergrund mit Farbverlauf
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    
    // Hintergrundgradient simulieren (jsPDF unterstützt nativ keine Gradienten)
    doc.setFillColor(colors.primaryLight);
    doc.rect(0, 0, width, height, 'F');
    
    // Überlagerung für besseres Design
    doc.setFillColor(colors.white);
    doc.setGState(new doc.GState({opacity: 0.85}));
    doc.roundedRect(20, 40, width - 40, height - 80, 5, 5, 'F');
    doc.setGState(new doc.GState({opacity: 1.0}));
    
    // Logo-Platzhalter oder Teamlogo (falls vorhanden)
    setFontBold(doc);
    doc.setFontSize(24);
    doc.setTextColor(colors.primary);
    doc.text('SPIELERPROFIL', width / 2, 60, { align: 'center' });
    
    // Spielername groß und zentriert
    setFontBold(doc);
    doc.setFontSize(32);
    doc.setTextColor(colors.text);
    doc.text(player.name || 'Unbekannt', width / 2, 100, { align: 'center' });
    
    // Position
    if (player.position) {
        setFontNormal(doc);
        doc.setFontSize(18);
        doc.setTextColor(colors.secondary);
        doc.text(player.position, width / 2, 115, { align: 'center' });
    }
    
    // Trenner
    doc.setDrawColor(colors.primary);
    doc.setLineWidth(0.5);
    doc.line(width / 2 - 40, 125, width / 2 + 40, 125);
    
    // Spielernummer (falls vorhanden) als großes visuelles Element
    if (player.number) {
        setFontBold(doc);
        doc.setFontSize(80);
        doc.setTextColor(colors.primaryLight);
        doc.text(`#${player.number}`, width / 2, 180, { align: 'center' });
    }
    
    // Spielerbild-Platzhalter (würde in einer erweiterten Version durch tatsächliches Bild ersetzt)
    doc.setFillColor(colors.grayLight);
    doc.roundedRect(width / 2 - 30, 130, 60, 60, 30, 30, 'F');
    
    // Erstellt von / Datum
    const today = new Date().toLocaleDateString('de-DE');
    setFontNormal(doc);
    doc.setFontSize(10);
    doc.setTextColor(colors.textLight);
    doc.text(`Erstellt am: ${today}`, width / 2, height - 50, { align: 'center' });
    
    // Saison oder zusätzliche Informationen
    const season = '2024/2025';
    setFontBold(doc);
    doc.setFontSize(12);
    doc.setTextColor(colors.secondary);
    doc.text(`Saison ${season}`, width / 2, height - 35, { align: 'center' });
};

/**
 * Fügt einen konsistenten Header zu jeder Inhaltsseite hinzu
 */
const addPageHeader = (doc, title, colors) => {
    const width = doc.internal.pageSize.getWidth();
    
    // Kopfzeile mit subtiler Farbgebung
    doc.setFillColor(colors.grayLight);
    doc.rect(0, 0, width, 25, 'F');
    
    // Linie unter der Kopfzeile
    doc.setDrawColor(colors.primary);
    doc.setLineWidth(0.5);
    doc.line(15, 25, width - 15, 25);
    
    // Titel in der Kopfzeile
    setFontBold(doc);
    doc.setFontSize(12);
    doc.setTextColor(colors.text);
    doc.text(title, 20, 16);
    
    // Logo oder Icon könnte hier hinzugefügt werden
    
    return 35; // Startposition nach dem Header
};

/**
 * Verbesserte Info-Karten mit Icons für Spielerinformationen
 */
const addPlayerInfoCards = (doc, player, y, colors) => {
    // Erster Abschnitt: Persönliche Informationen
    const width = doc.internal.pageSize.getWidth();
    doc.setFillColor(colors.white);
    // Erste Reihe von Karten mit verbesserten Abständen und konsistenter Größe
    const cardWidth = 50;
    const cardHeight = 25;
    const cardMargin = 5;
    const startX = 20;
    
    // Hintergrund mit subtiler Umrandung
    for (let i = 0; i < 3; i++) {
        const x = startX + i * (cardWidth + cardMargin);
        doc.setFillColor(colors.white);
        doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F');
        doc.setDrawColor(colors.gray);
        doc.setLineWidth(0.1);
        doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'S');
    }
    
    // Karte 1: Alter mit verbesserten Schriftstilen
    setFontNormal(doc);
    doc.setFontSize(8);
    doc.setTextColor(colors.textLight);
    doc.text('ALTER', startX + 3, y + 6);
    
    setFontBold(doc);
    doc.setFontSize(12);
    doc.setTextColor(colors.text);
    doc.text(`${player.age || '-'} Jahre`, startX + 3, y + 16);
      // Karte 2: Größe
    const card2X = startX + cardWidth + cardMargin;
    setFontNormal(doc);
    doc.setFontSize(8);
    doc.setTextColor(colors.textLight);
    doc.text('GRÖßE', card2X + 3, y + 6);
    
    setFontBold(doc);
    doc.setFontSize(12);
    doc.setTextColor(colors.text);
    doc.text(`${player.height || '-'} cm`, card2X + 3, y + 16);
    
    // Karte 3: Gewicht
    const card3X = startX + 2 * (cardWidth + cardMargin);
    doc.setFont(FONTS.normal);
    doc.setFontSize(8);
    doc.setTextColor(colors.textLight);
    doc.text('GEWICHT', card3X + 3, y + 6);
    
    doc.setFont(FONTS.bold);
    doc.setFontSize(12);
    doc.setTextColor(colors.text);
    doc.text(`${player.weight || '-'} kg`, card3X + 3, y + 16);
    
    // Zweite Reihe mit weiteren Infos
    y += cardHeight + cardMargin;
    
    // Hintergrund für zweite Reihe
    for (let i = 0; i < 3; i++) {
        const x = startX + i * (cardWidth + cardMargin);
        doc.setFillColor(colors.white);
        doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F');
        doc.setDrawColor(colors.gray);
        doc.setLineWidth(0.1);
        doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'S');
    }
    
    // Karte 4: Verein
    doc.setFont(FONTS.normal);
    doc.setFontSize(8);
    doc.setTextColor(colors.textLight);
    doc.text('VEREIN', startX + 3, y + 6);
    
    doc.setFont(FONTS.bold);
    doc.setFontSize(11);
    doc.setTextColor(colors.text);
    doc.text(`${player.team || '-'}`, startX + 3, y + 16, { maxWidth: cardWidth - 6 });
    
    // Karte 5: Position
    doc.setFont(FONTS.normal);
    doc.setFontSize(8);
    doc.setTextColor(colors.textLight);
    doc.text('POSITION', card2X + 3, y + 6);
    
    doc.setFont(FONTS.bold);
    doc.setFontSize(11);
    doc.setTextColor(colors.text);
    doc.text(`${player.position || '-'}`, card2X + 3, y + 16);
    
    // Karte 6: Status mit farbiger Kennzeichnung
    doc.setFont(FONTS.normal);
    doc.setFontSize(8);
    doc.setTextColor(colors.textLight);
    doc.text('STATUS', card3X + 3, y + 6);
    
    const status = player.status || 'Unbekannt';
    let statusColor = colors.text;
    
    // Farbkodierung je nach Status
    if (status.toLowerCase().includes('available')) statusColor = colors.success;
    if (status.toLowerCase().includes('injured')) statusColor = colors.danger;    if (status.toLowerCase().includes('away')) statusColor = colors.warning;
    
    // Status mit entsprechender Farbe
    setFontBold(doc);
    doc.setFontSize(11);
    doc.setTextColor(statusColor);
    doc.text(status, card3X + 3, y + 16);
    
    // Gesamtbewertung als hervorgehobene Karte
    if (player.physicalAttributes && player.skills) {
        y += cardHeight + cardMargin + 5;
        
        const score = calculatePlayerScore(player);
        const rating = getScoreRating(score);
        const ratingText = typeof rating === 'object' ? rating.text : rating;
        
        // Bestimme die Farbe basierend auf dem Score
        const scoreColor = score >= 85 ? colors.success : 
                          score >= 70 ? colors.primary : 
                          score >= 50 ? colors.warning : colors.danger;
                          
        // Hintergrund der Bewertungskarte
        doc.setFillColor(colors.white);
        doc.roundedRect(startX, y, width - 40, 30, 3, 3, 'F');
        doc.setDrawColor(scoreColor);        doc.setLineWidth(0.5);
        doc.roundedRect(startX, y, width - 40, 30, 3, 3, 'S');
        
        // Überschrift
        setFontBold(doc);
        doc.setFontSize(10);
        doc.setTextColor(colors.textLight);
        doc.text('SPIELERBEWERTUNG', startX + 10, y + 10);
        
        // Score-Circle mit verbesserten Effekten
        const circleX = startX + 30;
        const circleY = y + 18;
        const circleRadius = 12;
        
        // Hintergrundkreis (leichter Schatten)
        doc.setFillColor('#f1f5f9');
        doc.circle(circleX + 1, circleY + 1, circleRadius, 'F');
        
        // Hauptkreis
        doc.setFillColor(scoreColor);
        doc.circle(circleX, circleY, circleRadius, 'F');
        
        // Score-Text
        doc.setTextColor('#ffffff');
        doc.setFont(FONTS.bold);
        doc.setFontSize(12);
        doc.text(score.toString(), circleX, circleY + 4, { align: 'center' });
        
        // Rating-Text mit professionellem Layout
        doc.setTextColor(colors.text);        setFontBold(doc);
        doc.setFontSize(14);
        doc.text(ratingText, circleX + 30, y + 19);
        
        // Erklärende Beschreibung
        setFontNormal(doc);
        doc.setFontSize(9);
        doc.setTextColor(colors.textLight);
        let beschreibung = '';
        
        if (score >= 85) beschreibung = 'Außergewöhnliche Fähigkeiten, Top-Performer';
        else if (score >= 70) beschreibung = 'Starke Leistung, überdurchschnittliche Fähigkeiten';
        else if (score >= 50) beschreibung = 'Solide Fähigkeiten mit Entwicklungspotenzial';
        else beschreibung = 'Grundlegende Fähigkeiten, benötigt Entwicklung';
        
        doc.text(beschreibung, circleX + 30, y + 24);
    }
    
    return y + 40; // Neue Y-Position zurückgeben
};

/**
 * Fügt verbesserte Spielerattribute mit professionellen Visualisierungen hinzu
 */
const addPlayerAttributes = (doc, player, y, colors) => {
    // Abschnittsüberschrift
    y = addSectionHeader(doc, 'Fähigkeiten & Attribute', y, colors);
    
    // Breitere Abstände für ein luftigeres Layout
    y += 5;
    
    // Physische Attribute Überschrift
    if (player.physicalAttributes) {
        doc.setFont(FONTS.bold);
        doc.setFontSize(11);
        doc.setTextColor(colors.primary);
        doc.text('Physische Attribute', 20, y);
        
        y += 5;
        
        // Verbesserte Attributdarstellung
        const physicalAttributes = [
            { name: 'Geschwindigkeit', value: player.physicalAttributes.speed || 0 },
            { name: 'Kraft', value: player.physicalAttributes.strength || 0 },
            { name: 'Beweglichkeit', value: player.physicalAttributes.agility || 0 },
            { name: 'Ausdauer', value: player.physicalAttributes.endurance || 0 },
            { name: 'Fitness', value: player.physicalAttributes.fitness || 0 }
        ];
        
        // Sortieren nach Wert (absteigend)
        physicalAttributes.sort((a, b) => b.value - a.value);
        
        // Verbesserte Attribute-Balken
        y = addAttributeBars(doc, physicalAttributes, y, colors);
        
        // Radar-Chart für Physische Attribute
        if (physicalAttributes.some(attr => attr.value > 0)) {
            y += 10;
            // Titel des Radar-Charts
            doc.setFont(FONTS.bold);
            doc.setFontSize(10);
            doc.setTextColor(colors.textLight);
            doc.text('Physische Attribute im Überblick', 105, y, { align: 'center' });
            
            // Chart generieren
            const labels = physicalAttributes.map(attr => attr.name);
            const data = physicalAttributes.map(attr => attr.value);
            
            // Verbesserte Radar-Chart-Funktion
            const chartHeight = drawRadarChartProfessional(doc, data, labels, 65, y + 5, 80, 'Physische Attribute', colors);
            y += chartHeight + 15;
        }
    }
    
    // Technische Fähigkeiten, falls vorhanden
    if (player.skills) {
        // Prüfen, ob Seitenumbruch nötig ist
        if (y > 200) {
            doc.addPage();
            addPageHeader(doc, `Spielerprofil: ${player.name || 'Unbekannt'}`, colors);
            y = 40;
        }
        
        doc.setFont(FONTS.bold);
        doc.setFontSize(11);
        doc.setTextColor(colors.primary);
        doc.text('Technische Fähigkeiten', 20, y);
        
        y += 5;
        
        // Verbesserte Fähigkeitsdarstellung
        const skills = [
            { name: 'Passspiel', value: player.skills.passing || 0 },
            { name: 'Schuss', value: player.skills.shooting || 0 },
            { name: 'Dribbling', value: player.skills.dribbling || 0 },
            { name: 'Technik', value: player.skills.technique || 0 },
            { name: 'Spielverständnis', value: player.skills.gameIntelligence || 0 }
        ];
        
        // Sortieren nach Wert (absteigend)
        skills.sort((a, b) => b.value - a.value);
        
        // Attribute-Balken
        y = addAttributeBars(doc, skills, y, colors);
        
        // Radar-Chart für Technische Fähigkeiten
        if (skills.some(skill => skill.value > 0)) {
            y += 10;
            // Titel des Radar-Charts
            doc.setFont(FONTS.bold);
            doc.setFontSize(10);
            doc.setTextColor(colors.textLight);
            doc.text('Technische Fähigkeiten im Überblick', 105, y, { align: 'center' });
            
            // Chart generieren
            const labels = skills.map(skill => skill.name);
            const data = skills.map(skill => skill.value);
            
            const chartHeight = drawRadarChartProfessional(doc, data, labels, 65, y + 5, 80, 'Technische Fähigkeiten', colors);
            y += chartHeight + 15;
        }
    }
    
    return y;
};

/**
 * Zeichnet moderne Attribut-Balken mit Farbverlauf und Labels
 */
const addAttributeBars = (doc, attributes, y, colors) => {
    const startX = 20;
    const barWidth = 160;
    const barHeight = 7;
    const barMargin = 15;
    
    attributes.forEach((attr, index) => {
        // Attribute-Name
        doc.setFont(FONTS.normal);
        doc.setFontSize(9);
        doc.setTextColor(colors.text);
        doc.text(attr.name, startX, y + index * barMargin);
        
        // Attributwert rechts
        doc.setFont(FONTS.bold);
        doc.setFontSize(9);
        doc.setTextColor(colors.textLight);
        doc.text(attr.value.toString(), startX + barWidth + 5, y + index * barMargin);
        
        // Hintergrund (hellgrau)
        doc.setFillColor(colors.grayLight);
        doc.roundedRect(startX, y + index * barMargin + 2, barWidth, barHeight, 2, 2, 'F');
        
        // Farbauswahl basierend auf Wert
        let barColor;
        if (attr.value >= 85) barColor = colors.success;
        else if (attr.value >= 70) barColor = colors.primary;
        else if (attr.value >= 50) barColor = colors.warning;
        else barColor = colors.danger;
        
        // Fortschrittsbalken mit abgerundeten Ecken
        const filledWidth = (attr.value / 100) * barWidth;
        doc.setFillColor(barColor);
        
        // Wenn der Balken sehr kurz ist, runde nur rechts ab
        if (filledWidth < 4) {
            doc.rect(startX, y + index * barMargin + 2, filledWidth, barHeight, 'F');
        } else {
            doc.roundedRect(startX, y + index * barMargin + 2, filledWidth, barHeight, 2, 2, 'F');
        }
    });
    
    return y + attributes.length * barMargin + 5;
};

/**
 * Verbesserte Radar-Chart-Funktion mit professioneller Darstellung
 */
const drawRadarChartProfessional = (doc, data, labels, x, y, size, title, colors) => {
    // Canvas für bessere Qualität
    const canvas = document.createElement('canvas');
    const scale = 4; // Für höhere Auflösung
    canvas.width = size * scale;
    canvas.height = size * scale;
    const ctx = canvas.getContext('2d');
    
    // Skalieren für bessere Qualität
    ctx.scale(scale, scale);
    
    // Setze Zeichenbereich
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35; // Etwas kleiner für bessere Proportionen
    const numPoints = labels.length;
    
    // Hintergrund (optional)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Zeichne Hilfslinien (Konzentrische Kreise)
    ctx.strokeStyle = '#e2e8f0';
    ctx.fillStyle = '#f8fafc';
    
    // Gefüllte Kreise mit abnehmendem Radius
    for (let i = 5; i > 0; i--) {
        const currentRadius = (radius * i) / 5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
        if (i % 2 === 0) {
            ctx.fillStyle = '#f1f5f9'; // Alternierende Farbe für bessere Sichtbarkeit
        } else {
            ctx.fillStyle = '#f8fafc';
        }
        ctx.fill();
        ctx.stroke();
        
        // Werte an den Kreisen (20, 40, 60, 80, 100)
        if (i > 0) {
            ctx.fillStyle = colors.textLight;
            ctx.font = '7px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${i * 20}`, centerX, centerY - currentRadius + 10);
        }
    }
    
    // Zeichne Achsen
    ctx.strokeStyle = '#cbd5e1';
    ctx.setLineDash([1, 1]); // Gestrichelte Linie
    
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle)
        );
        ctx.stroke();
    }
    
    ctx.setLineDash([]); // Zurücksetzen auf durchgezogene Linie
    
    // Beschriftungen in professionellerem Stil
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
        let labelX = centerX + (radius + 10) * Math.cos(angle);
        let labelY = centerY + (radius + 10) * Math.sin(angle);
        
        // Verbesserte Positionierung der Labels
        if (angle > Math.PI / 2 && angle < Math.PI * 3 / 2) {
            labelX -= 5;
            ctx.textAlign = 'right';
        } else {
            labelX += 5;
            ctx.textAlign = 'left';
        }
        
        // Optimierte Beschriftung für bessere Lesbarkeit
        ctx.fillText(labels[i], labelX, labelY);
    }
    
    // Datenpunkte zeichnen
    const dataPoints = [];
    for (let i = 0; i < numPoints; i++) {
        const value = data[i] / 100; // Normalisieren (0-1)
        const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
        dataPoints.push({
            x: centerX + radius * value * Math.cos(angle),
            y: centerY + radius * value * Math.sin(angle)
        });
    }
    
    // Gefülltes Polygon für Daten mit Schatten-Effekt
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.beginPath();
    ctx.moveTo(dataPoints[0].x, dataPoints[0].y);
    for (let i = 1; i < dataPoints.length; i++) {
        ctx.lineTo(dataPoints[i].x, dataPoints[i].y);
    }
    ctx.closePath();
    
    // Füllung mit Transparenz
    ctx.fillStyle = `${colors.primary}40`; // 40 = 25% Transparenz
    ctx.fill();
    ctx.restore(); // Schatten zurücksetzen
    
    // Rand
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Datenpunkte als Kreise mit Highlight-Effekt
    dataPoints.forEach((point, i) => {
        // Schatten unter Punkten
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        
        // Weißer Hintergrund für besseren Kontrast
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
        
        // Farbiger Punkt
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = colors.primary;
        ctx.fill();
        
        // Wert neben den Punkten in besserem Stil
        ctx.fillStyle = colors.text;
        ctx.font = 'bold 8px Arial';
        ctx.textAlign = 'center';
        
        // Optimierte Positionierung der Werte
        const value = data[i];
        const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
        const offset = 10;
        const textX = centerX + ((radius * (data[i] / 100)) + offset) * Math.cos(angle);
        const textY = centerY + ((radius * (data[i] / 100)) + offset) * Math.sin(angle);
        
        // Hintergrund für Lesbarkeit
        const textWidth = ctx.measureText(value.toString()).width;
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillRect(textX - textWidth/2 - 2, textY - 6, textWidth + 4, 12);
        
        // Wert
        ctx.fillStyle = colors.primary;
        ctx.fillText(value.toString(), textX, textY + 3);
    });
    
    // Als Bild ins PDF einfügen mit besserer Positionierung
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', x, y, size, size);
    
    return size + 10; // Höhe plus Abstand
};

/**
 * Verbesserte Balkendiagramm-Funktion
 */
const drawBarChartProfessional = (doc, data, labels, x, y, width, height, title, colors) => {
    // Canvas erstellen
    const canvas = document.createElement('canvas');
    const scale = 4; // Für bessere Auflösung
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    
    // Skalieren für bessere Qualität
    ctx.scale(scale, scale);
    
    // Weißer Hintergrund mit subtiler Umrandung
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Optionaler Hintergrund-Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f8fafc');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Titel mit verbesserten Schriftstilen
    if (title) {
        ctx.fillStyle = colors.text;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 15);
    }
    
    // Verbesserte Berechnung der Werte für das Diagramm
    const marginLeft = 40;
    const marginRight = 15;
    const marginTop = 30;
    const marginBottom = 30;
    
    const chartWidth = width - marginLeft - marginRight;
    const barWidth = (chartWidth) / data.length - 6; // Abstand zwischen Balken
    const maxValue = Math.max(...data) || 100;
    const chartHeight = height - marginTop - marginBottom;
    
    // Füge leichtes Raster hinzu
    const numLines = 5;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    ctx.fillStyle = colors.textLight;
    ctx.font = '8px Arial';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= numLines; i++) {
        const lineY = marginTop + (chartHeight - (i * chartHeight / numLines));
        const value = Math.round(i * maxValue / numLines);
        
        // Horizontale Linie mit alternierenden Farben
        if (i % 2 === 0) {
            ctx.setLineDash([]);
        } else {
            ctx.setLineDash([2, 2]);
        }
        
        ctx.beginPath();
        ctx.moveTo(marginLeft, lineY);
        ctx.lineTo(width - marginRight, lineY);
        ctx.stroke();
        
        // Wert auf der Y-Achse
        ctx.fillText(value, marginLeft - 5, lineY + 3);
    }
    
    // Zeichne X-Achse
    ctx.strokeStyle = colors.gray;
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(marginLeft, height - marginBottom);
    ctx.lineTo(width - marginRight, height - marginBottom);
    ctx.stroke();
    
    // Balken zeichnen
    for (let i = 0; i < data.length; i++) {
        const barX = marginLeft + i * (barWidth + 6) + 3;
        const barValue = data[i];
        const barHeightScaled = (barValue / maxValue) * chartHeight;
        
        // Farbauswahl für den Balken
        const barColorIndex = i % colors.chart.length;
        
        // Schatten für 3D-Effekt
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Balken mit abgerundeten Ecken und Farbverlauf
        const gradient = ctx.createLinearGradient(barX, height - marginBottom - barHeightScaled, barX, height - marginBottom);
        gradient.addColorStop(0, colors.chart[barColorIndex]);
        gradient.addColorStop(1, shadeColor(colors.chart[barColorIndex], 20)); // Dunklere Variante
        
        ctx.fillStyle = gradient;
        
        // Abgerundete Ecken oben
        const radius = 2;
        ctx.beginPath();
        ctx.moveTo(barX, height - marginBottom);
        ctx.lineTo(barX, height - marginBottom - barHeightScaled + radius);
        ctx.arcTo(barX, height - marginBottom - barHeightScaled, barX + radius, height - marginBottom - barHeightScaled, radius);
        ctx.lineTo(barX + barWidth - radius, height - marginBottom - barHeightScaled);
        ctx.arcTo(barX + barWidth, height - marginBottom - barHeightScaled, barX + barWidth, height - marginBottom - barHeightScaled + radius, radius);
        ctx.lineTo(barX + barWidth, height - marginBottom);
        ctx.closePath();
        
        ctx.fill();
        ctx.restore();
        
        // Dünne Umrandung für zusätzliche Definition
        ctx.strokeStyle = shadeColor(colors.chart[barColorIndex], -10); // Leicht dunklere Kontur
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        // Label unter dem Balken mit verbesserter Formatierung
        ctx.fillStyle = colors.text;
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        
        // Label-Rotation für bessere Lesbarkeit bei längeren Labels
        const label = labels[i];
        const labelX = barX + barWidth / 2;
        const labelY = height - marginBottom + 12;
        
        if (label.length > 10) {
            ctx.save();
            ctx.translate(labelX, labelY);
            ctx.rotate(Math.PI / 8); // Leichte Rotation
            ctx.fillText(label, 0, 0);
            ctx.restore();
        } else {
            ctx.fillText(label, labelX, labelY);
        }
        
        // Wert über dem Balken mit Hintergrund für bessere Lesbarkeit
        ctx.fillStyle = colors.white;
        const valueText = barValue.toString();
        const textWidth = ctx.measureText(valueText).width;
        const textX = barX + barWidth / 2;
        const textY = height - marginBottom - barHeightScaled - 5;
        
        // Hintergrund für Wert
        ctx.fillRect(textX - textWidth/2 - 2, textY - 8, textWidth + 4, 12);
        
        // Wert
        ctx.fillStyle = colors.text;
        ctx.font = 'bold 8px Arial';
        ctx.fillText(valueText, textX, textY);
    }
    
    // Als Bild ins PDF einfügen
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', x, y, width, height);
    
    return height + 5; // Höhe plus Abstand
};

/**
 * Hilfsfunktion zum Verdunkeln/Aufhellen einer Farbe
 */
const shadeColor = (color, percent) => {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;  
    G = (G < 255) ? G : 255;  
    B = (B < 255) ? B : 255;  

    R = Math.round(R);
    G = Math.round(G);
    B = Math.round(B);

    const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
    const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
    const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
};

/**
 * Hauptfunktion zum Exportieren des Spielerprofils als PDF
 */
export const exportPlayerProfileToPDF = (player) => {
    console.log('exportPlayerProfileToPDF wurde aufgerufen', player);
    if (!player) {
        console.error('Kein Spieler verfügbar für PDF-Export');
        return;
    }

    try {
        console.log('PDF-Erstellung gestartet');
        
        // Benachrichtigung anzeigen
        const notification = showNotification('PDF wird erstellt...', true);
        
        // Create PDF document (A4 format)
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Erweiterte Farbpalette für ein professionelleres Design
        const colors = {
            primary: '#3b82f6',       // Hauptfarbe - Blau
            primaryDark: '#1d4ed8',   // Dunkleres Blau für Hervorhebungen
            primaryLight: '#93c5fd',  // Helleres Blau für subtile Elemente
            secondary: '#64748b',     // Sekundärfarbe - Slate
            secondaryLight: '#94a3b8', // Helleres Slate
            background: '#f8fafc',    // Sehr heller Hintergrund
            text: '#1e293b',          // Dunkler Text für gute Lesbarkeit
            textLight: '#64748b',     // Leichterer Text für Nebensächliches
            success: '#10b981',       // Grün für positive Werte
            successLight: '#d1fae5',  // Helles Grün für Hintergründe
            warning: '#f59e0b',       // Gelb für mittlere Werte
            warningLight: '#fef3c7',  // Helles Gelb für Hintergründe
            danger: '#ef4444',        // Rot für negative Werte
            dangerLight: '#fee2e2',   // Helles Rot für Hintergründe
            gray: '#e2e8f0',          // Grau für Linien und Ränder
            grayLight: '#f1f5f9',     // Helleres Grau für Hintergründe
            white: '#ffffff',         // Weiß
            // Erweiterte Farbpalette für Diagramme
            chart: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', 
                    '#14b8a6', '#f97316', '#8b5cf6', '#22c55e', '#0ea5e9', '#ef4444']
        };
          // Seitenzähler initialisieren        let currentPage = 1;

        // INHALT BEGINNT AUF SEITE 1 (Titelblatt entfernt)
        let y = 20;

        // Konsistenten Header für alle Inhaltsseiten hinzufügen
        addPageHeader(doc, `Spielerprofil: ${player.name || 'Unbekannt'}`, colors);
        
        // SPIELERINFORMATIONEN - ÜBERSICHTSBEREICH
        // Überschrift mit verbessertem Design
        y = addSectionHeader(doc, 'Spielerinformationen', y, colors);
        
        // Moderne, verbesserte Info-Karten mit Icons
        y = addPlayerInfoCards(doc, player, y, colors);
        
        // ATTRIBUTBEREICH mit verbesserter Visualisierung
        if (player.physicalAttributes || player.skills) {
            // Prüfen, ob Seitenumbruch nötig ist
            if (y > 210) {
                doc.addPage();
                pageCount++;
                addPageHeader(doc, `Spielerprofil: ${player.name || 'Unbekannt'}`, colors);
                y = 40;
            }
            
            y = addPlayerAttributes(doc, player, y, colors);
        }
        
        // Karte 1: Alter
        doc.setTextColor(colors.textLight);
        doc.setFontSize(8);
        doc.text('ALTER', 22, y + 6);
        
        doc.setTextColor(colors.text);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${player.age || '-'} Jahre`, 22, y + 16);
        
        // Karte 2: Größe
        doc.setTextColor(colors.textLight);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('GRÖßE', 77, y + 6);
        
        doc.setTextColor(colors.text);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${player.height || '-'} cm`, 77, y + 16);
        
        // Karte 3: Gewicht
        doc.setTextColor(colors.textLight);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('GEWICHT', 132, y + 6);
        
        doc.setTextColor(colors.text);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${player.weight || '-'} kg`, 132, y + 16);
        
        // Zurück zu normaler Schriftart
        doc.setFont('helvetica', 'normal');
        
        y += 35;
        
        // Radar Chart für körperliche Attribute
        if (player.physicalAttributes && Object.keys(player.physicalAttributes).length > 0) {
            y = addSectionHeader(doc, 'Körperliche Attribute', y, colors);
            
            const physicalData = [
                player.physicalAttributes.speed || 0,
                player.physicalAttributes.strength || 0,
                player.physicalAttributes.agility || 0,
                player.physicalAttributes.endurance || 0,
                player.physicalAttributes.fitness || 0
            ];
            
            const physicalLabels = [
                'Geschwindigkeit', 
                'Kraft', 
                'Beweglichkeit', 
                'Ausdauer', 
                'Fitness'
            ];
            
            // Platz in der Mitte für das Diagramm
            const chartHeight = drawRadarChart(doc, physicalData, physicalLabels, 55, y, 100, 'Körperliche Attribute', colors);
            y += chartHeight + 10;
        }
        
        // Skills Radar Chart
        if (player.skills && Object.keys(player.skills).length > 0) {
            y = addSectionHeader(doc, 'Fähigkeiten', y, colors);
            
            const skillsData = Object.values(player.skills);
            const skillsLabels = Object.keys(player.skills).map(key => {
                return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
            });
            
            // Diagramm für Fähigkeiten
            const chartHeight = drawRadarChart(doc, skillsData, skillsLabels, 55, y, 100, 'Technische Fähigkeiten', colors);
            y += chartHeight + 10;
        }
        
        // Prüfen, ob Seitenumbruch nötig ist
        if (y > 250) {
            doc.addPage();
            y = 20;
        }
        
        // Statistiken als Balkendiagramm
        if (player.stats && Object.keys(player.stats).length > 0) {
            y = addSectionHeader(doc, 'Statistiken', y, colors);
            
            // Relevante Statistiken auswählen
            const statsData = [];
            const statsLabels = [];
            
            if (player.position === 'GK') {
                // Torwart-Statistiken
                if (player.stats.games !== undefined) {
                    statsData.push(player.stats.games);
                    statsLabels.push('Spiele');
                }
                if (player.stats.cleanSheets !== undefined) {
                    statsData.push(player.stats.cleanSheets);
                    statsLabels.push('Zu-Null');
                }
                if (player.stats.saves !== undefined) {
                    statsData.push(player.stats.saves);
                    statsLabels.push('Paraden');
                }
                if (player.stats.savesPercentage !== undefined) {
                    statsData.push(player.stats.savesPercentage);
                    statsLabels.push('Quote (%)');
                }
            } else {
                // Feldspieler-Statistiken
                if (player.stats.games !== undefined) {
                    statsData.push(player.stats.games);
                    statsLabels.push('Spiele');
                }
                if (player.stats.goals !== undefined) {
                    statsData.push(player.stats.goals);
                    statsLabels.push('Tore');
                }
                if (player.stats.assists !== undefined) {
                    statsData.push(player.stats.assists);
                    statsLabels.push('Vorlagen');
                }
                if (player.stats.yellowCards !== undefined) {
                    statsData.push(player.stats.yellowCards);
                    statsLabels.push('Gelbe K.');
                }
                if (player.stats.redCards !== undefined) {
                    statsData.push(player.stats.redCards);
                    statsLabels.push('Rote K.');
                }
            }                // Balkendiagramm für Statistiken
            if (statsData.length > 0) {
                const chartHeight = drawBarChart(doc, statsData, statsLabels, 20, y + 5, 150, 100, 'Spielerstatistiken', colors);
                y += chartHeight + 15;
            }
        }
        
        // Prüfen, ob Seitenumbruch nötig ist
        if (y > 240) {
            doc.addPage();
            y = 20;
        }
        
        // Verletzungshistorie mit modernerer Tabelle
        if (player.injuries && player.injuries.length > 0) {
            y = addSectionHeader(doc, 'Verletzungshistorie', y, colors);
            
            const injuryData = player.injuries.map(injury => [
                injury.type || '-',
                injury.date || '-',
                injury.duration || '-',
                injury.status || '-'
            ]);
            
            // Moderne Tabellenstile
            const modernTableStyles = {
                theme: 'grid',
                styles: { 
                    fontSize: 9,
                    cellPadding: 6,
                    lineColor: [230, 230, 230],
                    lineWidth: 0.1,
                    textColor: [30, 41, 59],
                    valign: 'middle',
                    fontStyle: 'normal'
                },
                headStyles: { 
                    fillColor: [243, 244, 246],
                    textColor: [30, 41, 59],
                    fontStyle: 'bold',
                    halign: 'left'
                },
                alternateRowStyles: {
                    fillColor: [250, 250, 250]
                },
                margin: { left: 20, right: 20 }
            };
            
            const injuryTableResult = safeAutoTable(doc, {
                ...modernTableStyles,
                startY: y + 5,
                head: [['Verletzung', 'Datum', 'Dauer', 'Status']],
                body: injuryData
            });
            
            y = injuryTableResult.finalY + 15;
        }
        
        // Prüfen, ob Seitenumbruch nötig ist
        if (y > 240) {
            doc.addPage();
            y = 20;
        }
        
        // Entwicklungsziele modern gestaltet
        if (player.development && player.development.goals && player.development.goals.length > 0) {
            y = addSectionHeader(doc, 'Entwicklungsziele', y, colors);
            
            // Moderne Bullet-Point-Darstellung mit farbigen Punkten
            player.development.goals.forEach((goal, index) => {
                // Farbiger Bullet Point
                doc.setFillColor(colors.primary);
                doc.circle(25, y + 5, 1.5, 'F');
                
                // Text des Ziels
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.setTextColor(colors.text);
                doc.text(goal, 30, y + 5);
                
                y += 8; // Abstand zwischen den Bullet-Points
            });
            
            y += 10; // Zusätzlicher Abstand nach dem Abschnitt
        }
        
        // Prüfen, ob Seitenumbruch nötig ist
        if (y > 240) {
            doc.addPage();
            y = 20;
        }
        
        // Notizen in modernem Card-Design
        if (player.notes && player.notes.length > 0) {
            y = addSectionHeader(doc, 'Notizen', y, colors);
            
            player.notes.forEach((note, index) => {
                // Karten-Hintergrund
                doc.setFillColor('#ffffff');
                doc.roundedRect(20, y, 170, 25, 2, 2, 'F');
                
                // Autor und Datum im Header
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.setTextColor(colors.text);
                doc.text(note.author || '-', 25, y + 6);
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(colors.textLight);
                doc.text(note.date || '-', 165, y + 6, { align: 'right' });
                
                // Notiztext
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                doc.setTextColor(colors.text);
                
                // Text-Wrapping für lange Notizen
                const splitText = doc.splitTextToSize(note.text || '-', 160);
                doc.text(splitText, 25, y + 13);
                
                y += 30; // Höhe plus Abstand zwischen den Karten
                  // Seitenumbruch wenn nötig
                if (y > 270 && index < player.notes.length - 1) {
                    doc.addPage();
                    y = 20;
                }
            });
        }
        
        // PDF speichern
        const formattedDate = new Date().toISOString().slice(0, 10);
        const filename = `${player.name.replace(/\s+/g, '_')}_Profil_${formattedDate}.pdf`;
        console.log('Speichere PDF als:', filename);
        
        // Professionellen Footer auf allen Seiten hinzufügen
        addProfessionalFooter(doc, player, colors);
        
        // PDF speichern
        doc.save(filename);
        
        // Erfolgsmeldung aktualisieren
        if (notification) {
            notification.textContent = 'PDF erfolgreich erstellt!';
        }
        
        console.log('PDF erfolgreich erstellt und gespeichert');
        return true;
    } catch (error) {
        console.error('Fehler beim Erstellen des PDF:', error);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        
        // Fehlermeldung anzeigen
        showNotification('Fehler beim Erstellen des PDF!', false);
        return false;    }
};

/**
 * Moderner Header-Stil für PDF-Abschnitte
 */
const addSectionHeader = (doc, title, y, colors) => {
    // Moderne, schlanke Überschrift mit subtiler Linie
    doc.setFont(FONTS.bold);
    doc.setFontSize(12);
    doc.setTextColor(colors.primary);
    doc.text(title, 20, y);
    
    // Subtile Linie unter der Überschrift    doc.setDrawColor(colors.primaryLight);
    doc.setLineWidth(0.5);
    doc.line(20, y + 2, 80, y + 2);
    
    // Zurück zu Standardtext
    setFontNormal(doc);
    doc.setFontSize(10);
    doc.setTextColor(colors.text);
      return y + 8;
};
