import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { MoodSlider, TagSelector } from '../UI/DesignSystem';

const EditMoodEntry = ({ entry, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    preTraining: {
      mood: 5,
      energy: 5,
      stress: 5,
      notes: ''
    },
    postTraining: {
      mood: 5,
      energy: 5,
      satisfaction: 5,
      notes: ''
    },
    trainingQuality: 5,
    playerReaction: 5,
    tags: [],
    wins: '',
    challengesToday: '',
    learnings: ''
  });

  const availableTags = [
    'great-day', 'tough-day', 'breakthrough', 'frustrating',
    'energetic', 'tired', 'motivated', 'stressed',
    'team-focused', 'tactical-success', 'communication-good',
    'player-issues', 'personal-growth', 'need-break'
  ];

  useEffect(() => {
    if (entry) {
      setFormData({
        preTraining: {
          mood: entry.preTraining?.mood || 5,
          energy: entry.preTraining?.energy || 5,
          stress: entry.preTraining?.stress || 5,
          notes: entry.preTraining?.notes || ''
        },
        postTraining: {
          mood: entry.postTraining?.mood || 5,
          energy: entry.postTraining?.energy || 5,
          satisfaction: entry.postTraining?.satisfaction || 5,
          notes: entry.postTraining?.notes || ''
        },
        trainingQuality: entry.trainingQuality || 5,
        playerReaction: entry.playerReaction || 5,
        tags: entry.tags || [],
        wins: entry.wins || '',
        challengesToday: entry.challengesToday || '',
        learnings: entry.learnings || ''
      });
    }
  }, [entry]);

  const handleSliderChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotesChange = (section, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        notes: value
      }
    }));
  };

  const handleTagsChange = (newTags) => {
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Eintrag bearbeiten
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaSave className="mr-2" />
                Speichern
              </button>
              <button
                onClick={onCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaTimes className="mr-2" />
                Abbrechen
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vor dem Training */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                Vor dem Training
              </h3>
              
              <MoodSlider
                label="Stimmung"
                value={formData.preTraining.mood}
                onChange={(value) => handleSliderChange('preTraining', 'mood', value)}
                color="blue"
              />
              
              <MoodSlider
                label="Energie"
                value={formData.preTraining.energy}
                onChange={(value) => handleSliderChange('preTraining', 'energy', value)}
                color="yellow"
              />
              
              <MoodSlider
                label="Stress"
                value={formData.preTraining.stress}
                onChange={(value) => handleSliderChange('preTraining', 'stress', value)}
                color="red"
                inverted
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notizen
                </label>
                <textarea
                  value={formData.preTraining.notes}
                  onChange={(e) => handleNotesChange('preTraining', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows="3"
                  placeholder="Wie fühlst du dich vor dem Training?"
                />
              </div>
            </div>

            {/* Nach dem Training */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                Nach dem Training
              </h3>
              
              <MoodSlider
                label="Stimmung"
                value={formData.postTraining.mood}
                onChange={(value) => handleSliderChange('postTraining', 'mood', value)}
                color="green"
              />
              
              <MoodSlider
                label="Energie"
                value={formData.postTraining.energy}
                onChange={(value) => handleSliderChange('postTraining', 'energy', value)}
                color="yellow"
              />
              
              <MoodSlider
                label="Zufriedenheit"
                value={formData.postTraining.satisfaction}
                onChange={(value) => handleSliderChange('postTraining', 'satisfaction', value)}
                color="purple"
              />
              
              <MoodSlider
                label="Training-Qualität"
                value={formData.trainingQuality}
                onChange={(value) => handleFieldChange('trainingQuality', value)}
                color="indigo"
              />
              
              <MoodSlider
                label="Spieler-Reaktion"
                value={formData.playerReaction}
                onChange={(value) => handleFieldChange('playerReaction', value)}
                color="pink"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notizen
                </label>
                <textarea
                  value={formData.postTraining.notes}
                  onChange={(e) => handleNotesChange('postTraining', e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows="3"
                  placeholder="Wie lief das Training?"
                />
              </div>
            </div>
          </div>

          {/* Weitere Felder */}
          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Erfolge heute
              </label>
              <textarea
                value={formData.wins}
                onChange={(e) => handleFieldChange('wins', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                rows="2"
                placeholder="Was lief heute besonders gut?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Herausforderungen
              </label>
              <textarea
                value={formData.challengesToday}
                onChange={(e) => handleFieldChange('challengesToday', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                rows="2"
                placeholder="Was war heute schwierig?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Erkenntnisse
              </label>
              <textarea
                value={formData.learnings}
                onChange={(e) => handleFieldChange('learnings', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                rows="2"
                placeholder="Was hast du heute gelernt?"
              />
            </div>            <TagSelector
              availableTags={availableTags}
              selectedTags={formData.tags}
              onChange={handleTagsChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMoodEntry;
