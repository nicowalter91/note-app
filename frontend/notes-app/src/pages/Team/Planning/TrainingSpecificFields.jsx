import React from 'react';
import { MdFitnessCenter } from 'react-icons/md';
import { FaArrowUp, FaArrowDown, FaTimes, FaExternalLinkAlt, FaUsers, FaUserCheck, FaUserTimes, FaUserClock, FaSearch } from 'react-icons/fa';

// Training-specific fields component
const TrainingSpecificFields = ({ 
  trainingData, 
  setTrainingData, 
  availableExercises, 
  availablePlayers,
  playerAttendance,
  setPlayerAttendance,
  trainingExercises,
  setTrainingExercises,
  loading,
  exerciseSearchQuery,
  setExerciseSearchQuery,
  loadingExercises,
  setShowExerciseModal,
  isRecurringTraining,
  setIsRecurringTraining,
  recurrencePattern,
  setRecurrencePattern
}) => {
  
  // Add exercise to training plan with duration
  const addExerciseToTraining = (exerciseId) => {
    const exercise = availableExercises.find(ex => ex.id === exerciseId);
    if (exercise && !trainingExercises.find(te => te.exerciseId === exerciseId)) {
      const newTrainingExercise = {
        id: Date.now().toString(),
        exerciseId: exercise.id,
        title: exercise.title,
        category: exercise.category,
        duration: exercise.defaultDuration || 15,
        order: trainingExercises.length
      };
      setTrainingExercises([...trainingExercises, newTrainingExercise]);
    }
  };

  // Remove exercise from training plan
  const removeExerciseFromTraining = (trainingExerciseId) => {
    setTrainingExercises(trainingExercises.filter(te => te.id !== trainingExerciseId));
  };

  // Update exercise duration
  const updateExerciseDuration = (trainingExerciseId, duration) => {
    setTrainingExercises(trainingExercises.map(te => 
      te.id === trainingExerciseId ? { ...te, duration: parseInt(duration) } : te
    ));
  };

  // Move exercise up/down in order
  const moveExercise = (index, direction) => {
    const newExercises = [...trainingExercises];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newExercises.length) {
      [newExercises[index], newExercises[targetIndex]] = [newExercises[targetIndex], newExercises[index]];
      
      // Update order numbers
      newExercises.forEach((ex, idx) => {
        ex.order = idx;
      });
      
      setTrainingExercises(newExercises);
    }
  };

  // Update player attendance
  const updatePlayerAttendance = (playerId, status) => {
    setPlayerAttendance({
      ...playerAttendance,
      [playerId]: status
    });
  };

  // Calculate total training duration
  const totalDuration = trainingExercises.reduce((sum, ex) => sum + ex.duration, 0);

  // Count attendance
  const attendanceStats = {
    present: Object.values(playerAttendance).filter(status => status === 'present').length,
    absent: Object.values(playerAttendance).filter(status => status === 'absent').length,
    unknown: Object.values(playerAttendance).filter(status => status === 'unknown').length
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg space-y-6">
      <h3 className="font-semibold text-blue-800 flex items-center gap-2">
        <MdFitnessCenter /> Training-Details
      </h3>
      
      {/* Recurring Training Option */}
      <div className="bg-white p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            id="recurringTraining"
            checked={isRecurringTraining}
            onChange={(e) => setIsRecurringTraining(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="recurringTraining" className="text-sm font-medium text-gray-900">
            🔄 Serientermin (Trainingsserie erstellen)
          </label>
        </div>
        
        {isRecurringTraining && (
          <div className="space-y-4 bg-blue-25 p-4 rounded border border-blue-100">
            <h4 className="font-medium text-blue-800">Wiederholungseinstellungen</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Startdatum *
                </label>
                <input
                  type="date"
                  value={recurrencePattern.startDate}
                  onChange={(e) => setRecurrencePattern({
                    ...recurrencePattern,
                    startDate: e.target.value
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required={isRecurringTraining}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enddatum *
                </label>
                <input
                  type="date"
                  value={recurrencePattern.endDate}
                  onChange={(e) => setRecurrencePattern({
                    ...recurrencePattern,
                    endDate: e.target.value
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required={isRecurringTraining}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trainingstage * (mindestens einen Tag auswählen)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                {[
                  { value: 1, label: 'Mo' },
                  { value: 2, label: 'Di' },
                  { value: 3, label: 'Mi' },
                  { value: 4, label: 'Do' },
                  { value: 5, label: 'Fr' },
                  { value: 6, label: 'Sa' },
                  { value: 0, label: 'So' }
                ].map(day => (
                  <label key={day.value} className="flex items-center gap-2 cursor-pointer p-2 bg-white border border-gray-200 rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={recurrencePattern.daysOfWeek.includes(day.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRecurrencePattern({
                            ...recurrencePattern,
                            daysOfWeek: [...recurrencePattern.daysOfWeek, day.value]
                          });
                        } else {
                          setRecurrencePattern({
                            ...recurrencePattern,
                            daysOfWeek: recurrencePattern.daysOfWeek.filter(d => d !== day.value)
                          });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">{day.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wiederholung alle {recurrencePattern.frequency} Woche(n)
              </label>
              <input
                type="range"
                min="1"
                max="4"
                value={recurrencePattern.frequency}
                onChange={(e) => setRecurrencePattern({
                  ...recurrencePattern,
                  frequency: parseInt(e.target.value)
                })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>jede Woche</span>
                <span>alle 2 Wochen</span>
                <span>alle 3 Wochen</span>
                <span>alle 4 Wochen</span>
              </div>
            </div>
            
            {recurrencePattern.startDate && recurrencePattern.endDate && recurrencePattern.daysOfWeek.length > 0 && (
              <div className="bg-blue-100 p-3 rounded border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Vorschau:</strong> Es werden Trainings von {new Date(recurrencePattern.startDate).toLocaleDateString('de-DE')} bis {new Date(recurrencePattern.endDate).toLocaleDateString('de-DE')} erstellt.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Basic Training Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intensität
          </label>
          <select
            value={trainingData.intensity}
            onChange={(e) => setTrainingData({...trainingData, intensity: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Niedrig (Regeneration)</option>
            <option value="medium">Mittel (Standard)</option>
            <option value="high">Hoch (Intensiv)</option>
            <option value="very-high">Sehr hoch (Wettkampf)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trainingsbedingungen
          </label>
          <select
            value={trainingData.weatherConditions}
            onChange={(e) => setTrainingData({...trainingData, weatherConditions: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="outdoor">Draußen</option>
            <option value="indoor">Halle</option>
            <option value="mixed">Gemischt</option>
          </select>
        </div>
      </div>

      {/* Training Objectives */}
      <div className="bg-white p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-gray-800 mb-3">Trainingsziele</h4>
        <textarea
          value={trainingData.trainingObjectives || ''}
          onChange={(e) => setTrainingData({
            ...trainingData, 
            trainingObjectives: e.target.value
          })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          placeholder="Z.B. Verbesserung der Passgenauigkeit, Defensivverhalten üben..."
        />
      </div>

      {/* Rest of the component remains the same */}
      <div className="bg-white p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-gray-800 mb-3">Trainingseinstellungen</h4>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Altersgruppe
            </label>
            <select
              value={trainingData.ageGroup || 'U17+'}
              onChange={(e) => setTrainingData({
                ...trainingData, 
                ageGroup: e.target.value
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="U6-U8">U6-U8</option>
              <option value="U10-U12">U10-U12</option>
              <option value="U14-U16">U14-U16</option>
              <option value="U17+">U17+</option>
              <option value="Erwachsene">Erwachsene</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schwierigkeitsgrad
            </label>
            <select
              value={trainingData.difficulty || 'medium'}
              onChange={(e) => setTrainingData({
                ...trainingData, 
                difficulty: e.target.value
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="easy">Einfach</option>
              <option value="medium">Mittel</option>
              <option value="hard">Schwer</option>
              <option value="expert">Experte</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exercise Planning */}
      <div className="bg-white p-4 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-gray-800">Trainingsplan</h4>
          <span className="text-sm text-gray-500">
            Gesamtdauer: {totalDuration} Min.
          </span>
        </div>
        
        {/* Exercise Search and Add */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Übungen durchsuchen..."
              value={exerciseSearchQuery}
              onChange={(e) => setExerciseSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <select
            onChange={(e) => {
              if (e.target.value) {
                addExerciseToTraining(e.target.value);
                e.target.value = '';
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {exerciseSearchQuery 
                ? `Gefilterte Übungen auswählen... (${availableExercises.filter(ex => 
                    !trainingExercises.find(te => te.exerciseId === ex.id) &&
                    (ex.title.toLowerCase().includes(exerciseSearchQuery.toLowerCase()) ||
                     ex.category.toLowerCase().includes(exerciseSearchQuery.toLowerCase()) ||
                     (ex.tags && ex.tags.some(tag => tag.toLowerCase().includes(exerciseSearchQuery.toLowerCase()))))
                  ).length})`
                : `Übung auswählen... (${availableExercises.filter(ex => !trainingExercises.find(te => te.exerciseId === ex.id)).length} verfügbar)`
              }
            </option>
            {availableExercises
              .filter(ex => 
                !trainingExercises.find(te => te.exerciseId === ex.id) &&
                (exerciseSearchQuery === '' || 
                 ex.title.toLowerCase().includes(exerciseSearchQuery.toLowerCase()) ||
                 ex.category.toLowerCase().includes(exerciseSearchQuery.toLowerCase()) ||
                 (ex.tags && ex.tags.some(tag => tag.toLowerCase().includes(exerciseSearchQuery.toLowerCase()))))
              )
              .map(exercise => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.title} | {exercise.category} | {exercise.defaultDuration}min | {exercise.ageGroup} | {exercise.difficulty} | {exercise.playersNeeded}P
                </option>
              ))
            }
          </select>
          
          {loadingExercises && (
            <div className="text-center text-gray-500 text-sm">
              Übungen werden geladen...
            </div>
          )}
          
          {availableExercises.length === 0 && !loadingExercises && (
            <div className="text-center text-gray-500 text-sm space-y-2">
              <p>Keine Übungen verfügbar</p>
              <button
                type="button"
                onClick={() => setShowExerciseModal(true)}
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Erste Übung erstellen
              </button>
            </div>
          )}
        </div>

        {/* Training Exercises List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {trainingExercises.length > 0 ? (
            trainingExercises.map((exercise, index) => (
              <div key={`training-exercise-${exercise.exerciseId}-${index}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveExercise(index, 'up')}
                    disabled={index === 0}
                    className="w-6 h-4 text-xs bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => moveExercise(index, 'down')}
                    disabled={index === trainingExercises.length - 1}
                    className="w-6 h-4 text-xs bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                  >
                    ▼
                  </button>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{exercise.title}</div>
                  <div className="text-xs text-gray-500">{exercise.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={exercise.duration}
                    onChange={(e) => updateExerciseDuration(exercise.id, e.target.value)}
                    className="w-16 p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    min="1"
                    max="120"
                  />
                  <span className="text-xs text-gray-500">Min.</span>
                </div>
                
                <button
                  type="button"
                  onClick={() => removeExerciseFromTraining(exercise.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <FaTimes />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              <p className="text-sm">Noch keine Übungen hinzugefügt</p>
              <p className="text-xs">Wählen Sie Übungen aus der Liste oben aus</p>
            </div>
          )}
        </div>
      </div>

      {/* Player Attendance */}
      <div className="bg-white p-4 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-gray-800 flex items-center gap-2">
            <FaUsers /> Spieler An-/Abwesenheiten
          </h4>
          <div className="text-sm text-gray-500">
            {attendanceStats.present} anwesend, {attendanceStats.absent} abwesend, {attendanceStats.unknown} unbekannt
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {availablePlayers.map(player => (
            <div key={player._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium">{player.name}</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => updatePlayerAttendance(player._id, 'present')}
                  className={`p-1 rounded text-xs ${
                    playerAttendance[player._id] === 'present' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                  }`}
                  title="Anwesend"
                >
                  <FaUserCheck />
                </button>
                <button
                  type="button"
                  onClick={() => updatePlayerAttendance(player._id, 'absent')}
                  className={`p-1 rounded text-xs ${
                    playerAttendance[player._id] === 'absent' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                  }`}
                  title="Abwesend"
                >
                  <FaUserTimes />
                </button>
                <button
                  type="button"
                  onClick={() => updatePlayerAttendance(player._id, 'unknown')}
                  className={`p-1 rounded text-xs ${
                    playerAttendance[player._id] === 'unknown' 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-yellow-100'
                  }`}
                  title="Unbekannt"
                >
                  <FaUserClock />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {availablePlayers.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            <p className="text-sm">Keine Spieler verfügbar</p>
            <p className="text-xs">Fügen Sie zuerst Spieler zum Team hinzu</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingSpecificFields;
