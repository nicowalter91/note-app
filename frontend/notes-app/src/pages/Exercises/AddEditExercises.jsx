import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaTrashAlt, FaImage, FaTag, FaSave, FaPen, FaUpload, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { MdCategory, MdSportsSoccer, MdPhotoLibrary, MdOutlineInfo } from 'react-icons/md';
import { BiDetail } from 'react-icons/bi';
import axiosInstance from '../../utils/axiosInstance';

const AddEditExercise = ({ exerciseData, type, getAllExercises, onClose, showToastMessage }) => {  
  const [title, setTitle] = useState(exerciseData?.title || '');
  const [organisation, setOrganisation] = useState(exerciseData?.organisation || '');
  const [durchfuehrung, setDurchfuehrung] = useState(exerciseData?.durchfuehrung || '');
  const [coaching, setCoaching] = useState(exerciseData?.coaching || '');
  const [variante, setVariante] = useState(exerciseData?.variante || '');
  const [tags, setTags] = useState(exerciseData?.tags || []);
  const [category, setCategory] = useState(exerciseData?.category || 'Allgemein');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [activeSection, setActiveSection] = useState('info'); // 'info', 'details', 'media'
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const fileInputRef = useRef(null);

  // Form validation function
  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = 'Titel ist erforderlich';
    if (!organisation.trim()) errors.organisation = 'Organisation ist erforderlich';
    if (!durchfuehrung.trim()) errors.durchfuehrung = 'Durchführung ist erforderlich';
    if (!coaching.trim()) errors.coaching = 'Coaching ist erforderlich';
    if (!variante.trim()) errors.variante = 'Variante ist erforderlich';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Verfügbare Kategorien mit Emojis
  const categories = [
    { id: 'Allgemein', label: 'Allgemein', emoji: '📋' },
    { id: 'Technik', label: 'Technik', emoji: '⚽' }, 
    { id: 'Taktik', label: 'Taktik', emoji: '🧠' },
    { id: 'Kondition', label: 'Kondition', emoji: '💪' },
    { id: 'Koordination', label: 'Koordination', emoji: '🤸' },
    { id: 'Torwart', label: 'Torwart', emoji: '🥅' },
    { id: 'Aufwärmen', label: 'Aufwärmen', emoji: '🏃' },
    { id: 'Abschluss', label: 'Abschluss', emoji: '🎯' },
    { id: 'Passspiel', label: 'Passspiel', emoji: '👥' },
    { id: 'Verteidigung', label: 'Verteidigung', emoji: '🛡️' },
    { id: 'Angriff', label: 'Angriff', emoji: '⚡' },
    { id: 'Standards', label: 'Standards', emoji: '📐' },
    { id: 'Spielformen', label: 'Spielformen', emoji: '🎮' }
  ];
    // Kategorie-Farbmapping
  const categoryColors = {
    'Allgemein': 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
    'Technik': 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
    'Taktik': 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100',
    'Kondition': 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100',
    'Koordination': 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100',
    'Torwart': 'bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
    'Aufwärmen': 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100',
    'Abschluss': 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100',
    'Passspiel': 'bg-cyan-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100',
    'Verteidigung': 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
    'Angriff': 'bg-pink-50 text-pink-800 border-pink-200 hover:bg-pink-100',
    'Standards': 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100',
    'Spielformen': 'bg-violet-50 text-violet-800 border-violet-200 hover:bg-violet-100'
  };
    // Set image preview if exercise data has an image
  useEffect(() => {
    if (exerciseData?.image) {
      setImagePreview(`/uploads/exercises/${exerciseData.image}`);
    }
  }, [exerciseData]);

  // Validate form when fields change
  useEffect(() => {
    if (formTouched) {
      validateForm();
    }
  }, [title, organisation, durchfuehrung, coaching, variante, formTouched]);

  const handleInputChange = (setter, value, field) => {
    setter(value);
    setFormTouched(true);
    // Clear the specific error when the field is changed
    if (formErrors[field]) {
      setFormErrors(prev => ({...prev, [field]: null}));
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Die Bildgröße darf 5MB nicht überschreiten.');
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Nur JPG, PNG, GIF und WebP Bilder sind erlaubt.');
        return;
      }
      
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Use the same validation as in handleImageChange
      if (file.size > 5 * 1024 * 1024) {
        setError('Die Bildgröße darf 5MB nicht überschreiten.');
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Nur JPG, PNG, GIF und WebP Bilder sind erlaubt.');
        return;
      }
      
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };
  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag) {
      if (!tags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
        setTagInput('');
      } else {
        // Show a temporary error for duplicate tag
        const tagInput = document.getElementById('tagInput');
        if (tagInput) {
          tagInput.classList.add('border-red-500');
          setTimeout(() => {
            tagInput.classList.remove('border-red-500');
          }, 1500);
        }
      }
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };
    // Speichern von Übungen (neu oder bearbeitet)
  const saveExercise = async () => {
    setFormTouched(true);
    const isValid = validateForm();
    
    if (!isValid) {
      // Scroll to first error and show the appropriate tab
      const firstErrorField = Object.keys(formErrors)[0];
      
      // Map fields to tabs
      const fieldToTabMap = {
        title: 'info',
        organisation: 'info',
        durchfuehrung: 'info',
        coaching: 'details',
        variante: 'details'
      };
      
      // Switch to the tab containing the first error
      if (fieldToTabMap[firstErrorField]) {
        setActiveSection(fieldToTabMap[firstErrorField]);
      }
      
      setError('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('organisation', organisation);
      formData.append('durchfuehrung', durchfuehrung);
      formData.append('coaching', coaching);      
      formData.append('variante', variante);
      formData.append('tags', tags.join(','));
      formData.append('category', category);
      
      if (image) {
        formData.append('image', image);
      }

      let response;
      
      if (type === 'edit') {
        const exerciseId = exerciseData._id;
        response = await axiosInstance.put(`/edit-exercise/${exerciseId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (response.data && response.data.exercise) {
          showToastMessage('Übung erfolgreich aktualisiert');
        }
      } else {
        response = await axiosInstance.post('/add-exercise', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (response.data && response.data.exercise) {
          showToastMessage('Übung erfolgreich hinzugefügt');
        }
      }
      
      await getAllExercises();
      onClose();
    } catch (error) {
      console.error('Error saving exercise:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Vorbereitung der Überschrift für das Formular
  const formTitle = type === 'edit' 
    ? 'Übung bearbeiten' 
    : 'Neue Übung hinzufügen';
  return (
    <div className="w-full shadow-xl rounded-xl overflow-hidden bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-5 text-white rounded-t-xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full shadow-md">
            <MdSportsSoccer className="text-blue-700 text-2xl" />
          </div>
          <h2 className="text-xl font-bold">{formTitle}</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-blue-600 rounded-full transition-colors"
          aria-label="Schließen"
        >
          <FaTimes className="text-white" />
        </button>
      </div>
      
      {/* Navigation Tabs */}
      <div className="bg-white border-b flex">
        <button 
          onClick={() => setActiveSection('info')}
          className={`px-5 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeSection === 'info' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <MdOutlineInfo size={16} />
          Grundinfo
        </button>
        <button 
          onClick={() => setActiveSection('details')}
          className={`px-5 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeSection === 'details' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <BiDetail size={16} />
          Details
        </button>
        <button 
          onClick={() => setActiveSection('media')}
          className={`px-5 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
            activeSection === 'media' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <MdPhotoLibrary size={16} />
          Medien & Tags
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 mx-6 mt-4 rounded-lg flex items-center border border-red-200 animate-fadeIn">
          <FaExclamationTriangle className="mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}      <div className="p-6">
        {/* Form Section: Basic Info */}
        {activeSection === 'info' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Titel *</label>
              <input
                type="text"
                className={`w-full p-3 border ${formErrors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="Titel der Übung"
                value={title}
                onChange={(e) => handleInputChange(setTitle, e.target.value, 'title')}
              />
              {formErrors.title && (
                <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Organisation *</label>
              <textarea
                rows={4}
                className={`w-full p-3 border ${formErrors.organisation ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="Beschreiben Sie die Organisation der Übung..."
                value={organisation}
                onChange={(e) => handleInputChange(setOrganisation, e.target.value, 'organisation')}
              />
              {formErrors.organisation && (
                <p className="text-red-500 text-xs mt-1">{formErrors.organisation}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Durchführung *</label>
              <textarea
                rows={4}
                className={`w-full p-3 border ${formErrors.durchfuehrung ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="Beschreiben Sie die Durchführung der Übung..."
                value={durchfuehrung}
                onChange={(e) => handleInputChange(setDurchfuehrung, e.target.value, 'durchfuehrung')}
              />
              {formErrors.durchfuehrung && (
                <p className="text-red-500 text-xs mt-1">{formErrors.durchfuehrung}</p>
              )}
            </div>
          </div>
        )}
          {/* Form Section: Details */}
        {activeSection === 'details' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Coaching *</label>
              <textarea
                rows={4}
                className={`w-full p-3 border ${formErrors.coaching ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="Coaching-Punkte oder Anweisungen..."
                value={coaching}
                onChange={(e) => handleInputChange(setCoaching, e.target.value, 'coaching')}
              />
              {formErrors.coaching && (
                <p className="text-red-500 text-xs mt-1">{formErrors.coaching}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Variante *</label>
              <textarea
                rows={4}
                className={`w-full p-3 border ${formErrors.variante ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                placeholder="Mögliche Variationen oder Anpassungen..."
                value={variante}
                onChange={(e) => handleInputChange(setVariante, e.target.value, 'variante')}
              />
              {formErrors.variante && (
                <p className="text-red-500 text-xs mt-1">{formErrors.variante}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`py-2 px-3 rounded-lg border flex items-center gap-2 transition-all ${
                      category === cat.id 
                        ? `${categoryColors[cat.id]} shadow-sm transform scale-105` 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    <span className="text-sm">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
          {/* Form Section: Media & Tags */}
        {activeSection === 'media' && (
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <FaImage className="text-blue-500" /> Bild hochladen
              </h3>
              {imagePreview ? (
                <div className="space-y-3">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-inner">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors"
                      onClick={handleImageRemove}
                    >
                      <FaTrashAlt size={12} /> Bild entfernen
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FaUpload size={12} /> Ersetzen
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="imageUpload"
                    />
                  </div>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 bg-blue-50 rounded-full">
                      <FaImage className="text-blue-500 text-3xl" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">
                        Ziehen Sie ein Bild hierher oder
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="imageUpload"
                      />
                      <label 
                        htmlFor="imageUpload" 
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-100 transition-colors inline-block"
                      >
                        Datei auswählen
                      </label>
                    </div>
                    <p className="text-xs text-gray-400">
                      Max. 5MB (JPG, PNG, GIF, WebP)
                    </p>
                  </div>
                </div>
              )}
            </div>            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <FaTag className="text-blue-500" /> Tags
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-3 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-lg shadow-inner">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <div 
                      key={tag} 
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-blue-100 transition-colors"
                    >
                      <span className="text-sm">{tag}</span>
                      <button 
                        onClick={() => handleRemoveTag(tag)} 
                        className="text-blue-500 hover:text-blue-700 focus:outline-none"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 py-2">Keine Tags hinzugefügt. Tags helfen dabei, Übungen leichter zu finden.</p>
                )}
              </div>
              
              <div className="flex items-center">
                <div className="relative flex-grow">
                  <input
                    id="tagInput"
                    type="text"
                    className="w-full p-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tag hinzufügen"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <FaTag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <button
                  className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={handleAddTag}
                >
                  Hinzufügen
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Drücken Sie Enter, um ein Tag hinzuzufügen. Tags helfen, Übungen zu kategorisieren und leichter zu finden.
              </p>
            </div>
          </div>
        )}
      </div>
        {/* Footer with Action Buttons */}
      <div className="bg-gray-50 p-4 rounded-b-xl border-t flex justify-between items-center">
        <div className="text-xs text-gray-500">
          * Pflichtfelder
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSaving}
          >
            Abbrechen
          </button>
          <button
            className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={saveExercise}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {type === 'edit' ? 'Aktualisiere...' : 'Speichere...'}
              </>
            ) : (
              <>
                {type === 'edit' ? <FaPen size={14} /> : <FaSave size={14} />}
                {type === 'edit' ? 'Aktualisieren' : 'Speichern'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditExercise;
