// Helper-Funktion zum Berechnen eines Spieler-Scores
// Gibt einen Wert zwischen 0-100 zurück, basierend auf:
// - Positionsspezifischen Skills
// - Physischen Attributen
// - Spielstatistiken (wenn verfügbar)
// - Alter (jüngere Spieler bekommen einen Entwicklungsbonus)

export const calculatePlayerScore = (player) => {
  if (!player) return 0;

  let score = 0;
  let weightedFactors = 0;
  
  // Gewichtung der verschiedenen Faktoren
  const weights = {
    skills: 0.5,        // 50% Skills
    physical: 0.3,      // 30% Physische Attribute
    stats: 0.15,        // 15% Spielstatistiken
    potential: 0.05     // 5% Entwicklungspotential (basierend auf Alter)
  };

  // 1. Skills-Berechnung
  if (player.skills) {
    let skillsSum = 0;
    let skillsCount = 0;
    
    // Für jede vorhandene Skill-Eigenschaft
    Object.entries(player.skills).forEach(([key, value]) => {
      skillsSum += value;
      skillsCount++;
    });
    
    if (skillsCount > 0) {
      const avgSkills = skillsSum / skillsCount;
      score += avgSkills * weights.skills;
      weightedFactors += weights.skills;
    }
  }
  
  // 2. Physische Attribute
  if (player.physicalAttributes) {
    let physicalSum = 0;
    let physicalCount = 0;
    
    // Für jedes physische Attribut
    Object.entries(player.physicalAttributes).forEach(([key, value]) => {
      physicalSum += value;
      physicalCount++;
    });
    
    if (physicalCount > 0) {
      const avgPhysical = physicalSum / physicalCount;
      score += avgPhysical * weights.physical;
      weightedFactors += weights.physical;
    }
  }
  
  // 3. Spielstatistiken
  if (player.stats) {
    let statsScore = 0;
    
    // Verschiedene Statistiken je nach Position
    if (player.position === 'GK') {
      // Torhüter: Berücksichtige Clean Sheets und Saves-Percentage
      if (player.stats.cleanSheets !== undefined && player.stats.games) {
        const cleanSheetRatio = (player.stats.cleanSheets / player.stats.games) * 100;
        statsScore += cleanSheetRatio;
      }
      
      if (player.stats.savesPercentage) {
        statsScore += player.stats.savesPercentage;
      }
      
      if (statsScore > 0) {
        statsScore = statsScore / 2; // Durchschnitt, wenn beide Werte vorhanden
      }
    } else if (['ST', 'CF', 'SS', 'RW', 'LW'].includes(player.position)) {
      // Stürmer: Berücksichtige Tore und Assists
      if (player.stats.games && player.stats.goals !== undefined) {
        const goalsPerGame = (player.stats.goals / player.stats.games) * 10; // 10 Punkte für 1 Tor pro Spiel
        statsScore += Math.min(goalsPerGame * 8, 100); // Max 100
      }
      
      if (player.stats.games && player.stats.assists !== undefined) {
        const assistsPerGame = (player.stats.assists / player.stats.games) * 10; // 10 Punkte für 1 Assist pro Spiel
        statsScore += Math.min(assistsPerGame * 4, 50); // Max 50
      }
      
      if (statsScore > 0) {
        statsScore = Math.min(statsScore, 100) / 1.5; // Normalisieren
      }
    } else {
      // Verteidiger und Mittelfeldspieler: Mischung aus Defensiv- und Offensivstatistiken
      let defScore = 0;
      let offScore = 0;
      
      // Defensivwerte
      if (player.stats.games && player.stats.yellowCards !== undefined && player.stats.redCards !== undefined) {
        const cardsPerGame = ((player.stats.yellowCards + player.stats.redCards * 3) / player.stats.games);
        defScore += Math.max(0, 80 - (cardsPerGame * 20)); // Weniger Karten = besser
      }
      
      // Offensivwerte
      if (player.stats.games && player.stats.goals !== undefined) {
        const goalsPerGame = (player.stats.goals / player.stats.games) * 15; // 15 Punkte für 1 Tor pro Spiel
        offScore += Math.min(goalsPerGame * 5, 50); // Max 50
      }
      
      if (player.stats.games && player.stats.assists !== undefined) {
        const assistsPerGame = (player.stats.assists / player.stats.games) * 15; // 15 Punkte für 1 Assist pro Spiel
        offScore += Math.min(assistsPerGame * 5, 50); // Max 50
      }
      
      // Unterschiedliche Gewichtung je nach Position
      if (['CB', 'RB', 'LB', 'WB'].includes(player.position)) {
        // Verteidiger: 70% Defensiv, 30% Offensiv
        statsScore = (defScore * 0.7) + (offScore * 0.3);
      } else {
        // Mittelfeldspieler: 50% Defensiv, 50% Offensiv
        statsScore = (defScore * 0.5) + (offScore * 0.5);
      }
    }
    
    score += statsScore * weights.stats;
    weightedFactors += weights.stats;
  }
  
  // 4. Entwicklungspotential (jüngere Spieler haben mehr Potential)
  if (player.age) {
    // Jugendbonus für Spieler unter 20 Jahren
    const ageBonus = player.age <= 17 ? 100 : 
                     player.age <= 18 ? 90 : 
                     player.age <= 19 ? 80 : 0;
    
    score += ageBonus * weights.potential;
    weightedFactors += weights.potential;
  }
  
  // Wenn keine Daten vorhanden sind, einen Standardwert zurückgeben
  if (weightedFactors === 0) {
    return 50; // Neutraler Standardwert
  }
  
  // Normalisieren des Scores auf die Gewichtungsfaktoren, die tatsächlich berechnet wurden
  const normalizedScore = score / weightedFactors;
  
  // Runden auf ganze Zahlen
  return Math.round(normalizedScore);
};

// Hilfsfunktion, um die Score-Bewertung zu bekommen
export const getScoreRating = (score) => {
  if (score >= 90) return { text: 'Herausragend', color: 'text-emerald-600' };
  if (score >= 80) return { text: 'Sehr gut', color: 'text-emerald-500' };
  if (score >= 70) return { text: 'Gut', color: 'text-blue-500' };
  if (score >= 60) return { text: 'Solide', color: 'text-blue-400' };
  if (score >= 50) return { text: 'Durchschnitt', color: 'text-amber-500' };
  if (score >= 40) return { text: 'Ausreichend', color: 'text-amber-400' };
  if (score >= 30) return { text: 'Schwach', color: 'text-red-400' };
  return { text: 'Entwicklungsbedarf', color: 'text-red-500' };
};

// Hilfsfunktion zur Anzeige des Score-Badges
export const renderScoreBadge = (score) => {
  const rating = getScoreRating(score);
  
  // Farbverlauf-Style basierend auf dem Score
  const gradientStyle = {
    background: score >= 80 ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' : 
                score >= 70 ? 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)' : 
                score >= 50 ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)' : 
                               'linear-gradient(90deg, #ef4444 0%, #f87171 100%)'
  };
  
  return (
    <div className="flex items-center">
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
        style={gradientStyle}
      >
        {score}
      </div>
      <span className={`ml-2 text-sm font-medium ${rating.color}`}>
        {rating.text}
      </span>
    </div>
  );
};
