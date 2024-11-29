import React, { useState } from 'react';
import { MdClose, MdDelete } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';

const AddEditExercise = ({ exerciseData, type, getAllExercises, onClose, showToastMessage }) => {
  const [title, setTitle] = useState(exerciseData?.title || '');
  const [organisation, setOrganisation] = useState(exerciseData?.organisation || '');
  const [durchfuehrung, setDurchfuehrung] = useState(exerciseData?.durchfuehrung || '');
  const [coaching, setCoaching] = useState(exerciseData?.coaching || '');
  const [variante, setVariante] = useState(exerciseData?.variante || '');
  const [tags, setTags] = useState(exerciseData?.tags || []);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      if (!tags.includes(e.target.value.trim())) {
        setTags([...tags, e.target.value.trim()]);
        e.target.value = '';
      }
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const addNewExercise = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('organisation', organisation);
      formData.append('durchfuehrung', durchfuehrung);
      formData.append('coaching', coaching);
      formData.append('variante', variante);
      formData.append('tags', tags.join(','));
      if (image) {
        formData.append('image', image);
      }

      const response = await axiosInstance.post('/add-exercise', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.exercise) {
        showToastMessage('Exercise Added Successfully');
        getAllExercises();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
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
      formData.append('coaching', coaching);
      formData.append('variante', variante);
      formData.append('tags', tags.join(','));
      if (image) {
        formData.append('image', image);
      }

      const response = await axiosInstance.put(`/edit-exercise/${exerciseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.exercise) {
        showToastMessage('Exercise Updated Successfully');
        getAllExercises();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  const handleSubmit = () => {
    if (!title || !organisation || !durchfuehrung || !coaching || !variante) {
      setError('Please fill in all fields.');
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
    <div className="relative mx-auto">
      {/* Close Button */}
      <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50" onClick={onClose}>
        <MdClose className="text-xl text-slate-400" />
      </button>

      {/* Title Input */}
      <div className="flex flex-col gap-2 mb-4">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none w-full"
          placeholder="Please insert title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Main Content Containers */}
      <div className="grid grid-cols-2 gap-8 mt-4">
        {/* Image Upload */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
          <label className="input-label mb-2">UPLOAD IMAGE</label>
          {image ? (
            <div className="flex flex-col items-center">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-full h-80 object-cover rounded mb-4"
              />
              <button
                className="flex items-center gap-2 text-red-500 text-sm hover:underline"
                onClick={handleImageRemove}
              >
                <MdDelete className="text-lg" />
                Remove Image
              </button>
            </div>
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="imageUpload"
              />
              <label htmlFor="imageUpload" className="cursor-pointer text-blue-500 underline">
                Choose a file
              </label>
            </>
          )}
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-6">
          {/* Organisation */}
          <div className="flex flex-col gap-2">
            <label className="input-label">ORGANISATION</label>
            <textarea
              rows={4}
              className="text-sm text-slate-950 outline-none bg-slate-50 p-3 rounded w-full"
              placeholder="Describe the organisation setup..."
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
            />
          </div>

          {/* Durchführung */}
          <div className="flex flex-col gap-2">
            <label className="input-label">DURCHFÜHRUNG</label>
            <textarea
              rows={4}
              className="text-sm text-slate-950 outline-none bg-slate-50 p-3 rounded w-full"
              placeholder="Describe how the exercise is conducted..."
              value={durchfuehrung}
              onChange={(e) => setDurchfuehrung(e.target.value)}
            />
          </div>

          {/* Coaching */}
          <div className="flex flex-col gap-2">
            <label className="input-label">COACHING</label>
            <textarea
              rows={4}
              className="text-sm text-slate-950 outline-none bg-slate-50 p-3 rounded w-full"
              placeholder="Coaching points or instructions..."
              value={coaching}
              onChange={(e) => setCoaching(e.target.value)}
            />
          </div>

          {/* Variante */}
          <div className="flex flex-col gap-2">
            <label className="input-label">VARIANTE</label>
            <textarea
              rows={4}
              className="text-sm text-slate-950 outline-none bg-slate-50 p-3 rounded w-full"
              placeholder="Possible variations or adjustments..."
              value={variante}
              onChange={(e) => setVariante(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tags Input */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">TAGS</label>
        <div className="flex items-center gap-2 flex-wrap bg-slate-50 p-2 rounded">
          {tags.map((tag) => (
            <div key={tag} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded">
              <span>{tag}</span>
              <button onClick={() => handleRemoveTag(tag)} className="text-blue-600 hover:text-blue-800">
                <MdClose className="text-sm" />
              </button>
            </div>
          ))}
          <input
            type="text"
            className="flex-grow outline-none bg-transparent"
            placeholder="Add a tag and press Enter"
            onKeyDown={handleAddTag}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      {/* Submit Button */}
      <button
        className="btn-primary font-medium text-xs mt-5 p-3 w-full"
        onClick={handleSubmit}
      >
        {type === 'edit' ? 'UPDATE' : 'ADD'}
      </button>
    </div>
  );
};

export default AddEditExercise;
