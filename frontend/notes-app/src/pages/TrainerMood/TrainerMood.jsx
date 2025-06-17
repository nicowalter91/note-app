import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
  PageHeader, 
  Card, 
  Button, 
  MoodSlider, 
  TagSelector, 
  MoodChart,
  LoadingSpinner 
} from '../../components/UI/DesignSystem';
import { 
  FaHeart, 
  FaBrain, 
  FaChartLine,
  FaCalendarDay, 
  FaRegEdit,
  FaSave,
  FaUndo,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import { 
  getTodaysMood, 
  updateMoodEntry, 
  getMoodAnalytics,
  getRecentMoodEntries,
  deleteMoodEntry 
} from '../../utils/trainerMoodService';
import EditMoodEntry from '../../components/TrainerMood/EditMoodEntry';

const TrainerMood = () => {
  const [todaysMood, setTodaysMood] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const availableTags = [
    'great-day', 'tough-day', 'breakthrough', 'frustrating',
    'energetic', 'tired', 'motivated', 'stressed',
    'team-focused', 'tactical-success', 'communication-good',
    'player-issues', 'personal-growth', 'need-break'
  ];

  useEffect(() => {
    loadData();
  }, []);  const loadData = async () => {
    try {      
      setLoading(true);
      console.log('Loading TrainerMood data...');
      const [moodResponse, analyticsResponse, recentResponse] = await Promise.all([
        getTodaysMood(),
        getMoodAnalytics(30),
        getRecentMoodEntries(10)
      ]);

      console.log('Mood Response:', moodResponse);
      console.log('Analytics Response:', analyticsResponse);
      console.log('Recent Response:', recentResponse);

      setTodaysMood(moodResponse.moodEntry);
      setAnalytics(analyticsResponse.analytics);
      setRecentEntries(recentResponse.moodEntries || []);
      setEditData(moodResponse.moodEntry);
      
      console.log('Data loaded successfully');
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
    } finally {
      setLoading(false);
    }
  };  const handleSave = async () => {
    try {
      setSaving(true);
      await updateMoodEntry(editData._id, editData);
      setTodaysMood(editData);
      setEditMode(false);
      
      // Reload analytics
      const analyticsResponse = await getMoodAnalytics(30);
      setAnalytics(analyticsResponse.analytics);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(todaysMood);
    setEditMode(false);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowEditModal(true);
  };

  const handleDeleteEntry = async (entryId) => {
    if (!window.confirm('Möchtest du diesen Eintrag wirklich löschen?')) {
      return;
    }

    try {
      await deleteMoodEntry(entryId);
      // Reload data
      await loadData();
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      alert('Fehler beim Löschen des Eintrags');
    }
  };

  const handleSaveEditedEntry = async (updatedData) => {
    try {
      await updateMoodEntry(editingEntry._id, updatedData);
      setShowEditModal(false);
      setEditingEntry(null);
      // Reload data
      await loadData();
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Fehler beim Speichern des Eintrags');
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingEntry(null);
  };

  const updateEditData = (path, value) => {
    setEditData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Trainer Mood Tracker"
        subtitle="Verfolge deine Stimmung und reflektiere deinen Tag"
        icon={FaHeart}
        action={
          <div className="flex space-x-2">
            {editMode ? (
              <>
                <Button
                  variant="secondary"
                  icon={FaUndo}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Abbrechen
                </Button>
                <Button
                  variant="primary"
                  icon={FaSave}
                  onClick={handleSave}
                  loading={saving}
                >
                  Speichern
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                icon={FaRegEdit}
                onClick={() => setEditMode(true)}
              >
                Bearbeiten
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Mood Entry */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pre-Training Mood */}
          <Card 
            title="Vor dem Training/ Spiel" 
            icon={FaCalendarDay}
            className={editMode ? 'border-2 border-blue-200' : ''}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MoodSlider
                label="Stimmung"
                value={editData?.preTraining?.mood}
                onChange={(value) => updateEditData('preTraining.mood', value)}
                emoji={true}
                disabled={!editMode}
              />
              <MoodSlider
                label="Energie"
                value={editData?.preTraining?.energy}
                onChange={(value) => updateEditData('preTraining.energy', value)}
                color="green"
                disabled={!editMode}
              />
              <MoodSlider
                label="Stress"
                value={editData?.preTraining?.stress}
                onChange={(value) => updateEditData('preTraining.stress', value)}
                color="red"
                disabled={!editMode}
              />
              <MoodSlider
                label="Motivation"
                value={editData?.preTraining?.motivation}
                onChange={(value) => updateEditData('preTraining.motivation', value)}
                color="purple"
                disabled={!editMode}
              />
            </div>
            
            {editMode && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notizen vor dem Training
                </label>
                <textarea
                  value={editData?.preTraining?.notes || ''}
                  onChange={(e) => updateEditData('preTraining.notes', e.target.value)}
                  placeholder="Wie fühlst du dich heute? Was denkst du über das bevorstehende Training?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            )}
          </Card>

          {/* Post-Training Mood */}
          <Card 
            title="Nach dem Training/ Spiel" 
            icon={FaBrain}
            className={editMode ? 'border-2 border-blue-200' : ''}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MoodSlider
                label="Stimmung"
                value={editData?.postTraining?.mood}
                onChange={(value) => updateEditData('postTraining.mood', value)}
                emoji={true}
                disabled={!editMode}
              />
              <MoodSlider
                label="Energie"
                value={editData?.postTraining?.energy}
                onChange={(value) => updateEditData('postTraining.energy', value)}
                color="green"
                disabled={!editMode}
              />
              <MoodSlider
                label="Zufriedenheit"
                value={editData?.postTraining?.satisfaction}
                onChange={(value) => updateEditData('postTraining.satisfaction', value)}
                color="yellow"
                disabled={!editMode}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <MoodSlider
                label="Training Qualität"
                value={editData?.trainingQuality}
                onChange={(value) => updateEditData('trainingQuality', value)}
                color="blue"
                disabled={!editMode}
              />
              <MoodSlider
                label="Spieler-Reaktion"
                value={editData?.playerResponse}
                onChange={(value) => updateEditData('playerResponse', value)}
                color="green"
                disabled={!editMode}
              />
            </div>

            {editMode && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notizen nach dem Training
                </label>
                <textarea
                  value={editData?.postTraining?.notes || ''}
                  onChange={(e) => updateEditData('postTraining.notes', e.target.value)}
                  placeholder="Wie lief das Training? Was ist gut gelaufen? Was könnte besser werden?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            )}
          </Card>

          {/* Tags and Reflection */}
          {editMode && (
            <Card title="Reflexion" icon={FaBrain}>
              <div className="space-y-6">
                <TagSelector
                  availableTags={availableTags}
                  selectedTags={editData?.tags || []}
                  onChange={(tags) => updateEditData('tags', tags)}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Was hast du heute gelernt?
                  </label>
                  <textarea
                    value={editData?.learnings || ''}
                    onChange={(e) => updateEditData('learnings', e.target.value)}
                    placeholder="Neue Erkenntnisse, Verbesserungen, Ideen für die Zukunft..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>              </div>            </Card>
          )}
        </div>

        {/* Analytics Sidebar */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <Card title="30-Tage Übersicht" icon={FaChartLine}>
            {analytics ? (
              analytics.totalEntries > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {analytics.averageMood || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-600">Ø Stimmung</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {analytics.averageEnergy || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-600">Ø Energie</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {analytics.averageSatisfaction || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-600">Ø Zufriedenheit</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {analytics.totalEntries}
                      </div>
                      <div className="text-xs text-gray-600">Einträge</div>
                    </div>
                  </div>

                  {analytics.moodTrend && analytics.moodTrend.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Stimmungsverlauf</h4>
                      <MoodChart data={analytics.moodTrend} height="32" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 dark:text-gray-400 mb-4">
                    <FaChartLine className="mx-auto text-4xl mb-2 opacity-50" />
                    <p className="text-lg font-medium">Noch keine Daten</p>
                    <p className="text-sm">Erstelle deinen ersten Mood-Eintrag, um Analytics zu sehen!</p>
                  </div>
                </div>
              )
            ) : (
              <div className="animate-pulse space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {analytics && analytics.challengingDays && analytics.challengingDays.length > 0 && (
            <Card title="Herausfordernde Tage (≤ 4)" className="bg-red-50 dark:bg-red-900/20">
              <div className="space-y-2">
                {analytics.challengingDays.slice(0, 2).map((day, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      {new Date(day.date).toLocaleDateString('de-DE', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                    <div className="font-bold text-red-600">
                      {day.mood ? day.mood.toFixed(1) : 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Recent Entries Section */}
      {recentEntries && recentEntries.length > 0 && (
        <div className="mt-8">          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <FaCalendarDay className="mr-2 text-green-600" />
            Letzte Einträge
          </h2>
          
          <Card>
            <div className="space-y-4">
              {recentEntries.slice(0, 7).map((entry, index) => {
                const entryDate = new Date(entry.date);
                const isToday = entryDate.toDateString() === new Date().toDateString();
                
                // Calculate average mood manually
                const moodValues = [];
                if (entry.preTraining?.mood) moodValues.push(entry.preTraining.mood);
                if (entry.postTraining?.mood) moodValues.push(entry.postTraining.mood);
                const avgMood = moodValues.length > 0 ? moodValues.reduce((a, b) => a + b) / moodValues.length : null;
                
                return (
                  <div 
                    key={entry._id || index} 
                    className={`p-4 rounded-lg border ${isToday ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {entryDate.toLocaleDateString('de-DE', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </h3>
                          {isToday && (
                            <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium">
                              Heute
                            </span>
                          )}
                        </div>
                        
                        {/* Mood Values */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          {entry.preTraining?.mood && (
                            <div className="text-center">
                              <div className="text-sm text-gray-500 dark:text-gray-400">Vor Training</div>
                              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {entry.preTraining.mood}/10
                              </div>
                            </div>
                          )}
                          {entry.postTraining?.mood && (
                            <div className="text-center">
                              <div className="text-sm text-gray-500 dark:text-gray-400">Nach Training</div>
                              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                {entry.postTraining.mood}/10
                              </div>
                            </div>
                          )}
                          {entry.preTraining?.energy && (
                            <div className="text-center">
                              <div className="text-sm text-gray-500 dark:text-gray-400">Energie</div>
                              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                                {entry.preTraining.energy}/10
                              </div>
                            </div>
                          )}
                          {entry.trainingQuality && (
                            <div className="text-center">
                              <div className="text-sm text-gray-500 dark:text-gray-400">Training-Qualität</div>
                              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                {entry.trainingQuality}/10
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Notes */}
                        {(entry.preTraining?.notes || entry.postTraining?.notes || entry.learnings) && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {entry.preTraining?.notes && (
                              <div><strong>Vor Training:</strong> {entry.preTraining.notes.slice(0, 80)}...</div>
                            )}
                            {entry.postTraining?.notes && (
                              <div><strong>Nach Training:</strong> {entry.postTraining.notes.slice(0, 80)}...</div>
                            )}
                            {entry.learnings && (
                              <div><strong>Erkenntnisse:</strong> {entry.learnings.slice(0, 80)}...</div>
                            )}
                          </div>
                        )}
                        
                        {/* Tags */}
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map((tag, tagIndex) => (
                              <span 
                                key={tagIndex}
                                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs"
                              >
                                {tag.replace('-', ' ')}
                              </span>
                            ))}
                          </div>
                        )}                      </div>
                      
                      {/* Actions and Average Mood Display */}
                      <div className="ml-4 flex items-center space-x-3">
                        {/* Edit and Delete Buttons */}
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => handleEditEntry(entry)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="Bearbeiten"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry._id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Löschen"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                        
                        {/* Average Mood Display */}
                        {avgMood && avgMood > 0 && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {avgMood.toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Ø Stimmung</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>      )}
      
      {/* Edit Modal */}
      {showEditModal && editingEntry && (
        <EditMoodEntry
          entry={editingEntry}
          onSave={handleSaveEditedEntry}
          onCancel={handleCancelEdit}
        />
      )}
      
    </Layout>
  );
};

export default TrainerMood;
