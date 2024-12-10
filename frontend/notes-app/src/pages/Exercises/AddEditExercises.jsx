import React, { useState, useEffect } from 'react';
import { MdClose, MdDelete } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
import { MdCloudUpload } from 'react-icons/md';
import { IoMdTime } from "react-icons/io";
import { IoPeopleOutline } from "react-icons/io5";
import { CiShoppingTag } from "react-icons/ci";


const AddEditExercise = ({ exerciseData, type, getAllExercises, onClose, showToastMessage }) => {
  const [title, setTitle] = useState(exerciseData?.title || "");
  const [organisation, setOrganisation] = useState(exerciseData?.organisation || "");
  const [durchfuehrung, setDurchfuehrung] = useState(exerciseData?.durchfuehrung || "");
  const [coaching, setCoaching] = useState(exerciseData?.coaching || "");
  const [variante, setVariante] = useState(exerciseData?.variante || "");
  const [duration, setDuration] = useState(exerciseData?.duration || "");
  const [players, setPlayers] = useState(exerciseData?.players || "");
  const [category, setCategory] = useState(exerciseData?.category || "");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  
 
  const [imagePreview, setImagePreview] = useState(exerciseData?.image || null);

  useEffect(() => {
    // Wenn wir im "edit"-Modus sind und ein Bild bereits vorhanden ist
    if (exerciseData?.image) {
      setImagePreview(exerciseData.imageUrl);
    }
  }, [exerciseData]);

  // Neue Exercise hinzufügen
  const addNewExercise = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('organisation', organisation);
    formData.append('durchfuehrung', durchfuehrung);
    formData.append('coaching', coaching);
    formData.append('variante', variante);
    formData.append('duration', duration);
    formData.append('players', players);
    formData.append("category", category);


    if (image) {
      formData.append('image', image); // Bild anhängen
    }

    try {
      const response = await axiosInstance.post("/add-exercise", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.error === false) {
        showToastMessage("Exercise Added Successfully");
        getAllExercises();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }
  };

  // Exercise bearbeiten
  const editExercise = async () => {
    const exerciseId = exerciseData._id;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('organisation', organisation);
    formData.append('durchfuehrung', durchfuehrung);
    formData.append('coaching', coaching);
    formData.append('variante', variante);
    formData.append('duration', duration);
    formData.append('players', players);
    formData.append("category", category);


    if (image) {
      formData.append('image', image); // Bild anhängen
    }

    try {
      const response = await axiosInstance.put(`/edit-exercise/${exerciseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.exercise) {
        showToastMessage("Exercise Updated Successfully");
        getAllExercises();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
    }

    console.log(players);
  };

  // Eingaben validieren und weiterleiten
  const handleAddExercise = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!organisation) {
      setError("Please enter the organisation");
      return;
    }

    if (!durchfuehrung) {
      setError("Please enter the durchfuehrung");
      return;
    }

    if (!coaching) {
      setError("Please enter the coaching");
      return;
    }

    setError("");

    if (type === "edit") {
      editExercise();
    } else {
      addNewExercise();
    }
  };

  // Bildänderung behandeln
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Vorschau des Bildes
    }
  };

  // Bild entfernen
  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
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
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      {/* Duration Input*/}
      <div className='flex items-center gap-2 m7-2'>
        <IoMdTime className='text-lg text-slate-600' />
        <input
          type="text"
          className='text-sm text-slate-600 w-48'
          placeholder="Please insert duration"
          value={duration}
          onChange={({ target }) => setDuration(target.value)}
        />

        {/* Number of Players */}
        <IoPeopleOutline className='text-lg text-slate-600' />
        <input
          type="text"
          className='text-sm text-slate-600 w-64'
          placeholder='Pease insert number of Players'
          value={players}
          onChange={({ target }) => setPlayers(target.value)}
        />

        {/* Category*/}
        <CiShoppingTag className='text-lg text-slate-600' />
        <select
          className="text-sm text-slate-600 w-64"
          value={category}
          onChange={({ target }) => setCategory(target.value)}
        >
          <option value="" disabled>
            Please select a category
          </option>
          <option value="Standard">Standard</option>
          <option value="Eigener Ballbesitz">Eigener Ballbesitz</option>
          <option value="Gegnerischer Ballbesitz">Gegnerischer Ballbesitz</option>
          <option value="Umschalten b. Ballverlust">Umschalten b. Ballverlust</option>
          <option value="Umschalten b. Ballgewinn">Umschalten b. Ballgewinn</option>
        </select>

      </div>




      {/* Main Content Containers */}
      <div className="grid grid-cols-2 gap-8 mt-4">
        {/* Image Upload */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
          {imagePreview ? (
            <form className="flex flex-col items-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full object-cover rounded mb-4"
              />
              <button
                className="flex items-center gap-2 text-red-500 text-sm hover:underline"
                onClick={handleImageRemove}
              >
                <MdDelete className="text-lg" />
                Remove Image
              </button>
            </form>
          ) : (
            <>
              <input
                type="file"
                name="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="imageUpload"
              />
              <MdCloudUpload size={64} className="text-blue-500" />
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
              onChange={({ target }) => setOrganisation(target.value)}
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
              onChange={({ target }) => setDurchfuehrung(target.value)}
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
              onChange={({ target }) => setCoaching(target.value)}
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
              onChange={({ target }) => setVariante(target.value)}
            />
          </div>
        </div>
      </div>


      {/* Error Message */}
      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      {/* Submit Button */}
      <button className='btn-primary font-medium text-xs mt-5 p-3' onClick={handleAddExercise}>
        {type === 'edit' ? 'UPDATE' : 'ADD'}
      </button>

    </div>
  );
};

export default AddEditExercise;
