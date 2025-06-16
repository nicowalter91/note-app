import React, { useState, useEffect } from 'react';
import { FaTimes, FaTrashAlt, FaImage, FaTag } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';

const AddEditExercise = ({ exerciseData, type, getAllExercises, onClose, showToastMessage }) => {  const [title, setTitle] = useState(exerciseData?.title || '');
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

  // Verfügbare Kategorien
  const categories = [
    'Allgemein',
    'Technik', 
    'Taktik',
    'Kondition',
    'Koordination',
    'Torwart',
    'Aufwärmen',
    'Abschluss',
    'Passspiel',
    'Verteidigung',
    'Angriff',
    'Standards',
    'Spielformen'
  ];
  
  // Set image preview if exercise data has an image
  useEffect(() => {
    if (exerciseData?.image) {
      setImagePreview(`/uploads/exercises/${exerciseData.image}`);
    }
  }, [exerciseData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };
  const addNewExercise = async () => {
    console.log('=== addNewExercise called ===');
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('organisation', organisation);
      formData.append('durchfuehrung', durchfuehrung);
      formData.append('coaching', coaching);      formData.append('variante', variante);
      formData.append('tags', tags.join(','));
      formData.append('category', category);
      if (image) {
        formData.append('image', image);
      }

      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axiosInstance.post('/add-exercise', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Add exercise response:', response.data);

      if (response.data && response.data.exercise) {
        showToastMessage('Übung erfolgreich hinzugefügt');
        console.log('Calling getAllExercises to refresh list...');
        await getAllExercises();
        onClose();
      }
    } catch (error) {
      console.error('Error adding exercise:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    }
  };

  const editExercise = async () => {
    const exerciseId = exerciseData._id;

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('organisation', organisation);
      formData.append('durchfuehrung', durchfuehrung);
      formData.append('coaching', coaching);      formData.append('variante', variante);
      formData.append('tags', tags.join(','));
      formData.append('category', category);
      if (image) {
        formData.append('image', image);
      }

      const response = await axiosInstance.put(`/edit-exercise/${exerciseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.exercise) {
        showToastMessage('Übung erfolgreich aktualisiert');
        getAllExercises();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      }
    }
  };

  const handleSubmit = () => {
    if (!title || !organisation || !durchfuehrung || !coaching || !variante) {
      setError('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    setError(null);

    if (type === 'edit') {
      editExercise();
    } else {
      addNewExercise();
    }
  };

  return (
    <div className="w-full">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center">
          <FaTimes className="mr-2" />
          {error}
        </div>
      )}      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Image Upload */}
        <div className="lg:col-span-2 space-y-3">
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Bild hochladen</h3>
              {imagePreview ? (
              <div className="space-y-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-contain rounded-lg"
                />
                <button
                  className="flex items-center gap-1 text-red-500 text-xs hover:text-red-600"
                  onClick={handleImageRemove}
                >
                  <FaTrashAlt size={12} /> Bild entfernen
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <FaImage className="text-gray-400 text-2xl" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Ziehen Sie ein Bild hierher oder
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label 
                      htmlFor="imageUpload" 
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium cursor-pointer hover:bg-blue-100"
                    >
                      Datei auswählen
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Kategorie</h3>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tags Input */}
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
            
            <div className="flex flex-wrap gap-1 mb-2 max-h-16 overflow-y-auto">
              {tags.map((tag) => (
                <div key={tag} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="text-xs">{tag}</span>
                  <button onClick={() => handleRemoveTag(tag)} className="text-blue-500 hover:text-blue-700">
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex items-center">
              <div className="relative flex-grow">
                <input
                  type="text"
                  className="w-full p-1.5 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
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
                <FaTag className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
              </div>              <button
                className="ml-2 px-2 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200"
                onClick={handleAddTag}
              >
                +
              </button>
            </div>
          </div>
        </div>
          {/* Right Column - Form Fields */}
        <div className="lg:col-span-3 space-y-3">
          {/* Title Input */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Titel</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Titel der Übung"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
            {/* Organisation */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Organisation</label>            <textarea
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Beschreiben Sie die Organisation der Übung..."
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
            />
          </div>
            {/* Durchführung */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Durchführung</label>            <textarea
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Beschreiben Sie die Durchführung der Übung..."
              value={durchfuehrung}
              onChange={(e) => setDurchfuehrung(e.target.value)}
            />
          </div>
            {/* Coaching */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Coaching</label>            <textarea
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Coaching-Punkte oder Anweisungen..."
              value={coaching}
              onChange={(e) => setCoaching(e.target.value)}
            />
          </div>
            {/* Variante */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Variante</label>            <textarea
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Mögliche Variationen oder Anpassungen..."
              value={variante}
              onChange={(e) => setVariante(e.target.value)}
            />
          </div>
        </div>
      </div>      {/* Submit Button */}
      <div className="mt-4 flex justify-end">
        <button
          className="px-6 py-2 bg-gray-800 text-white font-medium text-sm rounded-lg hover:bg-gray-700 transition-colors"
          onClick={handleSubmit}
        >
          {type === 'edit' ? 'Aktualisieren' : 'Hinzufügen'}
        </button>
      </div>
    </div>
  );
};

export default AddEditExercise;
